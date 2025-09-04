"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/components/ui/icons"
import { Network, FileText, Brain, Download } from "lucide-react"

interface ArchitectureNode {
  id: string
  name: string
  type: "frontend" | "backend" | "database" | "api" | "service" | "storage"
  description?: string
  technology?: string
  dependencies?: string[]
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface ArchitectureLink {
  source: string
  target: string
  type: "depends" | "connects" | "uses"
}

interface ArchitectureData {
  nodes: ArchitectureNode[]
  links: ArchitectureLink[]
  explanation: string
}

interface ArchitectureDiagramProps {
  projectId: string
  data?: ArchitectureData
  isLoading?: boolean
}

export function ArchitectureDiagram({ projectId, data, isLoading }: ArchitectureDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [architectureData, setArchitectureData] = useState<ArchitectureData | null>(data || null)
  const [isGenerating, setIsGenerating] = useState(isLoading || false)

  useEffect(() => {
    if (data) {
      setArchitectureData(data)
    }
  }, [data])

  useEffect(() => {
    if (architectureData && svgRef.current) {
      renderDiagram(architectureData)
    }
  }, [architectureData])

  const renderDiagram = (data: ArchitectureData) => {
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    const width = 800
    const height = 600
    const margin = 40

    // Create main group
    const g = svg.append("g")
      .attr("transform", `translate(${margin},${margin})`)

    // Create color scale
    const colorScale = d3.scaleOrdinal<string>()
      .domain(["frontend", "backend", "database", "api", "service", "storage"])
      .range([
        "#3b82f6", // blue for frontend
        "#ef4444", // red for backend
        "#10b981", // green for database
        "#f59e0b", // orange for api
        "#8b5cf6", // purple for service
        "#06b6d4", // cyan for storage
      ])

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes as any)
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter((width - 2 * margin) / 2, (height - 2 * margin) / 2))
      .force("collision", d3.forceCollide().radius(30))

    // Create links
    const link = g.append("g")
      .selectAll("line")
      .data(data.links)
      .enter().append("line")
      .attr("stroke", "#94a3b8")
      .attr("stroke-width", 2)
      .attr("stroke-opacity", 0.6)

    // Create nodes
    const node = g.append("g")
      .selectAll("g")
      .data(data.nodes)
      .enter().append("g")
      .call(d3.drag<any, ArchitectureNode>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x
          d.fy = d.y
        })
        .on("drag", (event, d) => {
          d.fx = event.x
          d.fy = event.y
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null
          d.fy = null
        }))

    // Add circles to nodes
    node.append("circle")
      .attr("r", 25)
      .attr("fill", (d) => colorScale(d.type))
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)

    // Add icons to nodes
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text((d) => {
        const icons: Record<string, string> = {
          frontend: "🎨",
          backend: "⚙️",
          database: "🗄️",
          api: "🔌",
          service: "🔧",
          storage: "💾"
        }
        return icons[d.type] || "📦"
      })

    // Add labels to nodes
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 35)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#1e293b")
      .text((d) => d.name)

    // Add type badges to nodes
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 50)
      .attr("font-size", "10px")
      .attr("fill", "#64748b")
      .text((d) => d.type.toUpperCase())

    // Update positions on tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    // Add zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform)
      })

    svg.call(zoom as any)
  }

  const generateArchitecture = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch(`/api/projects/${projectId}/architecture`)
      if (response.ok) {
        const data = await response.json()
        setArchitectureData(data)
      }
    } catch (error) {
      console.error("Failed to generate architecture:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const exportDiagram = () => {
    if (svgRef.current) {
      const svgData = new XMLSerializer().serializeToString(svgRef.current)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      const img = new Image()
      
      canvas.width = 800
      canvas.height = 600
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0)
        const pngFile = canvas.toDataURL("image/png")
        
        const downloadLink = document.createElement("a")
        downloadLink.download = `architecture-${projectId}.png`
        downloadLink.href = pngFile
        downloadLink.click()
      }
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    }
  }

  if (!architectureData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Network className="h-5 w-5" />
            <span>Repository Architecture</span>
          </CardTitle>
          <CardDescription>
            Generate a visual representation of your repository's architecture
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-12">
          <Network className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Architecture Generated</h3>
          <p className="text-muted-foreground mb-4 text-center">
            Analyze your repository structure to generate a visual architecture diagram
          </p>
          <Button onClick={generateArchitecture} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Generate Architecture
              </>
            )}
          </Button>
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
                <Network className="h-5 w-5" />
                <span>Repository Architecture</span>
              </CardTitle>
              <CardDescription>
                Visual representation of your repository's architecture and components
              </CardDescription>
            </div>
            <Button onClick={exportDiagram} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <svg
              ref={svgRef}
              width="800"
              height="600"
              className="w-full h-auto bg-white"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Architecture Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="explanation" className="space-y-4">
            <TabsList>
              <TabsTrigger value="explanation">AI Explanation</TabsTrigger>
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
            </TabsList>
            
            <TabsContent value="explanation">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{architectureData.explanation}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="components">
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {architectureData.nodes.map((node) => (
                    <div key={node.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{node.name}</h4>
                        <Badge variant="secondary">{node.type}</Badge>
                      </div>
                      {node.technology && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Technology: {node.technology}
                        </p>
                      )}
                      {node.description && (
                        <p className="text-sm text-muted-foreground">
                          {node.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="relationships">
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {architectureData.links.map((link, index) => {
                    const sourceNode = architectureData.nodes.find(n => n.id === link.source)
                    const targetNode = architectureData.nodes.find(n => n.id === link.target)
                    
                    return (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <span className="font-medium">{sourceNode?.name}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-medium">{targetNode?.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {link.type}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}