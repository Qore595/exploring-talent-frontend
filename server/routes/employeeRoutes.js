const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { createEmployeeValidation, updateEmployeeValidation } = require('../validations/employeeValidation');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Get all employees with pagination and filtering
router.get('/', authenticate, employeeController.getEmployees);

// Get employee by ID
router.get('/:id', authenticate, employeeController.getEmployeeById);

// Create a new employee
router.post('/', authenticate, createEmployeeValidation, employeeController.createEmployee);

// Update employee
router.put('/:id', authenticate, updateEmployeeValidation, employeeController.updateEmployee);

// Delete employee
router.delete('/:id', authenticate, employeeController.deleteEmployee);

module.exports = router;
