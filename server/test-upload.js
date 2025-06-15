const fs = require('fs');
const path = require('path');

// Use the same upload directory as in the server
const uploadPath = 'C:\\Users\\pitti\\Downloads\\QORE-main\\upload';

// Create the upload directory if it doesn't exist
if (!fs.existsSync(uploadPath)) {
  console.log(`Creating upload directory: ${uploadPath}`);
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Create a test file
const testFilePath = path.join(uploadPath, 'test-script.txt');
try {
  fs.writeFileSync(testFilePath, 'This file was created by the test script to verify write permissions.');
  console.log(`Successfully created test file at: ${testFilePath}`);
} catch (error) {
  console.error(`Failed to create test file: ${error.message}`);
}

// Create a test PDF file
const testPdfContent = `%PDF-1.4
1 0 obj
<</Type /Catalog /Pages 2 0 R>>
endobj
2 0 obj
<</Type /Pages /Kids [3 0 R] /Count 1>>
endobj
3 0 obj
<</Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 500 800] /Contents 6 0 R>>
endobj
4 0 obj
<</Font <</F1 5 0 R>>>>
endobj
5 0 obj
<</Type /Font /Subtype /Type1 /BaseFont /Helvetica>>
endobj
6 0 obj
<</Length 44>>
stream
BT /F1 24 Tf 100 700 Td (Test PDF File) Tj ET
endstream
endobj
xref
0 7
0000000000 65535 f
0000000009 00000 n
0000000056 00000 n
0000000111 00000 n
0000000212 00000 n
0000000250 00000 n
0000000317 00000 n
trailer
<</Size 7 /Root 1 0 R>>
startxref
406
%%EOF`;

const testPdfPath = path.join(uploadPath, 'test-script.pdf');
try {
  fs.writeFileSync(testPdfPath, testPdfContent);
  console.log(`Successfully created test PDF file at: ${testPdfPath}`);
} catch (error) {
  console.error(`Failed to create test PDF file: ${error.message}`);
}

// List all files in the upload directory
try {
  const files = fs.readdirSync(uploadPath);
  console.log(`Files in upload directory (${uploadPath}):`);
  files.forEach(file => {
    const filePath = path.join(uploadPath, file);
    const stats = fs.statSync(filePath);
    console.log(`- ${file} (${stats.size} bytes)`);
  });
} catch (error) {
  console.error(`Failed to list files: ${error.message}`);
}

console.log('\nTest completed. Check the upload directory for the test files.');
