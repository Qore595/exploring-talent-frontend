import { useState, useEffect } from 'react';
import { DollarSign, Calculator, ArrowRight, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/adminPermissions';

interface ProfitCalculatorProps {
  initialValues?: {
    clientBudget?: number;
    internalBudget?: number;
    candidateSplit?: number;
    companySplit?: number;
  };
  onCalculate?: (values: {
    clientBudget: number;
    internalBudget: number;
    candidateSplit: number;
    companySplit: number;
    clientToCompanyProfit: number;
    companyToCandidateProfit: number;
    totalProfit: number;
    profitMargin: number;
  }) => void;
}

const ProfitCalculator: React.FC<ProfitCalculatorProps> = ({
  initialValues = {},
  onCalculate
}) => {
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const isManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const canViewAllProfits = adminUser || isManager;

  // State for calculator values
  const [clientBudget, setClientBudget] = useState(initialValues.clientBudget || 120);
  const [internalBudget, setInternalBudget] = useState(initialValues.internalBudget || 90);
  const [candidateSplit, setCandidateSplit] = useState(initialValues.candidateSplit || 80);
  const [companySplit, setCompanySplit] = useState(initialValues.companySplit || 20);

  // Calculated values
  const [clientToCompanyProfit, setClientToCompanyProfit] = useState(0);
  const [companyToCandidateProfit, setCompanyToCandidateProfit] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  // Calculate profits
  useEffect(() => {
    // Client-to-Company profit (only visible to CEO, Branch Manager, and Marketing Supervisor)
    const ctcProfit = clientBudget - internalBudget;
    
    // Company-to-Candidate profit (visible to all employees)
    const candidateRate = (internalBudget * candidateSplit) / 100;
    const companyFee = (internalBudget * companySplit) / 100;
    
    // Total profit
    const total = ctcProfit + companyFee;
    
    // Profit margin percentage
    const margin = (total / clientBudget) * 100;
    
    setClientToCompanyProfit(ctcProfit);
    setCompanyToCandidateProfit(companyFee);
    setTotalProfit(total);
    setProfitMargin(margin);
    
    if (onCalculate) {
      onCalculate({
        clientBudget,
        internalBudget,
        candidateSplit,
        companySplit,
        clientToCompanyProfit: ctcProfit,
        companyToCandidateProfit: companyFee,
        totalProfit: total,
        profitMargin: margin
      });
    }
  }, [clientBudget, internalBudget, candidateSplit, companySplit, onCalculate]);

  // Handle reset
  const handleReset = () => {
    setClientBudget(initialValues.clientBudget || 120);
    setInternalBudget(initialValues.internalBudget || 90);
    setCandidateSplit(initialValues.candidateSplit || 80);
    setCompanySplit(initialValues.companySplit || 20);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Profit Calculator
        </CardTitle>
        <CardDescription>
          Calculate profit margins and optimize rates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientBudget">Client Budget ($/hr)</Label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="clientBudget"
                    type="number"
                    value={clientBudget}
                    onChange={(e) => setClientBudget(Number(e.target.value))}
                    min={0}
                    step={5}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="internalBudget">Internal Budget ($/hr)</Label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                  <Input
                    id="internalBudget"
                    type="number"
                    value={internalBudget}
                    onChange={(e) => setInternalBudget(Number(e.target.value))}
                    min={0}
                    max={clientBudget}
                    step={5}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="candidateSplit">Candidate Split (%)</Label>
                  <span className="text-sm text-muted-foreground">{candidateSplit}%</span>
                </div>
                <Slider
                  id="candidateSplit"
                  value={[candidateSplit]}
                  onValueChange={(value) => {
                    setCandidateSplit(value[0]);
                    setCompanySplit(100 - value[0]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="companySplit">Company Split (%)</Label>
                  <span className="text-sm text-muted-foreground">{companySplit}%</span>
                </div>
                <Slider
                  id="companySplit"
                  value={[companySplit]}
                  onValueChange={(value) => {
                    setCompanySplit(value[0]);
                    setCandidateSplit(100 - value[0]);
                  }}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-4">Profit Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Client-to-Company Profit - Only visible to CEO, Branch Manager, and Marketing Supervisor */}
              {canViewAllProfits && (
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Client-to-Company</div>
                      <div className="text-lg font-bold">${clientToCompanyProfit.toFixed(2)}/hr</div>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <div className="text-xs">${clientBudget}/hr</div>
                      <ArrowRight className="h-3 w-3 mx-1" />
                      <div className="text-xs">${internalBudget}/hr</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Company-to-Candidate Profit - Visible to all employees */}
              <div className="bg-muted p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-muted-foreground">Company-to-Candidate</div>
                    <div className="text-lg font-bold">${companyToCandidateProfit.toFixed(2)}/hr</div>
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <div className="text-xs">{companySplit}%</div>
                    <ArrowRight className="h-3 w-3 mx-1" />
                    <div className="text-xs">{candidateSplit}%</div>
                  </div>
                </div>
              </div>
              
              {/* Total Profit - Only visible to CEO, Branch Manager, and Marketing Supervisor */}
              {canViewAllProfits && (
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Profit</div>
                      <div className="text-lg font-bold">${totalProfit.toFixed(2)}/hr</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Profit Margin - Only visible to CEO, Branch Manager, and Marketing Supervisor */}
              {canViewAllProfits && (
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground">Profit Margin</div>
                      <div className="text-lg font-bold">{profitMargin.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleReset} className="mr-2">
              <RefreshCw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitCalculator;
