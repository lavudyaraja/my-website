"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  ExternalLink,
  RefreshCw,
  GitBranch,
  GitCommit,
  Calendar
} from "lucide-react"

interface CIStatus {
  id: string
  status: "success" | "failed" | "pending" | "running"
  branch: string
  commit: {
    sha: string
    message: string
    author: string
    date: string
  }
  url?: string
  startedAt?: string
  completedAt?: string
  duration?: number
  environment?: string
}

interface CIStatusProps {
  projectId: string
  statuses?: CIStatus[]
  onRefresh?: () => void
}

export function CIStatus({ projectId, statuses = [], onRefresh }: CIStatusProps) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await onRefresh?.()
    } finally {
      setIsRefreshing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      case "running":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A"
    
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`
    }
    return `${remainingSeconds}s`
  }

  if (statuses.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>CI/CD Status</span>
              </CardTitle>
              <CardDescription>
                Continuous integration and deployment status
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <GitBranch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No CI/CD Status Available</h3>
            <p className="text-muted-foreground mb-4">
              Connect your CI/CD pipeline to monitor build and deployment status
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>💡 Supported CI/CD platforms:</p>
              <ul className="text-left max-w-md mx-auto">
                <li>• GitHub Actions</li>
                <li>• GitLab CI</li>
                <li>• CircleCI</li>
                <li>• Jenkins</li>
                <li>• Travis CI</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>CI/CD Status</span>
                <Badge variant="secondary">{statuses.length}</Badge>
              </CardTitle>
              <CardDescription>
                Continuous integration and deployment status
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {statuses.map((status) => (
              <div key={status.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(status.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(status.status)}>
                          {status.status.toUpperCase()}
                        </Badge>
                        {status.environment && (
                          <Badge variant="outline">{status.environment}</Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-muted-foreground">
                        <GitBranch className="h-3 w-3" />
                        <span>{status.branch}</span>
                      </div>
                    </div>
                  </div>
                  {status.url && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={status.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <GitCommit className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium">{status.commit.message}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Author:</span>
                      <div className="font-medium">{status.commit.author}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <div className="font-medium">
                        {new Date(status.commit.date).toLocaleDateString()}
                      </div>
                    </div>
                    {status.duration && (
                      <div>
                        <span className="text-muted-foreground">Duration:</span>
                        <div className="font-medium">{formatDuration(status.duration)}</div>
                      </div>
                    )}
                    {status.startedAt && (
                      <div>
                        <span className="text-muted-foreground">Started:</span>
                        <div className="font-medium">
                          {new Date(status.startedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {status.commit.sha.substring(0, 7)}
                  </code>
                  {status.completedAt && (
                    <span className="text-xs text-muted-foreground">
                      Completed {new Date(status.completedAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Successful</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {statuses.filter(s => s.status === "success").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Failed</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {statuses.filter(s => s.status === "failed").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Running</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {statuses.filter(s => s.status === "running").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Last 7 Days</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {statuses.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}