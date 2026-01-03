'use client'

import { useState, useMemo } from 'react'
import type { Database } from '@/lib/supabase/types'
import Link from 'next/link'
import { format } from 'date-fns'

type Achievement = Database['public']['Tables']['achievements']['Row']

interface AchievementSearchProps {
  achievements: Achievement[]
}

export function AchievementSearch({ achievements }: AchievementSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredAchievements = useMemo(() => {
    if (!searchQuery.trim()) {
      return achievements
    }

    const query = searchQuery.toLowerCase().trim()

    return achievements.filter((achievement) => {
      // Search in raw text
      if (achievement.raw_text?.toLowerCase().includes(query)) {
        return true
      }

      // Search in STAR fields
      if (achievement.star_situation?.toLowerCase().includes(query)) {
        return true
      }
      if (achievement.star_task?.toLowerCase().includes(query)) {
        return true
      }
      if (achievement.star_action?.toLowerCase().includes(query)) {
        return true
      }
      if (achievement.star_result?.toLowerCase().includes(query)) {
        return true
      }

      // Search in category
      if (achievement.category?.toLowerCase().includes(query)) {
        return true
      }

      // Search in tags
      if (achievement.tags && achievement.tags.some((tag) => tag.toLowerCase().includes(query))) {
        return true
      }

      return false
    })
  }, [achievements, searchQuery])

  return (
    <div>
      {/* Search Input */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-zinc-400 dark:text-zinc-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search achievements by text, category, tags, or STAR fields..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <svg
                className="w-5 h-5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Found {filteredAchievements.length} of {achievements.length} achievements
          </p>
        )}
      </div>

      {/* Results */}
      {filteredAchievements.length === 0 ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-zinc-400 dark:text-zinc-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              No results found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Try adjusting your search terms or{' '}
              <button
                onClick={() => setSearchQuery('')}
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                clear your search
              </button>
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <Link
              key={achievement.id}
              href={`/dashboard/achievements/${achievement.id}`}
              className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {achievement.category && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded mb-2">
                      {achievement.category}
                    </span>
                  )}
                  <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{format(new Date(achievement.date), 'MMM d, yyyy')}</span>
                  </div>
                </div>
                {achievement.is_structured && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded">
                    STAR
                  </span>
                )}
              </div>

              <p className="text-zinc-900 dark:text-zinc-100 mb-4 line-clamp-3">
                {achievement.is_structured && achievement.star_result
                  ? achievement.star_result
                  : achievement.raw_text}
              </p>

              {achievement.tags && achievement.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {achievement.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                  {achievement.tags.length > 3 && (
                    <span className="px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400">
                      +{achievement.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


