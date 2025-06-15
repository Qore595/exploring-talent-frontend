import { AxiosError } from 'axios';

// Custom API error class
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Function to handle API errors
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status;
    const data = error.response.data;
    const message = data.message || error.message || 'An error occurred';
    
    return new ApiError(message, status, data);
  } else if (error.request) {
    // The request was made but no response was received
    return new ApiError('No response from server', 0);
  } else {
    // Something happened in setting up the request that triggered an Error
    return new ApiError(error.message || 'Request setup error', 0);
  }
};

// Function to format error message for display
export const formatErrorMessage = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  } else if (error instanceof Error) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unknown error occurred';
  }
};
