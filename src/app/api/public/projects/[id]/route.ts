import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { Octokit } from "@octokit/rest"
import ZAI from 'z-ai-web-dev-sdk'

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const projectId = id

    // Fetch project from database
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        meta: true,
        user: {
          include: {
            profile: true
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Increment view count
    await db.project.update({
      where: { id: projectId },
      data: { 
        // Note: In a real app, you'd have a views field in the project model
        // For now, we'll just return the project data
      }
    })

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })

    // Parse owner and repo name
    const [owner, repo] = project.repoName.split("/")

    // Fetch repository information
    const [repoData, commitsData, readmeData] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      octokit.repos.listCommits({ owner, repo, per_page: 10 }),
      octokit.repos.getReadme({ owner, repo }).catch(() => null)
    ])

    // Fetch owner info
    const ownerData = await octokit.users.getByUsername({ username: owner })

    // Decode README content
    let readmeContent = ""
    if (readmeData && "content" in readmeData.data) {
      readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf8')
    }

    // Generate AI documentation summary
    let aiSummary = ""
    try {
      const zai = await ZAI.create()
      
      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are an expert technical writer. Generate a comprehensive project summary based on the repository information provided. Focus on the project\'s purpose, main features, technology stack, and use cases. Write in a clear, professional tone suitable for documentation.'
          },
          {
            role: 'user',
            content: `Generate a comprehensive project summary for this repository:

Repository: ${repoData.data.name}
Description: ${repoData.data.description || 'No description provided'}
Language: ${repoData.data.language || 'Not specified'}
Stars: ${repoData.data.stargazers_count}
Forks: ${repoData.data.forks_count}

README Content (first 1000 characters):
${readmeContent.substring(0, 1000)}

Recent commits (first 5):
${commitsData.data.slice(0, 5).map((commit: any) => 
  `- ${commit.commit.message}: ${commit.commit.author.name} - ${new Date(commit.commit.author.date).toLocaleDateString()}`
).join('\n')}

Please provide a comprehensive summary including:
1. Project overview and purpose
2. Main features and functionality
3. Technology stack and architecture
4. Target audience and use cases
5. Key strengths and unique aspects
6. Recent development activity

Write in a professional, engaging tone suitable for public documentation.`
          }
        ],
      })

      aiSummary = completion.choices[0]?.message?.content || "Unable to generate summary."
    } catch (error) {
      aiSummary = "Project summary is currently unavailable. Please check back later."
    }

    // Generate enhanced documentation
    const generatedDocs = await generateEnhancedDocumentation(project, readmeContent, commitsData.data)

    // Fetch architecture data if available
    let architecture = null
    try {
      const archResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects/${projectId}/architecture`)
      if (archResponse.ok) {
        architecture = await archResponse.json()
      }
    } catch (error) {
      console.error("Failed to fetch architecture data:", error)
    }

    // Format response data
    const responseData: ProjectData = {
      id: project.id,
      repoName: project.repoName,
      owner: project.owner,
      repoUrl: project.repoUrl,
      description: repoData.data.description || undefined,
      stars: repoData.data.stargazers_count,
      forks: repoData.data.forks_count,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
      ownerInfo: {
        login: ownerData.data.login,
        avatar_url: ownerData.data.avatar_url,
        bio: ownerData.data.bio || undefined
      },
      commits: commitsData.data.map((commit: any) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author.name,
          date: commit.commit.author.date
        },
        html_url: commit.html_url
      })),
      documentation: {
        readme: readmeContent,
        aiSummary,
        generatedDocs
      },
      architecture,
      deploymentStatus: project.meta?.deploymentImages ? {
        status: 'active',
        url: 'https://example.com', // Placeholder
        lastDeployed: new Date().toISOString()
      } : undefined,
      views: 0, // Placeholder - would need to track in database
      likes: 0  // Placeholder - would need to track in database
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Failed to fetch public project:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

async function generateEnhancedDocumentation(project: any, readmeContent: string, commits: any[]) {
  try {
    const zai = await ZAI.create()
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert technical documentation writer. Generate comprehensive, well-structured documentation based on the project information provided.'
        },
        {
          role: 'user',
          content: `Generate comprehensive documentation for this project:

Project Name: ${project.repoName}
Repository URL: ${project.repoUrl}

README Content:
${readmeContent}

Recent Development Activity:
${commits.slice(0, 5).map((commit: any) => 
  `- ${commit.commit.message} (${commit.commit.author.name}, ${new Date(commit.commit.author.date).toLocaleDateString()})`
).join('\n')}

Please generate the following documentation sections:
1. **Overview**: A comprehensive project overview including purpose and main objectives
2. **Features**: Detailed list of features and capabilities
3. **Installation**: Step-by-step installation instructions
4. **Usage**: How to use the project with examples
5. **API Reference**: Key API endpoints and their usage (if applicable)
6. **Contributing**: How to contribute to the project
7. **License**: License information
8. **Changelog**: Recent changes and updates

Format the documentation in Markdown with proper headings, code blocks, and examples. Make it professional and comprehensive.`
        }
      ],
    })

    return completion.choices[0]?.message?.content || "Documentation generation failed."
  } catch (error) {
    return "Enhanced documentation is currently unavailable. Please refer to the README for basic information."
  }
}