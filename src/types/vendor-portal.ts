// Vendor Portal Types
export interface VendorUser {
  id: string;
  vendorId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: VendorUserRole;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin?: Date;
  mfaEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type VendorUserRole = 'Vendor Admin' | 'Vendor PoC';

export interface VendorSession {
  id: string;
  userId: string;
  vendorId: string;
  token: string;
  expiresAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}

export interface VendorMessage {
  id: string;
  vendorId: string;
  fromUser: string;
  toUser: string;
  subject: string;
  content: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
}

export interface VendorLoginRequest {
  username: string;
  password: string;
  mfaCode?: string;
  rememberMe?: boolean;
}

export interface VendorLoginResponse {
  success: boolean;
  token?: string;
  user?: VendorUser;
  vendor?: VendorPortalInfo;
  requiresMfa?: boolean;
  message?: string;
}

export interface VendorPortalInfo {
  id: string;
  vendorType: 'Prime Vendor' | 'Sub Vendor';
  legalName: string;
  displayName: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  onboardDate: Date;
  tierLevel: 'Preferred' | 'Tier-2' | 'Tier-3' | 'Standard';
  internalNotes: string;
  vendorNotes: string;
  complianceStatus: ComplianceStatus;
  primaryContact?: VendorPortalPoC;
  backupContact?: VendorPortalPoC;
}

export interface VendorPortalPoC {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  status: 'Active' | 'Inactive' | 'Replaced';
  isPrimary: boolean;
  isBackup: boolean;
  lastValidated?: Date;
  validationStatus: 'Validated' | 'Pending' | 'Overdue' | 'Failed';
}

export interface ComplianceStatus {
  overall: 'Compliant' | 'Non-Compliant' | 'Pending Review';
  documents: ComplianceDocument[];
  lastReview: Date;
  nextReview: Date;
}

export interface ComplianceDocument {
  id: string;
  type: ComplianceDocumentType;
  name: string;
  fileName: string;
  fileSize: number;
  uploadDate: Date;
  expiryDate?: Date;
  status: 'Valid' | 'Expired' | 'Expiring Soon' | 'Under Review';
  version: number;
  uploadedBy: string;
}

export type ComplianceDocumentType = 
  | 'Certificate of Insurance'
  | 'W9 Form'
  | 'NDA'
  | 'MSA'
  | 'Business License'
  | 'Professional Certification'
  | 'Background Check'
  | 'Other';

export interface VendorAssignment {
  id: string;
  clientName: string;
  positionTitle: string;
  status: AssignmentStatus;
  startDate: Date;
  endDate?: Date;
  sowDocument?: string;
  agreementDocument?: string;
  candidates: VendorCandidate[];
  createdAt: Date;
  updatedAt: Date;
}

export type AssignmentStatus = 'Open' | 'In Progress' | 'Filled' | 'Cancelled' | 'Completed';

export interface VendorCandidate {
  id: string;
  assignmentId: string;
  name: string;
  email: string;
  phone?: string;
  resumeDocument?: string;
  rateCard?: string;
  status: CandidateStatus;
  submittedAt: Date;
  lastUpdated: Date;
  notes?: string;
}

export type CandidateStatus = 'Submitted' | 'Under Review' | 'Interviewing' | 'Selected' | 'Rejected' | 'Withdrawn';

export interface VendorNotification {
  id: string;
  vendorId: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export type NotificationType = 
  | 'PoC Validation'
  | 'Compliance Document'
  | 'Assignment Update'
  | 'Payment Update'
  | 'System Maintenance'
  | 'Account Update';

export interface VendorMessage {
  id: string;
  vendorId: string;
  fromUser: string;
  toUser: string;
  subject: string;
  content: string;
  isRead: boolean;
  attachments?: MessageAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  downloadUrl: string;
}

export interface CommissionStatement {
  id: string;
  vendorId: string;
  period: string;
  totalCommission: number;
  totalPlacements: number;
  status: 'Draft' | 'Finalized' | 'Paid';
  generatedAt: Date;
  paidAt?: Date;
  details: CommissionDetail[];
}

export interface CommissionDetail {
  candidateName: string;
  clientName: string;
  positionTitle: string;
  placementDate: Date;
  commissionRate: number;
  commissionAmount: number;
  status: 'Active' | 'Completed' | 'Terminated';
}

export interface VendorAuditLog {
  id: string;
  vendorId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface VendorDashboardStats {
  activeAssignments: number;
  totalCandidates: number;
  pendingDocuments: number;
  unreadNotifications: number;
  complianceScore: number;
  lastLogin: Date;
}

// API Response Types
export interface VendorApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface VendorProfileUpdateRequest {
  displayName?: string;
  vendorNotes?: string;
  primaryContactId?: string;
  backupContactId?: string;
}

export interface VendorPoCUpdateRequest {
  name: string;
  role: string;
  email: string;
  phone?: string;
  isPrimary: boolean;
  isBackup: boolean;
}

export interface CandidateSubmissionRequest {
  assignmentId: string;
  name: string;
  email: string;
  phone?: string;
  resumeFile: File;
  rateCardFile?: File;
  notes?: string;
}

export interface MessageSendRequest {
  toUser: string;
  subject: string;
  content: string;
  attachments?: File[];
}

// Filter Types
export interface AssignmentFilters {
  status?: AssignmentStatus[];
  clientName?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CandidateFilters {
  status?: CandidateStatus[];
  assignmentId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface NotificationFilters {
  type?: NotificationType[];
  priority?: string[];
  isRead?: boolean;
  dateFrom?: string;
  dateTo?: string;
}
