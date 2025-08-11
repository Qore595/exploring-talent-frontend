import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building,
  Users,
  FileText,
  Bell,
  TrendingUp,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Upload,
  Download,
  Eye,
  MessageSquare,
  Shield,
  Activity
} from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { VendorDashboardStats, VendorNotification, VendorAssignment } from '@/types/vendor-portal';

const VendorDashboard: React.FC = () => {
  const { user, vendor } = useVendorAuth();
  const [stats, setStats] = useState<VendorDashboardStats | null>(null);
  const [notifications, setNotifications] = useState<VendorNotification[]>([]);
  const [recentAssignments, setRecentAssignments] = useState<VendorAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only load data if vendor is available
    if (!vendor) {
      return;
    }

    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        // Mock data - replace with actual API calls
        const mockStats: VendorDashboardStats = {
          activeAssignments: 8,
          totalCandidates: 24,
          pendingDocuments: 2,
          unreadNotifications: 5,
          complianceScore: 92,
          lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        };

        const mockNotifications: VendorNotification[] = [
          {
            id: '1',
            vendorId: vendor.id,
            type: 'Compliance Document',
            title: 'Insurance Certificate Expiring Soon',
            message: 'Your Certificate of Insurance expires in 30 days. Please upload a renewed certificate.',
            priority: 'High',
            isRead: false,
            actionRequired: true,
            actionUrl: '/vendor-portal/compliance',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            vendorId: vendor.id,
            type: 'PoC Validation',
            title: 'PoC Validation Required',
            message: 'Please validate your primary contact information.',
            priority: 'Medium',
            isRead: false,
            actionRequired: true,
            actionUrl: '/vendor-portal/contacts',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          },
          {
            id: '3',
            vendorId: vendor.id,
            type: 'Assignment Update',
            title: 'New Assignment Available',
            message: 'A new software developer position is available for TechCorp Inc.',
            priority: 'Medium',
            isRead: true,
            actionRequired: false,
            actionUrl: '/vendor-portal/assignments',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          }
        ];

        const mockAssignments: VendorAssignment[] = [
          {
            id: '1',
            clientName: 'TechCorp Inc',
            positionTitle: 'Senior Software Developer',
            status: 'Open',
            startDate: new Date('2024-02-01'),
            candidates: [],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            clientName: 'DataFlow Systems',
            positionTitle: 'DevOps Engineer',
            status: 'In Progress',
            startDate: new Date('2024-01-15'),
            candidates: [
              {
                id: '1',
                assignmentId: '2',
                name: 'John Doe',
                email: 'john.doe@email.com',
                status: 'Interviewing',
                submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
              }
            ],
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ];

        setStats(mockStats);
        setNotifications(mockNotifications);
        setRecentAssignments(mockAssignments);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [vendor?.id]);

  const getComplianceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      'Critical': 'destructive',
      'High': 'destructive',
      'Medium': 'warning',
      'Low': 'secondary'
    };
    return variants[priority] || 'secondary';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Open': 'default',
      'In Progress': 'warning',
      'Filled': 'success',
      'Cancelled': 'secondary',
      'Completed': 'success'
    };
    return variants[status] || 'secondary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-muted-foreground">
            {vendor?.displayName} • Last login: {stats?.lastLogin.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to="/vendor-portal/profile">
              <Building className="h-4 w-4 mr-2" />
              View Profile
            </Link>
          </Button>
          <Button asChild>
            <Link to="/vendor-portal/assignments">
              <FileText className="h-4 w-4 mr-2" />
              View Assignments
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeAssignments}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8 this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getComplianceColor(stats?.complianceScore || 0)}`}>
              {stats?.complianceScore}%
            </div>
            <Progress value={stats?.complianceScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unreadNotifications}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingDocuments} require action
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Notifications
              <Button variant="ghost" size="sm" asChild>
                <Link to="/vendor-portal/notifications">
                  View All
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Important updates and action items
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {notification.priority === 'Critical' || notification.priority === 'High' ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : notification.actionRequired ? (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <Badge variant={getPriorityBadge(notification.priority)}>
                      {notification.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      {notification.createdAt.toLocaleDateString()}
                    </p>
                    {notification.actionRequired && (
                      <Button variant="outline" size="sm" asChild>
                        <Link to={notification.actionUrl || '#'}>
                          Take Action
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No notifications at this time</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Recent Assignments
              <Button variant="ghost" size="sm" asChild>
                <Link to="/vendor-portal/assignments">
                  View All
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Latest assignment opportunities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentAssignments.map((assignment) => (
              <div key={assignment.id} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{assignment.positionTitle}</h4>
                  <Badge variant={getStatusBadge(assignment.status)}>
                    {assignment.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {assignment.clientName}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Start: {assignment.startDate.toLocaleDateString()}</span>
                  <span>{assignment.candidates.length} candidates</span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/vendor-portal/assignments/${assignment.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Link>
                  </Button>
                  {assignment.status === 'Open' && (
                    <Button size="sm" asChild>
                      <Link to={`/vendor-portal/assignments/${assignment.id}/submit`}>
                        <Upload className="h-3 w-3 mr-1" />
                        Submit Candidate
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {recentAssignments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No assignments available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/vendor-portal/compliance">
                <Upload className="h-6 w-6 mb-2" />
                Upload Documents
              </Link>
            </Button>

            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/vendor-portal/contacts">
                <Users className="h-6 w-6 mb-2" />
                Manage Contacts
              </Link>
            </Button>

            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/vendor-portal/messages">
                <MessageSquare className="h-6 w-6 mb-2" />
                Send Message
              </Link>
            </Button>

            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link to="/vendor-portal/reports">
                <Activity className="h-6 w-6 mb-2" />
                View Reports
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Alert */}
      {stats && stats.complianceScore < 90 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your compliance score is below 90%. Please review and update your compliance documents to maintain good standing.
            <Button variant="link" className="p-0 h-auto ml-2" asChild>
              <Link to="/vendor-portal/compliance">
                Review Compliance →
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default VendorDashboard;
