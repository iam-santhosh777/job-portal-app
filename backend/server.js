const express = require('express');
const http = require('http');
const cors = require('cors');
const { testConnection } = require('./config/database');
const errorHandler = require('./src/middleware/errorHandler');
const initializeSocket = require('./src/sockets/socketHandler');

// Import routes
const authRoutes = require('./src/routes/auth');
const jobRoutes = require('./src/routes/jobs');
const resumeRoutes = require('./src/routes/resumes');
const dashboardRoutes = require('./src/routes/dashboard');
const applicationRoutes = require('./src/routes/applications');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

// CORS allowed origins configuration
const allowedOrigins = process.env.CLIENT_URL?.split(',').map(url => url.trim()) || [
  'http://localhost:5173',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://frontend-reactjs-jobportal.vercel.app'
];

// CORS origin checker function
const corsOriginChecker = (origin, callback) => {
  // Allow requests with no origin (like mobile apps, curl, Postman)
  if (!origin) {
    return callback(null, true);
  }
  
  // Allow if origin is in allowed list or if wildcard is set
  if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
    callback(null, true);
  } else {
    // Log for debugging
    console.log(`CORS blocked origin: ${origin}`);
    console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
    callback(new Error('Not allowed by CORS'));
  }
};

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: corsOriginChecker,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize socket handler
initializeSocket(io);

// Make io available to routes via middleware
app.use((req, res, next) => {
  req.io = io;
  next();
});

const PORT = process.env.PORT || 3000;

// CORS middleware - MUST be first, before any routes
// Handles both preflight OPTIONS and actual requests
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log for debugging
  if (req.method === 'OPTIONS') {
    console.log(`[CORS] OPTIONS preflight from: ${origin || 'No origin'}`);
    console.log(`[CORS] Allowed origins: ${JSON.stringify(allowedOrigins)}`);
  }
  
  // Check if origin is allowed (or no origin for curl/Postman)
  const isAllowed = !origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*');
  
  if (isAllowed) {
    // Set CORS headers
    if (origin) {
      res.header('Access-Control-Allow-Origin', origin);
    } else {
      res.header('Access-Control-Allow-Origin', '*');
    }
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      res.header('Access-Control-Max-Age', '86400'); // 24 hours
      console.log(`[CORS] Sending 204 for OPTIONS from: ${origin}`);
      return res.sendStatus(204);
    }
  } else {
    console.log(`[CORS] ❌ BLOCKED origin: ${origin}`);
    console.log(`[CORS] Allowed: ${JSON.stringify(allowedOrigins)}`);
    if (req.method === 'OPTIONS') {
      return res.status(403).json({ error: 'CORS: Origin not allowed' });
    }
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/applications', applicationRoutes);
// Alias for stats (some UIs might call /api/stats)
app.use('/api/stats', dashboardRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'HRMS + Job Portal API is running!',
    version: '1.0.0',
    cors: {
      allowedOrigins: allowedOrigins,
      clientUrl: process.env.CLIENT_URL || 'Not set'
    },
    endpoints: {
      auth: {
        login: 'POST /api/auth/login',
        register: 'POST /api/auth/register'
      },
      jobs: {
        getActive: 'GET /api/jobs',
        create: 'POST /api/jobs (HR only)',
        expire: 'PATCH /api/jobs/:id/expire (HR only)',
        apply: 'POST /api/jobs/:id/apply (USER only)',
        getHRJobs: 'GET /api/jobs/hr/my-jobs (HR only)'
      },
      resumes: {
        upload: 'POST /api/resumes/upload (HR only)',
        getAll: 'GET /api/resumes (HR only)'
      },
      dashboard: {
        analytics: 'GET /api/dashboard (HR only)',
        stats: 'GET /api/stats (HR only, alias for /api/dashboard)'
      },
      applications: {
        hrAll: 'GET /api/applications/hr/all (HR only)',
        jobApplications: 'GET /api/applications/job/:jobId (HR only)',
        userApplications: 'GET /api/applications/my-applications (USER only)'
      },
      health: 'GET /api/health'
    }
  });
});

// Health check with DB connection test
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection();
  res.json({
    status: 'OK',
    database: dbConnected ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
    socket: 'Active',
    cors: {
      allowedOrigins: allowedOrigins,
      requestOrigin: req.headers.origin || 'No origin header',
      clientUrl: process.env.CLIENT_URL || 'Not set'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler.notFound);
app.use(errorHandler.handle);

// Start server
server.listen(PORT, async () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io is ready for real-time connections`);
  await testConnection();
});
