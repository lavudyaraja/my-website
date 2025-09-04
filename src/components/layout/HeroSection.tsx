"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { 
  ArrowRight, 
  Github, 
  Zap, 
  Shield, 
  Network, 
  Brain,
  Share2,
  Star,
  Users,
  Code,
  FileText,
  Monitor,
  CheckCircle,
  Sparkles,
  TrendingUp,
  Rocket,
  Award,
  Lightbulb,
  Target,
  Palette,
  Database,
  Cloud,
  Smartphone,
  Globe
} from "lucide-react"

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    setIsMounted(true)
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      title: "Architecture Visualization",
      description: "Auto-generate stunning architecture diagrams with D3.js",
      icon: Network,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "AI-Powered Documentation",
      description: "Smart docs generation from README and commit history",
      icon: Brain,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Public Project Showcases",
      description: "Beautiful portfolio pages with shareable links",
      icon: Share2,
      color: "text-pink-600",
      bgColor: "bg-pink-100"
    },
    {
      title: "GitHub Integration",
      description: "Seamless repository sync and analysis",
      icon: Github,
      color: "text-gray-600",
      bgColor: "bg-gray-100"
    }
  ]

  const stats = [
    { label: "Active Developers", value: "10K+", icon: Users },
    { label: "Projects Generated", value: "50K+", icon: Code },
    { label: "Architecture Diagrams", value: "100K+", icon: Network },
    { label: "Uptime", value: "99.9%", icon: Shield }
  ]

  const testimonials = [
    {
      quote: "DevHub transformed how I showcase my projects. The AI-generated documentation saves me hours every week!",
      author: "Sarah Chen",
      role: "Full Stack Developer",
      company: "TechCorp"
    },
    {
      quote: "The architecture diagrams are incredible. I can finally explain complex systems to stakeholders with beautiful visuals.",
      author: "Mike Johnson",
      role: "Software Architect",
      company: "StartupXYZ"
    },
    {
      quote: "Best platform for developers to showcase their work. The public showcases look professional and drive engagement.",
      author: "Emily Davis",
      role: "Product Manager",
      company: "InnovateCo"
    }
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100/[0.05] dark:bg-grid-slate-900/[0.05]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-black/20 rounded-full px-4 py-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Next-Gen Developer Platform</span>
            <Badge variant="secondary" className="text-xs">v2.0</Badge>
          </div>

          {/* Main Heading */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="block">Build Better with</span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                DevHub AI
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The ultimate platform for developers to visualize architecture, generate AI documentation, 
              and create stunning project showcases. All powered by advanced AI.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg">
              <Link href="/auth/signin" className="flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Start Building Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              <Link href="/pricing" className="flex items-center space-x-2">
                <Star className="h-5 w-5" />
                <span>View Pricing</span>
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Shield className="h-4 w-4" />
              <span>Enterprise Grade</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span>Blazing Fast</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>10K+ Developers</span>
            </div>
            <div className="flex items-center space-x-1">
              <CheckCircle className="h-4 w-4" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature Cards */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold mb-4">
                  Supercharge Your Development Workflow
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Experience the power of AI-driven development tools designed for modern teams.
                </p>
              </div>

              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <Card 
                    key={feature.title} 
                    className={`p-6 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                      currentFeature === index ? 'ring-2 ring-purple-500' : ''
                    }`}
                    onClick={() => setCurrentFeature(index)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${feature.bgColor}`}>
                        <feature.icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="bg-white/10 dark:bg-black/10 backdrop-blur-md border border-white/20 dark:border-black/20 rounded-2xl p-8">
                {/* Mock Interface */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Icons.gitHub className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold">my-awesome-project</div>
                        <div className="text-sm text-muted-foreground">React • Node.js • TypeScript</div>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>

                  {/* Architecture Diagram Preview */}
                  <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Architecture Overview</h4>
                      <Badge variant="outline">AI Generated</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-100 dark:bg-blue-900/20 p-4 rounded-lg text-center">
                        <Network className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <div className="text-sm font-medium">Frontend</div>
                        <div className="text-xs text-muted-foreground">React App</div>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-lg text-center">
                        <Database className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <div className="text-sm font-medium">Backend</div>
                        <div className="text-xs text-muted-foreground">API Server</div>
                      </div>
                      <div className="bg-purple-100 dark:bg-purple-900/20 p-4 rounded-lg text-center">
                        <Cloud className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <div className="text-sm font-medium">Database</div>
                        <div className="text-xs text-muted-foreground">PostgreSQL</div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">156</div>
                      <div className="text-sm text-muted-foreground">Commits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">23</div>
                      <div className="text-sm text-muted-foreground">Files</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">4.8k</div>
                      <div className="text-sm text-muted-foreground">Stars</div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4">
                  <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">
                    NEW
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                    AI POWERED
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center p-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Loved by Developers Worldwide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-muted-foreground mb-4">
                    "{testimonial.quote}"
                  </blockquote>
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full">
              <Rocket className="h-5 w-5" />
              <span className="font-semibold">Ready to get started?</span>
            </div>
            <h3 className="text-3xl font-bold mt-6 mb-4">
              Join 10,000+ developers building better with DevHub
            </h3>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your free trial today and experience the future of development productivity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
                <Link href="/auth/signin" className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Start Free Trial</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3">
                <Link href="/pricing">View Pricing Plans</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  )
}