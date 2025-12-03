# Job Portal Application

A full-stack job portal application built with React (Frontend) and Node.js/Express (Backend).

## 🚀 Quick Start

Run the entire application (frontend + backend) with a single command:

```bash
npm run dev
```

This will start both the backend server and frontend development server simultaneously.

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MySQL database** hosted on Railway (or another cloud provider)

## 🛠️ Installation

### 1. Install All Dependencies

From the root directory, run:

```bash
npm run install:all
```

This will install dependencies for the root, backend, and frontend projects.

### 2. Database Setup

This project uses **Railway** for MySQL database hosting. 

1. Create a MySQL service on Railway: https://railway.app
2. Get your connection details from the Railway dashboard
3. You can use either:
   - **MYSQL_URL** (full connection string): `mysql://user:password@host:port/database`
   - **Individual variables**: `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`

**Note:** Make sure to use the **PUBLIC** connection details (not `mysql.railway.internal`) for local development.

### 3. Initialize Database

Create the database schema:

```bash
npm run init-db
```

This will connect to your Railway database and create all necessary tables.

### 4. Environment Configuration

#### Backend Environment Variables

Copy the example file and configure:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your Railway database credentials:

```env
PORT=3000
NODE_ENV=development

# Database Configuration (Railway)
# Option 1: Use full connection URL (recommended)
MYSQL_URL=mysql://user:password@host:port/database

# Option 2: Use individual variables
# DB_HOST=your-railway-host.railway.app
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=railway

# JWT Secret (change this!)
JWT_SECRET=your-secret-key-change-in-production-min-32-characters-long

# CORS Configuration
CLIENT_URL=http://localhost:5173,http://localhost:5175,http://localhost:3000

# Cloudinary (Optional - for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

#### Frontend Environment Variables

Copy the example file and configure:

```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:

```env
# Backend API URL (without /api suffix)
VITE_API_URL=http://localhost:3000

# Environment Mode
VITE_ENV=development
```

## 🎯 Available Scripts

### Root Level Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode |
| `npm start` | Start both frontend and backend in production mode |
| `npm run build` | Build the frontend for production |
| `npm run install:all` | Install all dependencies (root, backend, frontend) |
| `npm run init-db` | Initialize the database schema on Railway |

### Backend Commands

| Command | Description |
|---------|-------------|
| `npm run dev:backend` | Start backend server with nodemon (auto-reload) |
| `npm run start:backend` | Start backend server in production mode |
| `cd backend && npm run init-db` | Initialize database schema |

### Frontend Commands

| Command | Description |
|---------|-------------|
| `npm run dev:frontend` | Start frontend dev server (Vite) |
| `npm run start:frontend` | Preview production build |
| `cd frontend && npm run build` | Build for production |

## 🌐 Application URLs

After running `npm run dev`:

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/health

## 📁 Project Structure

```
job_portal_app/
├── backend/                 # Node.js/Express backend
│   ├── src/                 # Source code
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── sockets/        # Socket.io handlers
│   ├── config/             # Configuration files
│   ├── database/           # Database schemas
│   ├── uploads/            # File uploads directory
│   ├── .env.example        # Environment variables template
│   └── server.js           # Entry point
│
├── frontend/               # React/Vite frontend
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   ├── .env.example        # Environment variables template
│   └── vite.config.ts      # Vite configuration
│
└── package.json            # Root package.json with unified scripts
```

## 🔧 Environment Variables Reference

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `3000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `DB_HOST` | MySQL host (Railway public hostname) | Yes* | - |
| `DB_PORT` | MySQL port | Yes* | `3306` |
| `DB_USER` | MySQL username | Yes* | - |
| `DB_PASSWORD` | MySQL password | Yes* | - |
| `DB_NAME` | Database name | Yes* | - |
| `MYSQL_URL` | Full MySQL connection URL (alternative to individual vars) | Yes* | - |

*Either `MYSQL_URL` or all individual database variables are required
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `CLIENT_URL` | Comma-separated allowed CORS origins | No | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (optional) | No | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key (optional) | No | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (optional) | No | - |

### Frontend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL (without /api) | No | `http://localhost:3000` |
| `VITE_ENV` | Environment mode | No | `development` |

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 5173 is already in use:

1. **Backend**: Change `PORT` in `backend/.env`
2. **Frontend**: Vite will automatically use the next available port

### Database Connection Failed

1. Verify your Railway MySQL service is running and accessible
2. Check database credentials in `backend/.env` match your Railway connection details
3. Ensure you're using the **PUBLIC** hostname (not `mysql.railway.internal`)
4. Verify the database exists in your Railway MySQL service
5. Check Railway service logs for any connection issues

### Frontend Can't Connect to Backend

1. Verify `VITE_API_URL` in `frontend/.env` matches your backend URL
2. Check CORS configuration in `backend/.env` (`CLIENT_URL`)
3. Ensure backend is running on the correct port

### Module Not Found Errors

Run the install command:

```bash
npm run install:all
```

## 📚 Additional Documentation

- **Backend API Documentation**: See `backend/DOCUMENTATION.md`
- **Frontend Documentation**: See `frontend/DOCUMENT.md`
- **Backend README**: See `backend/README.md`
- **Frontend README**: See `frontend/README.md`

## 🚢 Production Deployment

### Building for Production

```bash
# Build frontend
npm run build

# The built files will be in frontend/dist/
```

### Environment Variables in Production

Make sure to set production environment variables:

- **Backend**: Update `backend/.env` with production database credentials
- **Frontend**: Update `frontend/.env` with production API URL

## 📝 License

ISC

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Happy Coding! 🎉**

