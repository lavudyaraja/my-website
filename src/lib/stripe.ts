import Stripe from "stripe"

// Check if Stripe is configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

// Create Stripe instance only if we have a key, otherwise use a mock for development
const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia",
    })
  : null

export const PLANS = [
  {
    name: "Free",
    price: 0,
    priceId: null,
    features: [
      "Up to 3 projects",
      "Basic GitHub integration",
      "AI prompt generation",
      "Limited deployment previews"
    ],
    description: "Perfect for trying out DevHub"
  },
  {
    name: "Basic",
    price: 9,
    priceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: [
      "Up to 10 projects",
      "Advanced GitHub integration",
      "AI prompt generation",
      "Deployment previews",
      "Priority support"
    ],
    description: "For individual developers"
  },
  {
    name: "Pro",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      "Unlimited projects",
      "Full GitHub integration",
      "Advanced AI features",
      "Unlimited deployment previews",
      "Priority support",
      "Custom integrations"
    ],
    description: "For teams and power users"
  }
]

export default stripe