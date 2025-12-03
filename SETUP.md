# Quick Setup Guide

## 🚀 One-Command Setup

After cloning the repository, run:

```bash
npm run install:all
```

Then configure your environment files (see below) and run:

```bash
npm run dev
```

That's it! Your entire application will be running.

## ⚙️ Environment Setup

### Step 1: Backend Environment

1. Copy the example file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edit `backend/.env` with your Railway database credentials:
   ```env
   # Option 1: Use full connection URL (recommended)
   MYSQL_URL=mysql://user:password@host:port/database
   
   # Option 2: Use individual variables
   # DB_HOST=your-railway-host.railway.app
   # DB_PORT=3306
   # DB_USER=root
   # DB_PASSWORD=your_password_here
   # DB_NAME=railway
   
   JWT_SECRET=your-secret-key-change-in-production-min-32-characters-long
   ```
   
   **Note:** Get your Railway connection details from the Railway dashboard. Use the PUBLIC hostname (not `mysql.railway.internal`).

### Step 2: Frontend Environment

1. Copy the example file:
   ```bash
   cp frontend/.env.example frontend/.env.local
   ```

2. Edit `frontend/.env.local` (usually no changes needed for local development):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```
   
   **Note:** Next.js uses `.env.local` for local development (this file is gitignored).

### Step 3: Initialize Database

```bash
npm run init-db
```

## 🎯 Running the Application

### Development Mode (Recommended)

**Local development (frontend + backend on localhost):**
```bash
npm run dev
```

This starts:
- Backend server on http://localhost:3000
- Frontend dev server on http://localhost:3000 (Next.js default port)

**Note:** If you get a port conflict, Next.js will automatically use the next available port (usually 3001).

**Development with Railway backend:**
1. Create `frontend/.env.local` with Railway URL:
   ```env
   NEXT_PUBLIC_API_URL=https://backend-nodejs-jobportal-production.up.railway.app/api
   ```
2. Run:
   ```bash
   npm run dev:frontend
   ```

### Production Mode

```bash
npm run build
npm start
```

## 📝 Notes

- The `npm run dev` command uses `concurrently` to run both services
- Environment variables are automatically loaded from `.env` files
- Backend uses `dotenv` to load environment variables
- Frontend uses Next.js environment variable support (prefixed with `NEXT_PUBLIC_`)
- Next.js frontend runs on port 3000 by default (same as backend, but Next.js will auto-select next port if conflict)

## 🐛 Troubleshooting

**Port conflicts?**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Next.js will auto-select next available port (usually 3001 if 3000 is taken)

**Database connection issues?**
- Verify Railway MySQL service is running
- Check credentials in `backend/.env` match Railway connection details
- Ensure you're using PUBLIC hostname (not `mysql.railway.internal`)
- Check Railway service logs for connection errors

**Frontend can't reach backend?**
- Verify `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Make sure the URL includes `/api` suffix (e.g., `http://localhost:3000/api`)
- Check `CLIENT_URL` in `backend/.env` includes frontend URL
- Restart the Next.js dev server after changing environment variables

