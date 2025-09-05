import Link from "next/link"
import { Icons } from "@/components/ui/icons"
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail,
  ExternalLink,
  Heart,
  Zap,
  Shield,
  Code,
  Network,
  Brain,
  FileText
} from "lucide-react"

const navigation = {
  product: [
    { name: "Features", href: "/#features", icon: Zap },
    { name: "Pricing", href: "/pricing", icon: Code },
    { name: "Documentation", href: "/#docs", icon: FileText },
    { name: "API", href: "/#api", icon: Network },
  ],
  features: [
    { name: "Architecture Generator", href: "/#architecture", icon: Network },
    { name: "AI Documentation", href: "/#ai-docs", icon: Brain },
    { name: "Public Showcase", href: "/#showcase", icon: ExternalLink },
    { name: "CI/CD Integration", href: "/#cicd", icon: Shield },
  ],
  company: [
    { name: "About", href: "/about", icon: Code },
    { name: "Blog", href: "/blog", icon: FileText },
    { name: "Careers", href: "/careers", icon: Zap },
    { name: "Press", href: "/press", icon: Network },
  ],
  support: [
    { name: "Help Center", href: "/help", icon: FileText },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "Status", href: "/status", icon: Shield },
    { name: "API Status", href: "/api-status", icon: Network },
  ],
  legal: [
    { name: "Privacy", href: "/privacy", icon: Shield },
    { name: "Terms", href: "/terms", icon: FileText },
    { name: "Security", href: "/security", icon: Shield },
    { name: "Cookies", href: "/cookies", icon: Code },
  ],
}

const socialLinks = [
  { name: "GitHub", href: "https://github.com", icon: Github },
  { name: "Twitter", href: "https://twitter.com", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  { name: "Email", href: "mailto:hello@devhub.com", icon: Mail },
]

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background border-t">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icons.gitHub className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DevHub
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI-Powered Developer Platform
                </p>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Build better with DevHub - Connect GitHub repos, generate AI documentation, 
              create architecture diagrams, and showcase your projects to the world.
            </p>

            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Product Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                  >
                    <item.icon className="h-3 w-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Features Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Features</h4>
            <ul className="space-y-3">
              {navigation.features.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                  >
                    <item.icon className="h-3 w-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                  >
                    <item.icon className="h-3 w-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Navigation */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-2"
                  >
                    <item.icon className="h-3 w-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <div className="text-sm text-muted-foreground">Active Developers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50K+</div>
              <div className="text-sm text-muted-foreground">Projects Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">100K+</div>
              <div className="text-sm text-muted-foreground">Architecture Diagrams</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {currentYear} DevHub. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                <span>by developers, for developers</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
                >
                  <item.icon className="h-3 w-3" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}