const express = require('express');
const router = express.Router();
const resumeController = require('../controllers/resumeController');

// Choose the appropriate auth middleware based on environment
const { authenticate } = process.env.NODE_ENV === 'production'
  ? require('../middleware/auth')
  : require('../middleware/mockAuth');

// Upload resume for an employee
router.post('/:employeeId', authenticate, resumeController.uploadResume);

// Get resume for an employee
router.get('/:employeeId', authenticate, resumeController.getResume);

// Delete resume for an employee
router.delete('/:employeeId', authenticate, resumeController.deleteResume);

// Debug route to list all files in the upload directory
router.get('/debug/list-files', (req, res) => {
  const fs = require('fs');
  const path = require('path');

  // Use the same upload directory as defined in the controller
  const UPLOAD_DIR = 'C:\\Users\\pitti\\Downloads\\QORE-main\\upload';

  try {
    // Check if directory exists
    if (!fs.existsSync(UPLOAD_DIR)) {
      return res.status(404).json({
        success: false,
        message: 'Upload directory does not exist',
        path: UPLOAD_DIR
      });
    }

    // Read directory contents
    const files = fs.readdirSync(UPLOAD_DIR);

    // Get details for each file
    const fileDetails = files.map(file => {
      const filePath = path.join(UPLOAD_DIR, file);
      try {
        const stats = fs.statSync(filePath);
        return {
          name: file,
          path: filePath,
          size: stats.size,
          created: stats.birthtime,
          modified: stats.mtime,
          isDirectory: stats.isDirectory()
        };
      } catch (error) {
        return {
          name: file,
          path: filePath,
          error: error.message
        };
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Files in upload directory',
      directory: UPLOAD_DIR,
      fileCount: files.length,
      files: fileDetails
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error listing files',
      error: error.message
    });
  }
});

module.exports = router;
