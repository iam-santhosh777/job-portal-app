const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

// HR: Get dashboard analytics
router.get(
  '/',
  verifyToken,
  authorizeRole('HR'),
  dashboardController.getDashboard.bind(dashboardController)
);

// HR: Get dashboard stats (alias for /)
router.get(
  '/stats',
  verifyToken,
  authorizeRole('HR'),
  dashboardController.getDashboard.bind(dashboardController)
);

module.exports = router;

