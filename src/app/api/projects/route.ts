import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const projects = await db.project.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        repoName: true,
        owner: true,
        createdAt: true,
      },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { repoUrl } = await request.json()

    if (!repoUrl) {
      return NextResponse.json({ error: "Repository URL is required" }, { status: 400 })
    }

    // Parse GitHub URL to extract owner and repo name
    const urlMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
    if (!urlMatch) {
      return NextResponse.json({ error: "Invalid GitHub repository URL" }, { status: 400 })
    }

    const [, owner, repoName] = urlMatch

    // Check if project already exists
    const existingProject = await db.project.findFirst({
      where: {
        userId: session.user.id,
        repoUrl,
      },
    })

    if (existingProject) {
      return NextResponse.json({ error: "Project already exists" }, { status: 400 })
    }

    // Create new project
    const project = await db.project.create({
      data: {
        userId: session.user.id,
        repoUrl,
        repoName,
        owner,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}