import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Octokit } from "@octokit/rest"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const project = await db.project.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })

    // Parse owner and repo name
    const [owner, repo] = project.repoName.split("/")

    // Fetch repository info
    const { data: repoData } = await octokit.repos.get({
      owner,
      repo,
    })

    // Fetch owner info
    const { data: ownerData } = await octokit.users.getByUsername({
      username: owner,
    })

    const repoInfo = {
      name: repoData.name,
      description: repoData.description,
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      owner: {
        login: ownerData.login,
        avatar_url: ownerData.avatar_url,
        bio: ownerData.bio || "",
      },
    }

    return NextResponse.json(repoInfo)
  } catch (error) {
    console.error("Failed to fetch repo info:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}