import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import stripe from "@/lib/stripe"

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

    // Get analytics data
    const [totalUsers, activeSubscriptions, totalProjects, subscriptions] = await Promise.all([
      db.user.count(),
      db.subscription.count({
        where: { status: "ACTIVE" },
      }),
      db.project.count(),
      db.subscription.findMany({
        where: { status: "ACTIVE" },
        select: { stripePriceId: true },
      }),
    ])

    // Calculate MRR (simplified - in real app you'd get actual amounts from Stripe)
    const planPrices: { [key: string]: number } = {
      [process.env.STRIPE_BASIC_PRICE_ID || ""]: 9,
      [process.env.STRIPE_PRO_PRICE_ID || ""]: 29,
    }

    const mrr = subscriptions.reduce((total, sub) => {
      return total + (planPrices[sub.stripePriceId || ""] || 0)
    }, 0)

    const analytics = {
      totalUsers,
      activeSubscriptions,
      totalProjects,
      mrr,
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}