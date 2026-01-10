import { describe, it, expect, vi, beforeEach } from 'vitest'
import { updateProfile } from '../database'
import { createMockSupabaseClient, mockProfile, mockSupabaseError } from './mocks/supabase'

// Mock the server module
vi.mock('../server', () => ({
  createClient: vi.fn(),
}))

import { createClient } from '../server'

describe('Profile Operations', () => {
  let mockSupabase: ReturnType<typeof createMockSupabaseClient>

  beforeEach(() => {
    mockSupabase = createMockSupabaseClient()
    vi.mocked(createClient).mockResolvedValue(mockSupabase as any)
  })

  describe('updateProfile', () => {
    it('should update profile with full data', async () => {
      const updates = {
        full_name: 'Updated Name',
        avatar_url: 'https://example.com/new-avatar.jpg',
        bio: 'New bio',
        job_title: 'Senior Engineer',
        company: 'Tech Corp',
        location: 'San Francisco',
        website: 'https://example.com',
      }
      const updatedProfile = mockProfile(updates)

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedProfile,
        error: null,
      })

      const result = await updateProfile('user-123', updates)

      expect(mockSupabase.from).toHaveBeenCalledWith('profiles')
      expect(mockSupabase.from().update).toHaveBeenCalledWith(updates)
      expect(mockSupabase.from().eq).toHaveBeenCalledWith('id', 'user-123')
      expect(mockSupabase.from().select).toHaveBeenCalled()
      expect(mockSupabase.from().single).toHaveBeenCalled()
      expect(result).toEqual({ data: updatedProfile, error: null })
    })

    it('should update profile with partial data', async () => {
      const partialUpdate = { full_name: 'Just Name' }
      const updatedProfile = mockProfile(partialUpdate)

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedProfile,
        error: null,
      })

      const result = await updateProfile('user-123', partialUpdate)

      expect(mockSupabase.from().update).toHaveBeenCalledWith(partialUpdate)
      expect(result).toEqual({ data: updatedProfile, error: null })
    })

    it('should update with null values for optional fields', async () => {
      const updates = {
        bio: null,
        job_title: null,
        company: null,
      }
      const updatedProfile = mockProfile(updates)

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: updatedProfile,
        error: null,
      })

      const result = await updateProfile('user-123', updates)

      expect(result).toEqual({ data: updatedProfile, error: null })
    })

    it('should handle user not found', async () => {
      const error = mockSupabaseError({ message: 'User not found' })
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error,
      })

      const result = await updateProfile('non-existent-user', { full_name: 'Test' })

      expect(consoleSpy).toHaveBeenCalledWith('Error updating profile:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })

    it('should handle errors', async () => {
      const error = mockSupabaseError()
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      mockSupabase.from().update().eq().select().single.mockResolvedValue({
        data: null,
        error,
      })

      const result = await updateProfile('user-123', { full_name: 'Test' })

      expect(consoleSpy).toHaveBeenCalledWith('Error updating profile:', error)
      expect(result).toEqual({ data: null, error })

      consoleSpy.mockRestore()
    })
  })
})
