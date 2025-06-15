const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Batch update role permissions
router.post('/batch', authenticate, roleController.batchUpdateRolePermissions);

// Get role permissions by role ID
router.get('/role/:roleId', authenticate, roleController.getRolePermissions);

module.exports = router;


