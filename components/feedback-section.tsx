"use client"

import type React from "react"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Star, Send, MessageSquare, Heart } from "lucide-react"

export function FeedbackSection() {
  const { t } = useTranslation()
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState("")
  const [email, setEmail] = useState("")
  const [improvements, setImprovements] = useState<string[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleRatingClick = (value: number) => {
    setRating(value)
  }

  const handleImprovementChange = (improvement: string, checked: boolean) => {
    if (checked) {
      setImprovements([...improvements, improvement])
    } else {
      setImprovements(improvements.filter((item) => item !== improvement))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Here you would normally send the feedback to your backend
    const feedbackData = {
      rating,
      feedback,
      email,
      improvements,
      timestamp: new Date().toISOString(),
      page: "homepage",
    }

    console.log("Feedback submitted:", feedbackData)
    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  const fallbackCopy: Record<string, string> = {
    "feedback.title": "Help Improve SudokuStudio",
    "feedback.subtitle": "Tell us what would make the game, guides, and printable puzzles more useful.",
    "feedback.shareExperience": "Share Your Experience",
    "feedback.shareDescription": "Your feedback helps us prioritize better puzzles, clearer rules, and faster gameplay.",
    "feedback.rateExperience": "Rate your experience",
    "feedback.improvementAreas": "What should we improve?",
    "feedback.improvements.ui": "Game layout and usability",
    "feedback.improvements.difficulty": "Difficulty balance",
    "feedback.improvements.hints": "Hints and explanations",
    "feedback.improvements.performance": "Speed and performance",
    "feedback.improvements.mobile": "Mobile experience",
    "feedback.improvements.features": "More features or puzzle types",
    "feedback.detailedFeedback": "Detailed feedback",
    "feedback.feedbackPlaceholder": "Tell us what worked, what was confusing, or what you want next.",
    "feedback.emailOptional": "Email (optional)",
    "feedback.emailPlaceholder": "you@example.com",
    "feedback.emailNote": "Only include your email if you want us to follow up.",
    "feedback.submitFeedback": "Submit Feedback",
    "feedback.submitting": "Submitting...",
    "feedback.thankYou": "Thank you for the feedback",
    "feedback.thankYouMessage": "Your note helps us make SudokuStudio better.",
    "feedback.submitAnother": "Submit another response",
    "feedback.ratingMessage.1": "Thanks. We will work on making it better.",
    "feedback.ratingMessage.2": "Thanks. Your notes can help us improve.",
    "feedback.ratingMessage.3": "Thanks for trying SudokuStudio.",
    "feedback.ratingMessage.4": "Great to hear. Tell us what would make it even better.",
    "feedback.ratingMessage.5": "Wonderful. Thanks for supporting SudokuStudio.",
  }
  const copy = (key: string) => {
    const translated = t(key)
    return translated === key ? fallbackCopy[key] || key : translated
  }

  const improvementOptions = [
    { id: "ui", label: copy("feedback.improvements.ui") },
    { id: "difficulty", label: copy("feedback.improvements.difficulty") },
    { id: "hints", label: copy("feedback.improvements.hints") },
    { id: "performance", label: copy("feedback.improvements.performance") },
    { id: "mobile", label: copy("feedback.improvements.mobile") },
    { id: "features", label: copy("feedback.improvements.features") },
  ]

  if (isSubmitted) {
    return (
      <section className="py-20 px-4 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="border-0 shadow-xl bg-white">
            <CardContent className="p-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{copy("feedback.thankYou")}</h2>
              <p className="text-xl text-gray-600 mb-6">{copy("feedback.thankYouMessage")}</p>
              <Button
                onClick={() => setIsSubmitted(false)}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                {copy("feedback.submitAnother")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{copy("feedback.title")}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">{copy("feedback.subtitle")}</p>
        </div>

        <Card className="border-0 shadow-xl bg-white">
          <CardHeader className="text-center pb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">{copy("feedback.shareExperience")}</CardTitle>
            <CardDescription className="text-lg">{copy("feedback.shareDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900">{copy("feedback.rateExperience")}</Label>
                <div className="flex justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= (hoveredRating || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-sm text-gray-600">{copy(`feedback.ratingMessage.${rating}`)}</p>
                )}
              </div>

              {/* Improvement Areas */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-900">{copy("feedback.improvementAreas")}</Label>
                <div className="flex flex-col gap-3">
                  {improvementOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={improvements.includes(option.id)}
                        onCheckedChange={(checked) => handleImprovementChange(option.id, checked as boolean)}
                      />
                      <Label htmlFor={option.id} className="text-sm font-medium">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="space-y-4">
                <Label htmlFor="feedback" className="text-lg font-semibold text-gray-900">
                  {copy("feedback.detailedFeedback")}
                </Label>
                <Textarea
                  id="feedback"
                  placeholder={copy("feedback.feedbackPlaceholder")}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Email (Optional) */}
              <div className="space-y-4">
                <Label htmlFor="email" className="text-lg font-semibold text-gray-900">
                  {copy("feedback.emailOptional")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={copy("feedback.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-sm text-gray-500">{copy("feedback.emailNote")}</p>
              </div>

              {/* Submit Button */}
              <div className="text-center pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting || rating === 0}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {copy("feedback.submitting")}
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      {copy("feedback.submitFeedback")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
