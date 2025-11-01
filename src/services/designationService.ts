import apiClient from './api';
import axios from 'axios';

// Types
export interface Designation {
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

export interface DesignationsResponse {
  success: boolean;
  data: Designation[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface DesignationResponse {
  success: boolean;
  data: Designation;
}

export interface DesignationCreateResponse {
  success: boolean;
  message: string;
  data: Designation;
}

export interface DesignationUpdateResponse {
  success: boolean;
  message: string;
  data: Designation;
}

export interface DesignationDeleteResponse {
  success: boolean;
  message: string;
}

export interface DesignationCreateData {
  name: string;
  branch_id: number;
  short_code?: string;
  description?: string;
  is_active?: boolean;
  created_by: number;
}

export interface DesignationQueryParams {
  page?: number;
  limit?: number;
  is_active?: boolean;
  branch_id?: number;
  search?: string;
}

// Designation service
export const designationService = {
  // Get all designations
  getDesignations: async (params: DesignationQueryParams = {}): Promise<any> => {
    try {
      console.log('Fetching designations with params:', params);
      console.log('API client base URL:', apiClient.defaults.baseURL);

      const response = await apiClient.get('/designations', { params });
      console.log('Raw API response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in getDesignations:', error);
      throw error;
    }
  },

  // Get designation by ID
  getDesignationById: async (id: number | string): Promise<any> => {
    try {
      const response = await apiClient.get(`/designations/${id}`);
      console.log('Raw API response for single designation:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in getDesignationById:', error);
      throw error;
    }
  },

  // Create designation
  createDesignation: async (designationData: DesignationCreateData): Promise<any> => {
    try {
      // Clean up the data by removing undefined values
      const cleanData = Object.fromEntries(
        Object.entries(designationData).filter(([_, v]) => v !== undefined)
      );

      console.log('Sending designation data:', cleanData);
      const response = await apiClient.post('/designations', cleanData);
      console.log('Create designation response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in createDesignation:', error);
      throw error;
    }
  },

  // Update designation
  updateDesignation: async (id: number | string, designationData: Partial<DesignationCreateData>): Promise<any> => {
    try {
      console.log('Updating designation data:', designationData);
      const response = await apiClient.put(`/designations/${id}`, designationData);
      console.log('Update designation response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in updateDesignation:', error);
      throw error;
    }
  },

  // Delete designation
  deleteDesignation: async (id: number | string): Promise<any> => {
    try {
      console.log('Deleting designation with ID:', id);

      // Ensure ID is properly formatted
      const designationId = typeof id === 'string' ? id.trim() : id;

      // Get the API base URL directly from environment variables to ensure it's correct
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3013/api';

      // Construct the full URL for the DELETE request
      const fullUrl = `${apiBaseUrl}/designations/${designationId}`;
      console.log('Full DELETE URL:', fullUrl);

      // Use axios directly to ensure the request is made correctly
      const response = await axios.delete(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      });

      console.log('Delete designation response:', response);
      return response.data;
    } catch (error) {
      console.error('API error in deleteDesignation:', error);
      throw error;
    }
  }
};

export default designationService;
