import React from 'react';
import { Clock, Calculator, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import HourlyMarginCalculator from '@/components/margin-calculator/HourlyMarginCalculator';

const HourlyCalculatorPage = () => {
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
            <Clock className="h-8 w-8 mr-3 text-blue-500" />
            Hourly Margin Calculator
          </h1>
          <p className="text-muted-foreground mt-2">
            Calculate margins for hourly-based candidates (W2 Hourly, 1099, C2C)
          </p>
        </div>
      </div>

      <HourlyMarginCalculator />
    </div>
  );
};

export default HourlyCalculatorPage;
