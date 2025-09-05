/**
 * Startup validation and initialization
 * Run this when the application starts
 */

import { validateEnvironmentOnStartup, getEnvironmentStatus } from './env-validation'

export function initializeApp() {
  // Only show startup validation in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Starting DevHub Application...')
    console.log('=====================================\n')

    // Validate environment
    validateEnvironmentOnStartup()

    // Log environment status
    const status = getEnvironmentStatus()
    console.log('📊 Environment Status:')
    console.log(`  • Environment: ${status.nodeEnv}`)
    console.log(`  • Database: ${status.hasDatabase ? '✅' : '❌'}`)
    console.log(`  • Authentication: ${status.hasAuth ? '✅' : '❌'}`)
    console.log(`  • GitHub OAuth: ${status.hasGithub ? '✅' : '❌'}`)
    console.log(`  • Google OAuth: ${status.hasGoogle ? '✅' : '❌'}`)
    console.log(`  • GitHub Token: ${status.hasGithubToken ? '✅' : '❌'}`)
    console.log(`  • AI Features: ${status.hasAI ? '✅' : '❌'}`)
    console.log(`  • Stripe Payments: ${status.hasStripe ? '✅' : '❌'}`)
    console.log(`  • Vercel Integration: ${status.hasVercel ? '✅' : '❌'}`)
    console.log('')

    // Check for critical missing components
    const criticalMissing: string[] = []
    if (!status.hasDatabase) criticalMissing.push('Database')
    if (!status.hasAuth) criticalMissing.push('Authentication')
    if (!status.hasGithubToken) criticalMissing.push('GitHub Token')
    if (!status.hasAI) criticalMissing.push('AI Features')

    if (criticalMissing.length > 0) {
      console.error('❌ Critical components missing:')
      criticalMissing.forEach(component => {
        console.error(`  • ${component}`)
      })
      console.error('\nPlease configure these components to use the application.')
      console.error('Check your .env.local file and see SETUP.md for instructions.\n')
    } else {
      console.log('✅ All critical components are configured!')
      console.log('🎉 Application is ready to start!\n')
    }
  }
}

// Auto-initialize if this file is imported
if (typeof window === 'undefined') {
  // Server-side initialization
  initializeApp()
}