import apiClient from './api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    employee: EmployeeData;
    token: string;
    refreshToken: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    refreshToken: string;
  };
}

export interface StatusResponse {
  success: boolean;
  message: string;
  data?: {
    employee: EmployeeData;
  };
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export interface EmployeeData {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  phone?: string;
  gender?: string;
  branch_id?: number;
  department_id?: number;
  designation_id?: number;
  is_active: boolean;
  is_superadmin: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
  Branch?: {
    id: number;
    name: string;
  };
  Department?: {
    id: number;
    name: string;
  };
  Designation?: {
    id: number;
    name: string;
    short_code?: string;
  };
}

// Authentication service
export const authService = {
  // Login with email and password
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log('Logging in with credentials:', { email: credentials.email });
      const response = await apiClient.post('/employee-auth/login', credentials);
      
      // Store tokens in localStorage if login is successful
      if (response.data.success && response.data.data) {
        localStorage.setItem('accessToken', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
        
        // Store basic user info for quick access
        const userData = {
          id: response.data.data.employee.id,
          name: `${response.data.data.employee.first_name} ${response.data.data.employee.last_name || ''}`.trim(),
          email: response.data.data.employee.email,
          role: response.data.data.employee.is_superadmin ? 'ceo' : 'employee',
          employeeId: response.data.data.employee.employee_id,
          branchId: response.data.data.employee.branch_id,
          departmentId: response.data.data.employee.department_id,
          designationId: response.data.data.employee.designation_id,
          isActive: response.data.data.employee.is_active,
          isSuperadmin: response.data.data.employee.is_superadmin,
        };
        localStorage.setItem('userData', JSON.stringify(userData));
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Return a structured error response
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  },
  
  // Refresh token
  refreshToken: async (refreshTokenRequest: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    try {
      const response = await apiClient.post('/employee-auth/refresh-token', refreshTokenRequest);
      
      // Update tokens in localStorage if refresh is successful
      if (response.data.success && response.data.data) {
        localStorage.setItem('accessToken', response.data.data.token);
        localStorage.setItem('refreshToken', response.data.data.refreshToken);
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Refresh token error:', error);
      
      // Clear tokens if refresh fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to refresh token.',
      };
    }
  },
  
  // Check authentication status
  checkStatus: async (): Promise<StatusResponse> => {
    try {
      const response = await apiClient.get('/employee-auth/status');
      return response.data;
    } catch (error: any) {
      console.error('Check status error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to check authentication status.',
      };
    }
  },
  
  // Logout
  logout: async (): Promise<LogoutResponse> => {
    try {
      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Call logout API if refresh token exists
      if (refreshToken) {
        const response = await apiClient.post('/employee-auth/logout', { refreshToken });
        
        // Clear tokens regardless of API response
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userData');
        
        return response.data;
      }
      
      // If no refresh token, just clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      return {
        success: true,
        message: 'Logged out successfully',
      };
    } catch (error: any) {
      console.error('Logout error:', error);
      
      // Clear tokens even if API call fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      return {
        success: false,
        message: error.response?.data?.message || 'Logout failed, but local session was cleared.',
      };
    }
  },
  
  // Get current user data from localStorage
  getCurrentUser: (): any => {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) return null;
    
    try {
      return JSON.parse(userDataString);
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};

export default authService;
