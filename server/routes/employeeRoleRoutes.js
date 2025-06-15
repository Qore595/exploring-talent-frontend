const express = require('express');
const router = express.Router();
const employeeRoleController = require('../controllers/employeeRoleController');
const { body } = require('express-validator');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Validation rules for creating/updating employee role
const employeeRoleValidation = [
  body('employee_id')
    .notEmpty().withMessage('Employee ID is required')
    .isInt().withMessage('Employee ID must be an integer')
    .toInt(),

  body('role_id')
    .notEmpty().withMessage('Role ID is required')
    .isInt().withMessage('Role ID must be an integer')
    .toInt(),

  body('branch_id')
    .notEmpty().withMessage('Branch ID is required')
    .isInt().withMessage('Branch ID must be an integer')
    .toInt(),

  body('is_primary')
    .optional()
    .isBoolean().withMessage('Is primary must be a boolean')
    .toBoolean(),

  body('is_active')
    .optional()
    .isBoolean().withMessage('Is active must be a boolean')
    .toBoolean(),

  body('created_by')
    .notEmpty().withMessage('Created by is required')
    .isInt().withMessage('Created by must be an integer')
    .toInt(),
];

// Get all employee roles with pagination and filtering
router.get('/', authenticate, employeeRoleController.getEmployeeRoles);

// Get employee roles by employee ID
router.get('/employee/:employeeId', authenticate, employeeRoleController.getEmployeeRolesByEmployeeId);

// Get employee role by ID
router.get('/:id', authenticate, employeeRoleController.getEmployeeRoleById);

// Create a new employee role
router.post('/', authenticate, employeeRoleValidation, employeeRoleController.createEmployeeRole);

// Update employee role
router.put('/:id', authenticate, employeeRoleValidation, employeeRoleController.updateEmployeeRole);

// Delete employee role
router.delete('/:id', authenticate, employeeRoleController.deleteEmployeeRole);

module.exports = router;
