import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, ArrowLeft, Eye, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/adminPermissions';
import { ApprovalRequest } from '@/types/marginCalculator';
import { marginCalculatorService } from '@/services/marginCalculatorService';
import ApprovalDialog from '@/components/margin-calculator/ApprovalDialog';
import { toast } from '@/hooks/use-toast';

const ApprovalsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const isManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const canApprove = adminUser || isManager;

  // State
  const [pendingApprovals, setPendingApprovals] = useState<ApprovalRequest[]>([]);
  const [recentApprovals, setRecentApprovals] = useState<ApprovalRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    pendingApprovals: 0,
    approvedToday: 0,
    averageResponseTime: '0h',
  });

  // Load data
  useEffect(() => {
    loadApprovals();
    loadStatistics();
  }, []);

  const loadApprovals = async () => {
    try {
      setLoading(true);
      const [pending, recent] = await Promise.all([
        marginCalculatorService.getPendingApprovals(),
        marginCalculatorService.getApprovalRequests({ status: 'approved' }),
      ]);
      setPendingApprovals(pending);
      setRecentApprovals(recent.slice(0, 5)); // Show only recent 5
    } catch (error) {
      console.error('Error loading approvals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load approval requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await marginCalculatorService.getStatistics();
      setStatistics({
        pendingApprovals: stats.pendingApprovals,
        approvedToday: stats.approvedToday,
        averageResponseTime: stats.averageResponseTime,
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleViewRequest = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setDialogOpen(true);
  };

  const handleApprove = async (requestId: string, comments?: string) => {
    try {
      await marginCalculatorService.processApproval({
        requestId,
        action: 'approve',
        comments,
      });

      toast({
        title: 'Request Approved',
        description: 'The approval request has been approved successfully.',
      });

      // Reload data
      await loadApprovals();
      await loadStatistics();
    } catch (error) {
      console.error('Error approving request:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve the request',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (requestId: string, comments?: string) => {
    try {
      await marginCalculatorService.processApproval({
        requestId,
        action: 'reject',
        comments,
      });

      toast({
        title: 'Request Rejected',
        description: 'The approval request has been rejected.',
      });

      // Reload data
      await loadApprovals();
      await loadStatistics();
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast({
        title: 'Error',
        description: 'Failed to reject the request',
        variant: 'destructive',
      });
    }
  };



  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commission-override': return 'Commission Override';
      case 'vendor-commission-change': return 'Vendor Commission Change';
      default: return type;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/margin-calculator/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <CheckCircle className="h-8 w-8 mr-3 text-blue-500" />
            Margin Calculator Approvals
          </h1>
          <p className="text-muted-foreground mt-2">
            Review and approve commission overrides and vendor commission changes
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Requires your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.approvedToday}</div>
            <p className="text-xs text-muted-foreground">+2 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">-15min from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>Requests awaiting your review and approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingApprovals.map((approval) => (
              <div key={approval.id} className="border rounded-lg p-4 hover:bg-muted/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{approval.candidateName}</h3>
                      <Badge variant="outline">{getTypeLabel(approval.type)}</Badge>
                      <Badge className={getPriorityColor(approval.priority)}>
                        {approval.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{approval.position}</p>
                    <p className="text-sm mb-2"><strong>Requested by:</strong> {approval.requestedBy}</p>
                    <p className="text-sm mb-2"><strong>Reason:</strong> {approval.reason}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span><strong>Client Budget:</strong> ${approval.clientBudget}/hr</span>
                      <span><strong>Original:</strong> {approval.type.includes('commission') ? `$${approval.originalValue}` : `${approval.originalValue}%`}</span>
                      <span><strong>Requested:</strong> {approval.type.includes('commission') ? `$${approval.requestedValue}` : `${approval.requestedValue}%`}</span>
                      <span><strong>Submitted:</strong> {approval.submittedDate}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewRequest(approval)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {canApprove ? 'Review' : 'View'}
                    </Button>
                    {canApprove && (
                      <>
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(approval.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Approvals */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Approvals</CardTitle>
          <CardDescription>Recently processed approval requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentApprovals.map((approval) => (
              <div key={approval.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{approval.candidateName}</h3>
                    <Badge variant="outline">{getTypeLabel(approval.type)}</Badge>
                    <Badge className={getStatusColor(approval.status)}>
                      {approval.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{approval.position}</p>
                  <div className="flex items-center space-x-4 text-sm mt-2">
                    <span><strong>Approved by:</strong> {approval.approvedBy || 'N/A'}</span>
                    <span><strong>Date:</strong> {approval.approvedDate || 'N/A'}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Approval Dialog */}
      <ApprovalDialog
        request={selectedRequest}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
        canApprove={canApprove}
      />
    </div>
  );
};

export default ApprovalsPage;
