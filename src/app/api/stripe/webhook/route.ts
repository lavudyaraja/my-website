import { NextResponse } from "next/server"
import { headers } from "next/headers"
import stripe from "@/lib/stripe"
import { db } from "@/lib/db"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      return NextResponse.json({ 
        error: "Stripe is not configured. Webhook handling disabled." 
      }, { status: 503 })
    }

    const body = await request.text()
    const signature = headers().get("stripe-signature")!

    let event: stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        const subscription = event.data.object as stripe.Subscription
        await handleSubscriptionChange(subscription)
        break
      case "customer.subscription.deleted":
        const deletedSubscription = event.data.object as stripe.Subscription
        await handleSubscriptionDeletion(deletedSubscription)
        break
      case "invoice.payment_succeeded":
        const invoice = event.data.object as stripe.Invoice
        await handlePaymentSuccess(invoice)
        break
      case "invoice.payment_failed":
        const failedInvoice = event.data.object as stripe.Invoice
        await handlePaymentFailure(failedInvoice)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook handler error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}

async function handleSubscriptionChange(subscription: stripe.Subscription) {
  try {
    const customerId = subscription.customer as string
    const priceId = subscription.items.data[0]?.price?.id
    const status = subscription.status.toUpperCase() as any
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

    // Find user by Stripe customer ID
    const userSubscription = await db.subscription.findFirst({
      where: {
        stripeCustomerId: customerId,
      },
    })

    if (userSubscription) {
      // Update existing subscription
      await db.subscription.update({
        where: { id: userSubscription.id },
        data: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          status,
          currentPeriodEnd,
        },
      })
    } else {
      // Create new subscription
      // Get user ID from customer metadata
      const customer = await stripe.customers.retrieve(customerId)
      const userId = customer.metadata?.userId

      if (userId) {
        await db.subscription.create({
          data: {
            userId,
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: customerId,
            stripePriceId: priceId,
            status,
            currentPeriodEnd,
          },
        })
      }
    }
  } catch (error) {
    console.error("Error handling subscription change:", error)
  }
}

async function handleSubscriptionDeletion(subscription: stripe.Subscription) {
  try {
    await db.subscription.updateMany({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        status: "CANCELED",
      },
    })
  } catch (error) {
    console.error("Error handling subscription deletion:", error)
  }
}

async function handlePaymentSuccess(invoice: stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string
    
    if (subscriptionId) {
      await db.subscription.updateMany({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
        data: {
          status: "ACTIVE",
        },
      })
    }
  } catch (error) {
    console.error("Error handling payment success:", error)
  }
}

async function handlePaymentFailure(invoice: stripe.Invoice) {
  try {
    const subscriptionId = invoice.subscription as string
    
    if (subscriptionId) {
      await db.subscription.updateMany({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
        data: {
          status: "PAST_DUE",
        },
      })
    }
  } catch (error) {
    console.error("Error handling payment failure:", error)
  }
}