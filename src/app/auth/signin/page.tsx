"use client"

import { signIn, getProviders } from "next-auth/react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const [providers, setProviders] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getAuthProviders = async () => {
      const providers = await getProviders()
      setProviders(providers)
    }
    getAuthProviders()
  }, [])

  const handleSignIn = (providerId: string) => {
    signIn(providerId, { callbackUrl: "/dashboard" })
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Choose your preferred sign-in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {providers &&
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
            ))}
        </CardContent>
      </Card>
    </div>
  )
}