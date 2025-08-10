// Candidate Source Types
export type CandidateSourceType = 
  | 'internal-referral'
  | 'external-referral'
  | 'sub-vendor'
  | 'internal-recruiter'
  | 'recruiting-agency'
  | 'bench-candidate';

// Candidate Engagement Types
export type CandidateEngagementType = 
  | 'w2-salary'
  | 'w2-hourly'
  | '1099'
  | 'c2c';

// Source Type Configuration
export interface SourceTypeConfig {
  label: string;
  description: string;
  allowsRecruiterCommission: boolean;
  defaultRecruiterCommission: number;
  requiresReferralFee: boolean;
  suppressesRecruiterCommission: boolean;
}

// Engagement Type Configuration
export interface EngagementTypeConfig {
  label: string;
  description: string;
  allowsSplit: boolean;
  requiresEmployerTax: boolean;
  requiresOverhead: boolean;
  usesSalary: boolean;
}

// Calculation Input
export interface MarginCalculationInput {
  // Basic inputs
  clientBudget: number;
  vendorCommissionPercent: number;
  companySplitPercent?: number;
  employerTaxPercent: number;
  overheadFee: number;
  recruiterCommissionFlat: number;
  
  // Source and engagement types
  sourceType: CandidateSourceType;
  engagementType: CandidateEngagementType;
  
  // W2 Salary specific
  annualSalary?: number;
  
  // Referral specific
  hasReferralFee: boolean;
  referralFeeAmount?: number;
  
  // Approval workflow
  requiresApproval: boolean;
  approvalReason?: string;
}

// Calculation Result
export interface MarginCalculationResult {
  // Input values
  clientBudget: number;
  vendorFee: number;
  available: number;
  
  // Calculated values
  companyShare: number;
  employerTax: number;
  netMargin: number;
  finalCompany: number;
  
  // For W2 Salary
  hourlySalary?: number;
  companyCost?: number;
  
  // Additional info
  candidateRate: number;
  profitMargin: number;
  
  // Breakdown
  breakdown: {
    clientBudget: number;
    vendorFee: number;
    available: number;
    companyShare: number;
    employerTax: number;
    overhead: number;
    recruiterCommission: number;
    netMargin: number;
  };
}

// Approval Request
export interface ApprovalRequest {
  id: string;
  type: 'commission-override' | 'vendor-commission-change';
  candidateName: string;
  position: string;
  requestedBy: string;
  reason: string;
  originalValue: number;
  requestedValue: number;
  clientBudget: number;
  submittedDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
}

// Audit Log Entry
export interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  candidateName: string;
  details: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Source Type Configurations
export const SOURCE_TYPE_CONFIGS: Record<CandidateSourceType, SourceTypeConfig> = {
  'internal-referral': {
    label: 'Internal Referral (Employee)',
    description: 'Employee referral - no recruiter commission by default',
    allowsRecruiterCommission: true, // Can be overridden with approval
    defaultRecruiterCommission: 0,
    requiresReferralFee: false,
    suppressesRecruiterCommission: true,
  },
  'external-referral': {
    label: 'External Referral',
    description: 'External referral with optional referral fee',
    allowsRecruiterCommission: false,
    defaultRecruiterCommission: 0,
    requiresReferralFee: true,
    suppressesRecruiterCommission: true,
  },
  'sub-vendor': {
    label: 'Sub-Vendor',
    description: 'C2C model from sub-vendor',
    allowsRecruiterCommission: false,
    defaultRecruiterCommission: 0,
    requiresReferralFee: false,
    suppressesRecruiterCommission: true,
  },
  'internal-recruiter': {
    label: 'Internal Recruiter Sourced',
    description: 'Sourced by internal recruiter - commission applies',
    allowsRecruiterCommission: true,
    defaultRecruiterCommission: 300,
    requiresReferralFee: false,
    suppressesRecruiterCommission: false,
  },
  'recruiting-agency': {
    label: 'Recruiting Agency',
    description: 'Flat placement fee, no internal commission',
    allowsRecruiterCommission: false,
    defaultRecruiterCommission: 0,
    requiresReferralFee: false,
    suppressesRecruiterCommission: true,
  },
  'bench-candidate': {
    label: 'Bench Candidate (W2 Resource)',
    description: 'No sourcing cost, treated as salaried W2',
    allowsRecruiterCommission: false,
    defaultRecruiterCommission: 0,
    requiresReferralFee: false,
    suppressesRecruiterCommission: true,
  },
};

// Engagement Type Configurations
export const ENGAGEMENT_TYPE_CONFIGS: Record<CandidateEngagementType, EngagementTypeConfig> = {
  'w2-salary': {
    label: 'W2 (Salary)',
    description: 'W2 employee with annual salary',
    allowsSplit: false,
    requiresEmployerTax: true,
    requiresOverhead: true,
    usesSalary: true,
  },
  'w2-hourly': {
    label: 'W2 (Hourly)',
    description: 'W2 employee paid hourly',
    allowsSplit: true,
    requiresEmployerTax: true,
    requiresOverhead: true,
    usesSalary: false,
  },
  '1099': {
    label: '1099',
    description: '1099 contractor',
    allowsSplit: true,
    requiresEmployerTax: false,
    requiresOverhead: true,
    usesSalary: false,
  },
  'c2c': {
    label: 'C2C',
    description: 'Corp-to-Corp arrangement',
    allowsSplit: true,
    requiresEmployerTax: false,
    requiresOverhead: true,
    usesSalary: false,
  },
};

// Default Values
export const DEFAULT_VALUES = {
  vendorCommissionPercent: 3,
  companySplitPercent: 80,
  employerTaxPercent: 10,
  overheadFee: 5, // This should be calculated based on CB brackets
  recruiterCommissionFlat: 300,
};

// Overhead Fee Brackets (based on Client Budget)
export const OVERHEAD_BRACKETS = [
  { min: 0, max: 50, fee: 3 },
  { min: 50, max: 100, fee: 5 },
  { min: 100, max: 150, fee: 7 },
  { min: 150, max: Infinity, fee: 10 },
];

// Calculate overhead fee based on client budget
export const calculateOverheadFee = (clientBudget: number): number => {
  const bracket = OVERHEAD_BRACKETS.find(b => clientBudget >= b.min && clientBudget < b.max);
  return bracket ? bracket.fee : OVERHEAD_BRACKETS[OVERHEAD_BRACKETS.length - 1].fee;
};
