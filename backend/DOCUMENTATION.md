# HRMS + Job Portal - Complete Documentation

A comprehensive backend system for HRMS (Human Resource Management System) and Job Portal built with Node.js, Express.js, MySQL, and Socket.io.

## 📋 Table of Contents

1. [Overview & Features](#overview--features)
2. [Quick Start](#quick-start)
3. [Installation & Setup](#installation--setup)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [API Documentation](#api-documentation)
7. [Resume Management](#resume-management)
8. [Cloudinary Setup](#cloudinary-setup)
9. [Authentication & Authorization](#authentication--authorization)
10. [Real-time Features (Socket.io)](#real-time-features-socketio)
11. [Deployment](#deployment)
12. [Frontend Integration](#frontend-integration)
13. [Testing](#testing)
14. [Troubleshooting](#troubleshooting)

---

## 🚀 Overview & Features

### Core Features
- ✅ **Authentication & Authorization**: JWT-based authentication with role-based access control (RBAC)
- ✅ **Job Management**: Create, view, and manage job postings
- ✅ **Application System**: Users can apply to jobs, HR can track applications
- ✅ **Resume Management**: HR can upload and manage resumes with Cloudinary support
- ✅ **Real-time Updates**: Socket.io integration for instant notifications
- ✅ **File Upload**: Multer-based file handling for resume uploads
- ✅ **Analytics Dashboard**: HR dashboard with comprehensive statistics

### Technology Stack
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (jsonwebtoken)
- **File Storage**: Cloudinary (cloud) or Local filesystem
- **Real-time**: Socket.io
- **File Upload**: Multer

---

## ⚡ Quick Start

### 5-Minute Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file:
   ```env
   MYSQL_URL=mysql://user:password@host:port/database
   JWT_SECRET=your-secret-key-here
   PORT=3000
   NODE_ENV=development
   ```

3. **Initialize database:**
   ```bash
   npm run init-db
   ```
   This creates all tables and sample users:
   - **HR**: `hr@example.com` / `password123`
   - **USER**: `user@example.com` / `password123`

4. **Start the server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:3000`

### Quick Test

**Login as HR:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@example.com","password":"password123"}'
```

**Create a Job:**
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Software Engineer",
    "description": "We are hiring!",
    "salary": "$80,000",
    "location": "Remote"
  }'
```

---

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL database (local or Railway)
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: MySQL Database Setup

This project uses **Railway** for MySQL database hosting.

1. **Create a MySQL service on Railway:**
   - Sign up at: https://railway.app
   - Create a new MySQL service
   - Get connection details from service settings

2. **Connection Options:**
   - Use **MYSQL_URL** (full connection string): `mysql://user:password@host:port/database`
   - Or use individual variables: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

**Important:** Use the **PUBLIC** hostname from Railway (not `mysql.railway.internal`) for local development.

**Alternative Cloud Providers:**
- **PlanetScale**: https://planetscale.com
- **Aiven**: https://aiven.io
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### Step 3: Project Structure
```
nodejs_project/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & error handling
│   ├── services/         # Business logic
│   ├── sockets/          # Socket.io handlers
│   └── utils/            # Utilities (multer, cloudinary)
├── config/
│   ├── database.js       # Database configuration
│   └── cloudinary.js     # Cloudinary configuration
├── uploads/
│   └── resumes/          # Local file storage (fallback)
├── scripts/
│   └── init-database.js  # Database initialization
└── server.js             # Main server file
```

---

## 🗄 Database Setup

### Method 1: Using Railway Dashboard (Recommended)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Open your project
   - Click on your **MySQL service**

2. **Open Query Editor**
   - Look for **"Query"** tab or **"Data"** tab
   - Or click **"Connect"** → **"Query"**

3. **Run the SQL**
   - Copy the SQL from `scripts/init-database.js` (the table creation queries)
   - Paste it into the query editor
   - Click **"Run"** or **"Execute"**

4. **Verify**
   - You should see the tables created

### Method 2: Using npm Script (Recommended)

```bash
npm run init-db
```

### Database Schema

**Users:**
- `id` (INT AUTO_INCREMENT PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR - bcrypt hashed)
- `role` (VARCHAR: 'HR' | 'USER')
- `created_at` (TIMESTAMP)

**Jobs:**
- `id` (INT AUTO_INCREMENT PRIMARY KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `salary` (VARCHAR)
- `location` (VARCHAR)
- `expiry_status` (VARCHAR: 'active' | 'expired')
- `posted_by` (INTEGER, FK to users)
- `created_at` (TIMESTAMP)

**Applications:**
- `id` (INT AUTO_INCREMENT PRIMARY KEY)
- `job_id` (INTEGER, FK to jobs)
- `user_id` (INTEGER, FK to users)
- `status` (VARCHAR: 'pending' | 'accepted' | 'rejected')
- `created_at` (TIMESTAMP)
- UNIQUE(job_id, user_id)

**Resumes:**
- `id` (INT AUTO_INCREMENT PRIMARY KEY)
- `job_id` (INTEGER, FK to jobs, nullable)
- `hr_id` (INTEGER, FK to users)
- `filename` (VARCHAR)
- `file_path` (VARCHAR)
- `status` (VARCHAR: 'uploaded' | 'failed')
- `created_at` (TIMESTAMP)

---

## ⚙ Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
MYSQL_URL=mysql://user:password@host:port/database
# Or use individual variables:
# DB_HOST=hostname
# DB_PORT=3306
# DB_USER=username
# DB_PASSWORD=password
# DB_NAME=database

# JWT Secret (use a strong secret in production)
JWT_SECRET=your-secret-key-here

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:3000,https://your-frontend-url.com

# Cloudinary Configuration (Optional - for cloud file storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Environment Variables Checklist

- [ ] `MYSQL_URL` or database connection variables
- [ ] `JWT_SECRET` (strong secret key)
- [ ] `PORT` (default: 3000)
- [ ] `NODE_ENV` (development/production)
- [ ] `CLIENT_URL` (for CORS - comma-separated for multiple)
- [ ] Cloudinary variables (optional - for cloud storage)

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
All protected endpoints require:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication APIs

### Login
**POST** `/api/auth/login`

Request:
```json
{
  "email": "hr@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "HR Manager",
      "email": "hr@example.com",
      "role": "HR"
    }
  }
}
```

### Register (Optional - for testing)
**POST** `/api/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "USER"
}
```

---

## 👔 HR APIs

All HR endpoints require authentication token in header:
```
Authorization: Bearer <token>
```

### Create Job
**POST** `/api/jobs`

Request:
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for an experienced software engineer...",
  "salary": "$80,000 - $120,000",
  "location": "Remote"
}
```

### Mark Job as Expired
**PATCH** `/api/jobs/:id/expire`

### Get HR's Jobs
**GET** `/api/jobs/hr/my-jobs`

### Get Dashboard Analytics
**GET** `/api/dashboard`

Response:
```json
{
  "success": true,
  "message": "Dashboard analytics retrieved successfully",
  "data": {
    "totalJobs": 15,
    "totalActiveJobs": 12,
    "totalExpired": 3,
    "totalApplications": 45,
    "totalResumesUploaded": 20,
    "uploadedResumes": 18,
    "failedResumes": 2
  }
}
```

---

## 👤 User APIs

All User endpoints require authentication token in header:
```
Authorization: Bearer <token>
```

### Get Active Jobs
**GET** `/api/jobs`

Returns all active (non-expired) jobs.

### Apply for Job
**POST** `/api/jobs/:id/apply`

Applies the authenticated user to the specified job.

---

## 📄 Resume Management

### Base URL
```
http://localhost:3000/api/resumes
```

All endpoints require HR authentication:
```
Authorization: Bearer <JWT_TOKEN>
```

### 1. Upload Resumes
**POST** `/api/resumes/upload`

Upload one or multiple resume files. Files are automatically saved to Cloudinary (if configured) or local storage.

**Request:**
- **Content-Type**: `multipart/form-data`
- **Body (form-data)**:
  - `resume` (File) - Resume file (PDF, DOC, DOCX, JPEG, JPG, PNG)
  - `jobId` (Text, optional) - Associate resume with a job

**Response:**
```json
{
  "success": true,
  "message": "Processed 1 file(s)",
  "data": {
    "uploaded": [
      {
        "id": 1,
        "filename": "John_Doe_Resume.pdf",
        "filePath": "https://res.cloudinary.com/.../resume.pdf",
        "fileUrl": "https://res.cloudinary.com/.../resume.pdf",
        "status": "uploaded"
      }
    ],
    "failed": []
  }
}
```

**Example (cURL):**
```bash
curl -X POST http://localhost:3000/api/resumes/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@/path/to/resume.pdf" \
  -F "jobId=123"
```

**Example (PowerShell):**
```powershell
$token = "YOUR_TOKEN_HERE"
$filePath = "C:\path\to\your\resume.pdf"

$formData = @{
    resume = Get-Item -Path $filePath
    jobId = "123"  # Optional
}

Invoke-RestMethod -Uri "http://localhost:3000/api/resumes/upload" `
  -Method POST `
  -Headers @{Authorization = "Bearer $token"} `
  -Form $formData
```

### 2. Get All Resumes
**GET** `/api/resumes`

Get all resumes uploaded by the authenticated HR user.

**Response:**
```json
{
  "success": true,
  "message": "Resumes retrieved successfully",
  "data": [
    {
      "id": 1,
      "filename": "John_Doe_Resume.pdf",
      "jobId": 123,
      "jobTitle": "Software Engineer",
      "status": "uploaded",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "downloadUrl": "http://localhost:3000/api/resumes/1/download",
      "viewUrl": "http://localhost:3000/api/resumes/1/url",
      "cloudinaryUrl": "https://res.cloudinary.com/.../resume.pdf",
      "filePath": "https://res.cloudinary.com/.../resume.pdf"
    }
  ],
  "count": 1
}
```

### 3. Get Resume URL
**GET** `/api/resumes/:id/url`

Get viewable and downloadable URLs for a specific resume.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "filename": "John_Doe_Resume.pdf",
    "url": "https://res.cloudinary.com/.../resume.pdf",
    "downloadUrl": "https://res.cloudinary.com/.../fl_attachment/resume.pdf",
    "apiDownloadUrl": "http://localhost:3000/api/resumes/1/download"
  }
}
```

### 4. Download Resume
**GET** `/api/resumes/:id/download`

Download a resume file. Redirects to Cloudinary download URL or streams local file.

**Example (cURL):**
```bash
curl -X GET http://localhost:3000/api/resumes/1/download \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o resume.pdf
```

### 5. Delete Resume
**DELETE** `/api/resumes/:id`

Delete a resume. Removes from database and Cloudinary/local storage.

**Response:**
```json
{
  "success": true,
  "message": "Resume deleted successfully",
  "data": {
    "id": 1,
    "filename": "John_Doe_Resume.pdf"
  }
}
```

**Example (cURL):**
```bash
curl -X DELETE http://localhost:3000/api/resumes/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Example (PowerShell):**
```powershell
$token = "YOUR_TOKEN_HERE"
$resumeId = 4

Invoke-RestMethod -Uri "http://localhost:3000/api/resumes/$resumeId" `
  -Method DELETE `
  -Headers @{Authorization = "Bearer $token"}
```

### File Requirements
- **Max Size**: 10MB per file
- **Allowed Types**: PDF, DOC, DOCX, JPEG, JPG, PNG
- **Max Files**: 10 files per request

---

## ☁ Cloudinary Setup

### Why Cloudinary?
- ✅ Global CDN for fast file delivery worldwide
- ✅ Automatic optimization (image compression, format conversion)
- ✅ Secure with built-in access control
- ✅ Analytics to track file views and bandwidth
- ✅ On-the-fly transformations (resize, crop, convert formats)
- ✅ Scalable with no server storage limits
- ✅ Better performance than local file serving

### Setup Instructions

#### 1. Create Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (25GB storage, 25GB bandwidth/month)
3. Go to Dashboard → Settings → Security

#### 2. Get Your Credentials
From Cloudinary Dashboard, copy:
- **Cloud Name**
- **API Key**
- **API Secret**

#### 3. Add to `.env` File
```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### 4. Restart Your Server
```bash
npm start
# or
npm run dev
```

### How It Works

#### Automatic Fallback
- ✅ **If Cloudinary is configured**: Files upload to Cloudinary
- ✅ **If Cloudinary is NOT configured**: Falls back to local storage (`uploads/resumes/`)

#### File Organization in Cloudinary
Files are organized in this structure:
```
resumes/
  ├── 2024/
  │   ├── 01/          (January)
  │   │   ├── 1/       (HR ID)
  │   │   │   ├── job-123/  (Job ID or 'general')
  │   │   │   │   └── 1705123456_789012_resume.pdf
```

### Cloudinary Features

#### 1. Image Transformations (for JPEG/PNG resumes)
Add transformations to URLs:
- Resize: `?w=800,h=1000`
- Quality: `?q_auto`
- Format: `?f_auto`

#### 2. Secure URLs
- Signed URLs with expiration
- Access control by folder
- Watermarking

### Free Tier Limits
- **Storage**: 25GB
- **Bandwidth**: 25GB/month
- **Transformations**: 25,000/month
- **Uploads**: Unlimited

### Troubleshooting

**"Cloudinary configuration error"**
- Check your `.env` file has all three variables
- Verify credentials from Cloudinary dashboard
- Restart server after adding credentials

**"File upload fails"**
- Check file size (10MB limit)
- Check file type (PDF, DOC, DOCX, JPEG, JPG, PNG)
- Check Cloudinary account limits (free tier: 25GB)

**"Files not appearing"**
- Check Cloudinary dashboard → Media Library
- Verify folder structure matches: `resumes/YYYY/MM/HR_ID/job_ID/`

---

## 🔒 Authentication & Authorization

### JWT Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Role-Based Access Control (RBAC)

#### HR Role
- ✅ Can create jobs
- ✅ Can mark jobs as expired
- ✅ Can upload resumes
- ✅ Can view dashboard analytics
- ✅ Can view all their jobs
- ✅ Can delete resumes

#### USER Role
- ✅ Can view active jobs
- ✅ Can apply to jobs

### Sample Users (Created by init-db script)
- **HR**: `hr@example.com` / `password123`
- **USER**: `user@example.com` / `password123`

⚠️ **Change these passwords in production!**

---

## 🔔 Real-time Features (Socket.io)

### Connection
Connect to Socket.io server with authentication:
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events Emitted by Server

#### 1. new-application (to HR users)
```json
{
  "applicationId": 1,
  "jobId": 5,
  "jobTitle": "Senior Developer",
  "userId": 3,
  "message": "New application received for job: Senior Developer"
}
```

#### 2. job-expired (to all users)
```json
{
  "jobId": 5,
  "jobTitle": "Senior Developer",
  "message": "Job \"Senior Developer\" has been marked as expired"
}
```

### Events You Can Emit

**ping**: Test connection
```javascript
socket.emit('ping');
```

### Testing Socket.io
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected!');
});

socket.on('new-application', (data) => {
  console.log('New application:', data);
});

socket.on('job-expired', (data) => {
  console.log('Job expired:', data);
});
```

---

## 🚢 Deployment

### Railway Deployment (Recommended)

#### Why Railway?
- ✅ Already using Railway for MySQL
- ✅ Supports Socket.io (real-time features work!)
- ✅ Persistent file storage
- ✅ Traditional Node.js server (no serverless limitations)
- ✅ Easy deployment from GitHub
- ✅ Automatic HTTPS

#### Deployment Steps

**Option 1: Deploy via Railway Dashboard (Recommended)**

1. **Go to Railway Dashboard**
   - Visit: https://railway.app
   - Login to your account

2. **Create New Service**
   - Click "New Project" (or add to existing project)
   - Select "Deploy from GitHub repo"
   - Choose your repository
   - Railway will auto-detect Node.js

3. **Link MySQL Database**
   - In your new service, click "Variables" tab
   - Click "New Variable"
   - Select "Reference Variable"
   - Choose your MySQL service
   - Select `DATABASE_URL` or `MYSQL_URL`
   - This will auto-populate your database connection

4. **Add Environment Variables**
   - `JWT_SECRET` - Set a strong secret key
   - `NODE_ENV=production`
   - `CLIENT_URL` - Your frontend URL (for CORS)
   - `PORT` - Railway sets this automatically (optional)
   - Cloudinary variables (if using cloud storage)

5. **Deploy**
   - Railway will automatically build and deploy
   - Watch the build logs
   - Your app will be live at: `https://your-app-name.up.railway.app`

**Option 2: Deploy via Railway CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize Project
railway init

# Add Environment Variables
railway variables set JWT_SECRET=your-secret-key
railway variables set NODE_ENV=production
railway variables set CLIENT_URL=https://your-frontend-url.com

# Deploy
railway up
```

#### Post-Deployment Steps

**1. Initialize Database**
After first deployment, run the database initialization:

**Via Railway Dashboard:**
- Go to your service → "Deployments" tab
- Click on the latest deployment
- Open "Shell" or "Logs"
- Run: `npm run init-db`

**Via Railway CLI:**
```bash
railway run npm run init-db
```

**2. Verify Deployment**
- Check health endpoint: `https://your-app.up.railway.app/api/health`
- Test login: `POST https://your-app.up.railway.app/api/auth/login`

#### Railway Deployment Checklist
- [ ] Code pushed to GitHub
- [ ] Railway service created
- [ ] MySQL database linked
- [ ] Environment variables set
- [ ] Service deployed successfully
- [ ] Database initialized (`npm run init-db`)
- [ ] Health check passes
- [ ] API endpoints tested
- [ ] Socket.io connection tested (if using frontend)

### Vercel Deployment (Alternative)

⚠️ **Important Notes:**
- **Socket.io is NOT supported on Vercel** (serverless functions don't support WebSocket)
- **No persistent file storage** (use cloud storage like Cloudinary)
- API endpoints will work, but real-time features will be disabled

See `VERCEL_DEPLOYMENT.md` for Vercel-specific instructions.

---

## 🌐 Frontend Integration

### Getting Your Railway Backend URL

#### Method 1: Railway Dashboard
1. Go to Railway Dashboard: https://railway.app
2. Click on your deployed backend service
3. Go to **Settings** → **Domains**
4. Copy your Railway URL: `https://your-app-name.up.railway.app`

#### Method 2: Railway CLI
```bash
railway domain
```

### Frontend Configuration

#### Step 1: Update Frontend Environment Variables

**`.env.development`** (for local development):
```env
VITE_API_URL=http://localhost:3000
# or
REACT_APP_API_URL=http://localhost:3000
```

**`.env.production`** (for production):
```env
VITE_API_URL=https://your-app-name.up.railway.app
# or
REACT_APP_API_URL=https://your-app-name.up.railway.app
```

#### Step 2: Update Frontend API Configuration

**If using Axios:**
```javascript
// axios.js or api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**If using Fetch:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  return response.json();
};
```

#### Step 3: Update Socket.io Connection (Frontend)

```javascript
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const token = localStorage.getItem('token');

const socket = io(API_URL, {
  auth: {
    token: token
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected to backend');
});

socket.on('new-application', (data) => {
  console.log('New application:', data);
  // Handle new application notification
});

socket.on('job-expired', (data) => {
  console.log('Job expired:', data);
  // Handle job expired notification
});
```

#### Step 4: Update CORS in Railway Backend

1. **Go to Railway Dashboard** → Your Service → Variables
2. **Add/Update:**
   ```
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
   Or for multiple domains (comma-separated):
   ```
   CLIENT_URL=https://frontend1.vercel.app,https://frontend2.vercel.app
   ```

### Frontend Integration Example (React)

```javascript
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const token = localStorage.getItem('token');

// 1. Upload Resume
const uploadResume = async (file, jobId = null) => {
  const formData = new FormData();
  formData.append('resume', file);
  if (jobId) formData.append('jobId', jobId);

  const response = await fetch(`${API_BASE}/api/resumes/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  return await response.json();
};

// 2. Get All Resumes
const getResumes = async () => {
  const response = await fetch(`${API_BASE}/api/resumes`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
};

// 3. Download Resume
const downloadResume = async (resumeId, filename) => {
  const response = await fetch(`${API_BASE}/api/resumes/${resumeId}/download`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

// 4. Delete Resume
const deleteResume = async (resumeId) => {
  const response = await fetch(`${API_BASE}/api/resumes/${resumeId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return await response.json();
};
```

### Frontend Setup Checklist
- [ ] Got Railway backend URL
- [ ] Updated `.env.production` with Railway URL
- [ ] Updated all API calls to use environment variable
- [ ] Updated Socket.io connection to use environment variable
- [ ] Set `CLIENT_URL` in Railway for CORS
- [ ] Redeployed frontend to Vercel
- [ ] Tested the connection

---

## 🧪 Testing

### Testing API Endpoints

#### Using Browser (for GET requests)
- **API Info:** http://localhost:3000/
- **Health Check:** http://localhost:3000/api/health
- **Get All Users:** http://localhost:3000/api/users

#### Using PowerShell

**Get all users:**
```powershell
Invoke-RestMethod -Uri http://localhost:3000/api/users -Method Get
```

**Create a new user:**
```powershell
$body = @{
    name = "John Doe"
    email = "john.doe@example.com"
    age = 30
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/users -Method Post -Body $body -ContentType "application/json"
```

#### Using cURL

**Login as HR:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@example.com","password":"password123"}'
```

**Create Job:**
```bash
curl -X POST http://localhost:3000/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Full Stack Developer",
    "description": "Looking for experienced developer",
    "salary": "$70,000 - $100,000",
    "location": "San Francisco, CA"
  }'
```

**Get Active Jobs:**
```bash
curl http://localhost:3000/api/jobs
```

**Apply for Job:**
```bash
curl -X POST http://localhost:3000/api/jobs/1/apply \
  -H "Authorization: Bearer USER_TOKEN"
```

### Testing Resume Upload

#### Method 1: Using curl with actual file
```bash
curl -X POST http://localhost:3000/api/resumes/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: multipart/form-data" \
  -F "resume=@/path/to/your/resume.pdf" \
  -F "jobId=123"  # Optional
```

#### Method 2: Using PowerShell
```powershell
$token = "YOUR_TOKEN_HERE"
$filePath = "C:\path\to\your\resume.pdf"

$formData = @{
    resume = Get-Item -Path $filePath
    jobId = "123"  # Optional
}

Invoke-RestMethod -Uri "http://localhost:3000/api/resumes/upload" `
  -Method POST `
  -Headers @{Authorization = "Bearer $token"} `
  -Form $formData
```

#### Method 3: Using Postman or Thunder Client
1. **Method**: POST
2. **URL**: `http://localhost:3000/api/resumes/upload`
3. **Headers**:
   - `Authorization: Bearer YOUR_TOKEN`
4. **Body**: form-data
   - Key: `resume` (type: File)
   - Value: Select your PDF file
   - Key: `jobId` (type: Text, optional)
   - Value: `123`

#### Method 4: Using fetch in browser console
```javascript
const formData = new FormData();
formData.append('resume', fileInput.files[0]); // fileInput is your <input type="file">
formData.append('jobId', '123'); // Optional

fetch('http://localhost:3000/api/resumes/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  },
  body: formData
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

### Testing DELETE Route

**Important:** After adding a new route, you MUST restart the server:
```bash
# Stop server (Ctrl+C)
npm start
# or
npm run dev
```

**Test with PowerShell:**
```powershell
$token = "YOUR_TOKEN_HERE"
$resumeId = 4

Invoke-RestMethod -Uri "http://localhost:3000/api/resumes/$resumeId" `
  -Method DELETE `
  -Headers @{Authorization = "Bearer $token"}
```

**Check Server Logs:**
When you make the DELETE request, you should see in server console:
- `🗑️  Delete resume request received`
- `📋 req.params: { id: '4' }`
- `📋 req.method: DELETE`

### Debug Script for DELETE Route

If you're having issues with DELETE routes, you can use this debug script to test if Express routing is working correctly:

**Create `DEBUG_DELETE_ROUTE.js`:**
```javascript
// Debug script to test DELETE route
// Run: node DEBUG_DELETE_ROUTE.js

const express = require('express');
const app = express();

// Test router
const testRouter = express.Router();
testRouter.delete('/:id', (req, res) => {
  console.log('✅ DELETE route matched!');
  console.log('ID:', req.params.id);
  res.json({ success: true, message: 'DELETE route works', id: req.params.id });
});

app.use('/test', testRouter);

app.listen(3001, () => {
  console.log('Test server on port 3001');
  console.log('Test: DELETE http://localhost:3001/test/123');
});
```

**Run the debug script:**
```bash
node DEBUG_DELETE_ROUTE.js
```

**Test the debug route:**
```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/test/123" -Method DELETE

# Or cURL
curl -X DELETE http://localhost:3001/test/123
```

If this works, it confirms Express routing is functioning. If it doesn't work, check your Express setup or middleware configuration.

### Expected Responses

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

---

## 🐛 Troubleshooting

### Database Connection Issues

**"Access denied"**
- Make sure you're using the correct credentials from Railway
- Verify `DATABASE_URL` or `MYSQL_URL` is correctly linked from MySQL service

**"Database doesn't exist"**
- Railway should create the database automatically
- Check your database name in Railway variables (should be `railway`)

**"Table already exists"**
- That's fine! The `IF NOT EXISTS` clause prevents errors
- Your table is ready to use

**"Table 'users' doesn't exist"**
- Run the CREATE TABLE SQL in Railway's query editor
- Or run `npm run init-db`

### Server Issues

**"Port already in use"**
- Change `PORT` in `.env` file
- Or kill the process using port 3000

**"Module not found"**
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then reinstall

**"Empty response" or "Cannot GET /api/users"**
- Make sure your server is running (`npm start`)
- Check the server is on port 3000

**"Connection timeout"**
- Railway free tier databases might sleep - first request might be slow
- Check Railway dashboard to ensure MySQL service is running

### File Upload Issues

**"No files uploaded"**
- Check field name is `resume` or `resumes`
- Ensure file is actually included in request

**"Cloudinary not configured"**
- Check `.env` file has all three Cloudinary variables
- Restart server after adding credentials

**"File too large"**
- Max file size is 10MB
- Check file size before uploading

**"Invalid file type"**
- Allowed: PDF, DOC, DOCX, JPEG, JPG, PNG
- Check file extension and MIME type

### CORS Issues

**"CORS policy blocked"**
- Add your frontend URL to `CLIENT_URL` in Railway
- Check CORS configuration in `server.js`
- Ensure frontend is using the correct backend URL (not localhost in production)

### Route Issues

**"404 Not Found" on DELETE route**
- Most common: Server not restarted after adding route
- Check route order - DELETE route must be before GET `/:id/url` and `/:id/download`
- Clear node_modules/.cache if using nodemon
- Verify port conflict - make sure server is running on port 3000

### Deployment Issues

**Build Failures**
- Check `package.json` has correct start script
- Verify all dependencies are in `dependencies` (not `devDependencies`)
- Check build logs for errors

**Port Issues**
- Railway sets `PORT` automatically
- Don't hardcode port 3000
- Use `process.env.PORT || 3000` (already done in server.js)

**Socket.io Connection Failed**
- Ensure Railway URL uses HTTPS
- Check Socket.io transport settings
- Verify token is being sent in auth

### Testing Issues

**"DELETE route returns 404"**
1. Restart your server (most common issue)
2. Verify route is registered (check server console on startup)
3. Check route order in `src/routes/resumes.js`
4. Verify module caching - clear node_modules/.cache if using nodemon

**"Files not appearing"**
- Check Cloudinary dashboard → Media Library
- Verify folder structure matches: `resumes/YYYY/MM/HR_ID/job_ID/`
- Check server logs for upload confirmation

---

## 📦 Dependencies

### Core Dependencies
- **express**: Web framework
- **mysql2**: MySQL client
- **jsonwebtoken**: JWT authentication
- **bcryptjs**: Password hashing
- **multer**: File upload handling
- **socket.io**: Real-time communication
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Optional Dependencies
- **cloudinary**: Cloud file storage (if using Cloudinary)
- **multer-storage-cloudinary**: Cloudinary storage engine

---

## 📝 Development Notes

### Auto-reload
- Uses nodemon in dev mode (`npm run dev`)
- Automatically restarts on file changes

### File Uploads
- Stored in `uploads/resumes/` (local fallback)
- Or Cloudinary (if configured)

### Logging
- Console logs for debugging
- Error stack shown in development, hidden in production

### Error Handling
All errors follow this format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## ✅ Implementation Summary

### Completed Features
- ✅ JWT-based authentication
- ✅ Role-based authorization (HR/USER)
- ✅ Job management (create, expire, view)
- ✅ Application system (apply, track)
- ✅ Resume management (upload, view, download, delete)
- ✅ Cloudinary integration (with local fallback)
- ✅ Real-time notifications (Socket.io)
- ✅ Analytics dashboard
- ✅ File upload with validation
- ✅ Database initialization script
- ✅ Comprehensive error handling
- ✅ CORS configuration
- ✅ Health check endpoint

### Architecture
- Scalable folder structure
- Separation of concerns (routes, controllers, models, services)
- Middleware for auth and error handling
- Database connection pooling
- Indexes for performance optimization

---

## 📄 License

ISC

---

## 🎉 You're All Set!

Your HRMS + Job Portal backend is ready for production! 

**Next Steps:**
1. Change default passwords
2. Set a strong `JWT_SECRET`
3. Configure CORS for your frontend
4. Set up Cloudinary (optional but recommended)
5. Deploy to Railway
6. Connect your frontend

For questions or issues, refer to the troubleshooting section above.

