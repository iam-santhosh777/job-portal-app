const authService = require('../services/authService');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        token: result.token, // JWT token at root level for easy access
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Name, email, and password are required'
        });
      }

      const result = await authService.register({ name, email, password, role });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();

