import { supabase, isSupabaseAvailable } from "@/lib/supabase"
import type { User, Feedback, GameSession, UserStats } from "@/lib/supabase"

export class SupabaseService {
  private checkSupabaseAvailable() {
    if (!isSupabaseAvailable() || !supabase) {
      throw new Error(
        "Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
      )
    }
  }

  // User Management
  async createUser(userData: Omit<User, "id" | "created_at">) {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!.from("users").insert([userData]).select().single()

    if (error) throw error
    return data
  }

  async getUsers() {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!.from("users").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async updateUserLastLogin(userId: string) {
    this.checkSupabaseAvailable()
    const { error } = await supabase!.from("users").update({ last_login_at: new Date().toISOString() }).eq("id", userId)

    if (error) throw error
  }

  // Feedback Management
  async submitFeedback(feedbackData: Omit<Feedback, "id" | "created_at">) {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!.from("feedback").insert([feedbackData]).select().single()

    if (error) throw error
    return data
  }

  async getFeedback() {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!
      .from("feedback")
      .select(`
        *,
        users(username, email)
      `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // Game Session Management
  async createGameSession(sessionData: Omit<GameSession, "id" | "created_at">) {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!.from("game_sessions").insert([sessionData]).select().single()

    if (error) throw error
    return data
  }

  async updateGameSession(sessionId: string, updates: Partial<GameSession>) {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!.from("game_sessions").update(updates).eq("id", sessionId).select().single()

    if (error) throw error
    return data
  }

  async getUserGameSessions(userId: string) {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!
      .from("game_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  // User Stats Management
  async updateUserStats(userId: string, stats: Partial<UserStats>) {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!
      .from("user_stats")
      .upsert([{ user_id: userId, ...stats }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getUserStats(userId: string) {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!.from("user_stats").select("*").eq("user_id", userId).single()

    if (error) throw error
    return data
  }

  // Admin Dashboard Data
  async getAdminDashboardData() {
    this.checkSupabaseAvailable()

    try {
      const [users, feedback, sessions] = await Promise.all([
        this.getUsers(),
        this.getFeedback(),
        this.getAllGameSessions(),
      ])

      return {
        users,
        feedback,
        sessions,
        stats: {
          totalUsers: users?.length || 0,
          totalFeedback: feedback?.length || 0,
          totalSessions: sessions?.length || 0,
          activeUsers: users?.filter((u) => !u.is_guest).length || 0,
        },
      }
    } catch (error) {
      // 如果 Supabase 不可用，返回空数据
      return {
        users: [],
        feedback: [],
        sessions: [],
        stats: {
          totalUsers: 0,
          totalFeedback: 0,
          totalSessions: 0,
          activeUsers: 0,
        },
      }
    }
  }

  private async getAllGameSessions() {
    this.checkSupabaseAvailable()
    const { data, error } = await supabase!
      .from("game_sessions")
      .select(`
        *,
        users(username, email)
      `)
      .order("created_at", { ascending: false })
      .limit(1000)

    if (error) throw error
    return data
  }

  // 检查服务是否可用
  isAvailable() {
    return isSupabaseAvailable()
  }
}

export const supabaseService = new SupabaseService()
