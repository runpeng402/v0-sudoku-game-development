"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Share2, Copy } from "lucide-react"
import type { User, UserStats } from "@/services/auth-service"

interface ShareImageGeneratorProps {
  user: User
  stats: UserStats
  onClose: () => void
}

export function ShareImageGenerator({ user, stats, onClose }: ShareImageGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageUrl, setImageUrl] = useState<string>("")

  useEffect(() => {
    generateImage()
  }, [user, stats])

  const generateImage = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 800
    canvas.height = 600

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 800, 600)
    gradient.addColorStop(0, "#3B82F6")
    gradient.addColorStop(1, "#1E40AF")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 800, 600)

    // Website branding
    ctx.fillStyle = "white"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.fillText("SudokuMaster.com", 400, 50)

    // User info
    ctx.font = "bold 32px Arial"
    ctx.fillText(`${user.username}'s Sudoku Stats`, 400, 120)

    // Stats boxes
    const statsData = [
      { label: "Games Won", value: stats.completedGames.toString(), x: 150, y: 200 },
      {
        label: "Success Rate",
        value: `${Math.round((stats.completedGames / Math.max(stats.totalGames, 1)) * 100)}%`,
        x: 400,
        y: 200,
      },
      { label: "Current Streak", value: stats.currentStreak.toString(), x: 650, y: 200 },
      {
        label: "Best Easy Time",
        value: stats.bestTimes.easy ? formatTime(stats.bestTimes.easy) : "N/A",
        x: 200,
        y: 350,
      },
      {
        label: "Best Medium Time",
        value: stats.bestTimes.medium ? formatTime(stats.bestTimes.medium) : "N/A",
        x: 400,
        y: 350,
      },
      {
        label: "Best Hard Time",
        value: stats.bestTimes.hard ? formatTime(stats.bestTimes.hard) : "N/A",
        x: 600,
        y: 350,
      },
    ]

    statsData.forEach((stat) => {
      // White rounded rectangle background
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.beginPath()
      ctx.roundRect(stat.x - 80, stat.y - 40, 160, 80, 10)
      ctx.fill()

      // Stat value
      ctx.fillStyle = "#1E40AF"
      ctx.font = "bold 24px Arial"
      ctx.textAlign = "center"
      ctx.fillText(stat.value, stat.x, stat.y - 5)

      // Stat label
      ctx.font = "14px Arial"
      ctx.fillText(stat.label, stat.x, stat.y + 20)
    })

    // Achievement badges
    const achievements = getAchievementCount()
    if (achievements > 0) {
      ctx.fillStyle = "rgba(255, 215, 0, 0.9)"
      ctx.beginPath()
      ctx.roundRect(300, 450, 200, 60, 10)
      ctx.fill()

      ctx.fillStyle = "#1E40AF"
      ctx.font = "bold 20px Arial"
      ctx.textAlign = "center"
      ctx.fillText(`🏆 ${achievements} Achievements`, 400, 485)
    }

    // Footer
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
    ctx.font = "16px Arial"
    ctx.fillText("Play free sudoku puzzles online at SudokuMaster.com", 400, 550)

    // Convert to image URL
    const dataUrl = canvas.toDataURL("image/png")
    setImageUrl(dataUrl)
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const getAchievementCount = () => {
    let count = 0
    if (stats.completedGames >= 1) count++
    if (stats.completedGames >= 10) count++
    if (stats.completedGames >= 50) count++
    if (stats.currentStreak >= 5) count++
    if (stats.longestStreak >= 10) count++
    if (stats.bestTimes.hard) count++
    return count
  }

  const downloadImage = () => {
    const link = document.createElement("a")
    link.download = `${user.username}-sudoku-stats.png`
    link.href = imageUrl
    link.click()
  }

  const shareImage = async () => {
    if (navigator.share && navigator.canShare) {
      try {
        // Convert data URL to blob
        const response = await fetch(imageUrl)
        const blob = await response.blob()
        const file = new File([blob], `${user.username}-sudoku-stats.png`, { type: "image/png" })

        await navigator.share({
          title: `${user.username}'s Sudoku Stats`,
          text: `Check out my sudoku achievements on SudokuMaster.com!`,
          files: [file],
        })
      } catch (error) {
        console.error("Error sharing:", error)
        copyImageUrl()
      }
    } else {
      copyImageUrl()
    }
  }

  const copyImageUrl = () => {
    navigator.clipboard.writeText(imageUrl).then(() => {
      alert("Image URL copied to clipboard!")
    })
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Share Your Sudoku Stats</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              className="border rounded-lg shadow-lg max-w-full h-auto"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={downloadImage} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download Image
            </Button>
            <Button onClick={shareImage} variant="outline" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button onClick={copyImageUrl} variant="outline" className="flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy URL
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Share your achievements and invite friends to play sudoku!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
