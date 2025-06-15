
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Briefcase, UserCheck, ArrowUpDown, Clock,
  MapPin, Building2, Users, ChevronDown, BarChart3, PieChart,
  Download, Mail, Phone, Calendar, FileText, User, Layers
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CandidateCard, Candidate, CandidateStatus } from '@/components/ui/candidate-card';
import { mockLocations, mockDepartments, getLocationById, getDepartmentById } from '@/types/organization';
import { useAuth } from '@/context/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from '@/hooks/use-toast';

// Mock candidates data with location and department information
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jordan Lee',
    position: 'Senior Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    status: 'screening',
    matchScore: 92,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    appliedDate: '2023-06-15',
    lastContactDate: '2023-06-20',
    source: 'LinkedIn',
    assignedTo: 'user-11', // Sarah Chen
    email: 'jordan.lee@example.com',
    phone: '(305) 555-1234',
    notes: 'Strong technical background with leadership experience.'
  },
  {
    id: '2',
    name: 'Taylor Smith',
    position: 'Frontend Developer',
    skills: ['React', 'CSS', 'JavaScript'],
    status: 'interview',
    matchScore: 87,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    appliedDate: '2023-06-10',
    lastContactDate: '2023-06-18',
    source: 'Indeed',
    assignedTo: 'user-20', // Jordan Lee
    email: 'taylor.smith@example.com',
    phone: '(305) 555-2345',
    notes: 'Great portfolio with modern UI designs.'
  },
  {
    id: '3',
    name: 'Morgan Chen',
    position: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    status: 'offer',
    matchScore: 95,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-2', // New York Office
    departmentId: 'dept-3', // Marketing (Recruitment)
    appliedDate: '2023-06-05',
    lastContactDate: '2023-06-22',
    source: 'Referral',
    assignedTo: 'user-22', // Alex Morgan
    email: 'morgan.chen@example.com',
    phone: '(212) 555-3456',
    notes: 'PhD in Computer Science with published research papers.'
  },
  {
    id: '4',
    name: 'Jesse Patel',
    position: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    status: 'hired',
    matchScore: 89,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-2', // New York Office
    departmentId: 'dept-4', // Sales
    appliedDate: '2023-05-20',
    lastContactDate: '2023-06-15',
    source: 'Company Website',
    assignedTo: 'user-23', // Riley Johnson
    email: 'jesse.patel@example.com',
    phone: '(212) 555-4567',
    notes: 'Extensive experience with cloud infrastructure and automation.'
  },
  {
    id: '5',
    name: 'Casey Wilson',
    position: 'UX Designer',
    skills: ['Figma', 'User Research', 'UI Design'],
    status: 'screening',
    matchScore: 83,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-3', // San Francisco Branch
    departmentId: 'dept-5', // Marketing (Recruitment)
    appliedDate: '2023-06-18',
    lastContactDate: '2023-06-21',
    source: 'Dribbble',
    assignedTo: 'user-24', // Morgan Chen
    email: 'casey.wilson@example.com',
    phone: '(415) 555-5678',
    notes: 'Creative portfolio with focus on user-centered design.'
  },
  {
    id: '6',
    name: 'Robin Taylor',
    position: 'Product Manager',
    skills: ['Agile', 'Roadmapping', 'User Stories'],
    status: 'interview',
    matchScore: 91,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-3', // San Francisco Branch
    departmentId: 'dept-6', // Sales
    appliedDate: '2023-06-08',
    lastContactDate: '2023-06-19',
    source: 'LinkedIn',
    assignedTo: 'user-25', // Jordan Taylor
    email: 'robin.taylor@example.com',
    phone: '(415) 555-6789',
    notes: 'Strong background in product development and team leadership.'
  },
  {
    id: '7',
    name: 'Alex Johnson',
    position: 'Backend Developer',
    skills: ['Java', 'Spring', 'Microservices'],
    status: 'rejected',
    matchScore: 72,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-4', // Chicago Office
    departmentId: 'dept-7', // Marketing (Recruitment)
    appliedDate: '2023-06-12',
    lastContactDate: '2023-06-17',
    source: 'Indeed',
    assignedTo: 'user-26', // Taylor Reed
    email: 'alex.johnson@example.com',
    phone: '(312) 555-7890',
    notes: 'Good technical skills but not enough experience for the role.'
  },
  {
    id: '8',
    name: 'Jamie Garcia',
    position: 'Mobile Developer',
    skills: ['Swift', 'React Native', 'Kotlin'],
    status: 'offer',
    matchScore: 88,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-4', // Chicago Office
    departmentId: 'dept-8', // Sales
    appliedDate: '2023-06-01',
    lastContactDate: '2023-06-20',
    source: 'Referral',
    assignedTo: 'user-27', // Drew Garcia
    email: 'jamie.garcia@example.com',
    phone: '(312) 555-8901',
    notes: 'Excellent mobile development skills with cross-platform experience.'
  },
  {
    id: '9',
    name: 'Riley Martinez',
    position: 'Marketing Specialist',
    skills: ['Social Media', 'Content Creation', 'SEO'],
    status: 'screening',
    matchScore: 85,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-1', // Miami Headquarters
    departmentId: 'dept-1', // Marketing (Recruitment)
    appliedDate: '2023-06-19',
    lastContactDate: '2023-06-22',
    source: 'Company Website',
    assignedTo: 'user-11', // Sarah Chen
    email: 'riley.martinez@example.com',
    phone: '(305) 555-9012',
    notes: 'Strong background in digital marketing and content strategy.'
  },
  {
    id: '10',
    name: 'Avery Williams',
    position: 'Sales Representative',
    skills: ['Negotiation', 'CRM', 'Client Relations'],
    status: 'interview',
    matchScore: 90,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-2', // New York Office
    departmentId: 'dept-4', // Sales
    appliedDate: '2023-06-07',
    lastContactDate: '2023-06-21',
    source: 'LinkedIn',
    assignedTo: 'user-23', // Riley Johnson
    email: 'avery.williams@example.com',
    phone: '(212) 555-0123',
    notes: 'Proven track record in sales with excellent communication skills.'
  },
  {
    id: '11',
    name: 'Cameron Davis',
    position: 'HR Specialist',
    skills: ['Recruitment', 'Employee Relations', 'HRIS'],
    status: 'hired',
    matchScore: 93,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-3', // San Francisco Branch
    departmentId: 'dept-5', // Marketing (Recruitment)
    appliedDate: '2023-05-25',
    lastContactDate: '2023-06-15',
    source: 'Indeed',
    assignedTo: 'user-24', // Morgan Chen
    email: 'cameron.davis@example.com',
    phone: '(415) 555-1234',
    notes: 'Extensive experience in HR and talent acquisition.'
  },
  {
    id: '12',
    name: 'Jordan Rivera',
    position: 'Account Manager',
    skills: ['Client Management', 'Sales', 'Relationship Building'],
    status: 'screening',
    matchScore: 82,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    locationId: 'loc-4', // Chicago Office
    departmentId: 'dept-8', // Sales
    appliedDate: '2023-06-20',
    lastContactDate: '2023-06-22',
    source: 'Referral',
    assignedTo: 'user-27', // Drew Garcia
    email: 'jordan.rivera@example.com',
    phone: '(312) 555-2345',
    notes: 'Strong background in account management and client relations.'
  }
];

// Track time in pipeline for each candidate
const candidateTimes: Record<string, string> = {
  '1': '5 days',
  '2': '12 days',
  '3': '18 days',
  '4': '21 days',
  '5': '3 days',
  '6': '14 days',
  '7': '8 days',
  '8': '16 days'
};

// Candidate profiles are separate from employee profiles
// This was a misunderstanding - candidates are job applicants, not company employees

const CandidatesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [positionFilter, setPositionFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'name' | 'date'>('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);

  // Filter candidates based on user role
  const roleFilteredCandidates = useMemo(() => {
    if (!user) return mockCandidates;

    // CEO can see all candidates
    if (user.role === 'ceo') {
      return mockCandidates;
    }

    // Branch Manager can only see candidates from their location
    if (user.role === 'branch-manager' && user.locationId) {
      return mockCandidates.filter(candidate => candidate.locationId === user.locationId);
    }

    // Department roles can only see candidates from their department and location
    if (['marketing-head', 'marketing-supervisor', 'marketing-recruiter', 'marketing-associate'].includes(user.role)) {
      let filteredCandidates = mockCandidates;

      // Filter by department if available
      if (user.departmentId) {
        filteredCandidates = filteredCandidates.filter(candidate => candidate.departmentId === user.departmentId);
      }

      // Filter by location if available
      if (user.locationId) {
        filteredCandidates = filteredCandidates.filter(candidate => candidate.locationId === user.locationId);
      }

      return filteredCandidates;
    }

    return mockCandidates;
  }, [user]);

  // Compute metrics and filters
  const candidatesByLocation = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredCandidates.forEach(candidate => {
      if (candidate.locationId) {
        result[candidate.locationId] = (result[candidate.locationId] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredCandidates]);

  const candidatesByDepartment = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredCandidates.forEach(candidate => {
      if (candidate.departmentId) {
        result[candidate.departmentId] = (result[candidate.departmentId] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredCandidates]);

  const candidatesBySource = useMemo(() => {
    const result: Record<string, number> = {};
    roleFilteredCandidates.forEach(candidate => {
      if (candidate.source) {
        result[candidate.source] = (result[candidate.source] || 0) + 1;
      }
    });
    return result;
  }, [roleFilteredCandidates]);

  // Filter and sort candidates
  const filteredCandidates = roleFilteredCandidates
    .filter(candidate => {
      // Filter by search term
      if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by status
      if (statusFilter !== 'all' && candidate.status !== statusFilter) {
        return false;
      }

      // Filter by position
      if (positionFilter !== 'all' && candidate.position !== positionFilter) {
        return false;
      }

      // Filter by location
      if (locationFilter !== 'all' && candidate.locationId !== locationFilter) {
        return false;
      }

      // Filter by department
      if (departmentFilter !== 'all' && candidate.departmentId !== departmentFilter) {
        return false;
      }

      // Filter by source
      if (sourceFilter !== 'all' && candidate.source !== sourceFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by name (ascending)
      if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      }

      // Sort by applied date (newest first)
      if (sortOrder === 'date' && a.appliedDate && b.appliedDate) {
        return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime();
      }

      return 0;
    });

  // Get unique values for filters
  const positions = ['all', ...new Set(roleFilteredCandidates.map(c => c.position))];
  const sources = ['all', ...new Set(roleFilteredCandidates.filter(c => c.source).map(c => c.source as string))];

  // Calculate metrics for dashboard
  const totalCandidates = roleFilteredCandidates.length;
  const candidatesByStatus = {
    screening: roleFilteredCandidates.filter(c => c.status === 'screening').length,
    interview: roleFilteredCandidates.filter(c => c.status === 'interview').length,
    offer: roleFilteredCandidates.filter(c => c.status === 'offer').length,
    hired: roleFilteredCandidates.filter(c => c.status === 'hired').length,
    rejected: roleFilteredCandidates.filter(c => c.status === 'rejected').length,
  };

  // Handle actions
  const handleViewCandidate = (id: string) => {
    navigate(`/candidates/${id}`);
  };

  const handleCandidateAction = (id: string) => {
    const candidate = mockCandidates.find(c => c.id === id);

    if (!candidate) return;

    const actionText = candidate.status === 'screening' ? 'Schedule Interview' :
                       candidate.status === 'interview' ? 'Send Offer' :
                       candidate.status === 'offer' ? 'Mark as Hired' : 'Next Step';

    toast({
      title: actionText,
      description: `Moving ${candidate.name} to the next step`,
    });
  };

  const statusOptions: { value: string; label: string }[] = [
    { value: 'all', label: 'All Statuses' },
    { value: 'screening', label: 'Screening' },
    { value: 'interview', label: 'Interview' },
    { value: 'offer', label: 'Offer' },
    { value: 'hired', label: 'Hired' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Candidates</h1>
          <p className="text-muted-foreground mt-2">
            Manage, track, and evaluate candidates throughout the hiring process
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
            <span className="hidden sm:inline">Candidates</span>
          </Button>
          <Button variant="outline" onClick={() => toast({ title: "Export Data", description: "Exporting candidate data to CSV" })}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-recruit-info/30 p-2 rounded-full mb-3">
                <UserCheck className="h-5 w-5 text-recruit-secondary" />
              </div>
              <div className="text-2xl font-bold">{totalCandidates}</div>
              <p className="text-sm text-muted-foreground">Total Candidates</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-amber-100 p-2 rounded-full mb-3">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="text-2xl font-bold">{candidatesByStatus.screening}</div>
              <p className="text-sm text-muted-foreground">In Screening</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-2 rounded-full mb-3">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold">{candidatesByStatus.interview}</div>
              <p className="text-sm text-muted-foreground">In Interview</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 p-2 rounded-full mb-3">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{candidatesByStatus.offer}</div>
              <p className="text-sm text-muted-foreground">Offer Extended</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-2 rounded-full mb-3">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{candidatesByStatus.hired}</div>
              <p className="text-sm text-muted-foreground">Hired</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Dashboard */}
      {showDashboard && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                Candidates by Location
              </CardTitle>
              <CardDescription>
                Distribution of candidates across different office locations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLocations.map(location => {
                  const count = candidatesByLocation[location.id] || 0;
                  const percentage = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;

                  return (
                    <div key={location.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{location.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{count}</span>
                          <span className="text-muted-foreground ml-1">({percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{location.city}, {location.state}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setLocationFilter('all')}>
                View All Locations
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast({ title: "Export", description: "Exporting location data" })}>
                <Download className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Department Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                Candidates by Department
              </CardTitle>
              <CardDescription>
                Distribution of candidates across different departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockDepartments.map(department => {
                  const count = candidatesByDepartment[department.id] || 0;
                  const percentage = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;
                  const location = mockLocations.find(loc => loc.id === department.locationId);

                  return (
                    <div key={department.id} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-sm">{department.name}</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{count}</span>
                          <span className="text-muted-foreground ml-1">({percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>{location?.name}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setDepartmentFilter('all')}>
                View All Departments
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast({ title: "Export", description: "Exporting department data" })}>
                <Download className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Source Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Layers className="h-5 w-5 text-muted-foreground" />
                Candidates by Source
              </CardTitle>
              <CardDescription>
                Distribution of candidates by recruitment source
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(candidatesBySource).map(([source, count]) => {
                  const percentage = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;

                  return (
                    <div key={source} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="h-5 px-2">
                            {source}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{count}</span>
                          <span className="text-muted-foreground ml-1">({percentage}%)</span>
                        </div>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setSourceFilter('all')}>
                View All Sources
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast({ title: "Export", description: "Exporting source data" })}>
                <Download className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <PieChart className="h-5 w-5 text-muted-foreground" />
                Candidates by Status
              </CardTitle>
              <CardDescription>
                Distribution of candidates across hiring pipeline stages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(candidatesByStatus).map(([status, count]) => {
                  const percentage = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;
                  const statusColors: Record<string, string> = {
                    screening: 'bg-amber-100',
                    interview: 'bg-blue-100',
                    offer: 'bg-purple-100',
                    hired: 'bg-green-100',
                    rejected: 'bg-red-100'
                  };
                  const statusTextColors: Record<string, string> = {
                    screening: 'text-amber-800',
                    interview: 'text-blue-800',
                    offer: 'text-purple-800',
                    hired: 'text-green-800',
                    rejected: 'text-red-800'
                  };

                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge className={`${statusColors[status]} ${statusTextColors[status]}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{count}</span>
                          <span className="text-muted-foreground ml-1">({percentage}%)</span>
                        </div>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2"
                        indicatorClassName={statusColors[status]}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline" size="sm" onClick={() => setStatusFilter('all')}>
                View All Statuses
              </Button>
              <Button variant="ghost" size="sm" onClick={() => toast({ title: "Export", description: "Exporting status data" })}>
                <Download className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="space-y-4">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
                <Button variant="outline" size="icon">
                  <ArrowUpDown className="h-4 w-4" />
                  <span className="sr-only">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOrder('date')}>
                  Sort by Applied Date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOrder('name')}>
                  Sort by Name
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              className="px-2"
            >
              <i className="grid text-xs font-bold">⊞</i>
            </Button>

            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              className="px-2"
            >
              <i className="list text-xs font-bold">≡</i>
            </Button>
          </div>
        </div>

        {/* Advanced Filters */}
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
                setStatusFilter('all');
                setPositionFilter('all');
                setLocationFilter('all');
                setDepartmentFilter('all');
                setSourceFilter('all');
                setSearchTerm('');
              }}
              className="text-xs"
            >
              Clear Filters
            </Button>

            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none">
              {filteredCandidates.length} candidates
            </Badge>
          </div>
        </div>

        {showAdvancedFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/10">
            <div>
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Position" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {positions.filter(p => p !== 'all').map((position) => (
                    <SelectItem key={position} value={position}>
                      {position}
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

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => toast({
                  title: "Save Filter",
                  description: "Current filter configuration saved"
                })}
              >
                Save Filter
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => toast({
                  title: "Export Filtered Results",
                  description: "Exporting filtered candidates to CSV"
                })}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Candidates Display */}
      {filteredCandidates.length === 0 ? (
        <Card className="py-16">
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">No candidates found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find candidates
            </p>
          </div>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onView={handleViewCandidate}
              onAction={handleCandidateAction}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium">Candidate</th>
                    <th className="text-left py-3 px-4 font-medium">Position</th>
                    <th className="text-left py-3 px-4 font-medium">Skills</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Location</th>
                    <th className="text-left py-3 px-4 font-medium">Department</th>
                    <th className="text-left py-3 px-4 font-medium">Time in Pipeline</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCandidates.map((candidate) => (
                    <tr key={candidate.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img
                              src={candidate.avatar}
                              alt={candidate.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{candidate.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{candidate.position}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.slice(0, 2).map((skill) => (
                            <Badge key={skill} variant="outline" className="bg-accent/50">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.skills.length > 2 && (
                            <Badge variant="outline" className="bg-accent/50">
                              +{candidate.skills.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={
                          candidate.status === 'screening' ? 'bg-amber-100 text-amber-800' :
                          candidate.status === 'interview' ? 'bg-blue-100 text-blue-800' :
                          candidate.status === 'offer' ? 'bg-purple-100 text-purple-800' :
                          candidate.status === 'hired' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        {candidate.locationId ? (
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{getLocationById(candidate.locationId)?.name || 'Unknown'}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {candidate.departmentId ? (
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{getDepartmentById(candidate.departmentId)?.name || 'Unknown'}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Not specified</span>
                        )}
                      </td>
                      {/* Match score column removed as it should only appear when matching candidates to specific job descriptions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          {candidateTimes[candidate.id]}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Quick View",
                                description: `Showing summary for ${candidate.name}`,
                              });
                            }}
                          >
                            Quick View
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleViewCandidate(candidate.id)}
                          >
                            View Details
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
      )}
    </div>
  );
};

export default CandidatesPage;
