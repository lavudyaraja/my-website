"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getAuthProviders = async () => {
      try {
        const providers = await getProviders()
        setProviders(providers)
      } catch (error) {
        console.error('Error loading auth providers:', error)
      } finally {
        setLoading(false)
      }
    }
    getAuthProviders()
  }, [])

  const handleSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: "/dashboard" })
  }

  return (
    <div className="container flex min-h-[calc(100vh-4rem)] w-full flex-col items-center justify-center py-12">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {loading ? (
            <div className="flex justify-center">
              <Icons.spinner className="h-6 w-6 animate-spin" />
            </div>
          ) : providers && Object.keys(providers).length > 0 ? (
            Object.values(providers).map((provider: any) => (
              <Button
                key={provider.name}
                variant="outline"
                className="w-full"
                onClick={() => handleSignIn(provider.id)}
              >
                {provider.name === "Google" && <Icons.google className="mr-2 h-4 w-4" />}
                {provider.name === "GitHub" && <Icons.gitHub className="mr-2 h-4 w-4" />}
                Continue with {provider.name}
              </Button>
            ))
          ) : (
            <div className="text-center space-y-4">
              <div className="text-yellow-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold mb-2">⚠️ Authentication Not Configured</h3>
                <p className="text-sm mb-3">
                  OAuth providers are not set up. Please configure GitHub or Google OAuth to enable authentication.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/SETUP_AUTH.md', '_blank')}
                >
                  View Setup Instructions
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}