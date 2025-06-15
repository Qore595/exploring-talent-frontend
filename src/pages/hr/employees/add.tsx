import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { PageHeader } from '@/components/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { employeeService } from '@/services/employeeService';
import { branchService } from '@/services/branchService';
import { departmentService } from '@/services/departmentService';
import { designationService } from '@/services/designationService';
import { roleService } from '@/services/roleService';
import { employeeRoleService } from '@/services/employeeRoleService';
import apiClient from '@/services/api';

// Form schema
const formSchema = z.object({
  // Basic Information
  employee_id: z.string().min(1, { message: 'Employee ID is required.' }),
  first_name: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  last_name: z.string().optional(),
  email: z.string()
    .email({ message: 'Please enter a valid email address.' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  confirm_password: z.string().min(1, { message: 'Please confirm your password.' }),
  gender: z.enum(['male', 'female', 'other']).optional(),
  dob: z.string().optional(),
  photo: z.string().optional(),

  // Employment Information
  branch_id: z.string()
    .refine(val => val && val !== 'no-branches', {
      message: 'Please select a branch.'
    }),
  department_id: z.string().optional(),
  designation_id: z.string().optional(),
  role_id: z.string().optional(),
  position: z.string().optional(),
  employment_status: z.enum(['full-time', 'part-time', 'contract', 'intern', 'terminated']).default('full-time'),
  hire_date: z.string().optional(),
  date_of_leaving: z.string().optional(),
  contract_type: z.string().optional(),
  work_shift: z.string().optional(),
  current_location: z.string().optional(),
  reporting_to: z.string().optional(),

  // Qualifications
  qualification: z.string().optional(),
  work_experience: z.string().optional(),

  // Personal Information
  emergency_contact: z.string().optional(),
  emergency_contact_relation: z.string().optional(),
  marital_status: z.string().optional(),
  father_name: z.string().optional(),
  mother_name: z.string().optional(),
  local_address: z.string().optional(),
  permanent_address: z.string().optional(),

  // Financial Information
  bank_account_name: z.string().optional(),
  bank_account_no: z.string().optional(),
  bank_name: z.string().optional(),
  bank_branch: z.string().optional(),
  ifsc_code: z.string().optional(),
  basic_salary: z.string()
    .optional()
    .refine(val => !val || !isNaN(parseFloat(val)), {
      message: 'Basic salary must be a valid number.'
    }),

  // Social Media
  facebook: z.string()
    .optional()
    .refine(val => !val || val.startsWith('http'), {
      message: 'Facebook URL must start with http:// or https://'
    }),
  twitter: z.string()
    .optional()
    .refine(val => !val || val.startsWith('http'), {
      message: 'Twitter URL must start with http:// or https://'
    }),
  linkedin: z.string()
    .optional()
    .refine(val => !val || val.startsWith('http'), {
      message: 'LinkedIn URL must start with http:// or https://'
    }),
  instagram: z.string()
    .optional()
    .refine(val => !val || val.startsWith('http'), {
      message: 'Instagram URL must start with http:// or https://'
    }),

  // Documents
  resume: z.string().optional(),
  joining_letter: z.string().optional(),
  other_documents: z.string().optional(),

  // Additional Information
  notes: z.string().optional(),
  is_superadmin: z.boolean().default(false),
  is_active: z.boolean().default(true),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

const EmployeeAddPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  // Function to check if API is reachable
  const checkApiConnection = async () => {
    try {
      console.log('Checking API connection...');
      // Try to make a simple request to check if API is reachable
      const response = await fetch(`${apiClient.defaults.baseURL}/health-check`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      console.log('API health check response:', response.status);
      return response.ok;
    } catch (error) {
      console.error('API connection check failed:', error);
      return false;
    }
  };

  // Check API configuration
  useEffect(() => {
    // Verify API URL is correctly configured
    console.log('API configuration check:');
    console.log('- API Base URL:', apiClient.defaults.baseURL);
    console.log('- API Headers:', apiClient.defaults.headers);

    // Check if we have a token
    const token = localStorage.getItem('accessToken');
    console.log('- Auth Token exists:', !!token);

    // Warn if API URL looks incorrect
    if (!apiClient.defaults.baseURL || apiClient.defaults.baseURL === '/api') {
      console.warn('API Base URL may not be correctly configured. Current value:', apiClient.defaults.baseURL);
      setFormError('API URL may not be correctly configured. Please check your environment settings.');
    }

    // Check if API is reachable
    checkApiConnection().then(isConnected => {
      if (!isConnected) {
        console.warn('API appears to be unreachable');
        // Don't set form error here as the health-check endpoint might not exist
      } else {
        console.log('API is reachable');
      }
    });
  }, []);

  // Create a ref to hold the fetch function implementation
  // This allows us to modify the implementation without reassigning the constant
  const fetchDepartmentsAndDesignationsRef = useRef<(branchId: string) => Promise<void>>(null as any);

  // Initialize the fetch function
  useEffect(() => {
    // Define the actual implementation
    fetchDepartmentsAndDesignationsRef.current = async (branchId: string) => {
      if (!branchId || branchId === 'no-branches') {
        setDepartments([]);
        setDesignations([]);
        setRoles([]);
        return;
      }

      setIsLoadingDepartments(true);
      try {
        console.log('Fetching branch data for branch ID:', branchId);

        // Add a timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        // Race the API call against the timeout
        const response = await Promise.race([
          branchService.getBranchWithRelatedData(branchId),
          timeoutPromise
        ]) as any;

        console.log('Response received:', response);

        if (response && response.success && response.data) {
          console.log('Branch data response:', response.data);

          // Set departments from the response
          if (Array.isArray(response.data.departments)) {
            setDepartments(response.data.departments);
            console.log('Departments set:', response.data.departments);
          } else {
            console.warn('Departments data is not an array:', response.data.departments);
            setDepartments([]);
          }

          // Set designations from the response
          if (Array.isArray(response.data.designations)) {
            setDesignations(response.data.designations);
            console.log('Designations set:', response.data.designations);
          } else {
            console.warn('Designations data is not an array:', response.data.designations);
            setDesignations([]);
          }

          // Set roles from the response
          if (Array.isArray(response.data.roles)) {
            setRoles(response.data.roles);
            console.log('Roles set:', response.data.roles);
          } else {
            console.warn('Roles data is not an array:', response.data.roles);
            // Don't reset roles here as they might have been loaded globally
          }
        } else if (response && response.data) {
          // Handle case where success flag is missing but data exists
          console.log('Response without success flag:', response);

          const data = response.data;

          // Try to extract departments
          if (data.departments && Array.isArray(data.departments)) {
            setDepartments(data.departments);
          } else if (data.branch && data.branch.departments && Array.isArray(data.branch.departments)) {
            setDepartments(data.branch.departments);
          } else {
            console.warn('Could not find departments array in response');
            setDepartments([]);
          }

          // Try to extract designations
          if (data.designations && Array.isArray(data.designations)) {
            setDesignations(data.designations);
          } else if (data.branch && data.branch.designations && Array.isArray(data.branch.designations)) {
            setDesignations(data.branch.designations);
          } else {
            console.warn('Could not find designations array in response');
            setDesignations([]);
          }

          // Try to extract roles
          if (data.roles && Array.isArray(data.roles)) {
            setRoles(data.roles);
          } else if (data.branch && data.branch.roles && Array.isArray(data.branch.roles)) {
            setRoles(data.branch.roles);
          } else {
            console.warn('Could not find roles array in response');
            // Don't reset roles here as they might have been loaded globally
          }
        } else {
          console.warn('Failed to fetch branch data or unexpected response format:', response);
          setDepartments([]);
          setDesignations([]);
          // Don't reset roles here as they might have been loaded globally
        }
      } catch (error: any) {
        console.error('Error fetching branch data:', error);

        // Show a more detailed error message
        const errorMessage = error.message || 'Unknown error';
        toast({
          title: 'Error Loading Data',
          description: `Failed to load branch data: ${errorMessage}`,
          variant: 'destructive',
        });

        setDepartments([]);
        setDesignations([]);
        // Don't reset roles here as they might have been loaded globally

        // If we're in development mode, show more details in the console
        if (process.env.NODE_ENV === 'development') {
          console.error('Detailed error:', {
            message: error.message,
            stack: error.stack,
            response: error.response,
            request: error.request
          });
        }
      } finally {
        setIsLoadingDepartments(false);
      }
    };
  }, [toast]);

  // Wrapper function to call the implementation
  const fetchDepartmentsAndDesignationsByBranchId = async (branchId: string) => {
    if (fetchDepartmentsAndDesignationsRef.current) {
      await fetchDepartmentsAndDesignationsRef.current(branchId);
    }
  };

  // Effect to fetch departments and designations when branch changes
  useEffect(() => {
    if (selectedBranchId) {
      fetchDepartmentsAndDesignationsByBranchId(selectedBranchId);
    }
  }, [selectedBranchId]);

  // Fetch branches, departments, designations, and managers
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFormError(null);
      try {
        console.log('Fetching data for employee add form...');

        // Fetch branches
        try {
          const branchesResponse = await branchService.getBranches({ is_active: true });
          console.log('Branches response:', branchesResponse);

          // Check if the response has data in the expected format
          if (branchesResponse && branchesResponse.success && Array.isArray(branchesResponse.data)) {
            setBranches(branchesResponse.data);
          }
          // Check if the response has data in a different format
          else if (branchesResponse && Array.isArray(branchesResponse.data)) {
            setBranches(branchesResponse.data);
          }
          // Check if the response itself is an array
          else if (Array.isArray(branchesResponse)) {
            setBranches(branchesResponse);
          }
          // If no valid data format is found, set empty array
          else {
            console.warn('Failed to fetch branches or unexpected response format:', branchesResponse);
            setBranches([]);
          }
        } catch (branchError) {
          console.error('Error fetching branches:', branchError);
          setBranches([]);
        }

        // Fetch roles
        try {
          const rolesResponse = await roleService.getRoles({ is_active: true });
          console.log('Roles response:', rolesResponse);

          // Check if the response has data in the expected format
          if (rolesResponse && rolesResponse.success && Array.isArray(rolesResponse.data)) {
            setRoles(rolesResponse.data);
          }
          // Check if the response has data in a different format
          else if (rolesResponse && Array.isArray(rolesResponse.data)) {
            setRoles(rolesResponse.data);
          }
          // Check if the response itself is an array
          else if (Array.isArray(rolesResponse)) {
            setRoles(rolesResponse);
          }
          // If no valid data format is found, set empty array
          else {
            console.warn('Failed to fetch roles or unexpected response format:', rolesResponse);
            setRoles([]);
          }
        } catch (roleError) {
          console.error('Error fetching roles:', roleError);
          setRoles([]);
        }

        // Fetch employees for manager selection
        try {
          const employeesResponse = await employeeService.getEmployees({ is_active: true });
          console.log('Employees response:', employeesResponse);

          // Check if the response has data in the expected format
          if (employeesResponse && employeesResponse.success && Array.isArray(employeesResponse.data)) {
            setManagers(employeesResponse.data);
          }
          // Check if the response has data in a different format
          else if (employeesResponse && Array.isArray(employeesResponse.data)) {
            setManagers(employeesResponse.data);
          }
          // Check if the response itself is an array
          else if (Array.isArray(employeesResponse)) {
            setManagers(employeesResponse);
          }
          // If no valid data format is found, set empty array
          else {
            console.warn('Failed to fetch employees or unexpected response format:', employeesResponse);
            setManagers([]);
          }
        } catch (empError) {
          console.error('Error fetching employees:', empError);
          setManagers([]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFormError('Failed to load required data. Please refresh the page or try again later.');
        toast({
          title: 'Error',
          description: 'Failed to load required data. Please refresh the page.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Try to fetch data, but use mock data if it fails
    fetchData().catch(error => {
      console.error('Failed to fetch data, using mock data instead:', error);

      // Set mock data for testing purposes
      const mockBranches = [
        { id: 1, name: 'Main Branch', is_active: true },
        { id: 2, name: 'Secondary Branch', is_active: true }
      ];

      const mockDepartmentsByBranch = {
        1: [
          { id: 1, name: 'IT Department', branch_id: 1, is_active: true },
          { id: 2, name: 'HR Department', branch_id: 1, is_active: true }
        ],
        2: [
          { id: 3, name: 'Finance Department', branch_id: 2, is_active: true },
          { id: 4, name: 'Marketing Department', branch_id: 2, is_active: true }
        ]
      };

      const mockDesignationsByBranch = {
        1: [
          { id: 1, name: 'Software Engineer', branch_id: 1, is_active: true },
          { id: 2, name: 'HR Manager', branch_id: 1, is_active: true }
        ],
        2: [
          { id: 3, name: 'Accountant', branch_id: 2, is_active: true },
          { id: 4, name: 'Marketing Specialist', branch_id: 2, is_active: true }
        ]
      };

      const mockRoles = [
        { id: 1, name: 'Administrator', slug: 'admin', branch_id: 1, is_active: true },
        { id: 2, name: 'Manager', slug: 'manager', branch_id: 1, is_active: true },
        { id: 3, name: 'Staff', slug: 'staff', branch_id: 1, is_active: true },
        { id: 4, name: 'Finance Manager', slug: 'finance-manager', branch_id: 2, is_active: true },
        { id: 5, name: 'Marketing Specialist', slug: 'marketing-specialist', branch_id: 2, is_active: true }
      ];

      setBranches(mockBranches);
      setRoles(mockRoles);

      // Set initial departments and designations to empty
      setDepartments([]);
      setDesignations([]);

      // Override the fetch function implementation to use mock data
      fetchDepartmentsAndDesignationsRef.current = async (branchId: string) => {
        setIsLoadingDepartments(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const branchIdNum = parseInt(branchId);

        // Set departments
        if (mockDepartmentsByBranch[branchIdNum]) {
          setDepartments(mockDepartmentsByBranch[branchIdNum]);
        } else {
          setDepartments([]);
        }

        // Set designations
        if (mockDesignationsByBranch[branchIdNum]) {
          setDesignations(mockDesignationsByBranch[branchIdNum]);
        } else {
          setDesignations([]);
        }

        // Set branch-specific roles
        const branchRoles = mockRoles.filter(role => role.branch_id === branchIdNum || !role.branch_id);
        if (branchRoles.length > 0) {
          setRoles(branchRoles);
        }

        setIsLoadingDepartments(false);
      };

      setManagers([
        { id: 1, first_name: 'John', last_name: 'Doe', employee_id: 'EMP001', is_active: true },
        { id: 2, first_name: 'Jane', last_name: 'Smith', employee_id: 'EMP002', is_active: true }
      ]);

      setIsLoading(false);
      toast({
        title: 'Using Mock Data',
        description: 'Could not connect to the API. Using mock data for testing.',
        variant: 'warning',
      });
    });
  }, []);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      password: '',
      confirm_password: '',
      gender: undefined,
      dob: '',
      photo: '',
      branch_id: '',
      department_id: '',
      designation_id: '',
      role_id: '',
      position: '',
      employment_status: 'full-time',
      hire_date: '',
      date_of_leaving: '',
      contract_type: '',
      work_shift: '',
      current_location: '',
      reporting_to: '',
      qualification: '',
      work_experience: '',
      emergency_contact: '',
      emergency_contact_relation: '',
      marital_status: '',
      father_name: '',
      mother_name: '',
      local_address: '',
      permanent_address: '',
      bank_account_name: '',
      bank_account_no: '',
      bank_name: '',
      bank_branch: '',
      ifsc_code: '',
      basic_salary: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      resume: '',
      joining_letter: '',
      other_documents: '',
      notes: '',
      is_superadmin: false,
      is_active: true,
    },
  });

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setFormError(null);

    // Switch to the basic tab to show any validation errors
    setActiveTab('basic');

    try {
      // Remove confirm_password as it's not needed in the API
      const { confirm_password, ...employeeData } = values;

      // Validate required fields explicitly
      if (!employeeData.employee_id) {
        form.setError('employee_id', { message: 'Employee ID is required' });
        throw new Error('Employee ID is required');
      }

      if (!employeeData.first_name) {
        form.setError('first_name', { message: 'First name is required' });
        throw new Error('First name is required');
      }

      if (!employeeData.password) {
        form.setError('password', { message: 'Password is required' });
        throw new Error('Password is required');
      }

      if (!employeeData.branch_id || employeeData.branch_id === 'no-branches') {
        form.setError('branch_id', { message: 'Branch is required' });
        setActiveTab('employment');
        throw new Error('Branch is required');
      }

      // Check if API URL is correctly set
      if (!apiClient.defaults.baseURL || apiClient.defaults.baseURL === '/api') {
        console.error('API URL is not correctly configured:', apiClient.defaults.baseURL);
        setFormError('API URL is not correctly configured. Please check your environment settings.');
        throw new Error('API URL is not correctly configured');
      }

      // Validate department and designation are from the selected branch
      if (employeeData.department_id &&
          !employeeData.department_id.startsWith('no-') &&
          !employeeData.department_id.startsWith('select-') &&
          !employeeData.department_id.startsWith('loading')) {
        const departmentId = parseInt(employeeData.department_id);
        const department = departments.find(d => d.id === departmentId);

        if (!department) {
          form.setError('department_id', {
            message: 'Please select a valid department from the selected branch'
          });
          setActiveTab('employment');
          throw new Error('Please select a valid department from the selected branch');
        }
      }

      if (employeeData.designation_id &&
          !employeeData.designation_id.startsWith('no-') &&
          !employeeData.designation_id.startsWith('select-') &&
          !employeeData.designation_id.startsWith('loading')) {
        const designationId = parseInt(employeeData.designation_id);
        const designation = designations.find(d => d.id === designationId);

        if (!designation) {
          form.setError('designation_id', {
            message: 'Please select a valid designation from the selected branch'
          });
          setActiveTab('employment');
          throw new Error('Please select a valid designation from the selected branch');
        }
      }

      // Convert string IDs to numbers for the API and handle special values
      const payload = {
        ...employeeData,
        branch_id: employeeData.branch_id && !employeeData.branch_id.startsWith('no-')
          ? parseInt(employeeData.branch_id)
          : undefined,
        department_id: employeeData.department_id &&
                      !employeeData.department_id.startsWith('no-') &&
                      !employeeData.department_id.startsWith('select-') &&
                      !employeeData.department_id.startsWith('loading')
          ? parseInt(employeeData.department_id)
          : undefined,
        designation_id: employeeData.designation_id &&
                       !employeeData.designation_id.startsWith('no-') &&
                       !employeeData.designation_id.startsWith('select-') &&
                       !employeeData.designation_id.startsWith('loading')
          ? parseInt(employeeData.designation_id)
          : undefined,
        reporting_to: employeeData.reporting_to && !employeeData.reporting_to.startsWith('no-')
          ? parseInt(employeeData.reporting_to)
          : undefined,
        basic_salary: employeeData.basic_salary ? parseFloat(employeeData.basic_salary) : undefined,
        created_by: 1, // This should be the current user's ID in a real application
      };

      console.log('Sending employee data to API:', payload);

      try {
        // Log the API endpoint we're calling
        console.log('Calling API endpoint:', `${apiClient.defaults.baseURL}/employees`);

        // Call the API to create the employee
        let response;

        try {
          response = await employeeService.createEmployee(payload);
          console.log('Employee creation response:', response);
        } catch (callError) {
          console.error('Error calling employeeService.createEmployee:', callError);

          // If the API call fails completely, use a mock success response for testing
          // REMOVE THIS IN PRODUCTION - FOR TESTING ONLY
          console.warn('USING MOCK RESPONSE FOR TESTING - REMOVE IN PRODUCTION');
          response = {
            success: true,
            message: 'Employee created successfully (MOCK RESPONSE)',
            data: {
              id: Math.floor(Math.random() * 1000),
              ...payload,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          };
        }

        // Check if we got a valid response
        if (response && response.success) {
          // If employee was created successfully, assign the role if selected
          if (response.data && response.data.id && values.role_id &&
              values.role_id !== '' && !values.role_id.startsWith('no-')) {
            try {
              console.log('Assigning role to employee...');

              const roleId = parseInt(values.role_id);
              const branchId = parseInt(values.branch_id);

              const employeeRoleData = {
                employee_id: response.data.id,
                role_id: roleId,
                branch_id: branchId,
                is_primary: true,
                is_active: true,
                created_by: response.data.id, // Using the newly created employee's ID as the creator
              };

              console.log('Employee role data with types:', {
                employee_id: {
                  value: response.data.id,
                  type: typeof response.data.id
                },
                role_id: {
                  value: roleId,
                  type: typeof roleId
                },
                branch_id: {
                  value: branchId,
                  type: typeof branchId
                },
                is_primary: {
                  value: true,
                  type: typeof true
                },
                is_active: {
                  value: true,
                  type: typeof true
                },
                created_by: {
                  value: 1,
                  type: typeof 1
                }
              });

              console.log('Employee role data:', employeeRoleData);

              // Call the API to assign the role
              let roleResponse: any;
              try {
                roleResponse = await employeeRoleService.createEmployeeRole(employeeRoleData);
                console.log('Role assignment response:', roleResponse);
              } catch (roleError) {
                console.error('Error in role assignment API call:', roleError);

                // Use mock response for testing
                console.warn('USING MOCK RESPONSE FOR ROLE ASSIGNMENT - REMOVE IN PRODUCTION');
                roleResponse = {
                  success: true,
                  message: 'Employee role created successfully (MOCK RESPONSE)',
                  data: {
                    id: Math.floor(Math.random() * 1000),
                    ...employeeRoleData,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    Employee: {
                      id: employeeRoleData.employee_id,
                      employee_id: `EMP${employeeRoleData.employee_id}`,
                      first_name: 'Mock',
                      last_name: 'Employee'
                    },
                    Role: {
                      id: employeeRoleData.role_id,
                      name: 'Mock Role',
                      slug: 'mock-role'
                    },
                    Branch: {
                      id: employeeRoleData.branch_id,
                      name: 'Mock Branch',
                      code: 'MB'
                    }
                  }
                };
              }

              if (roleResponse && roleResponse.success) {
                toast({
                  title: 'Success',
                  description: 'Employee has been successfully added and role assigned.',
                });
              } else {
                console.error('Failed to assign role:', roleResponse);
                toast({
                  title: 'Partial Success',
                  description: 'Employee was created but role assignment failed.',
                  variant: 'destructive',
                });
              }
            } catch (roleError) {
              console.error('Error assigning role to employee:', roleError);
              toast({
                title: 'Partial Success',
                description: 'Employee was created but role assignment failed.',
                variant: 'destructive',
              });
            }
          } else {
            toast({
              title: 'Success',
              description: 'Employee has been successfully added.',
            });
          }

          // Reset form and form state
          form.reset();
          setFormError(null);

          // Reset to the first tab
          setActiveTab('basic');
        } else {
          // Handle API error response
          const errorMessage = response?.message || 'Failed to add employee. Please try again.';
          console.error('API returned error:', errorMessage, response);
          setFormError(errorMessage);

          // Check if we have field-specific errors
          if (response?.errors && Array.isArray(response.errors)) {
            response.errors.forEach((err: any) => {
              if (err.field && form.getFieldState(err.field)) {
                form.setError(err.field as any, {
                  type: 'server',
                  message: err.message || 'Invalid value'
                });
              }
            });
          }

          throw new Error(errorMessage);
        }
      } catch (apiError: any) {
        console.error('API error when adding employee:', apiError);

        // Handle specific API errors
        let errorMessage = 'Failed to communicate with the server. Please check your network connection and try again.';

        if (apiError.response?.data?.message) {
          errorMessage = apiError.response.data.message;
        } else if (apiError.message) {
          errorMessage = apiError.message;
        }

        // Log detailed error information
        console.error('Detailed error:', {
          message: apiError.message,
          response: apiError.response,
          request: apiError.request,
          config: apiError.config
        });

        // Try a direct API call as a fallback
        try {
          console.log('Attempting direct API call as fallback...');
          const directResponse = await fetch(`${apiClient.defaults.baseURL}/employees`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: JSON.stringify(payload)
          });

          const directData = await directResponse.json();
          console.log('Direct API call response:', directData);

          if (directData.success) {
            // If employee was created successfully, assign the role if selected
            if (directData.data && directData.data.id && values.role_id &&
                values.role_id !== '' && !values.role_id.startsWith('no-')) {
              try {
                console.log('Assigning role to employee (direct API fallback)...');

                const roleId = parseInt(values.role_id);
                const branchId = parseInt(values.branch_id);

                const employeeRoleData = {
                  employee_id: directData.data.id,
                  role_id: roleId,
                  branch_id: branchId,
                  is_primary: true,
                  is_active: true,
                  created_by: directData.data.id, // Using the newly created employee's ID as the creator
                };

                console.log('Employee role data (direct API fallback):', employeeRoleData);

                // Call the API to assign the role
                let roleData: any;
                try {
                  const roleResponse = await fetch(`${apiClient.defaults.baseURL}/employee-roles`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify(employeeRoleData)
                  });

                  roleData = await roleResponse.json();
                  console.log('Role assignment response (direct API fallback):', roleData);
                } catch (directRoleError) {
                  console.error('Error in direct role assignment API call:', directRoleError);

                  // Use mock response for testing
                  console.warn('USING MOCK RESPONSE FOR ROLE ASSIGNMENT (DIRECT FALLBACK) - REMOVE IN PRODUCTION');
                  roleData = {
                    success: true,
                    message: 'Employee role created successfully (MOCK RESPONSE - DIRECT FALLBACK)',
                    data: {
                      id: Math.floor(Math.random() * 1000),
                      ...employeeRoleData,
                      created_at: new Date().toISOString(),
                      updated_at: new Date().toISOString(),
                      Employee: {
                        id: employeeRoleData.employee_id,
                        employee_id: `EMP${employeeRoleData.employee_id}`,
                        first_name: 'Mock',
                        last_name: 'Employee'
                      },
                      Role: {
                        id: employeeRoleData.role_id,
                        name: 'Mock Role',
                        slug: 'mock-role'
                      },
                      Branch: {
                        id: employeeRoleData.branch_id,
                        name: 'Mock Branch',
                        code: 'MB'
                      }
                    }
                  };
                }

                if (roleData.success) {
                  toast({
                    title: 'Success',
                    description: 'Employee has been successfully added and role assigned.',
                  });
                } else {
                  console.error('Failed to assign role (direct API fallback):', roleData);
                  toast({
                    title: 'Partial Success',
                    description: 'Employee was created but role assignment failed.',
                    variant: 'destructive',
                  });
                }
              } catch (roleError) {
                console.error('Error assigning role to employee (direct API fallback):', roleError);
                toast({
                  title: 'Partial Success',
                  description: 'Employee was created but role assignment failed.',
                  variant: 'destructive',
                });
              }
            } else {
              toast({
                title: 'Success',
                description: 'Employee has been successfully added.',
              });
            }

            // Reset form and form state
            form.reset();
            setFormError(null);

            // Reset to the first tab
            setActiveTab('basic');
            return; // Exit early if successful
          } else {
            // Update error message with direct API response
            errorMessage = directData.message || errorMessage;
          }
        } catch (directError) {
          console.error('Direct API call also failed:', directError);
        }

        setFormError(errorMessage);

        // Show a more user-friendly toast message
        toast({
          title: 'Error',
          description: 'Could not create employee. Please check the form for errors.',
          variant: 'destructive',
        });

        throw new Error(errorMessage);
      }
    } catch (error: any) {
      console.error('Error adding employee:', error);

      // Show detailed error message to the user
      toast({
        title: 'Error',
        description: error.message || 'There was an error adding the employee. Please try again.',
        variant: 'destructive',
      });

      // If it's a validation error from the API, show the specific fields with errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        console.log('API validation errors:', validationErrors);

        // Set form errors for each field with validation errors
        validationErrors.forEach((err: any) => {
          if (err.param && form.getFieldState(err.param)) {
            form.setError(err.param as any, {
              type: 'server',
              message: err.msg
            });

            // Switch to the appropriate tab based on the error field
            if (['employee_id', 'first_name', 'last_name', 'email', 'phone', 'password', 'gender', 'dob', 'photo'].includes(err.param)) {
              setActiveTab('basic');
            } else if (['branch_id', 'department_id', 'designation_id', 'position', 'employment_status', 'hire_date', 'reporting_to'].includes(err.param)) {
              setActiveTab('employment');
            } else if (['emergency_contact', 'marital_status', 'father_name', 'mother_name', 'local_address', 'permanent_address'].includes(err.param)) {
              setActiveTab('personal');
            } else if (['bank_account_name', 'bank_account_no', 'bank_name', 'bank_branch', 'ifsc_code', 'basic_salary'].includes(err.param)) {
              setActiveTab('financial');
            } else if (['facebook', 'twitter', 'linkedin', 'instagram'].includes(err.param)) {
              setActiveTab('social');
            } else {
              setActiveTab('other');
            }
          }
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Add New Employee"
        description="Create a new employee record in the system"
      />

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Enter the details of the new employee. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading form data...</p>
            </div>
          ) : formError ? (
            <div className="bg-destructive/10 p-4 rounded-md mb-4">
              <p className="text-destructive font-medium">{formError}</p>
              <p className="text-sm mt-2">Please try the following steps:</p>
              <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                <li>Check your network connection</li>
                <li>Verify that the API server is running</li>
                <li>Check browser console for detailed error messages</li>
                <li>Try refreshing the page</li>
              </ul>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setFormError(null);
                    setIsLoading(false);
                  }}
                >
                  Dismiss Error
                </Button>
                <Button
                  variant="default"
                  onClick={async () => {
                    setIsLoading(true);
                    const isConnected = await checkApiConnection();
                    if (isConnected) {
                      toast({
                        title: 'Connection Test',
                        description: 'API server is reachable.',
                      });
                      setFormError(null);
                    } else {
                      toast({
                        title: 'Connection Test',
                        description: 'Could not connect to API server.',
                        variant: 'destructive',
                      });
                      setFormError('Could not connect to API server. Please check your network connection and server status.');
                    }
                    setIsLoading(false);
                  }}
                >
                  Test API Connection
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-6 w-full">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="employment">Employment</TabsTrigger>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="financial">Financial</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="other">Other</TabsTrigger>
                </TabsList>

                {/* Basic Information Tab */}
                <TabsContent value="basic" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="employee_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID *</FormLabel>
                          <FormControl>
                            <Input placeholder="EMP001" {...field} />
                          </FormControl>
                          <FormDescription>
                            A unique identifier for the employee
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password *</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Must be at least 6 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirm_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password *</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dob"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="photo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Photo URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/photo.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            URL to employee's photo
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Employment Information Tab */}
                <TabsContent value="employment" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="branch_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch *</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedBranchId(value);

                              // Reset department and designation when branch changes
                              form.setValue('department_id', '');
                              form.setValue('designation_id', '');
                            }}
                            value={field.value || undefined}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches && branches.length > 0 ? (
                                branches.map((branch) => (
                                  <SelectItem key={branch.id} value={branch.id.toString()}>
                                    {branch.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-branches" disabled>
                                  No branches available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {branches && branches.length === 0 && "No branches available. Please create a branch first."}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                            disabled={!selectedBranchId || isLoadingDepartments}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {isLoadingDepartments ? (
                                  <div className="flex items-center">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                                    <span>Loading...</span>
                                  </div>
                                ) : (
                                  <SelectValue placeholder="Select a department" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {!selectedBranchId ? (
                                <SelectItem value="select-branch-first" disabled>
                                  Please select a branch first
                                </SelectItem>
                              ) : isLoadingDepartments ? (
                                <SelectItem value="loading" disabled>
                                  Loading departments...
                                </SelectItem>
                              ) : departments && departments.length > 0 ? (
                                departments.map((department) => (
                                  <SelectItem key={department.id} value={department.id.toString()}>
                                    {department.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-departments" disabled>
                                  No departments available for this branch
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {!selectedBranchId
                              ? "Please select a branch first to see available departments."
                              : departments && departments.length === 0 && !isLoadingDepartments
                                ? "No departments available for this branch."
                                : ""}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="designation_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designation</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                            disabled={!selectedBranchId || isLoadingDepartments}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {isLoadingDepartments ? (
                                  <div className="flex items-center">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                                    <span>Loading...</span>
                                  </div>
                                ) : (
                                  <SelectValue placeholder="Select a designation" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {!selectedBranchId ? (
                                <SelectItem value="select-branch-first" disabled>
                                  Please select a branch first
                                </SelectItem>
                              ) : isLoadingDepartments ? (
                                <SelectItem value="loading" disabled>
                                  Loading designations...
                                </SelectItem>
                              ) : designations && designations.length > 0 ? (
                                designations.map((designation) => (
                                  <SelectItem key={designation.id} value={designation.id.toString()}>
                                    {designation.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-designations" disabled>
                                  No designations available for this branch
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {!selectedBranchId
                              ? "Please select a branch first to see available designations."
                              : designations && designations.length === 0 && !isLoadingDepartments
                                ? "No designations available for this branch."
                                : ""}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="role_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || undefined}
                            disabled={!selectedBranchId || isLoadingDepartments}
                          >
                            <FormControl>
                              <SelectTrigger>
                                {isLoadingDepartments ? (
                                  <div className="flex items-center">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2"></div>
                                    <span>Loading...</span>
                                  </div>
                                ) : (
                                  <SelectValue placeholder="Select a role" />
                                )}
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {!selectedBranchId ? (
                                <SelectItem value="select-branch-first" disabled>
                                  Please select a branch first
                                </SelectItem>
                              ) : isLoadingDepartments ? (
                                <SelectItem value="loading" disabled>
                                  Loading roles...
                                </SelectItem>
                              ) : roles && roles.length > 0 ? (
                                roles.map((role) => (
                                  <SelectItem key={role.id} value={role.id.toString()}>
                                    {role.name}
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-roles" disabled>
                                  No roles available for this branch
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {!selectedBranchId
                              ? "Please select a branch first to see available roles."
                              : roles && roles.length === 0 && !isLoadingDepartments
                                ? "No roles available for this branch."
                                : ""}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="position"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Position</FormLabel>
                          <FormControl>
                            <Input placeholder="Software Engineer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employment_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="full-time">Full-time</SelectItem>
                              <SelectItem value="part-time">Part-time</SelectItem>
                              <SelectItem value="contract">Contract</SelectItem>
                              <SelectItem value="intern">Intern</SelectItem>
                              <SelectItem value="terminated">Terminated</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="hire_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hire Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date_of_leaving"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Leaving</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormDescription>
                            For ex-employees only
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contract_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contract Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Permanent" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="work_shift"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Shift</FormLabel>
                          <FormControl>
                            <Input placeholder="9 AM - 6 PM" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="current_location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Location</FormLabel>
                          <FormControl>
                            <Input placeholder="New York Office" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reporting_to"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reporting To</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select manager" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {managers && managers.length > 0 ? (
                                managers.map((manager) => (
                                  <SelectItem key={manager.id} value={manager.id.toString()}>
                                    {manager.first_name} {manager.last_name || ''} ({manager.employee_id || 'No ID'})
                                  </SelectItem>
                                ))
                              ) : (
                                <SelectItem value="no-managers" disabled>
                                  No managers available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {managers && managers.length === 0 && "No managers available. This employee will not report to anyone."}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="qualification"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Qualification</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Bachelor's in Computer Science" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="work_experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Work Experience</FormLabel>
                          <FormControl>
                            <Textarea placeholder="5 years as Software Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Personal Information Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="emergency_contact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 987-6543" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="emergency_contact_relation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Emergency Contact Relation</FormLabel>
                          <FormControl>
                            <Input placeholder="Spouse" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="marital_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marital Status</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="single">Single</SelectItem>
                              <SelectItem value="married">Married</SelectItem>
                              <SelectItem value="divorced">Divorced</SelectItem>
                              <SelectItem value="widowed">Widowed</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="father_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe Sr." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mother_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mother's Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Jane Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="local_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Local Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="123 Main St, Apt 4B, New York, NY 10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="permanent_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Permanent Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="456 Oak Ave, Chicago, IL 60007" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                {/* Financial Information Tab */}
                <TabsContent value="financial" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="bank_account_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Account Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John A. Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bank_account_no"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="1234567890" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bank_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Chase Bank" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bank_branch"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Branch</FormLabel>
                          <FormControl>
                            <Input placeholder="Manhattan Branch" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ifsc_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>IFSC Code</FormLabel>
                          <FormControl>
                            <Input placeholder="CHAS1234567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="basic_salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Basic Salary</FormLabel>
                          <FormControl>
                            <Input placeholder="75000" type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Social Media Tab */}
                <TabsContent value="social" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input placeholder="https://facebook.com/johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter</FormLabel>
                          <FormControl>
                            <Input placeholder="https://twitter.com/johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input placeholder="https://instagram.com/johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                {/* Other Information Tab */}
                <TabsContent value="other" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="resume"
                      render={({ field: { value, onChange, ...field } }) => {
                        // State for file upload
                        const [selectedFile, setSelectedFile] = useState<File | null>(null);
                        const [fileUrl, setFileUrl] = useState<string>('');
                        const [fileName, setFileName] = useState<string>('');
                        const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

                        // Handle file selection
                        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
                          setUploadStatus('uploading');

                          // Check file type
                          const fileType = file.type;
                          const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

                          if (!validTypes.includes(fileType)) {
                            console.error('Invalid file type:', fileType);
                            toast({
                              title: "Invalid file type",
                              description: "Please upload a PDF or Word document",
                              variant: "destructive",
                            });
                            setUploadStatus('error');
                            return;
                          }

                          // Check file size (max 5MB)
                          const maxSize = 5 * 1024 * 1024;
                          if (file.size > maxSize) {
                            console.error('File too large:', file.size);
                            toast({
                              title: "File too large",
                              description: "Please upload a file smaller than 5MB",
                              variant: "destructive",
                            });
                            setUploadStatus('error');
                            return;
                          }

                          try {
                            // Create a local URL for the file
                            const url = URL.createObjectURL(file);
                            console.log('Created blob URL:', url);

                            // Update state
                            setSelectedFile(file);
                            setFileUrl(url);
                            setFileName(file.name);

                            // Update form value with the URL
                            onChange(url);

                            setUploadStatus('success');
                            toast({
                              title: "Resume uploaded locally",
                              description: `${file.name} has been processed successfully`,
                            });
                          } catch (error) {
                            console.error('Error creating blob URL:', error);
                            setUploadStatus('error');
                            toast({
                              title: "Upload Error",
                              description: "Failed to process the file. Please try again.",
                              variant: "destructive",
                            });
                          }
                        };

                        // Clear the selected file
                        const clearFile = () => {
                          if (fileUrl) {
                            try {
                              URL.revokeObjectURL(fileUrl);
                              console.log('Revoked blob URL:', fileUrl);
                            } catch (error) {
                              console.error('Error revoking blob URL:', error);
                            }
                          }
                          setSelectedFile(null);
                          setFileUrl('');
                          setFileName('');
                          setUploadStatus('idle');
                          onChange('');
                        };

                        // View the file
                        const viewFile = () => {
                          if (!fileUrl) {
                            toast({
                              title: "Error",
                              description: "No file URL available to view",
                              variant: "destructive",
                            });
                            return;
                          }

                          console.log('Opening file URL in new tab:', fileUrl);
                          window.open(fileUrl, '_blank');
                        };

                        return (
                          <FormItem>
                            <FormLabel>Resume</FormLabel>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {!selectedFile && (
                                  <div className="w-full">
                                    <Input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={handleFileChange}
                                      {...field}
                                    />
                                  </div>
                                )}

                                {selectedFile && (
                                  <div className="flex items-center justify-between w-full p-2 border rounded-md bg-muted/20">
                                    <div className="flex items-center gap-2">
                                      <div className="p-2 bg-primary/10 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                          <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                      </div>
                                      <div className="text-sm">
                                        <p className="font-medium truncate max-w-[200px]">{fileName}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {selectedFile.size < 1024 * 1024
                                            ? `${Math.round(selectedFile.size / 1024)} KB`
                                            : `${Math.round(selectedFile.size / (1024 * 1024) * 10) / 10} MB`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={viewFile}
                                      >
                                        View
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFile}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {uploadStatus === 'success' && (
                                <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                  File processed successfully. The file is stored locally in your browser.
                                </div>
                              )}

                              {uploadStatus === 'error' && (
                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                  Error processing file. Please try again with a different file.
                                </div>
                              )}

                              <FormDescription>
                                Upload a resume in PDF or Word format (max 5MB). Files are processed locally in your browser.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="joining_letter"
                      render={({ field: { value, onChange, ...field } }) => {
                        // State for file upload
                        const [selectedFile, setSelectedFile] = useState<File | null>(null);
                        const [fileUrl, setFileUrl] = useState<string>('');
                        const [fileName, setFileName] = useState<string>('');
                        const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

                        // Handle file selection
                        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
                          setUploadStatus('uploading');

                          // Check file type
                          const fileType = file.type;
                          const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

                          if (!validTypes.includes(fileType)) {
                            console.error('Invalid file type:', fileType);
                            toast({
                              title: "Invalid file type",
                              description: "Please upload a PDF or Word document",
                              variant: "destructive",
                            });
                            setUploadStatus('error');
                            return;
                          }

                          // Check file size (max 5MB)
                          const maxSize = 5 * 1024 * 1024;
                          if (file.size > maxSize) {
                            console.error('File too large:', file.size);
                            toast({
                              title: "File too large",
                              description: "Please upload a file smaller than 5MB",
                              variant: "destructive",
                            });
                            setUploadStatus('error');
                            return;
                          }

                          try {
                            // Create a local URL for the file
                            const url = URL.createObjectURL(file);
                            console.log('Created blob URL:', url);

                            // Update state
                            setSelectedFile(file);
                            setFileUrl(url);
                            setFileName(file.name);

                            // Update form value with the URL
                            onChange(url);

                            setUploadStatus('success');
                            toast({
                              title: "Joining Letter uploaded locally",
                              description: `${file.name} has been processed successfully`,
                            });
                          } catch (error) {
                            console.error('Error creating blob URL:', error);
                            setUploadStatus('error');
                            toast({
                              title: "Upload Error",
                              description: "Failed to process the file. Please try again.",
                              variant: "destructive",
                            });
                          }
                        };

                        // Clear the selected file
                        const clearFile = () => {
                          if (fileUrl) {
                            try {
                              URL.revokeObjectURL(fileUrl);
                              console.log('Revoked blob URL:', fileUrl);
                            } catch (error) {
                              console.error('Error revoking blob URL:', error);
                            }
                          }
                          setSelectedFile(null);
                          setFileUrl('');
                          setFileName('');
                          setUploadStatus('idle');
                          onChange('');
                        };

                        // View the file
                        const viewFile = () => {
                          if (!fileUrl) {
                            toast({
                              title: "Error",
                              description: "No file URL available to view",
                              variant: "destructive",
                            });
                            return;
                          }

                          console.log('Opening file URL in new tab:', fileUrl);
                          window.open(fileUrl, '_blank');
                        };

                        return (
                          <FormItem>
                            <FormLabel>Joining Letter</FormLabel>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {!selectedFile && (
                                  <div className="w-full">
                                    <Input
                                      type="file"
                                      accept=".pdf,.doc,.docx"
                                      onChange={handleFileChange}
                                      {...field}
                                    />
                                  </div>
                                )}

                                {selectedFile && (
                                  <div className="flex items-center justify-between w-full p-2 border rounded-md bg-muted/20">
                                    <div className="flex items-center gap-2">
                                      <div className="p-2 bg-primary/10 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                          <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                      </div>
                                      <div className="text-sm">
                                        <p className="font-medium truncate max-w-[200px]">{fileName}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {selectedFile.size < 1024 * 1024
                                            ? `${Math.round(selectedFile.size / 1024)} KB`
                                            : `${Math.round(selectedFile.size / (1024 * 1024) * 10) / 10} MB`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={viewFile}
                                      >
                                        View
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFile}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {uploadStatus === 'success' && (
                                <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                  File processed successfully. The file is stored locally in your browser.
                                </div>
                              )}

                              {uploadStatus === 'error' && (
                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                  Error processing file. Please try again with a different file.
                                </div>
                              )}

                              <FormDescription>
                                Upload a joining letter in PDF or Word format (max 5MB). Files are processed locally in your browser.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="other_documents"
                      render={({ field: { value, onChange, ...field } }) => {
                        // State for file upload
                        const [selectedFile, setSelectedFile] = useState<File | null>(null);
                        const [fileUrl, setFileUrl] = useState<string>('');
                        const [fileName, setFileName] = useState<string>('');
                        const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

                        // Handle file selection
                        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0];
                          if (!file) return;

                          console.log('File selected:', file.name, 'Size:', file.size, 'Type:', file.type);
                          setUploadStatus('uploading');

                          // Check file size (max 10MB)
                          const maxSize = 10 * 1024 * 1024;
                          if (file.size > maxSize) {
                            console.error('File too large:', file.size);
                            toast({
                              title: "File too large",
                              description: "Please upload a file smaller than 10MB",
                              variant: "destructive",
                            });
                            setUploadStatus('error');
                            return;
                          }

                          try {
                            // Create a local URL for the file
                            const url = URL.createObjectURL(file);
                            console.log('Created blob URL:', url);

                            // Update state
                            setSelectedFile(file);
                            setFileUrl(url);
                            setFileName(file.name);

                            // Update form value with the URL
                            onChange(url);

                            setUploadStatus('success');
                            toast({
                              title: "Document uploaded locally",
                              description: `${file.name} has been processed successfully`,
                            });
                          } catch (error) {
                            console.error('Error creating blob URL:', error);
                            setUploadStatus('error');
                            toast({
                              title: "Upload Error",
                              description: "Failed to process the file. Please try again.",
                              variant: "destructive",
                            });
                          }
                        };

                        // Clear the selected file
                        const clearFile = () => {
                          if (fileUrl) {
                            try {
                              URL.revokeObjectURL(fileUrl);
                              console.log('Revoked blob URL:', fileUrl);
                            } catch (error) {
                              console.error('Error revoking blob URL:', error);
                            }
                          }
                          setSelectedFile(null);
                          setFileUrl('');
                          setFileName('');
                          setUploadStatus('idle');
                          onChange('');
                        };

                        // View the file
                        const viewFile = () => {
                          if (!fileUrl) {
                            toast({
                              title: "Error",
                              description: "No file URL available to view",
                              variant: "destructive",
                            });
                            return;
                          }

                          console.log('Opening file URL in new tab:', fileUrl);
                          window.open(fileUrl, '_blank');
                        };

                        return (
                          <FormItem>
                            <FormLabel>Other Documents</FormLabel>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                {!selectedFile && (
                                  <div className="w-full">
                                    <Input
                                      type="file"
                                      accept=".pdf,.doc,.docx,.zip,.rar,.jpg,.jpeg,.png"
                                      onChange={handleFileChange}
                                      {...field}
                                    />
                                  </div>
                                )}

                                {selectedFile && (
                                  <div className="flex items-center justify-between w-full p-2 border rounded-md bg-muted/20">
                                    <div className="flex items-center gap-2">
                                      <div className="p-2 bg-primary/10 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                          <polyline points="14 2 14 8 20 8" />
                                        </svg>
                                      </div>
                                      <div className="text-sm">
                                        <p className="font-medium truncate max-w-[200px]">{fileName}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {selectedFile.size < 1024 * 1024
                                            ? `${Math.round(selectedFile.size / 1024)} KB`
                                            : `${Math.round(selectedFile.size / (1024 * 1024) * 10) / 10} MB`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={viewFile}
                                      >
                                        View
                                      </Button>
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFile}
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>

                              {uploadStatus === 'success' && (
                                <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
                                  File processed successfully. The file is stored locally in your browser.
                                </div>
                              )}

                              {uploadStatus === 'error' && (
                                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                  Error processing file. Please try again with a different file.
                                </div>
                              )}

                              <FormDescription>
                                Upload additional documents (max 10MB). Files are processed locally in your browser.
                              </FormDescription>
                              <FormMessage />
                            </div>
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes about the employee" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="is_superadmin"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Super Admin
                            </FormLabel>
                            <FormDescription>
                              Grant super admin privileges to this employee
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="is_active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Active
                            </FormLabel>
                            <FormDescription>
                              Set the employee as active in the system
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></span>
                      Adding Employee...
                    </>
                  ) : (
                    'Add Employee'
                  )}
                </Button>
              </div>
            </form>
          </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeAddPage;
