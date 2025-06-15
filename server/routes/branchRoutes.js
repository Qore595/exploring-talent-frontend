const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branchController');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Get all branches with pagination and filtering
router.get('/', authenticate, branchController.getBranches);

// Get branch by ID
router.get('/:id', authenticate, branchController.getBranchById);

// Get branch with related data (departments, designations, and roles)
router.get('/:branchId/with-related-data', authenticate, branchController.getBranchWithRelatedData);

// Create a new branch
router.post('/', authenticate, branchController.createBranch);

// Update branch
router.put('/:id', authenticate, branchController.updateBranch);

// Delete branch
router.delete('/:id', authenticate, branchController.deleteBranch);

module.exports = router;
