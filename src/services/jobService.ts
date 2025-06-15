import apiClient from './api';
import { AxiosError } from 'axios';

// Define types for job creation
export interface JobCreateRequest {
  job_title: string;
  job_description: string;
  department_id: number;
  status: string;
  priority: string;
  assigned_to_employee_id?: number;
  min_salary?: number;
  max_salary?: number;
  employment_type: string;
  application_deadline?: string;
  is_remote?: boolean;
  client_budget_hourly?: number;
  internal_budget_hourly?: number;
  candidate_split_percentage?: number;
  company_split_percentage?: number;
  requirements?: string;
  responsibilities?: string;
  benefits?: string;
}

// Department interface
export interface Department {
  id: number;
  name: string;
  branch_id: number;
  short_code: string;
  description: string;
  is_active: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  Branch?: {
    id: number;
    name: string;
  };
}

// Department pagination interface
export interface DepartmentPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Department response interface
export interface DepartmentResponse {
  success: boolean;
  data: Department[];
  pagination: DepartmentPagination;
}

// Employee interface
export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  photo: string | null;
  branch_id: number;
  department_id: number;
  designation_id: number;
  position: string;
  employment_status: string;
  is_superadmin: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  Department?: {
    id: number;
    name: string;
  };
  Designation?: {
    id: number;
    name: string;
    short_code: string;
  };
}

// Branch info in employee response
export interface BranchInfo {
  id: number;
  name: string;
  code: string;
  location: string;
}

// Employee pagination interface
export interface EmployeePagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Employee response interface
export interface EmployeesByBranchResponse {
  success: boolean;
  data: {
    branch: BranchInfo;
    employees: Employee[];
    employeeCount: number;
  };
  pagination: EmployeePagination;
}

export interface JobResponse {
  success: boolean;
  message: string;
  data: {
    job_id: number;
    job_title: string;
    job_description: string;
    department_id: number;
    status: string;
    priority: string;
    assigned_to_employee_id?: number;
    min_salary?: number;
    max_salary?: number;
    employment_type: string;
    application_deadline?: string;
    is_remote: boolean;
    client_budget_hourly?: number;
    internal_budget_hourly?: number;
    candidate_split_percentage?: number;
    company_split_percentage?: number;
    requirements?: string;
    responsibilities?: string;
    benefits?: string;
    created_at: string;
    updated_at: string;
    Department?: {
      department_id: number;
      name: string;
    };
    AssignedEmployee?: {
      employee_id: number;
      first_name: string;
      last_name: string;
    };
  };
}

// Export the object as default for import in other files
const jobService = {
  /**
   * Create a new job
   * @param jobData The job data to create
   * @returns Promise with the created job data
   */
  createJob: async (jobData: JobCreateRequest): Promise<JobResponse> => {
    try {
      const response = await apiClient.post('/newjobs', jobData);
      return response.data;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  },

  /**
   * Update an existing job
   * @param jobId The ID of the job to update
   * @param jobData The updated job data
   * @returns Promise with the updated job data
   */
  updateJob: async (jobId: string | number, jobData: JobCreateRequest): Promise<JobResponse> => {
    try {
      console.log(`Updating job with ID: ${jobId}`);
      const response = await apiClient.put(`/newjobs/${jobId}`, jobData);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating job ${jobId}:`, error?.response?.data || error);
      throw error;
    }
  },

  /**
   * Get all jobs
   * @returns Promise with all jobs
   */
  getJobs: async (): Promise<any> => {
    try {
      const response = await apiClient.get('/jobs');
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },
  
  /**
   * Get all jobs from the new jobs API with filtering options
   * @param options Optional query parameters for filtering
   * @returns Promise with all filtered jobs and pagination
   */
  getNewJobs: async (options?: {
    page?: number;
    limit?: number;
    status?: string;
    department_id?: number;
    priority?: string;
    assigned_to_employee_id?: number;
    is_remote?: boolean;
    employment_type?: string;
    search?: string;
  }): Promise<any> => {
    try {
      const response = await apiClient.get('/newjobs', { params: options });
      return response.data;
    } catch (error) {
      console.error('Error fetching new jobs:', error);
      throw error;
    }
  },

  /**
   * Get a specific job by ID (legacy API)
   * @param jobId The ID of the job to fetch
   * @returns Promise with the job data
   */
  getJobById: async (jobId: number): Promise<any> => {
    try {
      const response = await apiClient.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching job ${jobId}:`, error);
      throw error;
    }
  },

  /**
   * Get a specific job by ID from the new jobs API
   * @param jobId The ID of the job to fetch (can be string or number)
   * @returns Promise with the job data including department and assigned employee
   */
  getNewJobById: async (jobId: string | number): Promise<any> => {
    try {
      // Log the request for debugging
      console.log(`Fetching job with ID: ${jobId} from /newjobs/${jobId}`);
      const response = await apiClient.get(`/newjobs/${jobId}`);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching job ${jobId} from new API:`, error?.response?.data || error);
      throw error;
    }
  },
  /**
   * Get departments by branch ID with optional filtering
   * @param branchId The ID of the branch
   * @param options Optional query parameters (page, limit, is_active, search)
   * @returns Promise with the departments data and pagination
   */
  getDepartmentsByBranchId: async (
    branchId: number, 
    options?: { 
      page?: number; 
      limit?: number; 
      is_active?: boolean;
      search?: string;
    }
  ): Promise<DepartmentResponse> => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (options?.page) {
        queryParams.append('page', options.page.toString());
      }
      
      if (options?.limit) {
        queryParams.append('limit', options.limit.toString());
      }
      
      if (options?.is_active !== undefined) {
        queryParams.append('is_active', options.is_active.toString());
      }
      
      if (options?.search) {
        queryParams.append('search', options.search);
      }
      
      // Build URL
      let url = `/departments/branch/${branchId}`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching departments for branch ${branchId}:`, error);
      throw error;
    }
  },

  /**
   * Get employees by branch ID with optional filtering
   * @param branchId The ID of the branch
   * @param options Optional query parameters (page, limit, is_active, department_id, designation_id, employment_status, search)
   * @returns Promise with the employees data, branch info, and pagination
   */
  getEmployeesByBranchId: async (
    branchId: number,
    options?: {
      page?: number;
      limit?: number;
      is_active?: boolean;
      department_id?: number;
      designation_id?: number;
      employment_status?: 'full-time' | 'part-time' | 'contract' | 'intern' | 'terminated';
      search?: string;
    }
  ): Promise<EmployeesByBranchResponse> => {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (options?.page) {
        queryParams.append('page', options.page.toString());
      }
      
      if (options?.limit) {
        queryParams.append('limit', options.limit.toString());
      }
      
      if (options?.is_active !== undefined) {
        queryParams.append('is_active', options.is_active.toString());
      }
      
      if (options?.department_id) {
        queryParams.append('department_id', options.department_id.toString());
      }
      
      if (options?.designation_id) {
        queryParams.append('designation_id', options.designation_id.toString());
      }
      
      if (options?.employment_status) {
        queryParams.append('employment_status', options.employment_status);
      }
      
      if (options?.search) {
        queryParams.append('search', options.search);
      }
      
      // Build URL
      let url = `/employees/branch/${branchId}`;
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching employees for branch ${branchId}:`, error);
      throw error;
    }
  },

  /**
   * Find matching candidates for a job using AI
   * @param userId The ID of the current user (for session)
   * @param requirement The job requirement text to match against
   * @returns Promise with the AI matching results
   */
  findMatchingCandidates: async (userId: string, requirement: string): Promise<{output: string}> => {
    try {
      console.log('Sending request to AI matching API...');
      console.log('Session ID:', userId);
      console.log('Requirement:', requirement.substring(0, 100) + '...');
      
      const response = await fetch('https://n8n.exploring-talent.com/webhook/bf4dd093-bb02-472c-9454-7ab9af97bd1d', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          sessionId: userId,
          chatInput: requirement
        }),
      });

      console.log('Received response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('API response data:', responseData);
      
      if (!responseData || typeof responseData.output === 'undefined') {
        throw new Error('Invalid response format from AI matching service');
      }
      
      return responseData;
    } catch (error) {
      console.error('Error in findMatchingCandidates:', error);
      throw error;
    }
  }
};

export default jobService;
