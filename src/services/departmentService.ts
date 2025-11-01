import apiClient from './api';
import axios from 'axios';

// Types
export interface Department {
  id: number;
  name: string;
  branch_id: number;
  short_code: string;
  description: string;
  is_active: boolean;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  Branch?: {
    id: number;
    name: string;
  };
}

export interface DepartmentsResponse {
  success: boolean;
  data: Department[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface DepartmentResponse {
  success: boolean;
  data: Department;
}

export interface DepartmentCreateResponse {
  success: boolean;
  message: string;
  data: Department;
}

export interface DepartmentUpdateResponse {
  success: boolean;
  message: string;
  data: Department;
}

export interface DepartmentDeleteResponse {
  success: boolean;
  message: string;
}

export interface DepartmentCreateData {
  name: string;
  branch_id: number;
  short_code?: string;
  description?: string;
  is_active?: boolean;
  created_by: number;
}

export interface DepartmentQueryParams {
  page?: number;
  limit?: number;
  is_active?: boolean;
  branch_id?: number;
  search?: string;
}

// Department service
export const departmentService = {
  // Get all departments
  getDepartments: async (params: DepartmentQueryParams = {}): Promise<any> => {
    try {
      console.log('Fetching departments with params:', params);
      console.log('API client base URL:', apiClient.defaults.baseURL);

      const response = await apiClient.get('/departments', { params });
      console.log('Raw API response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in getDepartments:', error);
      throw error;
    }
  },

  // Get department by ID
  getDepartmentById: async (id: number | string): Promise<any> => {
    try {
      const response = await apiClient.get(`/departments/${id}`);
      console.log('Raw API response for single department:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in getDepartmentById:', error);
      throw error;
    }
  },

  // Create department
  createDepartment: async (departmentData: DepartmentCreateData): Promise<any> => {
    try {
      // Clean up the data by removing undefined values
      const cleanData = Object.fromEntries(
        Object.entries(departmentData).filter(([_, v]) => v !== undefined)
      );

      console.log('Sending department data:', cleanData);
      const response = await apiClient.post('/departments', cleanData);
      console.log('Create department response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in createDepartment:', error);
      throw error;
    }
  },

  // Update department
  updateDepartment: async (id: number | string, departmentData: Partial<DepartmentCreateData>): Promise<any> => {
    try {
      console.log('Updating department data:', departmentData);
      const response = await apiClient.put(`/departments/${id}`, departmentData);
      console.log('Update department response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in updateDepartment:', error);
      throw error;
    }
  },

  // Delete department
  deleteDepartment: async (id: number | string): Promise<any> => {
    try {
      console.log('Deleting department with ID:', id);

      // Ensure ID is properly formatted
      const departmentId = typeof id === 'string' ? id.trim() : id;

      // Get the API base URL directly from environment variables to ensure it's correct
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3013/api';

      // Construct the full URL for the DELETE request
      const fullUrl = `${apiBaseUrl}/departments/${departmentId}`;
      console.log('Full DELETE URL:', fullUrl);

      // Use axios directly to ensure the request is made correctly
      const response = await axios.delete(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      });

      console.log('Delete department response:', response);
      return response.data;
    } catch (error) {
      console.error('API error in deleteDepartment:', error);
      throw error;
    }
  }
};

export default departmentService;
