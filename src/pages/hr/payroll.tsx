import { useState } from 'react';
import { Search, Filter, Download, Eye, FileText, DollarSign, Calendar } from 'lucide-react';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

// Mock data for payroll records
const payrollData = [
  {
    id: 1,
    employeeId: 'EMP001',
    name: 'John Doe',
    department: 'Engineering',
    designation: 'Senior Developer',
    salary: 85000,
    month: 'June',
    year: '2023',
    paymentDate: '2023-06-30',
    status: 'paid',
  },
  {
    id: 2,
    employeeId: 'EMP002',
    name: 'Jane Smith',
    department: 'Marketing',
    designation: 'Marketing Manager',
    salary: 75000,
    month: 'June',
    year: '2023',
    paymentDate: '2023-06-30',
    status: 'paid',
  },
  {
    id: 3,
    employeeId: 'EMP003',
    name: 'Robert Johnson',
    department: 'Human Resources',
    designation: 'HR Specialist',
    salary: 65000,
    month: 'June',
    year: '2023',
    paymentDate: '2023-06-30',
    status: 'pending',
  },
  {
    id: 4,
    employeeId: 'EMP004',
    name: 'Emily Davis',
    department: 'Finance',
    designation: 'Financial Analyst',
    salary: 70000,
    month: 'June',
    year: '2023',
    paymentDate: '2023-06-30',
    status: 'paid',
  },
  {
    id: 5,
    employeeId: 'EMP005',
    name: 'Michael Wilson',
    department: 'Sales',
    designation: 'Sales Representative',
    salary: 60000,
    month: 'June',
    year: '2023',
    paymentDate: '2023-06-30',
    status: 'pending',
  },
];

// Mock data for payslip details
const payslipDetails = {
  employeeInfo: {
    name: 'John Doe',
    employeeId: 'EMP001',
    department: 'Engineering',
    designation: 'Senior Developer',
    joiningDate: '2020-01-15',
    bankAccount: 'XXXX-XXXX-XXXX-1234',
  },
  payPeriod: {
    month: 'June',
    year: '2023',
    daysWorked: 22,
  },
  earnings: [
    { type: 'Basic Salary', amount: 5000 },
    { type: 'House Rent Allowance', amount: 2000 },
    { type: 'Transport Allowance', amount: 800 },
    { type: 'Medical Allowance', amount: 500 },
    { type: 'Performance Bonus', amount: 1000 },
  ],
  deductions: [
    { type: 'Income Tax', amount: 1200 },
    { type: 'Provident Fund', amount: 600 },
    { type: 'Health Insurance', amount: 300 },
    { type: 'Professional Tax', amount: 200 },
  ],
  summary: {
    totalEarnings: 9300,
    totalDeductions: 2300,
    netSalary: 7000,
  },
};

const PayrollPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('june');
  const [yearFilter, setYearFilter] = useState('2023');
  const [selectedPayslip, setSelectedPayslip] = useState<any>(null);

  // Filter payroll data based on search query and filters
  const filteredData = payrollData.filter((record) => {
    const matchesSearch = 
      record.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = 
      departmentFilter === 'all' || 
      record.department.toLowerCase() === departmentFilter.toLowerCase();
    
    const matchesMonth =
      monthFilter === 'all' ||
      record.month.toLowerCase() === monthFilter.toLowerCase();
    
    const matchesYear =
      yearFilter === 'all' ||
      record.year === yearFilter;
    
    return matchesSearch && matchesDepartment && matchesMonth && matchesYear;
  });

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // View payslip details
  const viewPayslip = (employeeId: string) => {
    // In a real app, you would fetch the payslip details from the API
    // For now, we'll just use the mock data
    setSelectedPayslip(payslipDetails);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Payroll Management"
        description="Manage employee salaries and payroll processing"
      />
      
      <div className="flex flex-col md:flex-row gap-4 mt-6 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name or ID..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              <SelectItem value="january">January</SelectItem>
              <SelectItem value="february">February</SelectItem>
              <SelectItem value="march">March</SelectItem>
              <SelectItem value="april">April</SelectItem>
              <SelectItem value="may">May</SelectItem>
              <SelectItem value="june">June</SelectItem>
              <SelectItem value="july">July</SelectItem>
              <SelectItem value="august">August</SelectItem>
              <SelectItem value="september">September</SelectItem>
              <SelectItem value="october">October</SelectItem>
              <SelectItem value="november">November</SelectItem>
              <SelectItem value="december">December</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Department" />
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
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>
            Payroll for {monthFilter.charAt(0).toUpperCase() + monthFilter.slice(1)} {yearFilter}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.employeeId}</TableCell>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>{record.designation}</TableCell>
                    <TableCell>${record.salary.toLocaleString()}</TableCell>
                    <TableCell>{record.paymentDate}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => viewPayslip(record.employeeId)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Payslip Details</DialogTitle>
                              <DialogDescription>
                                Payslip for {record.month} {record.year}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedPayslip && (
                              <div className="mt-4">
                                <Tabs defaultValue="payslip">
                                  <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="payslip">Payslip</TabsTrigger>
                                    <TabsTrigger value="history">Payment History</TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="payslip" className="mt-4">
                                    <div className="border rounded-lg p-4">
                                      <div className="flex justify-between items-center mb-6">
                                        <div>
                                          <h3 className="text-lg font-bold">QORE Inc.</h3>
                                          <p className="text-sm text-muted-foreground">123 Business Street, City, Country</p>
                                        </div>
                                        <div className="text-right">
                                          <h3 className="text-lg font-bold">Payslip</h3>
                                          <p className="text-sm text-muted-foreground">
                                            {selectedPayslip.payPeriod.month} {selectedPayslip.payPeriod.year}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                          <h4 className="font-semibold mb-2">Employee Information</h4>
                                          <div className="space-y-1 text-sm">
                                            <p><span className="font-medium">Name:</span> {selectedPayslip.employeeInfo.name}</p>
                                            <p><span className="font-medium">Employee ID:</span> {selectedPayslip.employeeInfo.employeeId}</p>
                                            <p><span className="font-medium">Department:</span> {selectedPayslip.employeeInfo.department}</p>
                                            <p><span className="font-medium">Designation:</span> {selectedPayslip.employeeInfo.designation}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold mb-2">Pay Period</h4>
                                          <div className="space-y-1 text-sm">
                                            <p><span className="font-medium">Month:</span> {selectedPayslip.payPeriod.month}</p>
                                            <p><span className="font-medium">Year:</span> {selectedPayslip.payPeriod.year}</p>
                                            <p><span className="font-medium">Days Worked:</span> {selectedPayslip.payPeriod.daysWorked}</p>
                                            <p><span className="font-medium">Bank Account:</span> {selectedPayslip.employeeInfo.bankAccount}</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                          <h4 className="font-semibold mb-2">Earnings</h4>
                                          <div className="space-y-1 text-sm">
                                            {selectedPayslip.earnings.map((item: any, index: number) => (
                                              <div key={index} className="flex justify-between">
                                                <span>{item.type}</span>
                                                <span>${item.amount}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="font-semibold mb-2">Deductions</h4>
                                          <div className="space-y-1 text-sm">
                                            {selectedPayslip.deductions.map((item: any, index: number) => (
                                              <div key={index} className="flex justify-between">
                                                <span>{item.type}</span>
                                                <span>${item.amount}</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="border-t pt-4">
                                        <div className="flex justify-between font-semibold">
                                          <span>Total Earnings:</span>
                                          <span>${selectedPayslip.summary.totalEarnings}</span>
                                        </div>
                                        <div className="flex justify-between font-semibold">
                                          <span>Total Deductions:</span>
                                          <span>${selectedPayslip.summary.totalDeductions}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg mt-2">
                                          <span>Net Salary:</span>
                                          <span>${selectedPayslip.summary.netSalary}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="history">
                                    <div className="text-center py-8">
                                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                      <h3 className="mt-2 text-lg font-semibold">Payment History</h3>
                                      <p className="text-sm text-muted-foreground">
                                        Payment history will be displayed here.
                                      </p>
                                    </div>
                                  </TabsContent>
                                </Tabs>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No payroll records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
              <div className="text-2xl font-bold">$355,000</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Paid</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Badge className="mr-2 bg-green-500">3</Badge>
              <div className="text-2xl font-bold text-green-500">$230,000</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Badge className="mr-2 bg-yellow-500">2</Badge>
              <div className="text-2xl font-bold text-yellow-500">$125,000</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayrollPage;
