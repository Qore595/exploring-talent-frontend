// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string; // HTML content
  category: EmailTemplateCategory;
  tags: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  lastUsed?: string;
}

export interface CreateEmailTemplateRequest {
  name: string;
  subject: string;
  content: string;
  category: EmailTemplateCategory;
  tags: string[];
  isActive?: boolean;
}

export interface UpdateEmailTemplateRequest extends Partial<CreateEmailTemplateRequest> {
  id: string;
}

export type EmailTemplateCategory = 
  | 'interview_invitation'
  | 'job_offer'
  | 'rejection'
  | 'follow_up'
  | 'welcome'
  | 'reminder'
  | 'general'
  | 'custom';

// Email Management Types
export interface EmailMessage {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  content: string;
  htmlContent?: string;
  templateId?: string;
  templateName?: string;
  status: EmailStatus;
  sentAt?: string;
  receivedAt?: string;
  readAt?: string;
  attachments: EmailAttachment[];
  metadata?: EmailMetadata;
}

export interface EmailAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface EmailMetadata {
  candidateId?: string;
  jobId?: string;
  interviewId?: string;
  source?: string;
  tags?: string[];
}

export type EmailStatus = 
  | 'draft'
  | 'sent'
  | 'delivered'
  | 'read'
  | 'failed'
  | 'bounced';

// Email Template Usage Tracking
export interface EmailTemplateUsage {
  id: string;
  templateId: string;
  templateName: string;
  usedBy: string;
  usedAt: string;
  recipientEmail: string;
  subject: string;
  status: EmailStatus;
  candidateId?: string;
  jobId?: string;
}

// API Response Types
export interface EmailTemplateResponse {
  success: boolean;
  data: EmailTemplate;
  message?: string;
}

export interface EmailTemplatesResponse {
  success: boolean;
  data: EmailTemplate[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface EmailMessagesResponse {
  success: boolean;
  data: EmailMessage[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface EmailTemplateUsageResponse {
  success: boolean;
  data: EmailTemplateUsage[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

// Filter and Search Types
export interface EmailTemplateFilters {
  category?: EmailTemplateCategory;
  isActive?: boolean;
  tags?: string[];
  search?: string;
  createdBy?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface EmailMessageFilters {
  status?: EmailStatus;
  from?: string;
  to?: string;
  templateId?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

// Form Types
export interface EmailTemplateFormData {
  name: string;
  subject: string;
  content: string;
  category: EmailTemplateCategory;
  tags: string[];
  isActive: boolean;
}

// Constants
export const EMAIL_TEMPLATE_CATEGORIES: { value: EmailTemplateCategory; label: string }[] = [
  { value: 'interview_invitation', label: 'Interview Invitation' },
  { value: 'job_offer', label: 'Job Offer' },
  { value: 'rejection', label: 'Rejection' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'welcome', label: 'Welcome' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'general', label: 'General' },
  { value: 'custom', label: 'Custom' },
];

export const EMAIL_STATUS_LABELS: Record<EmailStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  failed: 'Failed',
  bounced: 'Bounced',
};

export const EMAIL_STATUS_COLORS: Record<EmailStatus, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  read: 'bg-purple-100 text-purple-800',
  failed: 'bg-red-100 text-red-800',
  bounced: 'bg-orange-100 text-orange-800',
};
