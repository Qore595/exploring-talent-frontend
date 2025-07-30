// Hotlist Management Types

export type HotlistStatus = 'draft' | 'scheduled' | 'sent' | 'completed' | 'cancelled';
export type ScheduleType = 'immediate' | 'daily' | 'weekly' | 'bi_weekly' | 'custom';
export type HotlistCandidateStatus = 'selected' | 'sent' | 'responded' | 'interviewed' | 'placed' | 'rejected';
export type AnalyticsEventType = 'email_sent' | 'email_opened' | 'email_clicked' | 'vendor_reply' | 'interview_scheduled' | 'placement_confirmed';

export interface Hotlist {
  id: string;
  name: string;
  description?: string;
  batchSize: number;
  status: HotlistStatus;
  emailTemplateId?: string;
  subjectTemplate?: string;
  emailContent?: string;
  scheduleType: ScheduleType;
  scheduleConfig?: Record<string, any>;
  scheduledAt?: string;
  sentAt?: string;
  completedAt?: string;
  targetAudience?: string[];
  showWorkAuthorization: boolean;
  autoLockEnabled: boolean;
  lockedAt?: string;
  lockedBy?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  candidates?: HotlistCandidate[];
}

export interface HotlistCandidate {
  id: string;
  hotlistId: string;
  benchResourceId: string;
  employeeId: string;
  positionInBatch: number;
  includeWorkAuthorization: boolean;
  customNotes?: string;
  status: HotlistCandidateStatus;
  sentAt?: string;
  responseReceivedAt?: string;
  vendorResponse?: string;
  vendorEmail?: string;
  interviewScheduledAt?: string;
  placementConfirmedAt?: string;
  rejectionReason?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  benchResource?: {
    id: string;
    skillsSummary?: string;
    preferredRoles?: string[];
    locationFlexibility: string;
    availabilityDate: string;
    lastRate?: number;
    desiredRate?: number;
    workAuthorization?: string;
  };
}

export interface HotlistAnalytics {
  id: string;
  hotlistId: string;
  hotlistCandidateId?: string;
  eventType: AnalyticsEventType;
  eventTimestamp: string;
  vendorEmail?: string;
  emailSubject?: string;
  clickedLink?: string;
  userAgent?: string;
  ipAddress?: string;
  responseTimeHours?: number;
  conversionValue?: number;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
}

// Request/Response Types
export interface CreateHotlistRequest {
  name: string;
  description?: string;
  batchSize: number;
  emailTemplateId?: string;
  subjectTemplate?: string;
  emailContent?: string;
  scheduleType: ScheduleType;
  scheduleConfig?: Record<string, any>;
  scheduledAt?: string;
  targetAudience?: string[];
  showWorkAuthorization?: boolean;
  autoLockEnabled?: boolean;
  candidateIds: string[]; // Array of bench resource IDs
}

export interface UpdateHotlistRequest extends Partial<CreateHotlistRequest> {
  id: string;
  status?: HotlistStatus;
}

export interface AddCandidatesToHotlistRequest {
  hotlistId: string;
  candidates: Array<{
    benchResourceId: string;
    includeWorkAuthorization?: boolean;
    customNotes?: string;
  }>;
}

export interface UpdateHotlistCandidateRequest {
  id: string;
  status?: HotlistCandidateStatus;
  includeWorkAuthorization?: boolean;
  customNotes?: string;
  vendorResponse?: string;
  vendorEmail?: string;
  interviewScheduledAt?: string;
  placementConfirmedAt?: string;
  rejectionReason?: string;
}

// Filter and Search Types
export interface HotlistFilters {
  status?: HotlistStatus[];
  scheduleType?: ScheduleType[];
  createdBy?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
  batchSizeMin?: number;
  batchSizeMax?: number;
}

export interface HotlistCandidateFilters {
  hotlistId?: string;
  status?: HotlistCandidateStatus[];
  includeWorkAuthorization?: boolean;
  search?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

// API Response Types
export interface HotlistResponse {
  success: boolean;
  data: Hotlist;
  message?: string;
}

export interface HotlistsResponse {
  success: boolean;
  data: Hotlist[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface HotlistCandidateResponse {
  success: boolean;
  data: HotlistCandidate;
  message?: string;
}

export interface HotlistCandidatesResponse {
  success: boolean;
  data: HotlistCandidate[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface HotlistAnalyticsResponse {
  success: boolean;
  data: HotlistAnalytics[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Dashboard and Analytics Types
export interface HotlistStats {
  totalHotlists: number;
  activeHotlists: number;
  scheduledHotlists: number;
  completedHotlists: number;
  totalCandidatesSent: number;
  totalResponses: number;
  totalInterviews: number;
  totalPlacements: number;
  averageResponseTime: number;
  conversionRate: number;
}

export interface HotlistPerformanceMetrics {
  emailsSent: number;
  emailsOpened: number;
  emailsClicked: number;
  vendorReplies: number;
  interviewsScheduled: number;
  placementsConfirmed: number;
  openRate: number;
  clickRate: number;
  responseRate: number;
  conversionRate: number;
  averageResponseTimeHours: number;
  totalRevenue: number;
}

export interface HotlistDashboardData {
  stats: HotlistStats;
  recentHotlists: Hotlist[];
  upcomingScheduled: Hotlist[];
  performanceMetrics: HotlistPerformanceMetrics;
  topPerformingHotlists: Array<{
    hotlist: Hotlist;
    metrics: HotlistPerformanceMetrics;
  }>;
}

// Subject Builder Types
export interface SubjectToken {
  id: string;
  label: string;
  value: string;
  category: 'candidate' | 'company' | 'job' | 'custom';
  description?: string;
}

export interface SubjectTemplate {
  id: string;
  name: string;
  template: string;
  tokens: SubjectToken[];
  category: string;
  isDefault: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

// Schedule Configuration Types
export interface ScheduleConfig {
  time?: string; // HH:MM format
  timezone?: string;
  days?: number[]; // 0-6 for Sunday-Saturday
  interval?: number; // For custom intervals
  endDate?: string;
  maxOccurrences?: number;
}

// Form Types
export interface HotlistFormData {
  name: string;
  description: string;
  batchSize: number;
  emailTemplateId: string;
  subjectTemplate: string;
  emailContent: string;
  scheduleType: ScheduleType;
  scheduleConfig: ScheduleConfig;
  scheduledAt: string;
  targetAudience: string[];
  showWorkAuthorization: boolean;
  autoLockEnabled: boolean;
  selectedCandidates: string[];
}

export interface CandidatePreviewCard {
  benchResourceId: string;
  employee: {
    id: string;
    name: string;
    email: string;
  };
  roles: string[];
  skills: string[];
  location: string;
  availability: string;
  workAuthorization?: string;
  includeWorkAuth: boolean;
  selected: boolean;
}
