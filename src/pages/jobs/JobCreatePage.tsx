import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  FileUp,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { JobStatus, JobPriority, mockJobListings } from '@/types/jobs';
import ProfitCalculator from '@/components/profit/ProfitCalculator';
import JobDescriptionUploader from '@/components/jobs/JobDescriptionUploader';
import jobService, { JobCreateRequest, Department, Employee } from '@/services/jobService';
import { branchService, Branch } from '@/services/branchService';

// Mock users for assignment
const mockUsers = [
  {
    id: 'user-3',
    name: 'Jamie Garcia',
    email: 'scout@talentspark.com',
    role: 'talent-scout',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'user-4',
    name: 'Robin Taylor',
    email: 'member@talentspark.com',
    role: 'team-member',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'user-6',
    name: 'Jordan Lee',
    email: 'jordan@talentspark.com',
    role: 'talent-scout',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'user-7',
    name: 'Taylor Smith',
    email: 'taylor@talentspark.com',
    role: 'team-member',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'user-8',
    name: 'Casey Wilson',
    email: 'casey@talentspark.com',
    role: 'talent-scout',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const JobCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ceo';
  const isHiringManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [locationId, setLocationId] = useState(isAdmin ? '' : '1'); // Default to location ID 1 for hiring managers
  const [status, setStatus] = useState<JobStatus>('draft');
  const [priority, setPriority] = useState<JobPriority>('medium');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [isRemote, setIsRemote] = useState(false);
  const [employmentType, setEmploymentType] = useState('full-time');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [benefits, setBenefits] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assigneeId, setAssigneeId] = useState('unassigned');
  // API data states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Profit optimization fields
  const [clientBudget, setClientBudget] = useState('');
  const [companyProfit, setCompanyProfit] = useState('');
  const [candidateOffer, setCandidateOffer] = useState('');
  const [companyProfitPercentage, setCompanyProfitPercentage] = useState('30'); // Default 30%
  // Fetch employees based on selected location (branch)
  useEffect(() => {
    const fetchEmployeesByBranch = async () => {
      if (!locationId) {
        setEmployees([]);
        return;
      }

      try {
        setIsLoadingEmployees(true);
        const branchId = parseInt(locationId);
        
        if (isNaN(branchId)) return;

        const response = await jobService.getEmployeesByBranchId(branchId, {
          is_active: true,
          // If department is selected, filter by department
          ...(departmentId ? { department_id: parseInt(departmentId) } : {})
        });

        if (response.success && response.data && response.data.employees) {
          setEmployees(response.data.employees);
          
          // Reset assignee if the current assignee is not in the fetched list
          if (assigneeId !== 'unassigned') {
            const assigneeIdNum = parseInt(assigneeId);
            const employeeExists = response.data.employees.some(e => e.id === assigneeIdNum);
            if (!employeeExists) {
              setAssigneeId('unassigned');
            }
          }
        } else {
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        toast({
          title: 'Error',
          description: 'Failed to load employees. Please try again.',
          variant: 'destructive',
        });
        setEmployees([]);
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    fetchEmployeesByBranch();
  }, [locationId, departmentId, assigneeId]);

  // Calculate profit splits when client budget changes
  useEffect(() => {
    if (clientBudget) {
      const budget = parseFloat(clientBudget);
      if (!isNaN(budget)) {
        // Calculate company profit (35% to company by default)
        const profit = Math.round(budget * 0.35);
        setCompanyProfit(profit.toString());

        // Calculate candidate offer
        const offer = budget - profit;
        setCandidateOffer(offer.toString());
      }
    }
  }, [clientBudget]);
  // Update candidate offer when company profit changes
  useEffect(() => {
    if (clientBudget && companyProfit) {
      const budget = parseFloat(clientBudget);
      const profit = parseFloat(companyProfit);

      if (!isNaN(budget) && !isNaN(profit)) {
        const offer = budget - profit;
        setCandidateOffer(offer.toString());
      }
    }
  }, [clientBudget, companyProfit]);
    // Fetch branches when component mounts
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        setIsLoadingBranches(true);
        const response = await branchService.getBranches({ is_active: true });
        
        if (response && response.data) {
          setBranches(Array.isArray(response.data) ? response.data : []);
          
          // If user is not admin and we have branches, set a default
          if (!isAdmin && Array.isArray(response.data) && response.data.length > 0) {
            // Only set if not already set
            if (!locationId && response.data[0].id) {
              setLocationId(response.data[0].id.toString());
            }
          }
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast({
          title: 'Error',
          description: 'Failed to load locations. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingBranches(false);
      }
    };
    
    fetchBranches();
  }, [isAdmin]);
  
  // Load departments when locationId changes
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!locationId) {
        setDepartments([]);
        return;
      }
      
      try {
        setIsLoadingDepartments(true);
        const branchId = parseInt(locationId);
        if (isNaN(branchId)) return;
        
        const response = await jobService.getDepartmentsByBranchId(branchId, {
          is_active: true
        });
        
        if (response.success && response.data) {
          setDepartments(response.data);
          
          // Reset department selection if previously selected department is not available
          if (departmentId) {
            const deptExists = response.data.some(dept => dept.id.toString() === departmentId);
            if (!deptExists) {
              setDepartmentId('');
            }
          }
        } else {
          setDepartments([]);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: 'Error',
          description: 'Failed to load departments. Please try again.',
          variant: 'destructive',
        });
        setDepartments([]);
      } finally {
        setIsLoadingDepartments(false);
      }
    };
    
    fetchDepartments();
  }, [locationId, departmentId]);// Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

    // Validate form
    if (!title || !description || !departmentId || !locationId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate profit optimization fields for admin and hiring manager
    if ((isAdmin || isHiringManager) && (!clientBudget || !companyProfit || !candidateOffer)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all budget fields",
        variant: "destructive",
      });
      return;
    }

    // Validate that company profit + candidate offer equals client budget
    if (isAdmin || isHiringManager) {
      const budget = parseFloat(clientBudget);
      const profit = parseFloat(companyProfit);
      const offer = parseFloat(candidateOffer);

      if (Math.abs((profit + offer) - budget) > 0.01) { // Allow for small rounding errors
        toast({
          title: "Validation Error",
          description: "Company profit + candidate offer must equal client budget",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setIsSubmitting(true);

      // Show loading state
      toast({
        title: "Creating Job...",
        description: "Please wait while we save your job listing",
      });
        // Prepare job data for API using the expected API format
      const jobData: JobCreateRequest = {
        job_title: title,
        job_description: description,
        department_id: parseInt(departmentId), // Now departmentId is already a numeric string
        status: status,
        priority: priority,
        employment_type: employmentType,
        is_remote: isRemote,
        requirements: requirements,
        responsibilities: responsibilities,
        benefits: benefits,
      };

      // Add optional fields if they exist
      if (assigneeId && assigneeId !== 'unassigned') {
        // Now assigneeId is the actual employee ID as a string
        jobData.assigned_to_employee_id = parseInt(assigneeId);
      }

      if (minSalary) jobData.min_salary = parseFloat(minSalary);
      if (maxSalary) jobData.max_salary = parseFloat(maxSalary);
      if (deadline) jobData.application_deadline = deadline;
      
      // Add profit optimization fields if available
      if (clientBudget) jobData.client_budget_hourly = parseFloat(clientBudget);
      if (candidateOffer) jobData.internal_budget_hourly = parseFloat(candidateOffer);
      if (companyProfitPercentage) jobData.company_split_percentage = parseInt(companyProfitPercentage);
      
      // Calculate candidate split percentage as the remaining percentage
      if (companyProfitPercentage) {
        jobData.candidate_split_percentage = 100 - parseInt(companyProfitPercentage);
      }

      // Call API to create job
      const response = await jobService.createJob(jobData);

      // Show success message
      toast({
        title: "Job Created",
        description: response.message || "The job listing has been created successfully",
      });      // Navigate back to jobs list
      navigate('/jobs-management');
    } catch (error: any) {
      console.error('Job creation failed:', error);
      // Show error message
      toast({
        title: "Error Creating Job",
        description: error.response?.data?.message || "Failed to create job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Use departments from API instead of filtering mock data
  const availableDepartments = departments;

  return (
    <div className="space-y-6 animate-fade-in">      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate('/jobs-management')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Job</h1>
            <p className="text-muted-foreground mt-1">
              Create a new job listing for candidates to apply
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Job
            </>
          )}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Upload Job Description</CardTitle>
            <CardDescription>Upload a PDF or Word document to automatically fill the form</CardDescription>
          </CardHeader>
          <CardContent>
            <JobDescriptionUploader
              onParsedData={(data) => {
                if (data.title) setTitle(data.title);
                if (data.description) setDescription(data.description);
                if (data.requirements) setRequirements(data.requirements);
                if (data.responsibilities) setResponsibilities(data.responsibilities);
                if (data.benefits) setBenefits(data.benefits);
                if (data.minSalary) setMinSalary(data.minSalary);
                if (data.maxSalary) setMaxSalary(data.maxSalary);
                if (data.isRemote !== undefined) setIsRemote(data.isRemote);
                if (data.employmentType) setEmploymentType(data.employmentType);
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the basic details for this job listing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Software Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Job Description <span className="text-red-500">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Enter a detailed description of the job..."
                  className="min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">              {isAdmin && (
                <div className="space-y-2">
                  <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                  <Select 
                    value={locationId} 
                    onValueChange={setLocationId} 
                    disabled={isLoadingBranches}
                    required
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder={isLoadingBranches ? "Loading locations..." : "Select a location"} />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingBranches ? (
                        <SelectItem value="loading" disabled>Loading locations...</SelectItem>
                      ) : branches.length > 0 ? (
                        branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name} {branch.code ? `(${branch.code})` : ''}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No locations available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}<div className="space-y-2">
                <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                <Select
                  value={departmentId}
                  onValueChange={setDepartmentId}
                  disabled={!locationId || isLoadingDepartments}
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder={
                      isLoadingDepartments 
                        ? "Loading departments..." 
                        : locationId 
                          ? "Select a department" 
                          : "Select a location first"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingDepartments ? (
                      <SelectItem value="loading" disabled>Loading departments...</SelectItem>
                    ) : availableDepartments.length > 0 ? (
                      availableDepartments.map((department) => (
                        <SelectItem key={department.id} value={department.id.toString()}>
                          {department.name} {department.short_code ? `(${department.short_code})` : ''}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No departments available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as JobStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority} onValueChange={(value) => setPriority(value as JobPriority)}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>              {/* Assignee Selection - Only for Admin and Hiring Manager */}
              {(isAdmin || isHiringManager) && (
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="assignee">Assign To</Label>
                  <Select 
                    value={assigneeId} 
                    onValueChange={setAssigneeId}
                    disabled={isLoadingEmployees || !locationId}
                  >
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder={
                        isLoadingEmployees 
                          ? "Loading employees..." 
                          : !locationId 
                            ? "Select a location first" 
                            : "Select a person to assign"
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {isLoadingEmployees ? (
                        <SelectItem value="loading" disabled>Loading employees...</SelectItem>
                      ) : employees.length > 0 ? (
                        employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            <div className="flex items-center">
                              <span>
                                {employee.first_name} {employee.last_name} 
                                {employee.Designation ? ` (${employee.Designation.name})` : ''}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="none" disabled>No employees available</SelectItem>
                      )}
                    </SelectContent>
                  </Select>

                  {/* Show selected assignee details */}
                  {assigneeId && assigneeId !== 'unassigned' && !isLoadingEmployees && (
                    <div className="mt-4 p-3 border rounded-md bg-muted/30">
                      {(() => {
                        const selectedEmployee = employees.find(e => e.id.toString() === assigneeId);
                        if (!selectedEmployee) return null;
                        
                        return (
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={selectedEmployee.photo || undefined} />
                              <AvatarFallback>
                                {selectedEmployee.first_name.charAt(0)}
                                {selectedEmployee.last_name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">
                                {selectedEmployee.first_name} {selectedEmployee.last_name}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {selectedEmployee.Designation?.name || selectedEmployee.position || 'Employee'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {selectedEmployee.email}
                              </p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Additional information about the job</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minSalary">Minimum Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="minSalary"
                    type="number"
                    placeholder="e.g. 50000"
                    className="pl-8"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxSalary">Maximum Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxSalary"
                    type="number"
                    placeholder="e.g. 80000"
                    className="pl-8"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                <Select value={employmentType} onValueChange={setEmploymentType}>
                  <SelectTrigger id="employmentType">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Checkbox
                  id="isRemote"
                  checked={isRemote}
                  onCheckedChange={(checked) => setIsRemote(checked as boolean)}
                />
                <label
                  htmlFor="isRemote"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is a remote position
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profit Optimization - Only for Admin and Hiring Manager */}
        {(isAdmin || isHiringManager) && (
          <Card>
            <CardHeader>
              <CardTitle>Profit Optimization</CardTitle>
              <CardDescription>Configure budget and profit splits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProfitCalculator
                initialValues={{
                  clientBudget: clientBudget ? parseFloat(clientBudget) : 120,
                  internalBudget: parseFloat(candidateOffer) || 90,
                  candidateSplit: 100 - (parseFloat(companyProfitPercentage) || 20),
                  companySplit: parseFloat(companyProfitPercentage) || 20
                }}
                onCalculate={(values) => {
                  setClientBudget(values.clientBudget.toString());
                  setCompanyProfit(values.clientToCompanyProfit.toString());
                  setCandidateOffer(values.internalBudget.toString());
                  setCompanyProfitPercentage(values.companySplit.toString());
                }}
              />

              <div className="mt-4 pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  <strong>Note:</strong> Only the Company-to-Candidate split percentage ({companyProfitPercentage}%) will be visible to employees.
                  The Client-to-Company split is confidential.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Job Requirements & Responsibilities</CardTitle>
            <CardDescription>Enter details about what the job entails</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <p className="text-sm text-muted-foreground">Enter each requirement on a new line</p>
              <Textarea
                id="requirements"
                placeholder="e.g. Bachelor's degree in Computer Science
5+ years of experience in software development
Strong knowledge of JavaScript and TypeScript"
                className="min-h-[120px]"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <p className="text-sm text-muted-foreground">Enter each responsibility on a new line</p>
              <Textarea
                id="responsibilities"
                placeholder="e.g. Design and implement new features
Collaborate with cross-functional teams
Mentor junior developers"
                className="min-h-[120px]"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <p className="text-sm text-muted-foreground">Enter each benefit on a new line</p>
              <Textarea
                id="benefits"
                placeholder="e.g. Competitive salary
Health insurance
401(k) matching
Flexible work hours"
                className="min-h-[120px]"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Job
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobCreatePage;
