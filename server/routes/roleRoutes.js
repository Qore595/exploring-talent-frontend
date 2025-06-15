const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { createRoleValidation, updateRoleValidation } = require('../validations/roleValidation');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Get all roles with pagination and filtering
router.get('/', authenticate, roleController.getRoles);

// Get role by ID
router.get('/:id', authenticate, roleController.getRoleById);

// Create a new role
router.post('/', authenticate, createRoleValidation, roleController.createRole);

// Update role
router.put('/:id', authenticate, updateRoleValidation, roleController.updateRole);

// Delete role
router.delete('/:id', authenticate, roleController.deleteRole);

// Batch update role permissions
router.post('/permissions/batch', authenticate, roleController.batchUpdateRolePermissions);

module.exports = router;
