import React from 'react';
import { Users, Calculator, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import W2SalaryMarginCalculator from '@/components/margin-calculator/W2SalaryMarginCalculator';

const W2SalaryCalculatorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/margin-calculator/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Users className="h-8 w-8 mr-3 text-green-500" />
            W2 Salary Margin Calculator
          </h1>
          <p className="text-muted-foreground mt-2">
            Calculate margins for W2 salaried employees
          </p>
        </div>
      </div>

      <W2SalaryMarginCalculator />
    </div>
  );
};

export default W2SalaryCalculatorPage;
