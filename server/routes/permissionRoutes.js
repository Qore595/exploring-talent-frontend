const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Get all permission groups with categories
router.get('/permission-groups-with-categories', authenticate, permissionController.getPermissionGroupsWithCategories);

module.exports = router;
