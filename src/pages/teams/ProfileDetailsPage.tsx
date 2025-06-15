import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Award,
  FileText,
  Users,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
  Edit,
  Trash2,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock profiles data
const mockProfiles = [
  {
    id: 'profile-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    role: 'Hiring Manager',
    department: 'Engineering',
    hireDate: '2022-03-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Technical Recruiting', 'Team Leadership', 'Budget Management'],
    bio: 'Experienced hiring manager with a background in software engineering. Specializes in building high-performing engineering teams and optimizing recruitment processes.',
    stats: {
      openRequisitions: 3,
      activeCandidates: 12,
      totalHires: 24
    },
    recentActivity: [
      { type: 'interview', date: '2023-06-01', description: 'Conducted final interview for Senior Developer position' },
      { type: 'hire', date: '2023-05-15', description: 'Hired Junior Developer for Frontend team' },
      { type: 'requisition', date: '2023-05-10', description: 'Created new job requisition for DevOps Engineer' },
      { type: 'feedback', date: '2023-05-05', description: 'Provided feedback on UX Designer candidates' },
    ]
  },
  {
    id: 'profile-2',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '(555) 234-5678',
    role: 'Talent Scout',
    department: 'Recruitment',
    hireDate: '2022-05-20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Technical Screening', 'Candidate Sourcing', 'ATS Management'],
    bio: 'Dedicated talent scout with expertise in identifying and recruiting top technical talent. Strong network in the software development community.',
    stats: {
      openRequisitions: 5,
      activeCandidates: 28,
      totalHires: 32
    },
    recentActivity: [
      { type: 'screening', date: '2023-06-02', description: 'Screened 5 candidates for Data Scientist position' },
      { type: 'sourcing', date: '2023-05-28', description: 'Sourced 15 potential candidates for Senior Engineer role' },
      { type: 'interview', date: '2023-05-20', description: 'Conducted initial interviews for Product Manager' },
      { type: 'feedback', date: '2023-05-15', description: 'Provided feedback on Backend Developer candidates' },
    ]
  },
  {
    id: 'profile-3',
    name: 'Michael Torres',
    email: 'michael.torres@example.com',
    phone: '(555) 345-6789',
    role: 'Team Member',
    department: 'Product',
    hireDate: '2022-08-10',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    skills: ['Product Management', 'User Research', 'Agile Methodologies'],
    bio: 'Product team member with a focus on user-centered design and agile development practices. Experienced in conducting user research and translating insights into product features.',
    stats: {
      openRequisitions: 0,
      activeCandidates: 3,
      totalHires: 5
    },
    recentActivity: [
      { type: 'interview', date: '2023-06-03', description: 'Participated in panel interview for UX Designer' },
      { type: 'feedback', date: '2023-05-25', description: 'Provided feedback on Product Manager candidates' },
      { type: 'interview', date: '2023-05-18', description: 'Conducted technical interview for UI Developer' },
      { type: 'meeting', date: '2023-05-10', description: 'Attended hiring strategy meeting for Q3' },
    ]
  },
];

// Mock candidates assigned to this employee (profile)
// These are job applicants being managed by this employee
const mockAssignedCandidates = [
  {
    id: '1',
    name: 'Jordan Lee',
    position: 'Senior Software Engineer',
    status: 'interview',
    appliedDate: '2023-05-15',
    nextStep: 'Technical Interview',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Taylor Smith',
    position: 'Frontend Developer',
    status: 'screening',
    appliedDate: '2023-05-20',
    nextStep: 'Initial Interview',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '5',
    name: 'Casey Wilson',
    position: 'UX Designer',
    status: 'offer',
    appliedDate: '2023-05-10',
    nextStep: 'Offer Approval',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Status configuration for candidates
const statusConfig = {
  screening: { label: 'Screening', color: 'bg-amber-100 text-amber-800' },
  interview: { label: 'Interview', color: 'bg-blue-100 text-blue-800' },
  offer: { label: 'Offer', color: 'bg-purple-100 text-purple-800' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

// Mock feedback data
const mockFeedback = [
  {
    id: '1',
    candidateName: 'Jordan Lee',
    candidatePosition: 'Senior Software Engineer',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Technical Interview',
    interviewDate: '2023-06-05T14:00:00',
    submittedDate: '2023-06-05T16:30:00',
    status: 'completed',
    rating: 4,
    strengths: [
      'Strong problem-solving skills',
      'Excellent knowledge of React and TypeScript',
      'Good communication skills'
    ],
    weaknesses: [
      'Limited experience with backend technologies',
      'Could improve system design knowledge'
    ],
    notes: 'Overall, Jordan is a strong candidate with excellent frontend skills. Would be a great addition to our team.',
    recommendation: 'hire',
    author: {
      id: 'profile-1',
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  },
  {
    id: '2',
    candidateName: 'Taylor Smith',
    candidatePosition: 'Product Manager',
    candidateAvatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Product Interview',
    interviewDate: '2023-06-08T10:00:00',
    submittedDate: '2023-06-08T12:15:00',
    status: 'completed',
    rating: 3,
    strengths: [
      'Good product vision',
      'Experience with agile methodologies',
      'Strong presentation skills'
    ],
    weaknesses: [
      'Limited technical understanding',
      'Could improve on stakeholder management'
    ],
    notes: 'Taylor has good product management skills but needs more experience with technical products.',
    recommendation: 'consider',
    author: {
      id: 'profile-1',
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
  }
];

// Mock pending interviews
const mockPendingInterviews = [
  {
    id: 'interview-1',
    candidateName: 'Riley Johnson',
    candidatePosition: 'UX Designer',
    candidateAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Design Interview',
    interviewDate: '2023-06-12T13:00:00',
    status: 'completed',
    feedbackStatus: 'pending'
  },
  {
    id: 'interview-2',
    candidateName: 'Casey Wilson',
    candidatePosition: 'Marketing Specialist',
    candidateAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Marketing Interview',
    interviewDate: '2023-06-15T11:00:00',
    status: 'scheduled',
    feedbackStatus: 'pending'
  }
];

const ProfileDetailsPage = () => {
  const { profileId } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showAssignCandidateForm, setShowAssignCandidateForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 3,
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'consider'
  });

  // Mock available candidates for assignment
  const [availableCandidates, setAvailableCandidates] = useState([
    { id: 'candidate-4', name: 'Jamie Rodriguez', position: 'UI/UX Designer', status: 'screening' },
    { id: 'candidate-5', name: 'Alex Morgan', position: 'Frontend Developer', status: 'screening' },
    { id: 'candidate-6', name: 'Riley Johnson', position: 'Product Manager', status: 'screening' }
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState('');

  useEffect(() => {
    // In a real app, fetch profile data from API
    // Handle both ID formats: "1" and "profile-1"
    let searchId = profileId;

    // If the ID is numeric, convert it to the format "profile-{id}"
    if (profileId && !isNaN(Number(profileId))) {
      searchId = `profile-${profileId}`;
    }

    console.log("Searching for profile with ID:", searchId);
    const foundProfile = mockProfiles.find(p => p.id === searchId);

    if (foundProfile) {
      setProfile(foundProfile);
    } else {
      toast({
        title: "Profile Not Found",
        description: `The requested profile with ID ${profileId} could not be found`,
        variant: "destructive",
      });
    }
  }, [profileId]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading profile details...</p>
      </div>
    );
  }

  const handleContactProfile = () => {
    toast({
      title: "Contact Profile",
      description: `Sending message to ${profile.name}`,
    });
  };

  const handleEditProfile = () => {
    toast({
      title: "Edit Profile",
      description: `Opening edit form for ${profile.name}`,
    });
  };

  const handleOpenFeedbackForm = (interview) => {
    setSelectedInterview(interview);
    setFeedbackForm({
      rating: 3,
      strengths: '',
      weaknesses: '',
      notes: '',
      recommendation: 'consider'
    });
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackForm.notes.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide feedback notes",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: `Your feedback for ${selectedInterview.candidateName} has been submitted`,
    });

    setShowFeedbackForm(false);
  };

  const handleEditFeedback = (id) => {
    const feedback = mockFeedback.find(f => f.id === id);

    if (!feedback) return;

    toast({
      title: "Edit Feedback",
      description: `Opening feedback editor for ${feedback.candidateName}`,
    });
  };

  const handleDeleteFeedback = (id) => {
    const feedback = mockFeedback.find(f => f.id === id);

    if (!feedback) return;

    toast({
      title: "Delete Feedback",
      description: `This would delete the feedback for ${feedback.candidateName}`,
      variant: "destructive",
    });
  };

  const filteredFeedback = mockFeedback.filter(feedback => {
    // Filter by search term
    if (searchTerm && !feedback.candidateName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Filter by status
    if (statusFilter !== 'all' && feedback.status !== statusFilter) {
      return false;
    }

    return true;
  });

  const handleViewCandidate = (id) => {
    // Navigate to candidate details page
    // Extract numeric ID if it starts with "candidate-"
    const candidateId = id.startsWith('candidate-') ? id.replace('candidate-', '') : id;
    window.location.href = `/candidates/${candidateId}`;
  };

  const handleCandidateAction = (id) => {
    const candidate = mockAssignedCandidates.find(c => c.id === id);

    if (!candidate) return;

    const actionText = candidate.status === 'screening' ? 'Schedule Interview' :
                       candidate.status === 'interview' ? 'Send Offer' :
                       candidate.status === 'offer' ? 'Mark as Hired' : 'Next Step';

    toast({
      title: actionText,
      description: `Moving ${candidate.name} to the next step`,
    });
  };

  const handleAssignCandidate = () => {
    if (!selectedCandidate) {
      toast({
        title: "Error",
        description: "Please select a candidate to assign",
        variant: "destructive",
      });
      return;
    }

    const candidate = availableCandidates.find(c => c.id === selectedCandidate);

    if (candidate) {
      // In a real app, this would update the database
      toast({
        title: "Candidate Assigned",
        description: `${candidate.name} has been assigned to ${profile.name}`,
      });

      // Update the local state to reflect the change
      const updatedAvailableCandidates = availableCandidates.filter(c => c.id !== selectedCandidate);
      setAvailableCandidates(updatedAvailableCandidates);

      // Reset the form
      setShowAssignCandidateForm(false);
      setSelectedCandidate('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/profiles">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{profile.name}</h1>
            <p className="text-muted-foreground mt-1">
              {profile.role} • {profile.department}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleContactProfile}>
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button onClick={handleEditProfile}>
            <FileText className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Assigned Candidates</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Contact details and basic information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{profile.name}</h3>
                    <p className="text-muted-foreground">{profile.role}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{profile.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Hired on {new Date(profile.hireDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skills & Expertise</CardTitle>
                <CardDescription>Professional skills and competencies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Professional Bio</h4>
                    <p className="text-sm text-muted-foreground">{profile.bio}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recruitment Stats</CardTitle>
                <CardDescription>Current recruitment activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-primary" />
                      <span>Open Requisitions</span>
                    </div>
                    <span className="font-medium">{profile.stats.openRequisitions}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-primary" />
                      <span>Active Candidates</span>
                    </div>
                    <span className="font-medium">{profile.stats.activeCandidates}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-2 text-primary" />
                      <span>Total Hires</span>
                    </div>
                    <span className="font-medium">{profile.stats.totalHires}</span>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-medium mb-2">Candidate Distribution</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Screening</span>
                          <span className="text-xs font-medium">4</span>
                        </div>
                        <Progress value={33} className="h-1.5 bg-amber-100" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Interview</span>
                          <span className="text-xs font-medium">5</span>
                        </div>
                        <Progress value={42} className="h-1.5 bg-blue-100" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Offer</span>
                          <span className="text-xs font-medium">2</span>
                        </div>
                        <Progress value={17} className="h-1.5 bg-purple-100" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">Hired</span>
                          <span className="text-xs font-medium">1</span>
                        </div>
                        <Progress value={8} className="h-1.5 bg-green-100" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Candidates Being Managed</CardTitle>
                <CardDescription>Job applicants currently being managed by {profile.name}</CardDescription>
              </div>
              <Dialog open={showAssignCandidateForm} onOpenChange={setShowAssignCandidateForm}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Users className="h-4 w-4 mr-2" />
                    Assign New Candidate
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Candidate</DialogTitle>
                    <DialogDescription>
                      Select a candidate to assign to {profile.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCandidates.map((candidate) => (
                          <SelectItem key={candidate.id} value={candidate.id}>
                            <div className="flex items-center">
                              <span>{candidate.name}</span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                ({candidate.position} • {candidate.status})
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAssignCandidateForm(false)}>Cancel</Button>
                    <Button onClick={handleAssignCandidate}>Assign</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-3 px-4 font-medium">Candidate</th>
                      <th className="text-left py-3 px-4 font-medium">Position</th>
                      <th className="text-left py-3 px-4 font-medium">Status</th>
                      <th className="text-left py-3 px-4 font-medium">Applied Date</th>
                      <th className="text-left py-3 px-4 font-medium">Next Step</th>
                      <th className="text-left py-3 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockAssignedCandidates.map((candidate) => (
                      <tr key={candidate.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={candidate.avatar} alt={candidate.name} />
                              <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{candidate.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{candidate.position}</td>
                        <td className="py-3 px-4">
                          <Badge className={statusConfig[candidate.status].color}>
                            {statusConfig[candidate.status].label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">{new Date(candidate.appliedDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">{candidate.nextStep}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCandidate(candidate.id)}
                            >
                              View Candidate Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleCandidateAction(candidate.id)}
                            >
                              Next Step
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest recruitment activities and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {profile.recentActivity.map((activity, i) => (
                  <div key={i} className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {activity.type === 'interview' && <Users className="h-5 w-5 text-primary" />}
                        {activity.type === 'hire' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {activity.type === 'requisition' && <FileText className="h-5 w-5 text-primary" />}
                        {activity.type === 'feedback' && <Star className="h-5 w-5 text-amber-500" />}
                        {activity.type === 'screening' && <Briefcase className="h-5 w-5 text-primary" />}
                        {activity.type === 'sourcing' && <Users className="h-5 w-5 text-primary" />}
                        {activity.type === 'meeting' && <Clock className="h-5 w-5 text-primary" />}
                      </div>
                      {i < profile.recentActivity.length - 1 && (
                        <div className="h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className="flex items-baseline justify-between">
                        <p className="font-medium">
                          {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                        </p>
                        <Badge variant="outline">
                          {new Date(activity.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          {/* Feedback Form Dialog */}
          <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Submit Interview Feedback</DialogTitle>
                <DialogDescription>
                  {selectedInterview && (
                    <div className="flex items-center mt-2">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={selectedInterview.candidateAvatar} alt={selectedInterview.candidateName} />
                        <AvatarFallback>{selectedInterview.candidateName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{selectedInterview.candidateName}</p>
                        <p className="text-xs text-muted-foreground">{selectedInterview.candidatePosition}</p>
                      </div>
                    </div>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Overall Rating</Label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        type="button"
                        variant={feedbackForm.rating >= rating ? "default" : "outline"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating })}
                      >
                        {rating}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="strengths">Strengths</Label>
                  <Textarea
                    id="strengths"
                    placeholder="List candidate's strengths..."
                    value={feedbackForm.strengths}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, strengths: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="weaknesses">Areas for Improvement</Label>
                  <Textarea
                    id="weaknesses"
                    placeholder="List areas where the candidate could improve..."
                    value={feedbackForm.weaknesses}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, weaknesses: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notes">Overall Assessment</Label>
                  <Textarea
                    id="notes"
                    placeholder="Provide your overall assessment of the candidate..."
                    value={feedbackForm.notes}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, notes: e.target.value })}
                    className="min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Select
                    value={feedbackForm.recommendation}
                    onValueChange={(value) => setFeedbackForm({ ...feedbackForm, recommendation: value })}
                  >
                    <SelectTrigger id="recommendation">
                      <SelectValue placeholder="Select your recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hire">Hire</SelectItem>
                      <SelectItem value="consider">Consider</SelectItem>
                      <SelectItem value="reject">Reject</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>Cancel</Button>
                <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Main Content */}
          <Tabs defaultValue="pending" className="space-y-4">
            <TabsList>
              <TabsTrigger value="pending">
                <Clock className="h-4 w-4 mr-2" />
                Pending Feedback
              </TabsTrigger>
              <TabsTrigger value="submitted">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Submitted Feedback
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {mockPendingInterviews.length === 0 ? (
                <Card>
                  <CardContent className="py-10">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Pending Feedback</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        You don't have any interviews that need feedback at the moment.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {mockPendingInterviews.map((interview) => (
                    <Card key={interview.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarImage src={interview.candidateAvatar} alt={interview.candidateName} />
                              <AvatarFallback>{interview.candidateName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-medium">{interview.candidateName}</h3>
                              <p className="text-sm text-muted-foreground">{interview.candidatePosition}</p>
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {interview.interviewType}
                                </Badge>
                                <span className="text-xs text-muted-foreground ml-2">
                                  {new Date(interview.interviewDate).toLocaleDateString()} at {new Date(interview.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <Button
                              onClick={() => handleOpenFeedbackForm(interview)}
                              disabled={interview.status === 'scheduled'}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              {interview.feedbackStatus === 'pending' ? 'Complete Feedback' : 'Provide Feedback'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="submitted" className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    placeholder="Search feedback..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9"
                  />
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px] h-9">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4" />
                      <span>{statusFilter === 'all' ? 'All Status' : statusFilter}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filteredFeedback.length === 0 ? (
                <Card>
                  <CardContent className="py-10">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Feedback Found</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        No feedback matches your current filters. Try adjusting your search or filters.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredFeedback.map((feedback) => (
                    <Card key={feedback.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-10 w-10 mr-4">
                                <AvatarImage src={feedback.candidateAvatar} alt={feedback.candidateName} />
                                <AvatarFallback>{feedback.candidateName.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <h3 className="font-medium">{feedback.candidateName}</h3>
                                <p className="text-sm text-muted-foreground">{feedback.candidatePosition}</p>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {feedback.interviewType}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground ml-2">
                                    {new Date(feedback.interviewDate).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Badge variant={feedback.recommendation === 'hire' ? 'default' : feedback.recommendation === 'consider' ? 'outline' : 'destructive'}>
                                {feedback.recommendation === 'hire' ? 'Hire' : feedback.recommendation === 'consider' ? 'Consider' : 'Reject'}
                              </Badge>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Overall Rating</h4>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <Star
                                  key={rating}
                                  className={`h-5 w-5 ${rating <= feedback.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Strengths</h4>
                              <ul className="text-sm space-y-1 list-disc pl-5">
                                {feedback.strengths.map((strength, i) => (
                                  <li key={i}>{strength}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
                              <ul className="text-sm space-y-1 list-disc pl-5">
                                {feedback.weaknesses.map((weakness, i) => (
                                  <li key={i}>{weakness}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Overall Assessment</h4>
                            <p className="text-sm">{feedback.notes}</p>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t bg-muted/50 flex justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={feedback.author.avatar} alt={feedback.author.name} />
                            <AvatarFallback>{feedback.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>Feedback by {feedback.author.name}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditFeedback(feedback.id)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFeedback(feedback.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Recruitment performance and efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Time to Hire</span>
                    <span className="text-sm font-medium">25 days</span>
                  </div>
                  <Progress value={70} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Average time from requisition to hire (25% faster than team average)
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Candidate Quality</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of candidates advancing to interview stage
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Offer Acceptance Rate</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of offers accepted by candidates
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Retention Rate</span>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage of hires still with company after 1 year
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hiring Goals</CardTitle>
              <CardDescription>Progress toward recruitment targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md">
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium mb-2">Performance Charts</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This section would display charts showing performance metrics over time,
                    including hiring goals, time-to-hire trends, and candidate quality metrics.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileDetailsPage;
