import React from 'react';
import { Calculator, TrendingUp, Users, FileText, Clock, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/adminPermissions';

const MarginCalculatorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const isManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const canViewAllMargins = adminUser || isManager;

  const calculatorTypes = [
    {
      title: 'Hourly Calculator',
      description: 'Calculate margins for hourly-based candidates (W2 Hourly, 1099, C2C)',
      icon: Clock,
      path: '/margin-calculator/hourly',
      color: 'bg-blue-500',
    },
    {
      title: 'W2 Salary Calculator',
      description: 'Calculate margins for W2 salaried employees',
      icon: Users,
      path: '/margin-calculator/w2-salary',
      color: 'bg-green-500',
    },
    {
      title: '1099/C2C Calculator',
      description: 'Calculate margins for contractors and C2C arrangements',
      icon: FileText,
      path: '/margin-calculator/contractor',
      color: 'bg-purple-500',
    },
  ];

  const recentCalculations = [
    {
      id: 1,
      candidateName: 'John Doe',
      position: 'Senior Developer',
      type: 'W2 Hourly',
      clientBudget: 120,
      netMargin: 25.50,
      status: 'Approved',
      date: '2024-01-15',
    },
    {
      id: 2,
      candidateName: 'Jane Smith',
      position: 'Project Manager',
      type: 'W2 Salary',
      clientBudget: 110,
      netMargin: 22.75,
      status: 'Pending Approval',
      date: '2024-01-14',
    },
    {
      id: 3,
      candidateName: 'Mike Johnson',
      position: 'DevOps Engineer',
      type: '1099',
      clientBudget: 95,
      netMargin: 18.25,
      status: 'Approved',
      date: '2024-01-13',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Margin Calculator Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Calculate and manage profit margins for different candidate types and engagement models
        </p>
      </div>

      {/* Calculator Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {calculatorTypes.map((calculator) => {
          const IconComponent = calculator.icon;
          return (
            <Card key={calculator.path} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${calculator.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{calculator.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{calculator.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => navigate(calculator.path)}
                  className="w-full"
                >
                  Open Calculator
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calculations</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Net Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$23.45</div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calculations */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Calculations</CardTitle>
          <CardDescription>Latest margin calculations and their approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCalculations.map((calc) => (
              <div key={calc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex-1">
                  <div className="font-medium">{calc.candidateName}</div>
                  <div className="text-sm text-muted-foreground">{calc.position} • {calc.type}</div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium">${calc.clientBudget}/hr</div>
                    <div className="text-sm text-muted-foreground">Client Budget</div>
                  </div>
                  {canViewAllMargins && (
                    <div className="text-right">
                      <div className="font-medium text-green-600">${calc.netMargin}/hr</div>
                      <div className="text-sm text-muted-foreground">Net Margin</div>
                    </div>
                  )}
                  <div className="text-right">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      calc.status === 'Approved' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {calc.status}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{calc.date}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button variant="outline" onClick={() => navigate('/margin-calculator/reports')}>
              View All Calculations
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/margin-calculator/hourly')}
            >
              <Calculator className="h-4 w-4 mr-2" />
              New Hourly Calculation
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/margin-calculator/approvals')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Review Pending Approvals
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/margin-calculator/reports')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Margin Guidelines</CardTitle>
            <CardDescription>Best practices for margin calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Target minimum 20% net margin for sustainable business</span>
              </li>
              <li className="flex items-start">
                <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Consider market rates and candidate experience level</span>
              </li>
              <li className="flex items-start">
                <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Factor in employer taxes and overhead costs</span>
              </li>
              <li className="flex items-start">
                <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                <span>Get approvals for commission overrides</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarginCalculatorDashboard;
