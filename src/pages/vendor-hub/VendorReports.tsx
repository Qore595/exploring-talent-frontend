import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Clock,
  Filter,
  RefreshCw,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';

interface ReportData {
  vendorsByType: Array<{ name: string; value: number; color: string }>;
  vendorsByTier: Array<{ name: string; value: number; color: string }>;
  pocsByRole: Array<{ name: string; value: number }>;
  validationTrends: Array<{ month: string; validated: number; overdue: number; failed: number }>;
  communicationStats: Array<{ type: string; sent: number; delivered: number; responded: number }>;
  vendorGrowth: Array<{ month: string; added: number; removed: number; total: number }>;
}

interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  vendorType: string;
  reportType: string;
}

const VendorReports: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateTo: new Date().toISOString().split('T')[0],
    vendorType: 'all',
    reportType: 'summary'
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockReportData: ReportData = {
      vendorsByType: [
        { name: 'Prime Vendor', value: 15, color: '#8884d8' },
        { name: 'Sub Vendor', value: 25, color: '#82ca9d' },
        { name: 'Consultant', value: 8, color: '#ffc658' },
        { name: 'Service Provider', value: 12, color: '#ff7300' }
      ],
      vendorsByTier: [
        { name: 'Preferred', value: 8, color: '#00C49F' },
        { name: 'Tier-2', value: 22, color: '#FFBB28' },
        { name: 'Tier-3', value: 18, color: '#FF8042' },
        { name: 'Standard', value: 12, color: '#8884d8' }
      ],
      pocsByRole: [
        { name: 'Relationship Manager', value: 25 },
        { name: 'Technical Lead', value: 18 },
        { name: 'Account Manager', value: 15 },
        { name: 'Legal Contact', value: 12 },
        { name: 'Billing Contact', value: 10 },
        { name: 'HR Contact', value: 8 },
        { name: 'Compliance Officer', value: 6 }
      ],
      validationTrends: [
        { month: 'Jan', validated: 45, overdue: 8, failed: 2 },
        { month: 'Feb', validated: 52, overdue: 6, failed: 1 },
        { month: 'Mar', validated: 48, overdue: 10, failed: 3 },
        { month: 'Apr', validated: 58, overdue: 5, failed: 2 },
        { month: 'May', validated: 62, overdue: 7, failed: 1 },
        { month: 'Jun', validated: 55, overdue: 9, failed: 4 }
      ],
      communicationStats: [
        { type: 'Email', sent: 245, delivered: 238, responded: 156 },
        { type: 'Phone', sent: 89, delivered: 89, responded: 67 },
        { type: 'SMS', sent: 156, delivered: 152, responded: 89 },
        { type: 'In-Person', sent: 34, delivered: 34, responded: 32 }
      ],
      vendorGrowth: [
        { month: 'Jan', added: 5, removed: 1, total: 45 },
        { month: 'Feb', added: 8, removed: 2, total: 51 },
        { month: 'Mar', added: 6, removed: 1, total: 56 },
        { month: 'Apr', added: 4, removed: 0, total: 60 },
        { month: 'May', added: 7, removed: 3, total: 64 },
        { month: 'Jun', added: 3, removed: 1, total: 66 }
      ]
    };

    // Load data immediately for better UX
    setReportData(mockReportData);
    setIsLoading(false);

    console.log('Loaded report data:', mockReportData);
  }, []);

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Generated report with filters:', filters);
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportReport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Exporting report as ${format}`);
    // TODO: Implement actual export functionality
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00C49F', '#FFBB28', '#FF8042'];

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

  if (!reportData) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Failed to load report data. Please try again.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into vendor performance and PoC management
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => handleExportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Customize your report parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendorType">Vendor Type</Label>
              <Select
                value={filters.vendorType}
                onValueChange={(value) => setFilters(prev => ({ ...prev, vendorType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Prime Vendor">Prime Vendor</SelectItem>
                  <SelectItem value="Sub Vendor">Sub Vendor</SelectItem>
                  <SelectItem value="Consultant">Consultant</SelectItem>
                  <SelectItem value="Service Provider">Service Provider</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select
                value={filters.reportType}
                onValueChange={(value) => setFilters(prev => ({ ...prev, reportType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Summary</SelectItem>
                  <SelectItem value="detailed">Detailed</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.vendorsByType.reduce((sum, item) => sum + item.value, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active PoCs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reportData.pocsByRole.reduce((sum, item) => sum + item.value, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              +3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">73%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="h-3 w-3 inline mr-1" />
              -2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends">
            <Activity className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="communication">
            <Mail className="h-4 w-4 mr-2" />
            Communication
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <CheckCircle className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vendors by Type</CardTitle>
                <CardDescription>Distribution of vendor types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.vendorsByType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.vendorsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendors by Tier Level</CardTitle>
                <CardDescription>Vendor tier distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={reportData.vendorsByTier}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.vendorsByTier.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Points of Contact by Role</CardTitle>
              <CardDescription>Distribution of PoC roles across all vendors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.pocsByRole}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Validation Trends</CardTitle>
                <CardDescription>PoC validation status over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={reportData.validationTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="validated" stackId="1" stroke="#00C49F" fill="#00C49F" />
                    <Area type="monotone" dataKey="overdue" stackId="1" stroke="#FFBB28" fill="#FFBB28" />
                    <Area type="monotone" dataKey="failed" stackId="1" stroke="#FF8042" fill="#FF8042" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vendor Growth</CardTitle>
                <CardDescription>Vendor additions and removals over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.vendorGrowth}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="added" stroke="#00C49F" strokeWidth={2} />
                    <Line type="monotone" dataKey="removed" stroke="#FF8042" strokeWidth={2} />
                    <Line type="monotone" dataKey="total" stroke="#8884d8" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Statistics</CardTitle>
              <CardDescription>Communication effectiveness by channel</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.communicationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sent" fill="#8884d8" name="Sent" />
                  <Bar dataKey="delivered" fill="#82ca9d" name="Delivered" />
                  <Bar dataKey="responded" fill="#ffc658" name="Responded" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Response Rates by Channel</CardTitle>
                <CardDescription>Effectiveness of different communication methods</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.communicationStats.map((stat, index) => {
                  const responseRate = (stat.responded / stat.sent) * 100;
                  return (
                    <div key={stat.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{stat.type}</span>
                        <span className="text-sm text-muted-foreground">
                          {responseRate.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={responseRate} className="h-2" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Volume</CardTitle>
                <CardDescription>Total communications sent this period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.communicationStats.map((stat, index) => (
                  <div key={stat.type} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {stat.type === 'Email' && <Mail className="h-4 w-4" />}
                      {stat.type === 'Phone' && <Phone className="h-4 w-4" />}
                      {stat.type === 'SMS' && <MessageSquare className="h-4 w-4" />}
                      {stat.type === 'In-Person' && <Users className="h-4 w-4" />}
                      <span className="text-sm">{stat.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{stat.sent}</div>
                      <div className="text-xs text-muted-foreground">sent</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Validation Compliance</CardTitle>
                <CardDescription>Current validation status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Validated</span>
                    <Badge variant="success">87%</Badge>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overdue</span>
                    <Badge variant="warning">10%</Badge>
                  </div>
                  <Progress value={10} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed</span>
                    <Badge variant="destructive">3%</Badge>
                  </div>
                  <Progress value={3} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Vendor risk levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">Low Risk</span>
                  </div>
                  <span className="text-sm font-medium">45</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <span className="text-sm font-medium">12</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm">High Risk</span>
                  </div>
                  <span className="text-sm font-medium">3</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Score</CardTitle>
                <CardDescription>Overall compliance rating</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">92</div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                  <Progress value={92} className="h-3" />
                </div>

                <div className="text-center">
                  <Badge variant="success" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Excellent
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Issues</CardTitle>
              <CardDescription>Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>3 vendors</strong> have PoCs with overdue validations requiring immediate attention.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <strong>5 vendors</strong> have validations expiring within the next 30 days.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>1 vendor</strong> has failed validation attempts and requires manual intervention.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorReports;
