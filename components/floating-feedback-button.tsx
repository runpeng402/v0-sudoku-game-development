"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquare, Heart, ThumbsUp, Lightbulb, X } from "lucide-react"
import { FeedbackModal } from "@/components/feedback-modal"

export function FloatingFeedbackButton() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [feedbackType, setFeedbackType] = useState<string>("")

  const quickFeedbackOptions = [
    { id: "love", icon: Heart, label: "Love it!", color: "text-red-500 hover:bg-red-50" },
    { id: "like", icon: ThumbsUp, label: "Good job", color: "text-green-500 hover:bg-green-50" },
    { id: "suggestion", icon: Lightbulb, label: "Suggestion", color: "text-yellow-500 hover:bg-yellow-50" },
    { id: "detailed", icon: MessageSquare, label: "Detailed feedback", color: "text-blue-500 hover:bg-blue-50" },
  ]

  const handleQuickFeedback = (type: string) => {
    if (type === "detailed") {
      setFeedbackType(type)
      setShowModal(true)
    } else {
      // Handle quick feedback submission
      console.log(`Quick feedback: ${type}`)
      // You could show a toast notification here
      alert(`Thank you for your ${type === "love" ? "love" : type === "like" ? "positive feedback" : "suggestion"}!`)
    }
    setIsExpanded(false)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {isExpanded && (
          <div className="mb-4 space-y-2">
            {quickFeedbackOptions.map((option) => (
              <div key={option.id} className="flex justify-end">
                <Button
                  onClick={() => handleQuickFeedback(option.id)}
                  variant="outline"
                  size="sm"
                  className={`bg-white shadow-lg border-gray-200 ${option.color} transition-all duration-200 hover:scale-105`}
                >
                  <option.icon className="w-4 h-4 mr-2" />
                  {option.label}
                </Button>
              </div>
            ))}
          </div>
        )}

        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
            isExpanded ? "bg-gray-600 hover:bg-gray-700 rotate-180" : "bg-blue-600 hover:bg-blue-700 hover:scale-110"
          }`}
        >
          {isExpanded ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </Button>
      </div>

      <FeedbackModal isOpen={showModal} onClose={() => setShowModal(false)} initialType={feedbackType} />
    </>
  )
}
