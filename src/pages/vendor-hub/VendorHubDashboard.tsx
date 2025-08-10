import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  Calendar,
  Plus,
  RefreshCw,
  Eye,
  Settings
} from 'lucide-react';
import {
  VendorHealthSummary,
  PocTransitionTracker,
  EscalationRisk
} from '@/types/vendor';

const VendorHubDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  
  // Mock data - replace with actual API calls
  const [vendorHealth] = useState<VendorHealthSummary>({
    totalVendors: 45,
    activeVendors: 38,
    inactiveVendors: 7,
    primeVendors: 12,
    subVendors: 33,
    vendorsWithOutdatedPocs: 8,
    percentageWithOutdatedPocs: 17.8,
    alertsTriggered: 3,
    lastUpdated: new Date()
  });

  const [pocTransitions] = useState<PocTransitionTracker>({
    upcomingTransitions: [
      {
        pocId: '1',
        pocName: 'John Smith',
        vendorName: 'TechCorp Solutions',
        currentRole: 'Relationship Manager',
        transitionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        newPocName: 'Sarah Johnson',
        status: 'Scheduled'
      },
      {
        pocId: '2',
        pocName: 'Mike Davis',
        vendorName: 'Global IT Services',
        currentRole: 'Technical Lead',
        transitionDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'In Progress'
      }
    ],
    recentTransitions: [
      {
        pocId: '3',
        pocName: 'Lisa Chen',
        vendorName: 'DataFlow Inc',
        role: 'Account Manager',
        transitionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        previousPocName: 'Robert Wilson',
        status: 'Completed'
      }
    ]
  });

  const [escalationRisks] = useState<EscalationRisk>({
    vendorsWithoutBackupPoc: [
      {
        vendorId: '1',
        vendorName: 'CriticalTech Ltd',
        primaryPocName: 'Alice Brown',
        primaryPocRole: 'Relationship Manager',
        riskLevel: 'High'
      }
    ],
    pendingReplacements: [
      {
        vendorId: '2',
        vendorName: 'SecureNet Corp',
        pocName: 'Tom Wilson',
        pocRole: 'Legal Contact',
        replacementDue: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        daysOverdue: 5
      }
    ],
    unresponsiveContacts: [
      {
        vendorId: '3',
        vendorName: 'CloudFirst Solutions',
        pocName: 'Emma Davis',
        pocRole: 'Technical Lead',
        lastContact: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
        daysSinceContact: 21
      }
    ]
  });

  useEffect(() => {
    // Load data immediately for better UX
    setIsLoading(false);
    console.log('Dashboard loaded with mock data');
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setLastRefresh(new Date());
    // Simulate refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'High': return 'destructive';
      case 'Medium': return 'warning';
      case 'Low': return 'secondary';
      case 'Completed': return 'success';
      case 'In Progress': return 'warning';
      case 'Scheduled': return 'secondary';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor & PoC Hub</h1>
          <p className="text-muted-foreground">
            Centralized vendor and point of contact management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/vendor-hub/vendors/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorHealth.totalVendors}</div>
            <p className="text-xs text-muted-foreground">
              {vendorHealth.activeVendors} active, {vendorHealth.inactiveVendors} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prime Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorHealth.primeVendors}</div>
            <p className="text-xs text-muted-foreground">
              {vendorHealth.subVendors} sub vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outdated PoCs</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorHealth.vendorsWithOutdatedPocs}</div>
            <p className="text-xs text-muted-foreground">
              {vendorHealth.percentageWithOutdatedPocs.toFixed(1)}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorHealth.alertsTriggered}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transitions">PoC Transitions</TabsTrigger>
          <TabsTrigger value="risks">Escalation Risks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Vendor Health Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Health Status</CardTitle>
                <CardDescription>
                  Overall health metrics for vendor relationships
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Vendors</span>
                    <span>{vendorHealth.activeVendors}/{vendorHealth.totalVendors}</span>
                  </div>
                  <Progress 
                    value={(vendorHealth.activeVendors / vendorHealth.totalVendors) * 100} 
                    className="h-2"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Up-to-date PoCs</span>
                    <span>{vendorHealth.totalVendors - vendorHealth.vendorsWithOutdatedPocs}/{vendorHealth.totalVendors}</span>
                  </div>
                  <Progress 
                    value={((vendorHealth.totalVendors - vendorHealth.vendorsWithOutdatedPocs) / vendorHealth.totalVendors) * 100} 
                    className="h-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common tasks and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/vendor-hub/vendors">
                    <Eye className="h-4 w-4 mr-2" />
                    View All Vendors
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/vendor-hub/pocs">
                    <Users className="h-4 w-4 mr-2" />
                    Manage PoCs
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/vendor-hub/validation-reminders">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Validation Reminders
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/vendor-hub/reports">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Reports
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transitions" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Upcoming Transitions */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming PoC Transitions</CardTitle>
                <CardDescription>
                  Scheduled point of contact changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pocTransitions.upcomingTransitions.length > 0 ? (
                  <div className="space-y-3">
                    {pocTransitions.upcomingTransitions.map((transition) => (
                      <div key={transition.pocId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{transition.pocName}</p>
                          <p className="text-sm text-muted-foreground">{transition.vendorName}</p>
                          <p className="text-xs text-muted-foreground">{transition.currentRole}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={getStatusColor(transition.status)}>
                            {transition.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {transition.transitionDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No upcoming transitions</p>
                )}
              </CardContent>
            </Card>

            {/* Recent Transitions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent PoC Transitions</CardTitle>
                <CardDescription>
                  Recently completed point of contact changes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pocTransitions.recentTransitions.length > 0 ? (
                  <div className="space-y-3">
                    {pocTransitions.recentTransitions.map((transition) => (
                      <div key={transition.pocId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{transition.pocName}</p>
                          <p className="text-sm text-muted-foreground">{transition.vendorName}</p>
                          <p className="text-xs text-muted-foreground">{transition.role}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant={getStatusColor(transition.status)}>
                            {transition.status}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {transition.transitionDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No recent transitions</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          {/* Escalation Risks */}
          {escalationRisks.vendorsWithoutBackupPoc.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {escalationRisks.vendorsWithoutBackupPoc.length} vendor(s) without backup PoC contacts
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4">
            {/* Vendors without Backup PoC */}
            <Card>
              <CardHeader>
                <CardTitle>Vendors Without Backup PoC</CardTitle>
                <CardDescription>
                  High-risk vendors missing backup contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {escalationRisks.vendorsWithoutBackupPoc.length > 0 ? (
                  <div className="space-y-3">
                    {escalationRisks.vendorsWithoutBackupPoc.map((vendor) => (
                      <div key={vendor.vendorId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{vendor.vendorName}</p>
                          <p className="text-sm text-muted-foreground">
                            Primary: {vendor.primaryPocName} ({vendor.primaryPocRole})
                          </p>
                        </div>
                        <Badge variant={getStatusColor(vendor.riskLevel)}>
                          {vendor.riskLevel} Risk
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">All vendors have backup PoCs</p>
                )}
              </CardContent>
            </Card>

            {/* Pending Replacements */}
            <Card>
              <CardHeader>
                <CardTitle>Pending PoC Replacements</CardTitle>
                <CardDescription>
                  Overdue point of contact replacements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {escalationRisks.pendingReplacements.length > 0 ? (
                  <div className="space-y-3">
                    {escalationRisks.pendingReplacements.map((replacement) => (
                      <div key={replacement.vendorId} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="space-y-1">
                          <p className="font-medium">{replacement.vendorName}</p>
                          <p className="text-sm text-muted-foreground">
                            {replacement.pocName} ({replacement.pocRole})
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge variant="destructive">
                            {replacement.daysOverdue} days overdue
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Due: {replacement.replacementDue.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No pending replacements</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        Last updated: {lastRefresh.toLocaleString()}
      </div>
    </div>
  );
};

export default VendorHubDashboard;
