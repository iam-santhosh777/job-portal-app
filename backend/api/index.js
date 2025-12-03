// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const { testConnection } = require('../config/database');
const errorHandler = require('../src/middleware/errorHandler');

// Import routes
const authRoutes = require('../src/routes/auth');
const jobRoutes = require('../src/routes/jobs');
const resumeRoutes = require('../src/routes/resumes');
const dashboardRoutes = require('../src/routes/dashboard');
const applicationRoutes = require('../src/routes/applications');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Note: Socket.io is not supported in Vercel serverless functions
// Make io available to routes (will be null in serverless mode)
app.use((req, res, next) => {
  req.io = null; // Socket.io not available in serverless
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/applications', applicationRoutes);
// Alias for stats
app.use('/api/stats', dashboardRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'HRMS + Job Portal API is running on Vercel!',
    version: '1.0.0',
    platform: 'Vercel Serverless',
    note: 'Socket.io is not available in serverless mode',
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
    platform: 'Vercel Serverless',
    socket: 'Not available in serverless mode'
  });
});

// Error handling middleware (must be last)
app.use(errorHandler.notFound);
app.use(errorHandler.handle);

// Export for Vercel serverless
module.exports = app;

