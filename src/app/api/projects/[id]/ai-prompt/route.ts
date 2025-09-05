import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Octokit } from "@octokit/rest"
import ZAI from 'z-ai-web-dev-sdk'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    const project = await db.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        meta: true,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Check if AI prompt already exists in meta
    if (project.meta?.aiPrompt) {
      return NextResponse.json({ prompt: project.meta.aiPrompt })
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })

    // Parse owner and repo name
    const [owner, repo] = project.repoName.split("/")

    // Fetch repository info and README
    const [repoData, readmeData] = await Promise.all([
      octokit.repos.get({ owner, repo }),
      octokit.repos.getReadme({ owner, repo })
    ])

    // Decode README content
    const readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf8')

    // Initialize ZAI
    const zai = await ZAI.create()

    // Generate AI prompt
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert software analyst. Generate a comprehensive project summary based on the repository information provided. Focus on the project\'s purpose, technology stack, main features, and use cases. Be descriptive and professional.'
        },
        {
          role: 'user',
          content: `Analyze this GitHub repository and generate a comprehensive project summary:

Repository: ${repoData.data.name}
Description: ${repoData.data.description || 'No description provided'}
Language: ${repoData.data.language || 'Not specified'}
Stars: ${repoData.data.stargazers_count}
Forks: ${repoData.data.forks_count}

README Content:
${readmeContent}

Please provide a detailed analysis including:
1. Project purpose and overview
2. Main features and functionality
3. Technology stack used
4. Target audience and use cases
5. Key strengths and unique aspects`
        }
      ],
    })

    const aiPrompt = completion.choices[0]?.message?.content || "Unable to generate AI prompt"

    // Save AI prompt to project meta
    if (project.meta) {
      await db.projectMeta.update({
        where: { projectId: project.id },
        data: { aiPrompt }
      })
    } else {
      await db.projectMeta.create({
        data: {
          projectId: project.id,
          aiPrompt
        }
      })
    }

    return NextResponse.json({ prompt: aiPrompt })
  } catch (error) {
    console.error("Failed to generate AI prompt:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}