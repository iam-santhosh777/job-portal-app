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
- **MySQL** database (see setup options below)

## 🛠️ Installation

### 1. Install All Dependencies

From the root directory, run:

```bash
npm run install:all
```

This will install dependencies for the root, backend, and frontend projects.

### 2. Database Setup

Choose one of the following options:

#### Option A: Docker (Recommended for Local Development)

```bash
docker run --name mysql-jobportal \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=job_portal_db \
  -p 3306:3306 \
  -d mysql:8.0
```

#### Option B: Cloud MySQL (Free Tier Available)

- **Railway**: https://railway.app
- **PlanetScale**: https://planetscale.com
- **Aiven**: https://aiven.io

#### Option C: Local MySQL Installation

**Windows:**
- Download MySQL Installer from: https://dev.mysql.com/downloads/installer/

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 3. Initialize Database

Create the database schema:

```bash
npm run init-db
```

Or manually run the SQL script:
```bash
mysql -u root -p < backend/database/schema.sql
```

### 4. Environment Configuration

#### Backend Environment Variables

Copy the example file and configure:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your database credentials:

```env
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=job_portal_db

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

> **Note:** Use `npm run dev` for local development with localhost backend, or `npm run dev:prod` to connect to Railway backend while developing locally.

### Root Level Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development mode (localhost) |
| `npm run dev:prod` | Start frontend in dev mode connecting to Railway backend |
| `npm start` | Start both frontend and backend in production mode |
| `npm run build` | Build the frontend for production |
| `npm run install:all` | Install all dependencies (root, backend, frontend) |
| `npm run init-db` | Initialize the database schema |

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

- **Frontend**: http://localhost:5173
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
| `DB_HOST` | MySQL host | Yes | `localhost` |
| `DB_PORT` | MySQL port | No | `3306` |
| `DB_USER` | MySQL username | Yes | `root` |
| `DB_PASSWORD` | MySQL password | Yes | - |
| `DB_NAME` | Database name | Yes | `job_portal_db` |
| `MYSQL_URL` | Full MySQL connection URL (alternative to individual vars) | No | - |
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

1. Verify MySQL is running:
   ```bash
   # Docker
   docker ps
   
   # Local MySQL
   # Windows: Check Services panel
   # macOS/Linux: sudo systemctl status mysql
   ```

2. Check database credentials in `backend/.env`
3. Ensure the database exists:
   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS job_portal_db;"
   ```

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

