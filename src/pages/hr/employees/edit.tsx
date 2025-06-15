import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

// Form schema - similar to add page but without password fields for editing
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
  gender: z.enum(['male', 'female', 'other']).optional(),
  dob: z.string().optional(),
  photo: z.string().optional(),

  // Work Information
  branch_id: z.string().optional(),
  department_id: z.string().optional(),
  designation_id: z.string().optional(),
  position: z.string().optional(),
  employment_status: z.enum(['full-time', 'part-time', 'contract', 'intern', 'terminated']).optional(),
  hire_date: z.string().optional(),
  date_of_leaving: z.string().optional(),
  contract_type: z.string().optional(),
  work_shift: z.string().optional(),
  current_location: z.string().optional(),
  reporting_to: z.string().optional(),
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

  // Bank Information
  bank_account_name: z.string().optional(),
  bank_account_no: z.string().optional(),
  bank_name: z.string().optional(),
  bank_branch: z.string().optional(),
  ifsc_code: z.string().optional(),
  basic_salary: z.string().optional(),

  // Social Media
  facebook: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  instagram: z.string().optional(),

  // Documents
  resume: z.string().optional(),
  joining_letter: z.string().optional(),
  other_documents: z.string().optional(),
  notes: z.string().optional(),

  // System Settings
  is_superadmin: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

const EmployeeEditPage = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any | null>(null);
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [managers, setManagers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: '',
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      gender: undefined,
      dob: '',
      photo: '',
      branch_id: '',
      department_id: '',
      designation_id: '',
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

  // Create a ref to hold the fetch function implementation
  const fetchDepartmentsAndDesignationsRef = useRef<(branchId: string) => Promise<void>>(null as any);

  // Initialize the fetch function
  useEffect(() => {
    // Define the actual implementation
    fetchDepartmentsAndDesignationsRef.current = async (branchId: string) => {
      if (!branchId || branchId === '') {
        setDepartments([]);
        setDesignations([]);
        return;
      }

      setIsLoadingDepartments(true);
      try {
        console.log('Fetching departments and designations for branch ID:', branchId);

        // Add a timeout to prevent hanging requests
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        // Race the API call against the timeout
        const response = await Promise.race([
          branchService.getDepartmentsAndDesignationsByBranchId(branchId),
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
        } else if (response && response.data) {
          // Handle case where success flag is missing but data exists
          console.log('Response without success flag:', response);

          const data = response.data;

          // Try to extract departments and designations
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
        } else {
          console.warn('Failed to fetch branch data or unexpected response format:', response);
          setDepartments([]);
          setDesignations([]);
        }
      } catch (error: any) {
        console.error('Error fetching branch data:', error);
        setDepartments([]);
        setDesignations([]);
      } finally {
        setIsLoadingDepartments(false);
      }
    };
  }, []);

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

  // Fetch employee data and form options on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setFormError(null);

      try {
        // Fetch employee data
        const employeeResponse = await employeeService.getEmployeeById(employeeId);

        if (employeeResponse.success && employeeResponse.data) {
          const employee = employeeResponse.data;

          // Set the selected branch ID to fetch departments and designations
          if (employee.branch_id) {
            setSelectedBranchId(employee.branch_id.toString());
          }

          // Populate form with employee data
          form.reset({
            employee_id: employee.employee_id || '',
            first_name: employee.first_name || '',
            last_name: employee.last_name || '',
            email: employee.email || '',
            phone: employee.phone || '',
            gender: employee.gender as any || undefined,
            dob: employee.dob || '',
            photo: employee.photo || '',
            branch_id: employee.branch_id ? employee.branch_id.toString() : '',
            department_id: employee.department_id ? employee.department_id.toString() : '',
            designation_id: employee.designation_id ? employee.designation_id.toString() : '',
            position: employee.position || '',
            employment_status: employee.employment_status as any || 'full-time',
            hire_date: employee.hire_date || '',
            date_of_leaving: employee.date_of_leaving || '',
            contract_type: employee.contract_type || '',
            work_shift: employee.work_shift || '',
            current_location: employee.current_location || '',
            reporting_to: employee.reporting_to ? employee.reporting_to.toString() : '',
            qualification: employee.qualification || '',
            work_experience: employee.work_experience || '',
            emergency_contact: employee.emergency_contact || '',
            emergency_contact_relation: employee.emergency_contact_relation || '',
            marital_status: employee.marital_status || '',
            father_name: employee.father_name || '',
            mother_name: employee.mother_name || '',
            local_address: employee.local_address || '',
            permanent_address: employee.permanent_address || '',
            bank_account_name: employee.bank_account_name || '',
            bank_account_no: employee.bank_account_no || '',
            bank_name: employee.bank_name || '',
            bank_branch: employee.bank_branch || '',
            ifsc_code: employee.ifsc_code || '',
            basic_salary: employee.basic_salary ? employee.basic_salary.toString() : '',
            facebook: employee.facebook || '',
            twitter: employee.twitter || '',
            linkedin: employee.linkedin || '',
            instagram: employee.instagram || '',
            resume: employee.resume || '',
            joining_letter: employee.joining_letter || '',
            other_documents: employee.other_documents || '',
            notes: employee.notes || '',
            is_superadmin: employee.is_superadmin || false,
            is_active: employee.is_active,
          });
        } else {
          setFormError('Failed to load employee data. Please try again.');
        }

        // Fetch branches
        const branchResponse = await branchService.getBranches();
        if (branchResponse.success) {
          setBranches(branchResponse.data);
        } else if (branchResponse.data && Array.isArray(branchResponse.data)) {
          setBranches(branchResponse.data);
        }

        // Fetch departments
        const departmentResponse = await departmentService.getDepartments();
        if (departmentResponse.success) {
          setDepartments(departmentResponse.data);
        } else if (departmentResponse.data && Array.isArray(departmentResponse.data)) {
          setDepartments(departmentResponse.data);
        }

        // Fetch designations
        const designationResponse = await designationService.getDesignations();
        if (designationResponse.success) {
          setDesignations(designationResponse.data);
        } else if (designationResponse.data && Array.isArray(designationResponse.data)) {
          setDesignations(designationResponse.data);
        }

        // Fetch managers (employees who can be managers)
        const managersResponse = await employeeService.getEmployees();
        if (managersResponse.success) {
          setManagers(managersResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setFormError('Failed to load data. Please check your connection and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [employeeId, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setFormError(null);

    try {
      // Get the initial form values to compare with current values
      const initialValues = form.getValues();

      // Create an object to hold only the changed fields
      const changedFields: Record<string, any> = {};

      // Compare each field and only include changed ones
      Object.keys(values).forEach(key => {
        const fieldKey = key as keyof typeof values;
        // Only include fields that have been changed and are not empty
        if (values[fieldKey] !== undefined && values[fieldKey] !== '') {
          changedFields[key] = values[fieldKey];
        }
      });

      // Convert string IDs to numbers where needed
      if (changedFields.branch_id) {
        changedFields.branch_id = parseInt(changedFields.branch_id);
      }

      if (changedFields.department_id) {
        changedFields.department_id = parseInt(changedFields.department_id);
      }

      if (changedFields.designation_id) {
        changedFields.designation_id = parseInt(changedFields.designation_id);
      }

      if (changedFields.reporting_to) {
        changedFields.reporting_to = parseInt(changedFields.reporting_to);
      }

      if (changedFields.basic_salary) {
        changedFields.basic_salary = parseFloat(changedFields.basic_salary);
      }

      // Add updated_by if user is logged in
      if (user?.id) {
        changedFields.updated_by = parseInt(user.id);
      }

      console.log('Updating employee with changed fields:', changedFields);

      // Call API to update employee
      const response = await employeeService.updateEmployee(employeeId, changedFields);

      if (response.success) {
        // Store the updated employee data
        setSuccessData(response.data);

        toast({
          title: "Employee Updated",
          description: "Employee information has been updated successfully.",
        });

        // Don't navigate away immediately so user can see the success message
        // Wait 2 seconds before navigating
        setTimeout(() => {
          navigate('/profiles');
        }, 2000);
      } else {
        // Handle specific error cases based on API response
        if (response.message === 'Employee not found') {
          setFormError('Employee not found. The employee may have been deleted.');
        } else if (response.message === 'Employee with this employee ID or email already exists') {
          setFormError('An employee with this ID or email already exists. Please use different values.');
        } else {
          setFormError(response.message || 'Failed to update employee. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Error updating employee:', error);

      // Handle specific HTTP error codes
      if (error.response) {
        if (error.response.status === 404) {
          setFormError('Employee not found. The employee may have been deleted.');
        } else if (error.response.status === 400) {
          setFormError('Invalid data provided. Please check your inputs and try again.');
        } else {
          setFormError(`Server error: ${error.response.data?.message || 'An unexpected error occurred'}`);
        }
      } else {
        setFormError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/profiles')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
        <PageHeader
          title="Edit Employee"
          description="Update employee information and details"
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Employee Information</CardTitle>
          <CardDescription>
            Update the details of the employee. Fields marked with * are required.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-sm text-muted-foreground">Loading employee data...</p>
            </div>
          ) : formError ? (
            <div className="bg-destructive/10 p-4 rounded-md mb-4">
              <p className="text-destructive font-medium">{formError}</p>
              <p className="text-sm mt-2">Please try the following steps:</p>
              <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                <li>Refresh the page and try again</li>
                <li>Check your internet connection</li>
                <li>Contact support if the problem persists</li>
              </ul>
            </div>
          ) : successData ? (
            <div className="bg-green-50 p-4 rounded-md mb-4 border border-green-200">
              <h3 className="text-green-800 font-medium text-lg mb-2">Employee Updated Successfully</h3>
              <p className="text-green-700 mb-4">The employee information has been updated. You will be redirected to the employee list shortly.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">Employee ID:</p>
                  <p>{successData.employee_id}</p>
                </div>
                <div>
                  <p className="font-medium">Name:</p>
                  <p>{successData.first_name} {successData.last_name || ''}</p>
                </div>
                {successData.Branch && (
                  <div>
                    <p className="font-medium">Branch:</p>
                    <p>{successData.Branch.name}</p>
                  </div>
                )}
                {successData.Department && (
                  <div>
                    <p className="font-medium">Department:</p>
                    <p>{successData.Department.name}</p>
                  </div>
                )}
                {successData.Designation && (
                  <div>
                    <p className="font-medium">Designation:</p>
                    <p>{successData.Designation.name}</p>
                  </div>
                )}
                {successData.position && (
                  <div>
                    <p className="font-medium">Position:</p>
                    <p>{successData.position}</p>
                  </div>
                )}
                {successData.basic_salary && (
                  <div>
                    <p className="font-medium">Basic Salary:</p>
                    <p>{successData.basic_salary}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => navigate('/profiles')}>
                  Go to Employee List
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-6 w-full mb-4">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="work">Employment</TabsTrigger>
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="financial">Financial</TabsTrigger>
                    <TabsTrigger value="social">Social Media</TabsTrigger>
                    <TabsTrigger value="system">Other</TabsTrigger>
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
                              <Input type="email" placeholder="john.doe@example.com" {...field} />
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
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
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
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
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
                              URL to the employee's photo
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Work Information Tab */}
                  <TabsContent value="work" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="branch_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Branch</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedBranchId(value);

                                // Clear department and designation when branch changes
                                form.setValue('department_id', '');
                                form.setValue('designation_id', '');
                              }}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select branch" />
                                </SelectTrigger>
                              </FormControl>                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {branches.map((branch) => (
                                  <SelectItem key={branch.id} value={branch.id.toString()}>
                                    {branch.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isLoadingDepartments || !selectedBranchId}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={
                                    isLoadingDepartments
                                      ? "Loading departments..."
                                      : !selectedBranchId
                                        ? "Select a branch first"
                                        : departments.length === 0
                                          ? "No departments available"
                                          : "Select department"
                                  } />
                                </SelectTrigger>
                              </FormControl>                              <SelectContent>
                                <SelectItem value="none">None</SelectItem>
                                {departments.map((department) => (
                                  <SelectItem key={department.id} value={department.id.toString()}>
                                    {department.name}
                                  </SelectItem>
                                ))}
                                {departments.length === 0 && !isLoadingDepartments && selectedBranchId && (
                                  <SelectItem value="no-departments" disabled>
                                    No departments available for this branch
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
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
                              value={field.value}
                              onValueChange={field.onChange}
                              disabled={isLoadingDepartments || !selectedBranchId}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={
                                    isLoadingDepartments
                                      ? "Loading designations..."
                                      : !selectedBranchId
                                        ? "Select a branch first"
                                        : designations.length === 0
                                          ? "No designations available"
                                          : "Select designation"
                                  } />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {designations.map((designation) => (
                                  <SelectItem key={designation.id} value={designation.id.toString()}>
                                    {designation.name}
                                  </SelectItem>
                                ))}
                                {designations.length === 0 && !isLoadingDepartments && selectedBranchId && (
                                  <SelectItem value="no-designations" disabled>
                                    No designations available for this branch
                                  </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
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
                              <Input placeholder="Senior Developer" {...field} />
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
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="full-time">Full Time</SelectItem>
                                <SelectItem value="part-time">Part Time</SelectItem>
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
                              <Input placeholder="Day Shift (9 AM - 6 PM)" {...field} />
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
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select manager" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="">None</SelectItem>
                                {managers.map((manager) => (
                                  <SelectItem key={manager.id} value={manager.id.toString()}>
                                    {manager.first_name} {manager.last_name || ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="qualification"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Qualification</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Bachelor's in Computer Science, MBA in Marketing"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="work_experience"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Work Experience</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="5 years at XYZ Corp as Senior Developer"
                                className="min-h-[100px]"
                                {...field}
                              />
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
                            <FormDescription>
                              Phone number of emergency contact
                            </FormDescription>
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
                              <Input placeholder="Spouse, Parent, etc." {...field} />
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
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
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

                      <FormField
                        control={form.control}
                        name="local_address"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Local Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="123 Main St, Apt 4B, New York, NY 10001"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permanent_address"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Permanent Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="456 Oak Ave, Chicago, IL 60601"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
                            <FormDescription>
                              Name as it appears on the bank account
                            </FormDescription>
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
                              <Input placeholder="123456789012" {...field} />
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
                              <Input placeholder="ABCD0123456" {...field} />
                            </FormControl>
                            <FormDescription>
                              Bank routing or IFSC code
                            </FormDescription>
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
                              <Input placeholder="50000.00" {...field} />
                            </FormControl>
                            <FormDescription>
                              Annual salary in USD
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* Social & Documents Tab */}
                  <TabsContent value="social" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input placeholder="https://facebook.com/username" {...field} />
                            </FormControl>
                            <FormDescription>
                              Facebook profile URL
                            </FormDescription>
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
                              <Input placeholder="https://twitter.com/username" {...field} />
                            </FormControl>
                            <FormDescription>
                              Twitter profile URL
                            </FormDescription>
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
                              <Input placeholder="https://linkedin.com/in/username" {...field} />
                            </FormControl>
                            <FormDescription>
                              LinkedIn profile URL
                            </FormDescription>
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
                              <Input placeholder="https://instagram.com/username" {...field} />
                            </FormControl>
                            <FormDescription>
                              Instagram profile URL
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="resume"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resume</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/resume.pdf" {...field} />
                            </FormControl>
                            <FormDescription>
                              URL to resume document
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="joining_letter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Joining Letter</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/joining-letter.pdf" {...field} />
                            </FormControl>
                            <FormDescription>
                              URL to joining letter document
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="other_documents"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Other Documents</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="https://example.com/document1.pdf, https://example.com/document2.pdf"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              URLs to other relevant documents (comma-separated)
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  {/* System Settings Tab */}
                  <TabsContent value="system" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                              <FormLabel>Active Status</FormLabel>
                              <FormDescription>
                                If unchecked, the employee will be marked as inactive
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

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
                              <FormLabel>Super Admin</FormLabel>
                              <FormDescription>
                                Grant super admin privileges to this employee
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                          <FormItem className="col-span-2">
                            <FormLabel>Admin Notes</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Internal notes about this employee"
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              These notes are only visible to administrators
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/profiles')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
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

export default EmployeeEditPage;
