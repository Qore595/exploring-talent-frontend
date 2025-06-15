const { body } = require('express-validator');

// Validation rules for creating a role
exports.createRoleValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('slug')
    .notEmpty().withMessage('Slug is required')
    .isString().withMessage('Slug must be a string')
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
    .isLength({ min: 2, max: 100 }).withMessage('Slug must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  body('branch_id')
    .optional({ nullable: true })
    .isInt().withMessage('Branch ID must be an integer'),
  
  body('is_system')
    .optional()
    .isBoolean().withMessage('Is system must be a boolean'),
  
  body('priority')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Priority must be an integer between 1 and 100'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('Is active must be a boolean'),
  
  body('created_by')
    .notEmpty().withMessage('Created by is required')
    .isInt().withMessage('Created by must be an integer'),
];

// Validation rules for updating a role
exports.updateRoleValidation = [
  body('name')
    .optional()
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('slug')
    .optional()
    .isString().withMessage('Slug must be a string')
    .matches(/^[a-z0-9-]+$/).withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
    .isLength({ min: 2, max: 100 }).withMessage('Slug must be between 2 and 100 characters'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),
  
  body('branch_id')
    .optional({ nullable: true })
    .isInt().withMessage('Branch ID must be an integer'),
  
  body('is_system')
    .optional()
    .isBoolean().withMessage('Is system must be a boolean'),
  
  body('priority')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Priority must be an integer between 1 and 100'),
  
  body('is_active')
    .optional()
    .isBoolean().withMessage('Is active must be a boolean'),
  
  body('updated_by')
    .notEmpty().withMessage('Updated by is required')
    .isInt().withMessage('Updated by must be an integer'),
];
