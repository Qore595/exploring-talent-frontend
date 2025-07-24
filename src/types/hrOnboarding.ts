// HR Onboarding System Types

export type OnboardingStatus = 'pending' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'cancelled';
export type DocumentStatus = 'pending' | 'uploaded' | 'verified' | 'rejected' | 'expired';
export type TrainingStatus = 'not-started' | 'in-progress' | 'completed' | 'failed' | 'expired';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

// Candidate Interface
export interface OnboardingCandidate {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  departmentId: string;
  manager: string;
  managerId: string;
  startDate: string;
  status: OnboardingStatus;
  progress: number; // 0-100
  avatar?: string;
  location: string;
  locationId: string;
  salary?: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

// Task Interface
export interface OnboardingTask {
  id: string;
  candidateId: string;
  title: string;
  description: string;
  category: 'documentation' | 'training' | 'setup' | 'meeting' | 'compliance' | 'other';
  status: TaskStatus;
  priority: Priority;
  assignedTo: string;
  assignedToName: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  dependencies: string[]; // Task IDs that must be completed first
  attachments: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

// Document Interface
export interface OnboardingDocument {
  id: string;
  candidateId: string;
  name: string;
  description: string;
  category: 'personal' | 'legal' | 'tax' | 'benefits' | 'compliance' | 'other';
  status: DocumentStatus;
  required: boolean;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  filePath?: string;
  uploadedDate?: string;
  verifiedDate?: string;
  verifiedBy?: string;
  rejectionReason?: string;
  expiryDate?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

// Training Interface
export interface OnboardingTraining {
  id: string;
  candidateId: string;
  title: string;
  description: string;
  category: 'orientation' | 'safety' | 'compliance' | 'technical' | 'soft-skills' | 'other';
  status: TrainingStatus;
  required: boolean;
  priority: Priority;
  duration: number; // in hours
  completionPercentage: number; // 0-100
  startDate?: string;
  completedDate?: string;
  dueDate: string;
  instructor: string;
  instructorId: string;
  format: 'online' | 'in-person' | 'hybrid' | 'self-paced';
  location?: string;
  materials: string[];
  assessmentScore?: number;
  passingScore: number;
  attempts: number;
  maxAttempts: number;
  certificateUrl?: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

// Request/Response Types
export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  departmentId: string;
  managerId: string;
  startDate: string;
  locationId: string;
  salary?: number;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'intern';
}

export interface UpdateCandidateRequest extends Partial<CreateCandidateRequest> {
  id: string;
  status?: OnboardingStatus;
}

export interface CreateTaskRequest {
  candidateId: string;
  title: string;
  description: string;
  category: 'documentation' | 'training' | 'setup' | 'meeting' | 'compliance' | 'other';
  priority: Priority;
  assignedTo: string;
  dueDate: string;
  estimatedHours: number;
  dependencies?: string[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
  status?: TaskStatus;
  completedDate?: string;
  actualHours?: number;
  notes?: string;
}

export interface CreateDocumentRequest {
  candidateId: string;
  name: string;
  description: string;
  category: 'personal' | 'legal' | 'tax' | 'benefits' | 'compliance' | 'other';
  required: boolean;
  expiryDate?: string;
}

export interface UpdateDocumentRequest extends Partial<CreateDocumentRequest> {
  id: string;
  status?: DocumentStatus;
  rejectionReason?: string;
  notes?: string;
}

export interface CreateTrainingRequest {
  candidateId: string;
  title: string;
  description: string;
  category: 'orientation' | 'safety' | 'compliance' | 'technical' | 'soft-skills' | 'other';
  required: boolean;
  priority: Priority;
  duration: number;
  dueDate: string;
  instructorId: string;
  format: 'online' | 'in-person' | 'hybrid' | 'self-paced';
  location?: string;
  passingScore: number;
  maxAttempts: number;
}

export interface UpdateTrainingRequest extends Partial<CreateTrainingRequest> {
  id: string;
  status?: TrainingStatus;
  completionPercentage?: number;
  startDate?: string;
  completedDate?: string;
  assessmentScore?: number;
  attempts?: number;
  notes?: string;
}

// Response Types
export interface OnboardingCandidateResponse {
  success: boolean;
  data: OnboardingCandidate;
  message?: string;
}

export interface OnboardingCandidatesResponse {
  success: boolean;
  data: OnboardingCandidate[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface OnboardingTaskResponse {
  success: boolean;
  data: OnboardingTask;
  message?: string;
}

export interface OnboardingTasksResponse {
  success: boolean;
  data: OnboardingTask[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface OnboardingDocumentResponse {
  success: boolean;
  data: OnboardingDocument;
  message?: string;
}

export interface OnboardingDocumentsResponse {
  success: boolean;
  data: OnboardingDocument[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface OnboardingTrainingResponse {
  success: boolean;
  data: OnboardingTraining;
  message?: string;
}

export interface OnboardingTrainingsResponse {
  success: boolean;
  data: OnboardingTraining[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Filter Types
export interface CandidateFilters {
  status?: OnboardingStatus;
  department?: string;
  manager?: string;
  location?: string;
  startDateFrom?: string;
  startDateTo?: string;
  search?: string;
}

export interface TaskFilters {
  candidateId?: string;
  status?: TaskStatus;
  category?: string;
  assignedTo?: string;
  priority?: Priority;
  dueDateFrom?: string;
  dueDateTo?: string;
  search?: string;
}

export interface DocumentFilters {
  candidateId?: string;
  status?: DocumentStatus;
  category?: string;
  required?: boolean;
  search?: string;
}

export interface TrainingFilters {
  candidateId?: string;
  status?: TrainingStatus;
  category?: string;
  instructor?: string;
  required?: boolean;
  format?: string;
  search?: string;
}

// Statistics Types
export interface OnboardingStats {
  totalCandidates: number;
  activeCandidates: number;
  completedCandidates: number;
  overdueTasks: number;
  pendingDocuments: number;
  completedTrainings: number;
  averageCompletionTime: number; // in days
  completionRate: number; // percentage
}

// Dashboard Types
export interface OnboardingDashboardData {
  stats: OnboardingStats;
  recentCandidates: OnboardingCandidate[];
  upcomingTasks: OnboardingTask[];
  pendingDocuments: OnboardingDocument[];
  overdueTrainings: OnboardingTraining[];
}
