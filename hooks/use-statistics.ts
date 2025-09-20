"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "@/lib/database"
import type { Statistics } from "@/types"

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics>({
    issuesReported: 0,
    issuesResolved: 0,
    activeUsers: 0,
    averageResolutionTime: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const dbService = DatabaseService.getInstance()

  useEffect(() => {
    loadStatistics()

    // Set up real-time listener for statistics
    const unsubscribe = dbService.subscribeToStatistics((stats) => {
      console.log("[v0] Real-time statistics update:", stats)
      setStatistics(stats)
      setIsLoading(false)
      setError(null)
    })

    return () => unsubscribe()
  }, [])

  const loadStatistics = async () => {
    try {
      console.log("[v0] Loading statistics...")
      const stats = await dbService.getStatistics()
      setStatistics(stats)
      setError(null)
    } catch (err: any) {
      console.log("[v0] Error loading statistics:", err.message)
      setError(err.message)
      // Keep default values on error
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStatistics = () => {
    setIsLoading(true)
    loadStatistics()
  }

  const getResolutionRate = () => {
    if (statistics.issuesReported === 0) return 0
    return Math.round((statistics.issuesResolved / statistics.issuesReported) * 100)
  }

  return {
    statistics,
    isLoading,
    error,
    refreshStatistics,
    resolutionRate: getResolutionRate(),
  }
}
