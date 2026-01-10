import { vi } from 'vitest'

// Type-safe mock data factories
export const mockAchievement = (overrides: any = {}) => ({
  id: 'ach-123',
  user_id: 'user-123',
  raw_text: 'Test achievement',
  star_situation: 'Test situation',
  star_task: 'Test task',
  star_action: 'Test action',
  star_result: 'Test result',
  date: '2026-01-01',
  category: 'work',
  tags: ['test'],
  is_structured: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  ...overrides,
})

export const mockProfile = (overrides: any = {}) => ({
  id: 'user-123',
  full_name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: null,
  job_title: null,
  company: null,
  location: null,
  website: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  ...overrides,
})

export const mockComment = (overrides: any = {}) => ({
  id: 'comment-123',
  achievement_id: 'ach-123',
  user_id: 'user-123',
  content: 'Test comment',
  parent_id: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  ...overrides,
})

export const mockLike = (overrides: any = {}) => ({
  id: 'like-123',
  achievement_id: 'ach-123',
  user_id: 'user-123',
  created_at: '2026-01-01T00:00:00Z',
  ...overrides,
})

export const mockShare = (overrides: any = {}) => ({
  id: 'share-123',
  achievement_id: 'ach-123',
  share_token: 'token-123',
  created_at: '2026-01-01T00:00:00Z',
  expires_at: null,
  ...overrides,
})

// Mock error factory
export const mockSupabaseError = (overrides: any = {}) => ({
  message: 'Database error',
  code: 'PGRST000',
  details: null,
  hint: null,
  ...overrides,
})

// Chainable query builder mock
export const createMockQueryBuilder = () => {
  // This will store the result that the builder should resolve to when awaited
  let queryResult: any = { data: null, error: null }
  let queryResultQueue: any[] = []

  const mockBuilder: any = {
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    in: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    single: vi.fn(),
    // Make builder thenable by implementing Promise interface
    then: vi.fn((resolve, reject) => {
      const result = queryResultQueue.length > 0 ? queryResultQueue.shift() : queryResult
      return Promise.resolve(result).then(resolve, reject)
    }),
    // Helper to set what the query should resolve to
    mockResolvedValue: (value: any) => {
      queryResult = value
      queryResultQueue = []
      return mockBuilder
    },
    // Helper to set what the query should resolve to (one time only)
    mockResolvedValueOnce: (value: any) => {
      queryResultQueue.push(value)
      return mockBuilder
    },
  }

  // Make all methods return the builder itself for chaining
  mockBuilder.select.mockReturnValue(mockBuilder)
  mockBuilder.insert.mockReturnValue(mockBuilder)
  mockBuilder.update.mockReturnValue(mockBuilder)
  mockBuilder.delete.mockReturnValue(mockBuilder)
  mockBuilder.eq.mockReturnValue(mockBuilder)
  mockBuilder.is.mockReturnValue(mockBuilder)
  mockBuilder.in.mockReturnValue(mockBuilder)
  mockBuilder.order.mockReturnValue(mockBuilder)
  mockBuilder.limit.mockReturnValue(mockBuilder)
  mockBuilder.single.mockReturnValue(mockBuilder)

  return mockBuilder
}

// Mock Supabase client
export const createMockSupabaseClient = () => {
  // Create a single builder instance that will be reused
  const mockBuilder = createMockQueryBuilder()

  // Helper to set the query result
  const setQueryResult = (result: any) => {
    mockBuilder.then.mockImplementation((resolve: any) => {
      resolve(result)
      return Promise.resolve(result)
    })
  }

  return {
    from: vi.fn(() => mockBuilder),
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signIn: vi.fn(),
      signOut: vi.fn(),
    },
    // Expose the builder for test access
    _mockBuilder: mockBuilder,
    _setQueryResult: setQueryResult,
  }
}
