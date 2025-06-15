const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Employee } = require('../models/Employee');
const { RefreshToken } = require('../models/RefreshToken');
const { Branch } = require('../models/Branch');
const { Department } = require('../models/Department');
const { Designation } = require('../models/Designation');
require('dotenv').config();

// Helper function to generate JWT token
const generateToken = (employee) => {
  return jwt.sign(
    {
      id: employee.id,
      employee_id: employee.employee_id,
      email: employee.email,
      is_active: employee.is_active,
      is_superadmin: employee.is_superadmin,
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

// Helper function to generate refresh token
const generateRefreshToken = async (employee, ipAddress) => {
  // Create a refresh token that expires in 7 days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Create a refresh token with a random token string
  const tokenString = jwt.sign(
    { id: employee.id, email: employee.email },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '7d' }
  );

  // Save the refresh token in the database
  const refreshToken = await RefreshToken.create({
    token: tokenString,
    employee_id: employee.id,
    expires_at: expiresAt,
    created_by_ip: ipAddress,
  });

  return refreshToken.token;
};

// Helper function to get client IP address
const getClientIp = (req) => {
  return req.ip || req.connection.remoteAddress || 'unknown';
};

// Login employee
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find employee by email
    const employee = await Employee.findOne({
      where: { email },
      include: [
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name'],
        },
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'name'],
        },
        {
          model: Designation,
          as: 'Designation',
          attributes: ['id', 'name', 'short_code'],
        },
      ],
    });

    // Check if employee exists
    if (!employee) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check if employee is active
    if (!employee.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Your account is inactive. Please contact the administrator.',
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = generateToken(employee);

    // Generate refresh token
    const ipAddress = getClientIp(req);
    const refreshToken = await generateRefreshToken(employee, ipAddress);

    // Update last login timestamp
    await Employee.update(
      { last_login: new Date() },
      { where: { id: employee.id } }
    );

    // Return employee data and tokens
    const employeeData = { ...employee.get() };
    delete employeeData.password; // Remove password from response

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        employee: employeeData,
        token,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // Validate request
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    // Find the refresh token in the database
    const storedRefreshToken = await RefreshToken.findOne({
      where: { token: refreshToken, is_revoked: false },
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: { exclude: ['password'] },
        },
      ],
    });

    // Check if refresh token exists and is valid
    if (!storedRefreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    // Check if refresh token is expired
    if (new Date() > new Date(storedRefreshToken.expires_at)) {
      // Revoke the token
      await storedRefreshToken.update({
        is_revoked: true,
        revoked_by_ip: getClientIp(req),
      });

      return res.status(401).json({
        success: false,
        message: 'Refresh token expired',
      });
    }

    // Get the employee from the refresh token
    const employee = storedRefreshToken.Employee;

    // Check if employee is active
    if (!employee.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Your account is inactive. Please contact the administrator.',
      });
    }

    // Generate new tokens
    const newToken = generateToken(employee);
    const ipAddress = getClientIp(req);
    const newRefreshToken = await generateRefreshToken(employee, ipAddress);

    // Revoke the old refresh token
    await storedRefreshToken.update({
      is_revoked: true,
      revoked_by_ip: ipAddress,
      replaced_by_token: newRefreshToken,
    });

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
      },
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while refreshing token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Check employee status
exports.checkStatus = async (req, res) => {
  try {
    // Get employee ID from authenticated request
    const employeeId = req.user.id;

    // Find employee by ID
    const employee = await Employee.findByPk(employeeId, {
      attributes: [
        'id', 'employee_id', 'first_name', 'last_name', 'email',
        'is_active', 'is_superadmin', 'last_login'
      ],
    });

    // Check if employee exists
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Employee is active and authenticated',
      data: {
        employee,
      },
    });
  } catch (error) {
    console.error('Check status error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while checking status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Send login notification
exports.sendNotification = async (req, res) => {
  try {
    // Get employee ID from authenticated request
    const employeeId = req.user.id;
    const { notification_type = 'email' } = req.body;

    // Find employee by ID
    const employee = await Employee.findByPk(employeeId, {
      attributes: ['id', 'employee_id', 'first_name', 'last_name', 'email'],
    });

    // Check if employee exists
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // In a real application, you would send an actual notification here
    // For now, we'll just simulate it
    const notificationId = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
    const sentAt = new Date();

    return res.status(200).json({
      success: true,
      message: `Login notification sent via ${notification_type}`,
      data: {
        notification_id: notificationId,
        notification_type,
        sent_at: sentAt,
      },
    });
  } catch (error) {
    console.error('Send notification error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while sending notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Logout employee
exports.logout = async (req, res) => {
  try {
    // Get the refresh token from the request body
    const { refreshToken } = req.body;
    const ipAddress = getClientIp(req);

    if (refreshToken) {
      // Find the refresh token in the database
      const storedRefreshToken = await RefreshToken.findOne({
        where: { token: refreshToken },
      });

      // If the token exists, revoke it
      if (storedRefreshToken) {
        await storedRefreshToken.update({
          is_revoked: true,
          revoked_by_ip: ipAddress,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred during logout',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
