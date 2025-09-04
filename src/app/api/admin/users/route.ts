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

    // Check if user is admin
    const userProfile = await db.profile.findUnique({
      where: { userId: session.user.id }
    })

    if (!userProfile || userProfile.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const users = await db.user.findMany({
      include: {
        profile: true,
        projects: true,
        subscriptions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    // Transform data for frontend
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || "",
      email: user.email || "",
      role: user.profile?.role || "USER",
      createdAt: user.createdAt.toISOString(),
      projects: user.projects.map((project) => ({
        id: project.id,
        repoName: project.repoName,
        owner: project.owner,
        createdAt: project.createdAt.toISOString(),
      })),
      subscriptions: user.subscriptions.map((subscription) => ({
        id: subscription.id,
        status: subscription.status,
        stripePriceId: subscription.stripePriceId,
        currentPeriodEnd: subscription.currentPeriodEnd.toISOString(),
      })),
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}