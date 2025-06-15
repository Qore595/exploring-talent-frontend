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
  { month: 'Jan', screenings: 40, interviews: 20, hires: 8 },
  { month: 'Feb', screenings: 50, interviews: 25, hires: 10 },
  { month: 'Mar', screenings: 60, interviews: 30, hires: 12 },
  { month: 'Apr', screenings: 70, interviews: 35, hires: 15 },
  { month: 'May', screenings: 80, interviews: 40, hires: 18 },
  { month: 'Jun', screenings: 90, interviews: 45, hires: 20 },
];

// Mock data for team members
const teamMembers = [
  {
    id: 'user-1',
    name: 'Jordan Lee',
    role: 'Marketing Recruiter',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hires: 5,
    activeJobs: 8,
    candidates: 15,
    performance: 92
  },
  {
    id: 'user-2',
    name: 'Taylor Smith',
    role: 'Marketing Recruiter',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hires: 4,
    activeJobs: 6,
    candidates: 12,
    performance: 88
  },
  {
    id: 'user-3',
    name: 'Morgan Chen',
    role: 'Marketing Associate',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hires: 3,
    activeJobs: 5,
    candidates: 10,
    performance: 85
  },
  {
    id: 'user-4',
    name: 'Casey Wilson',
    role: 'Marketing Associate',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hires: 2,
    activeJobs: 4,
    candidates: 8,
    performance: 80
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

const MarketingSupervisorDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Marketing Supervisor Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your team, track performance, and optimize recruitment processes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Profit Metrics - Visible to Marketing Supervisor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Client-to-Company</span>
                <span className="text-lg font-bold">$45,500</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs">
                <span className="text-xs text-muted-foreground mr-1">Average Margin</span>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  $38/hr per placement
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
                <span className="text-lg font-bold">$8,200</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <div className="flex items-center text-xs">
                <span className="text-xs text-muted-foreground mr-1">Average Split</span>
                <Badge variant="outline" className="bg-purple-100 text-purple-800">
                  18% company / 82% candidate
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Team Revenue</span>
                <span className="text-lg font-bold">$120,000</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 8%
              </Badge>
              <span className="text-muted-foreground">vs previous {timeFilter}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Team Profit</span>
                <span className="text-lg font-bold">$53,700</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 5%
              </Badge>
              <span className="text-muted-foreground">44.8% margin</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard
          title="Team Members"
          value="4"
          description="Active recruiters"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Active Jobs"
          value="12"
          description="Open positions"
          icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Monthly Hires"
          value="14"
          description="This month"
          icon={<Award className="h-6 w-6 text-primary" />}
          trend={{ value: 3, isPositive: true }}
        />
        <StatsCard
          title="Candidates"
          value="45"
          description="In pipeline"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Individual performance metrics for your team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Team Member</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Active Jobs</th>
                  <th className="text-left py-3 px-4">Candidates</th>
                  <th className="text-left py-3 px-4">Hires</th>
                  <th className="text-left py-3 px-4">Performance</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.map((member) => (
                  <tr key={member.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="font-medium">{member.name}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{member.role}</td>
                    <td className="py-3 px-4">{member.activeJobs}</td>
                    <td className="py-3 px-4">{member.candidates}</td>
                    <td className="py-3 px-4">{member.hires}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Progress value={member.performance} className="h-2 w-24 mr-2" />
                        <span>{member.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Active Recruitments */}
      <Card>
        <CardHeader>
          <CardTitle>Active Recruitments</CardTitle>
          <CardDescription>Currently open positions and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activeRecruitments.map((recruitment) => (
              <div key={recruitment.id} className="border p-4 rounded-md">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{recruitment.position}</h3>
                    <div className="flex flex-wrap gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Internal Budget: ${recruitment.internalBudget}/hr</span>
                      <span>Candidate Split: {recruitment.candidateSplit}%</span>
                      <span>Company Split: {recruitment.companySplit}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Profit: ${recruitment.profit.toFixed(2)}/hr</div>
                    <div className="text-xs text-muted-foreground">Margin: {recruitment.profitMargin.toFixed(1)}%</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{recruitment.progress}%</span>
                  </div>
                  <Progress value={recruitment.progress} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Candidates: {recruitment.candidates}</span>
                    <span>Interviews: {recruitment.interviews}</span>
                    <span>Deadline: {new Date(recruitment.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
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

export default MarketingSupervisorDashboard;
