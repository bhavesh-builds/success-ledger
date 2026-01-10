import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createShare, getShareByToken, deleteShare } from '../database'
import {
  createMockSupabaseClient,
  mockShare,
  mockAchievement,
  mockSupabaseError,
} from './mocks/supabase'

// Mock the server module
vi.mock('../server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '../server'

describe('Share Operations', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient()
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
  })

  describe('createShare', () => {
    it('should create share with token', async () => {
      const newShare = {
        achievement_id: 'ach-123',
        share_token: 'unique-token-123',
      }
      const createdShare = mockShare(newShare)

      mockSupabase.from().mockResolvedValue({
        data: createdShare,
        error: null,
      })

      const result = await createShare(newShare as any)

      expect(mockSupabase.from).toHaveBeenCalledWith('shares')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(newShare)
      expect(mockSupabase.from().select).toHaveBeenCalled()
      expect(mockSupabase.from().single).toHaveBeenCalled()
      expect(result).toEqual({ data: createdShare, error: null })
    })

    it('should create share with expiry date', async () => {
      const newShare = {
        achievement_id: 'ach-123',
        share_token: 'unique-token-123',
        expires_at: '2026-12-31T23:59:59Z',
      }
      const createdShare = mockShare(newShare)

      mockSupabase.from().mockResolvedValue({
        data: createdShare,
        error: null,
      })

      const result = await createShare(newShare as any)

      expect(result).toEqual({ data: createdShare, error: null })
    })

    it('should handle duplicate token error', async () => {
      const error = mockSupabaseError({
        code: '23505',
        message: 'duplicate key value violates unique constraint',
      })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await createShare({
        achievement_id: 'ach-123',
        share_token: 'duplicate-token',
      } as any)

      expect(consoleSpy).toHaveBeenCalledWith('Error creating share:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await createShare({
        achievement_id: 'ach-123',
        share_token: 'token-123',
      } as any)

      expect(consoleSpy).toHaveBeenCalledWith('Error creating share:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('getShareByToken', () => {
    it('should fetch share with nested achievement join', async () => {
      const achievement = mockAchievement()
      const share = {
        ...mockShare(),
        achievements: achievement,
      }

      mockSupabase.from().mockResolvedValue({
        data: share,
        error: null,
      })

      const result = await getShareByToken('token-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('shares')
      expect(mockSupabase.from().select).toHaveBeenCalledWith('*, achievements(*)')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('share_token', 'token-123')
      expect(mockSupabase.from().single).toHaveBeenCalled()
      expect(result.data).toHaveProperty('achievements')
      expect(result).toEqual({ data: share, error: null })
    })

    it('should handle token not found', async () => {
      const error = mockSupabaseError({ code: 'PGRST116', message: 'Not found' })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await getShareByToken('non-existent-token')

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching share:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await getShareByToken('token-123')

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching share:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('deleteShare', () => {
    it('should delete share with two-step authorization', async () => {
      const shareWithAchievement = {
        achievement_id: 'ach-123',
        achievements: { user_id: 'user-123' },
      }

      // First query: verify ownership
      mockSupabase.from().mockResolvedValueOnce({
        data: shareWithAchievement,
        error: null,
      })

      // Second query: delete
      mockSupabase.from().mockResolvedValueOnce({
        error: null,
      })

      const result = await deleteShare('share-123', 'user-123')

      expect(mockSupabase.from).toHaveBeenNthCalledWith(1, 'shares')
      expect(mockSupabase.from().select).toHaveBeenCalledWith(
        'achievement_id, achievements!inner(user_id)'
      )
      expect(mockSupabase.from).toHaveBeenNthCalledWith(2, 'shares')
      expect(mockSupabase.from().delete).toHaveBeenCalled()
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'share-123')
      expect(result).toEqual({ error: null })
    })

    it('should handle authorization failure (share not found)', async () => {
      mockSupabase.from().mockResolvedValue({
        data: null,
        error: null,
      })

      const result = await deleteShare('non-existent-share', 'user-123')

      expect(result).toEqual({ error: { message: 'Unauthorized' } })
      expect(mockSupabase.from().delete).not.toHaveBeenCalled()
    })

    it('should handle authorization failure (different user)', async () => {
      const shareWithAchievement = {
        achievement_id: 'ach-123',
        achievements: { user_id: 'different-user' },
      }

      mockSupabase.from().mockResolvedValue({
        data: shareWithAchievement,
        error: null,
      })

      const result = await deleteShare('share-123', 'user-123')

      expect(result).toEqual({ error: { message: 'Unauthorized' } })
      expect(mockSupabase.from().delete).not.toHaveBeenCalled()
    })

    it('should handle errors in verification step', async () => {
      const error = mockSupabaseError()

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await deleteShare('share-123', 'user-123')

      expect(result).toEqual({ error: { message: 'Unauthorized' } })
    })

    it('should handle errors in deletion step', async () => {
      const shareWithAchievement = {
        achievement_id: 'ach-123',
        achievements: { user_id: 'user-123' },
      }
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValueOnce({
        data: shareWithAchievement,
        error: null,
      })

      mockSupabase.from().mockResolvedValueOnce({
        error,
      })

      const result = await deleteShare('share-123', 'user-123')

      expect(consoleSpy).toHaveBeenCalledWith('Error deleting share:', error)
      expect(result).toEqual({ error })

      consoleSpy.mockRestore()
    })
  })
})
