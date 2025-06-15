/**
 * This is a mock implementation of the file upload functionality.
 * It simulates saving files to the server by creating URLs for the files
 * and returning success responses.
 */

/**
 * Mock function to upload a resume to the server
 * @param file The file to upload
 * @param employeeId The ID of the employee
 * @returns A promise that resolves to a success response
 */
export const mockUploadResumeToServer = async (file: File, employeeId: string) => {
  // Create a local URL for the file
  const fileUrl = URL.createObjectURL(file);
  
  // Generate a unique filename with employee ID
  const fileExtension = file.name.split('.').pop() || '';
  const fileName = `employee_${employeeId}_${Date.now()}.${fileExtension}`;
  
  // Simulate a server response
  return {
    success: true,
    message: 'Resume uploaded successfully',
    data: {
      fileName: fileName,
      originalName: file.name,
      fileUrl: fileUrl,
      fullFileUrl: fileUrl,
      filePath: `C:\\Users\\pitti\\Downloads\\QORE-main\\upload\\${fileName}`,
      size: file.size,
      mimetype: file.type
    }
  };
};
