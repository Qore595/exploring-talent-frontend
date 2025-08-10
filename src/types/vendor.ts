// Vendor Hub Types and Interfaces

export type VendorType = 'Prime Vendor' | 'Sub Vendor';
export type VendorStatus = 'Active' | 'Inactive';
export type VendorTierLevel = 'Preferred' | 'Tier-2' | 'Tier-3' | 'Standard';

export type PocRole = 
  | 'Relationship Manager'
  | 'Timesheet Approver'
  | 'Legal Contact'
  | 'Technical Lead'
  | 'Account Manager'
  | 'Billing Contact'
  | 'HR Contact'
  | 'Compliance Officer';

export type PocStatus = 'Active' | 'Replaced' | 'Inactive' | 'Leaving';

export type ValidationStatus = 'Pending' | 'Validated' | 'Overdue' | 'Failed';

export type CommunicationStatus = 'Sent' | 'Delivered' | 'Opened' | 'Responded' | 'Failed' | 'Pending';

// Base Vendor Interface
export interface Vendor {
  id: string;
  vendorType: VendorType;
  vendorName: string;
  status: VendorStatus;
  onboardDate: Date;
  offboardDate?: Date | null;
  tierLevel?: VendorTierLevel;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Point of Contact Interface
export interface PointOfContact {
  id: string;
  vendorId: string;
  name: string;
  role: PocRole;
  email: string;
  phone?: string;
  status: PocStatus;
  notes?: string;
  isPrimary: boolean;
  isBackup: boolean;
  lastValidated?: Date;
  validationStatus: ValidationStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

// Vendor with PoCs
export interface VendorWithPocs extends Vendor {
  pointsOfContact: PointOfContact[];
  primaryPoc?: PointOfContact;
  backupPoc?: PointOfContact;
}

// Validation Reminder Interface
export interface ValidationReminder {
  id: string;
  vendorId: string;
  pocId: string;
  reminderType: 'Internal' | 'External';
  scheduledDate: Date;
  sentDate?: Date;
  status: 'Scheduled' | 'Sent' | 'Completed' | 'Failed';
  recipientEmails: string[];
  templateId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Communication Log Interface
export interface CommunicationLog {
  id: string;
  vendorId: string;
  pocId?: string;
  communicationType: 'Email' | 'Phone' | 'Meeting' | 'System';
  subject: string;
  content: string;
  status: CommunicationStatus;
  sentBy: string;
  sentTo: string[];
  sentAt: Date;
  responseReceived?: boolean;
  responseDate?: Date;
  templateUsed?: string;
  attachments?: string[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Version History Interface
export interface VersionHistory {
  id: string;
  entityType: 'Vendor' | 'PoC';
  entityId: string;
  changeType: 'Created' | 'Updated' | 'Deleted' | 'Status Changed';
  fieldChanges: Record<string, { oldValue: any; newValue: any }>;
  changedBy: string;
  changeReason?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Dashboard Summary Interfaces
export interface VendorHealthSummary {
  totalVendors: number;
  activeVendors: number;
  inactiveVendors: number;
  primeVendors: number;
  subVendors: number;
  vendorsWithOutdatedPocs: number;
  percentageWithOutdatedPocs: number;
  alertsTriggered: number;
  lastUpdated: Date;
}

export interface PocTransitionTracker {
  upcomingTransitions: Array<{
    pocId: string;
    pocName: string;
    vendorName: string;
    currentRole: PocRole;
    transitionDate: Date;
    newPocName?: string;
    status: 'Scheduled' | 'In Progress' | 'Completed';
  }>;
  recentTransitions: Array<{
    pocId: string;
    pocName: string;
    vendorName: string;
    role: PocRole;
    transitionDate: Date;
    previousPocName?: string;
    status: 'Completed' | 'Failed';
  }>;
}

export interface EscalationRisk {
  vendorsWithoutBackupPoc: Array<{
    vendorId: string;
    vendorName: string;
    primaryPocName: string;
    primaryPocRole: PocRole;
    riskLevel: 'High' | 'Medium' | 'Low';
  }>;
  pendingReplacements: Array<{
    vendorId: string;
    vendorName: string;
    pocName: string;
    pocRole: PocRole;
    replacementDue: Date;
    daysOverdue: number;
  }>;
  unresponsiveContacts: Array<{
    vendorId: string;
    vendorName: string;
    pocName: string;
    pocRole: PocRole;
    lastContact: Date;
    daysSinceContact: number;
  }>;
}

// Form Interfaces
export interface VendorFormData {
  vendorType: VendorType;
  vendorName: string;
  status: VendorStatus;
  onboardDate: Date;
  offboardDate?: Date | null;
  tierLevel?: VendorTierLevel;
  notes?: string;
}

export interface PocFormData {
  name: string;
  role: PocRole;
  email: string;
  phone?: string;
  status: PocStatus;
  notes?: string;
  isPrimary: boolean;
  isBackup: boolean;
}

// API Response Interfaces
export interface VendorApiResponse {
  success: boolean;
  data: Vendor | VendorWithPocs | Vendor[];
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PocApiResponse {
  success: boolean;
  data: PointOfContact | PointOfContact[];
  message?: string;
  errors?: Record<string, string[]>;
}

export interface DashboardApiResponse {
  success: boolean;
  data: {
    vendorHealthSummary: VendorHealthSummary;
    pocTransitionTracker: PocTransitionTracker;
    escalationRisk: EscalationRisk;
  };
  message?: string;
}

// Filter and Search Interfaces
export interface VendorFilters {
  vendorType?: VendorType[];
  status?: VendorStatus[];
  tierLevel?: VendorTierLevel[];
  onboardDateFrom?: Date;
  onboardDateTo?: Date;
  hasOutdatedPocs?: boolean;
  searchTerm?: string;
}

export interface PocFilters {
  role?: PocRole[];
  status?: PocStatus[];
  validationStatus?: ValidationStatus[];
  isPrimary?: boolean;
  isBackup?: boolean;
  lastValidatedFrom?: Date;
  lastValidatedTo?: Date;
  searchTerm?: string;
}

// Pagination Interface
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Email Template Interface
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  templateType: 'PoC Validation' | 'Vendor Communication' | 'Reminder' | 'Alert';
  variables: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

// Consent and Signature Interface
export interface ConsentRecord {
  id: string;
  vendorId: string;
  pocId: string;
  consentType: 'PoC Update' | 'Data Processing' | 'Communication';
  consentGiven: boolean;
  consentDate: Date;
  ipAddress: string;
  userAgent: string;
  digitalSignature?: string;
  documentHash?: string;
  expiryDate?: Date;
  revokedDate?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
