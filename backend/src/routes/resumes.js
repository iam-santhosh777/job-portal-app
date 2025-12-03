const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const upload = require('../utils/multerConfig');

// HR: Upload multiple resumes
// Accept both 'resume' (singular) and 'resumes' (plural) for flexibility
// Use .any() to accept any field name (more flexible) and filter files in controller
router.post(
  '/upload',
  verifyToken,
  authorizeRole('HR'),
  upload.any(), // Accept any field name - we'll filter for 'resume'/'resumes' in controller
  resumeController.uploadResumes.bind(resumeController)
);

// HR: Get all resumes
router.get(
  '/',
  verifyToken,
  authorizeRole('HR'),
  resumeController.getResumes.bind(resumeController)
);

// HR: Delete resume (must be before parameterized GET routes to avoid conflicts)
router.delete(
  '/:id',
  verifyToken,
  authorizeRole('HR'),
  resumeController.deleteResume.bind(resumeController)
);

// HR: Get resume file URL
router.get(
  '/:id/url',
  verifyToken,
  authorizeRole('HR'),
  resumeController.getResumeUrl.bind(resumeController)
);

// HR: Download resume file
router.get(
  '/:id/download',
  verifyToken,
  authorizeRole('HR'),
  resumeController.downloadResume.bind(resumeController)
);

module.exports = router;

