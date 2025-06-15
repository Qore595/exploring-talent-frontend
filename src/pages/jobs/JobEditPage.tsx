import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Upload,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { JobStatus, JobPriority } from '@/types/jobs';
import jobService, { JobCreateRequest, Department, Employee } from '@/services/jobService';
import { branchService, Branch } from '@/services/branchService';
import ProfitCalculator from '@/components/profit/ProfitCalculator';
import JobDescriptionUploader from '@/components/jobs/JobDescriptionUploader';

// Mock users for assignment - same as in JobCreatePage
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

const JobEditPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ceo';
  const isHiringManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [locationId, setLocationId] = useState('');
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
  
  // Profit optimization fields
  const [clientBudget, setClientBudget] = useState('');
  const [companyProfit, setCompanyProfit] = useState('');
  const [candidateOffer, setCandidateOffer] = useState('');
  const [companyProfitPercentage, setCompanyProfitPercentage] = useState('30');
  
  // API data states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);

  // Fetch job data when component mounts
  useEffect(() => {
    if (!jobId) {
      navigate('/jobs');
      return;
    }
    
    const fetchJobData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log(`Fetching job with ID: ${jobId} for editing`);
        const response = await jobService.getNewJobById(jobId);
        
        if (response.success && response.data) {
          const jobData = response.data;
          console.log('Job data loaded for editing:', jobData);
          
          // Populate form fields with job data
          setTitle(jobData.job_title);
          setDescription(jobData.job_description);
          setDepartmentId(jobData.department_id.toString());
          setStatus(jobData.status.toLowerCase() as JobStatus);
          setPriority(jobData.priority.toLowerCase() as JobPriority);
          setMinSalary(jobData.min_salary?.toString() || '');
          setMaxSalary(jobData.max_salary?.toString() || '');
          setIsRemote(jobData.is_remote || false);
          setEmploymentType(jobData.employment_type || 'full-time');
          setRequirements(jobData.requirements || '');
          setResponsibilities(jobData.responsibilities || '');
          setBenefits(jobData.benefits || '');
          setDeadline(jobData.application_deadline || '');
          setAssigneeId(jobData.assigned_to_employee_id?.toString() || 'unassigned');
          
          // Set profit optimization fields
          setClientBudget(jobData.client_budget_hourly?.toString() || '');
          setCompanyProfit(jobData.internal_budget_hourly?.toString() || '');
          setCompanyProfitPercentage(jobData.company_split_percentage?.toString() || '30');
          setCandidateOffer(
            (jobData.client_budget_hourly - jobData.internal_budget_hourly)?.toString() || ''
          );
          
          // Fetch related data
          fetchBranches();
          fetchDepartments(jobData.department_id);
        } else {
          setError('Failed to load job data');
          toast({
            title: 'Error',
            description: 'Failed to load job data for editing',
            variant: 'destructive',
          });
        }
      } catch (err) {
        console.error('Error fetching job for edit:', err);
        setError('Failed to load job data');
        toast({
          title: 'Error',
          description: 'Failed to load job data for editing',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobData();
  }, [jobId, navigate]);

  // Fetch branches
  const fetchBranches = async () => {
    try {
      setIsLoadingBranches(true);
      const response = await branchService.getBranches();
      
      if (response.success && response.data && response.data.branches) {
        setBranches(response.data.branches);
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    } finally {
      setIsLoadingBranches(false);
    }
  };

  // Fetch departments based on branch
  const fetchDepartments = async (departmentId: number) => {
    try {
      setIsLoadingDepartments(true);
      
      // We need the branch ID for this department
      const response = await jobService.getDepartmentsByBranchId(1); // Default to branch 1 for now
      
      if (response.success && response.data) {
        setDepartments(response.data);
        
        // Set the departmentId from the job
        setDepartmentId(departmentId.toString());
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setIsLoadingDepartments(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) return;

    if (!title || !description || !departmentId) {
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
        title: "Updating Job...",
        description: "Please wait while we update your job listing",
      });
      
      // Prepare job data for API
      const jobData: JobCreateRequest = {
        job_title: title,
        job_description: description,
        department_id: parseInt(departmentId),
        status: status,
        priority: priority,
        assigned_to_employee_id: assigneeId !== 'unassigned' ? parseInt(assigneeId) : undefined,
        min_salary: minSalary ? parseFloat(minSalary) : undefined,
        max_salary: maxSalary ? parseFloat(maxSalary) : undefined,
        employment_type: employmentType,
        application_deadline: deadline || undefined,
        is_remote: isRemote,
        // Budget fields
        client_budget_hourly: clientBudget ? parseFloat(clientBudget) : undefined,
        internal_budget_hourly: companyProfit ? parseFloat(companyProfit) : undefined,
        candidate_split_percentage: 100 - parseFloat(companyProfitPercentage || '30'),
        company_split_percentage: parseFloat(companyProfitPercentage || '30'),
        requirements: requirements,
        responsibilities: responsibilities,
        benefits: benefits
      };
      
      // Call the API to update the job
      const response = await jobService.updateJob(jobId!, jobData);
      
      if (response.success) {
        toast({
          title: "Success!",
          description: "Job updated successfully",
        });
        navigate(`/jobs/${jobId}`);
      } else {
        throw new Error(response.message || 'Failed to update job');
      }
    } catch (error: any) {
      console.error('Error updating job:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use departments from API instead of filtering mock data
  const availableDepartments = departments;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="flex space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary delay-75"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary delay-150"></div>
        </div>
        <p>Loading job data...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-destructive">{error}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" onClick={() => navigate(`/jobs/${jobId}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold">Edit Job</h1>
            <p className="text-muted-foreground mt-1">
              Update job listing information
            </p>
          </div>
        </div>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
              Updating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
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
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Enter the job title, department, and description</CardDescription>
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
              
              <div className="space-y-2">
                <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                <Select
                  value={departmentId}
                  onValueChange={setDepartmentId}
                  disabled={isLoadingDepartments}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value) => setStatus(value as JobStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
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
              </div>
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
          </CardContent>
        </Card>
        
        {/* Employment Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
            <CardDescription>Specify employment type and deadline</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="freelance">Freelance</SelectItem>
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
            </div>
            
            <div className="space-y-2 mb-4">
              <h3 className="font-medium">Salary Range (USD)</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minSalary">Minimum Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="minSalary"
                    type="number"
                    className="pl-8"
                    placeholder="e.g. 70000"
                    value={minSalary}
                    onChange={(e) => setMinSalary(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxSalary">Maximum Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="maxSalary"
                    type="number"
                    className="pl-8"
                    placeholder="e.g. 90000"
                    value={maxSalary}
                    onChange={(e) => setMaxSalary(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profit Optimization Section (For Admin and Hiring Manager only) */}
        {(isAdmin || isHiringManager) && (
          <Card>
            <CardHeader>
              <CardTitle>Profit Optimization</CardTitle>
              <CardDescription>Set budget and profit calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientBudget">Client Budget (per hour)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="clientBudget"
                      type="number"
                      className="pl-8"
                      placeholder="e.g. 75"
                      value={clientBudget}
                      onChange={(e) => {
                        setClientBudget(e.target.value);
                        // Recalculate candidate offer
                        if (e.target.value && companyProfit) {
                          setCandidateOffer((parseFloat(e.target.value) - parseFloat(companyProfit)).toString());
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyProfit">Company Profit (per hour)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="companyProfit"
                      type="number"
                      className="pl-8"
                      placeholder="e.g. 15"
                      value={companyProfit}
                      onChange={(e) => {
                        setCompanyProfit(e.target.value);
                        // Recalculate candidate offer
                        if (clientBudget && e.target.value) {
                          setCandidateOffer((parseFloat(clientBudget) - parseFloat(e.target.value)).toString());
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="candidateOffer">Candidate Offer (per hour)</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="candidateOffer"
                      type="number"
                      className="pl-8"
                      placeholder="e.g. 60"
                      value={candidateOffer}
                      onChange={(e) => {
                        setCandidateOffer(e.target.value);
                        // Recalculate company profit
                        if (clientBudget && e.target.value) {
                          setCompanyProfit((parseFloat(clientBudget) - parseFloat(e.target.value)).toString());
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="companyProfitPercentage">Company Profit Percentage (%)</Label>
                <Input
                  id="companyProfitPercentage"
                  type="number"
                  placeholder="e.g. 30"
                  value={companyProfitPercentage}
                  onChange={(e) => setCompanyProfitPercentage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  This is the percentage of candidate's rate that the company keeps as profit.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Assignee Selection */}
        {isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Assign to Team Member</CardTitle>
              <CardDescription>Select a team member to handle this job</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={assigneeId} onValueChange={setAssigneeId}>
                    <SelectTrigger id="assignee">
                      <SelectValue placeholder="Select an assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {mockUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {assigneeId !== 'unassigned' && (
                  <div className="bg-muted p-4 rounded-md">
                    {mockUsers.filter(u => u.id === assigneeId).map(user => (
                      <div key={user.id} className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Job Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Add requirements, responsibilities, and benefits for the position</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="e.g. Bachelor's degree in Computer Science
Minimum 3 years of experience in web development
Proficiency in React, TypeScript, and Node.js"
                className="min-h-[120px]"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter each requirement on a new line. These will be displayed as bullet points.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="responsibilities">Responsibilities</Label>
              <Textarea
                id="responsibilities"
                placeholder="e.g. Design and implement front-end applications
Collaborate with cross-functional teams
Participate in code reviews and agile ceremonies"
                className="min-h-[120px]"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter each responsibility on a new line. These will be displayed as bullet points.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                placeholder="e.g. Competitive salary and bonuses
Flexible work hours and remote options
Health insurance and 401(k) matching"
                className="min-h-[120px]"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter each benefit on a new line. These will be displayed as bullet points.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent rounded-full" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobEditPage;
