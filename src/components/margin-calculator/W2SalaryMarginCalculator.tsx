import React, { useState, useEffect } from 'react';
import { Calculator, AlertTriangle, CheckCircle, DollarSign, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/adminPermissions';
import {
  MarginCalculationInput,
  MarginCalculationResult,
  CandidateSourceType,
  SOURCE_TYPE_CONFIGS,
  DEFAULT_VALUES,
} from '@/types/marginCalculator';
import {
  calculateMargin,
  validateCalculationInput,
  getDefaultValues,
  requiresApproval,
  formatCurrency,
  formatPercentage,
} from '@/utils/marginCalculations';

const W2SalaryMarginCalculator = () => {
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const isManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const canViewAllMargins = adminUser || isManager;

  // Form state
  const [formData, setFormData] = useState<MarginCalculationInput>({
    clientBudget: 120,
    vendorCommissionPercent: DEFAULT_VALUES.vendorCommissionPercent,
    employerTaxPercent: DEFAULT_VALUES.employerTaxPercent,
    overheadFee: DEFAULT_VALUES.overheadFee,
    recruiterCommissionFlat: DEFAULT_VALUES.recruiterCommissionFlat,
    sourceType: 'internal-recruiter',
    engagementType: 'w2-salary',
    annualSalary: 150000,
    hasReferralFee: false,
    requiresApproval: false,
  });

  // Calculation results
  const [results, setResults] = useState<MarginCalculationResult | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [needsApproval, setNeedsApproval] = useState(false);

  // Update form data when source type changes
  useEffect(() => {
    const defaults = getDefaultValues(formData.sourceType, formData.engagementType);
    setFormData(prev => ({
      ...prev,
      ...defaults,
    }));
  }, [formData.sourceType]);

  // Calculate results when form data changes
  useEffect(() => {
    const validationErrors = validateCalculationInput(formData);
    setErrors(validationErrors);
    
    if (validationErrors.length === 0) {
      try {
        const calculationResults = calculateMargin(formData);
        setResults(calculationResults);
        setNeedsApproval(requiresApproval(formData));
      } catch (error) {
        setResults(null);
        setErrors([error instanceof Error ? error.message : 'Calculation error']);
      }
    } else {
      setResults(null);
    }
  }, [formData]);

  const handleInputChange = (field: keyof MarginCalculationInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const sourceConfig = SOURCE_TYPE_CONFIGS[formData.sourceType];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Input Form */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              W2 Salary Calculation Inputs
            </CardTitle>
            <CardDescription>
              Configure the parameters for W2 salary margin calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Source Type */}
            <div>
              <Label htmlFor="sourceType">Candidate Source Type</Label>
              <Select
                value={formData.sourceType}
                onValueChange={(value: CandidateSourceType) => handleInputChange('sourceType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SOURCE_TYPE_CONFIGS).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                {sourceConfig.description}
              </p>
            </div>

            <Separator />

            {/* Client Budget */}
            <div>
              <Label htmlFor="clientBudget">Client Hourly Budget ($)</Label>
              <Input
                id="clientBudget"
                type="number"
                value={formData.clientBudget}
                onChange={(e) => handleInputChange('clientBudget', parseFloat(e.target.value) || 0)}
                placeholder="120"
              />
            </div>

            {/* Annual Salary */}
            <div>
              <Label htmlFor="annualSalary">Annual Salary ($)</Label>
              <Input
                id="annualSalary"
                type="number"
                value={formData.annualSalary || 0}
                onChange={(e) => handleInputChange('annualSalary', parseFloat(e.target.value) || 0)}
                placeholder="150000"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Will be converted to hourly rate (÷ 2080 hours)
              </p>
            </div>

            {/* Vendor Commission */}
            <div>
              <Label htmlFor="vendorCommission">Vendor Commission (%)</Label>
              <Input
                id="vendorCommission"
                type="number"
                step="0.1"
                value={formData.vendorCommissionPercent}
                onChange={(e) => handleInputChange('vendorCommissionPercent', parseFloat(e.target.value) || 0)}
                placeholder="3.0"
              />
            </div>

            {/* Employer Tax */}
            <div>
              <Label htmlFor="employerTax">Employer Tax (%)</Label>
              <Input
                id="employerTax"
                type="number"
                step="0.1"
                value={formData.employerTaxPercent}
                onChange={(e) => handleInputChange('employerTaxPercent', parseFloat(e.target.value) || 0)}
                placeholder="10.0"
              />
            </div>

            {/* Overhead Fee */}
            <div>
              <Label htmlFor="overheadFee">Overhead Fee ($)</Label>
              <Input
                id="overheadFee"
                type="number"
                step="0.01"
                value={formData.overheadFee}
                onChange={(e) => handleInputChange('overheadFee', parseFloat(e.target.value) || 0)}
                placeholder="5.00"
              />
            </div>

            {/* Recruiter Commission */}
            <div>
              <Label htmlFor="recruiterCommission">
                Recruiter Commission ($)
                {sourceConfig.suppressesRecruiterCommission && (
                  <span className="text-muted-foreground ml-1">(Suppressed for this source type)</span>
                )}
              </Label>
              <Input
                id="recruiterCommission"
                type="number"
                value={formData.recruiterCommissionFlat}
                onChange={(e) => handleInputChange('recruiterCommissionFlat', parseFloat(e.target.value) || 0)}
                placeholder="300"
                disabled={sourceConfig.suppressesRecruiterCommission && !sourceConfig.allowsRecruiterCommission}
              />
            </div>

            {/* Referral Fee (if applicable) */}
            {sourceConfig.requiresReferralFee && (
              <div>
                <Label htmlFor="referralFee">Referral Fee ($)</Label>
                <Input
                  id="referralFee"
                  type="number"
                  value={formData.referralFeeAmount || 0}
                  onChange={(e) => handleInputChange('referralFeeAmount', parseFloat(e.target.value) || 0)}
                  placeholder="500"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Validation Errors */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Approval Required */}
        {needsApproval && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This calculation requires approval due to commission override or vendor commission change.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Results */}
      <div className="space-y-6">
        {results && (
          <>
            {/* Summary Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  W2 Salary Calculation Results
                </CardTitle>
                <CardDescription>
                  Margin calculation for W2 salaried employee
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.clientBudget)}/hr
                    </div>
                    <div className="text-sm text-muted-foreground">Client Budget</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.hourlySalary || 0)}/hr
                    </div>
                    <div className="text-sm text-muted-foreground">Hourly Salary</div>
                  </div>
                  {canViewAllMargins && (
                    <>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(results.finalCompany)}/hr
                        </div>
                        <div className="text-sm text-muted-foreground">Net Margin</div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatPercentage(results.profitMargin)}
                        </div>
                        <div className="text-sm text-muted-foreground">Profit Margin</div>
                      </div>
                    </>
                  )}
                </div>

                {/* Additional Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Salary Breakdown</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Annual Salary:</span>
                      <span className="font-medium ml-2">{formatCurrency(formData.annualSalary || 0)}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Hourly Rate:</span>
                      <span className="font-medium ml-2">{formatCurrency(results.hourlySalary || 0)}/hr</span>
                    </div>
                    {canViewAllMargins && (
                      <>
                        <div>
                          <span className="text-blue-700">Employer Tax:</span>
                          <span className="font-medium ml-2">{formatCurrency(results.employerTax)}/hr</span>
                        </div>
                        <div>
                          <span className="text-blue-700">Total Cost:</span>
                          <span className="font-medium ml-2">{formatCurrency(results.companyCost || 0)}/hr</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            {canViewAllMargins && (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Breakdown</CardTitle>
                  <CardDescription>Step-by-step calculation breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Client Budget</span>
                      <span className="font-medium">{formatCurrency(results.breakdown.clientBudget)}/hr</span>
                    </div>
                    <div className="flex justify-between items-center text-red-600">
                      <span>- Vendor Fee ({formData.vendorCommissionPercent}%)</span>
                      <span className="font-medium">-{formatCurrency(results.breakdown.vendorFee)}/hr</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-medium">
                      <span>Available Margin</span>
                      <span>{formatCurrency(results.breakdown.available)}/hr</span>
                    </div>
                    <div className="flex justify-between items-center text-blue-600">
                      <span>- Hourly Salary</span>
                      <span className="font-medium">-{formatCurrency(results.hourlySalary || 0)}/hr</span>
                    </div>
                    <div className="flex justify-between items-center text-red-600">
                      <span>- Employer Tax ({formData.employerTaxPercent}%)</span>
                      <span className="font-medium">-{formatCurrency(results.breakdown.employerTax)}/hr</span>
                    </div>
                    <div className="flex justify-between items-center text-red-600">
                      <span>- Overhead Fee</span>
                      <span className="font-medium">-{formatCurrency(results.breakdown.overhead)}/hr</span>
                    </div>
                    {results.breakdown.recruiterCommission > 0 && (
                      <div className="flex justify-between items-center text-red-600">
                        <span>- Recruiter Commission</span>
                        <span className="font-medium">-{formatCurrency(results.breakdown.recruiterCommission)}/hr</span>
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between items-center font-bold text-green-600">
                      <span>Final Net Margin</span>
                      <span>{formatCurrency(results.breakdown.netMargin)}/hr</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex space-x-4">
              <Button className="flex-1">
                <DollarSign className="h-4 w-4 mr-2" />
                Save Calculation
              </Button>
              {needsApproval && (
                <Button variant="outline" className="flex-1">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Request Approval
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default W2SalaryMarginCalculator;
