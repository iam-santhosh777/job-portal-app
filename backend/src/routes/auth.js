const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/login
router.post('/login', authController.login.bind(authController));

// POST /auth/register (optional, for testing)
router.post('/register', authController.register.bind(authController));

module.exports = router;

