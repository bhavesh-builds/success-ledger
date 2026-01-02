export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          job_title: string | null
          company: string | null
          location: string | null
          website: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          job_title?: string | null
          company?: string | null
          location?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          job_title?: string | null
          company?: string | null
          location?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          raw_text: string
          star_situation: string | null
          star_task: string | null
          star_action: string | null
          star_result: string | null
          date: string
          category: string | null
          tags: string[]
          is_structured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          raw_text: string
          star_situation?: string | null
          star_task?: string | null
          star_action?: string | null
          star_result?: string | null
          date?: string
          category?: string | null
          tags?: string[]
          is_structured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          raw_text?: string
          star_situation?: string | null
          star_task?: string | null
          star_action?: string | null
          star_result?: string | null
          date?: string
          category?: string | null
          tags?: string[]
          is_structured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      shares: {
        Row: {
          id: string
          achievement_id: string
          share_token: string
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          achievement_id: string
          share_token: string
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          achievement_id?: string
          share_token?: string
          created_at?: string
          expires_at?: string | null
        }
      }
      comments: {
        Row: {
          id: string
          achievement_id: string
          user_id: string
          content: string
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          achievement_id: string
          user_id: string
          content: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          achievement_id?: string
          user_id?: string
          content?: string
          parent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          achievement_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          achievement_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          achievement_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
  }
}

