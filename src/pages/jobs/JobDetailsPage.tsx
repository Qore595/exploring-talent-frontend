import React, { useEffect, useState } from 'react';
import apiClient from '@/services/api';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Briefcase,
  CheckCircle2,
  UserPlus,
  Edit,
  Users,
  Mail,
  Mail as MailIcon,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { isAdmin } from '@/utils/adminPermissions';
import {
  JobListing,
  JobCandidate,
  getJobCandidatesByJobId, // Still using this for candidates until API is available
  getStatusColor,
  getPriorityColor,
  getStatusLabel
} from '@/types/jobs';
import jobService from '@/services/jobService';
import { AssignJobDialog } from '@/components/jobs/AssignJobDialog';
import JobAssignmentNotification from '@/components/jobs/JobAssignmentNotification';

const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const isHiringManager = user?.role === 'branch-manager';
  const isMarketingHead = user?.role === 'marketing-head';
  const isMarketingSupervisor = user?.role === 'marketing-supervisor';
  const isScout = user?.role === 'marketing-recruiter';
  const isTeamMember = user?.role === 'marketing-associate';

  // Two-level profit tracking visibility
  // Client-to-company profit should only be visible to CEO, Branch Manager, and Marketing Supervisor
  const canSeeClientBudget = adminUser || isHiringManager || isMarketingSupervisor;
  // Company-to-candidate splits should be visible to all employees

  const [job, setJob] = useState<JobListing | null>(null);
  const [candidates, setCandidates] = useState<JobCandidate[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [candidateNote, setCandidateNote] = useState('');
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = useState(false);
  const [assignedUser, setAssignedUser] = useState<{ id: string; name: string } | null>(null);
  const [isMatchingCandidates, setIsMatchingCandidates] = useState(false);
  const [matchedCandidates, setMatchedCandidates] = useState<Array<{
    id: string;
    name: string;
    matchScore: number;
    resumeUrl: string;
    email?: string;
  }>>([]);
  const [showMatchResults, setShowMatchResults] = useState(false);
  const [sendingEmails, setSendingEmails] = useState<Record<string, boolean>>({});
  const [screenings, setScreenings] = useState<Array<{
    candidateId: string;
    status: 'pending' | 'scheduled' | 'completed';
    emailStatus: 'not_sent' | 'sent' | 'opened';
  }>>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch job data from API
  const fetchJobData = async () => {
    if (!jobId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching job details for ID: ${jobId}`);
      // Pass jobId directly without parsing to ensure correct format
      const response = await jobService.getNewJobById(jobId);
      console.log('Job details response:', response);
      
      if (response && response.success && response.data) {
        // Map API response to JobListing interface
        const apiJob = response.data;
        console.log('Job data from API:', apiJob);
        const formattedJob: JobListing = {
          id: apiJob.job_id.toString(),
          title: apiJob.job_title,
          description: apiJob.job_description,
          department: apiJob.Department?.name || 'Unknown Department',
          departmentId: apiJob.department_id?.toString() || '',
          location: apiJob.is_remote ? 'Remote' : 'On-site',
          locationId: '', // Not provided in API
          status: apiJob.status.toLowerCase() as any, // Cast to JobStatus
          priority: apiJob.priority.toLowerCase() as any, // Cast to JobPriority
          assignedTo: apiJob.assigned_to_employee_id?.toString() || null,
          assignedToName: apiJob.AssignedEmployee ? 
            `${apiJob.AssignedEmployee.first_name} ${apiJob.AssignedEmployee.last_name}` : null,
          applicantsCount: 0, // Not provided in API
          createdAt: apiJob.created_at,
          updatedAt: apiJob.updated_at,
          deadline: apiJob.application_deadline,
          salary: {
            min: apiJob.min_salary || 0,
            max: apiJob.max_salary || 0,
            currency: 'USD'
          },
          // Budget and profit information
          clientBudget: apiJob.client_budget_hourly,
          companyProfit: apiJob.internal_budget_hourly,
          companyProfitPercentage: apiJob.company_split_percentage,
          candidateOffer: apiJob.client_budget_hourly - apiJob.internal_budget_hourly,
          consultancyFeePercentage: apiJob.company_split_percentage,
          finalCandidateRate: apiJob.client_budget_hourly * (apiJob.candidate_split_percentage / 100),
          // Job details
          requirements: apiJob.requirements ? apiJob.requirements.split('\n') : [],
          responsibilities: apiJob.responsibilities ? apiJob.responsibilities.split('\n') : [],
          benefits: apiJob.benefits ? apiJob.benefits.split('\n') : [],
          isRemote: apiJob.is_remote || false,
          employmentType: apiJob.employment_type as any || 'full-time'
        };
        
        setJob(formattedJob);
        
        // For now, still use mock candidates data
        // In a real implementation, you would fetch candidates from an API
        const jobCandidates = getJobCandidatesByJobId(jobId);
        setCandidates(jobCandidates);
      } else {
        throw new Error('Job data not found in API response');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to load job details. Please try again.');
      toast({
        title: "Error Loading Job",
        description: "There was a problem loading the job details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobData();
  }, [jobId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="flex space-x-2">
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary delay-75"></div>
          <div className="w-4 h-4 rounded-full animate-pulse bg-primary delay-150"></div>
        </div>
        <p>Loading job details...</p>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="text-destructive">{error || 'Job not found'}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/jobs')}>
            Back to Jobs
          </Button>
          <Button onClick={fetchJobData}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Calculate application statistics
  const totalCandidates = candidates.length;
  const newCandidates = candidates.filter(c => c.status === 'new').length;
  const screeningCandidates = candidates.filter(c => c.status === 'screening').length;
  const interviewCandidates = candidates.filter(c => c.status === 'interview').length;
  const offerCandidates = candidates.filter(c => c.status === 'offer').length;
  const hiredCandidates = candidates.filter(c => c.status === 'hired').length;
  const rejectedCandidates = candidates.filter(c => c.status === 'rejected').length;

  // Calculate progress percentage
  const progressPercentage = totalCandidates > 0
    ? Math.round((hiredCandidates / totalCandidates) * 100)
    : 0;

  // Handle job assignment
  const handleAssignJob = () => {
    setIsAssignDialogOpen(true);
  };

  // Handle job assignment completion
  const handleAssignmentComplete = (jobId: string, userId: string, userName: string) => {
    // In a real app, this would be an API call
    setJob({
      ...job,
      assignedTo: userId,
      assignedToName: userName,
      updatedAt: new Date().toISOString()
    });

    // Set the assigned user and open the notification dialog
    setAssignedUser({ id: userId, name: userName });
    setIsNotificationDialogOpen(true);
  };

  // Handle notification completion
  const handleNotificationComplete = () => {
    setIsNotificationDialogOpen(false);
    setAssignedUser(null);

    toast({
      title: "Assignment Complete",
      description: "The user has been notified of their assignment",
    });
  };

  // Handle edit job
  const handleEditJob = () => {
    navigate(`/jobs/${jobId}/edit`);
  };

  // Handle candidate status change
  const handleCandidateStatusChange = (candidateId: string, newStatus: JobCandidate['status']) => {
    // In a real app, this would be an API call
    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === candidateId) {
        return {
          ...candidate,
          status: newStatus,
          lastUpdated: new Date().toISOString()
        };
      }
      return candidate;
    });

    setCandidates(updatedCandidates);

    toast({
      title: "Candidate Status Updated",
      description: `Candidate status has been updated to ${newStatus}`,
    });
  };

  // Handle adding a note to a candidate
  const handleAddCandidateNote = (candidateId: string) => {
    if (!candidateNote.trim()) return;

    // In a real app, this would be an API call
    const updatedCandidates = candidates.map(candidate => {
      if (candidate.id === candidateId) {
        return {
          ...candidate,
          notes: candidate.notes + '\n\n' + candidateNote,
          lastUpdated: new Date().toISOString()
        };
      }
      return candidate;
    });

    setCandidates(updatedCandidates);
    setCandidateNote('');

    toast({
      title: "Note Added",
      description: "Your note has been added to the candidate",
    });
  };

  // Function to update a candidate's screening status
  const setScreeningStatus = (candidateId: string, status: 'pending' | 'scheduled' | 'completed') => {
    setScreenings(prev => {
      return prev.map(screen => {
        if (screen.candidateId === candidateId) {
          return { ...screen, status };
        }
        return screen;
      });
    });
  };

  // Handle sending email to a candidate
  const handleSendEmail = async (candidateId: string, candidateEmail: string) => {
    if (!candidateEmail) {
      toast({
        title: "Error",
        description: "No email address available for this candidate.",
        variant: "destructive",
      });
      return false;
    }

    setSendingEmails(prev => ({ ...prev, [candidateId]: true }));

    try {
      // Find the candidate in the matched candidates list
      const candidate = matchedCandidates.find(c => c.id === candidateId);
      if (!candidate) {
        throw new Error('Candidate not found in the current matching results');
      }

      // Extract resume ID from resume URL (format: employee_[resumeId]_timestamp.pdf)
      const resumeIdMatch = candidate.resumeUrl?.match(/employee_(\d+)_/);
      if (!resumeIdMatch || !resumeIdMatch[1]) {
        throw new Error('Could not extract resume ID from candidate data');
      }
      const resumeId = resumeIdMatch[1];

      // Create an interview screening record first
      try {
        const screeningData = {
          callid: "",
          userid: resumeId,
          joinurl: "",
          job_id: parseInt(jobId),
          status: "pending"
        };

        // Make API call to create screening record
        const screeningResponse = await apiClient.post('/employee-interview-screenings', screeningData);

        if (screeningResponse.status !== 200 && screeningResponse.status !== 201) {
          throw new Error(`Failed to create screening record: ${screeningResponse.statusText}`);
        }

        console.log('Interview screening record created successfully');
      } catch (error) {
        console.error('Error creating interview screening record:', error);
        toast({
          title: "Error",
          description: "Failed to create interview screening record. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      const emailData = {
        email: candidateEmail,
        body: `
Dear Candidate,

Thank you for your interest in the position at our company. We were impressed with your qualifications and would like to invite you for an online interview.

Interview Details:
- Interview Platform: Online Meeting
- Meeting Link: https://interview.exploring-talent.com/interview/cand-${resumeId}-${jobId}

Please ensure you have a stable internet connection and a working webcam for the interview. The link will be active at your scheduled time.

If you have any questions or need to reschedule, please don't hesitate to contact us.

We look forward to speaking with you soon.

Best regards,
The Hiring Team`
      };

      // Make API call to send email
      try {
        // For external API that's not in our API client, we still use fetch
        const response = await fetch('https://n8n.exploring-talent.com/webhook/sending/usermail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });
        
        if (!response.ok) {
          throw new Error(`Failed to send email: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Email sent successfully:', result);
        
        // Check if email was accepted
        const emailResponse = Array.isArray(result) ? result[0] : result;
        if (!(emailResponse.accepted && emailResponse.accepted.includes(candidateEmail))) {
          throw new Error('Email was not accepted by the server');
        }
        
        // Update the status of screenings for this candidate
        setScreeningStatus(candidateId, 'scheduled');
        setScreenings((currentScreenings) => {
          // If the candidate doesn't exist in screenings yet, add them
          if (!currentScreenings.some(s => s.candidateId === candidateId)) {
            return [...currentScreenings, { candidateId, status: 'scheduled', emailStatus: 'sent' }];
          }
          
          // Otherwise update the existing record
          return currentScreenings.map(screen => {
            if (screen.candidateId === candidateId) {
              return { ...screen, status: 'scheduled', emailStatus: 'sent' };
            }
            return screen;
          });
        });
        
        toast({
          title: "Success",
          description: `Invitation email sent to ${candidateEmail}`,
        });
        
        return true;
      } catch (error) {
        console.error('Error sending email:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to send invitation email. Please try again.",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      console.error('Error in email sending process:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to complete the process. Please try again.',
        variant: "destructive",
      });
      return false;
    } finally {
      setSendingEmails(prev => ({ ...prev, [candidateId]: false }));
    }
  };

  // Handle job matching with AI
  const handleMatchCandidates = async () => {
    if (!job || !user?.id) return;

    setIsMatchingCandidates(true);

    try {
      // Combine job requirements into a single string
      const requirementText = [
        job.title,
        job.description,
        ...job.requirements,
        ...job.responsibilities
      ].join('\n');

      // Call the AI matching API
      const response = await jobService.findMatchingCandidates(
        user.id.toString(),
        requirementText
      );

      // Parse the AI response to extract candidate information
      const aiOutput = response.output;
      const candidateMatches: Array<{
        id: string;
        name: string;
        matchScore: number;
        resumeUrl: string;
        email?: string;
      }> = [];
      
      // Simple regex to extract candidate information from the AI response
      const candidateSections = aiOutput.split(/\d+\.\s*\*\*([^*]+)\*\*/g);
      
      for (let i = 1; i < candidateSections.length; i += 2) {
        const name = candidateSections[i]?.trim();
        const content = candidateSections[i + 1] || '';
        
        // Extract match score - handle both bold and non-bold formats
        const matchScoreMatch = content.match(/\*\*Match Score:\*\*\s*(\d+)/i) || 
                              content.match(/Match Score:\s*(\d+)/i);
        let matchScore = 0;
        
        if (matchScoreMatch && matchScoreMatch[1]) {
          matchScore = parseInt(matchScoreMatch[1], 10);
          // Ensure score is between 0-100
          matchScore = Math.max(0, Math.min(100, matchScore));
        } else {
          console.warn('No valid match score found in content:', content);
        }
        
        // Extract resume URL and resume ID from file path (format: employee_[resumeId]_timestamp.pdf)
        const resumeUrlMatch = content.match(/\/upload\/employee_(\d+)_(\d+)\.pdf/);
        const resumeUrl = resumeUrlMatch ? `https://n8n.exploring-talent.com/upload/employee_${resumeUrlMatch[1]}_${resumeUrlMatch[2]}.pdf` : '#';
        const resumeId = resumeUrlMatch ? resumeUrlMatch[1] : '0';
        
        // Extract email if available
        const emailMatch = content.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/);
        const email = emailMatch ? emailMatch[0] : '';
        
        if (name) {
          candidateMatches.push({
            id: `cand-${i}`,
            name,
            matchScore,
            resumeUrl,
            email
          });
        }
      }

      setMatchedCandidates(candidateMatches);
      setShowMatchResults(true);

      toast({
        title: "Candidates Matched",
        description: `Found ${candidateMatches.length} matching candidates for this job`,
      });
    } catch (error) {
      console.error('Error finding matching candidates:', error);
      toast({
        title: "Error",
        description: "Failed to find matching candidates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMatchingCandidates(false);
    }
  };

  // Get candidate status badge color
  const getCandidateStatusColor = (status: JobCandidate['status']) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'screening':
        return 'bg-purple-100 text-purple-800';
      case 'interview':
        return 'bg-yellow-100 text-yellow-800';
      case 'offer':
        return 'bg-orange-100 text-orange-800';
      case 'hired':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/jobs">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">{job.title}</h1>
              <Badge variant="outline" className="ml-3 text-sm">
                {job.id}
              </Badge>
            </div>
            <div className="flex items-center text-muted-foreground mt-1 space-x-4">
              {job.clientName && (
                <span className="flex items-center font-medium">
                  <Briefcase className="h-4 w-4 mr-1" />
                  {job.clientName}
                </span>
              )}
              <span className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {job.department}
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {job.location}
              </span>
              <Badge className={getStatusColor(job.status)}>
                {getStatusLabel ? getStatusLabel(job.status) : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
              <Badge className={getPriorityColor(job.priority)}>
                {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Admin can always reassign jobs, others have conditional access */}
          {(adminUser || isHiringManager || isScout || job.assignedTo === user?.id) && (
            <Button variant="outline" onClick={handleAssignJob}>
              <UserPlus className="h-4 w-4 mr-2" />
              {job.assignedTo ? 'Reassign' : 'Assign'}
            </Button>
          )}

          {/* Admin can always edit jobs, others have conditional access */}
          {(adminUser || isHiringManager || job.assignedTo === user?.id) && (
            <Button onClick={handleEditJob}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Job
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">
            Candidates ({totalCandidates})
          </TabsTrigger>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="matching">TalentPulse Matching</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Basic information about this job</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <span>Job ID</span>
                    </div>
                    <span className="font-medium">{job.id}</span>
                  </div>
                  {job.clientName && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-primary" />
                        <span>Client</span>
                      </div>
                      <span className="font-medium">{job.clientName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      <span>Created</span>
                    </div>
                    <span className="font-medium">{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-primary" />
                      <span>Deadline</span>
                    </div>
                    <span className="font-medium">
                      {job.deadline ? new Date(job.deadline).toLocaleDateString() : 'No deadline'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-primary" />
                      <span>Salary Range</span>
                    </div>
                    <span className="font-medium">
                      {job.salary.currency}{job.salary.min.toLocaleString()} - {job.salary.currency}{job.salary.max.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      <span>Employment Type</span>
                    </div>
                    <span className="font-medium capitalize">
                      {job.employmentType.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span>Remote</span>
                    </div>
                    <span className="font-medium">
                      {job.isRemote ? 'Yes' : 'No'}
                    </span>
                  </div>

                  {/* Show company-to-candidate profit percentage for all users */}
                  {job.consultancyFeePercentage && (
                    <div className="flex items-center justify-between pt-2 mt-2 border-t">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <span>Company Fee</span>
                      </div>
                      <span className="font-medium">
                        {job.consultancyFeePercentage}% of hourly rate
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profit Optimization - Admin always has access */}
            {(adminUser || isHiringManager) && job.clientBudget && (
              <Card>
                <CardHeader>
                  <CardTitle>Profit Optimization</CardTitle>
                  <CardDescription>Budget and profit details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <span>Client Budget</span>
                      </div>
                      <span className="font-medium">${job.clientBudget}/hr</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <span>Company Profit (Client-to-Company)</span>
                      </div>
                      <span className="font-medium">
                        ${job.companyProfit}/hr ({Math.round((job.companyProfit / job.clientBudget) * 100)}%)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <span>Candidate Offer</span>
                      </div>
                      <span className="font-medium">${job.candidateOffer}/hr</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <span>Company Profit (Company-to-Candidate)</span>
                      </div>
                      <span className="font-medium">
                        {job.consultancyFeePercentage}% (${job.consultancyFee}/hr)
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 mt-2 border-t">
                      <div className="flex items-center font-medium">
                        <DollarSign className="h-4 w-4 mr-2 text-primary" />
                        <span>Final Candidate Pay</span>
                      </div>
                      <span className="font-medium">${job.finalCandidateRate}/hr</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> Only the Company-to-Candidate split percentage ({job.consultancyFeePercentage}%)
                      is visible to employees. The Client-to-Company split is confidential.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Assignment</CardTitle>
                <CardDescription>Who is handling this job</CardDescription>
              </CardHeader>
              <CardContent>
                {job.assignedTo ? (
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10">
                        {job.assignedToName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{job.assignedToName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.role === 'marketing-recruiter' ? 'Talent Scout' : 'Team Member'}
                      </p>
                      {/* Admin can always reassign jobs */}
                      {(adminUser || isHiringManager || isScout || job.assignedTo === user?.id) && (
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={handleAssignJob}
                        >
                          Reassign
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <h3 className="font-medium mb-1">Not Assigned</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This job is not assigned to anyone yet
                    </p>
                    <Button onClick={handleAssignJob}>
                      Assign Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Stats</CardTitle>
                <CardDescription>Current application progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-medium">{progressPercentage}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {hiredCandidates} of {totalCandidates} candidates hired
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-muted/50 p-2 rounded-md text-center">
                      <div className="text-lg font-medium">{newCandidates}</div>
                      <div className="text-xs text-muted-foreground">New</div>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-md text-center">
                      <div className="text-lg font-medium">{screeningCandidates}</div>
                      <div className="text-xs text-muted-foreground">Screening</div>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-md text-center">
                      <div className="text-lg font-medium">{interviewCandidates}</div>
                      <div className="text-xs text-muted-foreground">Interview</div>
                    </div>
                    <div className="bg-muted/50 p-2 rounded-md text-center">
                      <div className="text-lg font-medium">{offerCandidates}</div>
                      <div className="text-xs text-muted-foreground">Offer</div>
                    </div>
                    <div className="bg-green-100 p-2 rounded-md text-center">
                      <div className="text-lg font-medium text-green-800">{hiredCandidates}</div>
                      <div className="text-xs text-green-800/80">Hired</div>
                    </div>
                    <div className="bg-red-100 p-2 rounded-md text-center">
                      <div className="text-lg font-medium text-red-800">{rejectedCandidates}</div>
                      <div className="text-xs text-red-800/80">Rejected</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Candidates</CardTitle>
              <CardDescription>
                {totalCandidates} candidates for this position
              </CardDescription>
            </CardHeader>
            <CardContent>
              {candidates.length > 0 ? (
                <div className="space-y-6">
                  {candidates.map((candidate) => (
                    <div key={candidate.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center mb-2 md:mb-0">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{candidate.name}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="h-3.5 w-3.5 mr-1" />
                              <span>{candidate.email}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCandidateStatusColor(candidate.status)}>
                            {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Applied: {new Date(candidate.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center">
                              <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{candidate.phone}</span>
                            </div>
                            <div className="flex items-center">
                              <FileText className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <a
                                href={candidate.resumeUrl}
                                className="text-primary hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Resume
                              </a>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Status Actions</h4>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => handleCandidateStatusChange(candidate.id, 'screening')}
                              disabled={candidate.status === 'screening'}
                            >
                              <AlertCircle className="h-3.5 w-3.5 mr-1" />
                              Screening
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => handleCandidateStatusChange(candidate.id, 'interview')}
                              disabled={candidate.status === 'interview'}
                            >
                              <Users className="h-3.5 w-3.5 mr-1" />
                              Interview
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8"
                              onClick={() => handleCandidateStatusChange(candidate.id, 'offer')}
                              disabled={candidate.status === 'offer'}
                            >
                              <FileText className="h-3.5 w-3.5 mr-1" />
                              Offer
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-green-100 text-green-800 hover:bg-green-200 hover:text-green-900"
                              onClick={() => handleCandidateStatusChange(candidate.id, 'hired')}
                              disabled={candidate.status === 'hired'}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />
                              Hire
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 bg-red-100 text-red-800 hover:bg-red-200 hover:text-red-900"
                              onClick={() => handleCandidateStatusChange(candidate.id, 'rejected')}
                              disabled={candidate.status === 'rejected'}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-medium mb-2 flex items-center">
                          <MessageSquare className="h-3.5 w-3.5 mr-1" />
                          Notes
                        </h4>
                        <p className="text-sm mb-3 whitespace-pre-line">
                          {candidate.notes || 'No notes yet.'}
                        </p>

                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Add a note about this candidate..."
                            className="text-sm"
                            value={candidateNote}
                            onChange={(e) => setCandidateNote(e.target.value)}
                          />
                          <Button
                            className="shrink-0"
                            onClick={() => handleAddCandidateNote(candidate.id)}
                            disabled={!candidateNote.trim()}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Candidates Yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    There are no candidates for this position yet. Check back later or promote this job listing.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
              <CardDescription>Detailed information about this position</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Overview</h3>
                  <p>{job.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Responsibilities</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index}>{resp}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Benefits</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {job.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t">
                  <div>
                    <span className="text-sm text-muted-foreground">
                      Posted on {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 md:mt-0">
                    <Badge className={getStatusColor(job.status)}>
                      {getStatusLabel(job.status)}
                    </Badge>
                    <span className="mx-2">•</span>
                    <Badge className={getPriorityColor(job.priority)}>
                      {job.priority.charAt(0).toUpperCase() + job.priority.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matching" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>TalentPulse Matching</CardTitle>
              <CardDescription>
                Find matching candidates using our AI-powered matching system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showMatchResults ? (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Find Matching Candidates</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Our AI-powered TalentPulse system will analyze the job requirements and find the best matching candidates from our database.
                  </p>
                  <Button
                    onClick={handleMatchCandidates}
                    disabled={isMatchingCandidates}
                    className="min-w-[200px]"
                  >
                    {isMatchingCandidates ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Matching...
                      </>
                    ) : (
                      <>Find Matching Candidates</>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Matching Results</h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowMatchResults(false)}
                      size="sm"
                    >
                      Run New Match
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {matchedCandidates.map((candidate) => (
                      <div key={candidate.id} className="border rounded-lg p-4 transition-all hover:border-primary/50 hover:bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{candidate.name}</h4>
                              <p className="text-sm text-muted-foreground">Candidate ID: {candidate.id}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-4 text-right">
                              <div className="text-sm font-medium">Match Score</div>
                              <div className={`text-lg font-bold ${
                                candidate.matchScore >= 90 ? 'text-green-600' :
                                candidate.matchScore >= 80 ? 'text-green-500' :
                                candidate.matchScore >= 70 ? 'text-yellow-600' :
                                candidate.matchScore >= 60 ? 'text-yellow-500' :
                                'text-muted-foreground'
                              }`}>
                                {candidate.matchScore}%
                              </div>
                            </div>
                            <Button size="sm">
                              View Profile
                            </Button>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="text-sm font-medium mb-1">Match Strength</div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                candidate.matchScore >= 90 ? 'bg-green-600' :
                                candidate.matchScore >= 80 ? 'bg-green-500' :
                                candidate.matchScore >= 70 ? 'bg-yellow-600' :
                                candidate.matchScore >= 60 ? 'bg-yellow-500' :
                                'bg-muted-foreground'
                              }`}
                              style={{ width: `${candidate.matchScore}%` }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-end mt-4 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(candidate.resumeUrl, '_blank')}
                            disabled={!candidate.resumeUrl || candidate.resumeUrl === '#'}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View Resume
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => candidate.email && handleSendEmail(candidate.id, candidate.email)}
                            disabled={!candidate.email || sendingEmails[candidate.id]}
                          >
                            {sendingEmails[candidate.id] ? (
                              <>
                                <span className="animate-spin mr-1">⟳</span>
                                Sending...
                              </>
                            ) : (
                              <>
                                <MailIcon className="h-4 w-4 mr-1" />
                                Send Email
                              </>
                            )}
                          </Button>
                          <Button size="sm">
                            <UserPlus className="h-4 w-4 mr-1" />
                            Add to Candidates
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-primary" />
                      How TalentPulse Matching Works
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      TalentPulse uses advanced Retrieval-Augmented Generation (RAG) technology to match job requirements with candidate resumes.
                      The system analyzes skills, experience, education, and other factors to provide a comprehensive match score.
                      Candidates with higher scores are more likely to be a good fit for the position.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Job Dialog */}
      {job && (
        <AssignJobDialog
          isOpen={isAssignDialogOpen}
          onClose={() => setIsAssignDialogOpen(false)}
          job={job}
          onAssign={handleAssignmentComplete}
        />
      )}

      {/* Notification Dialog */}
      {isNotificationDialogOpen && assignedUser && job && (
        <JobAssignmentNotification
          job={job}
          assignedUserId={assignedUser.id}
          assignedUserName={assignedUser.name}
          onComplete={handleNotificationComplete}
        />
      )}
    </div>
  );
};

export default JobDetailsPage;
