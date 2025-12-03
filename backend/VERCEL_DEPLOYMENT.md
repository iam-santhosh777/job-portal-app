# Vercel Deployment Guide

## ⚠️ Important Notes

**Socket.io is NOT supported on Vercel** because Vercel uses serverless functions which don't support persistent WebSocket connections. The API will work, but real-time features (Socket.io events) will be disabled.

## 🚀 Deployment Steps

### 1. Install Vercel CLI (Optional)
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

Or deploy from Vercel Dashboard:
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the configuration

### 4. Environment Variables

Add these in Vercel Dashboard → Your Project → Settings → Environment Variables:

```
MYSQL_URL=mysql://user:password@host:port/database
JWT_SECRET=your-strong-secret-key
CLIENT_URL=https://your-frontend-url.vercel.app
NODE_ENV=production
```

### 5. File Uploads Limitation

⚠️ **Important**: Vercel has an ephemeral file system. Uploaded files will be lost when the serverless function restarts.

**Solutions:**
- Use cloud storage (AWS S3, Cloudinary, etc.) instead of local storage
- Store files in a database (as BLOB)
- Use a separate file storage service

## 📝 Configuration Files

### `vercel.json`
This file configures Vercel to use the serverless function in `api/index.js`.

### `api/index.js`
This is the Vercel-compatible entry point that exports the Express app as a serverless function.

## 🔧 Differences from Traditional Server

1. **No Socket.io**: Real-time features disabled
2. **No persistent file storage**: Use cloud storage instead
3. **Cold starts**: First request may be slower
4. **Function timeout**: 30 seconds max (configurable)

## ✅ What Works

- ✅ All REST API endpoints
- ✅ Authentication & Authorization
- ✅ Database operations
- ✅ File uploads (but files won't persist)
- ✅ All business logic

## ❌ What Doesn't Work

- ❌ Socket.io real-time events
- ❌ Persistent file storage (use cloud storage)
- ❌ Long-running processes

## 🔄 Alternative: Use Railway Instead

For full functionality including Socket.io, consider deploying to **Railway** instead:
- Supports Socket.io
- Persistent file storage
- Traditional Node.js server
- Already using Railway for MySQL

See `HRMS_API_DOCUMENTATION.md` for Railway deployment instructions.

