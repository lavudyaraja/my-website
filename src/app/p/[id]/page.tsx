"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ProjectShowcase } from "@/components/project-showcase/ProjectShowcase"
import { CIStatus } from "@/components/ci-status/CIStatus"
import { ArchitectureDiagram } from "@/components/architecture-diagram/ArchitectureDiagram"
import { Icons } from "@/components/ui/icons"
import { 
  ExternalLink, 
  GitCommit, 
  FolderOpen, 
  Bot, 
  Monitor, 
  Network,
  BookOpen,
  Share2,
  Heart,
  Eye,
  Star,
  Copy,
  Check
} from "lucide-react"

interface ProjectData {
  id: string
  repoName: string
  owner: string
  repoUrl: string
  description?: string
  stars: number
  forks: number
  createdAt: string
  updatedAt: string
  ownerInfo: {
    login: string
    avatar_url: string
    bio?: string
  }
  commits: Array<{
    sha: string
    message: string
    author: {
      name: string
      date: string
    }
    html_url: string
  }>
  documentation: {
    readme: string
    aiSummary: string
    generatedDocs: string
  }
  architecture?: any
  deploymentStatus?: {
    status: string
    url?: string
    lastDeployed?: string
  }
  views: number
  likes: number
}

export default function PublicProjectPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<ProjectData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    fetchProjectData()
  }, [params.id])

  const fetchProjectData = async () => {
    try {
      const projectId = params.id as string
      const response = await fetch(`/api/public/projects/${projectId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Project not found")
        } else {
          setError("Failed to load project")
        }
        return
      }
      
      const data = await response.json()
      setProject(data)
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const shareProject = async () => {
    if (!project) return
    
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy URL:", error)
    }
  }

  const likeProject = async () => {
    if (!project || liked) return
    
    try {
      await fetch(`/api/public/projects/${project.id}/like`, {
        method: 'POST'
      })
      setLiked(true)
      if (project) {
        setProject({
          ...project,
          likes: project.likes + 1
        })
      }
    } catch (error) {
      console.error("Failed to like project:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.spinner className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading project showcase...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Project Not Found</CardTitle>
            <CardDescription className="text-center">
              {error || "This project may be private or doesn't exist"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/")} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={project.ownerInfo.avatar_url} />
                <AvatarFallback>{project.ownerInfo.login.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{project.repoName}</h1>
                <p className="text-muted-foreground">
                  by {project.ownerInfo.login}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>{project.views} views</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4" />
                <span>{project.likes} likes</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={likeProject}
                disabled={liked}
              >
                <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                {liked ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareProject}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </>
                )}
              </Button>
              <Button asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stars</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.stars}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Forks</CardTitle>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.forks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commits</CardTitle>
              <GitCommit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{project.commits.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Created</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(project.createdAt).getFullYear()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Description */}
        {project.description && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Project Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="docs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="docs">
              <BookOpen className="h-4 w-4 mr-2" />
              Docs
            </TabsTrigger>
            <TabsTrigger value="commits">
              <GitCommit className="h-4 w-4 mr-2" />
              Commits
            </TabsTrigger>
            <TabsTrigger value="architecture">
              <Network className="h-4 w-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="deployments">
              <Monitor className="h-4 w-4 mr-2" />
              Deployments
            </TabsTrigger>
            <TabsTrigger value="showcase">
              <Eye className="h-4 w-4 mr-2" />
              Showcase
            </TabsTrigger>
          </TabsList>

          <TabsContent value="docs" className="space-y-6">
            {/* AI Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="h-5 w-5" />
                  <span>AI-Generated Summary</span>
                </CardTitle>
                <CardDescription>
                  Intelligent analysis of the project documentation and codebase
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-6 rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {project.documentation.aiSummary}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* README Documentation */}
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>
                  Project README and generated documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] w-full border rounded-lg p-6">
                  <div className="prose prose-sm max-w-none">
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: project.documentation.readme 
                          ? project.documentation.readme
                              .replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>')
                              .replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-semibold mb-3 mt-6">$1</h2>')
                              .replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
                              .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\*(.+?)\*/g, '<em>$1</em>')
                              .replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
                              .replace(/\n\n/g, '</p><p class="mb-4">')
                          : '<p class="mb-4">No documentation available</p>'
                      }} 
                    />
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Commits</CardTitle>
                <CardDescription>
                  Latest commits to the repository
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.commits.map((commit) => (
                    <div key={commit.sha} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{commit.message}</h4>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{commit.author.name}</span>
                            <span>•</span>
                            <span>{new Date(commit.author.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={commit.html_url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="architecture" className="space-y-4">
            <ArchitectureDiagram 
              projectId={project.id} 
              data={project.architecture}
            />
          </TabsContent>

          <TabsContent value="deployments" className="space-y-4">
            <CIStatus 
              projectId={project.id}
              statuses={[]} // Placeholder - would fetch from API
            />
          </TabsContent>

          <TabsContent value="showcase" className="space-y-4">
            <ProjectShowcase 
              projectId={project.id}
              screenshots={[]} // Placeholder - would fetch from API
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icons.gitHub className="h-5 w-5" />
              <span className="font-semibold">DevHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Public project showcase • Built with DevHub
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}