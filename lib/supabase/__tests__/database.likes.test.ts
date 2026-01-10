import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getLikes, createLike, deleteLike, hasUserLiked, getLikeCount } from '../database'
import {
  createMockSupabaseClient,
  mockLike,
  mockProfile,
  mockSupabaseError,
} from './mocks/supabase'

// Mock the server module
vi.mock('../server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '../server'

describe('Like Operations', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient()
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
  })

  describe('getLikes', () => {
    it('should fetch likes with N+1 profile query', async () => {
      const like1 = mockLike({ user_id: 'user-1' })
      const like2 = mockLike({ id: 'like-2', user_id: 'user-2' })
      const profile1 = mockProfile({ id: 'user-1' })
      const profile2 = mockProfile({ id: 'user-2', full_name: 'User Two' })

      mockSupabase.from().mockResolvedValueOnce({
        data: [like1, like2],
        error: null,
      })

      mockSupabase.from().select().in.mockResolvedValueOnce({
        data: [profile1, profile2],
        error: null,
      })

      const result = await getLikes('ach-123')

      expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'likes')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('achievement_id', 'ach-123')
      expect(mockSupabase.from().order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'profiles')
      expect(mockSupabase.from().select).toHaveBeenCalledWith('id, full_name, avatar_url')
      expect(result.data).toHaveLength(2)
    })

    it('should return empty array when no likes', async () => {
      mockSupabase.from().mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await getLikes('ach-123')

      expect(result).toEqual({ data: [], error: null })
      expect(mockSupabase.from).toHaveBeenCalledTimes(1)
    })

    it('should handle missing profiles gracefully', async () => {
      const like = mockLike()

      mockSupabase.from().mockResolvedValueOnce({
        data: [like],
        error: null,
      })

      mockSupabase.from().select().in.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const result = await getLikes('ach-123')

      expect(result.data?.[0].profiles).toBeNull()
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await getLikes('ach-123')

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching likes:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('createLike', () => {
    it('should create like and fetch profile', async () => {
      const newLike = {
        achievement_id: 'ach-123',
        user_id: 'user-123',
      }
      const createdLike = mockLike(newLike)
      const profile = mockProfile()

      mockSupabase.from().mockResolvedValueOnce({
        data: createdLike,
        error: null,
      })

      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: profile,
        error: null,
      })

      const result = await createLike(newLike as any)

      expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'likes')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(newLike)
      expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'profiles')
      expect(result.data).toHaveProperty('profiles')
      expect(result.data?.profiles?.full_name).toBe('Test User')
    })

    it('should handle duplicate like error (unique constraint)', async () => {
      const error = mockSupabaseError({
        code: '23505',
        message: 'duplicate key value violates unique constraint "likes_achievement_id_user_id_key"',
      })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await createLike({
        achievement_id: 'ach-123',
        user_id: 'user-123',
      } as any)

      expect(consoleSpy).toHaveBeenCalledWith('Error creating like:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })

    it('should handle profile fetch failure', async () => {
      const createdLike = mockLike()

      mockSupabase.from().mockResolvedValueOnce({
        data: createdLike,
        error: null,
      })

      mockSupabase.from().select().eq().single.mockResolvedValueOnce({
        data: null,
        error: mockSupabaseError(),
      })

      const result = await createLike({
        achievement_id: 'ach-123',
        user_id: 'user-123',
      } as any)

      expect(result.data).toHaveProperty('profiles', null)
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await createLike({
        achievement_id: 'ach-123',
        user_id: 'user-123',
      } as any)

      expect(consoleSpy).toHaveBeenCalledWith('Error creating like:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('deleteLike', () => {
    it('should delete like with composite key', async () => {
      mockSupabase.from().mockResolvedValue({
        error: null,
      })

      const result = await deleteLike('ach-123', 'user-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('likes')
      expect(mockSupabase.from().delete).toHaveBeenCalled()
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('achievement_id', 'ach-123')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(result).toEqual({ error: null })
    })

    it('should handle like not found (silent success)', async () => {
      mockSupabase.from().mockResolvedValue({
        error: null,
      })

      const result = await deleteLike('non-existent-ach', 'user-123')

      expect(result).toEqual({ error: null })
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        error,
      })

      const result = await deleteLike('ach-123', 'user-123')

      expect(consoleSpy).toHaveBeenCalledWith('Error deleting like:', error)
      expect(result).toEqual({ error })

      consoleSpy.mockRestore()
    })
  })

  describe('hasUserLiked', () => {
    it('should return true when user has liked', async () => {
      const like = mockLike()

      mockSupabase.from().mockResolvedValue({
        data: like,
        error: null,
      })

      const result = await hasUserLiked('ach-123', 'user-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('likes')
      expect(mockSupabase.from().select).toHaveBeenCalledWith('id')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('achievement_id', 'ach-123')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(result).toEqual({ hasLiked: true, error: null })
    })

    it('should return false when user has not liked (PGRST116)', async () => {
      mockSupabase.from().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      })

      const result = await hasUserLiked('ach-123', 'user-123')

      // CRITICAL: PGRST116 should NOT be treated as an error
      expect(result).toEqual({ hasLiked: false, error: null })
    })

    it('should handle real errors (not PGRST116)', async () => {
      const error = mockSupabaseError({ code: 'PGRST000', message: 'Connection error' })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await hasUserLiked('ach-123', 'user-123')

      expect(consoleSpy).toHaveBeenCalledWith('Error checking like:', error)
      expect(result).toEqual({ hasLiked: false, error })

      consoleSpy.mockRestore()
    })

    it('should return false when data is null without error', async () => {
      mockSupabase.from().mockResolvedValue({
        data: null,
        error: null,
      })

      const result = await hasUserLiked('ach-123', 'user-123')

      expect(result).toEqual({ hasLiked: false, error: null })
    })
  })

  describe('getLikeCount', () => {
    it('should return count for achievement', async () => {
      mockSupabase.from().mockResolvedValue({
        count: 42,
        error: null,
      })

      const result = await getLikeCount('ach-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('likes')
      expect(mockSupabase.from().select).toHaveBeenCalledWith('*', {
        count: 'exact',
        head: true,
      })
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('achievement_id', 'ach-123')
      expect(result).toEqual({ count: 42, error: null })
    })

    it('should return 0 when no likes', async () => {
      mockSupabase.from().mockResolvedValue({
        count: 0,
        error: null,
      })

      const result = await getLikeCount('ach-123')

      expect(result).toEqual({ count: 0, error: null })
    })

    it('should return 0 on error', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        count: null,
        error,
      })

      const result = await getLikeCount('ach-123')

      expect(consoleSpy).toHaveBeenCalledWith('Error getting like count:', error)
      expect(result).toEqual({ count: 0, error })

      consoleSpy.mockRestore()
    })

    it('should handle null count as 0', async () => {
      mockSupabase.from().mockResolvedValue({
        count: null,
        error: null,
      })

      const result = await getLikeCount('ach-123')

      expect(result).toEqual({ count: 0, error: null })
    })
  })
})
