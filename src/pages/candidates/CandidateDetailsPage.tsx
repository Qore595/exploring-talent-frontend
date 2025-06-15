import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  MessageSquare,
  Download,
  Send,
  UserCog,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock candidate data
const mockCandidates = [
  {
    id: '1',
    name: 'Jordan Lee',
    position: 'Senior Software Engineer',
    email: 'jordan.lee@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    status: 'interview',
    matchScore: 92,
    appliedDate: '2023-05-15',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    summary: 'Experienced software engineer with 8+ years of experience in full-stack development. Strong expertise in React, TypeScript, and cloud technologies.',
    assignedTo: {
      id: 'profile-1',
      name: 'Alex Johnson',
      role: 'Hiring Manager',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    experience: [
      {
        title: 'Senior Software Engineer',
        company: 'Tech Innovations Inc.',
        location: 'San Francisco, CA',
        startDate: '2020-03',
        endDate: 'Present',
        description: 'Led development of cloud-based SaaS platform. Implemented microservices architecture using Node.js and AWS.'
      },
      {
        title: 'Software Engineer',
        company: 'WebSolutions Co.',
        location: 'Seattle, WA',
        startDate: '2017-06',
        endDate: '2020-02',
        description: 'Developed and maintained front-end applications using React and Redux. Collaborated with UX designers to implement responsive designs.'
      }
    ],
    education: [
      {
        degree: 'M.S. Computer Science',
        institution: 'University of Washington',
        location: 'Seattle, WA',
        year: '2017'
      },
      {
        degree: 'B.S. Computer Science',
        institution: 'University of California, Berkeley',
        location: 'Berkeley, CA',
        year: '2015'
      }
    ],
    interviews: [
      {
        id: 'int-1',
        type: 'Technical Interview',
        date: '2023-06-05T14:00:00',
        interviewer: 'Alex Johnson',
        status: 'scheduled',
        notes: ''
      }
    ],
    notes: [
      {
        id: 'note-1',
        author: 'Morgan Smith',
        date: '2023-05-20T10:30:00',
        content: 'Excellent technical skills. Strong problem-solving abilities demonstrated during initial screening.'
      }
    ]
  },
  {
    id: '2',
    name: 'Taylor Smith',
    position: 'Product Manager',
    email: 'taylor.smith@example.com',
    phone: '(555) 234-5678',
    location: 'New York, NY',
    skills: ['Product Strategy', 'User Research', 'Agile', 'Roadmapping'],
    status: 'screening',
    matchScore: 87,
    appliedDate: '2023-05-20',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    summary: 'Product manager with 5+ years of experience in SaaS products. Passionate about user-centered design and data-driven decision making.',
    assignedTo: {
      id: 'profile-2',
      name: 'Sarah Chen',
      role: 'Talent Scout',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    experience: [
      {
        title: 'Senior Product Manager',
        company: 'SaaS Platforms Inc.',
        location: 'New York, NY',
        startDate: '2021-01',
        endDate: 'Present',
        description: 'Led product strategy for B2B SaaS platform. Increased user engagement by 35% through feature optimization.'
      },
      {
        title: 'Product Manager',
        company: 'Digital Solutions LLC',
        location: 'Boston, MA',
        startDate: '2018-04',
        endDate: '2020-12',
        description: 'Managed product lifecycle from conception to launch. Collaborated with engineering and design teams to deliver user-focused features.'
      }
    ],
    education: [
      {
        degree: 'MBA',
        institution: 'Harvard Business School',
        location: 'Boston, MA',
        year: '2018'
      },
      {
        degree: 'B.A. Business Administration',
        institution: 'New York University',
        location: 'New York, NY',
        year: '2016'
      }
    ],
    interviews: [],
    notes: [
      {
        id: 'note-1',
        author: 'Alex Johnson',
        date: '2023-05-22T15:45:00',
        content: 'Strong background in product management. Resume shows consistent growth and increasing responsibilities.'
      }
    ]
  },
  {
    id: '3',
    name: 'Morgan Chen',
    position: 'UX Designer',
    email: 'morgan.chen@example.com',
    phone: '(555) 345-6789',
    location: 'Chicago, IL',
    skills: ['UI Design', 'User Research', 'Figma', 'Prototyping'],
    status: 'offer',
    matchScore: 95,
    appliedDate: '2023-05-10',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    summary: 'Creative UX designer with 6+ years of experience creating user-centered digital experiences. Proficient in design thinking and rapid prototyping.',
    assignedTo: {
      id: 'profile-3',
      name: 'Michael Torres',
      role: 'Team Member',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    experience: [
      {
        title: 'Senior UX Designer',
        company: 'Design Innovations',
        location: 'Chicago, IL',
        startDate: '2021-02',
        endDate: 'Present',
        description: 'Lead UX designer for enterprise software products. Conducted user research and created wireframes and prototypes for new features.'
      },
      {
        title: 'UX Designer',
        company: 'Creative Solutions',
        location: 'Boston, MA',
        startDate: '2018-05',
        endDate: '2021-01',
        description: 'Designed user interfaces for mobile applications. Collaborated with product managers and developers to implement user-centered designs.'
      }
    ],
    education: [
      {
        degree: 'M.A. Human-Computer Interaction',
        institution: 'Carnegie Mellon University',
        location: 'Pittsburgh, PA',
        year: '2018'
      },
      {
        degree: 'B.F.A. Graphic Design',
        institution: 'Rhode Island School of Design',
        location: 'Providence, RI',
        year: '2016'
      }
    ],
    interviews: [
      {
        id: 'int-1',
        type: 'Design Portfolio Review',
        date: '2023-05-25T13:00:00',
        interviewer: 'Michael Torres',
        status: 'completed',
        notes: 'Excellent portfolio with strong focus on user-centered design. Great attention to detail in prototypes.'
      },
      {
        id: 'int-2',
        type: 'Team Interview',
        date: '2023-06-02T10:00:00',
        interviewer: 'Design Team',
        status: 'completed',
        notes: 'Team was impressed with problem-solving approach and collaboration skills.'
      }
    ],
    notes: [
      {
        id: 'note-1',
        author: 'Michael Torres',
        date: '2023-05-26T14:30:00',
        content: 'Morgan has exceptional design skills and a strong portfolio. Would be a great addition to our design team.'
      },
      {
        id: 'note-2',
        author: 'Sarah Chen',
        date: '2023-06-03T11:15:00',
        content: 'Team feedback was very positive. Moving forward with offer preparation.'
      }
    ]
  }
];

// Status configuration
const statusConfig = {
  screening: { label: 'Screening', color: 'bg-amber-100 text-amber-800', icon: FileText },
  interview: { label: 'Interview', color: 'bg-blue-100 text-blue-800', icon: Calendar },
  offer: { label: 'Offer', color: 'bg-purple-100 text-purple-800', icon: FileText },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-800', icon: CheckCircle2 },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
};

// Mock employees for reassignment
const mockEmployees = [
  {
    id: 'profile-1',
    name: 'Alex Johnson',
    role: 'Hiring Manager',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    candidateCount: 12
  },
  {
    id: 'profile-2',
    name: 'Sarah Chen',
    role: 'Talent Scout',
    department: 'Recruitment',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    candidateCount: 28
  },
  {
    id: 'profile-3',
    name: 'Michael Torres',
    role: 'Team Member',
    department: 'Product',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    candidateCount: 3
  },
  {
    id: 'profile-4',
    name: 'Jessica Williams',
    role: 'Marketing Recruiter',
    department: 'Marketing',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    candidateCount: 15
  }
];

const CandidateDetailsPage = () => {
  const { candidateId } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [newNote, setNewNote] = useState('');
  const [showReassignDialog, setShowReassignDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    // In a real app, fetch candidate data from API
    const foundCandidate = mockCandidates.find(c => c.id === candidateId);

    if (foundCandidate) {
      setCandidate(foundCandidate);
    } else {
      toast({
        title: "Candidate Not Found",
        description: "The requested candidate could not be found",
        variant: "destructive",
      });
    }
  }, [candidateId]);

  if (!candidate) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading candidate details...</p>
      </div>
    );
  }

  const { status } = candidate;
  const statusInfo = statusConfig[status];

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast({
        title: "Empty Note",
        description: "Please enter a note before submitting",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Note Added",
      description: "Your note has been added to the candidate's profile",
    });

    setNewNote('');
  };

  const handleScheduleInterview = () => {
    toast({
      title: "Schedule Interview",
      description: "Opening interview scheduling form",
    });
  };

  const handleSendEmail = () => {
    toast({
      title: "Send Email",
      description: `Opening email composer for ${candidate.name}`,
    });
  };

  const handleDownloadResume = () => {
    toast({
      title: "Download Resume",
      description: "Downloading candidate's resume",
    });
  };

  const handleMoveToNextStage = () => {
    const nextStage = status === 'screening' ? 'interview' :
                      status === 'interview' ? 'offer' :
                      status === 'offer' ? 'hired' : status;

    if (nextStage !== status) {
      toast({
        title: "Candidate Advanced",
        description: `${candidate.name} has been moved to ${statusConfig[nextStage].label} stage`,
      });
    }
  };

  const handleReassignCandidate = () => {
    if (!selectedEmployee) {
      toast({
        title: "Error",
        description: "Please select an employee to reassign the candidate to",
        variant: "destructive",
      });
      return;
    }

    const employee = mockEmployees.find(e => e.id === selectedEmployee);

    if (employee) {
      // In a real app, this would update the database
      toast({
        title: "Candidate Reassigned",
        description: `${candidate.name} has been reassigned to ${employee.name}`,
      });

      // Update the local state to reflect the change
      setCandidate({
        ...candidate,
        assignedTo: {
          id: employee.id,
          name: employee.name,
          role: employee.role,
          avatar: employee.avatar
        }
      });

      setShowReassignDialog(false);
      setSelectedEmployee('');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/candidates">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <p className="text-muted-foreground mt-1">
              {candidate.position} • {candidate.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Contact
          </Button>
          <Button onClick={handleMoveToNextStage}>
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Move to Next Stage
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center">
          <Badge className={statusInfo.color}>
            <statusInfo.icon className="h-3.5 w-3.5 mr-1" />
            {statusInfo.label}
          </Badge>
          <span className="mx-2">•</span>
          <span className="text-sm">
            Applied on {new Date(candidate.appliedDate).toLocaleDateString()}
          </span>
          <span className="mx-2">•</span>
          <div className="flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-sm font-medium">{candidate.matchScore}% Match</span>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownloadResume}>
          <Download className="h-4 w-4 mr-2" />
          Download Resume
        </Button>
      </div>

      {/* Assigned Employee Section */}
      {candidate.assignedTo ? (
        <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center">
            <UserCog className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium mr-2">Assigned To:</span>
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={candidate.assignedTo.avatar} alt={candidate.assignedTo.name} />
                <AvatarFallback>{candidate.assignedTo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{candidate.assignedTo.name}</p>
                <p className="text-xs text-muted-foreground">{candidate.assignedTo.role}</p>
              </div>
            </div>
          </div>
          <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Reassign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reassign Candidate</DialogTitle>
                <DialogDescription>
                  Select an employee to reassign {candidate.name} to.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex items-center">
                          <span>{employee.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({employee.role} • {employee.candidateCount} candidates)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReassignDialog(false)}>Cancel</Button>
                <Button onClick={handleReassignCandidate}>Reassign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center">
            <UserCog className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium mr-2">Not Assigned</span>
            <p className="text-sm text-muted-foreground">This candidate is not assigned to any employee yet.</p>
          </div>
          <Dialog open={showReassignDialog} onOpenChange={setShowReassignDialog}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Assign
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Candidate</DialogTitle>
                <DialogDescription>
                  Select an employee to assign {candidate.name} to.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        <div className="flex items-center">
                          <span>{employee.name}</span>
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({employee.role} • {employee.candidateCount} candidates)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReassignDialog(false)}>Cancel</Button>
                <Button onClick={handleReassignCandidate}>Assign</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Candidate's contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={candidate.avatar} alt={candidate.name} />
                    <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{candidate.name}</h3>
                    <p className="text-muted-foreground">{candidate.position}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{candidate.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{candidate.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>Applied on {new Date(candidate.appliedDate).toLocaleDateString()}</span>
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
                    {candidate.skills.map((skill, i) => (
                      <Badge key={i} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Match Score</h4>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">Job Requirements Match</span>
                      <span className="text-sm font-medium">{candidate.matchScore}%</span>
                    </div>
                    <Progress value={candidate.matchScore} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Next Steps</CardTitle>
                <CardDescription>Actions for this candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {status === 'screening' && (
                    <Button className="w-full" onClick={handleScheduleInterview}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Interview
                    </Button>
                  )}

                  {status === 'interview' && (
                    <Button className="w-full" onClick={handleMoveToNextStage}>
                      <FileText className="h-4 w-4 mr-2" />
                      Prepare Offer
                    </Button>
                  )}

                  {status === 'offer' && (
                    <Button className="w-full" onClick={handleMoveToNextStage}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Hired
                    </Button>
                  )}

                  <Button variant="outline" className="w-full" onClick={handleSendEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>

                  <Button variant="outline" className="w-full" onClick={() => setActiveTab('notes')}>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Professional Summary</CardTitle>
              <CardDescription>Candidate's background and expertise</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{candidate.summary}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Education</CardTitle>
              <CardDescription>Academic background</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidate.education.map((edu, i) => (
                  <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                    <h3 className="font-medium">{edu.degree}</h3>
                    <p className="text-sm text-muted-foreground">
                      {edu.institution}, {edu.location}
                    </p>
                    <p className="text-sm">Graduated: {edu.year}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Work Experience</CardTitle>
              <CardDescription>Professional history and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {candidate.experience.map((exp, i) => (
                  <div key={i} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{exp.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {exp.company}, {exp.location}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {exp.startDate} - {exp.endDate}
                      </Badge>
                    </div>
                    <p className="text-sm">{exp.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interviews" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Scheduled Interviews</CardTitle>
                <CardDescription>Upcoming and past interviews</CardDescription>
              </div>
              <Button onClick={handleScheduleInterview}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Interview
              </Button>
            </CardHeader>
            <CardContent>
              {candidate.interviews.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Interviews Scheduled</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    There are no interviews scheduled for this candidate yet.
                    Click the "Schedule Interview" button to set up an interview.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {candidate.interviews.map((interview) => (
                    <Card key={interview.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{interview.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              With {interview.interviewer} • {new Date(interview.date).toLocaleString()}
                            </p>
                          </div>
                          <Badge className={
                            interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-amber-100 text-amber-800'
                          }>
                            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                          </Badge>
                        </div>
                        {interview.notes && (
                          <div className="mt-4 p-3 bg-muted rounded-md">
                            <p className="text-sm">{interview.notes}</p>
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          {interview.status === 'scheduled' && (
                            <>
                              <Button size="sm" variant="outline">
                                Reschedule
                              </Button>
                              <Button size="sm">
                                Join Interview
                              </Button>
                            </>
                          )}
                          {interview.status === 'completed' && (
                            <Button size="sm" variant="outline">
                              View Feedback
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Add Note</CardTitle>
              <CardDescription>Record your observations about this candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your notes about this candidate..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[120px]"
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleAddNote}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes History</CardTitle>
              <CardDescription>Previous notes and observations</CardDescription>
            </CardHeader>
            <CardContent>
              {candidate.notes.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Notes Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    There are no notes for this candidate yet. Add a note to keep track of important information.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {candidate.notes.map((note) => (
                    <div key={note.id} className="border-b pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{note.author}</h3>
                        <Badge variant="outline">
                          {new Date(note.date).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDetailsPage;
