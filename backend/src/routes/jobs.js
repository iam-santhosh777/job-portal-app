const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { verifyToken, authorizeRole } = require('../middleware/auth');

// User: Get all active jobs (public or authenticated)
router.get('/', jobController.getActiveJobs.bind(jobController));

// User: Get all active jobs (explicit route for /active)
router.get('/active', jobController.getActiveJobs.bind(jobController));

// HR: Get all jobs posted by HR
router.get('/hr/my-jobs', verifyToken, authorizeRole('HR'), jobController.getHRJobs.bind(jobController));

// HR: Create a new job
router.post('/', verifyToken, authorizeRole('HR'), jobController.createJob.bind(jobController));

// HR: Mark job as expired
router.patch('/:id/expire', verifyToken, authorizeRole('HR'), jobController.expireJob.bind(jobController));

// User: Apply for a job
router.post('/:id/apply', verifyToken, authorizeRole('USER'), jobController.applyForJob.bind(jobController));

module.exports = router;

