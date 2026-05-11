"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Star, Send } from "lucide-react"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  initialType?: string
}

export function FeedbackModal({ isOpen, onClose, initialType }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState("")
  const [email, setEmail] = useState("")
  const [category, setCategory] = useState(initialType || "general")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const feedbackData = {
      rating,
      feedback,
      email,
      category,
      timestamp: new Date().toISOString(),
      source: "floating_button",
    }

    console.log("Modal feedback submitted:", feedbackData)

    // Reset form
    setRating(0)
    setFeedback("")
    setEmail("")
    setCategory("general")
    setIsSubmitting(false)

    // Show success message
    alert("Thank you for your feedback!")
    onClose()
  }

  const categories = [
    { value: "general", label: "General Feedback" },
    { value: "bug", label: "Bug Report" },
    { value: "feature", label: "Feature Request" },
    { value: "ui", label: "User Interface" },
    { value: "performance", label: "Performance" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">Share Your Feedback</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900">Feedback Category</Label>
            <RadioGroup value={category} onValueChange={setCategory}>
              {categories.map((cat) => (
                <div key={cat.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={cat.value} id={cat.value} />
                  <Label htmlFor={cat.value} className="text-sm">
                    {cat.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-gray-900">Overall Rating</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div className="space-y-3">
            <Label htmlFor="modal-feedback" className="text-sm font-semibold text-gray-900">
              Your Feedback
            </Label>
            <Textarea
              id="modal-feedback"
              placeholder="Tell us what you think..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] resize-none"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-3">
            <Label htmlFor="modal-email" className="text-sm font-semibold text-gray-900">
              Email (Optional)
            </Label>
            <Input
              id="modal-email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !feedback.trim()} className="bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
