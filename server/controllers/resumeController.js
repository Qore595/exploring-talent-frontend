const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { Employee } = require('../models/Employee');

// Convert fs functions to promise-based
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const access = promisify(fs.access);

// Base directory for resume uploads - using the absolute path specified by the user
// Using the exact path specified by the user
const UPLOAD_DIR = 'C:\\Users\\pitti\\Downloads\\QORE-main\\upload';

// Log the upload directory for debugging
console.log(`Resume upload directory set to: ${UPLOAD_DIR}`);

// Ensure upload directory exists
const ensureDirectoryExists = async (directory) => {
  try {
    await access(directory, fs.constants.F_OK);
    console.log(`Directory exists: ${directory}`);
  } catch (error) {
    // Directory doesn't exist, create it
    console.log(`Creating directory: ${directory}`);
    await mkdir(directory, { recursive: true });
  }
};

// Ensure the base upload directory exists when the server starts
(async () => {
  try {
    await ensureDirectoryExists(UPLOAD_DIR);
    console.log('Base upload directory is ready');

    // Create a test file to verify write permissions
    const testFilePath = path.join(UPLOAD_DIR, 'test-write-permission.txt');
    try {
      fs.writeFileSync(testFilePath, 'This file was created to test write permissions to the upload directory.');
      console.log(`Successfully created test file at: ${testFilePath}`);
      console.log(`Write permissions to upload directory are confirmed.`);
    } catch (writeError) {
      console.error(`Failed to write test file to upload directory: ${writeError.message}`);
      console.error('This indicates a permission issue with the upload directory.');
    }
  } catch (error) {
    console.error('Failed to create base upload directory:', error);
  }
})();

// Upload resume for an employee - simplified version that doesn't rely on database
exports.uploadResume = async (req, res) => {
  try {
    console.log('Upload resume request received');
    console.log('Request params:', req.params);
    console.log('Request files:', req.files ? Object.keys(req.files) : 'No files');

    const { employeeId } = req.params;

    // Validate request
    if (!req.files) {
      console.error('No files in request');
      return res.status(400).json({
        success: false,
        message: 'No files in request',
      });
    }

    console.log('Files in request:', Object.keys(req.files));

    if (!req.files.resume) {
      console.error('No resume file found in request. Available files:', Object.keys(req.files));
      return res.status(400).json({
        success: false,
        message: 'No resume file uploaded. Make sure the file field is named "resume"',
      });
    }

    // Log file details for debugging
    console.log('Resume file details:', {
      name: req.files.resume.name,
      size: req.files.resume.size,
      mimetype: req.files.resume.mimetype,
      tempFilePath: req.files.resume.tempFilePath || 'No temp file path',
      md5: req.files.resume.md5,
      truncated: req.files.resume.truncated,
    });

    // Get the uploaded file
    const resumeFile = req.files.resume;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(resumeFile.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF and Word documents are allowed.',
      });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (resumeFile.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the maximum limit of 10MB.',
      });
    }

    // Generate filename using employeeId
    const fileExtension = path.extname(resumeFile.name);
    const fileName = `employee_${employeeId}_${Date.now()}${fileExtension}`;

    console.log(`Generated filename: ${fileName} from employeeId: ${employeeId} and extension: ${fileExtension}`);

    // Ensure the upload directory exists
    try {
      await ensureDirectoryExists(UPLOAD_DIR);
      console.log(`Confirmed upload directory exists: ${UPLOAD_DIR}`);
    } catch (dirError) {
      console.error(`Error ensuring upload directory exists: ${dirError.message}`);
      throw dirError;
    }

    // Save directly to the upload directory
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Log the file path for debugging
    console.log(`Saving resume to: ${filePath}`);

    try {
      // For PDF files, we need special handling to ensure binary data is preserved
      const isPdf = resumeFile.mimetype === 'application/pdf';
      console.log(`File type: ${resumeFile.mimetype}, isPDF: ${isPdf}`);

      // Try multiple methods to save the file to ensure it works
      let savedSuccessfully = false;
      let errorMessages = [];

      // Method 1: Using fs.copyFile if we have a temp file
      if (resumeFile.tempFilePath) {
        try {
          console.log(`Method 1: Copying temp file from ${resumeFile.tempFilePath} to ${filePath}`);
          await promisify(fs.copyFile)(resumeFile.tempFilePath, filePath);
          console.log(`Method 1: File copied successfully to: ${filePath}`);
          savedSuccessfully = true;
        } catch (error) {
          console.error(`Method 1 failed: ${error.message}`);
          errorMessages.push(`Method 1 (copyFile) error: ${error.message}`);
        }
      }

      // Method 2: Using streams if Method 1 failed and we have a temp file
      if (!savedSuccessfully && resumeFile.tempFilePath) {
        try {
          console.log(`Method 2: Using streams to copy from ${resumeFile.tempFilePath} to ${filePath}`);
          const readStream = fs.createReadStream(resumeFile.tempFilePath);
          const writeStream = fs.createWriteStream(filePath);

          await new Promise((resolve, reject) => {
            readStream.pipe(writeStream);
            writeStream.on('finish', resolve);
            writeStream.on('error', reject);
          });

          console.log(`Method 2: File copied successfully using streams to: ${filePath}`);
          savedSuccessfully = true;
        } catch (error) {
          console.error(`Method 2 failed: ${error.message}`);
          errorMessages.push(`Method 2 (streams) error: ${error.message}`);
        }
      }

      // Method 3: Using fs.writeFileSync if we have data in memory
      if (!savedSuccessfully && resumeFile.data) {
        try {
          console.log(`Method 3: Writing file data directly to: ${filePath}`);
          fs.writeFileSync(filePath, resumeFile.data);
          console.log(`Method 3: File written successfully using writeFileSync to: ${filePath}`);
          savedSuccessfully = true;
        } catch (error) {
          console.error(`Method 3 failed: ${error.message}`);
          errorMessages.push(`Method 3 (writeFileSync) error: ${error.message}`);
        }
      }

      // Method 4: Using promisified writeFile if we have data in memory
      if (!savedSuccessfully && resumeFile.data) {
        try {
          console.log(`Method 4: Writing file data using promisified writeFile to: ${filePath}`);
          await writeFile(filePath, resumeFile.data);
          console.log(`Method 4: File written successfully using promisified writeFile to: ${filePath}`);
          savedSuccessfully = true;
        } catch (error) {
          console.error(`Method 4 failed: ${error.message}`);
          errorMessages.push(`Method 4 (promisified writeFile) error: ${error.message}`);
        }
      }

      // If all methods failed, throw an error
      if (!savedSuccessfully) {
        const errorMessage = `Failed to save file using all methods. Errors: ${errorMessages.join('; ')}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }

      // Check if the file was actually created
      if (fs.existsSync(filePath)) {
        console.log(`File exists after writing: ${filePath}`);
        console.log(`File size: ${fs.statSync(filePath).size} bytes`);
        console.log(`File MIME type: ${resumeFile.mimetype}`);
      } else {
        console.error(`File does not exist after writing: ${filePath}`);
        throw new Error(`Failed to verify file was created`);
      }

      // Generate the URL for the resume - directly in the upload folder
      const resumeUrl = `/upload/${fileName}`;
      console.log(`Resume saved successfully. URL: ${resumeUrl}`);

      // Create a full URL for the resume that can be accessed from the frontend
      const fullResumeUrl = `http://localhost:8083${resumeUrl}`;

      console.log('Resume uploaded successfully');
      console.log('Full resume URL:', fullResumeUrl);
      console.log('File saved at:', filePath);

      return res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: {
          resumeUrl,
          fullResumeUrl,
          fileName,
          employeeId,
          originalFileName: resumeFile.name,
          filePath: filePath,
          uploadDir: UPLOAD_DIR,
          serverPort: 8081
        },
      });
    } catch (writeError) {
      console.error(`Error writing file: ${writeError.message}`);
      throw writeError;
    }
  } catch (error) {
    console.error('Resume upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while uploading the resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Get resume for an employee
exports.getResume = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Check if employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if employee has a resume
    if (!employee.resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for this employee',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Resume retrieved successfully',
      data: {
        resumeUrl: employee.resume,
        employeeId,
        employeeName: `${employee.first_name} ${employee.last_name || ''}`.trim(),
      },
    });
  } catch (error) {
    console.error('Get resume error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while retrieving the resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Delete resume for an employee
exports.deleteResume = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Check if employee exists
    const employee = await Employee.findByPk(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if employee has a resume
    if (!employee.resume) {
      return res.status(404).json({
        success: false,
        message: 'No resume found for this employee',
      });
    }

    // Get the file path from the resume URL
    // Handle both old and new URL formats
    const resumeUrl = employee.resume;
    const resumePath = resumeUrl.startsWith('/upload')
      ? path.resolve(process.cwd(), '..', resumeUrl.substring(1))
      : path.join(__dirname, '..', resumeUrl);

    // Check if file exists
    try {
      await access(resumePath, fs.constants.F_OK);

      // Delete the file
      await promisify(fs.unlink)(resumePath);
    } catch (error) {
      // File doesn't exist, just update the database
      console.warn(`Resume file not found at ${resumePath}`);
    }

    // Update employee record to remove resume URL
    await employee.update({ resume: null });

    return res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
      data: {
        employeeId,
      },
    });
  } catch (error) {
    console.error('Delete resume error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while deleting the resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
