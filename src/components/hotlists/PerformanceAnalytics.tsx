import { useState, useMemo } from 'react';
import {
  BarChart3, TrendingUp, TrendingDown, Mail, MousePointer,
  Eye, MessageSquare, Calendar, Users, DollarSign,
  Download, Filter, RefreshCw, Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalEmailsSent: 1250,
    totalOpened: 875,
    totalClicked: 312,
    totalReplies: 156,
    totalInterviews: 89,
    totalPlacements: 23,
    openRate: 70.0,
    clickRate: 24.96,
    responseRate: 12.48,
    conversionRate: 14.74,
    averageResponseTime: 2.3,
    totalRevenue: 345000
  },
  trends: [
    { period: 'Jan 2024', sent: 200, opened: 140, clicked: 50, replies: 25, placements: 5 },
    { period: 'Feb 2024', sent: 250, opened: 175, clicked: 62, replies: 31, placements: 7 },
    { period: 'Mar 2024', sent: 300, opened: 210, clicked: 75, replies: 38, placements: 8 },
    { period: 'Apr 2024', sent: 280, opened: 196, clicked: 70, replies: 35, placements: 6 },
    { period: 'May 2024', sent: 220, opened: 154, clicked: 55, replies: 27, placements: 4 }
  ],
  topPerformingHotlists: [
    {
      id: '1',
      name: 'Q1 Frontend Developers',
      sent: 50,
      opened: 42,
      clicked: 18,
      replies: 12,
      placements: 3,
      openRate: 84.0,
      responseRate: 24.0,
      revenue: 45000
    },
    {
      id: '2',
      name: 'Data Science Specialists',
      sent: 25,
      opened: 20,
      clicked: 8,
      replies: 6,
      placements: 2,
      openRate: 80.0,
      responseRate: 24.0,
      revenue: 30000
    },
    {
      id: '3',
      name: 'DevOps Engineers - Urgent',
      sent: 75,
      opened: 52,
      clicked: 22,
      replies: 15,
      placements: 4,
      openRate: 69.3,
      responseRate: 20.0,
      revenue: 60000
    }
  ],
  recentActivity: [
    {
      id: '1',
      type: 'email_opened',
      candidateName: 'John Doe',
      hotlistName: 'Frontend Developers',
      timestamp: '2024-01-30T10:30:00Z',
      details: 'Opened email for React Developer position'
    },
    {
      id: '2',
      type: 'vendor_reply',
      candidateName: 'Jane Smith',
      hotlistName: 'Data Scientists',
      timestamp: '2024-01-30T09:15:00Z',
      details: 'Vendor replied with interest'
    },
    {
      id: '3',
      type: 'interview_scheduled',
      candidateName: 'Mike Johnson',
      hotlistName: 'DevOps Engineers',
      timestamp: '2024-01-30T08:45:00Z',
      details: 'Interview scheduled for Feb 2nd'
    },
    {
      id: '4',
      type: 'placement_confirmed',
      candidateName: 'Sarah Wilson',
      hotlistName: 'UI/UX Designers',
      timestamp: '2024-01-29T16:20:00Z',
      details: 'Placement confirmed - $85/hr'
    }
  ]
};

const activityIcons = {
  email_sent: Mail,
  email_opened: Eye,
  email_clicked: MousePointer,
  vendor_reply: MessageSquare,
  interview_scheduled: Calendar,
  placement_confirmed: DollarSign
};

const activityColors = {
  email_sent: 'text-blue-600',
  email_opened: 'text-green-600',
  email_clicked: 'text-purple-600',
  vendor_reply: 'text-orange-600',
  interview_scheduled: 'text-indigo-600',
  placement_confirmed: 'text-emerald-600'
};

interface PerformanceAnalyticsProps {
  hotlistId?: string;
  dateRange?: { start: string; end: string };
  className?: string;
}

const PerformanceAnalytics: React.FC<PerformanceAnalyticsProps> = ({
  hotlistId,
  dateRange,
  className = ''
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const { overview, trends, topPerformingHotlists, recentActivity } = mockAnalyticsData;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const color = isPositive ? 'text-green-600' : 'text-red-600';
    
    return (
      <div className={`flex items-center space-x-1 ${color}`}>
        <Icon className="h-3 w-3" />
        <span className="text-xs">{Math.abs(change).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Track email performance, response rates, and conversion metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="last_year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emails Sent</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalEmailsSent.toLocaleString()}</div>
            {getChangeIndicator(overview.totalEmailsSent, 1100)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(overview.openRate)}</div>
            {getChangeIndicator(overview.openRate, 65.5)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(overview.responseRate)}</div>
            {getChangeIndicator(overview.responseRate, 10.2)}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(overview.totalRevenue)}</div>
            {getChangeIndicator(overview.totalRevenue, 290000)}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Track candidates through the entire process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Emails Sent</span>
                <span className="text-sm">{overview.totalEmailsSent}</span>
              </div>
              <Progress value={100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Opened</span>
                <span className="text-sm">{overview.totalOpened} ({formatPercentage(overview.openRate)})</span>
              </div>
              <Progress value={overview.openRate} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Clicked</span>
                <span className="text-sm">{overview.totalClicked} ({formatPercentage(overview.clickRate)})</span>
              </div>
              <Progress value={overview.clickRate} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Replied</span>
                <span className="text-sm">{overview.totalReplies} ({formatPercentage(overview.responseRate)})</span>
              </div>
              <Progress value={overview.responseRate} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Interviewed</span>
                <span className="text-sm">{overview.totalInterviews}</span>
              </div>
              <Progress value={(overview.totalInterviews / overview.totalEmailsSent) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Placed</span>
                <span className="text-sm">{overview.totalPlacements}</span>
              </div>
              <Progress value={(overview.totalPlacements / overview.totalEmailsSent) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatPercentage(overview.clickRate)}</div>
                <div className="text-sm text-blue-800">Click Rate</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatPercentage(overview.conversionRate)}</div>
                <div className="text-sm text-green-800">Conversion Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{overview.averageResponseTime}d</div>
                <div className="text-sm text-purple-800">Avg Response Time</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{overview.totalPlacements}</div>
                <div className="text-sm text-orange-800">Total Placements</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for detailed views */}
      <Tabs defaultValue="hotlists" className="space-y-4">
        <TabsList>
          <TabsTrigger value="hotlists">Top Performing Hotlists</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="hotlists" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Hotlists</CardTitle>
              <CardDescription>Hotlists with the best performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hotlist Name</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Open Rate</TableHead>
                    <TableHead>Response Rate</TableHead>
                    <TableHead>Placements</TableHead>
                    <TableHead>Revenue</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPerformingHotlists.map((hotlist) => (
                    <TableRow key={hotlist.id}>
                      <TableCell className="font-medium">{hotlist.name}</TableCell>
                      <TableCell>{hotlist.sent}</TableCell>
                      <TableCell>{formatPercentage(hotlist.openRate)}</TableCell>
                      <TableCell>{formatPercentage(hotlist.responseRate)}</TableCell>
                      <TableCell>{hotlist.placements}</TableCell>
                      <TableCell>{formatCurrency(hotlist.revenue)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest interactions and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const Icon = activityIcons[activity.type as keyof typeof activityIcons];
                  const color = activityColors[activity.type as keyof typeof activityColors];
                  
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Icon className={`h-5 w-5 mt-0.5 ${color}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{activity.candidateName}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.details}</p>
                        <p className="text-xs text-gray-500">Hotlist: {activity.hotlistName}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Track performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Sent</TableHead>
                    <TableHead>Opened</TableHead>
                    <TableHead>Clicked</TableHead>
                    <TableHead>Replies</TableHead>
                    <TableHead>Placements</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trends.map((trend, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{trend.period}</TableCell>
                      <TableCell>{trend.sent}</TableCell>
                      <TableCell>{trend.opened}</TableCell>
                      <TableCell>{trend.clicked}</TableCell>
                      <TableCell>{trend.replies}</TableCell>
                      <TableCell>{trend.placements}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceAnalytics;
