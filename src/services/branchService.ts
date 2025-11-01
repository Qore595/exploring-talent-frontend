import apiClient from './api';
import axios from 'axios';

// Types
export interface Branch {
  id: number;
  name: string;
  code: string;
  slug: string;
  address?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  postal_code?: string;
  phone?: string;
  alt_phone?: string;
  email?: string;
  fax?: string;
  manager_id?: number;
  description?: string;
  location_lat?: string;
  location_lng?: string;
  google_maps_url?: string;
  working_hours?: string;
  timezone?: string;
  logo_url?: string;
  website_url?: string;
  support_email?: string;
  support_phone?: string;
  branch_type: string;
  opening_date?: string;
  last_renovated?: string;
  monthly_rent?: string;
  owned_or_rented?: string;
  no_of_employees?: number;
  fire_safety_certified?: boolean;
  is_default?: boolean;
  is_active: boolean;
  created_by: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface BranchesResponse {
  success: boolean;
  data: Branch[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface BranchResponse {
  success: boolean;
  data: Branch;
}

export interface BranchCreateResponse {
  success: boolean;
  message: string;
  data: Branch;
}

export interface BranchUpdateResponse {
  success: boolean;
  message: string;
  data: Branch;
}

export interface BranchDeleteResponse {
  success: boolean;
  message: string;
}

export interface BranchCreateData {
  name: string;
  code: string;
  slug?: string;
  address?: string;
  landmark?: string;
  city: string;
  district?: string;
  state: string;
  country: string;
  postal_code?: string;
  phone?: string;
  alt_phone?: string;
  email?: string;
  fax?: string;
  manager_id?: number;
  description?: string;
  location_lat?: string;
  location_lng?: string;
  google_maps_url?: string;
  working_hours?: string;
  timezone?: string;
  logo_url?: string;
  website_url?: string;
  support_email?: string;
  support_phone?: string;
  branch_type: string;
  opening_date?: string;
  last_renovated?: string;
  monthly_rent?: string | number;
  owned_or_rented?: string;
  no_of_employees?: number;
  fire_safety_certified?: boolean;
  is_default?: boolean;
  is_active?: boolean;
  created_by: number;
}

export interface BranchQueryParams {
  page?: number;
  limit?: number;
  is_active?: boolean;
  branch_type?: string;
  city?: string;
  state?: string;
  country?: string;
  search?: string;
}

// Branch service
export const branchService = {
  // Get all branches
  getBranches: async (params: BranchQueryParams = {}): Promise<any> => {
    try {
      console.log('Fetching branches with params:', params);
      console.log('API client base URL:', apiClient.defaults.baseURL);

      const response = await apiClient.get('/branches', { params });
      console.log('Raw API response:', response);

      // Process the response based on its format
      const data = response.data;

      if (Array.isArray(data)) {
        console.log('Response is an array of branches');
        return { data };
      } else if (data && typeof data === 'object') {
        if (data.data && Array.isArray(data.data)) {
          console.log('Response has data property with array');
          return data;
        } else if (data.success && data.data && Array.isArray(data.data)) {
          console.log('Response has success and data properties');
          return data;
        } else {
          console.log('Response is an object but not in expected format:', data);
          // Try to extract branches from the response
          const possibleBranches = Object.values(data).find(val => Array.isArray(val));
          if (possibleBranches) {
            console.log('Found possible branches array in response');
            return { data: possibleBranches };
          }
        }
      }

      // If we couldn't process the response in a specific way, return it as is
      console.log('Returning raw response data');
      return { data: response.data };
    } catch (error) {
      console.error('API error in getBranches:', error);
      throw error;
    }
  },

  // Get branch by ID
  getBranchById: async (id: number | string): Promise<any> => {
    try {
      const response = await apiClient.get(`/branches/${id}`);
      console.log('Raw API response for single branch:', response);

      // Return the raw response data for debugging
      return response.data;
    } catch (error) {
      console.error('API error in getBranchById:', error);
      throw error;
    }
  },

  // Create branch
  createBranch: async (branchData: BranchCreateData): Promise<any> => {
    try {
      // Clean up the data by removing undefined values
      const cleanData = Object.fromEntries(
        Object.entries(branchData).filter(([_, v]) => v !== undefined)
      );

      console.log('Sending branch data:', cleanData);
      const response = await apiClient.post('/branches', cleanData);
      console.log('Create branch response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in createBranch:', error);
      throw error;
    }
  },

  // Update branch
  updateBranch: async (id: number | string, branchData: Partial<BranchCreateData>): Promise<any> => {
    try {
      console.log('Updating branch data:', branchData);
      const response = await apiClient.put(`/branches/${id}`, branchData);
      console.log('Update branch response:', response);

      // Return the raw response data for debugging
      return response.data;
    } catch (error) {
      console.error('API error in updateBranch:', error);
      throw error;
    }
  },

  // Get branch with related data (departments, designations, and roles)
  getBranchWithRelatedData: async (branchId: number | string): Promise<any> => {
    try {
      console.log('Fetching branch with related data for branch ID:', branchId);

      // Ensure branch ID is properly formatted
      const formattedBranchId = typeof branchId === 'string' ? branchId.trim() : branchId;

      // Log the full URL for debugging
      const url = `/branch/${formattedBranchId}/with-related-data`;
      console.log('API URL for branch with related data:', apiClient.defaults.baseURL + url);

      try {
        const response = await apiClient.get(url);
        console.log('Branch with related data response:', response);

        // Return the raw response data
        return response.data;
      } catch (apiError: any) {
        console.error('API error in getBranchWithRelatedData:', apiError);

        // Log detailed error information
        console.error('Error details:', {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          config: apiError.config
        });

        // Try a direct fetch as fallback
        console.log('Attempting direct fetch as fallback...');
        const apiBaseUrl = apiClient.defaults.baseURL || 'http://localhost:3013/api';
        const fullUrl = `${apiBaseUrl}/branch/${formattedBranchId}/with-related-data`;

        try {
          const token = localStorage.getItem('accessToken');
          const fetchResponse = await fetch(fullUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
          });

          if (fetchResponse.ok) {
            const data = await fetchResponse.json();
            console.log('Direct fetch response:', data);
            return data;
          } else {
            console.error('Direct fetch failed with status:', fetchResponse.status);
            throw new Error(`API returned status ${fetchResponse.status}`);
          }
        } catch (fetchError) {
          console.error('Direct fetch also failed:', fetchError);
          throw apiError; // Throw the original error
        }
      }
    } catch (error) {
      console.error('Unexpected error in getBranchWithRelatedData:', error);
      throw error;
    }
  },

  // Get departments and designations by branch ID (legacy method)
  getDepartmentsAndDesignationsByBranchId: async (branchId: number | string): Promise<any> => {
    try {
      console.log('Using new getBranchWithRelatedData method instead of legacy getDepartmentsAndDesignationsByBranchId');

      // Call the new method
      const response = await branchService.getBranchWithRelatedData(branchId);

      // Transform the response to match the old format
      if (response && response.success && response.data) {
        return {
          success: true,
          data: {
            departments: response.data.departments || [],
            designations: response.data.designations || []
          }
        };
      }

      return response;
    } catch (error) {
      console.error('Error in getDepartmentsAndDesignationsByBranchId:', error);
      throw error;
    }
  },

  // Delete branch
  deleteBranch: async (id: number | string): Promise<any> => {
    try {
      console.log('Deleting branch with ID:', id);

      // Ensure ID is properly formatted
      const branchId = typeof id === 'string' ? id.trim() : id;

      // Get the API base URL directly from environment variables to ensure it's correct
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3013/api';

      // Construct the full URL for the DELETE request
      const fullUrl = `${apiBaseUrl}/branches/${branchId}`;
      console.log('Full DELETE URL:', fullUrl);

      // Use axios directly to ensure the request is made correctly
      const response = await axios.delete(fullUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        timeout: 30000,
      });

      console.log('Delete branch response:', response);

      // Return the response data
      // If the response is empty but status is success, return the expected format
      if (response.status >= 200 && response.status < 300) {
        if (!response.data) {
          return { success: true, message: 'Branch deleted successfully' };
        }
        return response.data;
      }

      return response.data;
    } catch (error: any) {
      console.error('API error in deleteBranch:', error);

      // Provide more detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);

        // If we get a 403 Forbidden, it might be a permissions issue
        if (error.response.status === 403) {
          throw new Error('You do not have permission to delete this branch. Please contact an administrator.');
        }

        // If we get a 404 Not Found, the branch might already be deleted
        if (error.response.status === 404) {
          throw new Error('Branch not found. It may have already been deleted.');
        }

        // If the server returned an error message, use it
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message);
        }
      } else if (error.request) {
        console.error('Error request:', error.request);
        throw new Error('No response received from server. Please check your network connection and try again.');
      } else {
        console.error('Error message:', error.message);
      }

      throw error;
    }
  }
};

export default branchService;




