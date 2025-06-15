const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const writeFile = promisify(fs.writeFile);

// Define the upload directory
const UPLOAD_DIR = 'C:\\Users\\pitti\\Downloads\\QORE-main\\upload';

// Function to ensure a directory exists
const ensureDirectoryExists = async (dirPath) => {
  try {
    if (!fs.existsSync(dirPath)) {
      await promisify(fs.mkdir)(dirPath, { recursive: true });
      console.log(`Created directory: ${dirPath}`);
    }
    return true;
  } catch (error) {
    console.error(`Error creating directory ${dirPath}: ${error.message}`);
    throw error;
  }
};

// Direct upload endpoint that doesn't rely on database
exports.directUpload = async (req, res) => {
  try {
    console.log('Direct upload request received');
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);

    // Validate request
    if (!req.files) {
      console.error('No files in request');
      console.error('Request body:', req.body);
      return res.status(400).json({
        success: false,
        message: 'No files in request',
      });
    }

    console.log('Files in request:', Object.keys(req.files));

    if (!req.files.file) {
      console.error('No file found in request. Available files:', Object.keys(req.files));
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Make sure the file field is named "file"',
      });
    }

    // Get the uploaded file
    const uploadedFile = req.files.file;

    // Log file details for debugging
    console.log('File details:', {
      name: uploadedFile.name,
      size: uploadedFile.size,
      mimetype: uploadedFile.mimetype,
      tempFilePath: uploadedFile.tempFilePath || 'No temp file path',
      md5: uploadedFile.md5,
      encoding: uploadedFile.encoding,
      truncated: uploadedFile.truncated,
    });

    // Get employee ID from the request body or query parameters
    const employeeId = req.body.employeeId || req.query.employeeId || 'unknown';
    console.log('Employee ID for file naming:', employeeId);

    // Generate a unique filename with employee ID
    const fileExtension = path.extname(uploadedFile.name);
    const fileName = `employee_${employeeId}_${Date.now()}${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    console.log(`Saving file to: ${filePath}`);

    // Check if upload directory exists and is writable
    try {
      await ensureDirectoryExists(UPLOAD_DIR);

      // Test write permissions
      const testFile = path.join(UPLOAD_DIR, `test-write-${Date.now()}.txt`);
      fs.writeFileSync(testFile, 'Test write permissions');
      fs.unlinkSync(testFile);
      console.log('Upload directory is writable');
    } catch (dirError) {
      console.error('Error with upload directory:', dirError);
      return res.status(500).json({
        success: false,
        message: 'Server error with upload directory',
        error: dirError.message
      });
    }

    // Move the file to the upload directory
    uploadedFile.mv(filePath, (err) => {
      if (err) {
        console.error('Error moving file:', err);

        // Try alternative method to save the file
        try {
          console.log('Trying alternative method to save file...');
          fs.writeFileSync(filePath, uploadedFile.data);
          console.log('File saved using alternative method');

          // Check if file was actually created
          if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log(`File exists with size: ${stats.size} bytes`);

            // Generate URL for the file
            const fileUrl = `/upload/${fileName}`;
            const fullFileUrl = `http://localhost:8083${fileUrl}`;

            return res.status(200).json({
              success: true,
              message: 'File uploaded successfully (alternative method)',
              data: {
                fileName,
                originalName: uploadedFile.name,
                fileUrl,
                fullFileUrl,
                filePath,
                size: uploadedFile.size,
                mimetype: uploadedFile.mimetype
              }
            });
          } else {
            console.error('File still not created after alternative method');
            return res.status(500).json({
              success: false,
              message: 'Failed to save file even with alternative method',
              error: 'File not created'
            });
          }
        } catch (altError) {
          console.error('Alternative method failed:', altError);
          return res.status(500).json({
            success: false,
            message: 'Error saving file (both methods failed)',
            error: `${err.message}; Alternative method: ${altError.message}`
          });
        }
      }

      // File saved successfully
      console.log('File saved successfully at:', filePath);

      // Verify file exists and has content
      try {
        const stats = fs.statSync(filePath);
        console.log(`Verified file exists with size: ${stats.size} bytes`);
      } catch (statError) {
        console.error('Error verifying file:', statError);
      }

      // Generate URL for the file
      const fileUrl = `/upload/${fileName}`;
      const fullFileUrl = `http://localhost:8083${fileUrl}`;

      return res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: {
          fileName,
          originalName: uploadedFile.name,
          fileUrl,
          fullFileUrl,
          filePath,
          size: uploadedFile.size,
          mimetype: uploadedFile.mimetype
        }
      });
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while uploading the file',
      error: error.message
    });
  }
};
