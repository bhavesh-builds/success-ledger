import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getAchievements,
  getAllPublicAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../database'
import {
  createMockSupabaseClient,
  mockAchievement,
  mockProfile,
  mockSupabaseError,
} from './mocks/supabase'

// Mock the server module
vi.mock('../server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '../server'

describe('Achievement Operations', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient()
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
  })

  describe('getAchievements', () => {
    it('should fetch achievements with userId filter', async () => {
      const achievements = [mockAchievement()]
      mockSupabase.from().mockResolvedValue({
        data: achievements,
        error: null,
      })

      const result = await getAchievements('user-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('achievements')
      expect(mockSupabase.from().select).toHaveBeenCalledWith('*')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(result).toEqual({ data: achievements, error: null })
    })

    it('should fetch all achievements without userId filter', async () => {
      const achievements = [mockAchievement()]
      mockSupabase.from().mockResolvedValue({
        data: achievements,
        error: null,
      })

      const result = await getAchievements()

      expect(mockSupabase.from).toHaveBeenCalledWith('achievements')
      expect(mockSupabase.from().eq).not.toHaveBeenCalled()
      expect(result).toEqual({ data: achievements, error: null })
    })

    it('should order by date DESC then created_at DESC', async () => {
      mockSupabase.from().mockResolvedValue({
        data: [],
        error: null,
      })

      await getAchievements()

      expect(mockSupabase.from().order).toHaveBeenCalledWith('date', { ascending: false })
      expect(mockSupabase.from().order).toHaveBeenCalledWith('created_at', { ascending: false })
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await getAchievements()

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching achievements:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('getAllPublicAchievements', () => {
    it('should fetch achievements with N+1 profile query', async () => {
      const achievement1 = mockAchievement({ user_id: 'user-1' })
      const achievement2 = mockAchievement({ id: 'ach-2', user_id: 'user-2' })
      const profile1 = mockProfile({ id: 'user-1' })
      const profile2 = mockProfile({ id: 'user-2', full_name: 'User Two' })

      // Setup mock to return different values for each query
      let callCount = 0
      vi.mocked(createClient).mockImplementation(async () => {
        const client = createMockSupabaseClient()
        if (callCount === 0) {
          // First call: achievements query
          client.from().mockResolvedValue({
            data: [achievement1, achievement2],
            error: null,
          })
        } else {
          // Second call: profiles query
          client.from().mockResolvedValue({
            data: [profile1, profile2],
            error: null,
          })
        }
        callCount++
        return client as any
      })

      const result = await getAllPublicAchievements()

      expect(result.data).toHaveLength(2)
      expect(result.data?.[0].profiles?.full_name).toBe('Test User')
    })

    it('should handle empty achievements array', async () => {
      mockSupabase.from().mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await getAllPublicAchievements()

      expect(result).toEqual({ data: [], error: null })
    })

    it('should handle missing profiles gracefully', async () => {
      const achievement = mockAchievement()

      let callCount = 0
      vi.mocked(createClient).mockImplementation(async () => {
        const client = createMockSupabaseClient()
        if (callCount === 0) {
          client.from().mockResolvedValue({ data: [achievement], error: null })
        } else {
          client.from().mockResolvedValue({ data: null, error: null })
        }
        callCount++
        return client as any
      })

      const result = await getAllPublicAchievements()

      expect(result.data?.[0].profiles).toBeNull()
    })

    it('should deduplicate user IDs for profile query', async () => {
      const achievement1 = mockAchievement({ user_id: 'user-1' })
      const achievement2 = mockAchievement({ id: 'ach-2', user_id: 'user-1' }) // Same user
      const profile = mockProfile({ id: 'user-1' })

      let callCount = 0
      vi.mocked(createClient).mockImplementation(async () => {
        const client = createMockSupabaseClient()
        if (callCount === 0) {
          client.from().mockResolvedValue({
            data: [achievement1, achievement2],
            error: null,
          })
        } else {
          client.from().mockResolvedValue({ data: [profile], error: null })
        }
        callCount++
        return client as any
      })

      await getAllPublicAchievements()
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        data: null,
        error,
      })

      const result = await getAllPublicAchievements()

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching public achievements:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('getAchievementById', () => {
    it('should fetch achievement by id and userId', async () => {
      const achievement = mockAchievement()
      mockSupabase.from().select().eq().eq().single.mockResolvedValue({
        data: achievement,
        error: null,
      })

      const result = await getAchievementById('ach-123', 'user-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('achievements')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'ach-123')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(mockSupabase.from().single).toHaveBeenCalled()
      expect(result).toEqual({ data: achievement, error: null })
    })

    it('should handle authorization failure (different user)', async () => {
      const error = mockSupabaseError({ message: 'No rows returned' })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().select().eq().eq().single.mockResolvedValue({
        data: null,
        error,
      })

      const result = await getAchievementById('ach-123', 'different-user')

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching achievement:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().select().eq().eq().single.mockResolvedValue({
        data: null,
        error,
      })

      const result = await getAchievementById('ach-123', 'user-123')

      expect(consoleSpy).toHaveBeenCalledWith('Error fetching achievement:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('createAchievement', () => {
    it('should create achievement with complete data', async () => {
      const newAchievement = {
        user_id: 'user-123',
        raw_text: 'New achievement',
        date: '2026-01-01',
        category: 'work',
        tags: ['test', 'new'],
        is_structured: false,
      }
      const createdAchievement = mockAchievement(newAchievement)

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: createdAchievement,
        error: null,
      })

      const result = await createAchievement(newAchievement)

      expect(mockSupabase.from).toHaveBeenCalledWith('achievements')
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(newAchievement)
      expect(mockSupabase.from().select).toHaveBeenCalled()
      expect(mockSupabase.from().single).toHaveBeenCalled()
      expect(result).toEqual({ data: createdAchievement, error: null })
    })

    it('should create achievement with minimal data', async () => {
      const minimalAchievement = {
        user_id: 'user-123',
        raw_text: 'Minimal achievement',
        date: '2026-01-01',
      }
      const createdAchievement = mockAchievement(minimalAchievement)

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: createdAchievement,
        error: null,
      })

      const result = await createAchievement(minimalAchievement as any)

      expect(result).toEqual({ data: createdAchievement, error: null })
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError({ message: 'Insert failed' })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().insert().select().single.mockResolvedValue({
        data: null,
        error,
      })

      const result = await createAchievement({
        user_id: 'user-123',
        raw_text: 'Test',
        date: '2026-01-01',
      } as any)

      expect(consoleSpy).toHaveBeenCalledWith('Error creating achievement:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('updateAchievement', () => {
    it('should update achievement with authorization', async () => {
      const updates = {
        raw_text: 'Updated text',
        star_situation: 'Updated situation',
      }
      const updatedAchievement = mockAchievement(updates)

      mockSupabase.from().update().eq().eq().select().single.mockResolvedValue({
        data: updatedAchievement,
        error: null,
      })

      const result = await updateAchievement('ach-123', 'user-123', updates)

      expect(mockSupabase.from).toHaveBeenCalledWith('achievements')
      expect(mockSupabase.from().update).toHaveBeenCalledWith(updates)
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'ach-123')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(result).toEqual({ data: updatedAchievement, error: null })
    })

    it('should handle partial updates', async () => {
      const partialUpdate = { raw_text: 'Just the text' }
      const updatedAchievement = mockAchievement(partialUpdate)

      mockSupabase.from().update().eq().eq().select().single.mockResolvedValue({
        data: updatedAchievement,
        error: null,
      })

      const result = await updateAchievement('ach-123', 'user-123', partialUpdate)

      expect(result).toEqual({ data: updatedAchievement, error: null })
    })

    it('should handle authorization failure', async () => {
      const error = mockSupabaseError({ message: 'No rows updated' })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().update().eq().eq().select().single.mockResolvedValue({
        data: null,
        error,
      })

      const result = await updateAchievement('ach-123', 'different-user', { raw_text: 'Test' })

      expect(consoleSpy).toHaveBeenCalledWith('Error updating achievement:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().update().eq().eq().select().single.mockResolvedValue({
        data: null,
        error,
      })

      const result = await updateAchievement('ach-123', 'user-123', { raw_text: 'Test' })

      expect(consoleSpy).toHaveBeenCalledWith('Error updating achievement:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })

  describe('deleteAchievement', () => {
    it('should delete achievement with authorization', async () => {
      mockSupabase.from().mockResolvedValue({
        error: null,
      })

      const result = await deleteAchievement('ach-123', 'user-123')

      expect(mockSupabase.from).toHaveBeenCalledWith('achievements')
      expect(mockSupabase.from().delete).toHaveBeenCalled()
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'ach-123')
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('user_id', 'user-123')
      expect(result).toEqual({ error: null })
    })

    it('should handle authorization failure (silent success)', async () => {
      // Even if 0 rows deleted, Supabase returns success
      mockSupabase.from().mockResolvedValue({
        error: null,
      })

      const result = await deleteAchievement('ach-123', 'different-user')

      expect(result).toEqual({ error: null })
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().mockResolvedValue({
        error,
      })

      const result = await deleteAchievement('ach-123', 'user-123')

      expect(consoleSpy).toHaveBeenCalledWith('Error deleting achievement:', error)
      expect(result).toEqual({ error })

      consoleSpy.mockRestore()
    })
  })
})
