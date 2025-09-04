"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Share2, Copy, Check, ExternalLink, Eye, QrCode } from "lucide-react"

interface ProjectShareProps {
  projectId: string
  projectName: string
}

export function ProjectShare({ projectId, projectName }: ProjectShareProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [publicUrl, setPublicUrl] = useState("")

  const publicProjectUrl = `${window.location.origin}/p/${projectId}`

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const shareProject = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectName,
          text: `Check out ${projectName} on DevHub`,
          url: publicProjectUrl,
        })
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      copyToClipboard(publicProjectUrl)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project Showcase</DialogTitle>
          <DialogDescription>
            Share this project with others via a public showcase page
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Public URL */}
          <div className="space-y-2">
            <Label htmlFor="public-url">Public Showcase URL</Label>
            <div className="flex space-x-2">
              <Input
                id="public-url"
                value={publicProjectUrl}
                readOnly
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(publicProjectUrl)}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => copyToClipboard(publicProjectUrl)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              onClick={shareProject}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              asChild
            >
              <a href={publicProjectUrl} target="_blank" rel="noopener noreferrer">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </a>
            </Button>
            
            <Button
              variant="outline"
              className="justify-start"
              asChild
            >
              <a href={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(publicProjectUrl)}`} 
                 target="_blank" rel="noopener noreferrer">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </a>
            </Button>
          </div>

          {/* Features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Public Showcase Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">✓</Badge>
                <span className="text-sm">Project documentation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">✓</Badge>
                <span className="text-sm">Architecture diagrams</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">✓</Badge>
                <span className="text-sm">Commit history</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">✓</Badge>
                <span className="text-sm">AI-generated summaries</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">✓</Badge>
                <span className="text-sm">Shareable links</span>
              </div>
            </CardContent>
          </Card>

          {/* Example Embed */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Example Embed</Label>
            <div className="bg-muted p-4 rounded-lg">
              <div className="text-center text-sm text-muted-foreground mb-2">
                Project Showcase Badge
              </div>
              <div className="bg-white border rounded p-3 inline-block">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-bold">DH</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">{projectName}</div>
                    <div className="text-xs text-muted-foreground">View on DevHub</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}