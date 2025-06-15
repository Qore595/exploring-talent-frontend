import { useState } from 'react';
import { Search, Filter, Eye, Check, X, Calendar, Download } from 'lucide-react';
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
import { format } from 'date-fns';

// Mock data for leave requests
const leaveRequestsData = [
  {
    id: 1,
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    department: 'Engineering',
    leaveType: 'Annual Leave',
    startDate: '2023-06-15',
    endDate: '2023-06-20',
    days: 6,
    reason: 'Family vacation',
    status: 'pending',
    appliedOn: '2023-06-01',
  },
  {
    id: 2,
    employeeId: 'EMP002',
    employeeName: 'Jane Smith',
    department: 'Marketing',
    leaveType: 'Sick Leave',
    startDate: '2023-06-10',
    endDate: '2023-06-12',
    days: 3,
    reason: 'Not feeling well, need to rest',
    status: 'approved',
    appliedOn: '2023-06-05',
    approvedBy: 'Michael Wilson',
    approvedOn: '2023-06-06',
  },
  {
    id: 3,
    employeeId: 'EMP003',
    employeeName: 'Robert Johnson',
    department: 'Human Resources',
    leaveType: 'Personal Leave',
    startDate: '2023-06-22',
    endDate: '2023-06-23',
    days: 2,
    reason: 'Personal matters to attend to',
    status: 'rejected',
    appliedOn: '2023-06-08',
    rejectedBy: 'Michael Wilson',
    rejectedOn: '2023-06-09',
    rejectionReason: 'High workload during this period',
  },
  {
    id: 4,
    employeeId: 'EMP004',
    employeeName: 'Emily Davis',
    department: 'Finance',
    leaveType: 'Maternity Leave',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    days: 92,
    reason: 'Maternity leave for upcoming childbirth',
    status: 'approved',
    appliedOn: '2023-05-15',
    approvedBy: 'Michael Wilson',
    approvedOn: '2023-05-16',
  },
  {
    id: 5,
    employeeId: 'EMP005',
    employeeName: 'Michael Wilson',
    department: 'Sales',
    leaveType: 'Bereavement Leave',
    startDate: '2023-06-12',
    endDate: '2023-06-14',
    days: 3,
    reason: 'Death in the family',
    status: 'approved',
    appliedOn: '2023-06-11',
    approvedBy: 'John Doe',
    approvedOn: '2023-06-11',
  },
];

const LeaveRequestsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter leave requests based on search query and filters
  const filteredData = leaveRequestsData.filter((request) => {
    const matchesSearch = 
      request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      request.status === statusFilter;
    
    const matchesDepartment = 
      departmentFilter === 'all' || 
      request.department.toLowerCase() === departmentFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Handle view request
  const handleViewRequest = (request: any) => {
    setSelectedRequest(request);
    setIsViewDialogOpen(true);
  };

  // Handle approve request
  const handleApproveClick = (request: any) => {
    setSelectedRequest(request);
    setIsApproveDialogOpen(true);
  };

  // Handle reject request
  const handleRejectClick = (request: any) => {
    setSelectedRequest(request);
    setIsRejectDialogOpen(true);
  };

  // Approve leave request
  const approveLeaveRequest = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the approval to your API
      console.log('Approving leave request:', selectedRequest?.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Leave Request Approved',
        description: 'The leave request has been successfully approved.',
      });
      
      // Close dialog
      setIsApproveDialogOpen(false);
      setSelectedRequest(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error approving the leave request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reject leave request
  const rejectLeaveRequest = async () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a reason for rejection.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically send the rejection to your API
      console.log('Rejecting leave request:', selectedRequest?.id, 'Reason:', rejectionReason);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Leave Request Rejected',
        description: 'The leave request has been rejected.',
      });
      
      // Close dialog and reset form
      setIsRejectDialogOpen(false);
      setSelectedRequest(null);
      setRejectionReason('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error rejecting the leave request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Leave Requests"
        description="Manage and process employee leave applications"
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
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
          
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Applied On</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="text-sm text-muted-foreground">{request.employeeId}</div>
                      </div>
                    </TableCell>
                    <TableCell>{request.department}</TableCell>
                    <TableCell>{request.leaveType}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {request.startDate} to {request.endDate}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>{request.appliedOn}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleViewRequest(request)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        
                        {request.status === 'pending' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-green-500"
                              onClick={() => handleApproveClick(request)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="text-red-500"
                              onClick={() => handleRejectClick(request)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">
                    No leave requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* View Leave Request Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Leave Request Details</DialogTitle>
            <DialogDescription>
              View the details of the leave request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Employee</h3>
                  <p className="text-base">{selectedRequest.employeeName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Employee ID</h3>
                  <p className="text-base">{selectedRequest.employeeId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                  <p className="text-base">{selectedRequest.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Leave Type</h3>
                  <p className="text-base">{selectedRequest.leaveType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Start Date</h3>
                  <p className="text-base">{selectedRequest.startDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">End Date</h3>
                  <p className="text-base">{selectedRequest.endDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Days</h3>
                  <p className="text-base">{selectedRequest.days}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p className="text-base">{getStatusBadge(selectedRequest.status)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Applied On</h3>
                  <p className="text-base">{selectedRequest.appliedOn}</p>
                </div>
                
                {selectedRequest.status === 'approved' && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Approved By</h3>
                      <p className="text-base">{selectedRequest.approvedBy}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Approved On</h3>
                      <p className="text-base">{selectedRequest.approvedOn}</p>
                    </div>
                  </>
                )}
                
                {selectedRequest.status === 'rejected' && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Rejected By</h3>
                      <p className="text-base">{selectedRequest.rejectedBy}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Rejected On</h3>
                      <p className="text-base">{selectedRequest.rejectedOn}</p>
                    </div>
                  </>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Reason</h3>
                <p className="text-base">{selectedRequest.reason}</p>
              </div>
              
              {selectedRequest.status === 'rejected' && selectedRequest.rejectionReason && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Rejection Reason</h3>
                  <p className="text-base">{selectedRequest.rejectionReason}</p>
                </div>
              )}
              
              <DialogFooter>
                <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Approve Leave Request Dialog */}
      <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Leave Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this leave request?
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Employee</h3>
                  <p className="text-base">{selectedRequest.employeeName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Leave Type</h3>
                  <p className="text-base">{selectedRequest.leaveType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p className="text-base">{selectedRequest.startDate} to {selectedRequest.endDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Days</h3>
                  <p className="text-base">{selectedRequest.days}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-green-500 hover:bg-green-600" 
                  onClick={approveLeaveRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Approving...' : 'Approve Leave'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Reject Leave Request Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this leave request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Employee</h3>
                  <p className="text-base">{selectedRequest.employeeName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Leave Type</h3>
                  <p className="text-base">{selectedRequest.leaveType}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                  <p className="text-base">{selectedRequest.startDate} to {selectedRequest.endDate}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Days</h3>
                  <p className="text-base">{selectedRequest.days}</p>
                </div>
              </div>
              
              <div>
                <label htmlFor="rejection-reason" className="text-sm font-medium">
                  Reason for Rejection *
                </label>
                <Input
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejection"
                  className="mt-1"
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={rejectLeaveRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Rejecting...' : 'Reject Leave'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveRequestsPage;
