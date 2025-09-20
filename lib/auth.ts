import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth"
import { auth } from "./firebase"
import { DatabaseService } from "./database"
import type { User } from "@/types"

export class AuthService {
  private static instance: AuthService
  private currentUser: User | null = null
  private dbService = DatabaseService.getInstance()

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string, role: User["role"]): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user

      // Get user data from database
      const userData = await this.dbService.getUserByEmail(email)

      if (!userData) {
        throw new Error("User not found in database")
      }

      if (userData.role !== role) {
        throw new Error("Invalid role for this user")
      }

      this.currentUser = userData
      return userData
    } catch (error: any) {
      // Fallback to demo users for development
      console.log("[v0] Firebase auth failed, using demo users:", error.message)
      return this.loginDemo(email, password, role)
    }
  }

  private async loginDemo(email: string, password: string, role: User["role"]): Promise<User> {
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

  async register(userData: Omit<User, "id" | "createdAt">, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, password)
      const firebaseUser = userCredential.user

      const newUser: User = {
        ...userData,
        id: firebaseUser.uid,
        createdAt: new Date(),
        points: userData.role === "citizen" ? 0 : undefined,
        level: userData.role === "citizen" ? 1 : undefined,
        badges: userData.role === "citizen" ? [] : undefined,
      }

      // Save user to database
      await this.dbService.createUser(newUser)

      this.currentUser = newUser
      return newUser
    } catch (error: any) {
      console.error("Registration error:", error)
      throw new Error("Registration failed: " + error.message)
    }
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

  async logout(): Promise<void> {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
    }
    this.currentUser = null
    localStorage.removeItem("civic_user")
  }

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData = await this.dbService.getUserByEmail(firebaseUser.email!)
        this.currentUser = userData
        callback(userData)
      } else {
        this.currentUser = null
        callback(null)
      }
    })
  }
}
