import { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, ArrowRight, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/adminPermissions';
import ProfitCalculator from '@/components/profit/ProfitCalculator';
import { toast } from '@/hooks/use-toast';

const ProfitCalculatorPage = () => {
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const isManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const canViewAllProfits = adminUser || isManager;

  const [calculationResults, setCalculationResults] = useState<any>(null);

  // Handle calculation results
  const handleCalculate = (results: any) => {
    setCalculationResults(results);
  };

  // Handle save calculation
  const handleSaveCalculation = () => {
    if (!calculationResults) return;
    
    toast({
      title: "Calculation Saved",
      description: "Profit calculation has been saved to your profile.",
    });
  };

  // Handle share calculation
  const handleShareCalculation = () => {
    if (!calculationResults) return;
    
    toast({
      title: "Calculation Shared",
      description: "Profit calculation has been shared with your team.",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Profit Calculator</h1>
        <p className="text-muted-foreground mt-2">
          Calculate and optimize profit margins for job placements
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfitCalculator onCalculate={handleCalculate} />
        </div>

        <div className="space-y-6">
          {/* Saved Calculations */}
          <Card>
            <CardHeader>
              <CardTitle>Saved Calculations</CardTitle>
              <CardDescription>Your recent profit calculations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border p-3 rounded-md hover:bg-muted/50 cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium">Senior Developer</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(Date.now() - i * 86400000).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Client Budget:</div>
                      <div>${120 + i * 10}/hr</div>
                      <div className="text-muted-foreground">Internal Budget:</div>
                      <div>${90 + i * 5}/hr</div>
                      {canViewAllProfits && (
                        <>
                          <div className="text-muted-foreground">Total Profit:</div>
                          <div>${(120 + i * 10) - (90 + i * 5) + ((90 + i * 5) * 0.2)}/hr</div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Profit Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Optimization Tips</CardTitle>
              <CardDescription>Maximize your profit margins</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Aim for a client budget that is at least 25% higher than your internal budget.</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>For specialized roles, you can increase the company split to 25-30%.</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>Balance candidate satisfaction with profit margins by adjusting splits based on market demand.</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="h-4 w-4 mr-2 mt-0.5 text-primary" />
                  <span>For long-term contracts, consider offering a slightly lower margin to secure the business.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Actions */}
      {calculationResults && (
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handleSaveCalculation}>
            <Download className="h-4 w-4 mr-2" /> Save Calculation
          </Button>
          <Button variant="outline" onClick={handleShareCalculation}>
            <Share2 className="h-4 w-4 mr-2" /> Share with Team
          </Button>
        </div>
      )}

      {/* Profit Breakdown */}
      {calculationResults && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Profit Breakdown</CardTitle>
            <CardDescription>Comprehensive analysis of your profit calculation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Flow Diagram */}
              <div className="bg-muted p-6 rounded-md">
                <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Client Budget</div>
                    <div className="text-xl font-bold">${calculationResults.clientBudget}/hr</div>
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Internal Budget</div>
                    <div className="text-xl font-bold">${calculationResults.internalBudget}/hr</div>
                    {canViewAllProfits && (
                      <div className="text-xs text-primary mt-1">
                        +${calculationResults.clientToCompanyProfit.toFixed(2)}/hr profit
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-6 w-6 text-muted-foreground hidden md:block" />
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-1">Candidate Rate</div>
                    <div className="text-xl font-bold">
                      ${((calculationResults.internalBudget * calculationResults.candidateSplit) / 100).toFixed(2)}/hr
                    </div>
                    <div className="text-xs text-primary mt-1">
                      +${calculationResults.companyToCandidateProfit.toFixed(2)}/hr profit
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics */}
              {canViewAllProfits && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Client-to-Company</div>
                        <div className="text-lg font-bold">${calculationResults.clientToCompanyProfit.toFixed(2)}/hr</div>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-500/20" />
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Company-to-Candidate</div>
                        <div className="text-lg font-bold">${calculationResults.companyToCandidateProfit.toFixed(2)}/hr</div>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-500/20" />
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Total Profit</div>
                        <div className="text-lg font-bold">${calculationResults.totalProfit.toFixed(2)}/hr</div>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-500/20" />
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Profit Margin</div>
                        <div className="text-lg font-bold">{calculationResults.profitMargin.toFixed(1)}%</div>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-500/20" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfitCalculatorPage;
