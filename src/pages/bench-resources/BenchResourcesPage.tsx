import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Users, UserCheck, ArrowUpDown, Clock,
  MapPin, Building2, ChevronDown, BarChart3, PieChart,
  Download, Mail, Phone, Calendar, FileText, User, Layers,
  Plus, Settings, Workflow, DollarSign
} from 'lucide-react';
import { useBenchResourcePermissions, WithMockPermission } from '@/hooks/useMockPermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Mock data for development
const mockBenchResources = [
  {
    id: '1',
    employee: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567',
      department: { id: '1', name: 'Engineering' },
      designation: { id: '1', name: 'Senior Developer' }
    },
    skillsSummary: 'React, Node.js, TypeScript, AWS, Docker',
    preferredRoles: ['Full Stack Developer', 'Frontend Developer'],
    locationFlexibility: 'remote',
    availabilityDate: '2024-02-15',
    lastRate: 85,
    desiredRate: 95,
    workAuthorization: 'US Citizen',
    status: 'available',
    autoEnrolled: true,
    enrollmentSource: 'auto_assignment_end',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    employee: {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 234-5678',
      department: { id: '2', name: 'Data Science' },
      designation: { id: '2', name: 'Data Scientist' }
    },
    skillsSummary: 'Python, Machine Learning, TensorFlow, SQL, Tableau',
    preferredRoles: ['Data Scientist', 'ML Engineer'],
    locationFlexibility: 'hybrid',
    availabilityDate: '2024-02-20',
    lastRate: 90,
    desiredRate: 100,
    workAuthorization: 'H1B',
    status: 'in_hotlist',
    autoEnrolled: false,
    enrollmentSource: 'manual',
    createdAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    employee: {
      id: '3',
      firstName: 'Mike',
      lastName: 'Johnson',
      email: 'mike.johnson@company.com',
      phone: '+1 (555) 345-6789',
      department: { id: '3', name: 'DevOps' },
      designation: { id: '3', name: 'DevOps Engineer' }
    },
    skillsSummary: 'AWS, Kubernetes, Docker, Terraform, Jenkins',
    preferredRoles: ['DevOps Engineer', 'Cloud Engineer'],
    locationFlexibility: 'onsite',
    availabilityDate: '2024-02-10',
    lastRate: 95,
    desiredRate: 105,
    workAuthorization: 'Green Card',
    status: 'submitted',
    autoEnrolled: true,
    enrollmentSource: 'auto_assignment_end',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '4',
    employee: {
      id: '4',
      firstName: 'Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@company.com',
      phone: '+1 (555) 456-7890',
      department: { id: '4', name: 'Design' },
      designation: { id: '4', name: 'UI/UX Designer' }
    },
    skillsSummary: 'Figma, Adobe XD, Sketch, Prototyping, User Research',
    preferredRoles: ['UI/UX Designer', 'Product Designer'],
    locationFlexibility: 'flexible',
    availabilityDate: '2024-02-25',
    lastRate: 75,
    desiredRate: 85,
    workAuthorization: 'US Citizen',
    status: 'interviewing',
    autoEnrolled: false,
    enrollmentSource: 'manual',
    createdAt: '2024-01-25T11:00:00Z'
  },
  {
    id: '5',
    employee: {
      id: '5',
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@company.com',
      phone: '+1 (555) 567-8901',
      department: { id: '1', name: 'Engineering' },
      designation: { id: '5', name: 'Backend Developer' }
    },
    skillsSummary: 'Java, Spring Boot, PostgreSQL, Redis, Microservices',
    preferredRoles: ['Backend Developer', 'Java Developer'],
    locationFlexibility: 'hybrid',
    availabilityDate: '2024-03-01',
    lastRate: 80,
    desiredRate: 90,
    workAuthorization: 'OPT',
    status: 'offered',
    autoEnrolled: true,
    enrollmentSource: 'auto_project_completion',
    createdAt: '2024-01-30T16:00:00Z'
  },
  {
    id: '6',
    employee: {
      id: '6',
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 678-9012',
      department: { id: '5', name: 'QA' },
      designation: { id: '6', name: 'QA Engineer' }
    },
    skillsSummary: 'Selenium, Cypress, Jest, API Testing, Automation',
    preferredRoles: ['QA Engineer', 'Test Automation Engineer'],
    locationFlexibility: 'remote',
    availabilityDate: '2024-02-18',
    lastRate: 70,
    desiredRate: 80,
    workAuthorization: 'US Citizen',
    status: 'available',
    autoEnrolled: false,
    enrollmentSource: 'manual',
    createdAt: '2024-01-18T13:00:00Z'
  }
];

const statusConfig = {
  available: { label: 'Available', color: 'bg-green-500', textColor: 'text-green-700' },
  in_hotlist: { label: 'In Hotlist', color: 'bg-blue-500', textColor: 'text-blue-700' },
  submitted: { label: 'Submitted', color: 'bg-yellow-500', textColor: 'text-yellow-700' },
  interviewing: { label: 'Interviewing', color: 'bg-purple-500', textColor: 'text-purple-700' },
  offered: { label: 'Offered', color: 'bg-orange-500', textColor: 'text-orange-700' },
  deployed: { label: 'Deployed', color: 'bg-gray-500', textColor: 'text-gray-700' }
};

const locationFlexibilityConfig = {
  remote: { label: 'Remote', icon: '🏠' },
  hybrid: { label: 'Hybrid', icon: '🏢' },
  onsite: { label: 'On-site', icon: '🏢' },
  flexible: { label: 'Flexible', icon: '🌍' }
};

const BenchResourcesPage = () => {
  const navigate = useNavigate();
  const permissions = useBenchResourcePermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [showWorkAuth, setShowWorkAuth] = useState(false);
  const [resources, setResources] = useState(mockBenchResources);

  // Filter resources based on search and filters
  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesSearch = searchTerm === '' || 
        resource.employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.skillsSummary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.preferredRoles.some(role => role.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || resource.status === statusFilter;
      const matchesLocation = locationFilter === 'all' || resource.locationFlexibility === locationFilter;
      
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [resources, searchTerm, statusFilter, locationFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = resources.length;
    const available = resources.filter(r => r.status === 'available').length;
    const inHotlist = resources.filter(r => r.status === 'in_hotlist').length;
    const submitted = resources.filter(r => r.status === 'submitted').length;
    const interviewing = resources.filter(r => r.status === 'interviewing').length;
    const autoEnrolled = resources.filter(r => r.autoEnrolled).length;
    
    return { total, available, inHotlist, submitted, interviewing, autoEnrolled };
  }, [resources]);

  const handleAddResource = () => {
    navigate('/bench-resources/add');
  };

  const handleViewPipeline = () => {
    navigate('/bench-resources/pipeline');
  };

  const handleSettings = () => {
    navigate('/bench-resources/settings');
  };

  const handleResourceClick = (resourceId: string) => {
    navigate(`/bench-resources/${resourceId}`);
  };

  const renderResourceCard = (resource: any) => {
    const status = statusConfig[resource.status as keyof typeof statusConfig];
    const location = locationFlexibilityConfig[resource.locationFlexibility as keyof typeof locationFlexibilityConfig];
    
    return (
      <Card key={resource.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleResourceClick(resource.id)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{resource.employee.firstName} {resource.employee.lastName}</CardTitle>
              <CardDescription>{resource.employee.designation?.name} • {resource.employee.department?.name}</CardDescription>
            </div>
            <Badge className={`${status.color} text-white`}>
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Skills</p>
            <p className="text-sm text-gray-600 line-clamp-2">{resource.skillsSummary}</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{location.icon} {location.label}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Available {new Date(resource.availabilityDate).toLocaleDateString()}</span>
            </div>
          </div>
          {resource.desiredRate && (
            <div className="flex items-center space-x-1 text-sm">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span>Desired: ${resource.desiredRate}/hr</span>
            </div>
          )}
          {showWorkAuth && permissions.canViewWorkAuth && resource.workAuthorization && (
            <div className="text-sm">
              <span className="font-medium">Work Auth:</span> {resource.workAuthorization}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full text-xs text-gray-500">
            <span>{resource.autoEnrolled ? 'Auto-enrolled' : 'Manual'}</span>
            <span>Added {new Date(resource.createdAt).toLocaleDateString()}</span>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bench Resources</h1>
          <p className="text-muted-foreground">
            Manage available resources and track their status through the pipeline
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {permissions.canManage && (
            <Button variant="outline" onClick={handleSettings}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          )}
          <Button variant="outline" onClick={handleViewPipeline}>
            <Workflow className="h-4 w-4 mr-2" />
            Pipeline View
          </Button>
          {permissions.canCreate && (
            <Button onClick={handleAddResource}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.available}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Hotlist</CardTitle>
            <Mail className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.inHotlist}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <FileText className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.submitted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interviewing</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.interviewing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Enrolled</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.autoEnrolled}</div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex-1 p-6">
        <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, skills, or roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="in_hotlist">In Hotlist</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="offered">Offered</SelectItem>
                <SelectItem value="deployed">Deployed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="onsite">On-site</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>
            {permissions.canViewWorkAuth && (
              <Button
                variant="outline"
                onClick={() => setShowWorkAuth(!showWorkAuth)}
                className={showWorkAuth ? 'bg-blue-50 border-blue-200' : ''}
              >
                {showWorkAuth ? 'Hide' : 'Show'} Work Auth
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Resources ({filteredResources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map(renderResourceCard)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Status</TableHead>
                  {showWorkAuth && permissions.canViewWorkAuth && <TableHead>Work Auth</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResources.map((resource) => {
                  const status = statusConfig[resource.status as keyof typeof statusConfig];
                  const location = locationFlexibilityConfig[resource.locationFlexibility as keyof typeof locationFlexibilityConfig];
                  
                  return (
                    <TableRow 
                      key={resource.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleResourceClick(resource.id)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{resource.employee.firstName} {resource.employee.lastName}</div>
                          <div className="text-sm text-gray-500">{resource.employee.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{resource.employee.designation?.name}</div>
                          <div className="text-sm text-gray-500">{resource.employee.department?.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate" title={resource.skillsSummary}>
                          {resource.skillsSummary}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span>{location.icon} {location.label}</span>
                      </TableCell>
                      <TableCell>
                        {new Date(resource.availabilityDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {resource.desiredRate ? `$${resource.desiredRate}/hr` : '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} text-white`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      {showWorkAuth && permissions.canViewWorkAuth && (
                        <TableCell>{resource.workAuthorization || '-'}</TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default BenchResourcesPage;
