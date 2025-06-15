const { body, param, query } = require('express-validator');

// Validation for creating a new employee
const createEmployeeValidation = [
  body('employee_id')
    .notEmpty().withMessage('Employee ID is required')
    .isString().withMessage('Employee ID must be a string'),
  
  body('first_name')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address'),
  
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  
  body('dob')
    .optional()
    .isDate().withMessage('Date of birth must be a valid date'),
  
  body('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer'),
  
  body('department_id')
    .optional()
    .isInt().withMessage('Department ID must be an integer'),
  
  body('designation_id')
    .optional()
    .isInt().withMessage('Designation ID must be an integer'),
  
  body('hire_date')
    .optional()
    .isDate().withMessage('Hire date must be a valid date'),
  
  body('employment_status')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'intern', 'terminated'])
    .withMessage('Employment status must be full-time, part-time, contract, intern, or terminated'),
  
  body('reporting_to')
    .optional()
    .isInt().withMessage('Reporting to must be an integer'),
  
  body('basic_salary')
    .optional()
    .isFloat().withMessage('Basic salary must be a number'),
  
  body('is_superadmin')
    .optional()
    .isBoolean().withMessage('Is superadmin must be a boolean'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('Is active must be a boolean'),
  
  body('created_by')
    .optional()
    .isInt().withMessage('Created by must be an integer'),
];

// Validation for updating an employee
const updateEmployeeValidation = [
  param('id')
    .isInt().withMessage('Employee ID must be an integer'),
  
  body('employee_id')
    .optional()
    .isString().withMessage('Employee ID must be a string'),
  
  body('first_name')
    .optional()
    .isString().withMessage('First name must be a string'),
  
  body('password')
    .optional()
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid email address'),
  
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  
  body('dob')
    .optional()
    .isDate().withMessage('Date of birth must be a valid date'),
  
  body('branch_id')
    .optional()
    .isInt().withMessage('Branch ID must be an integer'),
  
  body('department_id')
    .optional()
    .isInt().withMessage('Department ID must be an integer'),
  
  body('designation_id')
    .optional()
    .isInt().withMessage('Designation ID must be an integer'),
  
  body('hire_date')
    .optional()
    .isDate().withMessage('Hire date must be a valid date'),
  
  body('employment_status')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'intern', 'terminated'])
    .withMessage('Employment status must be full-time, part-time, contract, intern, or terminated'),
  
  body('reporting_to')
    .optional()
    .isInt().withMessage('Reporting to must be an integer'),
  
  body('basic_salary')
    .optional()
    .isFloat().withMessage('Basic salary must be a number'),
  
  body('is_superadmin')
    .optional()
    .isBoolean().withMessage('Is superadmin must be a boolean'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('Is active must be a boolean'),
];

module.exports = {
  createEmployeeValidation,
  updateEmployeeValidation,
};
