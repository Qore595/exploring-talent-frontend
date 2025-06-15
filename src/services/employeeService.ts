import apiClient from './api';
import axios from 'axios';

// Types
export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  gender: 'male' | 'female' | 'other' | null;
  dob: string | null;
  photo: string | null;
  branch_id: number | null;
  department_id: number | null;
  designation_id: number | null;
  position: string | null;
  qualification: string | null;
  work_experience: string | null;
  hire_date: string | null;
  date_of_leaving: string | null;
  employment_status: 'full-time' | 'part-time' | 'contract' | 'intern' | 'terminated' | null;
  contract_type: string | null;
  work_shift: string | null;
  current_location: string | null;
  reporting_to: number | null;
  emergency_contact: string | null;
  emergency_contact_relation: string | null;
  marital_status: string | null;
  father_name: string | null;
  mother_name: string | null;
  local_address: string | null;
  permanent_address: string | null;
  bank_account_name: string | null;
  bank_account_no: string | null;
  bank_name: string | null;
  bank_branch: string | null;
  ifsc_code: string | null;
  basic_salary: number | null;
  facebook: string | null;
  twitter: string | null;
  linkedin: string | null;
  instagram: string | null;
  resume: string | null;
  joining_letter: string | null;
  other_documents: string | null;
  notes: string | null;
  is_superadmin: boolean;
  is_active: boolean;
  created_by: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
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
    short_code: string;
  };
  Manager?: {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string | null;
  };
  Subordinates?: {
    id: number;
    employee_id: string;
    first_name: string;
    last_name: string | null;
  }[];
}

export interface EmployeesResponse {
  success: boolean;
  data: Employee[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface EmployeeResponse {
  success: boolean;
  data: Employee;
}

export interface EmployeeCreateResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface EmployeeUpdateResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface EmployeeDeleteResponse {
  success: boolean;
  message: string;
}

export interface EmployeeCreateData {
  employee_id: string;
  first_name: string;
  last_name?: string;
  email?: string;
  phone?: string;
  password: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string;
  photo?: string;
  branch_id?: number;
  department_id?: number;
  designation_id?: number;
  position?: string;
  qualification?: string;
  work_experience?: string;
  hire_date?: string;
  date_of_leaving?: string;
  employment_status?: 'full-time' | 'part-time' | 'contract' | 'intern' | 'terminated';
  contract_type?: string;
  work_shift?: string;
  current_location?: string;
  reporting_to?: number;
  emergency_contact?: string;
  emergency_contact_relation?: string;
  marital_status?: string;
  father_name?: string;
  mother_name?: string;
  local_address?: string;
  permanent_address?: string;
  bank_account_name?: string;
  bank_account_no?: string;
  bank_name?: string;
  bank_branch?: string;
  ifsc_code?: string;
  basic_salary?: number;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  resume?: string;
  joining_letter?: string;
  other_documents?: string;
  notes?: string;
  is_superadmin?: boolean;
  is_active?: boolean;
  created_by?: number;
}

export interface EmployeeQueryParams {
  page?: number;
  limit?: number;
  is_active?: boolean;
  branch_id?: number;
  department_id?: number;
  designation_id?: number;
  employment_status?: string;
  search?: string;
}

export interface PermissionCategory {
  id: number;
  name: string;
  short_code: string;
  description: string;
  can_view: boolean;
  can_add: boolean;
  can_edit: boolean;
  can_delete: boolean;
}

export interface SubMenu {
  id: number;
  sub_menu: string;
  icon: string;
  url: string | null;
  lang_key: string;
  display_order: number;
  level: number;
  is_active: boolean;
  permission_categories: PermissionCategory[];
}

export interface SidebarMenu {
  id: number;
  menu: string;
  icon: string;
  url: string | null;
  lang_key: string;
  display_order: number;
  level: number;
  sub_menus: SubMenu[];
}

// Employee service
export const employeeService = {
  // Get all employees
  getEmployees: async (params: EmployeeQueryParams = {}): Promise<any> => {
    try {
      console.log('Fetching employees with params:', params);
      console.log('API client base URL:', apiClient.defaults.baseURL);

      const response = await apiClient.get('/employees', { params });
      console.log('Raw API response:', response);

      // Return the raw response data
      return response.data;
    } catch (error) {
      console.error('API error in getEmployees:', error);
      throw error;
    }
  },

  // Get employee by ID
  getEmployeeById: async (id: number | string): Promise<any> => {
    try {
      console.log('Fetching employee profile with ID:', id);
      const response = await apiClient.get(`/employees/profile/${id}`);
      
      // Log the full response for debugging
      console.log('Get employee profile raw API response:', response.data);
      
      // Extract the relevant data
      const employeeData = response.data?.data || {};
      const sidebarMenus = employeeData.sidebar_menus || [];
      
      // Return a structured response
      return {
        success: response.data?.success || false,
        data: employeeData,
        sidebar_menus: sidebarMenus
      };
    } catch (error) {
      console.error('API error in getEmployeeById:', error);
      throw error;
    }
  },

  // Create employee
  createEmployee: async (employeeData: EmployeeCreateData, retryCount = 0): Promise<any> => {
    try {
      // Clean up the data by removing undefined values
      const cleanData = Object.fromEntries(
        Object.entries(employeeData).filter(([_, v]) => v !== undefined)
      );

      console.log('Sending employee data to API:', cleanData);
      console.log('API URL:', apiClient.defaults.baseURL + '/employees');
      console.log('Retry count:', retryCount);

      try {
        // Log the full request details for debugging
        console.log('Request headers:', apiClient.defaults.headers);

        // Make the API call with detailed error logging
        const response = await apiClient.post('/employees', cleanData);
        console.log('Create employee response:', response);

        // Return the raw response data
        return response.data;
      } catch (apiError: any) {
        console.error('API error in createEmployee:', apiError);

        // Log detailed error information
        console.error('Error details:', {
          message: apiError.message,
          status: apiError.response?.status,
          statusText: apiError.response?.statusText,
          data: apiError.response?.data,
          config: apiError.config
        });

        // Retry logic - attempt up to 2 retries for network errors
        if (retryCount < 2 && (!apiError.response || apiError.code === 'ECONNABORTED')) {
          console.log(`Retrying API call (${retryCount + 1}/2)...`);
          // Wait for a short delay before retrying
          await new Promise(resolve => setTimeout(resolve, 1000));
          return employeeService.createEmployee(employeeData, retryCount + 1);
        }

        // Try a different approach if we're on the last retry
        if (retryCount === 2) {
          console.log('Trying alternative approach with fetch API...');
          try {
            const token = localStorage.getItem('accessToken');
            const fetchResponse = await fetch(`${apiClient.defaults.baseURL}/employees`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
              },
              body: JSON.stringify(cleanData)
            });

            const data = await fetchResponse.json();
            console.log('Fetch API response:', data);
            return data;
          } catch (fetchError) {
            console.error('Fetch API also failed:', fetchError);
          }
        }

        // If we get a response with error details, format it nicely
        if (apiError.response?.data) {
          console.log('API error response data:', apiError.response.data);
          return apiError.response.data;
        }

        // Otherwise, create a standardized error response
        return {
          success: false,
          message: apiError.message || 'Failed to create employee',
          error: apiError
        };
      }
    } catch (error: any) {
      console.error('Unexpected error in createEmployee service:', error);
      return {
        success: false,
        message: error.message || 'An unexpected error occurred',
        error: error
      };
    }
  },

  // Update employee
  updateEmployee: async (id: number | string, employeeData: Partial<EmployeeCreateData>): Promise<any> => {
    try {
      console.log('Updating employee data:', employeeData);

      // Ensure ID is properly formatted
      const employeeId = typeof id === 'string' ? id.trim() : id;

      // Make the API call
      const response = await apiClient.put(`/employees/${employeeId}`, employeeData);
      console.log('Update employee response:', response);

      // Return the raw response data
      return response.data;
    } catch (error: any) {
      console.error('API error in updateEmployee:', error);

      // If we have a response with error details, return it in a consistent format
      if (error.response?.data) {
        console.log('API error response data:', error.response.data);
        return error.response.data;
      }

      // Otherwise, throw the error for the caller to handle
      throw error;
    }
  },

  // Delete employee
  deleteEmployee: async (id: number | string): Promise<any> => {
    try {
      console.log('Deleting employee with ID:', id);

      // Ensure ID is properly formatted
      const employeeId = typeof id === 'string' ? id.trim() : id;

      // Use the configured apiClient which includes auth token and proper error handling
      const response = await apiClient.delete(`/employees/${employeeId}`);

      console.log('Delete employee response:', response);
      return response.data;
    } catch (error) {
      console.error('API error in deleteEmployee:', error);
      throw error;
    }
  },
};
