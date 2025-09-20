// Database service for managing issues, users, and statistics
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  increment,
} from "firebase/firestore"
import { db } from "./firebase"
import type { Issue, User, Statistics } from "@/types"

export class DatabaseService {
  private static instance: DatabaseService

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  // Issue Management
  async createIssue(issueData: Omit<Issue, "id" | "createdAt" | "updatedAt">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "issues"), {
        ...issueData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // Update statistics
      await this.updateStatistics("issuesReported", 1)

      return docRef.id
    } catch (error) {
      console.error("Error creating issue:", error)
      throw error
    }
  }

  async updateIssueStatus(issueId: string, status: Issue["status"], adminId: string): Promise<void> {
    try {
      const issueRef = doc(db, "issues", issueId)
      await updateDoc(issueRef, {
        status,
        updatedAt: serverTimestamp(),
        assignedTo: adminId,
      })

      // Update statistics based on status change
      if (status === "resolved") {
        await this.updateStatistics("issuesResolved", 1)
      }
    } catch (error) {
      console.error("Error updating issue status:", error)
      throw error
    }
  }

  async getIssuesByUser(userId: string): Promise<Issue[]> {
    try {
      const q = query(collection(db, "issues"), where("reportedBy", "==", userId), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Issue,
      )
    } catch (error) {
      console.error("Error fetching user issues:", error)
      return []
    }
  }

  async getIssuesByZone(zone: string): Promise<Issue[]> {
    try {
      const q = query(collection(db, "issues"), where("zone", "==", zone), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Issue,
      )
    } catch (error) {
      console.error("Error fetching zone issues:", error)
      return []
    }
  }

  async getAllIssues(): Promise<Issue[]> {
    try {
      const q = query(collection(db, "issues"), orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Issue,
      )
    } catch (error) {
      console.error("Error fetching all issues:", error)
      return []
    }
  }

  // User Management
  async createUser(userData: Omit<User, "id">): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        ...userData,
        createdAt: serverTimestamp(),
      })
      return docRef.id
    } catch (error) {
      console.error("Error creating user:", error)
      throw error
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const q = query(collection(db, "users"), where("email", "==", email))
      const querySnapshot = await getDocs(q)
      if (querySnapshot.empty) return null

      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() } as User
    } catch (error) {
      console.error("Error fetching user by email:", error)
      return null
    }
  }

  async updateUserPoints(userId: string, points: number): Promise<void> {
    try {
      const userRef = doc(db, "users", userId)
      await updateDoc(userRef, {
        points: increment(points),
        updatedAt: serverTimestamp(),
      })
    } catch (error) {
      console.error("Error updating user points:", error)
      throw error
    }
  }

  // Statistics Management
  async getStatistics(): Promise<Statistics> {
    try {
      const docRef = doc(db, "statistics", "global")
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data() as Statistics
      } else {
        // Initialize statistics if they don't exist
        const initialStats: Statistics = {
          issuesReported: 0,
          issuesResolved: 0,
          activeUsers: 0,
          averageResolutionTime: 0,
        }
        await updateDoc(docRef, initialStats)
        return initialStats
      }
    } catch (error) {
      console.error("Error fetching statistics:", error)
      return {
        issuesReported: 0,
        issuesResolved: 0,
        activeUsers: 0,
        averageResolutionTime: 0,
      }
    }
  }

  private async updateStatistics(field: keyof Statistics, increment: number): Promise<void> {
    try {
      const statsRef = doc(db, "statistics", "global")
      await updateDoc(statsRef, {
        [field]: increment(increment),
      })
    } catch (error) {
      console.error("Error updating statistics:", error)
    }
  }

  // Real-time listeners
  subscribeToIssues(callback: (issues: Issue[]) => void): () => void {
    const q = query(collection(db, "issues"), orderBy("createdAt", "desc"))
    return onSnapshot(q, (querySnapshot) => {
      const issues = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          }) as Issue,
      )
      callback(issues)
    })
  }

  subscribeToStatistics(callback: (stats: Statistics) => void): () => void {
    const docRef = doc(db, "statistics", "global")
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as Statistics)
      }
    })
  }
}
