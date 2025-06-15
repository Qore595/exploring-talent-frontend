import { useState } from 'react';
import { Calendar, BarChart3, PieChart, Download, Filter, RefreshCw, DollarSign, Users, Clock, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Mock data for reports
const hiringData = [
  { month: 'Jan', candidates: 45, interviews: 32, hires: 12, screenings: 38, rejections: 26, timeToHire: 32 },
  { month: 'Feb', candidates: 52, interviews: 38, hires: 15, screenings: 45, rejections: 30, timeToHire: 30 },
  { month: 'Mar', candidates: 61, interviews: 45, hires: 18, screenings: 52, rejections: 34, timeToHire: 28 },
  { month: 'Apr', candidates: 67, interviews: 50, hires: 22, screenings: 58, rejections: 36, timeToHire: 26 },
  { month: 'May', candidates: 70, interviews: 55, hires: 25, screenings: 62, rejections: 38, timeToHire: 25 },
  { month: 'Jun', candidates: 78, interviews: 60, hires: 28, screenings: 68, rejections: 40, timeToHire: 24 },
];

// Detailed team performance data
const teamPerformance = [
  {
    team: 'Engineering',
    openPositions: 5,
    candidates: 120,
    interviews: 45,
    hires: 8,
    timeToHire: 28,
    efficiency: 85,
    costPerHire: 4200,
    retentionRate: 92,
    color: '#8884d8'
  },
  {
    team: 'Product',
    openPositions: 3,
    candidates: 85,
    interviews: 32,
    hires: 5,
    timeToHire: 35,
    efficiency: 78,
    costPerHire: 3800,
    retentionRate: 88,
    color: '#83a6ed'
  },
  {
    team: 'Design',
    openPositions: 2,
    candidates: 65,
    interviews: 28,
    hires: 4,
    timeToHire: 30,
    efficiency: 82,
    costPerHire: 3500,
    retentionRate: 90,
    color: '#8dd1e1'
  },
  {
    team: 'Marketing',
    openPositions: 4,
    candidates: 95,
    interviews: 40,
    hires: 6,
    timeToHire: 25,
    efficiency: 88,
    costPerHire: 3200,
    retentionRate: 85,
    color: '#82ca9d'
  },
  {
    team: 'Sales',
    openPositions: 6,
    candidates: 110,
    interviews: 50,
    hires: 10,
    timeToHire: 22,
    efficiency: 90,
    costPerHire: 2800,
    retentionRate: 82,
    color: '#ffc658'
  },
];

// Enhanced budget data with profit metrics
const budgetData = [
  {
    month: 'Jan',
    allocated: 25000,
    spent: 22500,
    remaining: 2500,
    clientBudget: 42000,
    companyProfit: 19500,
    profitMargin: 46.4,
    candidatePayouts: 18000,
    companyFees: 4500,
    trend: 'up'
  },
  {
    month: 'Feb',
    allocated: 28000,
    spent: 26000,
    remaining: 2000,
    clientBudget: 48000,
    companyProfit: 22000,
    profitMargin: 45.8,
    candidatePayouts: 20800,
    companyFees: 5200,
    trend: 'up'
  },
  {
    month: 'Mar',
    allocated: 30000,
    spent: 29000,
    remaining: 1000,
    clientBudget: 52000,
    companyProfit: 23000,
    profitMargin: 44.2,
    candidatePayouts: 23200,
    companyFees: 5800,
    trend: 'down'
  },
  {
    month: 'Apr',
    allocated: 32000,
    spent: 30500,
    remaining: 1500,
    clientBudget: 56000,
    companyProfit: 25500,
    profitMargin: 45.5,
    candidatePayouts: 24400,
    companyFees: 6100,
    trend: 'up'
  },
  {
    month: 'May',
    allocated: 35000,
    spent: 33000,
    remaining: 2000,
    clientBudget: 62000,
    companyProfit: 29000,
    profitMargin: 46.8,
    candidatePayouts: 26400,
    companyFees: 6600,
    trend: 'up'
  },
  {
    month: 'Jun',
    allocated: 38000,
    spent: 36000,
    remaining: 2000,
    clientBudget: 68000,
    companyProfit: 32000,
    profitMargin: 47.1,
    candidatePayouts: 28800,
    companyFees: 7200,
    trend: 'up'
  },
];

// Profit optimization data
const profitOptimizationData = [
  {
    position: 'Senior Software Engineer',
    clientBudget: 120,
    internalBudget: 85,
    clientToCompany: 35,
    companyToCandidate: 17,
    totalProfit: 52,
    profitMargin: 43.3
  },
  {
    position: 'Product Manager',
    clientBudget: 110,
    internalBudget: 80,
    clientToCompany: 30,
    companyToCandidate: 16,
    totalProfit: 46,
    profitMargin: 41.8
  },
  {
    position: 'UX Designer',
    clientBudget: 95,
    internalBudget: 70,
    clientToCompany: 25,
    companyToCandidate: 14,
    totalProfit: 39,
    profitMargin: 41.1
  },
  {
    position: 'Data Scientist',
    clientBudget: 130,
    internalBudget: 90,
    clientToCompany: 40,
    companyToCandidate: 18,
    totalProfit: 58,
    profitMargin: 44.6
  },
  {
    position: 'DevOps Engineer',
    clientBudget: 115,
    internalBudget: 82,
    clientToCompany: 33,
    companyToCandidate: 16.4,
    totalProfit: 49.4,
    profitMargin: 43.0
  }
];

// Location performance data
const locationPerformanceData = [
  {
    location: 'Miami Headquarters',
    openPositions: 12,
    filledPositions: 8,
    candidates: 180,
    interviews: 95,
    hires: 18,
    timeToHire: 26,
    revenue: 86000,
    profit: 38000
  },
  {
    location: 'New York Office',
    openPositions: 8,
    filledPositions: 5,
    candidates: 140,
    interviews: 75,
    hires: 12,
    timeToHire: 28,
    revenue: 72000,
    profit: 32000
  },
  {
    location: 'San Francisco Office',
    openPositions: 10,
    filledPositions: 6,
    candidates: 160,
    interviews: 85,
    hires: 15,
    timeToHire: 24,
    revenue: 78000,
    profit: 35000
  }
];

// Colors for charts
const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c'];

// Summary metrics
const summaryMetrics = {
  totalHires: 78,
  totalRevenue: 328000,
  totalProfit: 87500,
  profitGrowth: 12.5,
  clientToCompanyProfit: 65000,
  profitMargin: 26,
  companyToCandidateProfit: 22500,
  companySplit: 20,
  candidateSplit: 80,
  avgTimeToHire: 26,
  avgProfitMargin: 45.2,
  topPerformingTeam: 'Sales',
  topPerformingLocation: 'Miami Headquarters'
};

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState('last-6-months');
  const [reportType, setReportType] = useState('hiring');
  const { user } = useAuth();
  const isAdmin = user?.role === 'ceo';
  const isHiringManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';

  // Filter location performance data based on user's role and location
  const filteredLocationData = (() => {
    if (isAdmin) {
      return locationPerformanceData; // CEO sees all locations
    } else if (isHiringManager && user?.locationId) {
      // Map locationId to location name
      const locationMap: Record<string, string> = {
        'loc-1': 'Miami Headquarters',
        'loc-2': 'New York Office',
        'loc-3': 'San Francisco Office',
        'loc-4': 'Chicago Office'
      };

      const userLocationName = locationMap[user.locationId];

      // Filter to only show data for the user's location
      return locationPerformanceData.filter(location =>
        location.location === userLocationName
      );
    }

    return locationPerformanceData;
  })();

  const handleExportReport = () => {
    toast({
      title: "Report Exported",
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been exported as CSV`,
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Report data has been updated with the latest information",
    });
  };

  // Custom tooltip formatter for charts
  const formatTooltipValue = (value: number, name: string) => {
    if (name.toLowerCase().includes('profit') || name.toLowerCase().includes('budget') ||
        name.toLowerCase().includes('revenue') || name.toLowerCase().includes('cost')) {
      return [`$${value.toLocaleString()}`, name];
    }
    if (name.toLowerCase().includes('rate') || name.toLowerCase().includes('margin')) {
      return [`${value}%`, name];
    }
    return [value, name];
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground mt-2">
            Analyze recruitment metrics and performance data
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Profit Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                <p className="text-xl font-bold">${summaryMetrics.totalProfit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">YTD Profit</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUp className="h-3 w-3 mr-1" /> {summaryMetrics.profitGrowth}%
              </Badge>
              <span className="text-muted-foreground">from last year</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Client-to-Company</p>
                <p className="text-xl font-bold">${summaryMetrics.clientToCompanyProfit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Profit Margin</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">
                {summaryMetrics.profitMargin}%
              </Badge>
              <span className="text-muted-foreground">of client budget</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Company-to-Candidate</p>
                <p className="text-xl font-bold">${summaryMetrics.companyToCandidateProfit.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">Average Split</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">
                {summaryMetrics.companySplit}%
              </Badge>
              <span className="text-muted-foreground">company / {summaryMetrics.candidateSplit}% candidate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Hires</p>
                <p className="text-lg font-bold">{summaryMetrics.totalHires}</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUp className="h-3 w-3 mr-1" /> 12%
              </Badge>
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-lg font-bold">${summaryMetrics.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUp className="h-3 w-3 mr-1" /> 8.5%
              </Badge>
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</p>
                <p className="text-lg font-bold">{summaryMetrics.avgTimeToHire} days</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowDown className="h-3 w-3 mr-1" /> 3 days
              </Badge>
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-lg font-bold">{(summaryMetrics.totalHires / 180 * 100).toFixed(1)}%</p>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUp className="h-3 w-3 mr-1" /> 2.3%
              </Badge>
              <span className="text-muted-foreground">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-4">
            <div className="w-full md:w-auto">
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hiring">Hiring Metrics</SelectItem>
                  <SelectItem value="team">Team Performance</SelectItem>
                  <SelectItem value="budget">Budget Analysis</SelectItem>
                  {(isAdmin || isHiringManager) && (
                    <SelectItem value="profit">Profit Optimization</SelectItem>
                  )}
                  {isAdmin && (
                    <SelectItem value="location">Location Performance</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-auto">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="year-to-date">Year to Date</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">
            <BarChart3 className="h-4 w-4 mr-2" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="tables">
            <i className="list text-xs font-bold mr-2">≡</i>
            Tables
          </TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-4">
          {reportType === 'hiring' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Hiring Efficiency</CardTitle>
                  <CardDescription>Time to hire and screening metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={hiringData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="screenings"
                          stroke="#8884d8"
                          name="Screenings"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="rejections"
                          stroke="#ff8042"
                          name="Rejections"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="timeToHire"
                          stroke="#82ca9d"
                          name="Time to Hire (days)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hiring Funnel</CardTitle>
                  <CardDescription>Candidates, interviews, and hires over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={hiringData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                        <Bar dataKey="candidates" fill="#8884d8" name="Candidates" />
                        <Bar dataKey="interviews" fill="#82ca9d" name="Interviews" />
                        <Bar dataKey="hires" fill="#ffc658" name="Hires" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === 'team' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Team Performance Overview</CardTitle>
                  <CardDescription>Hiring metrics by team</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={teamPerformance}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="team" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                        <Bar dataKey="candidates" fill="#8884d8" name="Candidates" />
                        <Bar dataKey="interviews" fill="#82ca9d" name="Interviews" />
                        <Bar dataKey="hires" fill="#ffc658" name="Hires" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Efficiency Metrics</CardTitle>
                    <CardDescription>Team efficiency and cost per hire</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={teamPerformance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="team" type="category" />
                          <Tooltip formatter={(value, name) => {
                            if (name === 'efficiency') return [`${value}%`, 'Efficiency'];
                            if (name === 'costPerHire') return [`$${value}`, 'Cost per Hire'];
                            return [value, name];
                          }} />
                          <Legend />
                          <Bar dataKey="efficiency" fill="#8884d8" name="Efficiency (%)" />
                          <Bar dataKey="costPerHire" fill="#82ca9d" name="Cost per Hire ($)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Time to Hire</CardTitle>
                    <CardDescription>Average days to fill positions by team</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <Pie
                            data={teamPerformance}
                            dataKey="timeToHire"
                            nameKey="team"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label={({ name, value }) => `${name}: ${value} days`}
                          >
                            {teamPerformance.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} days`, 'Time to Hire']} />
                          <Legend />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {reportType === 'budget' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Budget Analysis</CardTitle>
                  <CardDescription>Budget allocation and spending over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={budgetData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                        <Legend />
                        <Bar dataKey="allocated" fill="#8884d8" name="Allocated Budget" />
                        <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
                        <Bar dataKey="remaining" fill="#ffc658" name="Remaining" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Distribution of revenue between company and candidates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={budgetData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="candidatePayouts"
                          stackId="1"
                          stroke="#8884d8"
                          fill="#8884d8"
                          name="Candidate Payouts"
                        />
                        <Area
                          type="monotone"
                          dataKey="companyFees"
                          stackId="1"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          name="Company Fees"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profit Metrics</CardTitle>
                  <CardDescription>Revenue, profit, and margin analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={budgetData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" domain={[40, 50]} />
                        <Tooltip formatter={(value, name) => {
                          if (name === 'profitMargin') return [`${value}%`, 'Profit Margin'];
                          return [`$${value.toLocaleString()}`, name];
                        }} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="clientBudget"
                          stroke="#8884d8"
                          name="Client Budget"
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="companyProfit"
                          stroke="#82ca9d"
                          name="Company Profit"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="profitMargin"
                          stroke="#ff8042"
                          name="Profit Margin (%)"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === 'profit' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Profit Optimization Analysis</CardTitle>
                  <CardDescription>Profit metrics by position type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={profitOptimizationData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="position" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => {
                          if (name === 'profitMargin') return [`${value}%`, 'Profit Margin'];
                          return [`$${value}/hr`, name];
                        }} />
                        <Legend />
                        <Bar dataKey="clientBudget" fill="#8884d8" name="Client Budget" />
                        <Bar dataKey="internalBudget" fill="#82ca9d" name="Internal Budget" />
                        <Bar dataKey="totalProfit" fill="#ffc658" name="Total Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profit Breakdown</CardTitle>
                  <CardDescription>Client-to-company vs company-to-candidate profit</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={profitOptimizationData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="position" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`$${value}/hr`, name]} />
                        <Legend />
                        <Bar dataKey="clientToCompany" stackId="a" fill="#8884d8" name="Client-to-Company Profit" />
                        <Bar dataKey="companyToCandidate" stackId="a" fill="#82ca9d" name="Company-to-Candidate Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {reportType === 'location' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Location Performance</CardTitle>
                  <CardDescription>Hiring metrics by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredLocationData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [value, name]} />
                        <Legend />
                        <Bar dataKey="openPositions" fill="#8884d8" name="Open Positions" />
                        <Bar dataKey="filledPositions" fill="#82ca9d" name="Filled Positions" />
                        <Bar dataKey="hires" fill="#ffc658" name="Hires" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location Revenue & Profit</CardTitle>
                  <CardDescription>Financial performance by location</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={filteredLocationData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="location" />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [`$${value.toLocaleString()}`, name]} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                        <Bar dataKey="profit" fill="#82ca9d" name="Profit" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="tables" className="space-y-4">
          {reportType === 'hiring' && (
            <Card>
              <CardHeader>
                <CardTitle>Hiring Metrics</CardTitle>
                <CardDescription>Detailed hiring data over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Month</th>
                        <th className="text-left py-3 px-4">Candidates</th>
                        <th className="text-left py-3 px-4">Interviews</th>
                        <th className="text-left py-3 px-4">Hires</th>
                        <th className="text-left py-3 px-4">Conversion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {hiringData.map((month, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{month.month}</td>
                          <td className="py-3 px-4">{month.candidates}</td>
                          <td className="py-3 px-4">{month.interviews}</td>
                          <td className="py-3 px-4">{month.hires}</td>
                          <td className="py-3 px-4">
                            {((month.hires / month.candidates) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {reportType === 'team' && (
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Detailed performance metrics by team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Team</th>
                        <th className="text-left py-3 px-4">Open Positions</th>
                        <th className="text-left py-3 px-4">Candidates</th>
                        <th className="text-left py-3 px-4">Interviews</th>
                        <th className="text-left py-3 px-4">Hires</th>
                        <th className="text-left py-3 px-4">Avg. Time to Hire (days)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teamPerformance.map((team, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{team.team}</td>
                          <td className="py-3 px-4">{team.openPositions}</td>
                          <td className="py-3 px-4">{team.candidates}</td>
                          <td className="py-3 px-4">{team.interviews}</td>
                          <td className="py-3 px-4">{team.hires}</td>
                          <td className="py-3 px-4">{team.timeToHire}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {reportType === 'budget' && (
            <Card>
              <CardHeader>
                <CardTitle>Budget Analysis</CardTitle>
                <CardDescription>Detailed budget data over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Month</th>
                        <th className="text-left py-3 px-4">Allocated Budget</th>
                        <th className="text-left py-3 px-4">Spent</th>
                        <th className="text-left py-3 px-4">Remaining</th>
                        <th className="text-left py-3 px-4">Utilization</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetData.map((month, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{month.month}</td>
                          <td className="py-3 px-4">${month.allocated.toLocaleString()}</td>
                          <td className="py-3 px-4">${month.spent.toLocaleString()}</td>
                          <td className="py-3 px-4">${month.remaining.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            {((month.spent / month.allocated) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {reportType === 'profit' && (
            <Card>
              <CardHeader>
                <CardTitle>Profit Optimization</CardTitle>
                <CardDescription>Detailed profit metrics by position</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Position</th>
                        <th className="text-left py-3 px-4">Client Budget ($/hr)</th>
                        <th className="text-left py-3 px-4">Internal Budget ($/hr)</th>
                        <th className="text-left py-3 px-4">Client-to-Company ($/hr)</th>
                        <th className="text-left py-3 px-4">Company-to-Candidate ($/hr)</th>
                        <th className="text-left py-3 px-4">Total Profit ($/hr)</th>
                        <th className="text-left py-3 px-4">Profit Margin (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profitOptimizationData.map((position, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{position.position}</td>
                          <td className="py-3 px-4">${position.clientBudget}</td>
                          <td className="py-3 px-4">${position.internalBudget}</td>
                          <td className="py-3 px-4">${position.clientToCompany}</td>
                          <td className="py-3 px-4">${position.companyToCandidate}</td>
                          <td className="py-3 px-4">${position.totalProfit}</td>
                          <td className="py-3 px-4">{position.profitMargin}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {reportType === 'location' && (
            <Card>
              <CardHeader>
                <CardTitle>Location Performance</CardTitle>
                <CardDescription>Detailed metrics by location</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Location</th>
                        <th className="text-left py-3 px-4">Open Positions</th>
                        <th className="text-left py-3 px-4">Filled Positions</th>
                        <th className="text-left py-3 px-4">Fill Rate (%)</th>
                        <th className="text-left py-3 px-4">Candidates</th>
                        <th className="text-left py-3 px-4">Interviews</th>
                        <th className="text-left py-3 px-4">Hires</th>
                        <th className="text-left py-3 px-4">Time to Hire (days)</th>
                        <th className="text-left py-3 px-4">Revenue ($)</th>
                        <th className="text-left py-3 px-4">Profit ($)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLocationData.map((location, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{location.location}</td>
                          <td className="py-3 px-4">{location.openPositions}</td>
                          <td className="py-3 px-4">{location.filledPositions}</td>
                          <td className="py-3 px-4">
                            {((location.filledPositions / location.openPositions) * 100).toFixed(1)}%
                          </td>
                          <td className="py-3 px-4">{location.candidates}</td>
                          <td className="py-3 px-4">{location.interviews}</td>
                          <td className="py-3 px-4">{location.hires}</td>
                          <td className="py-3 px-4">{location.timeToHire}</td>
                          <td className="py-3 px-4">${location.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4">${location.profit.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
