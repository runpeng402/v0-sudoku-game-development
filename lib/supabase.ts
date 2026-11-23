import { createClient } from "@supabase/supabase-js"

// 检查环境变量是否存在，如果不存在则使用默认值或抛出更友好的错误
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 如果环境变量不存在，创建一个空的客户端或返回 null
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: async (input, init) => {
      if (typeof input !== "string" || !input.endsWith("/auth/v1/otp") || init?.signal) {
        return fetch(input, init)
      }

      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 15000)
      try {
        return await fetch(input, { ...init, signal: controller.signal })
      } finally {
        clearTimeout(timer)
      }
    },
  },
}) : null

// Database types
export interface User {
  id: string
  email: string
  username: string
  created_at: string
  last_login_at: string
  is_guest: boolean
  preferences: {
    theme: string
    language: string
    difficulty: string
  }
}

export interface Feedback {
  id: string
  user_id?: string
  rating: number
  feedback_text: string
  email?: string
  improvements: string[]
  created_at: string
  page: string
}

export interface GameSession {
  id: string
  user_id: string
  puzzle_id: string
  difficulty: "easy" | "medium" | "hard"
  start_time: string
  end_time?: string
  completion_time?: number
  completed: boolean
  abandoned: boolean
  moves: any[]
  hints_used: number
  errors_count: number
  score?: number
  created_at: string
}

export interface UserStats {
  id: string
  user_id: string
  total_games: number
  completed_games: number
  abandoned_games: number
  best_times: {
    easy?: number
    medium?: number
    hard?: number
  }
  total_play_time: number
  current_streak: number
  longest_streak: number
  total_hints_used: number
  total_errors: number
  updated_at: string
}

// 检查 Supabase 是否可用的辅助函数
export const isSupabaseAvailable = () => {
  return supabase !== null
}
