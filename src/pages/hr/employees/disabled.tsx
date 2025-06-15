import { useState } from 'react';
import { Search, Filter, Eye, UserCheck, UserX, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/page-header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for disabled employees
const disabledEmployeesData = [
  {
    id: 1,
    employeeId: 'EMP006',
    name: 'Thomas Anderson',
    email: 'thomas.anderson@example.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    designation: 'Software Engineer',
    joiningDate: '2020-03-15',
    disabledDate: '2023-05-20',
    disabledReason: 'Resigned',
    disabledBy: 'Michael Wilson',
  },
  {
    id: 2,
    employeeId: 'EMP007',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 234-5678',
    department: 'Marketing',
    designation: 'Marketing Specialist',
    joiningDate: '2019-07-10',
    disabledDate: '2023-04-15',
    disabledReason: 'Contract ended',
    disabledBy: 'Michael Wilson',
  },
  {
    id: 3,
    employeeId: 'EMP008',
    name: 'David Lee',
    email: 'david.lee@example.com',
    phone: '+1 (555) 345-6789',
    department: 'Finance',
    designation: 'Financial Analyst',
    joiningDate: '2021-01-05',
    disabledDate: '2023-06-01',
    disabledReason: 'Terminated',
    disabledBy: 'John Doe',
  },
  {
    id: 4,
    employeeId: 'EMP009',
    name: 'Lisa Brown',
    email: 'lisa.brown@example.com',
    phone: '+1 (555) 456-7890',
    department: 'Human Resources',
    designation: 'HR Specialist',
    joiningDate: '2018-11-20',
    disabledDate: '2023-05-10',
    disabledReason: 'Resigned',
    disabledBy: 'Michael Wilson',
  },
  {
    id: 5,
    employeeId: 'EMP010',
    name: 'James Wilson',
    email: 'james.wilson@example.com',
    phone: '+1 (555) 567-8901',
    department: 'Sales',
    designation: 'Sales Representative',
    joiningDate: '2020-09-15',
    disabledDate: '2023-06-05',
    disabledReason: 'Contract ended',
    disabledBy: 'John Doe',
  },
];

const DisabledEmployeesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [reasonFilter, setReasonFilter] = useState('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEnableDialogOpen, setIsEnableDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter employees based on search query and filters
  const filteredData = disabledEmployeesData.filter((employee) => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === 'all' || 
      employee.department.toLowerCase() === departmentFilter.toLowerCase();
    
    const matchesReason = 
      reasonFilter === 'all' || 
      employee.disabledReason.toLowerCase() === reasonFilter.toLowerCase();
    
    return matchesSearch && matchesDepartment && matchesReason;
  });

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Handle view employee
  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setIsViewDialogOpen(true);
  };

  // Handle enable employee
  const handleEnableClick = (employee: any) => {
    setSelectedEmployee(employee);
    setIsEnableDialogOpen(true);
  };

  // Enable employee
  const enableEmployee = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the enable request to your API
      console.log('Enabling employee:', selectedEmployee?.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Employee Enabled',
        description: 'The employee has been successfully enabled.',
      });
      
      // Close dialog
      setIsEnableDialogOpen(false);
      setSelectedEmployee(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error enabling the employee. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Disabled Employees"
        description="View and manage employees who have been disabled in the system"
      />
      
      <div className="flex flex-col md:flex-row gap-4 mt-6 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter by department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="human resources">Human Resources</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={reasonFilter} onValueChange={setReasonFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="resigned">Resigned</SelectItem>
              <SelectItem value="terminated">Terminated</SelectItem>
              <SelectItem value="contract ended">Contract Ended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Disabled Employees</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Disabled Date</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.employeeId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>{employee.designation}</TableCell>
                    <TableCell>{employee.disabledDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{employee.disabledReason}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewEmployee(employee)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-green-500"
                          onClick={() => handleEnableClick(employee)}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No disabled employees found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Employee Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              View the details of the disabled employee.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">{getInitials(selectedEmployee.name)}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="text-center">
                <h2 className="text-xl font-bold">{selectedEmployee.name}</h2>
                <p className="text-muted-foreground">{selectedEmployee.employeeId}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{selectedEmployee.phone}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                  <p className="text-base">{selectedEmployee.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Designation</h3>
                  <p className="text-base">{selectedEmployee.designation}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Joining Date</h3>
                  <p className="text-base">{selectedEmployee.joiningDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Disabled Date</h3>
                  <p className="text-base">{selectedEmployee.disabledDate}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Disabled Reason</h3>
                <p className="text-base">{selectedEmployee.disabledReason}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Disabled By</h3>
                <p className="text-base">{selectedEmployee.disabledBy}</p>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Enable Employee Dialog */}
      <Dialog open={isEnableDialogOpen} onOpenChange={setIsEnableDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Employee</DialogTitle>
            <DialogDescription>
              Are you sure you want to enable this employee? This will restore their access to the system.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{getInitials(selectedEmployee.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedEmployee.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedEmployee.employeeId}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                  <p className="text-base">{selectedEmployee.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Designation</h3>
                  <p className="text-base">{selectedEmployee.designation}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEnableDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600" 
                  onClick={enableEmployee}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enabling...' : 'Enable Employee'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DisabledEmployeesPage;
