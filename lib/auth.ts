"use client"

export interface UserProfile {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
  lastLoginAt: string
  isGuest: boolean
}

export interface GameSession {
  id: string
  userId: string
  difficulty: "easy" | "medium" | "hard"
  startTime: string
  endTime?: string
  duration?: number // in seconds
  completed: boolean
  abandoned: boolean
  hintsUsed: number
  errorsCount: number
  moves: GameMove[]
  puzzleId: string
  score?: number
}

export interface GameMove {
  timestamp: string
  row: number
  col: number
  value: number | null
  isCorrect: boolean
  wasHint: boolean
}

export interface UserStats {
  userId: string
  totalGames: number
  gamesCompleted: number
  gamesAbandoned: number
  bestTimes: {
    easy?: number
    medium?: number
    hard?: number
  }
  averageTimes: {
    easy?: number
    medium?: number
    hard?: number
  }
  totalPlayTime: number
  currentStreak: number
  longestStreak: number
  totalHintsUsed: number
  totalErrors: number
  difficultyStats: {
    easy: { played: number; completed: number; averageTime: number }
    medium: { played: number; completed: number; averageTime: number }
    hard: { played: number; completed: number; averageTime: number }
  }
  dailyActivity: { [date: string]: number }
  weeklyActivity: { [week: string]: number }
  deviceInfo: {
    userAgent: string
    platform: string
    language: string
  }
  lastUpdated: string
}

class AuthService {
  private currentUser: UserProfile | null = null
  private currentSession: GameSession | null = null

  constructor() {
    this.loadUserFromStorage()
  }

  private loadUserFromStorage() {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("sudoku_user")
      if (userData) {
        this.currentUser = JSON.parse(userData)
      }
    }
  }

  private saveUserToStorage(user: UserProfile) {
    if (typeof window !== "undefined") {
      localStorage.setItem("sudoku_user", JSON.stringify(user))
    }
  }

  async register(username: string, email: string, password: string): Promise<UserProfile> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: UserProfile = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isGuest: false,
    }

    this.currentUser = user
    this.saveUserToStorage(user)
    this.initializeUserStats(user.id)

    return user
  }

  async login(email: string, password: string): Promise<UserProfile> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo, create a user if not exists
    const user: UserProfile = {
      id: `user_${email.replace("@", "_").replace(".", "_")}`,
      username: email.split("@")[0],
      email,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isGuest: false,
    }

    this.currentUser = user
    this.saveUserToStorage(user)

    return user
  }

  async loginAsGuest(): Promise<UserProfile> {
    const guestUser: UserProfile = {
      id: `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: "Guest Player",
      email: "",
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isGuest: true,
    }

    this.currentUser = guestUser
    return guestUser
  }

  logout() {
    this.currentUser = null
    this.currentSession = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("sudoku_user")
    }
  }

  getCurrentUser(): UserProfile | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null
  }

  canPlayDifficulty(difficulty: "easy" | "medium" | "hard"): boolean {
    if (difficulty === "easy") return true
    return this.isAuthenticated() && !this.currentUser?.isGuest
  }

  canDownloadPuzzles(): boolean {
    return this.isAuthenticated() && !this.currentUser?.isGuest
  }

  private initializeUserStats(userId: string) {
    const initialStats: UserStats = {
      userId,
      totalGames: 0,
      gamesCompleted: 0,
      gamesAbandoned: 0,
      bestTimes: {},
      averageTimes: {},
      totalPlayTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalHintsUsed: 0,
      totalErrors: 0,
      difficultyStats: {
        easy: { played: 0, completed: 0, averageTime: 0 },
        medium: { played: 0, completed: 0, averageTime: 0 },
        hard: { played: 0, completed: 0, averageTime: 0 },
      },
      dailyActivity: {},
      weeklyActivity: {},
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
      lastUpdated: new Date().toISOString(),
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(`sudoku_stats_${userId}`, JSON.stringify(initialStats))
    }
  }

  startGameSession(difficulty: "easy" | "medium" | "hard", puzzleId: string): GameSession {
    if (!this.currentUser) throw new Error("User not authenticated")

    const session: GameSession = {
      id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: this.currentUser.id,
      difficulty,
      startTime: new Date().toISOString(),
      completed: false,
      abandoned: false,
      hintsUsed: 0,
      errorsCount: 0,
      moves: [],
      puzzleId,
    }

    this.currentSession = session
    return session
  }

  recordMove(row: number, col: number, value: number | null, isCorrect: boolean, wasHint = false) {
    if (!this.currentSession) return

    const move: GameMove = {
      timestamp: new Date().toISOString(),
      row,
      col,
      value,
      isCorrect,
      wasHint,
    }

    this.currentSession.moves.push(move)

    if (!isCorrect) {
      this.currentSession.errorsCount++
    }

    if (wasHint) {
      this.currentSession.hintsUsed++
    }
  }

  endGameSession(completed: boolean, abandoned = false) {
    if (!this.currentSession || !this.currentUser) return

    this.currentSession.endTime = new Date().toISOString()
    this.currentSession.completed = completed
    this.currentSession.abandoned = abandoned

    const startTime = new Date(this.currentSession.startTime).getTime()
    const endTime = new Date(this.currentSession.endTime).getTime()
    this.currentSession.duration = Math.floor((endTime - startTime) / 1000)

    // Calculate score based on time, errors, and hints
    if (completed) {
      const baseScore = 1000
      const timeBonus = Math.max(0, 600 - this.currentSession.duration) // Bonus for completing under 10 minutes
      const errorPenalty = this.currentSession.errorsCount * 10
      const hintPenalty = this.currentSession.hintsUsed * 5
      this.currentSession.score = Math.max(0, baseScore + timeBonus - errorPenalty - hintPenalty)
    }

    this.saveGameSession(this.currentSession)
    this.updateUserStats(this.currentSession)
    this.currentSession = null
  }

  private saveGameSession(session: GameSession) {
    if (typeof window !== "undefined") {
      const sessions = this.getGameSessions()
      sessions.push(session)
      localStorage.setItem(`sudoku_sessions_${session.userId}`, JSON.stringify(sessions))
    }
  }

  getGameSessions(): GameSession[] {
    if (!this.currentUser || typeof window === "undefined") return []

    const sessionsData = localStorage.getItem(`sudoku_sessions_${this.currentUser.id}`)
    return sessionsData ? JSON.parse(sessionsData) : []
  }

  private updateUserStats(session: GameSession) {
    if (!this.currentUser || typeof window === "undefined") return

    const statsData = localStorage.getItem(`sudoku_stats_${this.currentUser.id}`)
    const stats: UserStats = statsData ? JSON.parse(statsData) : this.getDefaultStats()

    // Update basic stats
    stats.totalGames++
    if (session.completed) {
      stats.gamesCompleted++
      stats.currentStreak++
      stats.longestStreak = Math.max(stats.longestStreak, stats.currentStreak)
    } else {
      stats.gamesAbandoned++
      stats.currentStreak = 0
    }

    stats.totalHintsUsed += session.hintsUsed
    stats.totalErrors += session.errorsCount
    stats.totalPlayTime += session.duration || 0

    // Update difficulty-specific stats
    const diffStats = stats.difficultyStats[session.difficulty]
    diffStats.played++
    if (session.completed) {
      diffStats.completed++
      const newAverage =
        (diffStats.averageTime * (diffStats.completed - 1) + (session.duration || 0)) / diffStats.completed
      diffStats.averageTime = Math.round(newAverage)

      // Update best time
      if (
        !stats.bestTimes[session.difficulty] ||
        (session.duration && session.duration < stats.bestTimes[session.difficulty]!)
      ) {
        stats.bestTimes[session.difficulty] = session.duration
      }
    }

    // Update daily activity
    const today = new Date().toISOString().split("T")[0]
    stats.dailyActivity[today] = (stats.dailyActivity[today] || 0) + 1

    // Update weekly activity
    const weekStart = this.getWeekStart(new Date()).toISOString().split("T")[0]
    stats.weeklyActivity[weekStart] = (stats.weeklyActivity[weekStart] || 0) + 1

    stats.lastUpdated = new Date().toISOString()

    localStorage.setItem(`sudoku_stats_${this.currentUser.id}`, JSON.stringify(stats))
  }

  private getDefaultStats(): UserStats {
    return {
      userId: this.currentUser!.id,
      totalGames: 0,
      gamesCompleted: 0,
      gamesAbandoned: 0,
      bestTimes: {},
      averageTimes: {},
      totalPlayTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalHintsUsed: 0,
      totalErrors: 0,
      difficultyStats: {
        easy: { played: 0, completed: 0, averageTime: 0 },
        medium: { played: 0, completed: 0, averageTime: 0 },
        hard: { played: 0, completed: 0, averageTime: 0 },
      },
      dailyActivity: {},
      weeklyActivity: {},
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
      lastUpdated: new Date().toISOString(),
    }
  }

  getUserStats(): UserStats | null {
    if (!this.currentUser || typeof window === "undefined") return null

    const statsData = localStorage.getItem(`sudoku_stats_${this.currentUser.id}`)
    return statsData ? JSON.parse(statsData) : this.getDefaultStats()
  }

  private getWeekStart(date: Date): Date {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  getCurrentSession(): GameSession | null {
    return this.currentSession
  }
}

export const authService = new AuthService()
