import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Video, User, FileText, Plus, ChevronDown,
  MapPin, Building2, BarChart3, PieChart, Download, Filter,
  ArrowUpRight, ArrowDown, Users, Search, CheckSquare, X,
  TrendingUp, DollarSign, Info, HelpCircle, Layers, ArrowUpDown,
  CalendarDays, ListFilter, LayoutGrid, Table as TableIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { format, parseISO, isToday, isTomorrow, isYesterday, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { mockLocations, mockDepartments, getLocationById, getDepartmentById } from '@/types/organization';

// Chart colors
const CHART_COLORS = {
  primary: '#8884d8',
  secondary: '#82ca9d',
  tertiary: '#ffc658',
  quaternary: '#ff8042',
  success: '#4ade80',
  warning: '#f59e0b',
  error: '#ef4444'
};

// Enhanced mock interview data with location and department information
const mockInterviews = [
  {
    id: '1',
    candidate: 'Jordan Lee',
    position: 'Senior Software Engineer',
    date: '2025-04-27T14:00:00',
    status: 'scheduled',
    type: 'technical',
    interviewers: ['Robin Taylor', 'Alex Johnson'],
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    email: 'jordan.lee@example.com',
    source: 'LinkedIn',
  },
  {
    id: '2',
    candidate: 'Taylor Smith',
    position: 'Frontend Developer',
    date: '2025-04-28T11:30:00',
    status: 'scheduled',
    type: 'behavioral',
    interviewers: ['Robin Taylor'],
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    email: 'taylor.smith@example.com',
    source: 'Indeed',
  },
  {
    id: '3',
    candidate: 'Morgan Chen',
    position: 'Data Scientist',
    date: '2025-04-25T15:00:00',
    status: 'completed',
    type: 'technical',
    feedback: 'Strong technical skills in machine learning. Good communication.',
    interviewers: ['Robin Taylor', 'Jamie Garcia'],
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-2', // New York Office
    departmentId: 'dept-3', // Marketing (Recruitment)
    email: 'morgan.chen@example.com',
    source: 'Referral',
  },
  {
    id: '4',
    candidate: 'Casey Wilson',
    position: 'UX Designer',
    date: '2025-04-24T10:00:00',
    status: 'completed',
    type: 'portfolio',
    feedback: 'Excellent portfolio. Great understanding of user needs.',
    interviewers: ['Alex Johnson'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-3', // San Francisco Branch
    departmentId: 'dept-5', // Marketing (Recruitment)
    email: 'casey.wilson@example.com',
    source: 'Dribbble',
  },
  {
    id: '5',
    candidate: 'Jamie Garcia',
    position: 'Mobile Developer',
    date: '2025-04-30T13:30:00',
    status: 'scheduled',
    type: 'technical',
    interviewers: ['Robin Taylor', 'Morgan Smith'],
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-4', // Chicago Office
    departmentId: 'dept-7', // Marketing (Recruitment)
    email: 'jamie.garcia@example.com',
    source: 'Referral',
  },
  {
    id: '6',
    candidate: 'Robin Taylor',
    position: 'Product Manager',
    date: '2025-05-02T10:00:00',
    status: 'scheduled',
    type: 'behavioral',
    interviewers: ['David Kim', 'Sarah Chen'],
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-3', // San Francisco Branch
    departmentId: 'dept-6', // Sales
    email: 'robin.taylor@example.com',
    source: 'LinkedIn',
  },
  {
    id: '7',
    candidate: 'Alex Johnson',
    position: 'Backend Developer',
    date: '2025-04-23T14:00:00',
    status: 'completed',
    type: 'technical',
    feedback: 'Good technical knowledge but needs improvement in system design.',
    interviewers: ['Taylor Reed', 'Drew Garcia'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-4', // Chicago Office
    departmentId: 'dept-7', // Marketing (Recruitment)
    email: 'alex.johnson@example.com',
    source: 'Indeed',
  },
  {
    id: '8',
    candidate: 'Riley Martinez',
    position: 'Marketing Specialist',
    date: '2025-05-05T11:30:00',
    status: 'scheduled',
    type: 'behavioral',
    interviewers: ['Sarah Chen', 'Jordan Lee'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    email: 'riley.martinez@example.com',
    source: 'Company Website',
  }
];

// Mock candidates for scheduling
const mockCandidatesList = [
  { id: '1', name: 'Jordan Lee', position: 'Senior Software Engineer' },
  { id: '2', name: 'Taylor Smith', position: 'Frontend Developer' },
  { id: '5', name: 'Jamie Garcia', position: 'Mobile Developer' },
  { id: '6', name: 'Robin Taylor', position: 'Product Manager' },
  { id: '8', name: 'Alex Johnson', position: 'Backend Developer' },
];

// Mock team members for interviewers
const mockTeamMembers = [
  { id: '1', name: 'Robin Taylor' },
  { id: '2', name: 'Alex Johnson' },
  { id: '3', name: 'Jamie Garcia' },
  { id: '4', name: 'Morgan Smith' },
];

// Interview types
const interviewTypes = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'portfolio', label: 'Portfolio Review' },
  { value: 'final', label: 'Final Round' },
];

// Feedback rating options
const ratingOptions = [
  { value: '1', label: '1 - Poor' },
  { value: '2', label: '2 - Below Average' },
  { value: '3', label: '3 - Average' },
  { value: '4', label: '4 - Good' },
  { value: '5', label: '5 - Excellent' },
];

// Recommendation options
const recommendationOptions = [
  { value: 'hire', label: 'Hire' },
  { value: 'consider', label: 'Consider' },
  { value: 'reject', label: 'Reject' },
];

const InterviewsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState('upcoming');
  const [date, setDate] = useState<Date>();
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [selectedType, setSelectedType] = useState('technical');
  const [selectedInterviewers, setSelectedInterviewers] = useState<string[]>([]);
  const [interviewTime, setInterviewTime] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [locationFilter, setLocationFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDashboard, setShowDashboard] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState<'date' | 'name'>('date');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [feedbackForm, setFeedbackForm] = useState({
    rating: '3',
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'consider'
  });

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Get user's assigned location and department from the user object
  const userAssignedLocationId = useMemo(() => {
    return user?.locationId || null;
  }, [user]);

  const userAssignedDepartmentId = useMemo(() => {
    return user?.departmentId || null;
  }, [user]);

  // Filter interviews based on user role
  const roleFilteredInterviews = useMemo(() => {
    if (!user) return [];

    // CEO can see all interviews (no filters)
    if (user.role === 'ceo') {
      return mockInterviews;
    }

    // Branch Manager can only see interviews from their location
    if (user.role === 'branch-manager' && userAssignedLocationId) {
      return mockInterviews.filter(interview => interview.locationId === userAssignedLocationId);
    }

    // Marketing roles can only see interviews from their department and location
    if ([
      'marketing-head',
      'marketing-supervisor',
      'marketing-recruiter',
      'marketing-associate'
    ].includes(user.role)) {
      if (userAssignedDepartmentId && userAssignedLocationId) {
        return mockInterviews.filter(
          interview => interview.departmentId === userAssignedDepartmentId &&
            interview.locationId === userAssignedLocationId
        );
      }
    }

    // Default: show all interviews (for any other role)
    return mockInterviews;
  }, [user, userAssignedLocationId, userAssignedDepartmentId]);

  // Compute metrics
  const interviewsByLocation = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredInterviews.forEach(interview => {
      if (interview.locationId) {
        result[interview.locationId] = (result[interview.locationId] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredInterviews]);

  const interviewsByDepartment = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredInterviews.forEach(interview => {
      if (interview.departmentId) {
        result[interview.departmentId] = (result[interview.departmentId] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredInterviews]);

  const interviewsBySource = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredInterviews.forEach(interview => {
      if (interview.source) {
        result[interview.source] = (result[interview.source] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredInterviews]);

  const interviewsByType = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredInterviews.forEach(interview => {
      if (interview.type) {
        result[interview.type] = (result[interview.type] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredInterviews]);

  // Calculate conversion metrics
  const interviewMetrics = useMemo(() => {
    const completed = roleFilteredInterviews.filter(i => i.status === 'completed').length;
    const scheduled = roleFilteredInterviews.filter(i => i.status === 'scheduled').length;
    const total = roleFilteredInterviews.length;

    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate success rate (interviews with positive feedback)
    const successfulInterviews = roleFilteredInterviews.filter(
      i => i.status === 'completed' && i.feedback && ['good', 'excellent', 'strong'].some(term => i.feedback!.toLowerCase().includes(term))
    ).length;
    const successRate = completed > 0 ? Math.round((successfulInterviews / completed) * 100) : 0;

    return {
      completed,
      scheduled,
      total,
      completionRate,
      successRate,
      successfulInterviews
    };
  }, [roleFilteredInterviews]);

  // Filter interviews based on status, location, department, type, source and search term
  const filteredInterviews = roleFilteredInterviews.filter(interview => {
    // Filter by status
    if (filter === 'upcoming') {
      if (interview.status !== 'scheduled') return false;
    } else if (filter === 'past') {
      if (interview.status !== 'completed') return false;
    }

    // Filter by search term (search in candidate name, position, and email)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesName = interview.candidate.toLowerCase().includes(searchLower);
      const matchesPosition = interview.position.toLowerCase().includes(searchLower);
      const matchesEmail = interview.email?.toLowerCase().includes(searchLower);

      if (!matchesName && !matchesPosition && !matchesEmail) {
        return false;
      }
    }

    // Filter by location
    if (locationFilter !== 'all' && interview.locationId !== locationFilter) {
      return false;
    }

    // Filter by department
    if (departmentFilter !== 'all' && interview.departmentId !== departmentFilter) {
      return false;
    }

    // Filter by interview type
    if (selectedType !== 'all' && selectedType !== 'technical' && interview.type !== selectedType) {
      return false;
    }

    // Filter by source
    if (sourceFilter !== 'all' && interview.source !== sourceFilter) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort by date (newest first)
    if (sortOrder === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    // Sort by name (alphabetical)
    return a.candidate.localeCompare(b.candidate);
  });

  // Get unique values for filters
  const sources = ['all', ...new Set(roleFilteredInterviews.filter(i => i.source).map(i => i.source as string))];

  // Handle actions
  const handleJoinInterview = () => {
    toast({
      title: "Join Interview",
      description: "Opening Zoom meeting for the interview",
    });
  };

  const handleViewFeedback = (id: string) => {
    const interview = roleFilteredInterviews.find(i => i.id === id);
    if (interview) {
      setSelectedInterview(interview);
      setIsFeedbackDialogOpen(true);
    }
  };

  const handleSubmitFeedback = () => {
    if (!selectedInterview) return;

    if (!feedbackForm.strengths || !feedbackForm.weaknesses || !feedbackForm.notes || !feedbackForm.recommendation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required feedback fields",
        variant: "destructive",
      });
      return;
    }

    // In a real application, this would send the feedback data to the server
    // For now, we'll just show a success message

    // Create a comprehensive feedback summary
    const feedbackSummary = `
Rating: ${feedbackForm.rating}/5
Strengths: ${feedbackForm.strengths}
Areas for Improvement: ${feedbackForm.weaknesses}
Additional Notes: ${feedbackForm.notes}
Recommendation: ${feedbackForm.recommendation === 'hire' ? 'Hire' :
                  feedbackForm.recommendation === 'consider' ? 'Consider' : 'Reject'}
    `;

    // Update the interview with the feedback (in a real app, this would be an API call)
    // For demo purposes, we're just showing a toast notification
    toast({
      title: "Feedback Submitted Successfully",
      description: `Feedback for ${selectedInterview.candidate}'s ${selectedInterview.type} interview has been recorded.`,
    });

    // Close the dialog and reset the form
    setIsFeedbackDialogOpen(false);
    resetFeedbackForm();

    // Optionally, you could navigate to the feedback page
    // navigate('/interviews/feedback');
  };

  const resetFeedbackForm = () => {
    setFeedbackForm({
      rating: '3',
      strengths: '',
      weaknesses: '',
      notes: '',
      recommendation: 'consider'
    });
    setSelectedInterview(null);
  };

  const handleScheduleInterview = () => {
    if (!selectedCandidate || !date || !interviewTime || selectedInterviewers.length === 0 || !selectedLocation || !selectedDepartment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields including location and department",
        variant: "destructive",
      });
      return;
    }

    const candidate = mockCandidatesList.find(c => c.id === selectedCandidate);
    const location = mockLocations.find(l => l.id === selectedLocation);
    const department = mockDepartments.find(d => d.id === selectedDepartment);

    toast({
      title: "Interview Scheduled",
      description: `Interview for ${candidate?.name} scheduled successfully at ${location?.name} for ${department?.name}`,
    });

    setIsDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedCandidate('');
    setDate(undefined);
    setInterviewTime('');
    setSelectedType('technical');
    setSelectedInterviewers([]);
    setSelectedLocation('');
    setSelectedDepartment('');
  };

  const toggleInterviewer = (memberId: string) => {
    setSelectedInterviewers(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-8 animate-fade-in">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-[180px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-[120px]" />
                  <Skeleton className="h-9 w-[120px]" />
                  <Skeleton className="h-9 w-[120px]" />
                </div>
              </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center gap-2">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <Skeleton className="h-7 w-16" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-[200px]" />
                    <Skeleton className="h-4 w-[250px]" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-[300px] w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Interviews</h1>
                <p className="text-muted-foreground mt-2">
                  Schedule, manage, and track candidate interviews throughout the hiring process
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant={showDashboard ? "default" : "outline"}
                  onClick={() => setShowDashboard(true)}
                  className="flex items-center gap-1"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
                <Button
                  variant={!showDashboard ? "default" : "outline"}
                  onClick={() => setShowDashboard(false)}
                  className="flex items-center gap-1"
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Interviews</span>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/interviews/feedback">
                    <FileText className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Feedback</span>
                  </Link>
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Schedule Interview</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Schedule New Interview</DialogTitle>
                      <DialogDescription>
                        Set up an interview with a candidate and team members
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="candidate">Candidate</Label>
                          <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a candidate" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockCandidatesList.map((candidate) => (
                                <SelectItem key={candidate.id} value={candidate.id}>
                                  {candidate.name} - {candidate.position}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Interview Type</Label>
                          <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select interview type" />
                            </SelectTrigger>
                            <SelectContent>
                              {interviewTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockLocations.map((location) => (
                                <SelectItem key={location.id} value={location.id}>
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department">Department</Label>
                          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              {mockDepartments.map((department) => (
                                <SelectItem key={department.id} value={department.id}>
                                  {department.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={interviewTime}
                            onChange={(e) => setInterviewTime(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Interviewers</Label>
                        <div className="grid grid-cols-2 gap-2 border rounded-md p-3">
                          {mockTeamMembers.map((member) => (
                            <div key={member.id} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={`interviewer-${member.id}`}
                                checked={selectedInterviewers.includes(member.id)}
                                onChange={() => toggleInterviewer(member.id)}
                                className="rounded border-gray-300"
                              />
                              <label htmlFor={`interviewer-${member.id}`}>{member.name}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={resetForm}>Cancel</Button>
                      <Button onClick={handleScheduleInterview}>Schedule Interview</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" onClick={() => toast({ title: "Export Data", description: "Exporting interview data to CSV" })}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-recruit-info/30 p-2 rounded-full mb-3">
                <Calendar className="h-5 w-5 text-recruit-secondary" />
              </div>
              <div className="text-2xl font-bold">{interviewMetrics.total}</div>
              <p className="text-sm text-muted-foreground">Total Interviews</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-amber-100 p-2 rounded-full mb-3">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold">{interviewMetrics.scheduled}</div>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-2 rounded-full mb-3">
                <CheckSquare className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{interviewMetrics.completed}</div>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-2 rounded-full mb-3">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{interviewMetrics.successRate}%</div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CEO Overview - Candidate Status Summary */}
      {user?.role === 'ceo' && showDashboard && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Candidate Interview Status</CardTitle>
            <CardDescription>Overview of all candidates in the interview process</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Status Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Pending Interviews</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      {interviewMetrics.scheduled}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Interviews scheduled but not yet conducted</p>
                  <Progress
                    value={interviewMetrics.total > 0 ? (interviewMetrics.scheduled / interviewMetrics.total) * 100 : 0}
                    className="h-2 mt-2"
                  />
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Completed Interviews</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      {interviewMetrics.completed}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Interviews that have been completed with feedback</p>
                  <Progress
                    value={interviewMetrics.total > 0 ? (interviewMetrics.completed / interviewMetrics.total) * 100 : 0}
                    className="h-2 mt-2 bg-green-100"
                  />
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Successful Candidates</h3>
                    <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
                      {interviewMetrics.successfulInterviews}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Candidates with positive interview feedback</p>
                  <Progress
                    value={interviewMetrics.completed > 0 ? (interviewMetrics.successfulInterviews / interviewMetrics.completed) * 100 : 0}
                    className="h-2 mt-2 bg-purple-100"
                  />
                </div>
              </div>

              {/* Upcoming Interviews Table */}
              <div>
                <h3 className="font-medium mb-3">Upcoming Interviews (Next 7 Days)</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Interviewers</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInterviews
                      .filter(interview =>
                        interview.status === 'scheduled' &&
                        new Date(interview.date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                      )
                      .slice(0, 5)
                      .map(interview => (
                        <TableRow key={interview.id}>
                          <TableCell className="font-medium">{interview.candidate}</TableCell>
                          <TableCell>{interview.position}</TableCell>
                          <TableCell>{format(new Date(interview.date), 'MMM d, yyyy h:mm a')}</TableCell>
                          <TableCell>{interview.type}</TableCell>
                          <TableCell>{getLocationById(interview.locationId)?.name || '-'}</TableCell>
                          <TableCell>{interview.interviewers.join(', ')}</TableCell>
                        </TableRow>
                      ))}
                    {filteredInterviews.filter(interview =>
                      interview.status === 'scheduled' &&
                      new Date(interview.date).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                    ).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No upcoming interviews in the next 7 days
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Recent Interview Feedback */}
              <div>
                <h3 className="font-medium mb-3">Recent Interview Feedback</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredInterviews
                    .filter(interview => interview.status === 'completed' && interview.feedback)
                    .slice(0, 4)
                    .map(interview => (
                      <Card key={interview.id} className="overflow-hidden">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={interview.avatarUrl} alt={interview.candidate} />
                              <AvatarFallback>{interview.candidate.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{interview.candidate}</div>
                              <div className="text-xs text-muted-foreground">{interview.position}</div>
                            </div>
                          </div>
                          <div className="text-sm mt-2 line-clamp-3">
                            {interview.feedback}
                          </div>
                          <div className="flex justify-between items-center mt-3 pt-2 border-t text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{format(new Date(interview.date), 'MMM d, yyyy')}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {interview.type}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  {filteredInterviews.filter(interview => interview.status === 'completed' && interview.feedback).length === 0 && (
                    <div className="col-span-2 text-center py-8 text-muted-foreground bg-muted/20 rounded-lg">
                      No recent interview feedback available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Distribution Charts */}
      {showDashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribution by Type */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Distribution by Type</CardTitle>
              <CardDescription>Breakdown of interviews by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={Object.entries(interviewsByType).map(([type, count]) => ({
                      type: type.charAt(0).toUpperCase() + type.slice(1),
                      count
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={CHART_COLORS.primary} name="Interviews" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Distribution by Location */}
          <Card>
            <CardHeader>
              <CardTitle>Distribution by Location</CardTitle>
              <CardDescription>Interview count by office location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <Pie
                      data={Object.entries(interviewsByLocation).map(([locationId, count]) => ({
                        name: getLocationById(locationId)?.name || locationId,
                        value: count
                      }))}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill={CHART_COLORS.primary}
                      dataKey="value"
                      nameKey="name"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {Object.keys(interviewsByLocation).map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={[CHART_COLORS.primary, CHART_COLORS.secondary, CHART_COLORS.tertiary, CHART_COLORS.quaternary][index % 4]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Time-based Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Timeline</CardTitle>
              <CardDescription>Scheduled vs completed interviews over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', scheduled: 12, completed: 10 },
                      { month: 'Feb', scheduled: 15, completed: 12 },
                      { month: 'Mar', scheduled: 18, completed: 15 },
                      { month: 'Apr', scheduled: 20, completed: 18 },
                      { month: 'May', scheduled: 22, completed: 20 }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="scheduled"
                      stroke={CHART_COLORS.primary}
                      name="Scheduled"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke={CHART_COLORS.success}
                      name="Completed"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Source Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Source Analysis</CardTitle>
              <CardDescription>Interview distribution by source</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={Object.entries(interviewsBySource).map(([source, count]) => ({
                      source,
                      count
                    }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="source" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill={CHART_COLORS.secondary} name="Interviews" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!showDashboard && (
        <Card className="border-border/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Filters</CardTitle>
            <CardDescription>
              Filter interviews by candidate, status, location, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Main Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="relative sm:col-span-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="past">Past</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {mockLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2">
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Department" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {mockDepartments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="sm:col-span-2 flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-10 w-10">
                      <ArrowUpDown className="h-4 w-4" />
                      <span className="sr-only">Sort</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortOrder('date')}>
                      Sort by Date
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortOrder('name')}>
                      Sort by Name
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center gap-1 text-muted-foreground"
              >
                <Filter className="h-4 w-4" />
                {showAdvancedFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilter('all');
                    setLocationFilter('all');
                    setDepartmentFilter('all');
                    setSourceFilter('all');
                    setSelectedType('all');
                    setSearchTerm('');
                  }}
                  className="text-xs"
                >
                  Clear Filters
                </Button>
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
                  {filteredInterviews.length} interviews
                </Badge>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-md bg-muted/10">
                <div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Interview Type" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {interviewTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger>
                      <div className="flex items-center">
                        <Layers className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue placeholder="Source" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sources</SelectItem>
                      {sources.filter(s => s !== 'all').map((source) => (
                        <SelectItem key={source} value={source}>
                          {source}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!showDashboard && (
        <>
          {filteredInterviews.length === 0 ? (
            <Card className="py-16">
              <div className="text-center">
                <h3 className="font-medium text-lg mb-2">No interviews found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters to find interviews
                </p>
              </div>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Candidate</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInterviews.map(interview => (
                      <TableRow key={interview.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={interview.avatarUrl} alt={interview.candidate} />
                              <AvatarFallback>{interview.candidate.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div>{interview.candidate}</div>
                              <div className="text-xs text-muted-foreground">{interview.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{interview.position}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{format(new Date(interview.date), 'MMM d, yyyy')}</span>
                            <span className="text-xs text-muted-foreground">{format(new Date(interview.date), 'h:mm a')}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={interview.status === 'scheduled' ? 'outline' : 'secondary'}
                            className={interview.status === 'scheduled' ? 'bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200' : 'bg-green-50 text-green-700 hover:bg-green-50 border-green-200'}
                          >
                            {interview.status === 'scheduled' ? 'Scheduled' : 'Completed'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-slate-50 text-slate-700 hover:bg-slate-50 border-slate-200">
                            {interview.type.charAt(0).toUpperCase() + interview.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            <span>{getLocationById(interview.locationId)?.name || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span>{getDepartmentById(interview.departmentId)?.name || '-'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {interview.source && (
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200">
                              {interview.source}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {interview.status === 'scheduled' ? (
                            <Button size="sm" onClick={handleJoinInterview}>
                              <Video className="h-4 w-4 mr-2" />
                              Join
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleViewFeedback(interview.id)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Feedback
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Interview Feedback</DialogTitle>
            <DialogDescription>
              {selectedInterview && `Feedback for ${selectedInterview.candidate}'s ${selectedInterview.type} interview`}
            </DialogDescription>
          </DialogHeader>
          {selectedInterview && selectedInterview.feedback ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-700 mb-1">Interview Type</h3>
                  <p className="text-sm capitalize">{selectedInterview.type}</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-green-700 mb-1">Date Conducted</h3>
                  <p className="text-sm">{format(new Date(selectedInterview.date), 'PPP')}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b">
                  <h3 className="font-medium">Feedback Summary</h3>
                </div>
                <div className="p-4">
                  <p className="whitespace-pre-line">{selectedInterview.feedback}</p>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b">
                  <h3 className="font-medium">Interviewers</h3>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedInterview.interviewers.map((interviewer, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {interviewer}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rating">Overall Rating</Label>
                  <Select value={feedbackForm.rating} onValueChange={(value) => setFeedbackForm({...feedbackForm, rating: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {ratingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="strengths">Strengths</Label>
                  <Textarea
                    id="strengths"
                    placeholder="Candidate's strengths..."
                    value={feedbackForm.strengths}
                    onChange={(e) => setFeedbackForm({...feedbackForm, strengths: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weaknesses">Areas for Improvement</Label>
                  <Textarea
                    id="weaknesses"
                    placeholder="Areas where the candidate could improve..."
                    value={feedbackForm.weaknesses}
                    onChange={(e) => setFeedbackForm({...feedbackForm, weaknesses: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional observations or notes..."
                    value={feedbackForm.notes}
                    onChange={(e) => setFeedbackForm({...feedbackForm, notes: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recommendation">Recommendation</Label>
                  <Select value={feedbackForm.recommendation} onValueChange={(value) => setFeedbackForm({...feedbackForm, recommendation: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recommendation" />
                    </SelectTrigger>
                    <SelectContent>
                      {recommendationOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Technical Skills Assessment */}
                <div className="space-y-2 border-t pt-4 mt-2">
                  <Label>Technical Skills Assessment</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="technicalSkill" className="text-xs">Technical Knowledge</Label>
                      <Select defaultValue="3">
                        <SelectTrigger id="technicalSkill">
                          <SelectValue placeholder="Rate 1-5" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} - {num === 1 ? 'Poor' : num === 2 ? 'Below Average' : num === 3 ? 'Average' : num === 4 ? 'Good' : 'Excellent'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="problemSolving" className="text-xs">Problem Solving</Label>
                      <Select defaultValue="3">
                        <SelectTrigger id="problemSolving">
                          <SelectValue placeholder="Rate 1-5" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} - {num === 1 ? 'Poor' : num === 2 ? 'Below Average' : num === 3 ? 'Average' : num === 4 ? 'Good' : 'Excellent'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Soft Skills Assessment */}
                <div className="space-y-2">
                  <Label>Soft Skills Assessment</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label htmlFor="communication" className="text-xs">Communication</Label>
                      <Select defaultValue="3">
                        <SelectTrigger id="communication">
                          <SelectValue placeholder="Rate 1-5" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} - {num === 1 ? 'Poor' : num === 2 ? 'Below Average' : num === 3 ? 'Average' : num === 4 ? 'Good' : 'Excellent'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="teamwork" className="text-xs">Teamwork</Label>
                      <Select defaultValue="3">
                        <SelectTrigger id="teamwork">
                          <SelectValue placeholder="Rate 1-5" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} - {num === 1 ? 'Poor' : num === 2 ? 'Below Average' : num === 3 ? 'Average' : num === 4 ? 'Good' : 'Excellent'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>Close</Button>
            {selectedInterview && !selectedInterview.feedback && (
              <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewsPage;
