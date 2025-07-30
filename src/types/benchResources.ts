// Bench Resource Management Types

export type BenchResourceStatus = 'available' | 'in_hotlist' | 'submitted' | 'interviewing' | 'offered' | 'deployed';
export type LocationFlexibility = 'remote' | 'hybrid' | 'onsite' | 'flexible';
export type EnrollmentSource = 'manual' | 'auto_assignment_end' | 'auto_project_completion';

export interface BenchResource {
  id: string;
  employeeId: string;
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    department?: {
      id: string;
      name: string;
    };
    designation?: {
      id: string;
      name: string;
    };
  };
  skillsSummary?: string;
  preferredRoles?: string[];
  locationFlexibility: LocationFlexibility;
  availabilityDate: string;
  lastRate?: number;
  desiredRate?: number;
  workAuthorization?: string;
  status: BenchResourceStatus;
  autoEnrolled: boolean;
  enrollmentSource: EnrollmentSource;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface Assignment {
  id: string;
  employeeId: string;
  projectName: string;
  clientName?: string;
  role: string;
  startDate: string;
  endDate?: string;
  confirmedEndDate?: string;
  status: 'active' | 'completed' | 'terminated' | 'on_hold';
  rate?: number;
  location?: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  autoBenchEnrollment: boolean;
  benchAlertSent: boolean;
  benchAlertSentAt?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BenchAlert {
  id: string;
  employeeId: string;
  assignmentId?: string;
  alertType: 'assignment_ending' | 'manual_addition' | 'status_change';
  alertMessage: string;
  recipientRoles: string[];
  sentTo?: string[];
  status: 'pending' | 'sent' | 'acknowledged' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledFor?: string;
  sentAt?: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Request/Response Types
export interface CreateBenchResourceRequest {
  employeeId: string;
  skillsSummary?: string;
  preferredRoles?: string[];
  locationFlexibility: LocationFlexibility;
  availabilityDate: string;
  lastRate?: number;
  desiredRate?: number;
  workAuthorization?: string;
  notes?: string;
  enrollmentSource?: EnrollmentSource;
}

export interface UpdateBenchResourceRequest extends Partial<CreateBenchResourceRequest> {
  id: string;
  status?: BenchResourceStatus;
}

export interface CreateAssignmentRequest {
  employeeId: string;
  projectName: string;
  clientName?: string;
  role: string;
  startDate: string;
  endDate?: string;
  confirmedEndDate?: string;
  rate?: number;
  location?: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  autoBenchEnrollment?: boolean;
  notes?: string;
}

export interface UpdateAssignmentRequest extends Partial<CreateAssignmentRequest> {
  id: string;
  status?: 'active' | 'completed' | 'terminated' | 'on_hold';
}

// Filter and Search Types
export interface BenchResourceFilters {
  status?: BenchResourceStatus[];
  locationFlexibility?: LocationFlexibility[];
  availabilityDateFrom?: string;
  availabilityDateTo?: string;
  skills?: string[];
  preferredRoles?: string[];
  rateMin?: number;
  rateMax?: number;
  autoEnrolled?: boolean;
  search?: string;
  departmentId?: string;
  designationId?: string;
}

export interface AssignmentFilters {
  status?: string[];
  clientName?: string;
  projectName?: string;
  endDateFrom?: string;
  endDateTo?: string;
  workType?: string[];
  search?: string;
}

// API Response Types
export interface BenchResourceResponse {
  success: boolean;
  data: BenchResource;
  message?: string;
}

export interface BenchResourcesResponse {
  success: boolean;
  data: BenchResource[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface AssignmentResponse {
  success: boolean;
  data: Assignment;
  message?: string;
}

export interface AssignmentsResponse {
  success: boolean;
  data: Assignment[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface BenchAlertResponse {
  success: boolean;
  data: BenchAlert;
  message?: string;
}

export interface BenchAlertsResponse {
  success: boolean;
  data: BenchAlert[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Dashboard and Analytics Types
export interface BenchResourceStats {
  totalAvailable: number;
  inHotlist: number;
  submitted: number;
  interviewing: number;
  offered: number;
  deployed: number;
  autoEnrolled: number;
  manuallyAdded: number;
}

export interface BenchResourceDashboardData {
  stats: BenchResourceStats;
  recentlyAdded: BenchResource[];
  upcomingAvailability: BenchResource[];
  pendingAlerts: BenchAlert[];
  statusDistribution: Array<{
    status: BenchResourceStatus;
    count: number;
    percentage: number;
  }>;
}

// Auto-Enrollment Configuration
export interface AutoEnrollmentSettings {
  enabled: boolean;
  daysBeforeEndDate: number;
  alertRoles: string[];
  requireConfirmation: boolean;
  defaultStatus: BenchResourceStatus;
  emailTemplateId?: string;
}

// Form Types
export interface BenchResourceFormData {
  employeeId: string;
  skillsSummary: string;
  preferredRoles: string[];
  locationFlexibility: LocationFlexibility;
  availabilityDate: string;
  lastRate: number | null;
  desiredRate: number | null;
  workAuthorization: string;
  notes: string;
}

export interface AssignmentFormData {
  employeeId: string;
  projectName: string;
  clientName: string;
  role: string;
  startDate: string;
  endDate: string;
  confirmedEndDate: string;
  rate: number | null;
  location: string;
  workType: 'remote' | 'hybrid' | 'onsite';
  autoBenchEnrollment: boolean;
  notes: string;
}
