import apiClient from './api';

// Types
export interface EmployeeRole {
  id: number;
  employee_id: number;
  role_id: number;
  branch_id: number;
  is_primary: boolean;
  is_active: boolean;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  Employee?: {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string;
  };
  Role?: {
    id: number;
    name: string;
    slug: string;
  };
  Branch?: {
    id: number;
    name: string;
    code: string;
  };
  CreatedBy?: {
    id: number;
    first_name: string;
    last_name: string;
    employee_id: string;
  };
}

export interface EmployeeRoleCreateData {
  employee_id: number;
  role_id: number;
  branch_id: number;
  is_primary?: boolean;
  is_active?: boolean;
  created_by: number;
}

export interface EmployeeRoleResponse {
  success: boolean;
  message: string;
  data: EmployeeRole;
}

// Employee Role service
export const employeeRoleService = {
  // Create employee role
  createEmployeeRole: async (employeeRoleData: EmployeeRoleCreateData): Promise<EmployeeRoleResponse> => {
    try {
      console.log('Creating employee role with data:', employeeRoleData);

      // Clean up the data by removing undefined values
      const cleanData = Object.fromEntries(
        Object.entries(employeeRoleData).filter(([_, v]) => v !== undefined)
      );

      // Ensure all IDs are numbers
      if (typeof cleanData.employee_id === 'string') {
        cleanData.employee_id = parseInt(cleanData.employee_id);
      }
      if (typeof cleanData.role_id === 'string') {
        cleanData.role_id = parseInt(cleanData.role_id);
      }
      if (typeof cleanData.branch_id === 'string') {
        cleanData.branch_id = parseInt(cleanData.branch_id);
      }
      if (typeof cleanData.created_by === 'string') {
        cleanData.created_by = parseInt(cleanData.created_by);
      }

      // Ensure boolean values are actual booleans
      if (cleanData.is_primary !== undefined) {
        cleanData.is_primary = Boolean(cleanData.is_primary);
      }
      if (cleanData.is_active !== undefined) {
        cleanData.is_active = Boolean(cleanData.is_active);
      }

      console.log('Cleaned employee role data:', cleanData);

      // Try direct fetch as primary method
      try {
        console.log('Attempting direct fetch for employee role creation...');
        const apiBaseUrl = apiClient.defaults.baseURL || 'http://localhost:3013/api';
        const fullUrl = `${apiBaseUrl}/employee-roles`;

        const token = localStorage.getItem('accessToken');
        const fetchResponse = await fetch(fullUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify(cleanData)
        });

        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          console.log('Direct fetch response for employee role creation:', data);
          return data;
        } else {
          console.error('Direct fetch failed with status:', fetchResponse.status);
          const errorData = await fetchResponse.text();
          console.error('Error response:', errorData);
          throw new Error(`API returned status ${fetchResponse.status}: ${errorData}`);
        }
      } catch (fetchError) {
        console.error('Direct fetch failed:', fetchError);

        // Fall back to axios
        const response = await apiClient.post('/employee-roles', cleanData);
        console.log('Create employee role response:', response);
        return response.data;
      }
    } catch (error) {
      console.error('API error in createEmployeeRole:', error);
      throw error;
    }
  },

  // Get employee roles by employee ID
  getEmployeeRolesByEmployeeId: async (employeeId: number | string): Promise<any> => {
    try {
      console.log('Fetching employee roles for employee ID:', employeeId);
      const response = await apiClient.get(`/employee-roles/employee/${employeeId}`);
      console.log('Get employee roles response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in getEmployeeRolesByEmployeeId:', error);
      throw error;
    }
  },

  // Update employee role
  updateEmployeeRole: async (id: number | string, employeeRoleData: Partial<EmployeeRoleCreateData>): Promise<any> => {
    try {
      console.log('Updating employee role with ID:', id);

      // Clean up the data by removing undefined values
      const cleanData = Object.fromEntries(
        Object.entries(employeeRoleData).filter(([_, v]) => v !== undefined)
      );

      const response = await apiClient.put(`/employee-roles/${id}`, cleanData);
      console.log('Update employee role response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in updateEmployeeRole:', error);
      throw error;
    }
  },

  // Delete employee role
  deleteEmployeeRole: async (id: number | string): Promise<any> => {
    try {
      console.log('Deleting employee role with ID:', id);
      const response = await apiClient.delete(`/employee-roles/${id}`);
      console.log('Delete employee role response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in deleteEmployeeRole:', error);
      throw error;
    }
  },
};

export default employeeRoleService;
