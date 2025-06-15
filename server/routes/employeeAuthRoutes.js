const express = require('express');
const router = express.Router();
const employeeAuthController = require('../controllers/employeeAuthController');
const { body } = require('express-validator');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Login employee
router.post('/login', [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
], employeeAuthController.login);

// Refresh token
router.post('/refresh-token', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
], employeeAuthController.refreshToken);

// Check employee status (protected route)
router.get('/status', authenticate, employeeAuthController.checkStatus);

// Send login notification (protected route)
router.post('/send-notification', authenticate, employeeAuthController.sendNotification);

// Logout employee (protected route)
router.post('/logout', authenticate, employeeAuthController.logout);

module.exports = router;
