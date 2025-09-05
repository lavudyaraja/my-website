"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { ArrowRight, Github, Zap, Shield, BarChart3, Code, Users, Network, BookOpen, Share2 } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          🚀 Advanced SaaS Developer Platform
        </Badge>
        <h1 className="text-5xl font-bold mb-6">
          Build Better with{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DevHub
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Connect GitHub repos, view commits, explore file trees, generate AI prompts, 
          visualize architecture diagrams, create public showcases, and share your projects—all in one powerful platform.
        </p>
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
          <div className="flex items-center gap-2 text-yellow-700">
            <Icons.spinner className="h-4 w-4" />
            <span className="text-sm font-medium">Setup Required</span>
          </div>
          <p className="text-xs text-yellow-600 mt-1">
            Authentication needs to be configured. See SETUP_AUTH.md
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/auth/signin">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">View Pricing</Link>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Build Better</h2>
            <p className="text-muted-foreground">
              Powerful features designed for modern developers and teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Github className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <CardTitle>GitHub Integration</CardTitle>
                <CardDescription>
                  Seamlessly connect your repositories and sync commits, branches, and files
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 mx-auto mb-4 text-yellow-600" />
                <CardTitle>AI-Powered Insights</CardTitle>
                <CardDescription>
                  Generate intelligent project summaries and prompts using advanced AI
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Code className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <CardTitle>File Tree Explorer</CardTitle>
                <CardDescription>
                  Navigate and explore repository structure with an intuitive file tree viewer
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <CardTitle>Commit History</CardTitle>
                <CardDescription>
                  Track changes with detailed commit history and author information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Network className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <CardTitle>Architecture Diagrams</CardTitle>
                <CardDescription>
                  Auto-generate visual architecture trees and graphs with intelligent component detection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                <CardTitle>Smart Documentation</CardTitle>
                <CardDescription>
                  AI-powered documentation generation from README files and commit history
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Share2 className="h-12 w-12 mx-auto mb-4 text-pink-600" />
                <CardTitle>Public Showcases</CardTitle>
                <CardDescription>
                  Create beautiful public project pages with shareable links for portfolios
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 mx-auto mb-4 text-red-600" />
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with OAuth authentication and data protection
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Built for teams with role-based access and shared project management
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How DevHub Works</h2>
            <p className="text-muted-foreground">
              Get started in minutes with our simple setup process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect & Analyze</h3>
              <p className="text-muted-foreground">
                Sign in with GitHub, connect repositories, and let AI analyze your codebase
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Generate & Document</h3>
              <p className="text-muted-foreground">
                Auto-generate architecture diagrams, documentation, and intelligent insights
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Showcase & Share</h3>
              <p className="text-muted-foreground">
                Create beautiful public showcases and share your projects with the world
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Supercharge Your Development?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building better with DevHub
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/signin">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/pricing">See Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Icons.gitHub className="h-6 w-6" />
                <span className="font-bold text-lg">DevHub</span>
              </div>
              <p className="text-muted-foreground">
                Advanced SaaS platform for modern developers
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground">Pricing</Link></li>
                <li><Link href="/docs" className="hover:text-foreground">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/help" className="hover:text-foreground">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="/status" className="hover:text-foreground">Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 DevHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}