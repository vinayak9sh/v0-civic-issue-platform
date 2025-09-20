"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TrendingUp, Crown, Medal, Award } from "lucide-react"

interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  level: number
  zone: string
  isCurrentUser?: boolean
}

interface LeaderboardWidgetProps {
  entries: LeaderboardEntry[]
  title?: string
  showZone?: boolean
}

export function LeaderboardWidget({ entries, title = "Top Contributors", showZone = true }: LeaderboardWidgetProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-50 border-yellow-200"
      case 2:
        return "bg-gray-50 border-gray-200"
      case 3:
        return "bg-amber-50 border-amber-200"
      default:
        return "bg-background"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          {title}
        </CardTitle>
        <CardDescription>Leading civic contributors in your area</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.slice(0, 10).map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-lg border ${getRankColor(entry.rank)} ${
                entry.isCurrentUser ? "ring-2 ring-primary/20" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8">{getRankIcon(entry.rank)}</div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{entry.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className={`font-medium text-sm ${entry.isCurrentUser ? "text-primary" : ""}`}>
                    {entry.name} {entry.isCurrentUser && "(You)"}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      Level {entry.level}
                    </Badge>
                    {showZone && <span className="text-xs text-muted-foreground">{entry.zone}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-primary text-sm">{entry.points}</p>
                <p className="text-xs text-muted-foreground">points</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
