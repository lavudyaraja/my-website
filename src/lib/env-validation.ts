/**
 * Environment variable validation
 * This file helps validate that all required environment variables are set
 */

interface EnvValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function validateEnvironment(): EnvValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Required variables for basic functionality
  const requiredVars = [
    'DATABASE_URL',
    'NEXTAUTH_SECRET',
    'NEXTAUTH_URL',
    'GITHUB_TOKEN',
    'ZAI_API_KEY'
  ]

  // Required for authentication
  const authVars = [
    'GITHUB_CLIENT_ID',
    'GITHUB_CLIENT_SECRET'
  ]

  // Optional but recommended
  const optionalVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'STRIPE_SECRET_KEY',
    'VERCEL_TOKEN'
  ]

  // Check required variables
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      errors.push(`Missing required environment variable: ${varName}`)
    }
  })

  // Check authentication variables (at least one OAuth provider)
  const hasGithubAuth = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
  const hasGoogleAuth = process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET

  if (!hasGithubAuth && !hasGoogleAuth) {
    errors.push('At least one OAuth provider must be configured (GitHub or Google)')
  }

  // Check optional variables
  optionalVars.forEach(varName => {
    if (!process.env[varName]) {
      warnings.push(`Optional environment variable not set: ${varName}`)
    }
  })

  // Validate URL formats
  if (process.env.NEXTAUTH_URL) {
    try {
      new URL(process.env.NEXTAUTH_URL)
    } catch {
      errors.push('NEXTAUTH_URL must be a valid URL')
    }
  }

  if (process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL.startsWith('file:') && 
        !process.env.DATABASE_URL.startsWith('postgresql:') &&
        !process.env.DATABASE_URL.startsWith('mysql:')) {
      errors.push('DATABASE_URL must be a valid database connection string')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  }
}

/**
 * Get environment status for debugging
 */
export function getEnvironmentStatus() {
  const status = {
    nodeEnv: process.env.NODE_ENV || 'development',
    hasDatabase: !!process.env.DATABASE_URL,
    hasAuth: !!(process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL),
    hasGithub: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    hasGoogle: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    hasAI: !!process.env.ZAI_API_KEY,
    hasStripe: !!process.env.STRIPE_SECRET_KEY,
    hasVercel: !!process.env.VERCEL_TOKEN,
    requiredVars: {
      DATABASE_URL: !!process.env.DATABASE_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
      ZAI_API_KEY: !!process.env.ZAI_API_KEY
    }
  }

  return status
}

/**
 * Validate environment on startup
 */
export function validateEnvironmentOnStartup() {
  if (process.env.NODE_ENV === 'development') {
    const validation = validateEnvironment()
    
    if (validation.errors.length > 0) {
      console.error('❌ Environment Validation Errors:')
      validation.errors.forEach(error => {
        console.error(`  • ${error}`)
      })
      console.error('\nPlease check your .env.local file and add the required variables.')
      console.error('See .env.example for reference.\n')
    }

    if (validation.warnings.length > 0) {
      console.warn('⚠️ Environment Validation Warnings:')
      validation.warnings.forEach(warning => {
        console.warn(`  • ${warning}`)
      })
      console.warn('\nThese variables are optional but recommended for full functionality.\n')
    }

    if (validation.errors.length === 0) {
      console.log('✅ Environment validation passed')
    }
  }
}