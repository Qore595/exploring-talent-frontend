import {
  MarginCalculationInput,
  MarginCalculationResult,
  ENGAGEMENT_TYPE_CONFIGS,
  SOURCE_TYPE_CONFIGS,
  calculateOverheadFee,
} from '@/types/marginCalculator';

/**
 * Calculate margin for hourly candidates (W2 Hourly, 1099, C2C)
 * Formula:
 * Available = CB - (CB × Vendor%)
 * CompanyShare = Available × Split%
 * EmployerTax = (W2 Hourly only) CompanyShare × ET% // Else = 0
 * NetMargin = CompanyShare - EmployerTax - Overhead
 * FinalCompany = NetMargin - RecruiterComm
 */
export const calculateHourlyMargin = (input: MarginCalculationInput): MarginCalculationResult => {
  const {
    clientBudget,
    vendorCommissionPercent,
    companySplitPercent = 80,
    employerTaxPercent,
    overheadFee,
    recruiterCommissionFlat,
    engagementType,
  } = input;

  const engagementConfig = ENGAGEMENT_TYPE_CONFIGS[engagementType];
  
  // Step 1: Calculate available margin after vendor commission
  const vendorFee = clientBudget * (vendorCommissionPercent / 100);
  const available = clientBudget - vendorFee;
  
  // Step 2: Calculate company share
  const companyShare = available * (companySplitPercent / 100);
  
  // Step 3: Calculate employer tax (only for W2 Hourly)
  const employerTax = engagementConfig.requiresEmployerTax 
    ? companyShare * (employerTaxPercent / 100)
    : 0;
  
  // Step 4: Calculate net margin
  const netMargin = companyShare - employerTax - overheadFee;
  
  // Step 5: Calculate final company profit
  const finalCompany = netMargin - recruiterCommissionFlat;
  
  // Calculate candidate rate
  const candidateRate = available - companyShare;
  
  // Calculate profit margin percentage
  const profitMargin = (finalCompany / clientBudget) * 100;
  
  return {
    clientBudget,
    vendorFee,
    available,
    companyShare,
    employerTax,
    netMargin,
    finalCompany,
    candidateRate,
    profitMargin,
    breakdown: {
      clientBudget,
      vendorFee,
      available,
      companyShare,
      employerTax,
      overhead: overheadFee,
      recruiterCommission: recruiterCommissionFlat,
      netMargin: finalCompany,
    },
  };
};

/**
 * Calculate margin for W2 Salary candidates
 * Formula:
 * HourlySalary = AnnualSalary / 2080
 * EmployerTax = HourlySalary × ET%
 * CompanyCost = HourlySalary + EmployerTax
 * Available = CB - (CB × Vendor%)
 * NetMargin = Available - CompanyCost - Overhead
 * FinalCompany = NetMargin - RecruiterComm
 */
export const calculateW2SalaryMargin = (input: MarginCalculationInput): MarginCalculationResult => {
  const {
    clientBudget,
    vendorCommissionPercent,
    employerTaxPercent,
    overheadFee,
    recruiterCommissionFlat,
    annualSalary = 0,
  } = input;
  
  // Step 1: Calculate hourly salary
  const hourlySalary = annualSalary / 2080; // 2080 = 52 weeks × 40 hours
  
  // Step 2: Calculate employer tax
  const employerTax = hourlySalary * (employerTaxPercent / 100);
  
  // Step 3: Calculate total company cost per hour
  const companyCost = hourlySalary + employerTax;
  
  // Step 4: Calculate available margin after vendor commission
  const vendorFee = clientBudget * (vendorCommissionPercent / 100);
  const available = clientBudget - vendorFee;
  
  // Step 5: Calculate net margin
  const netMargin = available - companyCost - overheadFee;
  
  // Step 6: Calculate final company profit
  const finalCompany = netMargin - recruiterCommissionFlat;
  
  // Calculate profit margin percentage
  const profitMargin = (finalCompany / clientBudget) * 100;
  
  return {
    clientBudget,
    vendorFee,
    available,
    companyShare: companyCost, // For W2 Salary, this represents the total cost
    employerTax,
    netMargin,
    finalCompany,
    hourlySalary,
    companyCost,
    candidateRate: hourlySalary, // The candidate's hourly rate
    profitMargin,
    breakdown: {
      clientBudget,
      vendorFee,
      available,
      companyShare: companyCost,
      employerTax,
      overhead: overheadFee,
      recruiterCommission: recruiterCommissionFlat,
      netMargin: finalCompany,
    },
  };
};

/**
 * Main calculation function that routes to the appropriate calculator
 */
export const calculateMargin = (input: MarginCalculationInput): MarginCalculationResult => {
  // Auto-calculate overhead fee if not provided
  const calculationInput = {
    ...input,
    overheadFee: input.overheadFee || calculateOverheadFee(input.clientBudget),
  };
  
  // Route to appropriate calculator based on engagement type
  switch (input.engagementType) {
    case 'w2-salary':
      return calculateW2SalaryMargin(calculationInput);
    case 'w2-hourly':
    case '1099':
    case 'c2c':
      return calculateHourlyMargin(calculationInput);
    default:
      throw new Error(`Unsupported engagement type: ${input.engagementType}`);
  }
};

/**
 * Validate calculation input
 */
export const validateCalculationInput = (input: MarginCalculationInput): string[] => {
  const errors: string[] = [];
  
  if (input.clientBudget <= 0) {
    errors.push('Client budget must be greater than 0');
  }
  
  if (input.vendorCommissionPercent < 0 || input.vendorCommissionPercent > 100) {
    errors.push('Vendor commission must be between 0% and 100%');
  }
  
  if (input.companySplitPercent && (input.companySplitPercent < 0 || input.companySplitPercent > 100)) {
    errors.push('Company split must be between 0% and 100%');
  }
  
  if (input.employerTaxPercent < 0 || input.employerTaxPercent > 100) {
    errors.push('Employer tax must be between 0% and 100%');
  }
  
  if (input.overheadFee < 0) {
    errors.push('Overhead fee cannot be negative');
  }
  
  if (input.recruiterCommissionFlat < 0) {
    errors.push('Recruiter commission cannot be negative');
  }
  
  if (input.engagementType === 'w2-salary' && (!input.annualSalary || input.annualSalary <= 0)) {
    errors.push('Annual salary is required for W2 Salary calculations');
  }
  
  if (input.hasReferralFee && (!input.referralFeeAmount || input.referralFeeAmount < 0)) {
    errors.push('Referral fee amount is required when referral fee is enabled');
  }
  
  return errors;
};

/**
 * Get default values based on source and engagement type
 */
export const getDefaultValues = (
  sourceType: MarginCalculationInput['sourceType'],
  engagementType: MarginCalculationInput['engagementType']
): Partial<MarginCalculationInput> => {
  const sourceConfig = SOURCE_TYPE_CONFIGS[sourceType];
  const engagementConfig = ENGAGEMENT_TYPE_CONFIGS[engagementType];
  
  return {
    vendorCommissionPercent: 3,
    companySplitPercent: engagementConfig.allowsSplit ? 80 : undefined,
    employerTaxPercent: 10,
    recruiterCommissionFlat: sourceConfig.defaultRecruiterCommission,
    hasReferralFee: sourceConfig.requiresReferralFee,
    requiresApproval: false,
  };
};

/**
 * Check if calculation requires approval
 */
export const requiresApproval = (input: MarginCalculationInput): boolean => {
  const sourceConfig = SOURCE_TYPE_CONFIGS[input.sourceType];
  
  // Commission override for internal referral
  if (input.sourceType === 'internal-referral' && input.recruiterCommissionFlat > 0) {
    return true;
  }
  
  // Vendor commission change from default
  if (input.vendorCommissionPercent !== 3) {
    return true;
  }
  
  return false;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format percentage for display
 */
export const formatPercentage = (percentage: number): string => {
  return `${percentage.toFixed(1)}%`;
};
