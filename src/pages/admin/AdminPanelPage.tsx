import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Users,
  Building2,
  Settings,
  FileText,
  Upload,
  ClipboardCheck,
  FileSearch,
  Calendar,
  PieChart,
  UserPlus,
  Lock,
  Database,
  Workflow,
  Mic,
  CreditCard,
  BarChart3,
  Bell,
  Activity,
  AlertTriangle,
  Search,
  Download,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Info
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { isAdmin, isBranchManagerOrHigher, isMarketingHeadOrHigher, isMarketingSupervisorOrHigher } from "@/utils/adminPermissions";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { StatsCard } from "@/components/ui/stats-card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AreaChart,
  BarChart,
  LineChart,
  PieChart as RechartsPieChart,
  Area,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Mock data for user activity logs
const mockActivityLogs = [
  { id: 1, user: "Sarah Chen", action: "User created", target: "Jordan Lee", timestamp: "2025-04-15 09:23:45", ip: "192.168.1.45" },
  { id: 2, user: "Michael Thompson", action: "Role changed", target: "Taylor Smith", timestamp: "2025-04-15 10:12:33", ip: "192.168.1.22" },
  { id: 3, user: "Emma Rodriguez", action: "Password reset", target: "Alex Johnson", timestamp: "2025-04-14 16:45:12", ip: "192.168.1.87" },
  { id: 4, user: "David Kim", action: "Department assigned", target: "Casey Wilson", timestamp: "2025-04-14 14:22:56", ip: "192.168.1.33" },
  { id: 5, user: "Jordan Lee", action: "Login", target: "Self", timestamp: "2025-04-14 09:01:23", ip: "192.168.1.45" },
  { id: 6, user: "Sarah Chen", action: "System setting changed", target: "Email Configuration", timestamp: "2025-04-13 11:34:21", ip: "192.168.1.45" },
  { id: 7, user: "Michael Thompson", action: "Location created", target: "Chicago Office", timestamp: "2025-04-13 10:15:43", ip: "192.168.1.22" },
  { id: 8, user: "Emma Rodriguez", action: "User deactivated", target: "Former Employee", timestamp: "2025-04-12 15:22:11", ip: "192.168.1.87" },
  { id: 9, user: "David Kim", action: "Bulk import", target: "15 users", timestamp: "2025-04-12 14:05:32", ip: "192.168.1.33" },
  { id: 10, user: "Sarah Chen", action: "Integration configured", target: "TalentPulse API", timestamp: "2025-04-11 16:45:22", ip: "192.168.1.45" },
];

// Mock data for system health
const mockSystemHealth = [
  { id: 1, component: "Database", status: "Healthy", uptime: "99.98%", lastIssue: "None" },
  { id: 2, component: "API Server", status: "Healthy", uptime: "99.95%", lastIssue: "2025-04-10 02:15:22" },
  { id: 3, component: "Web Server", status: "Healthy", uptime: "99.99%", lastIssue: "None" },
  { id: 4, component: "TalentPulse Integration", status: "Degraded", uptime: "98.75%", lastIssue: "2025-04-15 07:22:45" },
  { id: 5, component: "Email Service", status: "Healthy", uptime: "99.92%", lastIssue: "2025-04-12 14:33:21" },
];

// Mock data for users
const mockUsers = [
  { id: 1, name: "Jordan Lee", email: "jordan.lee@example.com", role: "Marketing Recruiter", department: "Marketing (Recruitment)", location: "Miami", status: "Active", lastLogin: "2025-04-15 09:23:45" },
  { id: 2, name: "Taylor Smith", email: "taylor.smith@example.com", role: "Marketing Associate", department: "Marketing (Recruitment)", location: "New York", status: "Active", lastLogin: "2025-04-15 08:12:33" },
  { id: 3, name: "Alex Johnson", email: "alex.johnson@example.com", role: "Marketing Supervisor", department: "Marketing (Recruitment)", location: "Chicago", status: "Active", lastLogin: "2025-04-14 16:45:12" },
  { id: 4, name: "Casey Wilson", email: "casey.wilson@example.com", role: "Marketing Head", department: "Marketing (Recruitment)", location: "San Francisco", status: "Active", lastLogin: "2025-04-14 14:22:56" },
  { id: 5, name: "Riley Johnson", email: "riley.johnson@example.com", role: "Branch Manager", department: "Management", location: "Miami", status: "Active", lastLogin: "2025-04-14 09:01:23" },
  { id: 6, name: "Morgan Chen", email: "morgan.chen@example.com", role: "Marketing Recruiter", department: "Marketing (Recruitment)", location: "Chicago", status: "Inactive", lastLogin: "2025-04-10 11:34:21" },
  { id: 7, name: "Drew Garcia", email: "drew.garcia@example.com", role: "Marketing Associate", department: "Sales", location: "New York", status: "Active", lastLogin: "2025-04-13 10:15:43" },
  { id: 8, name: "Jamie Rivera", email: "jamie.rivera@example.com", role: "Marketing Recruiter", department: "Marketing (Recruitment)", location: "San Francisco", status: "Active", lastLogin: "2025-04-12 15:22:11" },
];

const AdminPanelPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Role-based access control
  const adminUser = isAdmin(user?.role);
  const managerOrHigher = isBranchManagerOrHigher(user?.role);
  const marketingHeadOrHigher = isMarketingHeadOrHigher(user?.role);
  const supervisorOrHigher = isMarketingSupervisorOrHigher(user?.role);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // State for filtering and sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtered and paginated data
  const filteredLogs = mockActivityLogs.filter(log => {
    if (searchTerm && !log.action.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.user.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !log.target.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortField === "timestamp") {
      return sortDirection === "asc"
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    }
    return 0;
  });

  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  // Filtered and paginated users
  const filteredUsers = mockUsers.filter(user => {
    if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !user.role.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    if (statusFilter !== "all" && user.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false;
    }

    return true;
  });

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Import mock data from types
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [departmentData, setDepartmentData] = useState<any[]>([]);

  // State for employee management
  const [showAddEmployeeDialog, setShowAddEmployeeDialog] = useState(false);
  const [showEditEmployeeDialog, setShowEditEmployeeDialog] = useState(false);
  const [showDeleteEmployeeDialog, setShowDeleteEmployeeDialog] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<any>(null);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'marketing-associate',
    department: '',
    location: '',
    status: 'active'
  });

  // State for location management
  const [showAddLocationDialog, setShowAddLocationDialog] = useState(false);
  const [showEditLocationDialog, setShowEditLocationDialog] = useState(false);
  const [showDeleteLocationDialog, setShowDeleteLocationDialog] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [newLocation, setNewLocation] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  });

  // State for department management
  const [showAddDepartmentDialog, setShowAddDepartmentDialog] = useState(false);
  const [showEditDepartmentDialog, setShowEditDepartmentDialog] = useState(false);
  const [showDeleteDepartmentDialog, setShowDeleteDepartmentDialog] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState<any>(null);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    description: '',
    locationId: ''
  });

  // Load mock data on component mount
  useEffect(() => {
    // Import mock data from types
    import('@/types/users').then(module => {
      setEmployeeData(module.mockUsers);
    });

    import('@/types/organization').then(module => {
      setLocationData(module.mockLocations);
      setDepartmentData(module.mockDepartments);
    });
  }, []);

  const handleNavigate = (path: string) => {
    // Instead of navigating away, switch to the appropriate tab
    if (path === "/profiles") {
      setActiveTab("employee-directory");
    } else if (path === "/teams") {
      setActiveTab("location-management");
    } else {
      navigate(path);
    }
  };

  const handleAction = (action: string) => {
    // Handle specific actions
    if (action === "Add New User") {
      setShowAddEmployeeDialog(true);
    } else if (action === "Add New Location") {
      setShowAddLocationDialog(true);
    } else if (action === "Add New Department") {
      setShowAddDepartmentDialog(true);
    } else {
      // Default toast for other actions
      toast({
        title: "Admin Action",
        description: `${action} action initiated`,
      });
    }
  };

  // Check if user has access to admin panel
  if (!adminUser && !managerOrHigher) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4">
        <AlertTriangle className="h-16 w-16 text-yellow-500" />
        <h1 className="text-2xl font-bold">Access Restricted</h1>
        <p className="text-muted-foreground text-center max-w-md">
          You don't have permission to access the Admin Panel. Please contact your administrator if you believe this is an error.
        </p>
        <Button onClick={() => navigate('/dashboard')}>
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Add Employee Dialog */}
      {showAddEmployeeDialog && (
        <Dialog open={showAddEmployeeDialog} onOpenChange={setShowAddEmployeeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Create a new employee account in the system
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <Input
                  id="name"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="email" className="text-right">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="phone" className="text-right">
                  Phone
                </label>
                <Input
                  id="phone"
                  value={newEmployee.phone}
                  onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="role" className="text-right">
                  Role
                </label>
                <Select
                  value={newEmployee.role}
                  onValueChange={(value) => setNewEmployee({...newEmployee, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="branch-manager">Branch Manager</SelectItem>
                    <SelectItem value="marketing-head">Marketing Head</SelectItem>
                    <SelectItem value="marketing-supervisor">Marketing Supervisor</SelectItem>
                    <SelectItem value="marketing-recruiter">Marketing Recruiter</SelectItem>
                    <SelectItem value="marketing-associate">Marketing Associate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="department" className="text-right">
                  Department
                </label>
                <Select
                  value={newEmployee.department}
                  onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentData.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="location" className="text-right">
                  Location
                </label>
                <Select
                  value={newEmployee.location}
                  onValueChange={(value) => setNewEmployee({...newEmployee, location: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationData.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddEmployeeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Generate a unique ID
                const id = `user-${Date.now()}`;

                // Create new employee object
                const employee = {
                  id,
                  name: newEmployee.name,
                  email: newEmployee.email,
                  phone: newEmployee.phone,
                  role: newEmployee.role,
                  department: departmentData.find(d => d.id === newEmployee.department)?.name || '',
                  departmentId: newEmployee.department,
                  location: locationData.find(l => l.id === newEmployee.location)?.name || '',
                  locationId: newEmployee.location,
                  status: 'active',
                  hireDate: new Date().toISOString(),
                  avatar: ''
                };

                // Add to employee data
                setEmployeeData([...employeeData, employee]);

                // Reset form and close dialog
                setNewEmployee({
                  name: '',
                  email: '',
                  phone: '',
                  role: 'marketing-associate',
                  department: '',
                  location: '',
                  status: 'active'
                });
                setShowAddEmployeeDialog(false);

                // Show success toast
                toast({
                  title: "Employee Added",
                  description: `${employee.name} has been added successfully.`,
                });
              }}>
                Add Employee
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Employee Dialog */}
      {showEditEmployeeDialog && currentEmployee && (
        <Dialog open={showEditEmployeeDialog} onOpenChange={setShowEditEmployeeDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Employee</DialogTitle>
              <DialogDescription>
                Update employee information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-name" className="text-right">
                  Name
                </label>
                <Input
                  id="edit-name"
                  value={currentEmployee.name}
                  onChange={(e) => setCurrentEmployee({...currentEmployee, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-email" className="text-right">
                  Email
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentEmployee.email}
                  onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-role" className="text-right">
                  Role
                </label>
                <Select
                  value={currentEmployee.role}
                  onValueChange={(value) => setCurrentEmployee({...currentEmployee, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ceo">CEO</SelectItem>
                    <SelectItem value="branch-manager">Branch Manager</SelectItem>
                    <SelectItem value="marketing-head">Marketing Head</SelectItem>
                    <SelectItem value="marketing-supervisor">Marketing Supervisor</SelectItem>
                    <SelectItem value="marketing-recruiter">Marketing Recruiter</SelectItem>
                    <SelectItem value="marketing-associate">Marketing Associate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-department" className="text-right">
                  Department
                </label>
                <Select
                  value={currentEmployee.departmentId}
                  onValueChange={(value) => {
                    const deptName = departmentData.find(d => d.id === value)?.name || '';
                    setCurrentEmployee({
                      ...currentEmployee,
                      departmentId: value,
                      department: deptName
                    });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departmentData.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-location" className="text-right">
                  Location
                </label>
                <Select
                  value={currentEmployee.locationId}
                  onValueChange={(value) => {
                    const locName = locationData.find(l => l.id === value)?.name || '';
                    setCurrentEmployee({
                      ...currentEmployee,
                      locationId: value,
                      location: locName
                    });
                  }}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationData.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-status" className="text-right">
                  Status
                </label>
                <Select
                  value={currentEmployee.status}
                  onValueChange={(value) => setCurrentEmployee({...currentEmployee, status: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditEmployeeDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Update employee in the data
                const updatedEmployees = employeeData.map(emp =>
                  emp.id === currentEmployee.id ? currentEmployee : emp
                );
                setEmployeeData(updatedEmployees);

                // Close dialog
                setShowEditEmployeeDialog(false);

                // Show success toast
                toast({
                  title: "Employee Updated",
                  description: `${currentEmployee.name}'s information has been updated.`,
                });
              }}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Employee Dialog */}
      {showDeleteEmployeeDialog && currentEmployee && (
        <AlertDialog open={showDeleteEmployeeDialog} onOpenChange={setShowDeleteEmployeeDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {currentEmployee.name}'s account and remove all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  // Remove employee from data
                  const updatedEmployees = employeeData.filter(emp => emp.id !== currentEmployee.id);
                  setEmployeeData(updatedEmployees);

                  // Close dialog
                  setShowDeleteEmployeeDialog(false);

                  // Show success toast
                  toast({
                    title: "Employee Deleted",
                    description: `${currentEmployee.name}'s account has been deleted.`,
                  });
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Add Location Dialog */}
      {showAddLocationDialog && (
        <Dialog open={showAddLocationDialog} onOpenChange={setShowAddLocationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>
                Create a new company location
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="loc-name" className="text-right">
                  Name
                </label>
                <Input
                  id="loc-name"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({...newLocation, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="loc-address" className="text-right">
                  Address
                </label>
                <Input
                  id="loc-address"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({...newLocation, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="loc-city" className="text-right">
                  City
                </label>
                <Input
                  id="loc-city"
                  value={newLocation.city}
                  onChange={(e) => setNewLocation({...newLocation, city: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="loc-state" className="text-right">
                  State
                </label>
                <Input
                  id="loc-state"
                  value={newLocation.state}
                  onChange={(e) => setNewLocation({...newLocation, state: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="loc-zip" className="text-right">
                  Zip Code
                </label>
                <Input
                  id="loc-zip"
                  value={newLocation.zipCode}
                  onChange={(e) => setNewLocation({...newLocation, zipCode: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="loc-country" className="text-right">
                  Country
                </label>
                <Input
                  id="loc-country"
                  value={newLocation.country}
                  onChange={(e) => setNewLocation({...newLocation, country: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddLocationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Generate a unique ID
                const id = `loc-${Date.now()}`;

                // Create new location object
                const location = {
                  id,
                  name: newLocation.name,
                  address: newLocation.address,
                  city: newLocation.city,
                  state: newLocation.state,
                  zipCode: newLocation.zipCode,
                  country: newLocation.country,
                  hiringManagerIds: [],
                  departmentIds: [],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };

                // Add to location data
                setLocationData([...locationData, location]);

                // Reset form and close dialog
                setNewLocation({
                  name: '',
                  address: '',
                  city: '',
                  state: '',
                  zipCode: '',
                  country: 'USA'
                });
                setShowAddLocationDialog(false);

                // Show success toast
                toast({
                  title: "Location Added",
                  description: `${location.name} has been added successfully.`,
                });
              }}>
                Add Location
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Location Dialog */}
      {showEditLocationDialog && currentLocation && (
        <Dialog open={showEditLocationDialog} onOpenChange={setShowEditLocationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Location</DialogTitle>
              <DialogDescription>
                Update location information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-loc-name" className="text-right">
                  Name
                </label>
                <Input
                  id="edit-loc-name"
                  value={currentLocation.name}
                  onChange={(e) => setCurrentLocation({...currentLocation, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-loc-address" className="text-right">
                  Address
                </label>
                <Input
                  id="edit-loc-address"
                  value={currentLocation.address}
                  onChange={(e) => setCurrentLocation({...currentLocation, address: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-loc-city" className="text-right">
                  City
                </label>
                <Input
                  id="edit-loc-city"
                  value={currentLocation.city}
                  onChange={(e) => setCurrentLocation({...currentLocation, city: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-loc-state" className="text-right">
                  State
                </label>
                <Input
                  id="edit-loc-state"
                  value={currentLocation.state}
                  onChange={(e) => setCurrentLocation({...currentLocation, state: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-loc-zip" className="text-right">
                  Zip Code
                </label>
                <Input
                  id="edit-loc-zip"
                  value={currentLocation.zipCode}
                  onChange={(e) => setCurrentLocation({...currentLocation, zipCode: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="edit-loc-country" className="text-right">
                  Country
                </label>
                <Input
                  id="edit-loc-country"
                  value={currentLocation.country}
                  onChange={(e) => setCurrentLocation({...currentLocation, country: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditLocationDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Update location in the data
                const updatedLocations = locationData.map(loc =>
                  loc.id === currentLocation.id ? {...currentLocation, updatedAt: new Date().toISOString()} : loc
                );
                setLocationData(updatedLocations);

                // Close dialog
                setShowEditLocationDialog(false);

                // Show success toast
                toast({
                  title: "Location Updated",
                  description: `${currentLocation.name} has been updated.`,
                });
              }}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Location Dialog */}
      {showDeleteLocationDialog && currentLocation && (
        <AlertDialog open={showDeleteLocationDialog} onOpenChange={setShowDeleteLocationDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the {currentLocation.name} location and all associated departments. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={() => {
                  // Remove location from data
                  const updatedLocations = locationData.filter(loc => loc.id !== currentLocation.id);
                  setLocationData(updatedLocations);

                  // Remove associated departments
                  const updatedDepartments = departmentData.filter(dept => dept.locationId !== currentLocation.id);
                  setDepartmentData(updatedDepartments);

                  // Close dialog
                  setShowDeleteLocationDialog(false);

                  // Show success toast
                  toast({
                    title: "Location Deleted",
                    description: `${currentLocation.name} has been deleted.`,
                  });
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Add Department Dialog */}
      {showAddDepartmentDialog && (
        <Dialog open={showAddDepartmentDialog} onOpenChange={setShowAddDepartmentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
              <DialogDescription>
                Create a new department for {currentLocation?.name || 'the company'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dept-name" className="text-right">
                  Name
                </label>
                <Input
                  id="dept-name"
                  value={newDepartment.name}
                  onChange={(e) => setNewDepartment({...newDepartment, name: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="dept-desc" className="text-right">
                  Description
                </label>
                <Input
                  id="dept-desc"
                  value={newDepartment.description}
                  onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
                  className="col-span-3"
                />
              </div>
              {!currentLocation && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="dept-location" className="text-right">
                    Location
                  </label>
                  <Select
                    value={newDepartment.locationId}
                    onValueChange={(value) => setNewDepartment({...newDepartment, locationId: value})}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationData.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDepartmentDialog(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                // Generate a unique ID
                const id = `dept-${Date.now()}`;

                // Get location ID (either from current location or selected)
                const locationId = currentLocation ? currentLocation.id : newDepartment.locationId;

                // Create new department object
                const department = {
                  id,
                  name: newDepartment.name,
                  description: newDepartment.description,
                  locationId,
                  teamLeadId: null,
                  memberCount: 0,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                };

                // Add to department data
                setDepartmentData([...departmentData, department]);

                // Update location's department IDs
                const updatedLocations = locationData.map(loc => {
                  if (loc.id === locationId) {
                    return {
                      ...loc,
                      departmentIds: [...loc.departmentIds, id],
                      updatedAt: new Date().toISOString()
                    };
                  }
                  return loc;
                });
                setLocationData(updatedLocations);

                // Reset form and close dialog
                setNewDepartment({
                  name: '',
                  description: '',
                  locationId: ''
                });
                setShowAddDepartmentDialog(false);

                // Show success toast
                toast({
                  title: "Department Added",
                  description: `${department.name} has been added successfully.`,
                });
              }}>
                Add Department
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground mt-2">
            {adminUser
              ? "Manage all aspects of the system with unrestricted access"
              : managerOrHigher
                ? "Manage organization settings and user accounts"
                : "View system information and settings"}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {adminUser && (
            <Badge variant="outline" className="bg-primary/10 text-primary">
              CEO Access
            </Badge>
          )}
          {!adminUser && managerOrHigher && (
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              Manager Access
            </Badge>
          )}
          {!adminUser && !managerOrHigher && marketingHeadOrHigher && (
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Limited Access
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-background">
            <Shield className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>

          {/* User Management - Available to CEO and Branch Managers */}
          {(adminUser || managerOrHigher) && (
            <TabsTrigger value="users" className="data-[state=active]:bg-background">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
          )}

          {/* Organization - Available to CEO and Branch Managers */}
          {(adminUser || managerOrHigher) && (
            <TabsTrigger value="organization" className="data-[state=active]:bg-background">
              <Building2 className="h-4 w-4 mr-2" />
              Organization
            </TabsTrigger>
          )}

          {/* System Settings - Available to CEO only */}
          {adminUser && (
            <TabsTrigger value="system" className="data-[state=active]:bg-background">
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </TabsTrigger>
          )}

          {/* Activity Logs - Available to CEO and Branch Managers */}
          {(adminUser || managerOrHigher) && (
            <TabsTrigger value="logs" className="data-[state=active]:bg-background">
              <Activity className="h-4 w-4 mr-2" />
              Activity Logs
            </TabsTrigger>
          )}

          {/* System Health - Available to CEO only */}
          {adminUser && (
            <TabsTrigger value="health" className="data-[state=active]:bg-background">
              <Activity className="h-4 w-4 mr-2" />
              System Health
            </TabsTrigger>
          )}

          {/* Employee Directory - Available to CEO and Branch Managers */}
          {(adminUser || managerOrHigher) && (
            <TabsTrigger value="employee-directory" className="data-[state=active]:bg-background">
              <Users className="h-4 w-4 mr-2" />
              Employee Directory
            </TabsTrigger>
          )}

          {/* Location Management - Available to CEO and Branch Managers */}
          {(adminUser || managerOrHigher) && (
            <TabsTrigger value="location-management" className="data-[state=active]:bg-background">
              <Building2 className="h-4 w-4 mr-2" />
              Location Management
            </TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Admin Quick Actions</CardTitle>
                <CardDescription>
                  Access all administrative functions from one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab("employee-directory")}
                  >
                    <UserPlus className="h-8 w-8 mb-2" />
                    <span>Manage Users</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => setActiveTab("location-management")}
                  >
                    <Building2 className="h-8 w-8 mb-2" />
                    <span>Manage Locations</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleNavigate("/settings")}
                  >
                    <Settings className="h-8 w-8 mb-2" />
                    <span>System Settings</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center"
                    onClick={() => handleNavigate("/dashboard")}
                  >
                    <BarChart3 className="h-8 w-8 mb-2" />
                    <span>View Metrics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("employee-directory");
                    setShowAddEmployeeDialog(true);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add New User
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Modify User Roles")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Modify User Roles
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Reset User Password")}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Reset User Password
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>
                  Manage company structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("location-management")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Locations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveTab("location-management");
                    setShowAddDepartmentDialog(true);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Manage Departments
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Update Company Profile")}
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Update Company Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleNavigate("/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  General Settings
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("Manage Integrations")}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Manage Integrations
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => handleAction("View System Logs")}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  View System Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage users, roles, and permissions across the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">User Operations</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => setShowAddEmployeeDialog(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New User
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Bulk Import Users")}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Bulk Import Users
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Export User List")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export User List
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Role Management</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleAction("Assign User Roles")}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Assign User Roles
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Create Custom Role")}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Create Custom Role
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Manage Role Permissions")}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Manage Role Permissions
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Security Operations</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Reset User Password")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Reset User Password
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Lock User Account")}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Lock User Account
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("View Login History")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Login History
                  </Button>
                </div>
              </div>

              {/* User List with Pagination, Filtering, and Sorting */}
              <div className="pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">User Directory</h3>

                {/* Search and Filter Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users by name, email, or role..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleAction("Export Users")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* User Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSortChange("name")}
                          >
                            Name
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>
                          <div
                            className="flex items-center cursor-pointer"
                            onClick={() => handleSortChange("role")}
                          >
                            Role
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={user.avatar} alt={user.name} />
                                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium">{user.name}</span>
                                  <span className="text-xs text-muted-foreground">{user.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{user.role}</TableCell>
                            <TableCell>{user.department}</TableCell>
                            <TableCell>{user.location}</TableCell>
                            <TableCell>
                              {user.status === "Active" ? (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              ) : (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </TableCell>
                            <TableCell>{user.lastLogin}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => handleNavigate(`/profiles/${user.id}`)}>
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAction(`Edit ${user.name}`)}>
                                    Edit User
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAction(`Reset Password for ${user.name}`)}>
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {user.status === "Active" ? (
                                    <DropdownMenuItem onClick={() => handleAction(`Deactivate ${user.name}`)}>
                                      Deactivate User
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => handleAction(`Activate ${user.name}`)}>
                                      Activate User
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center">
                            No users found matching your criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination Controls */}
                {filteredUsers.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-sm text-muted-foreground">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>

                        {Array.from({ length: Math.min(5, totalUserPages) }, (_, i) => {
                          const pageNumber = i + 1;
                          return (
                            <PaginationItem key={pageNumber}>
                              <PaginationLink
                                isActive={currentPage === pageNumber}
                                onClick={() => handlePageChange(pageNumber)}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}

                        {totalUserPages > 5 && (
                          <>
                            <PaginationItem>
                              <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                              <PaginationLink
                                onClick={() => handlePageChange(totalUserPages)}
                              >
                                {totalUserPages}
                              </PaginationLink>
                            </PaginationItem>
                          </>
                        )}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() => handlePageChange(Math.min(totalUserPages, currentPage + 1))}
                            className={currentPage === totalUserPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Structure</CardTitle>
              <CardDescription>
                Manage locations, departments, and team structure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Location Management</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/teams")}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      View All Locations
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Add New Location")}
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      Add New Location
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Assign Location Manager")}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Location Manager
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Department Management</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/teams")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      View All Departments
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Add New Department")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Add New Department
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Assign Department Head")}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Assign Department Head
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">Team Structure</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleNavigate("/profiles")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    View Team Members
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Create Team")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Create Team
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Assign Team Lead")}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Team Lead
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>
                Configure system-wide settings and integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleNavigate("/settings")}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      System Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Configure Email Templates")}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Configure Email Templates
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Manage Notifications")}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Manage Notifications
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Integrations</h3>
                  <div className="space-y-2">
                    <Button
                      className="w-full justify-start"
                      onClick={() => handleAction("Configure TalentPulse Voice Screening")}
                    >
                      <Mic className="h-4 w-4 mr-2" />
                      Configure TalentPulse Voice Screening
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("Configure Workflow Automation")}
                    >
                      <Workflow className="h-4 w-4 mr-2" />
                      Configure Workflow Automation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={() => handleAction("API Integrations")}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      API Integrations
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="text-lg font-medium mb-4">License & Billing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Manage License")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Manage License
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Billing Settings")}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing Settings
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleAction("Usage Reports")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Usage Reports
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>
                View and analyze user activity across the system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs by user, action, or target..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleAction("Export Logs")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(parseInt(value))}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Rows per page" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 per page</SelectItem>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Activity Logs Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("timestamp")}
                        >
                          Timestamp
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("user")}
                        >
                          User
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("action")}
                        >
                          Action
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedLogs.length > 0 ? (
                      paginatedLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-medium">{log.timestamp}</TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.target}</TableCell>
                          <TableCell>{log.ip}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          No activity logs found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {filteredLogs.length > 0 && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} entries
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {totalPages > 5 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(totalPages)}
                            >
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Health Tab */}
        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Health</CardTitle>
              <CardDescription>
                Monitor system performance and component status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* System Health Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Activity className="h-8 w-8 text-primary" />
                      <p className="text-sm text-muted-foreground">System Uptime</p>
                      <p className="text-3xl font-bold">99.98%</p>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Activity className="h-8 w-8 text-primary" />
                      <p className="text-sm text-muted-foreground">API Response Time</p>
                      <p className="text-3xl font-bold">124ms</p>
                      <p className="text-xs text-muted-foreground">Average</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Database className="h-8 w-8 text-primary" />
                      <p className="text-sm text-muted-foreground">Database Size</p>
                      <p className="text-3xl font-bold">1.2GB</p>
                      <p className="text-xs text-muted-foreground">Total storage</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Users className="h-8 w-8 text-primary" />
                      <p className="text-sm text-muted-foreground">Active Sessions</p>
                      <p className="text-3xl font-bold">42</p>
                      <p className="text-xs text-muted-foreground">Current users</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Component Status Table */}
              <div>
                <h3 className="text-lg font-medium mb-4">Component Status</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Uptime</TableHead>
                        <TableHead>Last Issue</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSystemHealth.map((component) => (
                        <TableRow key={component.id}>
                          <TableCell className="font-medium">{component.component}</TableCell>
                          <TableCell>
                            {component.status === "Healthy" ? (
                              <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                            ) : component.status === "Degraded" ? (
                              <Badge className="bg-yellow-100 text-yellow-800">Degraded</Badge>
                            ) : (
                              <Badge variant="destructive">Down</Badge>
                            )}
                          </TableCell>
                          <TableCell>{component.uptime}</TableCell>
                          <TableCell>{component.lastIssue}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAction(`View ${component.component} Details`)}
                            >
                              Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* System Performance Chart */}
              <div>
                <h3 className="text-lg font-medium mb-4">System Performance</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { time: '00:00', cpu: 25, memory: 40, requests: 10 },
                        { time: '04:00', cpu: 20, memory: 35, requests: 5 },
                        { time: '08:00', cpu: 35, memory: 45, requests: 20 },
                        { time: '12:00', cpu: 60, memory: 55, requests: 45 },
                        { time: '16:00', cpu: 75, memory: 65, requests: 60 },
                        { time: '20:00', cpu: 50, memory: 50, requests: 35 },
                        { time: '23:59', cpu: 30, memory: 45, requests: 15 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="cpu" name="CPU Usage %" stroke="#8884d8" />
                      <Line type="monotone" dataKey="memory" name="Memory Usage %" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="requests" name="Requests/min" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Employee Directory Tab */}
        <TabsContent value="employee-directory" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Employee Directory</CardTitle>
                <CardDescription>
                  Manage all employees across the organization
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddEmployeeDialog(true)}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleAction("Export Employees")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Employee Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("name")}
                        >
                          Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("role")}
                        >
                          Role
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employeeData.length > 0 ? (
                      employeeData
                        .filter(employee => {
                          if (searchTerm && !employee.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              !employee.email.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              !employee.role.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return false;
                          }

                          if (statusFilter !== "all" && employee.status?.toLowerCase() !== statusFilter.toLowerCase()) {
                            return false;
                          }

                          return true;
                        })
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((employee) => (
                          <TableRow key={employee.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={employee.avatar} alt={employee.name} />
                                  <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-medium">{employee.name}</span>
                                  <span className="text-xs text-muted-foreground">{employee.email}</span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{employee.role}</TableCell>
                            <TableCell>{employee.department || "N/A"}</TableCell>
                            <TableCell>{employee.location || "N/A"}</TableCell>
                            <TableCell>
                              {employee.status === "active" ? (
                                <Badge className="bg-green-100 text-green-800">Active</Badge>
                              ) : employee.status === "inactive" ? (
                                <Badge variant="outline">Inactive</Badge>
                              ) : (
                                <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentEmployee(employee);
                                    setShowEditEmployeeDialog(true);
                                  }}>
                                    Edit Employee
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleAction(`Reset Password for ${employee.name}`)}>
                                    Reset Password
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  {employee.status === "active" ? (
                                    <DropdownMenuItem onClick={() => {
                                      setCurrentEmployee(employee);
                                      // Update employee status
                                      const updatedEmployees = employeeData.map(emp =>
                                        emp.id === employee.id ? {...emp, status: "inactive"} : emp
                                      );
                                      setEmployeeData(updatedEmployees);
                                      toast({
                                        title: "Employee Deactivated",
                                        description: `${employee.name} has been deactivated.`,
                                      });
                                    }}>
                                      Deactivate Employee
                                    </DropdownMenuItem>
                                  ) : (
                                    <DropdownMenuItem onClick={() => {
                                      setCurrentEmployee(employee);
                                      // Update employee status
                                      const updatedEmployees = employeeData.map(emp =>
                                        emp.id === employee.id ? {...emp, status: "active"} : emp
                                      );
                                      setEmployeeData(updatedEmployees);
                                      toast({
                                        title: "Employee Activated",
                                        description: `${employee.name} has been activated.`,
                                      });
                                    }}>
                                      Activate Employee
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setCurrentEmployee(employee);
                                      setShowDeleteEmployeeDialog(true);
                                    }}
                                  >
                                    Delete Employee
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {employeeData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center">
                              <p className="mb-2">No employees found</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddEmployeeDialog(true)}
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Add Employee
                              </Button>
                            </div>
                          ) : (
                            "No employees match your search criteria"
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {employeeData.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min(employeeData.length, 1 + (currentPage - 1) * itemsPerPage)} to {Math.min(currentPage * itemsPerPage, employeeData.length)} of {employeeData.length} employees
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, Math.ceil(employeeData.length / itemsPerPage)) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {Math.ceil(employeeData.length / itemsPerPage) > 5 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(Math.ceil(employeeData.length / itemsPerPage))}
                            >
                              {Math.ceil(employeeData.length / itemsPerPage)}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(Math.ceil(employeeData.length / itemsPerPage), currentPage + 1))}
                          className={currentPage === Math.ceil(employeeData.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Management Tab */}
        <TabsContent value="location-management" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Location Management</CardTitle>
                <CardDescription>
                  Manage all company locations and departments
                </CardDescription>
              </div>
              <Button onClick={() => setShowAddLocationDialog(true)}>
                <Building2 className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations by name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleAction("Export Locations")}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Locations Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">
                        <div
                          className="flex items-center cursor-pointer"
                          onClick={() => handleSortChange("name")}
                        >
                          Name
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>City</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Departments</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationData.length > 0 ? (
                      locationData
                        .filter(location => {
                          if (searchTerm && !location.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              !location.address.toLowerCase().includes(searchTerm.toLowerCase()) &&
                              !location.city.toLowerCase().includes(searchTerm.toLowerCase())) {
                            return false;
                          }
                          return true;
                        })
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((location) => (
                          <TableRow key={location.id}>
                            <TableCell className="font-medium">{location.name}</TableCell>
                            <TableCell>{location.address}</TableCell>
                            <TableCell>{location.city}</TableCell>
                            <TableCell>{location.state}</TableCell>
                            <TableCell>
                              {departmentData
                                .filter(dept => dept.locationId === location.id)
                                .length} departments
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentLocation(location);
                                    setShowEditLocationDialog(true);
                                  }}>
                                    Edit Location
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentLocation(location);
                                    setNewDepartment({
                                      name: '',
                                      description: '',
                                      locationId: location.id
                                    });
                                    setShowAddDepartmentDialog(true);
                                  }}>
                                    Add Department
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => {
                                    setCurrentLocation(location);
                                    // Show departments for this location
                                    toast({
                                      title: "View Departments",
                                      description: `Viewing departments for ${location.name}`,
                                    });
                                  }}>
                                    View Departments
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => {
                                      setCurrentLocation(location);
                                      setShowDeleteLocationDialog(true);
                                    }}
                                  >
                                    Delete Location
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {locationData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center">
                              <p className="mb-2">No locations found</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAddLocationDialog(true)}
                              >
                                <Building2 className="h-4 w-4 mr-2" />
                                Add Location
                              </Button>
                            </div>
                          ) : (
                            "No locations match your search criteria"
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {locationData.length > 0 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {Math.min(locationData.length, 1 + (currentPage - 1) * itemsPerPage)} to {Math.min(currentPage * itemsPerPage, locationData.length)} of {locationData.length} locations
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>

                      {Array.from({ length: Math.min(5, Math.ceil(locationData.length / itemsPerPage)) }, (_, i) => {
                        const pageNumber = i + 1;
                        return (
                          <PaginationItem key={pageNumber}>
                            <PaginationLink
                              isActive={currentPage === pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                            >
                              {pageNumber}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      {Math.ceil(locationData.length / itemsPerPage) > 5 && (
                        <>
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              onClick={() => handlePageChange(Math.ceil(locationData.length / itemsPerPage))}
                            >
                              {Math.ceil(locationData.length / itemsPerPage)}
                            </PaginationLink>
                          </PaginationItem>
                        </>
                      )}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(Math.min(Math.ceil(locationData.length / itemsPerPage), currentPage + 1))}
                          className={currentPage === Math.ceil(locationData.length / itemsPerPage) ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};



export default AdminPanelPage;
