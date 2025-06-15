import axios from 'axios';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend.exploring-talent.com/api'; // Updated port to match job API endpoint
console.log('API Base URL:', API_BASE_URL);

// Warn if API URL is not set or using fallback
if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn('VITE_API_BASE_URL environment variable is not set. Using fallback URL:', API_BASE_URL);
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // Some APIs require this for CSRF protection
  },
  timeout: 30000, // 30 seconds timeout (increased for slower connections)
  // Ensure proper handling of empty responses (common for DELETE requests)
  validateStatus: (status) => status >= 200 && status < 300,
  // Don't throw errors for 404 responses (useful for DELETE operations)
  // We'll handle these in the service layer
  maxRedirects: 5, // Allow redirects (some APIs redirect after DELETE)
});

// Request interceptor for adding auth token and logging
apiClient.interceptors.request.use(
  (config) => {
    // Log the request for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      headers: config.headers,
      params: config.params,
      data: config.data
    });

    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh and logging
apiClient.interceptors.response.use(
  (response) => {
    // Log the response for debugging
    console.log(`API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  async (error) => {
    // Log the error response for debugging
    console.error('API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data
    });
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // No refresh token available, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }

        // Call token refresh endpoint
        const response = await axios.post(`${API_BASE_URL}/employee-auth/refresh-token`, {
          refreshToken
        });

        // Save new tokens
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('accessToken', token);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default apiClient;


