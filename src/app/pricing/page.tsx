"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/components/ui/icons"
import { PLANS } from "@/lib/stripe"
import { Check, Star } from "lucide-react"

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!session) {
      router.push("/auth/signin")
      return
    }

    if (!priceId) {
      // Free plan - redirect to dashboard
      router.push("/dashboard")
      return
    }

    setIsLoading(planName)
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error("Subscription error:", error)
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Choose the plan that works best for you
        </p>
        <Badge variant="secondary" className="mb-8">
          <Star className="h-4 w-4 mr-1" />
          14-day free trial on all paid plans
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan, index) => (
          <Card key={plan.name} className={`relative ${index === 1 ? 'border-primary shadow-lg' : ''}`}>
            {index === 1 && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className="w-full mt-6" 
                variant={index === 1 ? "default" : "outline"}
                onClick={() => handleSubscribe(plan.priceId || null, plan.name)}
                disabled={isLoading === plan.name}
              >
                {isLoading === plan.name ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : plan.price === 0 ? (
                  "Get Started"
                ) : (
                  "Subscribe"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="text-left">
            <h3 className="font-semibold mb-2">Can I change plans later?</h3>
            <p className="text-muted-foreground text-sm">
              Yes, you can upgrade or downgrade your plan at any time from your account settings.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p className="text-muted-foreground text-sm">
              We accept all major credit cards including Visa, Mastercard, and American Express.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
            <p className="text-muted-foreground text-sm">
              We offer a 14-day money-back guarantee for all new subscriptions.
            </p>
          </div>
          <div className="text-left">
            <h3 className="font-semibold mb-2">Is my data secure?</h3>
            <p className="text-muted-foreground text-sm">
              Yes, we use industry-standard encryption and security practices to protect your data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}