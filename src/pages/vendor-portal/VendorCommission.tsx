import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Download,
  FileText,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Calculator,
  Target,
  Banknote,
  Receipt
} from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';

interface CommissionSummary {
  totalEarned: number;
  currentMonth: number;
  pendingPayment: number;
  nextPaymentDate: Date;
  ytdEarnings: number;
  avgMonthlyEarnings: number;
  commissionRate: number;
  bonusEarnings: number;
}

interface CommissionDetail {
  id: string;
  candidateName: string;
  clientName: string;
  positionTitle: string;
  placementDate: Date;
  candidateSalary: number;
  commissionRate: number;
  commissionAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Processing' | 'On Hold';
  paymentDate?: Date;
  invoiceNumber?: string;
}

interface PaymentHistory {
  id: string;
  paymentDate: Date;
  amount: number;
  period: string;
  method: 'ACH' | 'Wire Transfer' | 'Check';
  status: 'Completed' | 'Processing' | 'Failed';
  referenceNumber: string;
  placements: number;
}

const VendorCommission: React.FC = () => {
  const { user, vendor } = useVendorAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current-year');
  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary | null>(null);
  const [commissionDetails, setCommissionDetails] = useState<CommissionDetail[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

  useEffect(() => {
    // Only show commission data for Sub Vendors
    if (vendor?.vendorType !== 'Sub Vendor') {
      setIsLoading(false);
      return;
    }

    const loadCommissionData = async () => {
      try {
        // Mock commission summary
        const mockSummary: CommissionSummary = {
          totalEarned: 245000,
          currentMonth: 18500,
          pendingPayment: 22000,
          nextPaymentDate: new Date('2024-03-15'),
          ytdEarnings: 125000,
          avgMonthlyEarnings: 20800,
          commissionRate: 20,
          bonusEarnings: 15000
        };

        // Mock commission details
        const mockDetails: CommissionDetail[] = [
          {
            id: '1',
            candidateName: 'John Doe',
            clientName: 'TechCorp Inc',
            positionTitle: 'Senior Software Developer',
            placementDate: new Date('2024-01-15'),
            candidateSalary: 120000,
            commissionRate: 20,
            commissionAmount: 24000,
            paymentStatus: 'Paid',
            paymentDate: new Date('2024-02-15'),
            invoiceNumber: 'INV-2024-001'
          },
          {
            id: '2',
            candidateName: 'Jane Smith',
            clientName: 'DataFlow Systems',
            positionTitle: 'DevOps Engineer',
            placementDate: new Date('2024-02-01'),
            candidateSalary: 110000,
            commissionRate: 20,
            commissionAmount: 22000,
            paymentStatus: 'Processing',
            invoiceNumber: 'INV-2024-002'
          }
        ];

        // Mock payment history
        const mockPayments: PaymentHistory[] = [
          {
            id: '1',
            paymentDate: new Date('2024-02-15'),
            amount: 45000,
            period: 'January 2024',
            method: 'ACH',
            status: 'Completed',
            referenceNumber: 'ACH-240215-001',
            placements: 2
          },
          {
            id: '2',
            paymentDate: new Date('2024-01-15'),
            amount: 38000,
            period: 'December 2023',
            method: 'ACH',
            status: 'Completed',
            referenceNumber: 'ACH-240115-001',
            placements: 2
          }
        ];

        setCommissionSummary(mockSummary);
        setCommissionDetails(mockDetails);
        setPaymentHistory(mockPayments);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load commission data:', error);
        setIsLoading(false);
      }
    };

    loadCommissionData();
  }, [vendor, selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Paid': 'success',
      'Pending': 'warning',
      'Processing': 'warning',
      'On Hold': 'secondary',
      'Completed': 'success',
      'Failed': 'destructive'
    };
    return variants[status] || 'secondary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading commission data...</p>
        </div>
      </div>
    );
  }

  // Show access denied for non-sub vendors
  if (vendor?.vendorType !== 'Sub Vendor') {
    return (
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commission & Payments</h1>
          <p className="text-muted-foreground">
            Commission tracking and payment management
          </p>
        </div>

        <Card>
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Commission Access Restricted</h3>
            <p className="text-gray-500 mb-4">
              Commission tracking is only available for Sub Vendor accounts.
            </p>
            <p className="text-sm text-gray-400">
              Your account type: <strong>{vendor?.vendorType}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commission & Payments</h1>
          <p className="text-muted-foreground">
            Track your earnings, payments, and commission details
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="current-quarter">Current Quarter</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="all-time">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Commission Summary Cards */}
      {commissionSummary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(commissionSummary.totalEarned)}</div>
              <p className="text-xs text-muted-foreground">
                All-time commission earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(commissionSummary.currentMonth)}</div>
              <p className="text-xs text-muted-foreground">
                Current month earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(commissionSummary.pendingPayment)}</div>
              <p className="text-xs text-muted-foreground">
                Next payment: {commissionSummary.nextPaymentDate.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{commissionSummary.commissionRate}%</div>
              <p className="text-xs text-muted-foreground">
                Base commission rate
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Next Payment Alert */}
      {commissionSummary && commissionSummary.pendingPayment > 0 && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Your next payment of <strong>{formatCurrency(commissionSummary.pendingPayment)}</strong> is 
            scheduled for <strong>{commissionSummary.nextPaymentDate.toLocaleDateString()}</strong>.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Commission Details</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>Payment History</span>
          </TabsTrigger>
          <TabsTrigger value="statements" className="flex items-center space-x-2">
            <Receipt className="h-4 w-4" />
            <span>Statements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Breakdown</CardTitle>
              <CardDescription>
                Detailed commission information for each placement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {commissionDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell className="font-medium">{detail.candidateName}</TableCell>
                      <TableCell>{detail.clientName}</TableCell>
                      <TableCell>{detail.positionTitle}</TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(detail.commissionAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(detail.paymentStatus)}>
                          {detail.paymentStatus}
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
                Record of all commission payments received
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.paymentDate.toLocaleDateString()}</TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>{payment.period}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statements" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Commission Statements</CardTitle>
              <CardDescription>
                Download detailed commission statements and tax documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['2024', '2023', '2022'].map((year) => (
                  <div key={year} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold">{year} Commission Statements</h4>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download All
                      </Button>
                    </div>
                    
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter) => (
                        <div key={quarter} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm font-medium">{quarter} {year}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorCommission;
