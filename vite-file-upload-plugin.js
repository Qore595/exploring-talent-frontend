import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import bodyParser from 'body-parser';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the upload directory
const UPLOAD_DIR = path.join(__dirname, 'upload');

// Create the upload directory if it doesn't exist
try {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`Created upload directory: ${UPLOAD_DIR}`);
  } else {
    console.log(`Upload directory already exists: ${UPLOAD_DIR}`);
  }

  // Test write permissions by creating a test file
  const testFile = path.join(UPLOAD_DIR, `test-write-${Date.now()}.txt`);
  fs.writeFileSync(testFile, 'Test write permissions');
  fs.unlinkSync(testFile); // Clean up the test file
  console.log(`Successfully verified write permissions to: ${UPLOAD_DIR}`);
} catch (error) {
  console.error(`Error with upload directory: ${error.message}`);
  console.error('This will cause file uploads to fail!');
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    // Get employee ID from the req object where we stored it
    // Default to 'unknown' if not provided
    const employeeId = req.employeeId || 'unknown';
    console.log('Employee ID for file naming:', employeeId);

    // Generate a unique filename with employee ID and timestamp
    const timestamp = Date.now();
    const fileExtension = path.extname(file.originalname);
    cb(null, `employee_${employeeId}_${timestamp}${fileExtension}`);
  }
});

const upload = multer({ storage: storage });

// Vite plugin for file uploads
export default function fileUploadPlugin() {
  return {
    name: 'vite-plugin-file-upload',
    configureServer(server) {
      // Parse URL-encoded bodies
      server.middlewares.use(bodyParser.urlencoded({ extended: true }));

      // Parse JSON bodies
      server.middlewares.use(bodyParser.json());

      // Serve static files from the upload directory
      server.middlewares.use('/upload', (req, res, next) => {
        if (req.method === 'GET') {
          const filePath = path.join(UPLOAD_DIR, req.url.split('/').pop());
          if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath);
            const contentType = getContentType(filePath);
            res.setHeader('Content-Type', contentType);
            res.end(fileContent);
          } else {
            res.statusCode = 404;
            res.end('File not found');
          }
        } else {
          next();
        }
      });

      // Handle file uploads
      server.middlewares.use('/direct-upload', (req, res, next) => {
        if (req.method === 'POST') {
          console.log('Direct upload request received');

          // Parse the URL to get query parameters
          const url = new URL(req.url, 'http://localhost:8083');
          const employeeId = url.searchParams.get('employeeId') || 'unknown';
          console.log('Employee ID from URL params:', employeeId);

          // Use multer to handle the file upload
          const multerSingle = upload.single('file');

          // Add employeeId to req object so multer can access it
          req.employeeId = employeeId;

          multerSingle(req, res, (err) => {
            if (err) {
              console.error('Error uploading file:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({
                success: false,
                message: 'Error uploading file',
                error: err.message
              }));
              return;
            }

            if (!req.file) {
              console.error('No file uploaded');
              res.statusCode = 400;
              res.end(JSON.stringify({
                success: false,
                message: 'No file uploaded'
              }));
              return;
            }

            console.log('File uploaded successfully:', req.file);
            console.log('File saved to:', req.file.path);

            // Return success response
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              message: 'Resume uploaded successfully',
              data: {
                fileName: req.file.filename,
                originalName: req.file.originalname,
                fileUrl: `/upload/${req.file.filename}`,
                fullFileUrl: `http://localhost:8083/upload/${req.file.filename}`,
                filePath: req.file.path,
                size: req.file.size,
                mimetype: req.file.mimetype
              }
            }));
          });
        } else {
          next();
        }
      });

      // List uploaded files
      server.middlewares.use('/list-uploads', (req, res, next) => {
        if (req.method === 'GET') {
          try {
            const files = fs.readdirSync(UPLOAD_DIR);
            const fileDetails = files.map(file => {
              const filePath = path.join(UPLOAD_DIR, file);
              const stats = fs.statSync(filePath);
              return {
                name: file,
                path: filePath,
                size: stats.size,
                created: stats.birthtime,
                modified: stats.mtime
              };
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: true,
              message: 'Files retrieved successfully',
              data: {
                uploadDir: UPLOAD_DIR,
                files: fileDetails
              }
            }));
          } catch (error) {
            console.error('Error listing files:', error);
            res.statusCode = 500;
            res.end(JSON.stringify({
              success: false,
              message: 'Error listing files',
              error: error.message
            }));
          }
        } else {
          next();
        }
      });
    }
  };
}

// Helper function to get content type based on file extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.txt': 'text/plain',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif'
  };

  return contentTypes[ext] || 'application/octet-stream';
}
