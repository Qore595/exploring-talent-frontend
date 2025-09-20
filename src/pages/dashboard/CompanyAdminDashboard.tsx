
import { BarChart3, Users, ClipboardCheck, Award, DollarSign, TrendingUp, Percent, ArrowUpRight, Building2, Target, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Progress } from '@/components/ui/progress';

import { MetricsTable } from '@/components/dashboard/MetricsTable';
import { PageHeader } from '@/components/page-header';
import { motion } from 'framer-motion';
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
  { month: 'Jan', screenings: 65, interviews: 28, hires: 8 },
  { month: 'Feb', screenings: 59, interviews: 31, hires: 12 },
  { month: 'Mar', screenings: 80, interviews: 40, hires: 15 },
  { month: 'Apr', screenings: 81, interviews: 45, hires: 18 },
  { month: 'May', screenings: 95, interviews: 52, hires: 24 },
  { month: 'Jun', screenings: 110, interviews: 58, hires: 30 },
];

const revenueData = [
  { month: 'Jan', revenue: 42000, profit: 15000 },
  { month: 'Feb', revenue: 53000, profit: 19500 },
  { month: 'Mar', revenue: 68000, profit: 25000 },
  { month: 'Apr', revenue: 72000, profit: 27500 },
  { month: 'May', revenue: 86000, profit: 33000 },
  { month: 'Jun', revenue: 110000, profit: 42500 },
];

const teamPerformance = [
  { name: 'Team Alpha', hires: 12, revenue: 48000, profit: 18500, profitMargin: 38.5 },
  { name: 'Team Beta', hires: 8, revenue: 32000, profit: 12000, profitMargin: 37.5 },
  { name: 'Team Gamma', hires: 15, revenue: 60000, profit: 24000, profitMargin: 40.0 },
];

const profitBreakdownData = [
  { category: 'Client-to-Company', value: 65000 },
  { category: 'Company-to-Candidate', value: 22500 },
];

const positionProfitData = [
  { positionId: 'SE-2023-001', position: 'Software Engineer', clientName: 'TechCorp Inc.', clientBudget: 120, internalBudget: 85, profit: 52 },
  { positionId: 'DS-2023-002', position: 'Data Scientist', clientName: 'Analytics Solutions', clientBudget: 130, internalBudget: 90, profit: 62.5 },
  { positionId: 'UX-2023-003', position: 'UX/UI Designer', clientName: 'Creative Designs LLC', clientBudget: 95, internalBudget: 70, profit: 35.5 },
  { positionId: 'PM-2023-004', position: 'Project Manager', clientName: 'Global Systems', clientBudget: 110, internalBudget: 80, profit: 46 },
  { positionId: 'SR-2023-005', position: 'Sales Representative', clientName: 'Revenue Boosters', clientBudget: 85, internalBudget: 65, profit: 33 },
];

const CompanyAdminDashboard = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Company Dashboard"
        description="Overview of company-wide recruitment metrics and financial performance"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Company Overview' }
        ]}
      />



      {/* Key Performance Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatsCard
          title="Total Profit"
          value="$87,500"
          description="Year-to-date profit"
          icon={<TrendingUp className="h-5 w-5" />}
          trend={{ value: 12.5, isPositive: true, label: "from last year" }}
          variant="gradient"
        />

        <StatsCard
          title="Client-to-Company"
          value="$65,000"
          description="Revenue from client budgets"
          icon={<ArrowUpRight className="h-5 w-5" />}
          trend={{ value: 26, isPositive: true, label: "profit margin" }}
          variant="elevated"
        />

        <StatsCard
          title="Company-to-Candidate"
          value="$22,500"
          description="Candidate compensation split"
          icon={<Percent className="h-5 w-5" />}
          trend={{ value: 20, isPositive: true, label: "company share" }}
          variant="default"
        />

        <StatsCard
          title="Active Positions"
          value="24"
          description="Currently open positions"
          icon={<Target className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true, label: "this month" }}
          variant="minimal"
        />
      </motion.div>

      {/* Recruitment Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StatsCard
          title="Total Employees"
          value="128"
          description="Across all teams"
          icon={<Users className="h-5 w-5" />}
          variant="default"
        />

        <StatsCard
          title="Monthly Hires"
          value="24"
          description="Successful placements"
          icon={<Award className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true, label: "vs previous month" }}
          variant="default"
        />

        <StatsCard
          title="Monthly Revenue"
          value="$110,000"
          description="From placements"
          icon={<DollarSign className="h-5 w-5" />}
          trend={{ value: 28, isPositive: true, label: "growth" }}
          variant="default"
        />

        <StatsCard
          title="Active Screenings"
          value="45"
          description="In progress"
          icon={<ClipboardCheck className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true, label: "this week" }}
          variant="default"
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {/* Hiring Trends Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Hiring Trends
            </CardTitle>
            <CardDescription>Monthly screening, interview, and hiring metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={hiringData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Area type="monotone" dataKey="screenings" stackId="1" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                <Area type="monotone" dataKey="interviews" stackId="1" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.6} />
                <Area type="monotone" dataKey="hires" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue & Profit Chart */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Revenue & Profit
            </CardTitle>
            <CardDescription>Monthly revenue and profit trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Metrics Table with Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <MetricsTable />
      </motion.div>

      {/* Team Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Team Performance
            </CardTitle>
            <CardDescription>Hiring and revenue metrics by team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Team</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Talent Scouts</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Hires</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Revenue</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Profit</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Margin</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Avg. Time to Hire</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.map((team, i) => (
                    <tr key={i} className="border-b border-border/30 hover:bg-muted/50 transition-colors duration-200">
                      <td className="py-4 px-4 font-medium text-foreground">{team.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{Math.floor(Math.random() * 5) + 3}</td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {team.hires}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium">${team.revenue.toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className="text-green-600 font-semibold">${team.profit.toLocaleString()}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{team.profitMargin.toFixed(1)}%</span>
                          <Progress
                            value={team.profitMargin}
                            className="w-16 h-2"
                            indicatorVariant="success"
                          />
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{Math.floor(Math.random() * 10) + 14} days</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Position Profit Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Position Profit Analysis</CardTitle>
          <CardDescription>Profit breakdown by position type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Position ID</th>
                  <th className="text-left py-3 px-4">Position</th>
                  <th className="text-left py-3 px-4">Client Name</th>
                  <th className="text-left py-3 px-4">Client Budget</th>
                  <th className="text-left py-3 px-4">Internal Budget</th>
                  <th className="text-left py-3 px-4">Client-to-Company</th>
                  <th className="text-left py-3 px-4">Company-to-Candidate</th>
                  <th className="text-left py-3 px-4">Total Profit</th>
                  <th className="text-left py-3 px-4">Margin</th>
                </tr>
              </thead>
              <tbody>
                {positionProfitData.map((position, i) => {
                  const clientToCompany = position.clientBudget - position.internalBudget;
                  const companyToCandidate = (position.internalBudget * 0.2); // Assuming 20% company split
                  const totalProfit = position.profit;
                  const margin = (totalProfit / position.clientBudget * 100).toFixed(1);

                  return (
                    <tr key={i} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{position.positionId}</td>
                      <td className="py-3 px-4">{position.position}</td>
                      <td className="py-3 px-4">{position.clientName}</td>
                      <td className="py-3 px-4">${position.clientBudget}/hr</td>
                      <td className="py-3 px-4">${position.internalBudget}/hr</td>
                      <td className="py-3 px-4 text-green-600">${clientToCompany}/hr</td>
                      <td className="py-3 px-4 text-green-600">${companyToCandidate}/hr</td>
                      <td className="py-3 px-4 text-green-600 font-medium">${totalProfit}/hr</td>
                      <td className="py-3 px-4">{margin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts - Moved to bottom */}
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
            <CardDescription>Monthly revenue and profit from placements</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#9b87f5" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#4ade80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;
