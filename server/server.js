const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const fileUpload = require('express-fileupload');
const path = require('path');
const sequelize = require('./config/database');
require('dotenv').config();

// Import routes
const roleRoutes = require('./routes/roleRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const branchRoutes = require('./routes/branchRoutes');
const employeeRoleRoutes = require('./routes/employeeRoleRoutes');
const employeeAuthRoutes = require('./routes/employeeAuthRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const benchResourceRoutes = require('./routes/benchResourceRoutes');
const hotlistRoutes = require('./routes/hotlistRoutes');

// Initialize express app
const app = express();

// Middleware
// Configure CORS to allow requests from the frontend
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'http://localhost:5173'
    : '*', // Allow all origins in development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allow cross-origin resource sharing
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: true, // Use temp files instead of memory for file uploads
  tempFileDir: path.join(__dirname, 'temp'), // Temporary directory for file uploads
  parseNested: true, // Parse nested form data
  debug: process.env.NODE_ENV === 'development'
}));

// Serve static files from the uploads directories
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use absolute path for the upload directory to ensure it works correctly
const uploadPath = 'C:\\Users\\pitti\\Downloads\\QORE-main\\upload';

// Serve files from the upload directory
app.use('/upload', express.static(uploadPath));

// Log the static file paths for debugging
console.log('Serving static files from:');
console.log(`- /uploads: ${path.join(__dirname, 'uploads')}`);
console.log(`- /upload: ${uploadPath}`);

// Create a specific route for serving resume files
app.get('/upload/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadPath, filename);

  console.log(`Request for file: ${filePath}`);

  // Check if file exists
  if (fs.existsSync(filePath)) {
    console.log(`File exists, sending: ${filePath}`);

    // Set appropriate content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.pdf') {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
    } else if (ext === '.doc') {
      res.setHeader('Content-Type', 'application/msword');
      res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    } else if (ext === '.docx') {
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
    } else if (ext === '.txt') {
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
    }

    // Set cache control headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // For PDF files, use sendFile with specific options
    if (ext === '.pdf') {
      try {
        console.log(`Sending PDF file: ${filePath}`);

        // Additional headers for PDF files
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Accept-Ranges', 'bytes');

        // Use sendFile with options for PDF files
        res.sendFile(filePath, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline; filename="' + filename + '"'
          }
        }, (err) => {
          if (err) {
            console.error(`Error sending PDF file: ${err.message}`);
            if (!res.headersSent) {
              res.status(500).send('Error sending PDF file');
            }
          }
        });
      } catch (error) {
        console.error(`Error setting up PDF file send: ${error.message}`);
        res.status(500).send('Error processing PDF file');
      }
    } else {
      // For other file types, use sendFile
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error(`Error sending file: ${err.message}`);
          if (!res.headersSent) {
            res.status(500).send('Error sending file');
          }
        }
      });
    }
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).send('File not found');
  }
});



// Create the upload directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(uploadPath)) {
  console.log(`Creating upload directory: ${uploadPath}`);
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Create test files in the upload directory
const testTxtPath = path.join(uploadPath, 'test.txt');
try {
  fs.writeFileSync(testTxtPath, 'This is a test file to verify file serving is working.');
  console.log(`Created test text file at: ${testTxtPath}`);
} catch (error) {
  console.error(`Error creating test text file: ${error.message}`);
}

// Create a simple PDF file for testing

// Function to create a simple PDF file
const createTestPdf = () => {
  try {
    // Path to a sample PDF file in the project
    const samplePdfPath = path.join(__dirname, 'sample.pdf');

    // Check if the sample PDF exists
    if (fs.existsSync(samplePdfPath)) {
      // Copy the sample PDF to the upload directory
      const testPdfPath = path.join(uploadPath, 'test.pdf');
      fs.copyFileSync(samplePdfPath, testPdfPath);
      console.log(`Copied sample PDF to: ${testPdfPath}`);
    } else {
      console.log('Sample PDF not found, skipping PDF test file creation');
    }
  } catch (error) {
    console.error(`Error creating test PDF file: ${error.message}`);
  }
};

// Try to create the test PDF file
createTestPdf();

// Add test routes to verify the server is running
app.get('/test', (req, res) => {
  res.send('Server is running correctly!');
});

// Add a test route to list all files in the upload directory
app.get('/list-uploads', (req, res) => {
  try {
    const files = fs.readdirSync(uploadPath);
    const fileDetails = files.map(file => {
      const filePath = path.join(uploadPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        path: filePath,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        isDirectory: stats.isDirectory()
      };
    });

    res.json({
      success: true,
      message: 'Files in upload directory',
      uploadPath,
      files: fileDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error listing files',
      error: error.message
    });
  }
});

// Simple direct file upload endpoint that doesn't rely on database
app.post('/direct-upload', (req, res) => {
  try {
    console.log('Direct upload request received');
    console.log('Request headers:', req.headers);
    console.log('Request body type:', typeof req.body);
    console.log('Request body:', req.body);

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

    // Get user ID from request body
    const userId = req.body.userId || req.body.employeeId;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required for file upload. Please provide userId or employeeId in the request.',
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
      userId: userId
    });

    // Validate file type
    const fileExtension = path.extname(uploadedFile.name).toLowerCase();
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.txt'];
    if (!allowedExtensions.includes(fileExtension)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.',
      });
    }

    // Generate filename with user ID pattern: employee_{userid}.{extension}
    const fileName = `employee_${userId}${fileExtension}`;
    const filePath = path.join(uploadPath, fileName);    console.log(`Saving file to: ${filePath}`);

    // Check if upload directory exists and is writable
    try {
      if (!fs.existsSync(uploadPath)) {
        console.log(`Creating upload directory: ${uploadPath}`);
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      // Test write permissions
      const testFile = path.join(uploadPath, `test-write-${Date.now()}.txt`);
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

    // Check if file already exists and remove it (to replace old resume)
    if (fs.existsSync(filePath)) {
      console.log(`Removing existing resume: ${filePath}`);
      try {
        fs.unlinkSync(filePath);
        console.log('Existing file removed successfully');
      } catch (unlinkError) {
        console.error('Error removing existing file:', unlinkError);
      }
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
            const fullFileUrl = `http://localhost:8083${fileUrl}`;            return res.status(200).json({
              success: true,
              message: 'Resume uploaded successfully (alternative method)',
              data: {
                fileName,
                originalName: uploadedFile.name,
                fileUrl,
                fullFileUrl,
                filePath,
                size: uploadedFile.size,
                mimetype: uploadedFile.mimetype,
                userId: userId
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
      const fullFileUrl = `http://localhost:8083${fileUrl}`;      return res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: {
          fileName,
          originalName: uploadedFile.name,
          fileUrl,
          fullFileUrl,
          filePath,
          size: uploadedFile.size,
          mimetype: uploadedFile.mimetype,
          userId: userId
        }
      });
    });  } catch (error) {
    console.error('Resume upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while uploading the resume',
      error: error.message
    });
  }
});

// Remove the duplicate direct upload endpoint and controller import
// Import the direct upload controller
// const { directUpload } = require('./controllers/directUploadController');

// Direct upload endpoint
// app.post('/direct-upload', directUpload);

// CORS configuration to allow frontend to access uploaded files
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Expose-Headers', 'Content-Length, X-Content-Type');
  next();
});

// Handle OPTIONS requests for CORS preflight
app.options('*', cors(corsOptions));

// API routes
app.use('/api/roles', roleRoutes);
app.use('/api/role-permissions', rolePermissionRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/branch', branchRoutes); // Changed from '/api/branches' to '/api/branch'
app.use('/api/employee-roles', employeeRoleRoutes);
app.use('/api', permissionRoutes); // This will register /api/permission-groups-with-categories
app.use('/api/employee-auth', employeeAuthRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/bench-resources', benchResourceRoutes);
app.use('/api/hotlists', hotlistRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to QORE API',
    version: '1.0.0',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const PORT = process.env.PORT || 8081; // Changed to avoid conflict with frontend port

// Test database connection and sync models
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Sync models with database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Database models synchronized.');    // Setup model associations
    const { setupAssociations: setupRoleAssociations } = require('./models/Role');
    const { setupAssociations: setupRolePermissionAssociations } = require('./models/RolePermission');
    const { setupAssociations: setupUserAssociations } = require('./models/User');
    const { setupAssociations: setupEmployeeAssociations } = require('./models/Employee');
    const { setupAssociations: setupPermissionGroupAssociations } = require('./models/PermissionGroup');
    const { setupAssociations: setupPermissionCategoryAssociations } = require('./models/PermissionCategory');
    const { setupAssociations: setupDepartmentAssociations } = require('./models/Department');
    const { setupAssociations: setupDesignationAssociations } = require('./models/Designation');
    const { setupAssociations: setupEmployeeRoleAssociations } = require('./models/EmployeeRole');
    const { setupAssociations: setupBranchAssociations } = require('./models/Branch');
    const { setupAssociations: setupRefreshTokenAssociations } = require('./models/RefreshToken');

    setupRoleAssociations();
    setupRolePermissionAssociations();
    setupUserAssociations();
    setupEmployeeAssociations();
    setupPermissionGroupAssociations();
    setupPermissionCategoryAssociations();
    setupDepartmentAssociations();
    setupDesignationAssociations();
    setupEmployeeRoleAssociations();
    setupBranchAssociations();
    setupRefreshTokenAssociations();

    // Setup new model associations
    const { setupAssociations: setupBenchResourceAssociations } = require('./models/BenchResource');
    const { setupAssociations: setupAssignmentAssociations } = require('./models/Assignment');
    const { setupAssociations: setupBenchAlertAssociations } = require('./models/BenchAlert');
    const { setupAssociations: setupHotlistAssociations } = require('./models/Hotlist');
    const { setupAssociations: setupHotlistCandidateAssociations } = require('./models/HotlistCandidate');
    const { setupAssociations: setupHotlistAnalyticsAssociations } = require('./models/HotlistAnalytics');

    setupBenchResourceAssociations();
    setupAssignmentAssociations();
    setupBenchAlertAssociations();
    setupHotlistAssociations();
    setupHotlistCandidateAssociations();
    setupHotlistAnalyticsAssociations();

    // Seed data if in development mode
    if (process.env.NODE_ENV === 'development') {
      const seedPermissions = require('./seeders/permissionSeeder');
      await seedPermissions();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
