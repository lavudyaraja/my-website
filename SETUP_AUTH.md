# Authentication Setup Guide

The authentication system is not working because the required OAuth credentials are not configured. Follow these steps to set up authentication:

## 🔧 Quick Setup (Required)

### 1. GitHub OAuth Setup
1. Go to [GitHub Developer Settings](https://github.com/settings/applications/new)
2. Create a new OAuth App with these settings:
   - **Application name**: Your App Name
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
3. Copy the **Client ID** and **Client Secret**
4. Update `.env.local`:
   ```
   GITHUB_CLIENT_ID=your_actual_client_id
   GITHUB_CLIENT_SECRET=your_actual_client_secret
   ```

### 2. GitHub API Token (for repository features)
1. Go to [GitHub Personal Access Tokens](https://github.com/settings/tokens)
2. Generate a new token with these scopes:
   - `repo` (for private repositories)
   - `public_repo` (for public repositories)
3. Update `.env.local`:
   ```
   GITHUB_TOKEN=your_actual_token
   ```

### 3. AI Features (Optional)
If you want AI features to work:
1. Get a ZAI API key from your provider
2. Update `.env.local`:
   ```
   ZAI_API_KEY=your_actual_api_key
   ```

## 🌐 For Production Deployment

Update these URLs in your OAuth app settings:
- **Homepage URL**: `https://your-domain.com`
- **Authorization callback URL**: `https://your-domain.com/api/auth/callback/github`

And update `.env.local` (or environment variables in your hosting platform):
```
NEXTAUTH_URL=https://your-domain.com
```

## 🔍 Current Status

The authentication system requires these environment variables:
- ✅ `NEXTAUTH_SECRET` - Generated automatically
- ✅ `NEXTAUTH_URL` - Set to localhost
- ✅ `DATABASE_URL` - SQLite database initialized
- ❌ `GITHUB_CLIENT_ID` - **NEEDS SETUP**
- ❌ `GITHUB_CLIENT_SECRET` - **NEEDS SETUP**
- ❌ `GITHUB_TOKEN` - **NEEDS SETUP**
- ❌ `ZAI_API_KEY` - **NEEDS SETUP**

## 🚀 After Setup

1. Restart your development server: `npm run dev`
2. Visit: `http://localhost:3000/auth/signin`
3. You should see GitHub and Google sign-in options
4. Click "Continue with GitHub" to test authentication

## 🆘 Troubleshooting

If authentication still doesn't work:
1. Check the browser console for errors
2. Verify the OAuth callback URL matches exactly
3. Ensure the GitHub OAuth app is not suspended
4. Check that the environment variables are loaded correctly

## 🔗 Useful Links

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [GitHub OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Prisma Documentation](https://www.prisma.io/docs/)