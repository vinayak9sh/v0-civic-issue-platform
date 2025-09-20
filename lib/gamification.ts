import type { User, GamificationData } from "@/types"
import { CITIZEN_LEVELS, POINT_SYSTEM } from "./constants"

export class GamificationService {
  static calculateLevel(points: number): { level: number; levelName: string } {
    const currentLevel = CITIZEN_LEVELS.find((level) => points >= level.minPoints && points <= level.maxPoints)
    return {
      level: currentLevel?.level || 1,
      levelName: currentLevel?.name || "Newcomer",
    }
  }

  static getGamificationData(user: User): GamificationData {
    const points = user.points || 0
    const currentLevel = CITIZEN_LEVELS.find((level) => points >= level.minPoints && points <= level.maxPoints)
    const nextLevel = CITIZEN_LEVELS.find((level) => level.level === (currentLevel?.level || 1) + 1)

    return {
      points,
      level: currentLevel?.level || 1,
      levelName: currentLevel?.name || "Newcomer",
      badges: [], // This would be populated from database
      nextLevelPoints: nextLevel?.minPoints || points,
      currentLevelPoints: currentLevel?.minPoints || 0,
    }
  }

  static awardPoints(user: User, action: keyof typeof POINT_SYSTEM): number {
    const pointsAwarded = POINT_SYSTEM[action]
    const newPoints = (user.points || 0) + pointsAwarded

    // Check for level up
    const oldLevel = this.calculateLevel(user.points || 0)
    const newLevel = this.calculateLevel(newPoints)

    return pointsAwarded
  }

  static checkBadgeEligibility(user: User, reportCount: number, resolvedCount: number): string[] {
    const newBadges: string[] = []
    const currentBadges = user.badges || []

    // First Report Badge
    if (reportCount >= 1 && !currentBadges.includes("first_report")) {
      newBadges.push("first_report")
    }

    // Photo Reporter Badge
    if (reportCount >= 10 && !currentBadges.includes("photo_reporter")) {
      newBadges.push("photo_reporter")
    }

    // Resolution Tracker Badge
    if (resolvedCount >= 10 && !currentBadges.includes("resolution_tracker")) {
      newBadges.push("resolution_tracker")
    }

    // Community Leader Badge
    if ((user.points || 0) >= 1000 && !currentBadges.includes("community_leader")) {
      newBadges.push("community_leader")
    }

    return newBadges
  }

  static generateLeaderboard(users: User[]): Array<{
    rank: number
    user: User
    points: number
    level: number
  }> {
    return users
      .filter((user) => user.role === "citizen" && user.points)
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .map((user, index) => ({
        rank: index + 1,
        user,
        points: user.points || 0,
        level: this.calculateLevel(user.points || 0).level,
      }))
      .slice(0, 50) // Top 50 users
  }
}
