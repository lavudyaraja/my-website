import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import stripe from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ 
        error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables." 
      }, { status: 503 })
    }

    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
    }

    // Check if user already has an active subscription
    const existingSubscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
      },
    })

    if (existingSubscription) {
      return NextResponse.json({ error: "User already has an active subscription" }, { status: 400 })
    }

    // Get or create Stripe customer
    let stripeCustomer = await db.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptions: true },
    })

    let customerId = stripeCustomer?.subscriptions?.[0]?.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email || "",
        name: session.user.name || "",
        metadata: {
          userId: session.user.id,
        },
      })
      customerId = customer.id
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error("Failed to create checkout session:", error)
    
    // Handle specific Stripe errors
    if (error.type === 'StripeAuthenticationError') {
      return NextResponse.json({ 
        error: "Stripe authentication failed. Please check your API keys." 
      }, { status: 503 })
    }
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json({ 
        error: "Invalid request. Please check your configuration." 
      }, { status: 400 })
    }
    
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}