"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Monitor, 
  Smartphone, 
  Tablet, 
  Maximize, 
  Download,
  RefreshCw,
  Plus,
  Camera
} from "lucide-react"

interface Screenshot {
  id: string
  url: string
  title: string
  description?: string
  device: "desktop" | "mobile" | "tablet"
  createdAt: string
}

interface ProjectShowcaseProps {
  projectId: string
  screenshots?: Screenshot[]
  onRefresh?: () => void
  onAddScreenshot?: () => void
}

export function ProjectShowcase({ 
  projectId, 
  screenshots = [], 
  onRefresh, 
  onAddScreenshot 
}: ProjectShowcaseProps) {
  const [selectedScreenshot, setSelectedScreenshot] = useState<Screenshot | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh?.()
    } finally {
      setIsRefreshing(false)
    }
  }

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return <Smartphone className="h-4 w-4" />
      case "tablet":
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getDeviceLabel = (device: string) => {
    switch (device) {
      case "mobile":
        return "Mobile"
      case "tablet":
        return "Tablet"
      default:
        return "Desktop"
    }
  }

  if (screenshots.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Project Showcase</span>
              </CardTitle>
              <CardDescription>
                Screenshots and live demo of your project
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              {onAddScreenshot && (
                <Button size="sm" onClick={onAddScreenshot}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Screenshot
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Monitor className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Screenshots Available</h3>
            <p className="text-muted-foreground mb-4">
              Add screenshots to showcase your project to visitors
            </p>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                💡 Tips for great screenshots:
              </p>
              <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto">
                <li>• Show your project&apos;s main interface</li>
                <li>• Highlight key features and functionality</li>
                <li>• Use high-resolution images</li>
                <li>• Include multiple device views if applicable</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Monitor className="h-5 w-5" />
                <span>Project Showcase</span>
                <Badge variant="secondary">{screenshots.length}</Badge>
              </CardTitle>
              <CardDescription>
                Screenshots and live demo of your project
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                {isRefreshing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              {onAddScreenshot && (
                <Button size="sm" onClick={onAddScreenshot}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Screenshot
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {screenshots.map((screenshot) => (
              <Card key={screenshot.id} className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                <div 
                  className="aspect-video bg-muted relative overflow-hidden"
                  onClick={() => setSelectedScreenshot(screenshot)}
                >
                  <img
                    src={screenshot.url}
                    alt={screenshot.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Maximize className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-xs">
                      {getDeviceIcon(screenshot.device)}
                      {getDeviceLabel(screenshot.device)}
                    </Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-medium text-sm mb-1">{screenshot.title}</h4>
                  {screenshot.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {screenshot.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Screenshot Modal */}
      <Dialog 
        open={!!selectedScreenshot} 
        onOpenChange={() => setSelectedScreenshot(null)}
      >
        <DialogContent className="max-w-4xl">
          {selectedScreenshot && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedScreenshot.title}</DialogTitle>
                <DialogDescription>
                  {getDeviceIcon(selectedScreenshot.device)}
                  {getDeviceLabel(selectedScreenshot.device)} View
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={selectedScreenshot.url}
                    alt={selectedScreenshot.title}
                    className="w-full h-auto"
                  />
                </div>
                
                {selectedScreenshot.description && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedScreenshot.description}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Added {new Date(selectedScreenshot.createdAt).toLocaleDateString()}
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}