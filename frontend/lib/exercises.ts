import { supabase } from './supabase'
import type { Database } from './supabase'

export type Exercise = Database['public']['Tables']['exercises']['Row']
type ExerciseInsert = Database['public']['Tables']['exercises']['Insert']
type ExerciseUpdate = Database['public']['Tables']['exercises']['Update']

/**
 * Get all exercises by type
 */
export async function getExercisesByType(type: 'physical' | 'mental' | 'breathing' | 'nutrition') {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('exercise_type', type)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get all exercises
 */
export async function getAllExercises() {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get exercise by ID
 */
export async function getExerciseById(id: string) {
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Create a new exercise
 */
export async function createExercise(exercise: ExerciseInsert) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: new Error('User not authenticated') }
  }

  const { data, error } = await supabase
    .from('exercises')
    .insert({
      ...exercise,
      created_by: user.id,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Update an exercise
 */
export async function updateExercise(id: string, updates: ExerciseUpdate) {
  const { data, error } = await supabase
    .from('exercises')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Delete an exercise (soft delete by setting is_active to false)
 */
export async function deleteExercise(id: string) {
  const { data, error } = await supabase
    .from('exercises')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Search exercises
 */
export async function searchExercises(query: string, type?: string) {
  let queryBuilder = supabase
    .from('exercises')
    .select('*')
    .eq('is_active', true)

  if (type) {
    queryBuilder = queryBuilder.eq('exercise_type', type)
  }

  const { data, error } = await queryBuilder
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Track exercise completion
 */
export async function trackExerciseCompletion(
  exerciseId: string,
  durationMinutes?: number,
  notes?: string
) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: new Error('User not authenticated') }
  }

  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: user.id,
      exercise_id: exerciseId,
      duration_minutes: durationMinutes,
      notes,
    })
    .select()
    .single()

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get user progress
 */
export async function getUserProgress(userId?: string) {
  const { data: { user } } = await supabase.auth.getUser()
  const targetUserId = userId || user?.id

  if (!targetUserId) {
    return { data: null, error: new Error('User not authenticated') }
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select(`
      *,
      exercises (*)
    `)
    .eq('user_id', targetUserId)
    .order('completed_at', { ascending: false })

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}

/**
 * Get user statistics
 */
export async function getUserStats(userId?: string) {
  const { data: { user } } = await supabase.auth.getUser()
  const targetUserId = userId || user?.id

  if (!targetUserId) {
    return { data: null, error: new Error('User not authenticated') }
  }

  const { data, error } = await supabase
    .from('user_progress')
    .select('exercise_id, completed_at')
    .eq('user_id', targetUserId)

  if (error) {
    return { data: null, error }
  }

  // Calculate statistics
  const totalExercises = data.length
  const uniqueExercises = new Set(data.map(p => p.exercise_id)).size
  
  // Calculate streak (consecutive days)
  const dates = data.map(p => new Date(p.completed_at).toDateString())
  const uniqueDates = Array.from(new Set(dates)).sort().reverse()
  
  let currentStreak = 0
  const today = new Date().toDateString()
  
  if (uniqueDates.length > 0 && uniqueDates[0] === today) {
    currentStreak = 1
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1])
      const currDate = new Date(uniqueDates[i])
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        currentStreak++
      } else {
        break
      }
    }
  }

  return {
    data: {
      totalExercises,
      uniqueExercises,
      currentStreak,
      totalDays: uniqueDates.length,
    },
    error: null,
  }
}
