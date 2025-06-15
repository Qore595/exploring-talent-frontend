import { useState, useRef } from 'react';
import { Search, FileUp, Check, AlertCircle, FileText, Building, Clock, Briefcase, Plus, Users, DollarSign, Percent, Info, Upload, File } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { CandidateCard, Candidate } from '@/components/ui/candidate-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Mock data for job descriptions
const savedJobDescriptions = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    department: 'Engineering',
    location: 'Remote',
    postedDate: '2025-04-15',
    applicants: 24,
    status: 'active',
    client: 'TechCorp Inc.',
    clientBudget: 120, // Client budget in dollars per hour
    internalBudget: 85, // What employees see (internal budget) in dollars per hour
    candidateSplit: 80, // Percentage of internal budget that goes to candidate (80%)
    companySplit: 20, // Percentage of internal budget that goes to company (20%)
    budget: '$120/hr', // For backward compatibility
    description: 'We are looking for a Senior Software Engineer with experience in React, Node.js, and AWS to join our team. The ideal candidate will have 5+ years of experience in full-stack development.',
  },
  {
    id: '2',
    title: 'Data Scientist',
    department: 'Data & Analytics',
    location: 'New York, NY',
    postedDate: '2025-04-10',
    applicants: 18,
    status: 'active',
    client: 'FinTech Solutions',
    clientBudget: 130, // Client budget in dollars per hour
    internalBudget: 90, // What employees see (internal budget) in dollars per hour
    candidateSplit: 75, // Percentage of internal budget that goes to candidate (75%)
    companySplit: 25, // Percentage of internal budget that goes to company (25%)
    budget: '$130/hr', // For backward compatibility
    description: 'Seeking a skilled Data Scientist with expertise in machine learning, Python, and statistical analysis. The candidate should have experience with large datasets and data visualization.',
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    postedDate: '2025-04-05',
    applicants: 15,
    status: 'closed',
    client: 'Creative Agency',
    clientBudget: 95, // Client budget in dollars per hour
    internalBudget: 70, // What employees see (internal budget) in dollars per hour
    candidateSplit: 85, // Percentage of internal budget that goes to candidate (85%)
    companySplit: 15, // Percentage of internal budget that goes to company (15%)
    budget: '$95/hr', // For backward compatibility
    description: 'We are looking for a UX/UI Designer with a strong portfolio showcasing user-centered design solutions. Experience with Figma, Adobe Creative Suite, and user testing required.',
  },
];

// Mock candidates (matching results for testing)
const matchedCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jordan Lee',
    position: 'Senior Recruitment Specialist',
    skills: ['Talent Acquisition', 'Candidate Sourcing', 'ATS Management'],
    status: 'screening',
    matchScore: 92,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Taylor Smith',
    position: 'Account Executive',
    skills: ['Sales', 'Client Relationship', 'Negotiation'],
    status: 'screening',
    matchScore: 87,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Morgan Chen',
    position: 'Frontend Developer',
    skills: ['React', 'CSS', 'UI/UX'],
    status: 'screening',
    matchScore: 85,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Alex Wong',
    position: 'Backend Developer',
    skills: ['Node.js', 'MongoDB', 'Express'],
    status: 'screening',
    matchScore: 81,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

/**
 * JobDescriptionPage - Manages job description creation and candidate matching
 * Admin users have full access to create, edit, and view all job descriptions
 * across the organization, including client budgets and profit configurations
 */
const JobDescriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.role === 'ceo';
  const isHiringManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const isScout = user?.role === 'marketing-recruiter';
  const isTeamMember = user?.role === 'marketing-associate';
  const canSeeClientBudget = isAdmin || isHiringManager; // Only CEO and managers can see client budget

  const [activeTab, setActiveTab] = useState('create');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');
  const [client, setClient] = useState('');
  const [clientBudget, setClientBudget] = useState('');
  const [internalBudget, setInternalBudget] = useState('');
  const [candidateSplit, setCandidateSplit] = useState('80'); // Default 80%
  const [companySplit, setCompanySplit] = useState('20'); // Default 20%
  const [showProfitDetails, setShowProfitDetails] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showMatches, setShowMatches] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredJobs = savedJobDescriptions.filter(job => {
    if (statusFilter !== 'all' && job.status !== statusFilter) return false;
    if (searchTerm && !job.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleCreateJob = () => {
    if (!jobTitle.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a job title",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a job description",
        variant: "destructive",
      });
      return;
    }

    // Budget validation only for admin and hiring manager
    if (canSeeClientBudget) {
      if (!clientBudget.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter the client budget",
          variant: "destructive",
        });
        return;
      }

      if (!internalBudget.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter the internal budget",
          variant: "destructive",
        });
        return;
      }

      // Validate that client budget is greater than or equal to internal budget
      if (parseFloat(clientBudget) < parseFloat(internalBudget)) {
        toast({
          title: "Invalid Budget",
          description: "Client budget must be greater than or equal to internal budget",
          variant: "destructive",
        });
        return;
      }
    } else {
      // For scouts and team members, only validate internal budget if provided
      if (internalBudget.trim() && !candidateSplit.trim()) {
        toast({
          title: "Missing Information",
          description: "Please enter the candidate split percentage",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate that candidate split + company split = 100%
    if (parseInt(candidateSplit) + parseInt(companySplit) !== 100) {
      toast({
        title: "Invalid Profit Split",
        description: "Candidate split and company split must add up to 100%",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    // Calculate profit margins for reporting
    let companyProfit = 0;

    if (internalBudget) {
      // Calculate company profit based on internal budget and company split
      companyProfit = (parseFloat(internalBudget) * parseInt(companySplit)) / 100;

      // Log profit information (in a real app, this would be saved to the database)
      if (canSeeClientBudget) {
        const clientToCompanyProfit = parseFloat(clientBudget) - parseFloat(internalBudget);
        const totalProfit = clientToCompanyProfit + companyProfit;

        console.log('Profit Configuration (Admin/Manager):', {
          clientBudget: parseFloat(clientBudget),
          internalBudget: parseFloat(internalBudget),
          clientToCompanyProfit,
          candidateSplit: parseInt(candidateSplit),
          companySplit: parseInt(companySplit),
          companyToCandidate: companyProfit,
          totalProfit
        });
      } else {
        console.log('Profit Configuration (Scout/Team Member):', {
          internalBudget: parseFloat(internalBudget),
          candidateSplit: parseInt(candidateSplit),
          companySplit: parseInt(companySplit),
          companyProfit
        });
      }
    }

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);
        setShowMatches(true);
        toast({
          title: "Job Description Created",
          description: "Job description has been created with profit configuration and candidates matched successfully",
        });
      }
    }, 200);
  };

  const handleViewJob = (id: string) => {
    setSelectedJobId(id);
    setActiveTab('view');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} selected. Click "Parse Job Description" to extract content.`,
      });
    }
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    // Simulate file parsing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);

        // Simulate extracted content
        setJobTitle("Senior Marketing Specialist");
        setLocation("Remote / New York");
        setClient("Global Marketing Inc.");
        setJobDescription("We are seeking a Senior Marketing Specialist with experience in digital marketing campaigns, content strategy, and analytics. The ideal candidate will have 5+ years of experience in marketing with a focus on B2B strategies.");
        setResponsibilities("- Develop and execute marketing campaigns\n- Analyze campaign performance and provide insights\n- Collaborate with cross-functional teams\n- Manage social media presence and content calendar");
        setRequirements("- Bachelor's degree in Marketing or related field\n- 5+ years of experience in marketing\n- Proficiency in marketing analytics tools\n- Strong communication and project management skills");
        setBenefits("- Competitive salary and benefits package\n- Remote work options\n- Professional development opportunities\n- Collaborative and innovative work environment");

        toast({
          title: "File Parsed Successfully",
          description: "Job description content has been extracted from the file",
        });
      }
    }, 100);
  };

  const handleFindMatches = () => {
    setUploading(true);

    // Simulate matching process
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploading(false);

        // Navigate to a new page for matching results
        navigate('/job-matching-results', {
          state: {
            jobTitle,
            jobDescription,
            matchedCandidates
          }
        });

        toast({
          title: "Candidates Matched",
          description: `Found ${matchedCandidates.length} matching candidates for this job description`,
        });
      }
    }, 150);
  };

  const handleViewCandidate = (id: string) => {
    toast({
      title: "View Candidate",
      description: `Viewing candidate profile for ID: ${id}`,
    });
  };

  const handleNextStep = (id: string) => {
    toast({
      title: "Candidate Action",
      description: `Sending screening link to candidate ID: ${id}`,
    });
  };

  const selectedJob = selectedJobId
    ? savedJobDescriptions.find(job => job.id === selectedJobId)
    : null;

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="border-b pb-4 mb-2">
        <h1 className="text-3xl font-bold">Job Descriptions</h1>
        <p className="text-muted-foreground mt-1">
          Create, manage, and match candidates to job descriptions
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="bg-muted/50 p-1 rounded-lg">
          <TabsList className="bg-transparent">
            <TabsTrigger value="create" className="data-[state=active]:bg-white">
              <Plus className="h-4 w-4 mr-2" />
              Create Job
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-white">
              <FileText className="h-4 w-4 mr-2" />
              Saved Jobs
            </TabsTrigger>
            {selectedJobId && (
              <TabsTrigger value="view" className="data-[state=active]:bg-white">
                <FileText className="h-4 w-4 mr-2" />
                View Job
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        <TabsContent value="create" className="space-y-6">
          {!showMatches ? (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <CardTitle>Create Job Description</CardTitle>
                </div>
                <CardDescription>Enter details about the position to find matching candidates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-5">
                <div className="space-y-5">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <Briefcase className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Basic Information</h3>
                    </div>

                    {/* File Upload Section */}
                    <div className="border-2 border-dashed border-muted rounded-lg p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <Upload className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-medium">Upload Job Description</h4>
                          <p className="text-sm text-muted-foreground">
                            Upload a PDF or DOC file to automatically extract job details
                          </p>
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept=".pdf,.doc,.docx"
                          />
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs"
                              size="sm"
                            >
                              <File className="h-4 w-4 mr-1" />
                              Select File
                            </Button>
                            {selectedFile && (
                              <Button
                                variant="default"
                                onClick={handleFileUpload}
                                className="text-xs"
                                disabled={uploading}
                                size="sm"
                              >
                                <FileUp className="h-4 w-4 mr-1" />
                                Parse Job Description
                              </Button>
                            )}
                          </div>
                          {selectedFile && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2 bg-background p-2 rounded-md border">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>Selected: {selectedFile.name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title *</Label>
                        <Input
                          id="jobTitle"
                          placeholder="e.g. Senior Software Engineer"
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g. Remote, New York, NY"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="client">Client</Label>
                        <Input
                          id="client"
                          placeholder="e.g. TechCorp Inc."
                          value={client}
                          onChange={(e) => setClient(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Profit Configuration - Only visible to CEO, Branch Manager, Marketing Head */}
                    {canSeeClientBudget && (
                      <div className="border p-4 rounded-md bg-muted/30">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-sm font-medium">Profit Configuration</h4>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-sm">
                                <p>Configure internal budget and profit splits between candidate and company.</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="clientBudget">Client Budget ($/hr)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="clientBudget"
                                type="number"
                                placeholder="e.g. 100"
                                value={clientBudget}
                                onChange={(e) => setClientBudget(e.target.value)}
                                className="pl-8"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">Amount charged to client</p>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="internalBudget">Internal Budget ($/hr)</Label>
                            <div className="relative">
                              <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                id="internalBudget"
                                type="number"
                                placeholder="e.g. 70"
                                value={internalBudget}
                                onChange={(e) => setInternalBudget(e.target.value)}
                                className="pl-8"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground">Visible to employees</p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Label className="mb-2 block">Internal Budget Split</Label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="candidateSplit" className="text-xs">Candidate (%)</Label>
                              <div className="relative">
                                <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="candidateSplit"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={candidateSplit}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setCandidateSplit(e.target.value);
                                    if (!isNaN(value) && value >= 0 && value <= 100) {
                                      setCompanySplit((100 - value).toString());
                                    }
                                  }}
                                  className="pl-8"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="companySplit" className="text-xs">Company (%)</Label>
                              <div className="relative">
                                <Percent className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="companySplit"
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={companySplit}
                                  onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setCompanySplit(e.target.value);
                                    if (!isNaN(value) && value >= 0 && value <= 100) {
                                      setCandidateSplit((100 - value).toString());
                                    }
                                  }}
                                  className="pl-8"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                      {/* Profit Calculator - Only for higher roles */}
                      {canSeeClientBudget && (
                        <div className="mt-4 border-2 border-muted rounded-md overflow-hidden">
                          <div className="bg-muted/30 p-3 border-b border-muted">
                            <div className="flex justify-between items-center">
                              <h3 className="font-medium">Profit Calculator</h3>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowProfitDetails(!showProfitDetails)}
                                className="h-6 px-2 text-xs"
                              >
                                {showProfitDetails ? 'Hide Details' : 'Show Details'}
                              </Button>
                            </div>
                          </div>

                          <div className="p-4 space-y-4">
                            {/* Client-to-Company Profit */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Client-to-Company Profit</h4>
                              <div className="grid grid-cols-3 gap-2 items-center">
                                <div className="col-span-1 text-sm text-muted-foreground">Client Budget:</div>
                                <div className="col-span-2 font-medium">
                                  ${clientBudget ? parseFloat(clientBudget).toFixed(2) : '0.00'}/hr
                                </div>

                                <div className="col-span-1 text-sm text-muted-foreground">Internal Budget:</div>
                                <div className="col-span-2 font-medium">
                                  ${internalBudget ? parseFloat(internalBudget).toFixed(2) : '0.00'}/hr
                                </div>

                                <div className="col-span-1 text-sm text-muted-foreground">Client-to-Company Profit:</div>
                                <div className="col-span-2 font-medium text-green-600">
                                  ${clientBudget && internalBudget ?
                                    (parseFloat(clientBudget) - parseFloat(internalBudget)).toFixed(2) :
                                    '0.00'}/hr
                                </div>
                              </div>
                            </div>

                            {/* Company-to-Candidate Profit */}
                            <div className="space-y-3">
                              <h4 className="text-sm font-medium">Company-to-Candidate Profit</h4>
                              <div className="grid grid-cols-3 gap-2 items-center">
                                <div className="col-span-1 text-sm text-muted-foreground">Internal Budget:</div>
                                <div className="col-span-2 font-medium">
                                  ${internalBudget ? parseFloat(internalBudget).toFixed(2) : '0.00'}/hr
                                </div>

                                <div className="col-span-1 text-sm text-muted-foreground">Company Share:</div>
                                <div className="col-span-2 font-medium">
                                  {companySplit}%
                                </div>

                                <div className="col-span-1 text-sm text-muted-foreground">Company-to-Candidate Profit:</div>
                                <div className="col-span-2 font-medium text-green-600">
                                  ${internalBudget ?
                                    ((parseFloat(internalBudget) * parseInt(companySplit)) / 100).toFixed(2) :
                                    '0.00'}/hr
                                </div>
                              </div>
                            </div>

                            {/* Total Profit Summary */}
                            <div className="bg-muted p-3 rounded-md space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Total Profit:</span>
                                <span className="font-medium text-green-600">
                                  ${clientBudget && internalBudget ?
                                    ((parseFloat(clientBudget) - parseFloat(internalBudget)) +
                                    ((parseFloat(internalBudget) * parseInt(companySplit)) / 100)).toFixed(2) :
                                    '0.00'}/hr
                                </span>
                              </div>

                              {clientBudget && (
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">Profit Margin:</span>
                                  <span className="font-medium text-green-600">
                                    {(((parseFloat(clientBudget) - parseFloat(internalBudget)) +
                                    ((parseFloat(internalBudget) * parseInt(companySplit)) / 100)) /
                                    parseFloat(clientBudget) * 100).toFixed(2)}%
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Additional Details */}
                            {showProfitDetails && (
                              <div className="space-y-3 border-t pt-3">
                                <h4 className="text-sm font-medium">Additional Details</h4>
                                <div className="grid grid-cols-3 gap-2 items-center">
                                  <div className="col-span-1 text-sm text-muted-foreground">Candidate Share:</div>
                                  <div className="col-span-2 font-medium">
                                    {candidateSplit}%
                                  </div>

                                  <div className="col-span-1 text-sm text-muted-foreground">Candidate Payment:</div>
                                  <div className="col-span-2 font-medium">
                                    ${internalBudget ?
                                      ((parseFloat(internalBudget) * parseInt(candidateSplit)) / 100).toFixed(2) :
                                      '0.00'}/hr
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <FileText className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Job Details</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="jobDescription" className="font-medium">Job Description *</Label>
                        <span className="text-xs text-muted-foreground">{jobDescription.length} characters</span>
                      </div>
                      <Textarea
                        id="jobDescription"
                        placeholder="Enter a general overview of the position..."
                        rows={6}
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="responsibilities" className="font-medium">Key Responsibilities</Label>
                        <span className="text-xs text-muted-foreground">{responsibilities.length} characters</span>
                      </div>
                      <Textarea
                        id="responsibilities"
                        placeholder="Enter job responsibilities..."
                        rows={4}
                        value={responsibilities}
                        onChange={(e) => setResponsibilities(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Requirements and Benefits */}
                  <div className="border-t pt-4 mt-2">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Requirements & Benefits</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="requirements" className="font-medium flex items-center">
                            <Check className="h-4 w-4 mr-1" />
                            Requirements & Qualifications
                          </Label>
                          <span className="text-xs text-muted-foreground">{requirements.length} characters</span>
                        </div>
                        <Textarea
                          id="requirements"
                          placeholder="Enter required skills, experience, education..."
                          rows={5}
                          value={requirements}
                          onChange={(e) => setRequirements(e.target.value)}
                          className="bg-white w-full"
                        />
                      </div>
                      <div className="space-y-3 bg-muted/30 p-4 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="benefits" className="font-medium flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Benefits & Perks
                          </Label>
                          <span className="text-xs text-muted-foreground">{benefits.length} characters</span>
                        </div>
                        <Textarea
                          id="benefits"
                          placeholder="Enter benefits, perks, work environment details..."
                          rows={5}
                          value={benefits}
                          onChange={(e) => setBenefits(e.target.value)}
                          className="bg-white w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2 bg-muted p-4 rounded-lg border animate-pulse">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <FileUp className="h-4 w-4 mr-2 animate-bounce" />
                          Processing job description...
                        </span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  <div className="flex justify-end gap-3 border-t pt-5 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setJobTitle('');
                        setLocation('');
                        setClient('');
                        setClientBudget('');
                        setInternalBudget('');
                        setCandidateSplit('80');
                        setCompanySplit('20');
                        setShowProfitDetails(false);
                        setJobDescription('');
                        setResponsibilities('');
                        setRequirements('');
                        setBenefits('');
                      }}
                      className=""
                    >
                      <File className="mr-2 h-4 w-4" />
                      Clear Form
                    </Button>
                    <Button
                      onClick={handleCreateJob}
                      disabled={uploading}
                      className="transition-all duration-200"
                    >
                      {uploading ? (
                        <div className="flex items-center">
                          <span className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        <>
                          <FileUp className="mr-2 h-4 w-4" />
                          Create & Find Matching Candidates
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Matching Results */
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Matching Results</CardTitle>
                      <CardDescription>
                        Candidates matching the job position: {jobTitle}
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => {
                      setShowMatches(false);
                      setJobTitle('');
                      setJobDescription('');
                    }}>
                      New Job Description
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-recruit-success/30 p-4 rounded-md mb-6 flex items-start">
                    <Check className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Job Description Created</p>
                      <p className="text-sm">
                        Your job description for {jobTitle} has been analyzed using TalentPulse matching
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchedCandidates.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        onView={handleViewCandidate}
                        onAction={handleNextStep}
                        actionLabel="Send Screening"
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Tips for Creating Effective Job Descriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Tips for Effective Job Descriptions</CardTitle>
              <CardDescription>
                Optimize your job descriptions for better candidate matching
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Be specific about skills and experience</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Clearly list required technical skills, years of experience, and necessary qualifications.
                      Example: "5+ years of experience with React.js, Node.js, and AWS" instead of "Experience with web development".
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Use industry-standard job titles</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Use recognized job titles to improve matching accuracy. For example, "Frontend Developer"
                      instead of "Web Specialist" will match more relevant candidates.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Include soft skills and culture fit</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Mention important soft skills like "excellent communication," "problem-solving," or
                      "team collaboration" to help match candidates with the right work style.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Organize with clear sections</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Structure your job description with clear sections for responsibilities, requirements,
                      benefits, and company information to improve readability and matching.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search job titles..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {filteredJobs.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium mb-1">No job descriptions found</h3>
                <p className="text-muted-foreground">
                  Try changing your search or filter criteria
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:border-recruit-primary/50 hover:shadow-sm transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className="font-medium text-lg hover:text-recruit-primary cursor-pointer transition-colors"
                            onClick={() => handleViewJob(job.id)}
                          >
                            {job.title}
                          </h3>
                          <Badge
                            variant={job.status === 'active' ? 'default' : 'secondary'}
                            className={job.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                          >
                            {job.status === 'active' ? 'Active' : 'Closed'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.department}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.client}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{job.applicants} applicants</span>
                          </div>
                        </div>

                        <p className="text-sm line-clamp-2 text-muted-foreground">
                          {job.description}
                        </p>

                        {canSeeClientBudget && (
                          <div className="flex items-center gap-4 text-sm mt-1">
                            <div className="flex items-center text-green-600">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Client: ${job.clientBudget}/hr
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              Internal: ${job.internalBudget}/hr
                            </div>
                            <div className="flex items-center text-green-600 font-medium">
                              <Percent className="h-4 w-4 mr-1" />
                              Profit: ${(job.clientBudget - job.internalBudget).toFixed(2)}/hr
                            </div>
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => handleViewJob(job.id)}
                        className="bg-recruit-primary hover:bg-recruit-primary/90"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {selectedJob && (
          <TabsContent value="view" className="space-y-6">
            <Card className="border-recruit-primary/20">
              <CardHeader className="bg-gradient-to-r from-recruit-primary/5 to-transparent">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-recruit-primary">{selectedJob.title}</CardTitle>
                      <Badge
                        variant={selectedJob.status === 'active' ? 'default' : 'secondary'}
                        className={selectedJob.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}
                      >
                        {selectedJob.status === 'active' ? 'Active' : 'Closed'}
                      </Badge>
                    </div>
                    <CardDescription className="flex flex-wrap gap-2 items-center">
                      <span className="flex items-center">
                        <Building className="h-4 w-4 mr-1" />
                        {selectedJob.department}
                      </span>
                      <span>·</span>
                      <span className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {selectedJob.location}
                      </span>
                      <span>·</span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        Posted {new Date(selectedJob.postedDate).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button onClick={handleFindMatches} size="sm" className="bg-recruit-primary hover:bg-recruit-primary/90">
                      <Users className="h-4 w-4 mr-1" />
                      Find Matches
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted p-4 rounded-lg border border-border/50 hover:border-recruit-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-recruit-primary" />
                      <h4 className="text-sm font-medium">Client</h4>
                    </div>
                    <p className="font-medium">{selectedJob.client}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg border border-border/50 hover:border-recruit-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <DollarSign className="h-4 w-4 text-recruit-primary" />
                      <h4 className="text-sm font-medium">{canSeeClientBudget ? 'Client Budget' : 'Internal Budget'}</h4>
                    </div>
                    <p className="font-medium">${canSeeClientBudget ? selectedJob.clientBudget : selectedJob.internalBudget}/hr</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg border border-border/50 hover:border-recruit-primary/30 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-recruit-primary" />
                      <h4 className="text-sm font-medium">Applicants</h4>
                    </div>
                    <p className="font-medium">{selectedJob.applicants} total applications</p>
                  </div>
                </div>

                {/* Profit Calculator */}
                <div className="mb-6 border-2 border-recruit-primary/20 rounded-md overflow-hidden">
                  <div className="bg-recruit-primary/10 p-3 border-b border-recruit-primary/20">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-recruit-primary">
                        {canSeeClientBudget ? 'Profit Calculator' : 'Profit Split'}
                      </h3>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <Info className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-sm">
                            <p>
                              {canSeeClientBudget
                                ? 'Complete profit breakdown including client-to-company and company-to-candidate calculations.'
                                : 'Internal budget allocation between company and candidate.'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    {canSeeClientBudget ? (
                      <>
                        {/* Client-to-Company Profit */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">Client-to-Company Profit</h4>
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <div className="col-span-1 text-sm text-muted-foreground">Client Budget:</div>
                            <div className="col-span-2 font-medium">
                              ${selectedJob.clientBudget.toFixed(2)}/hr
                            </div>

                            <div className="col-span-1 text-sm text-muted-foreground">Internal Budget:</div>
                            <div className="col-span-2 font-medium">
                              ${selectedJob.internalBudget.toFixed(2)}/hr
                            </div>

                            <div className="col-span-1 text-sm text-muted-foreground">Client-to-Company Profit:</div>
                            <div className="col-span-2 font-medium text-green-600">
                              ${(selectedJob.clientBudget - selectedJob.internalBudget).toFixed(2)}/hr
                            </div>
                          </div>
                        </div>

                        {/* Company-to-Candidate Profit */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium">Company-to-Candidate Profit</h4>
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <div className="col-span-1 text-sm text-muted-foreground">Internal Budget:</div>
                            <div className="col-span-2 font-medium">
                              ${selectedJob.internalBudget.toFixed(2)}/hr
                            </div>

                            <div className="col-span-1 text-sm text-muted-foreground">Company Share:</div>
                            <div className="col-span-2 font-medium">
                              {selectedJob.companySplit}%
                            </div>

                            <div className="col-span-1 text-sm text-muted-foreground">Company-to-Candidate Profit:</div>
                            <div className="col-span-2 font-medium text-green-600">
                              ${((selectedJob.internalBudget * selectedJob.companySplit) / 100).toFixed(2)}/hr
                            </div>
                          </div>
                        </div>

                        {/* Total Profit Summary */}
                        <div className="bg-muted p-3 rounded-md space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Total Profit:</span>
                            <span className="font-medium text-green-600">
                              ${(
                                (selectedJob.clientBudget - selectedJob.internalBudget) +
                                ((selectedJob.internalBudget * selectedJob.companySplit) / 100)
                              ).toFixed(2)}/hr
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="font-medium">Profit Margin:</span>
                            <span className="font-medium text-green-600">
                              {(
                                ((selectedJob.clientBudget - selectedJob.internalBudget) +
                                ((selectedJob.internalBudget * selectedJob.companySplit) / 100)) /
                                selectedJob.clientBudget * 100
                              ).toFixed(2)}%
                            </span>
                          </div>
                        </div>

                        {/* Additional Details */}
                        <div className="space-y-3 border-t pt-3">
                          <h4 className="text-sm font-medium">Additional Details</h4>
                          <div className="grid grid-cols-3 gap-2 items-center">
                            <div className="col-span-1 text-sm text-muted-foreground">Candidate Share:</div>
                            <div className="col-span-2 font-medium">
                              {selectedJob.candidateSplit}%
                            </div>

                            <div className="col-span-1 text-sm text-muted-foreground">Candidate Payment:</div>
                            <div className="col-span-2 font-medium">
                              ${((selectedJob.internalBudget * selectedJob.candidateSplit) / 100).toFixed(2)}/hr
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Limited view for scouts and team members */}
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium">Internal Budget</h4>
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <div className="col-span-1 text-sm text-muted-foreground">Budget:</div>
                              <div className="col-span-2 font-medium">
                                ${selectedJob.internalBudget.toFixed(2)}/hr
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <h4 className="text-sm font-medium">Budget Split</h4>
                            <div className="grid grid-cols-3 gap-2 items-center">
                              <div className="col-span-1 text-sm text-muted-foreground">Candidate Share:</div>
                              <div className="col-span-2 font-medium">
                                {selectedJob.candidateSplit}% (${((selectedJob.internalBudget * selectedJob.candidateSplit) / 100).toFixed(2)}/hr)
                              </div>

                              <div className="col-span-1 text-sm text-muted-foreground">Company Share:</div>
                              <div className="col-span-2 font-medium">
                                {selectedJob.companySplit}% (${((selectedJob.internalBudget * selectedJob.companySplit) / 100).toFixed(2)}/hr)
                              </div>
                            </div>
                          </div>

                          <div className="bg-muted p-3 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Company Profit:</span>
                              <span className="font-medium text-green-600">
                                ${((selectedJob.internalBudget * selectedJob.companySplit) / 100).toFixed(2)}/hr
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <FileText className="h-5 w-5 text-recruit-primary" />
                      <h3 className="text-lg font-medium">Job Description</h3>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground whitespace-pre-line">
                        {selectedJob.description}
                      </p>
                    </div>
                  </div>

                  {uploading && (
                    <div className="space-y-2 bg-muted p-4 rounded-lg border animate-pulse">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-recruit-primary animate-spin" />
                          Searching for matching candidates...
                        </span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  {showMatches && (
                    <div className="space-y-4 bg-white border rounded-lg p-5">
                      <div className="flex justify-between items-center border-b pb-3">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-recruit-primary" />
                          <h3 className="text-lg font-medium">Matching Candidates</h3>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          {matchedCandidates.length} matches found
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {matchedCandidates.map((candidate) => (
                          <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            onView={handleViewCandidate}
                            onAction={handleNextStep}
                            actionLabel="Send Screening"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        </Tabs>
      </div>
    );
  };

export default JobDescriptionPage;
