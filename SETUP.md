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

2. Edit `backend/.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password_here
   DB_NAME=job_portal_db
   JWT_SECRET=your-secret-key-change-in-production-min-32-characters-long
   ```

### Step 2: Frontend Environment

1. Copy the example file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Edit `frontend/.env` (usually no changes needed for local development):
   ```env
   VITE_API_URL=http://localhost:3000
   ```

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
- Frontend dev server on http://localhost:5173

**Development with Railway backend:**
```bash
npm run dev:prod
```

This starts:
- Frontend dev server on http://localhost:5173 (connects to Railway backend)
- Uses `.env.dev-prod` file with Railway URL

### Production Mode

```bash
npm run build
npm start
```

## 📝 Notes

- The `npm run dev` command uses `concurrently` to run both services
- Environment variables are automatically loaded from `.env` files
- Backend uses `dotenv` to load environment variables
- Frontend uses Vite's built-in environment variable support (prefixed with `VITE_`)

## 🐛 Troubleshooting

**Port conflicts?**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will auto-select next available port

**Database connection issues?**
- Verify MySQL is running
- Check credentials in `backend/.env`
- Ensure database exists: `CREATE DATABASE job_portal_db;`

**Frontend can't reach backend?**
- Verify `VITE_API_URL` in `frontend/.env`
- Check `CLIENT_URL` in `backend/.env` includes frontend URL

