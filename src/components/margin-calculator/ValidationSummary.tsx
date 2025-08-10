import React from 'react';
import { AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { MarginCalculationInput, MarginCalculationResult } from '@/types/marginCalculator';
import { formatCurrency, formatPercentage } from '@/utils/marginCalculations';

interface ValidationSummaryProps {
  input: MarginCalculationInput;
  result: MarginCalculationResult | null;
  errors: string[];
  warnings?: string[];
  needsApproval: boolean;
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({
  input,
  result,
  errors,
  warnings = [],
  needsApproval,
}) => {
  // Generate warnings based on business rules
  const generateWarnings = (): string[] => {
    const businessWarnings: string[] = [];
    
    if (result) {
      // Low profit margin warning
      if (result.profitMargin < 15) {
        businessWarnings.push(`Profit margin is ${formatPercentage(result.profitMargin)}, which is below the recommended 15% minimum.`);
      }
      
      // High vendor commission warning
      if (input.vendorCommissionPercent > 5) {
        businessWarnings.push(`Vendor commission of ${input.vendorCommissionPercent}% is higher than typical 3-5% range.`);
      }
      
      // Low company split warning for hourly
      if (input.companySplitPercent && input.companySplitPercent < 70) {
        businessWarnings.push(`Company split of ${input.companySplitPercent}% is lower than recommended 70-80% range.`);
      }
      
      // High recruiter commission warning
      if (input.recruiterCommissionFlat > 500) {
        businessWarnings.push(`Recruiter commission of ${formatCurrency(input.recruiterCommissionFlat)} is higher than typical $300-500 range.`);
      }
      
      // Negative margin warning
      if (result.finalCompany < 0) {
        businessWarnings.push('Final company margin is negative. This placement will result in a loss.');
      }
      
      // W2 Salary specific warnings
      if (input.engagementType === 'w2-salary' && input.annualSalary) {
        const hourlyEquivalent = input.annualSalary / 2080;
        if (hourlyEquivalent > input.clientBudget * 0.8) {
          businessWarnings.push('Candidate salary is very high relative to client budget. Consider negotiating.');
        }
      }
    }
    
    return [...warnings, ...businessWarnings];
  };

  const allWarnings = generateWarnings();
  const hasIssues = errors.length > 0 || allWarnings.length > 0 || needsApproval;

  if (!hasIssues && !result) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Validation Errors:</div>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Warnings */}
      {allWarnings.length > 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="font-medium mb-2">Business Warnings:</div>
            <ul className="list-disc list-inside space-y-1">
              {allWarnings.map((warning, index) => (
                <li key={index} className="text-sm">{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Approval Required */}
      {needsApproval && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Approval Required</div>
                <div className="text-sm mt-1">
                  This calculation requires approval due to:
                  <ul className="list-disc list-inside mt-1 ml-2">
                    {input.sourceType === 'internal-referral' && input.recruiterCommissionFlat > 0 && (
                      <li>Commission override for internal referral</li>
                    )}
                    {input.vendorCommissionPercent !== 3 && (
                      <li>Vendor commission change from standard 3%</li>
                    )}
                  </ul>
                </div>
              </div>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                Pending Approval
              </Badge>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Summary */}
      {result && errors.length === 0 && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            <div className="text-green-800">
              <div className="font-medium mb-2">Calculation Complete</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Net Margin:</span> {formatCurrency(result.finalCompany)}/hr
                </div>
                <div>
                  <span className="font-medium">Profit Margin:</span> {formatPercentage(result.profitMargin)}
                </div>
                <div>
                  <span className="font-medium">Candidate Rate:</span> {formatCurrency(result.candidateRate)}/hr
                </div>
                <div>
                  <span className="font-medium">Monthly Revenue:</span> {formatCurrency(result.finalCompany * 160)}
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Calculation Insights */}
      {result && errors.length === 0 && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-3">Calculation Insights</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <div className="font-medium mb-1">Margin Breakdown:</div>
              <ul className="space-y-1">
                <li>• Client pays: {formatCurrency(result.clientBudget)}/hr</li>
                <li>• Vendor fee: {formatCurrency(result.vendorFee)}/hr ({input.vendorCommissionPercent}%)</li>
                <li>• Available: {formatCurrency(result.available)}/hr</li>
                <li>• Company keeps: {formatCurrency(result.finalCompany)}/hr</li>
              </ul>
            </div>
            <div>
              <div className="font-medium mb-1">Key Metrics:</div>
              <ul className="space-y-1">
                <li>• Profit margin: {formatPercentage(result.profitMargin)}</li>
                <li>• Monthly potential: {formatCurrency(result.finalCompany * 160)}</li>
                <li>• Annual potential: {formatCurrency(result.finalCompany * 2080)}</li>
                {input.engagementType === 'w2-salary' && result.hourlySalary && (
                  <li>• Hourly equivalent: {formatCurrency(result.hourlySalary)}/hr</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {result && errors.length === 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
          <div className="text-sm text-gray-700 space-y-2">
            {result.profitMargin < 20 && (
              <div className="flex items-start">
                <span className="text-orange-500 mr-2">⚠️</span>
                <span>Consider negotiating a higher client rate or lower candidate cost to improve margins.</span>
              </div>
            )}
            {result.profitMargin >= 20 && result.profitMargin < 30 && (
              <div className="flex items-start">
                <span className="text-green-500 mr-2">✅</span>
                <span>Good margin range. This is a profitable placement.</span>
              </div>
            )}
            {result.profitMargin >= 30 && (
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">🎯</span>
                <span>Excellent margin! Consider if there's room to be more competitive on candidate rate.</span>
              </div>
            )}
            {input.engagementType !== 'w2-salary' && input.companySplitPercent && input.companySplitPercent > 85 && (
              <div className="flex items-start">
                <span className="text-yellow-500 mr-2">💡</span>
                <span>High company split may make it difficult to attract top candidates. Consider market rates.</span>
              </div>
            )}
            {input.vendorCommissionPercent < 2 && (
              <div className="flex items-start">
                <span className="text-blue-500 mr-2">💰</span>
                <span>Low vendor commission provides good margin opportunity.</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationSummary;
