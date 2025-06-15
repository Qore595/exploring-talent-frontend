import { useState } from 'react';
import { BarChart3, Users, ClipboardCheck, Award, DollarSign, TrendingUp, ArrowUpRight, Filter, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Mock data for charts
const hiringData = [
  { month: 'Jan', screenings: 120, interviews: 60, hires: 20 },
  { month: 'Feb', screenings: 150, interviews: 80, hires: 25 },
  { month: 'Mar', screenings: 180, interviews: 90, hires: 30 },
  { month: 'Apr', screenings: 200, interviews: 100, hires: 35 },
  { month: 'May', screenings: 220, interviews: 110, hires: 40 },
  { month: 'Jun', screenings: 250, interviews: 120, hires: 45 },
];

// Mock data for team performance
const teamPerformance = [
  {
    name: 'Marketing Team A',
    scouts: 5,
    hires: 12,
    revenue: '$120,000',
    profit: '$45,000',
    margin: '37.5%',
    timeToHire: '18 days'
  },
  {
    name: 'Marketing Team B',
    scouts: 4,
    hires: 10,
    revenue: '$95,000',
    profit: '$38,000',
    margin: '40%',
    timeToHire: '21 days'
  },
  {
    name: 'Marketing Team C',
    scouts: 6,
    hires: 15,
    revenue: '$150,000',
    profit: '$52,500',
    margin: '35%',
    timeToHire: '15 days'
  }
];

// Mock data for active recruitments
const activeRecruitments = [
  {
    id: 1,
    position: 'Senior Software Engineer',
    clientBudget: 150,
    internalBudget: 110,
    candidateSplit: 80,
    companySplit: 20,
    profit: 62, // (150-110) + (110*0.2)
    profitMargin: 41.3, // (62/150)*100
    candidates: 25,
    interviews: 12,
    deadline: '2025-05-15',
    progress: 70
  },
  {
    id: 2,
    position: 'UX Designer',
    clientBudget: 130,
    internalBudget: 95,
    candidateSplit: 85,
    companySplit: 15,
    profit: 49.25, // (130-95) + (95*0.15)
    profitMargin: 37.9, // (49.25/130)*100
    candidates: 18,
    interviews: 8,
    deadline: '2025-05-30',
    progress: 50
  },
  {
    id: 3,
    position: 'Product Manager',
    clientBudget: 120,
    internalBudget: 85,
    candidateSplit: 75,
    companySplit: 25,
    profit: 56.25, // (120-85) + (85*0.25)
    profitMargin: 46.9, // (56.25/120)*100
    candidates: 15,
    interviews: 7,
    deadline: '2025-06-25',
    progress: 40
  }
];

const MarketingHeadDashboard = () => {
  const [locationFilter, setLocationFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('month');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Marketing Head Dashboard</h1>
        <p className="text-muted-foreground">
          Oversee all marketing teams, track performance metrics, and optimize recruitment strategies
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-48">
          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="miami">Miami Headquarters</SelectItem>
              <SelectItem value="nyc">New York Office</SelectItem>
              <SelectItem value="sf">San Francisco Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Time Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Profit Metrics - Only visible to Marketing Head */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Client-to-Company</span>
                <span className="text-lg font-bold">$135,500</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs">
                <span className="text-xs text-muted-foreground mr-1">Average Margin</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  $40/hr per placement
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Company-to-Candidate</span>
                <span className="text-lg font-bold">$22,500</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs">
                <span className="text-xs text-muted-foreground mr-1">Average Split</span>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  20% company / 80% candidate
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                <span className="text-lg font-bold">$365,000</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 12%
              </Badge>
              <span className="text-muted-foreground">vs previous {timeFilter}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Total Profit</span>
                <span className="text-lg font-bold">$158,000</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 8%
              </Badge>
              <span className="text-muted-foreground">43.3% margin</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Marketing Teams"
          value="3"
          description="Active teams"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Recruiters"
          value="15"
          description="Across all teams"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Monthly Hires"
          value="37"
          description="This month"
          icon={<Award className="h-6 w-6 text-primary" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Jobs"
          value="24"
          description="Open positions"
          icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* Team Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Hiring and revenue metrics by team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Team</th>
                  <th className="text-left py-3 px-4">Recruiters</th>
                  <th className="text-left py-3 px-4">Hires</th>
                  <th className="text-left py-3 px-4">Revenue</th>
                  <th className="text-left py-3 px-4">Profit</th>
                  <th className="text-left py-3 px-4">Margin</th>
                  <th className="text-left py-3 px-4">Avg. Time to Hire</th>
                </tr>
              </thead>
              <tbody>
                {teamPerformance.map((team, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{team.name}</td>
                    <td className="py-3 px-4">{team.scouts}</td>
                    <td className="py-3 px-4">{team.hires}</td>
                    <td className="py-3 px-4">{team.revenue}</td>
                    <td className="py-3 px-4">{team.profit}</td>
                    <td className="py-3 px-4">{team.margin}</td>
                    <td className="py-3 px-4">{team.timeToHire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Hiring Funnel</CardTitle>
            <CardDescription>Screening to hire conversion rates</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hiringData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="screenings" stackId="1" stroke="#8884d8" fill="#8884d8" />
                <Area type="monotone" dataKey="interviews" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                <Area type="monotone" dataKey="hires" stackId="3" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue & Profit</CardTitle>
            <CardDescription>Monthly financial performance</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={hiringData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="hires" name="Revenue ($K)" fill="#8884d8" />
                <Bar dataKey="interviews" name="Profit ($K)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketingHeadDashboard;
