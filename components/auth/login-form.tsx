"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthService } from "@/lib/auth"
import type { User } from "@/types"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, MapPin } from "lucide-react"

interface LoginFormProps {
  onLogin: (user: User) => void
  onBack?: () => void
}

export function LoginForm({ onLogin, onBack }: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "citizen" as User["role"],
  })
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen" as User["role"],
    zone: "",
    ministry: "",
  })
  const { toast } = useToast()
  const authService = AuthService.getInstance()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await authService.login(loginData.email, loginData.password, loginData.role)
      onLogin(user)
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      })
    } catch (error: any) {
      console.log("[v0] Login error:", error.message)
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const user = await authService.register(
        {
          name: registerData.name,
          email: registerData.email,
          role: registerData.role,
          zone: registerData.zone || undefined,
          ministry: registerData.ministry || undefined,
        },
        registerData.password,
      )
      onLogin(user)
      toast({
        title: "Registration Successful",
        description: `Welcome to JanSeva, ${user.name}!`,
      })
    } catch (error: any) {
      console.log("[v0] Registration error:", error.message)
      toast({
        title: "Registration Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack} className="absolute top-4 left-4 p-2 cursor-pointer">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <div className="flex items-center justify-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">JanSeva</CardTitle>
            </div>
          </div>
          <CardDescription>Government of Jharkhand - Civic Issue Reporting System</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="cursor-pointer">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="cursor-pointer">
                Register
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-role">Role</Label>
                  <Select
                    value={loginData.role}
                    onValueChange={(value: User["role"]) => setLoginData({ ...loginData, role: value })}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen" className="cursor-pointer">
                        Citizen
                      </SelectItem>
                      <SelectItem value="zonal_admin" className="cursor-pointer">
                        Zonal Admin
                      </SelectItem>
                      <SelectItem value="ministry_admin" className="cursor-pointer">
                        Ministry Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                  />
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <strong>Demo Credentials:</strong>
                  </p>
                  <p>Citizen: citizen@jharkhand.gov.in / password</p>
                  <p>Zonal Admin: admin.ranchi@jharkhand.gov.in / password</p>
                  <p>Ministry: ministry.urban@jharkhand.gov.in / password</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <Input
                    id="register-name"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    placeholder="Create a password (min 6 characters)"
                    required
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-role">Role</Label>
                  <Select
                    value={registerData.role}
                    onValueChange={(value: User["role"]) => setRegisterData({ ...registerData, role: value })}
                  >
                    <SelectTrigger className="cursor-pointer">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="citizen" className="cursor-pointer">
                        Citizen
                      </SelectItem>
                      <SelectItem value="zonal_admin" className="cursor-pointer">
                        Zonal Admin
                      </SelectItem>
                      <SelectItem value="ministry_admin" className="cursor-pointer">
                        Ministry Admin
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {registerData.role === "zonal_admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="register-zone">Zone</Label>
                    <Select
                      value={registerData.zone}
                      onValueChange={(value) => setRegisterData({ ...registerData, zone: value })}
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select your zone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ranchi" className="cursor-pointer">
                          Ranchi
                        </SelectItem>
                        <SelectItem value="dhanbad" className="cursor-pointer">
                          Dhanbad
                        </SelectItem>
                        <SelectItem value="jamshedpur" className="cursor-pointer">
                          Jamshedpur
                        </SelectItem>
                        <SelectItem value="bokaro" className="cursor-pointer">
                          Bokaro
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {registerData.role === "ministry_admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="register-ministry">Ministry</Label>
                    <Select
                      value={registerData.ministry}
                      onValueChange={(value) => setRegisterData({ ...registerData, ministry: value })}
                    >
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select your ministry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urban_dev" className="cursor-pointer">
                          Urban Development
                        </SelectItem>
                        <SelectItem value="public_works" className="cursor-pointer">
                          Public Works
                        </SelectItem>
                        <SelectItem value="water_sanitation" className="cursor-pointer">
                          Water & Sanitation
                        </SelectItem>
                        <SelectItem value="electricity" className="cursor-pointer">
                          Electricity
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button type="submit" className="w-full cursor-pointer" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
