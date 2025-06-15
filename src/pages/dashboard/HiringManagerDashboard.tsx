
import { DollarSign, Percent, Users, Calendar, ArrowUpRight, ArrowDown, TrendingUp, Briefcase } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

// Mock data for charts
const budgetData = [
  {
    position: 'Software Engineer',
    clientBudget: 120,
    internalBudget: 85,
    candidateShare: 68, // 80% of internal budget
    companyShare: 17,   // 20% of internal budget
    clientToCompany: 35, // client budget - internal budget
    companyToCandidate: 17, // 20% of internal budget
    totalProfit: 52 // clientToCompany + companyToCandidate
  },
  {
    position: 'Data Scientist',
    clientBudget: 130,
    internalBudget: 90,
    candidateShare: 67.5, // 75% of internal budget
    companyShare: 22.5,   // 25% of internal budget
    clientToCompany: 40, // client budget - internal budget
    companyToCandidate: 22.5, // 25% of internal budget
    totalProfit: 62.5 // clientToCompany + companyToCandidate
  },
  {
    position: 'Product Manager',
    clientBudget: 110,
    internalBudget: 80,
    candidateShare: 64, // 80% of internal budget
    companyShare: 16,   // 20% of internal budget
    clientToCompany: 30, // client budget - internal budget
    companyToCandidate: 16, // 20% of internal budget
    totalProfit: 46 // clientToCompany + companyToCandidate
  },
  {
    position: 'UX Designer',
    clientBudget: 95,
    internalBudget: 70,
    candidateShare: 59.5, // 85% of internal budget
    companyShare: 10.5,   // 15% of internal budget
    clientToCompany: 25, // client budget - internal budget
    companyToCandidate: 10.5, // 15% of internal budget
    totalProfit: 35.5 // clientToCompany + companyToCandidate
  },
  {
    position: 'DevOps Engineer',
    clientBudget: 105,
    internalBudget: 75,
    candidateShare: 60, // 80% of internal budget
    companyShare: 15,   // 20% of internal budget
    clientToCompany: 30, // client budget - internal budget
    companyToCandidate: 15, // 20% of internal budget
    totalProfit: 45 // clientToCompany + companyToCandidate
  },
];

// Active recruitments
const activeRecruitments = [
  {
    id: 1,
    position: 'Senior React Developer',
    clientBudget: 110,
    internalBudget: 75,
    candidateSplit: 80,
    companySplit: 20,
    profit: 50, // (110-75) + (75*0.2)
    profitMargin: 45.5, // (50/110)*100
    candidates: 12,
    interviews: 5,
    deadline: '2025-06-15',
    progress: 70
  },
  {
    id: 2,
    position: 'Data Engineer',
    clientBudget: 105,
    internalBudget: 70,
    candidateSplit: 80,
    companySplit: 20,
    profit: 49, // (105-70) + (70*0.2)
    profitMargin: 46.7, // (49/105)*100
    candidates: 8,
    interviews: 3,
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

const HiringManagerDashboard = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Hiring Manager Dashboard</h1>
        <p className="text-muted-foreground">
          Track budgets, profit margins, and recruitment progress
        </p>
      </div>

      {/* Profit Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Profit</p>
                <p className="text-xl font-bold">$45,200</p>
                <p className="text-xs text-muted-foreground mt-1">YTD Profit</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 8.3%
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
                <p className="text-xl font-bold">$32,500</p>
                <p className="text-xs text-muted-foreground mt-1">Profit Margin</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">
                24%
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
                <p className="text-xl font-bold">$12,700</p>
                <p className="text-xs text-muted-foreground mt-1">Average Split</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 mr-2">
                20%
              </Badge>
              <span className="text-muted-foreground">company / 80% candidate</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recruitment Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Total Budget</span>
                <span className="text-lg font-bold">$325K</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 5%
              </Badge>
              <span className="text-muted-foreground">current month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Average Profit Margin</span>
                <span className="text-lg font-bold">32%</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Percent className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-green-100 text-green-800 mr-2">
                <ArrowUpRight className="h-3 w-3 mr-1" /> 3%
              </Badge>
              <span className="text-muted-foreground">per placement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Open Positions</span>
                <span className="text-lg font-bold">8</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-xs text-muted-foreground">across teams</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-muted-foreground">Time to Fill</span>
                <span className="text-lg font-bold">25 days</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-xs">
              <Badge variant="outline" className="bg-red-100 text-red-800 mr-2">
                <ArrowDown className="h-3 w-3 mr-1" /> 2 days
              </Badge>
              <span className="text-muted-foreground">average</span>
            </div>
          </CardContent>
        </Card>
      </div>



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
                      <span>Profit: ${recruitment.profit.toFixed(2)}/hr ({recruitment.profitMargin.toFixed(1)}%)</span>
                      <span>Deadline: {new Date(recruitment.deadline).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="bg-recruit-info px-3 py-1 rounded-full text-xs font-medium">
                    {recruitment.candidates} candidates
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{recruitment.progress}%</span>
                  </div>
                  <Progress value={recruitment.progress} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Talent Scout Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Talent Scout Performance</CardTitle>
          <CardDescription>Effectiveness metrics for your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Talent Scout</th>
                  <th className="text-left py-3 px-4">Screenings</th>
                  <th className="text-left py-3 px-4">Interviews</th>
                  <th className="text-left py-3 px-4">Hires</th>
                  <th className="text-left py-3 px-4">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Jamie Garcia</td>
                  <td className="py-3 px-4">42</td>
                  <td className="py-3 px-4">18</td>
                  <td className="py-3 px-4">7</td>
                  <td className="py-3 px-4">16.7%</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Sam Taylor</td>
                  <td className="py-3 px-4">38</td>
                  <td className="py-3 px-4">15</td>
                  <td className="py-3 px-4">5</td>
                  <td className="py-3 px-4">13.2%</td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Alex Johnson</td>
                  <td className="py-3 px-4">51</td>
                  <td className="py-3 px-4">22</td>
                  <td className="py-3 px-4">9</td>
                  <td className="py-3 px-4">17.6%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Budget & Profit Breakdown Chart - Moved to bottom */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Budget & Profit Breakdown</CardTitle>
          <CardDescription>Detailed budget and profit allocation by position</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={budgetData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="position" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => {
                  const labels = {
                    'clientBudget': 'Client Budget',
                    'internalBudget': 'Internal Budget',
                    'candidateShare': 'Candidate Share',
                    'companyShare': 'Company Share',
                    'totalProfit': 'Total Profit'
                  };
                  return [`$${value}/hr`, labels[name] || name];
                }}
              />
              <Legend
                payload={[
                  { value: 'Client Budget', type: 'circle', color: '#8884d8' },
                  { value: 'Internal Budget', type: 'circle', color: '#82ca9d' },
                  { value: 'Candidate Share', type: 'circle', color: '#4ade80' },
                  { value: 'Company Share', type: 'circle', color: '#f97316' },
                  { value: 'Total Profit', type: 'circle', color: '#ec4899' }
                ]}
              />
              <Bar dataKey="clientBudget" fill="#8884d8" />
              <Bar dataKey="internalBudget" fill="#82ca9d" />
              <Bar dataKey="candidateShare" fill="#4ade80" />
              <Bar dataKey="companyShare" fill="#f97316" />
              <Bar dataKey="totalProfit" fill="#ec4899" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default HiringManagerDashboard;
