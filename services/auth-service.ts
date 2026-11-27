export interface User {
  id: string
  username: string
  email: string
  createdAt: string
  lastLoginAt: string
  isGuest?: boolean
  preferences: {
    theme: string
    language: string
    difficulty: string
  }
}

export interface GameSession {
  id: string
  userId: string
  puzzleId: string
  difficulty: "easy" | "medium" | "hard"
  startTime: string
  endTime?: string
  completionTime?: number
  completed: boolean
  abandoned: boolean
  moves: GameMove[]
  hintsUsed: number
  errorsCount: number
  score?: number
}

export interface GameMove {
  timestamp: string
  row: number
  col: number
  value: number
  isCorrect: boolean
  wasHint: boolean
  undone?: boolean
}

export interface UserStats {
  userId: string
  totalGames: number
  completedGames: number
  abandonedGames: number
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
  achievements: string[]
  dailyActivity: Record<string, number>
  weeklyActivity: Record<string, number>
  deviceInfo: {
    browser: string
    platform: string
    language: string
  }
}

class AuthService {
  private currentUser: User | null = null
  private isInitialized = false

  constructor() {
    if (typeof window !== "undefined") {
      this.initialize()
    }
  }

  private initialize() {
    const savedUser = localStorage.getItem("sudoku_user")
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser)
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("sudoku_user")
      }
    }
    this.isInitialized = true
  }

  async register(username: string, email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const user: User = {
      id: `user_${Date.now()}`,
      username,
      email,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isGuest: false,
      preferences: {
        theme: "light",
        language: "en",
        difficulty: "easy",
      },
    }

    this.currentUser = user
    if (typeof window !== "undefined") {
      localStorage.setItem("sudoku_user", JSON.stringify(user))

      // Initialize user stats
      const initialStats: UserStats = {
        userId: user.id,
        totalGames: 0,
        completedGames: 0,
        abandonedGames: 0,
        bestTimes: {},
        averageTimes: {},
        totalPlayTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalHintsUsed: 0,
        totalErrors: 0,
        achievements: [],
        dailyActivity: {},
        weeklyActivity: {},
        deviceInfo: {
          browser: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        },
      }

      localStorage.setItem(`sudoku_stats_${user.id}`, JSON.stringify(initialStats))
    }

    return user
  }

  async login(email: string, password: string): Promise<User> {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // For demo purposes, create a user if login is attempted
    const user: User = {
      id: `user_${Date.now()}`,
      username: email.split("@")[0],
      email,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isGuest: false,
      preferences: {
        theme: "light",
        language: "en",
        difficulty: "easy",
      },
    }

    this.currentUser = user
    if (typeof window !== "undefined") {
      localStorage.setItem("sudoku_user", JSON.stringify(user))
    }

    return user
  }

  logout() {
    this.currentUser = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("sudoku_user")
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && !this.currentUser.isGuest
  }

  canPlayDifficulty(_difficulty: "easy" | "medium" | "hard"): boolean {
    return true
  }

  canDownloadPuzzles(): boolean {
    return this.isAuthenticated()
  }

  canAccessLearnMore(): boolean {
    return this.isAuthenticated()
  }

  // Game session management
  startGameSession(puzzleId: string, difficulty: "easy" | "medium" | "hard"): GameSession {
    const session: GameSession = {
      id: `session_${Date.now()}`,
      userId: this.currentUser?.id || "guest",
      puzzleId,
      difficulty,
      startTime: new Date().toISOString(),
      completed: false,
      abandoned: false,
      moves: [],
      hintsUsed: 0,
      errorsCount: 0,
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(`current_session`, JSON.stringify(session))
    }
    return session
  }

  recordMove(row: number, col: number, value: number, isCorrect: boolean, wasHint = false) {
    if (typeof window === "undefined") return

    const sessionData = localStorage.getItem("current_session")
    if (!sessionData) return

    const session: GameSession = JSON.parse(sessionData)
    const move: GameMove = {
      timestamp: new Date().toISOString(),
      row,
      col,
      value,
      isCorrect,
      wasHint,
    }

    session.moves.push(move)
    if (wasHint) session.hintsUsed++
    if (!isCorrect) session.errorsCount++

    localStorage.setItem("current_session", JSON.stringify(session))
  }

  completeGameSession(completed = true) {
    if (typeof window === "undefined") return

    const sessionData = localStorage.getItem("current_session")
    if (!sessionData) return

    const session: GameSession = JSON.parse(sessionData)
    session.endTime = new Date().toISOString()
    session.completed = completed
    session.abandoned = !completed

    if (session.startTime && session.endTime) {
      session.completionTime = new Date(session.endTime).getTime() - new Date(session.startTime).getTime()
    }

    // Calculate score based on time, errors, and hints
    if (completed && session.completionTime) {
      const baseScore = 1000
      const timeBonus = Math.max(0, 300 - Math.floor(session.completionTime / 1000))
      const errorPenalty = session.errorsCount * 10
      const hintPenalty = session.hintsUsed * 5
      session.score = Math.max(0, baseScore + timeBonus - errorPenalty - hintPenalty)
    }

    // Save session to history
    const sessions = JSON.parse(localStorage.getItem("game_sessions") || "[]")
    sessions.push(session)
    localStorage.setItem("game_sessions", JSON.stringify(sessions))

    // Update user stats
    this.updateUserStats(session)

    // Clear current session
    localStorage.removeItem("current_session")

    return session
  }

  private updateUserStats(session: GameSession) {
    if (!this.currentUser || typeof window === "undefined") return

    const statsKey = `sudoku_stats_${this.currentUser.id}`
    const stats: UserStats = JSON.parse(localStorage.getItem(statsKey) || "{}")

    stats.totalGames = (stats.totalGames || 0) + 1
    if (session.completed) {
      stats.completedGames = (stats.completedGames || 0) + 1

      // Update best times
      if (session.completionTime) {
        const currentBest = stats.bestTimes[session.difficulty]
        if (!currentBest || session.completionTime < currentBest) {
          stats.bestTimes[session.difficulty] = session.completionTime
        }
      }

      // Update streak
      stats.currentStreak = (stats.currentStreak || 0) + 1
      stats.longestStreak = Math.max(stats.longestStreak || 0, stats.currentStreak)
    } else {
      stats.abandonedGames = (stats.abandonedGames || 0) + 1
      stats.currentStreak = 0
    }

    stats.totalHintsUsed = (stats.totalHintsUsed || 0) + session.hintsUsed
    stats.totalErrors = (stats.totalErrors || 0) + session.errorsCount

    if (session.completionTime) {
      stats.totalPlayTime = (stats.totalPlayTime || 0) + session.completionTime
    }

    // Update daily activity
    const today = new Date().toISOString().split("T")[0]
    stats.dailyActivity = stats.dailyActivity || {}
    stats.dailyActivity[today] = (stats.dailyActivity[today] || 0) + 1

    localStorage.setItem(statsKey, JSON.stringify(stats))
  }

  getUserStats(): UserStats | null {
    if (!this.currentUser || typeof window === "undefined") return null

    const statsKey = `sudoku_stats_${this.currentUser.id}`
    const stats = localStorage.getItem(statsKey)
    return stats ? JSON.parse(stats) : null
  }

  getGameSessions(): GameSession[] {
    if (typeof window === "undefined") return []

    const sessions = localStorage.getItem("game_sessions")
    return sessions ? JSON.parse(sessions) : []
  }
}

// Create and export a singleton instance
export const authService = new AuthService()

// Also export the class for type checking
export { AuthService }
