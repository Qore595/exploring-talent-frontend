
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Filter, MoreHorizontal, Mail, Phone, Briefcase, Calendar, MapPin, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { isAdmin, isBranchManagerOrHigher } from '@/utils/adminPermissions';
import { mockUsers } from '@/types/users';
import { mockLocations, mockDepartments } from '@/types/organization';

// Helper function to get stats for a user
const getUserStats = (userId: string) => {
  // In a real app, this would be fetched from an API
  return {
    openRequisitions: Math.floor(Math.random() * 10) + 1,
    activeCandidates: Math.floor(Math.random() * 30) + 5,
    totalHires: Math.floor(Math.random() * 20)
  };
};

const ProfilesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const managerOrHigher = isBranchManagerOrHigher(user?.role);

  const [employees, setEmployees] = useState(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showAddProfileDialog, setShowAddProfileDialog] = useState(false);
  const [newProfile, setNewProfile] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'marketing-associate',
    department: '',
    location: '',
  });
  const [activeTab, setActiveTab] = useState('grid');

  const handleViewProfile = (profileId: string) => {
    navigate(`/profiles/${profileId}`);
  };

  // Filter employees based on user's role and selected filters
  const filteredEmployees = employees.filter(employee => {
    // CEO can see all employees
    // Branch managers can only see employees in their location
    if (!adminUser && user?.locationId && employee.locationId !== user.locationId) {
      return false;
    }

    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.department || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.location || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'all' ||
      employee.role.toLowerCase() === roleFilter.toLowerCase();

    // For department filtering, we need to match by name since we're showing unique department names
    const matchesDepartment =
      departmentFilter === 'all' ||
      (employee.department && departments.find(d => d.id === departmentFilter)?.name === employee.department);

    const matchesLocation =
      locationFilter === 'all' ||
      (employee.locationId && locationFilter === employee.locationId);

    return matchesSearch && matchesRole && matchesDepartment && matchesLocation;
  });

  // Get unique departments, roles, and locations for filters
  // Group departments by name to avoid duplicates in the filter
  const uniqueDepartments = Array.from(
    new Map(mockDepartments.map(dept => [dept.name, dept])).values()
  );
  const departments = uniqueDepartments;
  const locations = mockLocations;
  const roles = Array.from(new Set(employees.map(e => e.role)));

  const handleAddProfile = () => {
    if (!newProfile.name.trim() || !newProfile.email.trim() || !newProfile.department.trim() || !newProfile.location.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Split the name into first and last name
    const nameParts = newProfile.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // Find the department and location IDs
    const departmentObj = departments.find(d => d.name === newProfile.department);
    const locationObj = locations.find(l => l.name === newProfile.location);

    const newEmployee = {
      id: `user-${Date.now()}`,
      name: newProfile.name,
      email: newProfile.email,
      role: newProfile.role,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      phone: newProfile.phone || '(555) 000-0000',
      department: newProfile.department,
      departmentId: departmentObj?.id || '',
      location: newProfile.location,
      locationId: locationObj?.id || '',
      position: newProfile.role === 'marketing-recruiter' ? 'Marketing Recruiter' :
                newProfile.role === 'marketing-associate' ? 'Marketing Associate' :
                newProfile.role === 'marketing-supervisor' ? 'Marketing Supervisor' :
                newProfile.role === 'marketing-head' ? 'Marketing Head' :
                newProfile.role === 'branch-manager' ? 'Branch Manager' : 'Employee',
      skills: [],
      hireDate: new Date().toISOString(),
      status: 'active' as const
    };

    setEmployees([...employees, newEmployee]);
    setNewProfile({
      name: '',
      email: '',
      phone: '',
      role: 'marketing-associate',
      department: '',
      location: '',
    });
    setShowAddProfileDialog(false);

    toast({
      title: "Employee Added",
      description: `${newProfile.name} has been added successfully.`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <p className="text-muted-foreground mt-2">
            {adminUser
              ? "Manage all employees across all locations"
              : managerOrHigher
                ? "Manage employees in your location"
                : "View employees in your location"}
          </p>
        </div>

        <Dialog open={showAddProfileDialog} onOpenChange={setShowAddProfileDialog}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Add a new employee to your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newProfile.name}
                  onChange={(e) => setNewProfile({ ...newProfile, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newProfile.email}
                  onChange={(e) => setNewProfile({ ...newProfile, email: e.target.value })}
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  value={newProfile.phone}
                  onChange={(e) => setNewProfile({ ...newProfile, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newProfile.role}
                  onValueChange={(value: string) =>
                    setNewProfile({ ...newProfile, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {adminUser && <SelectItem value="ceo">CEO</SelectItem>}
                    {adminUser && <SelectItem value="branch-manager">Branch Manager</SelectItem>}
                    {(adminUser || managerOrHigher) && <SelectItem value="marketing-head">Marketing Head</SelectItem>}
                    {(adminUser || managerOrHigher) && <SelectItem value="marketing-supervisor">Marketing Supervisor</SelectItem>}
                    <SelectItem value="marketing-recruiter">Marketing Recruiter</SelectItem>
                    <SelectItem value="marketing-associate">Marketing Associate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={newProfile.department}
                  onValueChange={(value: string) =>
                    setNewProfile({ ...newProfile, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Marketing (Recruitment)">Marketing (Recruitment)</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={newProfile.location}
                  onValueChange={(value: string) =>
                    setNewProfile({ ...newProfile, location: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddProfileDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProfile}>
                Add Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <div className="w-[180px]">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <span>Role</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="ceo">CEO</SelectItem>
                <SelectItem value="branch-manager">Branch Manager</SelectItem>
                <SelectItem value="marketing-head">Marketing Head</SelectItem>
                <SelectItem value="marketing-supervisor">Marketing Supervisor</SelectItem>
                <SelectItem value="marketing-recruiter">Marketing Recruiter</SelectItem>
                <SelectItem value="marketing-associate">Marketing Associate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[180px]">
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4" />
                  <span>Department</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {/* Only show Marketing (Recruitment) and Sales departments */}
                <SelectItem value={departments.find(d => d.name === 'Marketing (Recruitment)')?.id || ''}>
                  Marketing (Recruitment)
                </SelectItem>
                <SelectItem value={departments.find(d => d.name === 'Sales')?.id || ''}>
                  Sales
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {adminUser && (
            <div className="w-[180px]">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>Location</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(loc => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="grid" className="px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {activeTab === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => {
              const stats = getUserStats(employee.id);
              return (
                <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{employee.name}</CardTitle>
                        <CardDescription>{employee.position || employee.role}</CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleViewProfile(employee.id)}>
                          View Profile
                        </DropdownMenuItem>
                        {(adminUser || managerOrHigher) && (
                          <DropdownMenuItem onClick={() =>
                            toast({
                              title: "Edit Profile",
                              description: `Editing profile for ${employee.name}`,
                            })
                          }>
                            Edit Profile
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() =>
                          toast({
                            title: "Email Sent",
                            description: `Email drafted to ${employee.name}`,
                          })
                        }>
                          Send Email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{employee.email}</span>
                        </div>
                        {employee.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.phone}</span>
                          </div>
                        )}
                        {employee.department && (
                          <div className="flex items-center text-sm">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.department}</span>
                          </div>
                        )}
                        {employee.location && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.location}</span>
                          </div>
                        )}
                        {employee.hireDate && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>Joined {new Date(employee.hireDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      {employee.skills && employee.skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Skills & Expertise</h4>
                          <div className="flex flex-wrap gap-2">
                            {employee.skills.map((skill, i) => (
                              <Badge key={i} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {(employee.role === 'marketing-recruiter' || employee.role === 'marketing-supervisor' ||
                        employee.role === 'marketing-head' || employee.role === 'branch-manager' ||
                        employee.role === 'ceo') && (
                        <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="text-center p-2 bg-muted rounded-md">
                            <p className="text-xs text-muted-foreground">Requisitions</p>
                            <p className="font-medium">{stats.openRequisitions}</p>
                          </div>
                          <div className="text-center p-2 bg-muted rounded-md">
                            <p className="text-xs text-muted-foreground">Candidates</p>
                            <p className="font-medium">{stats.activeCandidates}</p>
                          </div>
                          <div className="text-center p-2 bg-muted rounded-md">
                            <p className="text-xs text-muted-foreground">Hires</p>
                            <p className="font-medium">{stats.totalHires}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-muted-foreground">No employees found matching your filters.</p>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border">
              <div className="grid grid-cols-7 p-4 text-sm font-medium border-b bg-muted/50">
                <div className="col-span-2">Name</div>
                <div className="col-span-1">Role</div>
                <div className="col-span-1">Department</div>
                <div className="col-span-1">Location</div>
                <div className="col-span-1">Hire Date</div>
                <div className="col-span-1">Actions</div>
              </div>
              <div className="divide-y">
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <div key={employee.id} className="grid grid-cols-7 items-center p-4 text-sm">
                      <div className="col-span-2 flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={employee.avatar} alt={employee.name} />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                      <div className="col-span-1">{employee.position || employee.role}</div>
                      <div className="col-span-1">{employee.department || '-'}</div>
                      <div className="col-span-1">{employee.location || '-'}</div>
                      <div className="col-span-1">{employee.hireDate ? new Date(employee.hireDate).toLocaleDateString() : '-'}</div>
                      <div className="col-span-1 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProfile(employee.id)}
                        >
                          View
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(adminUser || managerOrHigher) && (
                              <DropdownMenuItem onClick={() =>
                                toast({
                                  title: "Edit Profile",
                                  description: `Editing profile for ${employee.name}`,
                                })
                              }>
                                Edit Profile
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() =>
                              toast({
                                title: "Email Sent",
                                description: `Email drafted to ${employee.name}`,
                              })
                            }>
                              Send Email
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No employees found matching your filters.</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilesPage;
