import type { User } from "@/types"

// Mock authentication - In production, use proper auth service
export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string, role: User["role"]): Promise<User> {
    // Mock login logic
    const mockUsers: Record<string, User> = {
      "citizen@jharkhand.gov.in": {
        id: "1",
        email: "citizen@jharkhand.gov.in",
        name: "Rahul Kumar",
        role: "citizen",
        points: 450,
        level: 3,
        badges: ["first_report", "weekly_streak"],
        createdAt: new Date("2024-01-15"),
      },
      "admin.ranchi@jharkhand.gov.in": {
        id: "2",
        email: "admin.ranchi@jharkhand.gov.in",
        name: "Priya Singh",
        role: "zonal_admin",
        zone: "ranchi",
        createdAt: new Date("2023-06-01"),
      },
      "ministry.urban@jharkhand.gov.in": {
        id: "3",
        email: "ministry.urban@jharkhand.gov.in",
        name: "Dr. Amit Sharma",
        role: "ministry_admin",
        ministry: "urban_dev",
        createdAt: new Date("2023-01-01"),
      },
    }

    const user = mockUsers[email]
    if (user && user.role === role) {
      this.currentUser = user
      localStorage.setItem("civic_user", JSON.stringify(user))
      return user
    }
    throw new Error("Invalid credentials")
  }

  async register(userData: Omit<User, "id" | "createdAt">): Promise<User> {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      points: userData.role === "citizen" ? 0 : undefined,
      level: userData.role === "citizen" ? 1 : undefined,
      badges: userData.role === "citizen" ? [] : undefined,
    }

    this.currentUser = newUser
    localStorage.setItem("civic_user", JSON.stringify(newUser))
    return newUser
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem("civic_user")
      if (stored) {
        this.currentUser = JSON.parse(stored)
      }
    }
    return this.currentUser
  }

  logout(): void {
    this.currentUser = null
    localStorage.removeItem("civic_user")
  }
}
