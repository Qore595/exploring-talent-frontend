const express = require('express');
const router = express.Router();
const benchResourceController = require('../controllers/benchResourceController');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Validation middleware (basic example - expand as needed)
const validateBenchResource = (req, res, next) => {
  const { employee_id, location_flexibility, availability_date } = req.body;
  
  if (!employee_id) {
    return res.status(400).json({
      success: false,
      message: 'Employee ID is required'
    });
  }
  
  if (!location_flexibility) {
    return res.status(400).json({
      success: false,
      message: 'Location flexibility is required'
    });
  }
  
  if (!availability_date) {
    return res.status(400).json({
      success: false,
      message: 'Availability date is required'
    });
  }
  
  next();
};

// Get all bench resources with pagination and filtering
router.get('/', authenticate, benchResourceController.getBenchResources);

// Get bench resource statistics
router.get('/stats', authenticate, benchResourceController.getBenchResourceStats);

// Get bench resource by ID
router.get('/:id', authenticate, benchResourceController.getBenchResourceById);

// Create a new bench resource
router.post('/', authenticate, validateBenchResource, benchResourceController.createBenchResource);

// Update bench resource
router.put('/:id', authenticate, benchResourceController.updateBenchResource);

// Delete bench resource (soft delete)
router.delete('/:id', authenticate, benchResourceController.deleteBenchResource);

// Auto-enrollment routes
router.get('/auto-enrollment/settings', authenticate, benchResourceController.getAutoEnrollmentSettings);
router.put('/auto-enrollment/settings', authenticate, benchResourceController.updateAutoEnrollmentSettings);
router.post('/auto-enrollment/trigger', authenticate, benchResourceController.triggerAutoEnrollment);
router.get('/auto-enrollment/alerts', authenticate, benchResourceController.getPendingAlerts);
router.post('/auto-enrollment/alerts/:alertId/confirm', authenticate, benchResourceController.confirmEnrollment);
router.post('/auto-enrollment/alerts/:alertId/dismiss', authenticate, benchResourceController.dismissEnrollment);

module.exports = router;
