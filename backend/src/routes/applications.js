const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

// General route: Returns applications based on user role
router.get(
  '/',
  verifyToken,
  (req, res, next) => {
    if (req.user.role === 'HR') {
      return applicationController.getHRApplications(req, res, next);
    } else if (req.user.role === 'USER') {
      return applicationController.getUserApplications(req, res, next);
    } else {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
  }
);

// HR: Get all applications for their jobs
router.get(
  '/hr/all',
  verifyToken,
  authorizeRole('HR'),
  applicationController.getHRApplications.bind(applicationController)
);

// HR: Get applications for a specific job
router.get(
  '/job/:jobId',
  verifyToken,
  authorizeRole('HR'),
  applicationController.getJobApplications.bind(applicationController)
);

// User: Get their own applications
router.get(
  '/my-applications',
  verifyToken,
  authorizeRole('USER'),
  applicationController.getUserApplications.bind(applicationController)
);

module.exports = router;

