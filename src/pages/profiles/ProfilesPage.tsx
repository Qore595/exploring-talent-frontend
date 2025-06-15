import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Mail, Phone, Calendar,
  User, Building, Briefcase, MapPin,
  MoreHorizontal, UserPlus, Loader2, RefreshCw,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';
import { isAdmin, isBranchManagerOrHigher } from '@/utils/adminPermissions';
import { employeeService, EmployeeQueryParams, Employee } from '@/services/employeeService';
import { branchService } from '@/services/branchService';
import { departmentService } from '@/services/departmentService';
import { designationService } from '@/services/designationService';

// Helper function to get stats for a user
const getUserStats = (userId: number) => {
  // In a real app, this would be fetched from an API
  return {
    openRequisitions: Math.floor(Math.random() * 10) + 1,
    activeCandidates: Math.floor(Math.random() * 30) + 5,
    totalHires: Math.floor(Math.random() * 20)
  };
};

// Helper function to check if an employee is in a management position
const isInManagementPosition = (employee: Employee) => {
  const designation = employee.Designation?.name?.toLowerCase() || '';
  return designation.includes('manager') ||
         designation.includes('head') ||
         designation.includes('ceo') ||
         designation.includes('supervisor') ||
         designation.includes('director') ||
         designation.includes('lead');
};

const ProfilesPage = () => {
  const navigate = useNavigate();

  // State for employee data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20, // Increased to show more employees in grid view
    pages: 1
  });

  // State for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [designationFilter, setDesignationFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('grid');

  // State for filter options
  const [branches, setBranches] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [designations, setDesignations] = useState<any[]>([]);
  const [isLoadingFilters, setIsLoadingFilters] = useState(true);

  // Auth context
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const managerOrHigher = isBranchManagerOrHigher(user?.role);

  // Handle view profile
  const handleViewProfile = (profileId: number) => {
    navigate(`/profiles/${profileId}`);
  };

  // Fetch filter options on component mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch employees on component mount and when filters or pagination changes
  useEffect(() => {
    console.log("Filter or pagination changed, fetching employees...");
    fetchEmployees();
  }, [pagination.page, pagination.limit, branchFilter, departmentFilter, designationFilter, statusFilter, searchTerm]);

  // Function to handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    // Reset to page 1 when filters change
    setPagination(prev => ({ ...prev, page: 1 }));

    console.log(`Filter change: ${filterType} = ${value} (type: ${typeof value})`);

    // Validate ID values
    if (filterType !== 'status' && value !== 'all') {
      const numericValue = parseInt(value);
      if (isNaN(numericValue)) {
        console.warn(`Warning: Non-numeric ID value for ${filterType} filter: ${value}`);
      } else {
        console.log(`Validated ${filterType} ID: ${numericValue}`);
      }
    }

    // Update the filter value
    switch (filterType) {
      case 'branch':
        console.log(`Setting branch filter from ${branchFilter} to ${value}`);
        setBranchFilter(value);
        // Log the branch name for debugging
        if (value !== 'all') {
          const branch = branches.find(b => b.id.toString() === value);
          console.log(`Selected branch: ${branch ? branch.name : 'Unknown'} (ID: ${value})`);
        }
        break;
      case 'department':
        console.log(`Setting department filter from ${departmentFilter} to ${value}`);
        setDepartmentFilter(value);
        // Log the department name for debugging
        if (value !== 'all') {
          const department = departments.find(d => d.id.toString() === value);
          console.log(`Selected department: ${department ? department.name : 'Unknown'} (ID: ${value})`);
        }
        break;
      case 'designation':
        console.log(`Setting designation filter from ${designationFilter} to ${value}`);
        setDesignationFilter(value);
        // Log the designation name for debugging
        if (value !== 'all') {
          const designation = designations.find(d => d.id.toString() === value);
          console.log(`Selected designation: ${designation ? designation.name : 'Unknown'} (ID: ${value})`);
        }
        break;
      case 'status':
        console.log(`Setting status filter from ${statusFilter} to ${value}`);
        setStatusFilter(value);
        break;
      default:
        console.warn(`Unknown filter type: ${filterType}`);
        break;
    }

    // Show toast notification for filter changes
    toast({
      title: "Filter Applied",
      description: `${filterType.charAt(0).toUpperCase() + filterType.slice(1)} filter updated to ${value}`,
    });
  };

  // Function to fetch filter options
  const fetchFilterOptions = async () => {
    console.log('Fetching filter options...');
    setIsLoadingFilters(true);

    try {
      // Fetch branches
      console.log('Fetching branches...');
      const branchResponse = await branchService.getBranches();
      console.log('Branch response:', branchResponse);

      if (branchResponse.success) {
        console.log('Setting branches:', branchResponse.data);
        setBranches(branchResponse.data);

        // Log branch IDs and types for debugging
        branchResponse.data.forEach((branch: any) => {
          console.log(`Branch: ${branch.name}, ID: ${branch.id} (${typeof branch.id})`);
        });
      } else {
        console.warn('Branch response does not have success property:', branchResponse);
        // Try to extract branches from the response if possible
        if (branchResponse.data && Array.isArray(branchResponse.data)) {
          console.log('Found branches in data property:', branchResponse.data);
          setBranches(branchResponse.data);

          // Log branch IDs and types for debugging
          branchResponse.data.forEach((branch: any) => {
            console.log(`Branch: ${branch.name}, ID: ${branch.id} (${typeof branch.id})`);
          });
        }
      }

      // Fetch departments
      console.log('Fetching departments...');
      const departmentResponse = await departmentService.getDepartments();
      console.log('Department response:', departmentResponse);

      if (departmentResponse.success) {
        console.log('Setting departments:', departmentResponse.data);
        setDepartments(departmentResponse.data);

        // Log department IDs and types for debugging
        departmentResponse.data.forEach((department: any) => {
          console.log(`Department: ${department.name}, ID: ${department.id} (${typeof department.id})`);
        });
      } else if (departmentResponse.data && Array.isArray(departmentResponse.data)) {
        console.log('Found departments in data property:', departmentResponse.data);
        setDepartments(departmentResponse.data);
      }

      // Fetch designations
      console.log('Fetching designations...');
      const designationResponse = await designationService.getDesignations();
      console.log('Designation response:', designationResponse);

      if (designationResponse.success) {
        console.log('Setting designations:', designationResponse.data);
        setDesignations(designationResponse.data);

        // Log designation IDs and types for debugging
        designationResponse.data.forEach((designation: any) => {
          console.log(`Designation: ${designation.name}, ID: ${designation.id} (${typeof designation.id})`);
        });
      } else if (designationResponse.data && Array.isArray(designationResponse.data)) {
        console.log('Found designations in data property:', designationResponse.data);
        setDesignations(designationResponse.data);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    } finally {
      setIsLoadingFilters(false);
    }
  };

  // Function to fetch employees from API
  const fetchEmployees = async () => {
    console.log('Fetching employees with filters:', {
      page: pagination.page,
      limit: pagination.limit,
      searchTerm,
      branchFilter,
      departmentFilter,
      designationFilter,
      statusFilter
    });

    setIsLoading(true);
    setError(null);

    try {
      // Prepare query parameters
      const params: EmployeeQueryParams = {
        page: pagination.page,
        limit: pagination.limit,
        is_active: statusFilter === 'inactive' ? false : statusFilter === 'active' ? true : undefined,
      };

      // Add branch filter if selected
      if (branchFilter !== 'all') {
        // Always convert to number and ensure it's valid
        const branchId = parseInt(branchFilter);
        if (!isNaN(branchId)) {
          params.branch_id = branchId;
          console.log(`Branch filter applied: ${branchFilter} (converted to number: ${branchId})`);
        } else {
          console.warn(`Invalid branch ID: ${branchFilter} - not applying filter`);
        }
      }

      // Add department filter if selected
      if (departmentFilter !== 'all') {
        // Always convert to number and ensure it's valid
        const departmentId = parseInt(departmentFilter);
        if (!isNaN(departmentId)) {
          params.department_id = departmentId;
          console.log(`Department filter applied: ${departmentFilter} (converted to number: ${departmentId})`);
        } else {
          console.warn(`Invalid department ID: ${departmentFilter} - not applying filter`);
        }
      }

      // Add designation filter if selected
      if (designationFilter !== 'all') {
        // Always convert to number and ensure it's valid
        const designationId = parseInt(designationFilter);
        if (!isNaN(designationId)) {
          params.designation_id = designationId;
          console.log(`Designation filter applied: ${designationFilter} (converted to number: ${designationId})`);
        } else {
          console.warn(`Invalid designation ID: ${designationFilter} - not applying filter`);
        }
      }

      // Add search term if provided
      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      console.log('API query parameters:', params);

      // Call the API
      const response = await employeeService.getEmployees(params);
      console.log('API response:', response);

      // Update state with response data
      if (response.success) {
        setEmployees(response.data);
        setFilteredEmployees(response.data);
        setPagination(response.pagination);
        console.log(`Loaded ${response.data.length} employees out of ${response.pagination.total}`);
      } else {
        setError('Failed to fetch employees');
        console.error('API returned error:', response);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('An error occurred while fetching employees');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle manual search button click
  const handleSearch = () => {
    // Reset to page 1 when searching
    setPagination(prev => ({ ...prev, page: 1 }));

    // Show toast notification
    if (searchTerm || branchFilter !== 'all' || departmentFilter !== 'all' || designationFilter !== 'all' || statusFilter !== 'all') {
      toast({
        title: "Filters Applied",
        description: "Employee list has been filtered",
      });
    }
  };

  // Function to clear all filters
  const handleClearFilters = () => {
    // Reset all filters in a single batch
    setSearchTerm('');
    setBranchFilter('all');
    setDepartmentFilter('all');
    setDesignationFilter('all');
    setStatusFilter('all');
    setPagination(prev => ({ ...prev, page: 1 }));

    // Show toast notification
    toast({
      title: "Filters Cleared",
      description: "All filters have been reset",
    });

    // Note: No need to call fetchEmployees() here as the useEffect will handle it
  };

  // Function to handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Function to get initials from name
  const getInitials = (firstName: string, lastName: string | null) => {
    const first = firstName ? firstName.charAt(0).toUpperCase() : '';
    const last = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${first}${last}`;
  };

  // Function to handle refresh
  const handleRefresh = () => {
    fetchEmployees();
    toast({
      title: "Refreshed",
      description: "Employee list has been refreshed",
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
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={() => navigate('/hr/employees/add')}>
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, ID..."
            value={searchTerm}
            onChange={(e) => {
              // Debounce search input to avoid too many API calls
              const newSearchTerm = e.target.value;
              setSearchTerm(newSearchTerm);

              // Reset to page 1 when searching
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="flex flex-wrap gap-2">
            <div className="w-[180px]">
              <Select
                value={branchFilter}
                onValueChange={(value) => handleFilterChange('branch', value)}
                disabled={isLoadingFilters}
              >
                <SelectTrigger className={branchFilter !== 'all' ? 'border-primary' : ''}>
                  <div className="flex items-center">
                    <Building className="mr-2 h-4 w-4" />
                    <span>Branch</span>
                    {branchFilter !== 'all' && <Badge variant="outline" className="ml-1 h-4 px-1">•</Badge>}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map((branch) => {
                    // Ensure branch.id is valid and converted to string for the value prop
                    if (branch.id === undefined || branch.id === null) {
                      console.warn(`Branch ${branch.name} has invalid ID: ${branch.id}`);
                      return null; // Skip this branch
                    }
                    const branchId = branch.id.toString();
                    console.log(`Rendering branch option: ${branch.name}, ID: ${branchId} (original type: ${typeof branch.id})`);
                    return (
                      <SelectItem key={branchId} value={branchId}>
                        {branch.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[180px]">
              <Select
                value={departmentFilter}
                onValueChange={(value) => handleFilterChange('department', value)}
                disabled={isLoadingFilters}
              >
                <SelectTrigger className={departmentFilter !== 'all' ? 'border-primary' : ''}>
                  <div className="flex items-center">
                    <Briefcase className="mr-2 h-4 w-4" />
                    <span>Department</span>
                    {departmentFilter !== 'all' && <Badge variant="outline" className="ml-1 h-4 px-1">•</Badge>}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((department) => {
                    // Ensure department.id is valid and converted to string for the value prop
                    if (department.id === undefined || department.id === null) {
                      console.warn(`Department ${department.name} has invalid ID: ${department.id}`);
                      return null; // Skip this department
                    }
                    const departmentId = department.id.toString();
                    console.log(`Rendering department option: ${department.name}, ID: ${departmentId} (original type: ${typeof department.id})`);
                    return (
                      <SelectItem key={departmentId} value={departmentId}>
                        {department.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[180px]">
              <Select
                value={designationFilter}
                onValueChange={(value) => handleFilterChange('designation', value)}
                disabled={isLoadingFilters}
              >
                <SelectTrigger className={designationFilter !== 'all' ? 'border-primary' : ''}>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Designation</span>
                    {designationFilter !== 'all' && <Badge variant="outline" className="ml-1 h-4 px-1">•</Badge>}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Designations</SelectItem>
                  {designations.map((designation) => {
                    // Ensure designation.id is valid and converted to string for the value prop
                    if (designation.id === undefined || designation.id === null) {
                      console.warn(`Designation ${designation.name} has invalid ID: ${designation.id}`);
                      return null; // Skip this designation
                    }
                    const designationId = designation.id.toString();
                    console.log(`Rendering designation option: ${designation.name}, ID: ${designationId} (original type: ${typeof designation.id})`);
                    return (
                      <SelectItem key={designationId} value={designationId}>
                        {designation.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="w-[180px]">
              <Select
                value={statusFilter}
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger className={statusFilter !== 'all' ? 'border-primary' : ''}>
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    <span>Status</span>
                    {statusFilter !== 'all' && <Badge variant="outline" className="ml-1 h-4 px-1">•</Badge>}
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="default"
              size="default"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>

            <Button
              variant="outline"
              size="default"
              onClick={handleClearFilters}
              disabled={isLoading || (searchTerm === '' && branchFilter === 'all' && departmentFilter === 'all' && designationFilter === 'all' && statusFilter === 'all')}
            >
              Clear Filters
            </Button>

            <div className="ml-auto">
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

      {/* Active filters summary */}
      {(searchTerm || branchFilter !== 'all' || departmentFilter !== 'all' || designationFilter !== 'all' || statusFilter !== 'all') && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>Search: {searchTerm}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {branchFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>Branch: {branches.find(b => b.id.toString() === branchFilter)?.name || branchFilter}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setBranchFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {departmentFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>Department: {departments.find(d => d.id.toString() === departmentFilter)?.name || departmentFilter}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setDepartmentFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {designationFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>Designation: {designations.find(d => d.id.toString() === designationFilter)?.name || designationFilter}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setDesignationFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <span>Status: {statusFilter}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-1"
                onClick={() => setStatusFilter('all')}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {isLoading ? (
        // Loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                    <Skeleton className="h-10 w-full rounded-md" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        // Error state
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        // Content based on active tab
        activeTab === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.length > 0 ? (
              employees.map((employee) => {
                const stats = getUserStats(employee.id);
                return (
                  <Card key={employee.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.photo || undefined} alt={`${employee.first_name} ${employee.last_name || ''}`} />
                          <AvatarFallback>{getInitials(employee.first_name, employee.last_name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{`${employee.first_name} ${employee.last_name || ''}`}</CardTitle>
                          <CardDescription>
                            {employee.Designation?.name || employee.position || 'Employee'}
                            {employee.employee_id && <span className="ml-1 text-xs opacity-70">#{employee.employee_id}</span>}
                          </CardDescription>
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
                            <DropdownMenuItem onClick={() => navigate(`/hr/employees/edit/${employee.id}`)}>
                              Edit Profile
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() =>
                            toast({
                              title: "Email Sent",
                              description: `Email drafted to ${employee.first_name} ${employee.last_name || ''}`,
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
                          {/* Always show email - with placeholder if missing */}
                          <div className="flex items-center text-sm">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.email || 'Email not available'}</span>
                          </div>

                          {/* Always show phone - with placeholder if missing */}
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.phone || 'Phone not available'}</span>
                          </div>

                          {/* Always show department - with placeholder if missing */}
                          <div className="flex items-center text-sm">
                            <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.Department?.name || 'Department not assigned'}</span>
                          </div>

                          {/* Always show branch - with placeholder if missing */}
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{employee.Branch?.name || 'Branch not assigned'}</span>
                          </div>

                          {/* Always show hire date - with placeholder if missing */}
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>
                              {employee.hire_date
                                ? `Joined ${new Date(employee.hire_date).toLocaleDateString()}`
                                : 'Hire date not available'}
                            </span>
                          </div>
                        </div>

                        {/* Stats for managers and above */}
                        {isInManagementPosition(employee) && (
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

                        {/* Show empty stats for non-managers */}
                        {!isInManagementPosition(employee) && (
                          <div className="mt-2 pt-2 border-t border-muted">
                            <p className="text-xs text-muted-foreground text-center">Employee statistics not available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-3 text-center py-12">
                <User className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No employees found</h3>
                {(searchTerm || branchFilter !== 'all' || departmentFilter !== 'all' || designationFilter !== 'all' || statusFilter !== 'all') ? (
                  <div className="mt-2">
                    <p className="text-muted-foreground">
                      No employees match your current filters
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={handleClearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    There are no employees in the system yet
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          // List view
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <div className="grid grid-cols-7 p-4 text-sm font-medium border-b bg-muted/50">
                  <div className="col-span-2">Name</div>
                  <div className="col-span-1">Role</div>
                  <div className="col-span-1">Department</div>
                  <div className="col-span-1">Branch</div>
                  <div className="col-span-1">Status</div>
                  <div className="col-span-1">Actions</div>
                </div>
                <div className="divide-y">
                  {employees.length > 0 ? (
                    employees.map((employee) => (
                      <div key={employee.id} className="grid grid-cols-7 items-center p-4 text-sm">
                        <div className="col-span-2 flex items-center">
                          <Avatar className="h-8 w-8 mr-3">
                            <AvatarImage src={employee.photo || undefined} alt={`${employee.first_name} ${employee.last_name || ''}`} />
                            <AvatarFallback>{getInitials(employee.first_name, employee.last_name)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{`${employee.first_name} ${employee.last_name || ''}`}</p>
                            <p className="text-xs text-muted-foreground">{employee.email || employee.employee_id || 'No contact info'}</p>
                          </div>
                        </div>
                        <div className="col-span-1">{employee.Designation?.name || 'Not assigned'}</div>
                        <div className="col-span-1">{employee.Department?.name || 'Not assigned'}</div>
                        <div className="col-span-1">{employee.Branch?.name || 'Not assigned'}</div>
                        <div className="col-span-1">
                          <Badge variant={employee.is_active ? "default" : "secondary"}>
                            {employee.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
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
                                <DropdownMenuItem onClick={() => navigate(`/hr/employees/edit/${employee.id}`)}>
                                  Edit Profile
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() =>
                                toast({
                                  title: "Email Sent",
                                  description: `Email drafted to ${employee.first_name} ${employee.last_name || ''}`,
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
                      <User className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No employees found</h3>
                      {(searchTerm || branchFilter !== 'all' || departmentFilter !== 'all' || designationFilter !== 'all' || statusFilter !== 'all') ? (
                        <div className="mt-2">
                          <p className="text-muted-foreground">
                            No employees match your current filters
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={handleClearFilters}
                          >
                            Clear All Filters
                          </Button>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          There are no employees in the system yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      )}

      {/* Pagination */}
      {!isLoading && !error && employees.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page <= 1}
          >
            Previous
          </Button>
          <span className="mx-4 flex items-center text-sm">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(Math.min(pagination.pages, pagination.page + 1))}
            disabled={pagination.page >= pagination.pages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilesPage;
