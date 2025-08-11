import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  target?: number;
}

interface AssignmentReport {
  id: string;
  clientName: string;
  positionTitle: string;
  submittedCandidates: number;
  interviewedCandidates: number;
  selectedCandidates: number;
  conversionRate: number;
  avgTimeToSubmit: number;
  status: 'Open' | 'In Progress' | 'Filled' | 'Cancelled';
  startDate: Date;
  endDate?: Date;
}

interface PaymentReport {
  id: string;
  month: string;
  totalEarnings: number;
  commissionsEarned: number;
  candidatesPlaced: number;
  avgCommissionRate: number;
  paymentStatus: 'Paid' | 'Pending' | 'Processing';
  paymentDate?: Date;
}

interface ComplianceReport {
  id: string;
  documentType: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Missing';
  expiryDate?: Date;
  lastUpdated: Date;
  daysUntilExpiry?: number;
}

const VendorReports: React.FC = () => {
  const { user, vendor } = useVendorAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('last-3-months');
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [assignmentReports, setAssignmentReports] = useState<AssignmentReport[]>([]);
  const [paymentReports, setPaymentReports] = useState<PaymentReport[]>([]);
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([]);

  useEffect(() => {
    const loadReportsData = async () => {
      try {
        // Mock performance metrics
        const mockMetrics: PerformanceMetric[] = [
          {
            id: '1',
            name: 'Total Assignments',
            value: 24,
            previousValue: 18,
            unit: 'assignments',
            trend: 'up',
            target: 30
          },
          {
            id: '2',
            name: 'Candidates Submitted',
            value: 156,
            previousValue: 142,
            unit: 'candidates',
            trend: 'up',
            target: 200
          },
          {
            id: '3',
            name: 'Placement Rate',
            value: 18.5,
            previousValue: 16.2,
            unit: '%',
            trend: 'up',
            target: 25
          }
        ];

        // Mock assignment reports
        const mockAssignments: AssignmentReport[] = [
          {
            id: '1',
            clientName: 'TechCorp Inc',
            positionTitle: 'Senior Software Developer',
            submittedCandidates: 8,
            interviewedCandidates: 3,
            selectedCandidates: 1,
            conversionRate: 12.5,
            avgTimeToSubmit: 1.5,
            status: 'Filled',
            startDate: new Date('2024-01-15'),
            endDate: new Date('2024-02-28')
          }
        ];

        // Mock payment reports
        const mockPayments: PaymentReport[] = [
          {
            id: '1',
            month: 'January 2024',
            totalEarnings: 45000,
            commissionsEarned: 9000,
            candidatesPlaced: 3,
            avgCommissionRate: 20,
            paymentStatus: 'Paid',
            paymentDate: new Date('2024-02-15')
          }
        ];

        // Mock compliance reports
        const mockCompliance: ComplianceReport[] = [
          {
            id: '1',
            documentType: 'Certificate of Insurance',
            status: 'Expiring Soon',
            expiryDate: new Date('2024-03-31'),
            lastUpdated: new Date('2024-01-15'),
            daysUntilExpiry: 45
          }
        ];

        setPerformanceMetrics(mockMetrics);
        setAssignmentReports(mockAssignments);
        setPaymentReports(mockPayments);
        setComplianceReports(mockCompliance);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load reports data:', error);
        setIsLoading(false);
      }
    };

    loadReportsData();
  }, [selectedPeriod]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Open': 'default',
      'In Progress': 'warning',
      'Filled': 'success',
      'Cancelled': 'secondary',
      'Paid': 'success',
      'Pending': 'warning',
      'Processing': 'warning',
      'Valid': 'success',
      'Expiring Soon': 'warning',
      'Expired': 'destructive',
      'Missing': 'destructive'
    };
    return variants[status] || 'secondary';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics, assignment analytics, and financial reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-3-months">Last 3 Months</SelectItem>
              <SelectItem value="last-6-months">Last 6 Months</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="ytd">Year to Date</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Performance Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {performanceMetrics.map((metric) => {
          const percentageChange = calculatePercentageChange(metric.value, metric.previousValue);
          const progressPercentage = metric.target ? (metric.value / metric.target) * 100 : 0;
          
          return (
            <Card key={metric.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                {getTrendIcon(metric.trend)}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.unit === '$' ? formatCurrency(metric.value) : `${metric.value}${metric.unit}`}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span className={`flex items-center ${percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {percentageChange >= 0 ? '+' : ''}{percentageChange.toFixed(1)}%
                  </span>
                  <span>from previous period</span>
                </div>
                {metric.target && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span>Progress to target</span>
                      <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="assignments" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="assignments" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Assignments</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assignments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Assignment Performance</CardTitle>
              <CardDescription>
                Detailed breakdown of assignment metrics and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assignment</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Conversion Rate</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignmentReports.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.positionTitle}</TableCell>
                      <TableCell>{assignment.clientName}</TableCell>
                      <TableCell>{assignment.submittedCandidates}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{assignment.conversionRate.toFixed(1)}%</span>
                          <Progress 
                            value={assignment.conversionRate} 
                            className="w-16 h-2" 
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(assignment.status)}>
                          {assignment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                Commission earnings and payment status by month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Payment reports will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status</CardTitle>
              <CardDescription>
                Document compliance status and expiration tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Compliance reports will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>
                Performance trends and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Advanced analytics will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorReports;
