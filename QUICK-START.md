# Quick Start Guide

## 🚀 Fast Setup (No Environment Variables Needed for Basic Testing)

### Option 1: Standard Next.js Development (Recommended for quick testing)
```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run db:push
npm run db:generate

# 3. Start development server (no Socket.IO, but faster)
npm run dev:next

# 4. Open http://localhost:3000
```

### Option 2: Simple Custom Server
```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run db:push
npm run db:generate

# 3. Start with simple server (no Socket.IO)
npm run dev:simple

# 4. Open http://localhost:3000
```

### Option 3: Full Server with Socket.IO
```bash
# 1. Install dependencies
npm install

# 2. Setup database
npm run db:push
npm run db:generate

# 3. Start with full server (includes Socket.IO)
npm run dev

# 4. Open http://localhost:3000
```

## 📋 What Works Without Environment Variables

### ✅ **Basic Features (No .env required)**
- Landing page
- UI components and styling
- Navigation between pages
- Basic page routing
- Database connection (SQLite)
- Project creation forms
- Dashboard layout

### ❌ **Features That Need Environment Variables**
- Authentication (GitHub/Google OAuth)
- GitHub API integration
- AI-powered features
- Architecture diagrams
- Real-time Socket.IO features

## 🔧 When You're Ready for Full Features

1. **Copy environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add required variables (see SETUP.md):**
   ```env
   DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   GITHUB_TOKEN="your-github-token"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ZAI_API_KEY="your-zai-api-key"
   ```

3. **Restart the server:**
   ```bash
   npm run dev
   ```

## 🐛 Troubleshooting

### "tee command not found"
- Use `npm run dev:next` or `npm run dev:simple` instead of `npm run dev`

### "Module not found" errors
- Run `npm install` to ensure all dependencies are installed

### Database errors
- Run `npm run db:push` and `npm run db:generate`

### Port already in use
- Change port in server files or kill existing process on port 3000

## 🎯 Recommended Workflow

1. **Start with `npm run dev:next`** for basic testing
2. **Verify the UI works** and navigation is functional
3. **Add environment variables** when ready for advanced features
4. **Switch to `npm run dev`** for full functionality with Socket.IO

## 📱 What to Expect

### Without Environment Variables:
- ✅ Beautiful landing page
- ✅ Navigation and routing
- ✅ Dashboard layout
- ✅ Project creation forms
- ❌ No authentication
- ❌ No GitHub data
- ❌ No AI features

### With Environment Variables:
- ✅ All basic features above
- ✅ User authentication
- ✅ GitHub integration
- ✅ AI-powered documentation
- ✅ Architecture diagrams
- ✅ Public project showcases
- ✅ Real-time features

## 🚨 Important Notes

- **No .env file is needed** to see the basic UI and test the application
- **Environment variables are only required** for GitHub integration, authentication, and AI features
- **The application will show warnings** in the console about missing configuration, but will still run
- **Use `npm run dev:next`** for the fastest, most reliable local development