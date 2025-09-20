"use client"

import { useState, useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { AuthService } from "@/lib/auth"
import type { User } from "@/types"
import { CitizenDashboard } from "@/components/citizen/citizen-dashboard"
import { ZonalAdminDashboard } from "@/components/admin/zonal-admin-dashboard"
import { MinistryAdminDashboard } from "@/components/admin/ministry-admin-dashboard"
import { HomePage } from "@/components/home/home-page"

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const authService = AuthService.getInstance()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    setShowLogin(false)
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    setShowLogin(false)
  }

  const handleShowLogin = () => {
    setShowLogin(true)
  }

  const handleBackToHome = () => {
    setShowLogin(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (showLogin && !user) {
    return <LoginForm onLogin={handleLogin} onBack={handleBackToHome} />
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        {user.role === "citizen" && <CitizenDashboard user={user} onLogout={handleLogout} />}
        {user.role === "zonal_admin" && <ZonalAdminDashboard user={user} onLogout={handleLogout} />}
        {user.role === "ministry_admin" && <MinistryAdminDashboard user={user} onLogout={handleLogout} />}
      </div>
    )
  }

  return <HomePage onShowLogin={handleShowLogin} />
}
