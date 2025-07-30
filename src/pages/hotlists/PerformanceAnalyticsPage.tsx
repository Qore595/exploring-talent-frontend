import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Filter, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PerformanceAnalytics from '@/components/hotlists/PerformanceAnalytics';

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalHotlists: 45,
    totalCandidates: 1250,
    totalResponses: 890,
    totalPlacements: 67,
    averageResponseRate: 71.2,
    averageConversionRate: 7.5,
    totalRevenue: 2450000
  },
  trends: [
    { month: 'Jan', hotlists: 8, responses: 156, placements: 12, revenue: 420000 },
    { month: 'Feb', hotlists: 12, responses: 234, placements: 18, revenue: 630000 },
    { month: 'Mar', hotlists: 10, responses: 198, placements: 15, revenue: 525000 },
    { month: 'Apr', hotlists: 15, responses: 302, placements: 22, revenue: 875000 }
  ],
  topPerformers: [
    {
      id: '1',
      name: 'Q1 2024 Frontend Developers',
      responseRate: 85.2,
      conversionRate: 12.5,
      placements: 8,
      revenue: 280000
    },
    {
      id: '2',
      name: 'Data Science Specialists',
      responseRate: 78.9,
      conversionRate: 10.2,
      placements: 6,
      revenue: 210000
    },
    {
      id: '3',
      name: 'DevOps Engineers - Urgent',
      responseRate: 92.1,
      conversionRate: 15.8,
      placements: 12,
      revenue: 420000
    }
  ],
  subjectLinePerformance: [
    {
      subject: 'Urgent: {{job_title}} opportunity at {{company_name}}',
      openRate: 89.5,
      clickRate: 34.2,
      responseRate: 18.7,
      usage: 23
    },
    {
      subject: 'Hi {{candidate_name}}, perfect {{job_title}} role for you',
      openRate: 76.3,
      clickRate: 28.9,
      responseRate: 15.2,
      usage: 18
    },
    {
      subject: '{{company_name}} is looking for {{job_title}} - {{urgency}}',
      openRate: 82.1,
      clickRate: 31.5,
      responseRate: 16.8,
      usage: 15
    }
  ],
  vendorPerformance: [
    {
      vendor: 'TechStaff Solutions',
      totalSubmissions: 145,
      responseRate: 78.6,
      averageResponseTime: '2.3 hours',
      placements: 12,
      revenue: 420000
    },
    {
      vendor: 'Elite Consulting Group',
      totalSubmissions: 98,
      responseRate: 85.7,
      averageResponseTime: '1.8 hours',
      placements: 8,
      revenue: 280000
    },
    {
      vendor: 'Global Tech Partners',
      totalSubmissions: 167,
      responseRate: 72.5,
      averageResponseTime: '3.1 hours',
      placements: 15,
      revenue: 525000
    }
  ]
};

const PerformanceAnalyticsPage = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('last_30_days');
  const [filterType, setFilterType] = useState('all');

  const handleBack = () => {
    navigate('/hotlists');
  };

  const handleExport = () => {
    // Mock export functionality
    const blob = new Blob(['Analytics data export...'], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hotlist-analytics-${dateRange}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotlists
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Performance Analytics</h1>
            <p className="text-gray-600">Comprehensive analytics for hotlist campaigns</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 days</SelectItem>
              <SelectItem value="last_30_days">Last 30 days</SelectItem>
              <SelectItem value="last_90_days">Last 90 days</SelectItem>
              <SelectItem value="last_year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="recurring">Recurring</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotlists</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.totalHotlists}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.averageResponseRate}%</div>
            <p className="text-xs text-muted-foreground">
              +2.1% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAnalyticsData.overview.totalPlacements}</div>
            <p className="text-xs text-muted-foreground">
              +8 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(mockAnalyticsData.overview.totalRevenue / 1000000).toFixed(1)}M
            </div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="subjects">Subject Lines</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <PerformanceAnalytics 
            data={mockAnalyticsData}
            dateRange={dateRange}
            filterType={filterType}
          />
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Hotlists</CardTitle>
              <CardDescription>
                Hotlists with the highest response and conversion rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.topPerformers.map((hotlist) => (
                  <div key={hotlist.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{hotlist.name}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">
                          {hotlist.responseRate}% Response Rate
                        </Badge>
                        <Badge variant="secondary">
                          {hotlist.conversionRate}% Conversion
                        </Badge>
                        <Badge variant="secondary">
                          {hotlist.placements} Placements
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        ${(hotlist.revenue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-500">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Subject Line Performance</CardTitle>
              <CardDescription>
                Analysis of subject line effectiveness and usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.subjectLinePerformance.map((subject, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="font-medium mb-2">{subject.subject}</div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Open Rate</div>
                        <div className="font-medium">{subject.openRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Click Rate</div>
                        <div className="font-medium">{subject.clickRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Response Rate</div>
                        <div className="font-medium">{subject.responseRate}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Usage Count</div>
                        <div className="font-medium">{subject.usage}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance</CardTitle>
              <CardDescription>
                Response rates and performance metrics by vendor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.vendorPerformance.map((vendor, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{vendor.vendor}</h4>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">
                          {vendor.responseRate}% Response Rate
                        </Badge>
                        <Badge variant="secondary">
                          {vendor.averageResponseTime} Avg Response
                        </Badge>
                        <Badge variant="secondary">
                          {vendor.placements} Placements
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        ${(vendor.revenue / 1000).toFixed(0)}K
                      </div>
                      <div className="text-sm text-gray-500">
                        {vendor.totalSubmissions} submissions
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalyticsPage;
