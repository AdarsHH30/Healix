import { createClient } from '@supabase/supabase-js'

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Type definitions for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          gif_url: string | null
          youtube_url: string
          duration: string | null
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | null
          category: string
          exercise_type: 'physical' | 'mental' | 'breathing' | 'nutrition'
          created_by: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          gif_url?: string | null
          youtube_url: string
          duration?: string | null
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | null
          category: string
          exercise_type: 'physical' | 'mental' | 'breathing' | 'nutrition'
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          gif_url?: string | null
          youtube_url?: string
          duration?: string | null
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | null
          category?: string
          exercise_type?: 'physical' | 'mental' | 'breathing' | 'nutrition'
          created_by?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          completed_at: string
          duration_minutes: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          completed_at?: string
          duration_minutes?: number | null
          notes?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          completed_at?: string
          duration_minutes?: number | null
          notes?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
