export interface User {
  id: string
  email: string
  name: string
  role: "citizen" | "zonal_admin" | "ministry_admin"
  zone?: string
  ministry?: string
  points?: number
  level?: number
  badges?: string[]
  createdAt: Date
}

export interface CivicIssue {
  id: string
  title: string
  description: string
  voiceNote?: string
  category: "pothole" | "streetlight" | "garbage" | "water" | "electricity" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "submitted" | "acknowledged" | "in_progress" | "resolved" | "rejected"
  location: {
    latitude: number
    longitude: number
    address: string
    zone: string
  }
  images: string[]
  reportedBy: string
  assignedTo?: string
  ministry: string
  createdAt: Date
  updatedAt: Date
  timeline: TimelineEvent[]
}

export interface TimelineEvent {
  id: string
  status: string
  message: string
  timestamp: Date
  updatedBy: string
}

export interface Zone {
  id: string
  name: string
  districts: string[]
  adminId?: string
}

export interface Ministry {
  id: string
  name: string
  departments: string[]
  adminId?: string
}

export interface GamificationData {
  points: number
  level: number
  levelName: string
  badges: Badge[]
  nextLevelPoints: number
  currentLevelPoints: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedAt: Date
}

export interface Statistics {
  issuesReported: number
  issuesResolved: number
  activeUsers: number
  averageResolutionTime: number
}

export type Issue = CivicIssue
