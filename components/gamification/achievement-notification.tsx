"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trophy, Star, X } from "lucide-react"

interface Achievement {
  type: "level_up" | "badge_earned" | "points_awarded"
  title: string
  description: string
  points?: number
  badgeName?: string
  levelName?: string
}

interface AchievementNotificationProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (achievement) {
      setIsVisible(true)
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const getIcon = () => {
    switch (achievement.type) {
      case "level_up":
        return <Trophy className="h-6 w-6 text-yellow-500" />
      case "badge_earned":
        return <Star className="h-6 w-6 text-blue-500" />
      case "points_awarded":
        return (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">
            +
          </div>
        )
      default:
        return <Trophy className="h-6 w-6 text-primary" />
    }
  }

  const getColor = () => {
    switch (achievement.type) {
      case "level_up":
        return "border-yellow-500 bg-yellow-50"
      case "badge_earned":
        return "border-blue-500 bg-blue-50"
      case "points_awarded":
        return "border-green-500 bg-green-50"
      default:
        return "border-primary bg-primary/5"
    }
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <Card className={`w-80 border-2 ${getColor()} shadow-lg`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">{getIcon()}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{achievement.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                {achievement.points && (
                  <Badge variant="secondary" className="text-xs">
                    +{achievement.points} points
                  </Badge>
                )}
                {achievement.levelName && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.levelName}
                  </Badge>
                )}
                {achievement.badgeName && (
                  <Badge variant="outline" className="text-xs">
                    {achievement.badgeName}
                  </Badge>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 flex-shrink-0"
              onClick={() => {
                setIsVisible(false)
                setTimeout(onClose, 300)
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
