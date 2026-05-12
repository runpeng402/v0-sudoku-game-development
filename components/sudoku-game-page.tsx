"use client"

import { useState, useEffect, useCallback } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Shuffle, Clock, Lightbulb, Home, ArrowLeft, User } from "lucide-react"
import type { Theme } from "@/components/theme-selector"
import { getThemeStyles, getSeasonalTheme } from "@/lib/themes"
import { I18nProvider } from "@/components/i18n-provider"
import { HintSystem } from "@/components/hint-system"
import { ThemeSelector } from "@/components/theme-selector"
import { LanguageSelector } from "@/components/language-selector"
import { authService, type User as UserProfile } from "@/services/auth-service"
import { AuthModal } from "@/components/auth-modal"
import { UserProfile as UserProfileComponent } from "@/components/user-profile"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { CelebrationModal } from "@/components/celebration-modal"
import Link from "next/link"
import { localizedPath, type SeoLocale } from "@/lib/seo-locales"
import { generateSudokuPuzzle, type SudokuDifficulty, type SudokuGrid } from "@/lib/sudoku-generator"

type CellState = "correct" | "incorrect" | "empty" | "given"

interface SudokuGameState {
  puzzle: SudokuGrid
  solution: SudokuGrid
  userGrid: SudokuGrid
  selectedCell: [number, number] | null
  isComplete: boolean
  errors: boolean[][]
}

type HintType = "answer" | "possible" | "error" | "technique"

function SudokuGameContent() {
  const { t, i18n, ready } = useTranslation()
  const activeLocale: SeoLocale = ready && i18n.language?.startsWith("zh") ? "zh" : ready && i18n.language?.startsWith("es") ? "es" : "en"

  const [gameState, setGameState] = useState<SudokuGameState>({
    puzzle: Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
    solution: Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
    userGrid: Array(9)
      .fill(null)
      .map(() => Array(9).fill(null)),
    selectedCell: null,
    isComplete: false,
    errors: Array(9)
      .fill(null)
      .map(() => Array(9).fill(false)),
  })

  const [timer, setTimer] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>("easy")
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => getSeasonalTheme())
  const [hintsUsed, setHintsUsed] = useState(0)
  const [teachingMode, setTeachingMode] = useState(false)
  const [hintHighlights, setHintHighlights] = useState<[number, number][]>([])
  const [possibleNumbers, setPossibleNumbers] = useState<{ [key: string]: number[] }>({})
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authRequiredFor, setAuthRequiredFor] = useState<string>("")
  const [showUserProfile, setShowUserProfile] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)

  const isRTL = ready && i18n && ["ar", "he"].includes(i18n.language)
  const themeStyles = getThemeStyles(currentTheme)

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setCurrentUser(user)
    }
  }, [])

  const checkAuthForDifficulty = (difficulty: SudokuDifficulty) => {
    if (difficulty === "easy") return true

    if (!authService.canPlayDifficulty(difficulty)) {
      setAuthRequiredFor(difficulty)
      setShowAuthModal(true)
      return false
    }
    return true
  }

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && !gameState.isComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, gameState.isComplete])

  // Format timer display with localization
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    const timeString = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`

    // Use locale-specific number formatting
    if (ready && i18n && i18n.language === "ar") {
      return timeString.replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number.parseInt(d)])
    }

    return timeString
  }

  // Handle hint usage
  const handleHintUsed = (type: HintType, data: any) => {
    setHintsUsed((prev) => prev + 1)

    switch (type) {
      case "answer":
        if (data.cell && data.answer) {
          const [row, col] = data.cell
          handleCellInput(row, col, data.answer)
          setHintHighlights([data.cell])
          setTimeout(() => setHintHighlights([]), 3000)
        }
        break

      case "possible":
        if (data.cell && data.possible) {
          const key = `${data.cell[0]}-${data.cell[1]}`
          setPossibleNumbers((prev) => ({ ...prev, [key]: data.possible }))
          setTimeout(() => {
            setPossibleNumbers((prev) => {
              const newState = { ...prev }
              delete newState[key]
              return newState
            })
          }, 10000)
        }
        break

      case "technique":
        if (data.highlightCells) {
          setHintHighlights(data.highlightCells)
          setTimeout(() => setHintHighlights([]), 5000)
        }
        if (data.autoFill && data.cell && data.value) {
          const [row, col] = data.cell
          setTimeout(() => {
            handleCellInput(row, col, data.value)
          }, 1000)
        }
        break
    }
  }

  // Generate new puzzle
  const generateNewPuzzle = useCallback(() => {
    if (!checkAuthForDifficulty(difficulty)) return

    const { puzzle, solution } = generateSudokuPuzzle(difficulty)
    const puzzleId = `puzzle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    setGameState({
      puzzle,
      solution,
      userGrid: puzzle.map((row) => [...row]),
      selectedCell: null,
      isComplete: false,
      errors: Array(9)
        .fill(null)
        .map(() => Array(9).fill(false)),
    })

    setTimer(0)
    setIsTimerRunning(true)
    setHintsUsed(0)
    setHintHighlights([])
    setPossibleNumbers({})

    // Start game session if user is authenticated
    if (currentUser) {
      authService.startGameSession(puzzleId, difficulty)
    }
  }, [difficulty, currentUser])

  // Validate user input
  const validateCell = (row: number, col: number, value: number | null): boolean => {
    if (value === null) return true
    return value === gameState.solution[row][col]
  }

  // Handle cell input
  const handleCellInput = (row: number, col: number, value: number | null) => {
    if (gameState.puzzle[row][col] !== null) return // Can't modify given cells

    const newUserGrid = gameState.userGrid.map((r) => [...r])
    const newErrors = gameState.errors.map((r) => [...r])

    newUserGrid[row][col] = value
    const isCorrect = value === null || validateCell(row, col, value)
    newErrors[row][col] = value !== null && !isCorrect

    // Record move if user is authenticated
    if (currentUser && value !== null) {
      authService.recordMove(row, col, value, isCorrect)
    }

    // Check if puzzle is complete
    const isComplete = newUserGrid.every((row, r) =>
      row.every((cell, c) => cell !== null && cell === gameState.solution[r][c]),
    )

    if (isComplete) {
      setIsTimerRunning(false)
      setTimeout(() => {
        setShowCelebration(true)
      }, 500)
      // End game session
      if (currentUser) {
        authService.completeGameSession(true)
      }
    }

    setGameState((prev) => ({
      ...prev,
      userGrid: newUserGrid,
      errors: newErrors,
      isComplete,
    }))
  }

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    setGameState((prev) => ({
      ...prev,
      selectedCell: [row, col],
    }))
  }

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.selectedCell) return

      const [row, col] = gameState.selectedCell

      if (e.key >= "1" && e.key <= "9") {
        handleCellInput(row, col, Number.parseInt(e.key))
      } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        handleCellInput(row, col, null)
      } else if (e.key === "ArrowUp" && row > 0) {
        setGameState((prev) => ({ ...prev, selectedCell: [row - 1, col] }))
      } else if (e.key === "ArrowDown" && row < 8) {
        setGameState((prev) => ({ ...prev, selectedCell: [row + 1, col] }))
      } else if (e.key === "ArrowLeft" && col > 0) {
        setGameState((prev) => ({ ...prev, selectedCell: [row, col - 1] }))
      } else if (e.key === "ArrowRight" && col < 8) {
        setGameState((prev) => ({ ...prev, selectedCell: [row, col + 1] }))
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [gameState.selectedCell])

  // Reset puzzle
  const resetPuzzle = () => {
    setGameState((prev) => ({
      ...prev,
      userGrid: prev.puzzle.map((row) => [...row]),
      selectedCell: null,
      isComplete: false,
      errors: Array(9)
        .fill(null)
        .map(() => Array(9).fill(false)),
    }))
    setTimer(0)
    setIsTimerRunning(true)
    setHintsUsed(0)
    setHintHighlights([])
    setPossibleNumbers({})
  }

  // Get cell state for styling
  const getCellState = (row: number, col: number): CellState => {
    if (gameState.errors[row][col]) return "incorrect"
    if (gameState.puzzle[row][col] !== null) return "given"
    if (gameState.userGrid[row][col] !== null) return "correct"
    return "empty"
  }

  const handleAuthSuccess = (user: UserProfile) => {
    setShowAuthModal(false)
    // Update user data
    setCurrentUser(user)

    // If authentication was required for a specific difficulty, set that difficulty
    if (authRequiredFor === "medium" || authRequiredFor === "hard") {
      setDifficulty(authRequiredFor as SudokuDifficulty)
      // Generate a new puzzle with the selected difficulty
      setTimeout(() => {
        generateNewPuzzle()
      }, 100)
    }
  }

  // Generate initial puzzle on component mount
  useEffect(() => {
    generateNewPuzzle()
  }, [])

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen ${themeStyles.background} p-4 transition-all duration-300`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto">
        {/* Back to Home Button and User Info */}
        <div className="mb-4 flex justify-between items-center">
          <Link href={localizedPath(activeLocale, "/")}>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <Home className="w-4 h-4" />
              {t("common.home")}
            </Button>
          </Link>
          {currentUser ? (
            <Button variant="outline" onClick={() => setShowUserProfile(true)} className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {currentUser.username}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setAuthRequiredFor("account")
                setShowAuthModal(true)
              }}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              {t("auth.signIn")}
            </Button>
          )}
        </div>

        <Card className={`mb-6 ${themeStyles.card}`}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              Sudoku Game
              {"decoration" in themeStyles && themeStyles.decoration && (
                <span className="text-2xl">{themeStyles.decoration.split("").join(" ")}</span>
              )}
            </CardTitle>

            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="outline" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatTime(timer)}
              </Badge>
              <Badge variant={gameState.isComplete ? "default" : "secondary"}>
                {gameState.isComplete ? "Complete!" : difficulty}
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              <ThemeSelector currentTheme={currentTheme} onThemeChange={setCurrentTheme} />
              <LanguageSelector />
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Button
                variant={difficulty === "easy" ? "default" : "outline"}
                size="sm"
                onClick={() => setDifficulty("easy")}
                className={difficulty === "easy" ? themeStyles.primary : ""}
              >
                {t("game.difficulty.easy")}
              </Button>
              <Button
                variant={difficulty === "medium" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (checkAuthForDifficulty("medium")) {
                    setDifficulty("medium")
                  }
                }}
                className={difficulty === "medium" ? themeStyles.primary : ""}
              >
                {t("game.difficulty.medium")}
                {!authService.canPlayDifficulty("medium") && " 🔒"}
              </Button>
              <Button
                variant={difficulty === "hard" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (checkAuthForDifficulty("hard")) {
                    setDifficulty("hard")
                  }
                }}
                className={difficulty === "hard" ? themeStyles.primary : ""}
              >
                {t("game.difficulty.hard")}
                {!authService.canPlayDifficulty("hard") && " 🔒"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-6">
              <Button onClick={generateNewPuzzle} className={`flex items-center gap-2 ${themeStyles.primary}`}>
                <Shuffle className="w-4 h-4" />
                {t("game.newGame")}
              </Button>
              <Button onClick={resetPuzzle} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                {t("game.reset")}
              </Button>
              <Button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                variant="outline"
                className="flex items-center gap-2"
                disabled={gameState.isComplete}
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isTimerRunning ? t("game.pause") : t("game.resume")}
              </Button>
              <Button
                onClick={() => setTeachingMode(!teachingMode)}
                variant={teachingMode ? "default" : "outline"}
                className="flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                {t("hints.teachingMode")}
              </Button>
            </div>

            {/* Hint System */}
            {(teachingMode || hintsUsed > 0) && (
              <div className="mb-6">
                <HintSystem
                  puzzle={gameState.puzzle}
                  solution={gameState.solution}
                  userGrid={gameState.userGrid}
                  selectedCell={gameState.selectedCell}
                  errors={gameState.errors}
                  onHintUsed={handleHintUsed}
                  hintsUsed={hintsUsed}
                  teachingMode={teachingMode}
                  onTeachingModeToggle={() => setTeachingMode(!teachingMode)}
                />
              </div>
            )}

            {/* Sudoku Grid */}
            <div className="grid grid-cols-9 gap-0 mx-auto w-fit border-4 border-gray-800 rounded-lg overflow-hidden">
              {gameState.userGrid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const isSelected =
                    gameState.selectedCell?.[0] === rowIndex && gameState.selectedCell?.[1] === colIndex
                  const cellState = getCellState(rowIndex, colIndex)
                  const isInSameRow = gameState.selectedCell?.[0] === rowIndex
                  const isInSameCol = gameState.selectedCell?.[1] === colIndex
                  const isInSameBox =
                    gameState.selectedCell &&
                    Math.floor(gameState.selectedCell[0] / 3) === Math.floor(rowIndex / 3) &&
                    Math.floor(gameState.selectedCell[1] / 3) === Math.floor(colIndex / 3)

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-sm sm:text-base md:text-lg font-semibold
                        border border-gray-300 transition-all duration-150 relative
                        ${rowIndex % 3 === 2 && rowIndex !== 8 ? "border-b-2 border-b-gray-800" : ""}
                        ${colIndex % 3 === 2 && colIndex !== 8 ? "border-r-2 border-r-gray-800" : ""}
                        ${isSelected ? `${themeStyles.accent} ring-2 ring-blue-500` : ""}
                        ${!isSelected && (isInSameRow || isInSameCol || isInSameBox) ? "bg-blue-50" : ""}
                        ${cellState === "given" ? "bg-gray-100 text-gray-800 font-bold" : ""}
                        ${cellState === "correct" ? "bg-white text-blue-600" : ""}
                        ${cellState === "incorrect" ? "bg-red-100 text-red-600" : ""}
                        ${cellState === "empty" ? "bg-white text-gray-400" : ""}
                        ${
                          hintHighlights.some(([r, c]) => r === rowIndex && c === colIndex)
                            ? "bg-yellow-200 ring-2 ring-yellow-400"
                            : ""
                        }
                        hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500
                        ${gameState.isComplete ? "bg-green-50" : ""}
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      disabled={gameState.isComplete}
                    >
                      <div className="relative w-full h-full flex items-center justify-center">
                        {cell || ""}
                        {/* Show possible numbers */}
                        {!cell && possibleNumbers[`${rowIndex}-${colIndex}`] && (
                          <div className="absolute inset-0 grid grid-cols-3 gap-0 text-xs text-gray-400 p-0.5">
                            {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                              <div key={num} className="flex items-center justify-center text-[8px]">
                                {possibleNumbers[`${rowIndex}-${colIndex}`]?.includes(num) ? num : ""}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                }),
              )}
            </div>

            {/* Number input buttons for mobile */}
            <div className="grid grid-cols-5 gap-2 mt-6 sm:hidden">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (gameState.selectedCell) {
                      const [row, col] = gameState.selectedCell
                      handleCellInput(row, col, num)
                    }
                  }}
                  disabled={!gameState.selectedCell || gameState.isComplete}
                  className="min-w-0 flex-1"
                >
                  {num}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (gameState.selectedCell) {
                    const [row, col] = gameState.selectedCell
                    handleCellInput(row, col, null)
                  }
                }}
                disabled={!gameState.selectedCell || gameState.isComplete}
                className="col-span-1 min-w-0 flex-1"
              >
                Clear
              </Button>
            </div>

            <div className="text-center mt-4 text-sm text-gray-600 space-y-1">
              <p className="hidden sm:block">{t("game.instructions.desktop")}</p>
              <p className="sm:hidden">{t("game.instructions.mobile")}</p>
              <p>{t("game.instructions.navigation")}</p>
            </div>

            {gameState.isComplete && (
              <div className="text-center mt-4 p-4 bg-green-100 rounded-lg">
                <p className="text-green-800 font-semibold text-lg">{t("game.congratulations")}</p>
                <p className="text-green-600">Time: {formatTime(timer)}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        onNewGame={() => {
          setShowCelebration(false)
          generateNewPuzzle()
        }}
        gameStats={{
          time: timer,
          difficulty: difficulty,
          hintsUsed: hintsUsed,
          mistakes: gameState.errors.flat().filter(Boolean).length,
          isPersonalBest: false,
        }}
        gameType="full"
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        requiredFor={authRequiredFor}
      />

      {/* User Profile Modal */}
      {showUserProfile && currentUser && (
        <Dialog open={showUserProfile} onOpenChange={setShowUserProfile}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <UserProfileComponent user={currentUser} onClose={() => setShowUserProfile(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

interface SudokuGamePageProps {
  locale?: SeoLocale
}

export function SudokuGamePage({ locale = "en" }: SudokuGamePageProps) {
  return (
    <I18nProvider initialLanguage={locale}>
      <SudokuGameContent />
    </I18nProvider>
  )
}
