import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { Octokit } from "@octokit/rest"
import ZAI from 'z-ai-web-dev-sdk'

interface ArchitectureNode {
  id: string
  name: string
  type: "frontend" | "backend" | "database" | "api" | "service" | "storage"
  description?: string
  technology?: string
  dependencies?: string[]
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    
    const project = await db.project.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Initialize Octokit
    const octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
    })

    // Parse owner and repo name
    const [owner, repo] = project.repoName.split("/")

    // Fetch repository files and analyze structure
    const { data: treeData } = await octokit.git.getTree({
      owner,
      repo,
      tree_sha: "HEAD",
      recursive: "true",
    })

    // Fetch key configuration files
    const packageJson = await fetchFileContent(octokit, owner, repo, "package.json")
    const dockerCompose = await fetchFileContent(octokit, owner, repo, "docker-compose.yml")
    const dockerComposeAlt = await fetchFileContent(octokit, owner, repo, "docker-compose.yaml")
    const readme = await fetchFileContent(octokit, owner, repo, "README.md")

    // Analyze repository structure and detect components
    const analysis = await analyzeRepository(treeData.tree, packageJson, dockerCompose || dockerComposeAlt, readme)

    // Generate architecture data
    const architectureData: ArchitectureData = {
      nodes: analysis.nodes,
      links: analysis.links,
      explanation: analysis.explanation
    }

    return NextResponse.json(architectureData)
  } catch (error) {
    console.error("Failed to generate architecture:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

async function fetchFileContent(octokit: Octokit, owner: string, repo: string, path: string): Promise<string | null> {
  try {
    const response = await octokit.repos.getContent({ owner, repo, path })
    if ("content" in response.data) {
      return Buffer.from(response.data.content, "base64").toString('utf8')
    }
  } catch (error) {
    // File not found or other error
    return null
  }
  return null
}

async function analyzeRepository(
  tree: any[], 
  packageJson: string | null, 
  dockerCompose: string | null, 
  readme: string | null
) {
  const nodes: ArchitectureNode[] = []
  const links: ArchitectureLink[] = []

  // Detect frontend components
  const frontendFiles = tree.filter(item => 
    item.path.includes("src/components") || 
    item.path.includes("src/pages") || 
    item.path.includes("src/app") ||
    item.path.endsWith(".jsx") ||
    item.path.endsWith(".tsx") ||
    item.path.endsWith(".vue") ||
    item.path.endsWith(".html")
  )

  // Detect backend components
  const backendFiles = tree.filter(item => 
    item.path.includes("src/api") || 
    item.path.includes("src/routes") || 
    item.path.includes("src/controllers") ||
    item.path.includes("src/services") ||
    item.path.endsWith(".js") ||
    item.path.endsWith(".ts") ||
    item.path.endsWith(".py") ||
    item.path.endsWith(".go") ||
    item.path.endsWith(".java")
  )

  // Detect database components
  const databaseFiles = tree.filter(item => 
    item.path.includes("migrations") || 
    item.path.includes("seeds") || 
    item.path.includes("schema") ||
    item.path.endsWith(".sql") ||
    item.path.includes("prisma") ||
    item.path.includes("database")
  )

  // Detect API routes
  const apiFiles = tree.filter(item => 
    item.path.includes("api/") || 
    item.path.includes("routes/") ||
    item.path.includes("endpoints")
  )

  // Parse package.json for dependencies
  let frontendTech = ""
  let backendTech = ""
  let databaseTech = ""

  if (packageJson) {
    try {
      const pkg = JSON.parse(packageJson)
      const deps = { ...pkg.dependencies, ...pkg.devDependencies }
      
      // Detect frontend frameworks
      if (deps.react || deps["next"]) {
        frontendTech = "React/Next.js"
        nodes.push({
          id: "frontend",
          name: "Frontend",
          type: "frontend",
          technology: "React/Next.js",
          description: "User interface built with React and Next.js"
        })
      } else if (deps.vue) {
        frontendTech = "Vue.js"
        nodes.push({
          id: "frontend",
          name: "Frontend",
          type: "frontend",
          technology: "Vue.js",
          description: "User interface built with Vue.js"
        })
      } else if (deps.angular) {
        frontendTech = "Angular"
        nodes.push({
          id: "frontend",
          name: "Frontend",
          type: "frontend",
          technology: "Angular",
          description: "User interface built with Angular"
        })
      }

      // Detect backend frameworks
      if (deps.express) {
        backendTech = "Express.js"
        nodes.push({
          id: "backend",
          name: "Backend",
          type: "backend",
          technology: "Express.js",
          description: "Server-side logic built with Express.js"
        })
      } else if (deps.fastify) {
        backendTech = "Fastify"
        nodes.push({
          id: "backend",
          name: "Backend",
          type: "backend",
          technology: "Fastify",
          description: "Server-side logic built with Fastify"
        })
      } else if (deps.koa) {
        backendTech = "Koa.js"
        nodes.push({
          id: "backend",
          name: "Backend",
          type: "backend",
          technology: "Koa.js",
          description: "Server-side logic built with Koa.js"
        })
      }

      // Detect database
      if (deps.prisma) {
        databaseTech = "Prisma"
        nodes.push({
          id: "database",
          name: "Database",
          type: "database",
          technology: "Prisma",
          description: "Database layer using Prisma ORM"
        })
      } else if (deps.mongoose) {
        databaseTech = "MongoDB"
        nodes.push({
          id: "database",
          name: "Database",
          type: "database",
          technology: "MongoDB",
          description: "NoSQL database using Mongoose"
        })
      } else if (deps.sequelize) {
        databaseTech = "SQL"
        nodes.push({
          id: "database",
          name: "Database",
          type: "database",
          technology: "SQL",
          description: "SQL database using Sequelize ORM"
        })
      }

      // Detect storage
      if (deps["aws-sdk"] || deps["@aws-sdk/client-s3"]) {
        nodes.push({
          id: "storage",
          name: "Storage",
          type: "storage",
          technology: "AWS S3",
          description: "Cloud storage using AWS S3"
        })
      }

    } catch (error) {
      console.error("Failed to parse package.json:", error)
    }
  }

  // Parse docker-compose.yml
  if (dockerCompose) {
    // Simple parsing to detect services
    if (dockerCompose.includes("postgres") || dockerCompose.includes("postgresql")) {
      if (!nodes.find(n => n.id === "database")) {
        nodes.push({
          id: "database",
          name: "Database",
          type: "database",
          technology: "PostgreSQL",
          description: "PostgreSQL database"
        })
      }
    }
    if (dockerCompose.includes("redis")) {
      nodes.push({
        id: "cache",
        name: "Cache",
        type: "service",
        technology: "Redis",
        description: "Redis caching service"
      })
    }
    if (dockerCompose.includes("nginx")) {
      nodes.push({
        id: "proxy",
        name: "Proxy",
        type: "service",
        technology: "Nginx",
        description: "Nginx reverse proxy"
      })
    }
  }

  // Create default nodes if none detected
  if (nodes.length === 0) {
    nodes.push({
      id: "frontend",
      name: "Frontend",
      type: "frontend",
      description: "User interface components"
    })
    nodes.push({
      id: "backend",
      name: "Backend",
      type: "backend",
      description: "Server-side logic"
    })
    nodes.push({
      id: "database",
      name: "Database",
      type: "database",
      description: "Data storage layer"
    })
  }

  // Create links between components
  const frontendNode = nodes.find(n => n.id === "frontend")
  const backendNode = nodes.find(n => n.id === "backend")
  const databaseNode = nodes.find(n => n.id === "database")

  if (frontendNode && backendNode) {
    links.push({
      source: frontendNode.id,
      target: backendNode.id,
      type: "connects"
    })
  }

  if (backendNode && databaseNode) {
    links.push({
      source: backendNode.id,
      target: databaseNode.id,
      type: "uses"
    })
  }

  // Generate AI explanation
  let explanation = ""
  try {
    const zai = await ZAI.create()
    
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert software architect. Analyze the repository structure and provide a clear, concise explanation of the architecture in plain English.'
        },
        {
          role: 'user',
          content: `Analyze this repository architecture and provide a comprehensive explanation:

Components detected:
${nodes.map(n => `- ${n.name} (${n.type}): ${n.description || 'No description'}`).join('\n')}

Relationships:
${links.map(l => `- ${l.source} ${l.type} ${l.target}`).join('\n')}

Repository files:
- Total files: ${tree.length}
- Frontend files: ${frontendFiles.length}
- Backend files: ${backendFiles.length}
- Database files: ${databaseFiles.length}
- API files: ${apiFiles.length}

Technologies detected:
- Frontend: ${frontendTech || 'Unknown'}
- Backend: ${backendTech || 'Unknown'}
- Database: ${databaseTech || 'Unknown'}

Please provide:
1. Overall architecture pattern
2. Main components and their responsibilities
3. Data flow and interactions
4. Technology stack analysis
5. Architecture strengths and considerations`
        }
      ],
    })

    explanation = completion.choices[0]?.message?.content || "Unable to generate architecture explanation."
  } catch (error) {
    explanation = "Architecture analysis completed. The repository has been analyzed and its components have been identified."
  }

  return {
    nodes,
    links,
    explanation
  }
}