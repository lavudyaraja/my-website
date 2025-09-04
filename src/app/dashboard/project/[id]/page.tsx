"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/ui/icons"
import { Link } from "next/navigation"
import { ArchitectureDiagram } from "@/components/architecture-diagram/ArchitectureDiagram"
import { ProjectShare } from "@/components/project-share/ProjectShare"
import { ExternalLink, GitCommit, FolderOpen, Bot, Monitor, Network, Share2 } from "lucide-react"

interface Project {
  id: string
  repoName: string
  owner: string
  repoUrl: string
  createdAt: string
}

interface RepoInfo {
  name: string
  description: string
  stars: number
  forks: number
  owner: {
    login: string
    avatar_url: string
    bio: string
  }
}

interface Commit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
  html_url: string
}

interface TreeNode {
  path: string
  type: "tree" | "blob"
  size?: number
}

export default function ProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [project, setProject] = useState<Project | null>(null)
  const [repoInfo, setRepoInfo] = useState<RepoInfo | null>(null)
  const [commits, setCommits] = useState<Commit[]>([])
  const [tree, setTree] = useState<TreeNode[]>([])
  const [aiPrompt, setAiPrompt] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const projectId = params.id as string
        
        // Fetch project details
        const projectResponse = await fetch(`/api/projects/${projectId}`)
        if (!projectResponse.ok) {
          throw new Error("Project not found")
        }
        const projectData = await projectResponse.json()
        setProject(projectData)

        // Fetch repo info, commits, and tree
        const [repoInfoResponse, commitsResponse, treeResponse, aiPromptResponse] = await Promise.all([
          fetch(`/api/projects/${projectId}/repo-info`),
          fetch(`/api/projects/${projectId}/commits`),
          fetch(`/api/projects/${projectId}/tree`),
          fetch(`/api/projects/${projectId}/ai-prompt`)
        ])

        if (repoInfoResponse.ok) {
          const repoData = await repoInfoResponse.json()
          setRepoInfo(repoData)
        }

        if (commitsResponse.ok) {
          const commitsData = await commitsResponse.json()
          setCommits(commitsData)
        }

        if (treeResponse.ok) {
          const treeData = await treeResponse.json()
          setTree(treeData)
        }

        if (aiPromptResponse.ok) {
          const promptData = await aiPromptResponse.json()
          setAiPrompt(promptData.prompt)
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load project")
      } finally {
        setIsLoading(false)
      }
    }

    if (session && params.id) {
      fetchProjectData()
    }
  }, [session, params.id])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Error</CardTitle>
            <CardDescription className="text-center">
              {error || "Project not found"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/dashboard">← Back to Dashboard</Link>
        </Button>
        
        {repoInfo && (
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={repoInfo.owner.avatar_url} />
                <AvatarFallback>{repoInfo.owner.login.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold">{repoInfo.name}</h1>
                <p className="text-muted-foreground">{repoInfo.description}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <Badge variant="secondary">
                    <GitCommit className="h-3 w-3 mr-1" />
                    {repoInfo.stars} stars
                  </Badge>
                  <Badge variant="secondary">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    {repoInfo.forks} forks
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button asChild>
                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View on GitHub
                </a>
              </Button>
              <ProjectShare projectId={params.id as string} projectName={repoInfo?.name || project.repoName} />
            </div>
          </div>
        )}
      </div>

      <Tabs defaultValue="commits" className="space-y-4">
        <TabsList>
          <TabsTrigger value="commits">
            <GitCommit className="h-4 w-4 mr-2" />
            Commits
          </TabsTrigger>
          <TabsTrigger value="tree">
            <FolderOpen className="h-4 w-4 mr-2" />
            File Tree
          </TabsTrigger>
          <TabsTrigger value="ai-prompt">
            <Bot className="h-4 w-4 mr-2" />
            AI Prompt
          </TabsTrigger>
          <TabsTrigger value="architecture">
            <Network className="h-4 w-4 mr-2" />
            Architecture
          </TabsTrigger>
          <TabsTrigger value="deployments">
            <Monitor className="h-4 w-4 mr-2" />
            Deployments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="commits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Commits</CardTitle>
              <CardDescription>Last 10 commits to the repository</CardDescription>
            </CardHeader>
            <CardContent>
              {commits.length > 0 ? (
                <div className="space-y-4">
                  {commits.map((commit) => (
                    <div key={commit.sha} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{commit.message}</h4>
                          <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
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
              ) : (
                <p className="text-muted-foreground">No commits found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tree" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Repository File Tree</CardTitle>
              <CardDescription>Explore the repository structure</CardDescription>
            </CardHeader>
            <CardContent>
              {tree.length > 0 ? (
                <ScrollArea className="h-[400px] w-full border rounded-lg p-4">
                  <div className="space-y-1">
                    {tree.map((node, index) => (
                      <div key={index} className="flex items-center space-x-2 py-1">
                        {node.type === "tree" ? (
                          <FolderOpen className="h-4 w-4 text-blue-500" />
                        ) : (
                          <div className="h-4 w-4 border border-gray-300" />
                        )}
                        <span className="text-sm">{node.path}</span>
                        {node.size && (
                          <span className="text-xs text-muted-foreground">
                            {node.size} bytes
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground">No files found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-prompt" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Project Prompt</CardTitle>
              <CardDescription>
                AI analysis of the repository for project understanding
              </CardDescription>
            </CardHeader>
            <CardContent>
              {aiPrompt ? (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{aiPrompt}</p>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No AI prompt generated yet. This will be populated when the AI analysis is complete.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="architecture" className="space-y-4">
          <ArchitectureDiagram projectId={params.id as string} />
        </TabsContent>

        <TabsContent value="deployments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Previews</CardTitle>
              <CardDescription>
                Latest deployment screenshots and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Deployment integration coming soon. This will show screenshots from Vercel deployments.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}