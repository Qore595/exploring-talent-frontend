const express = require('express');
const router = express.Router();
const hotlistController = require('../controllers/hotlistController');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Validation middleware
const validateHotlist = (req, res, next) => {
  const { name, batch_size, schedule_type } = req.body;
  
  if (!name) {
    return res.status(400).json({
      success: false,
      message: 'Hotlist name is required'
    });
  }
  
  if (!batch_size || batch_size < 1) {
    return res.status(400).json({
      success: false,
      message: 'Valid batch size is required'
    });
  }
  
  if (!schedule_type) {
    return res.status(400).json({
      success: false,
      message: 'Schedule type is required'
    });
  }
  
  next();
};

// Get all hotlists with pagination and filtering
router.get('/', authenticate, hotlistController.getHotlists);

// Get hotlist by ID with candidates
router.get('/:id', authenticate, hotlistController.getHotlistById);

// Create a new hotlist
router.post('/', authenticate, validateHotlist, hotlistController.createHotlist);

// Update hotlist
router.put('/:id', authenticate, hotlistController.updateHotlist);

module.exports = router;
