"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Camera, TrendingUp, CheckCircle, Phone, Mail, Globe } from "lucide-react"

interface HomePageProps {
  onShowLogin: () => void
}

export function HomePage({ onShowLogin }: HomePageProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">JanSeva</h1>
                <p className="text-xs text-muted-foreground">Government of Jharkhand</p>
              </div>
            </div>
            <Button onClick={onShowLogin} variant="outline" size="sm">
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Clean & Green Technology Initiative
            </Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-balance mb-6">
              Report Civic Issues,
              <span className="text-primary"> Build Better Communities</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto">
              Empower your voice in making Jharkhand cleaner and greener. Report civic issues instantly and track their
              resolution in real-time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={onShowLogin} className="text-lg px-8">
                Start Reporting Issues
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How JanSeva Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and effective civic issue reporting for all citizens of Jharkhand
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6 border-2 hover:border-primary/20 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Capture & Report</h3>
                <p className="text-muted-foreground">
                  Take photos, record voice notes, and automatically tag location for any civic issue you encounter
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-primary/20 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                <p className="text-muted-foreground">
                  Monitor your reports in real-time with detailed timelines and status updates from authorities
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-2 hover:border-primary/20 transition-colors">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Resolved</h3>
                <p className="text-muted-foreground">
                  Receive notifications when issues are resolved and earn green points for active participation
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Issue Types Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Report Any Civic Issue</h2>
            <p className="text-lg text-muted-foreground">
              From potholes to broken streetlights, we handle all types of civic concerns
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "🕳️", label: "Potholes", color: "bg-orange-100 text-orange-700" },
              { icon: "💡", label: "Street Lights", color: "bg-yellow-100 text-yellow-700" },
              { icon: "🗑️", label: "Garbage", color: "bg-green-100 text-green-700" },
              { icon: "🚰", label: "Water Issues", color: "bg-blue-100 text-blue-700" },
              { icon: "🚧", label: "Road Damage", color: "bg-red-100 text-red-700" },
              { icon: "🌳", label: "Tree Issues", color: "bg-emerald-100 text-emerald-700" },
              { icon: "🏗️", label: "Construction", color: "bg-gray-100 text-gray-700" },
              { icon: "⚡", label: "Power Issues", color: "bg-purple-100 text-purple-700" },
            ].map((issue, index) => (
              <Card key={index} className="p-4 text-center hover:shadow-md transition-shadow">
                <CardContent className="pt-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${issue.color}`}
                  >
                    <span className="text-2xl">{issue.icon}</span>
                  </div>
                  <p className="font-medium text-sm">{issue.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">2,500+</div>
              <p className="text-primary-foreground/80">Issues Reported</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1,800+</div>
              <p className="text-primary-foreground/80">Issues Resolved</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24</div>
              <p className="text-primary-foreground/80">Districts Covered</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">72%</div>
              <p className="text-primary-foreground/80">Resolution Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of citizens already making Jharkhand cleaner and better for everyone
          </p>
          <Button size="lg" onClick={onShowLogin} className="text-lg px-8">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold">JanSeva</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Government of Jharkhand's official civic issue reporting platform
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Issue Types
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Success Stories
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>1800-XXX-XXXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>support@janseva.gov.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>jharkhand.gov.in</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Department</h4>
              <p className="text-sm text-muted-foreground">
                Department of Higher and Technical Education
                <br />
                Government of Jharkhand
              </p>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Government of Jharkhand. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
