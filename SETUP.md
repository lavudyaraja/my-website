# DevHub Setup Guide

This guide will help you set up the DevHub application with all required environment variables and configurations.

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Git account
- GitHub account
- (Optional) Stripe account for payments
- (Optional) Google Cloud account for OAuth

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd devhub
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials. See the sections below for detailed setup.

### 3. Database Setup

```bash
# Push the database schema
npm run db:push

# Generate Prisma client
npm run db:generate
```

### 4. Start the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Detailed Configuration

### 1. Database Configuration

The application uses SQLite with Prisma ORM. No external database setup is required.

**Required Variables:**
```env
DATABASE_URL="file:./dev.db"
```

### 2. Authentication Setup

#### NextAuth.js Configuration

**Required Variables:**
```env
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NextAuth Secret:**
```bash
openssl rand -base64 32
```

#### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: DevHub (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** and **Client Secret**

**Add to .env.local:**
```env
GITHUB_CLIENT_ID="your-client-id"
GITHUB_CLIENT_SECRET="your-client-secret"
```

#### Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. Configure the consent screen if prompted
6. Create OAuth 2.0 Client ID:
   - **Application type**: Web application
   - **Name**: DevHub
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret**

**Add to .env.local:**
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. GitHub Integration

#### GitHub Personal Access Token

Required for fetching repository data, commits, and file trees.

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens](https://github.com/settings/tokens)
2. Click "Generate new token" → "Generate new token (classic)"
3. Configure the token:
   - **Note**: DevHub Integration
   - **Expiration**: 90 days or no expiration
   - **Scopes**: 
     - `repo` (Full control of private repositories)
     - `user` (Read user information)
4. Click "Generate token"
5. Copy the token immediately

**Add to .env.local:**
```env
GITHUB_TOKEN="your-github-token"
```

### 4. AI Integration (Z-AI SDK)

The application uses z-ai-web-dev-sdk for AI-powered features.

**Required Variables:**
```env
ZAI_API_KEY="your-zai-api-key"
ZAI_BASE_URL="https://api.z.ai/v1"
```

### 5. Payment Integration (Optional)

#### Stripe Setup

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Get your API keys from the [Developers → API Keys](https://dashboard.stripe.com/apikeys) page
3. Create products and prices for your subscription plans
4. Set up webhook endpoints

**Add to .env.local:**
```env
STRIPE_PUBLISHABLE_KEY="pk_test_your-key"
STRIPE_SECRET_KEY="sk_test_your-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
STRIPE_PRICE_BASIC="price_your-basic-plan-id"
STRIPE_PRICE_PRO="price_your-pro-plan-id"
```

### 6. Vercel Integration (Optional)

For deployment previews and status:

1. Create a [Vercel account](https://vercel.com/)
2. Generate an API token from [Account Settings → Tokens](https://vercel.com/account/tokens)
3. If using a team account, get your team ID

**Add to .env.local:**
```env
VERCEL_TOKEN="your-vercel-token"
VERCEL_TEAM_ID="your-vercel-team-id" # Optional
```

### 7. Email Configuration (Optional)

For email notifications and user communications:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@yourapp.com"
```

### 8. Analytics (Optional)

#### Google Analytics

1. Create a [Google Analytics account](https://analytics.google.com/)
2. Create a new property and data stream
3. Copy the Measurement ID

**Add to .env.local:**
```env
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

#### PostHog (Optional)

1. Create a [PostHog account](https://posthog.com/)
2. Create a new project
3. Copy the project key and host

**Add to .env.local:**
```env
POSTHOG_KEY="your-posthog-key"
POSTHOG_HOST="https://app.posthog.com"
```

## Testing the Setup

### Test Authentication

1. Visit `http://localhost:3000/auth/signin`
2. Try signing in with GitHub or Google
3. Verify you're redirected to the dashboard

### Test GitHub Integration

1. Create a project by adding a GitHub repository URL
2. Verify the project appears in your dashboard
3. Check that repository information, commits, and file tree are loaded

### Test AI Features

1. Go to a project detail page
2. Click on the "Architecture" tab
3. Verify the AI-generated architecture diagram and documentation

### Test Public Showcase

1. From the project detail page, click "Share Project"
2. Copy the public URL
3. Visit the URL in an incognito window to test the public showcase

## Troubleshooting

### Common Issues

#### 1. "client_id is required" Error
- **Cause**: Missing GitHub/Google OAuth credentials
- **Solution**: Verify `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` are set correctly

#### 2. "No secret provided" Error
- **Cause**: Missing `NEXTAUTH_SECRET`
- **Solution**: Generate and add a proper NextAuth secret

#### 3. GitHub API Rate Limiting
- **Cause**: Missing or invalid `GITHUB_TOKEN`
- **Solution**: Verify your GitHub token has the required scopes

#### 4. Database Connection Issues
- **Cause**: Incorrect `DATABASE_URL` or missing database file
- **Solution**: Run `npm run db:push` to create the database

#### 5. AI Features Not Working
- **Cause**: Missing or invalid `ZAI_API_KEY`
- **Solution**: Verify your Z-AI API credentials

### Environment Variables Checklist

Use this checklist to verify all required variables are set:

```bash
# Required for basic functionality
echo "DATABASE_URL: ${DATABASE_URL:?}"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:?}"
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:?}"
echo "GITHUB_TOKEN: ${GITHUB_TOKEN:?}"
echo "GITHUB_CLIENT_ID: ${GITHUB_CLIENT_ID:?}"
echo "GITHUB_CLIENT_SECRET: ${GITHUB_CLIENT_SECRET:?}"
echo "ZAI_API_KEY: ${ZAI_API_KEY:?}"

# Optional features
echo "STRIPE_SECRET_KEY: ${STRIPE_SECRET_KEY:-Not Set}"
echo "GOOGLE_CLIENT_ID: ${GOOGLE_CLIENT_ID:-Not Set}"
echo "VERCEL_TOKEN: ${VERCEL_TOKEN:-Not Set}"
```

## Production Deployment

### Environment Variables for Production

When deploying to production, update these variables:

```env
NEXTAUTH_URL="https://yourapp.com"
DATABASE_URL="file:./production.db"
NODE_ENV="production"
```

### Security Considerations

1. **Never commit `.env.local` to version control**
2. **Use strong secrets and tokens**
3. **Rotate tokens regularly**
4. **Use HTTPS in production**
5. **Set up proper CORS origins**

### Database Migration

For production, you might want to use a more robust database:

```env
# PostgreSQL Example
DATABASE_URL="postgresql://username:password@localhost:5432/devhub"
```

Then run:

```bash
npm run db:migrate
```

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Check the browser console for errors
4. Review the development server logs

For additional help, please create an issue in the repository.