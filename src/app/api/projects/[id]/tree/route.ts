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

    // Fetch repository tree
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: "HEAD",
      recursive: "true",
    })

    const tree = treeData.tree.map((item: any) => ({
      path: item.path,
      type: item.type,
      size: item.size,
    }))

    return NextResponse.json(tree)
  } catch (error) {
    console.error("Failed to fetch tree:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}