"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Star, Clock, Target, Sparkles, Share2, RotateCcw, Play } from "lucide-react"

interface CelebrationModalProps {
  isOpen: boolean
  onClose: () => void
  onNewGame: () => void
  onNextLevel?: () => void
  gameStats: {
    time: number
    difficulty: string
    hintsUsed: number
    mistakes: number
    isPersonalBest?: boolean
  }
  gameType: "mini" | "full"
}

export function CelebrationModal({
  isOpen,
  onClose,
  onNewGame,
  onNextLevel,
  gameStats,
  gameType,
}: CelebrationModalProps) {
  const { t } = useTranslation()
  const [showConfetti, setShowConfetti] = useState(false)
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true)
      setAnimationPhase(0)

      // Animation sequence
      const timer1 = setTimeout(() => setAnimationPhase(1), 300)
      const timer2 = setTimeout(() => setAnimationPhase(2), 800)
      const timer3 = setTimeout(() => setAnimationPhase(3), 1300)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [isOpen])

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getPerformanceRating = () => {
    if (gameStats.mistakes === 0 && gameStats.hintsUsed === 0) {
      return { rating: "Perfect!", color: "text-yellow-500", stars: 3 }
    } else if (gameStats.mistakes <= 2 && gameStats.hintsUsed <= 3) {
      return { rating: "Excellent!", color: "text-green-500", stars: 2 }
    } else {
      return { rating: "Good Job!", color: "text-blue-500", stars: 1 }
    }
  }

  const performance = getPerformanceRating()

  const encouragementMessages = [
    t("celebration.messages.brilliant", "Brilliant solving!"),
    t("celebration.messages.amazing", "Amazing work!"),
    t("celebration.messages.fantastic", "Fantastic job!"),
    t("celebration.messages.outstanding", "Outstanding performance!"),
    t("celebration.messages.excellent", "Excellent puzzle solving!"),
  ]

  const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 50 }, (_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-gradient-to-r ${
                ["from-yellow-400 to-orange-500", "from-blue-400 to-purple-500", "from-green-400 to-teal-500"][i % 3]
              } rounded-full animate-bounce`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      <Card
        className={`w-full max-w-md mx-auto transform transition-all duration-500 ${
          animationPhase >= 1 ? "scale-100 opacity-100" : "scale-75 opacity-0"
        }`}
      >
        <CardContent className="p-8 text-center">
          {/* Trophy Animation */}
          <div
            className={`mb-6 transform transition-all duration-700 ${
              animationPhase >= 1 ? "scale-100 rotate-0" : "scale-0 rotate-180"
            }`}
          >
            <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4" />
            <div className="flex justify-center mb-2">
              {Array.from({ length: 3 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 mx-1 transition-all duration-300 ${
                    i < performance.stars ? "text-yellow-400 fill-current" : "text-gray-300"
                  } ${animationPhase >= 2 ? "scale-100" : "scale-0"}`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                />
              ))}
            </div>
          </div>

          {/* Success Message */}
          <div
            className={`mb-6 transform transition-all duration-500 ${
              animationPhase >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {gameType === "mini"
                ? t("celebration.miniComplete", "Mini Sudoku Complete!")
                : t("celebration.complete", "Puzzle Complete!")}
            </h2>
            <p className={`text-xl font-semibold ${performance.color} mb-2`}>{performance.rating}</p>
            <p className="text-gray-600">{randomMessage}</p>
            {gameStats.isPersonalBest && (
              <div className="flex items-center justify-center mt-2 text-green-600">
                <Sparkles className="w-4 h-4 mr-1" />
                <span className="text-sm font-semibold">{t("celebration.personalBest", "Personal Best!")}</span>
              </div>
            )}
          </div>

          {/* Game Statistics */}
          <div
            className={`mb-6 transform transition-all duration-500 ${
              animationPhase >= 3 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded-lg">
                <Clock className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                <div className="font-semibold text-blue-800">{formatTime(gameStats.time)}</div>
                <div className="text-blue-600">{t("celebration.time", "Time")}</div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <Target className="w-5 h-5 mx-auto mb-1 text-green-600" />
                <div className="font-semibold text-green-800">{gameStats.difficulty}</div>
                <div className="text-green-600">{t("celebration.difficulty", "Difficulty")}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-purple-600" />
                <div className="font-semibold text-purple-800">{gameStats.hintsUsed}</div>
                <div className="text-purple-600">{t("celebration.hints", "Hints")}</div>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <Star className="w-5 h-5 mx-auto mb-1 text-orange-600" />
                <div className="font-semibold text-orange-800">{gameStats.mistakes}</div>
                <div className="text-orange-600">{t("celebration.mistakes", "Mistakes")}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {gameType === "mini" && onNextLevel && (
              <Button
                onClick={onNextLevel}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                {t("celebration.playFull", "Try Full 9x9 Sudoku")}
              </Button>
            )}

            <div className="flex gap-2">
              <Button onClick={onNewGame} variant="default" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t("celebration.newGame", "New Game")}
              </Button>
              <Button onClick={onClose} variant="outline" className="flex-1">
                {t("celebration.continue", "Continue")}
              </Button>
            </div>

            {/* Share Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const shareText = `I just completed a ${gameStats.difficulty} Sudoku in ${formatTime(gameStats.time)}! ${performance.rating}`
                if (navigator.share) {
                  navigator.share({
                    title: "Sudoku Achievement",
                    text: shareText,
                    url: window.location.href,
                  })
                } else {
                  navigator.clipboard.writeText(shareText)
                  alert(t("celebration.copied", "Achievement copied to clipboard!"))
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-2" />
              {t("celebration.share", "Share Achievement")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
