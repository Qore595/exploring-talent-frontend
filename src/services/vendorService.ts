// Vendor Hub Service
import { 
  Vendor, 
  VendorWithPocs, 
  PointOfContact, 
  ValidationReminder, 
  CommunicationLog,
  VendorHealthSummary,
  PocTransitionTracker,
  EscalationRisk,
  VendorFormData,
  PocFormData,
  VendorFilters,
  PocFilters,
  PaginatedResponse,
  EmailTemplate,
  ConsentRecord
} from '@/types/vendor';

// Base API configuration
const API_BASE_URL = '/api/vendor-hub';

// Utility function for API calls
const apiCall = async <T>(endpoint: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Vendor Service
export const vendorService = {
  // Vendor CRUD operations
  async getVendors(filters?: VendorFilters, pagination?: { page: number; limit: number }): Promise<PaginatedResponse<VendorWithPocs>> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.vendorType?.length) params.append('vendorType', filters.vendorType.join(','));
    if (filters?.status?.length) params.append('status', filters.status.join(','));
    if (filters?.tierLevel?.length) params.append('tierLevel', filters.tierLevel.join(','));
    if (filters?.hasOutdatedPocs !== undefined) params.append('hasOutdatedPocs', filters.hasOutdatedPocs.toString());
    
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
    }

    return apiCall<PaginatedResponse<VendorWithPocs>>(`/vendors?${params.toString()}`);
  },

  async getVendorById(vendorId: string): Promise<VendorWithPocs> {
    return apiCall<VendorWithPocs>(`/vendors/${vendorId}`);
  },

  async createVendor(vendorData: VendorFormData): Promise<Vendor> {
    return apiCall<Vendor>('/vendors', {
      method: 'POST',
      body: JSON.stringify(vendorData),
    });
  },

  async updateVendor(vendorId: string, vendorData: Partial<VendorFormData>): Promise<Vendor> {
    return apiCall<Vendor>(`/vendors/${vendorId}`, {
      method: 'PUT',
      body: JSON.stringify(vendorData),
    });
  },

  async deleteVendor(vendorId: string): Promise<void> {
    return apiCall<void>(`/vendors/${vendorId}`, {
      method: 'DELETE',
    });
  },

  // PoC CRUD operations
  async getPocs(filters?: PocFilters, pagination?: { page: number; limit: number }): Promise<PaginatedResponse<PointOfContact & { vendorName: string }>> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.role?.length) params.append('role', filters.role.join(','));
    if (filters?.status?.length) params.append('status', filters.status.join(','));
    if (filters?.validationStatus?.length) params.append('validationStatus', filters.validationStatus.join(','));
    if (filters?.isPrimary !== undefined) params.append('isPrimary', filters.isPrimary.toString());
    if (filters?.isBackup !== undefined) params.append('isBackup', filters.isBackup.toString());
    
    if (pagination) {
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
    }

    return apiCall<PaginatedResponse<PointOfContact & { vendorName: string }>>(`/pocs?${params.toString()}`);
  },

  async getPocById(pocId: string): Promise<PointOfContact> {
    return apiCall<PointOfContact>(`/pocs/${pocId}`);
  },

  async createPoc(vendorId: string, pocData: PocFormData): Promise<PointOfContact> {
    return apiCall<PointOfContact>(`/vendors/${vendorId}/pocs`, {
      method: 'POST',
      body: JSON.stringify(pocData),
    });
  },

  async updatePoc(pocId: string, pocData: Partial<PocFormData>): Promise<PointOfContact> {
    return apiCall<PointOfContact>(`/pocs/${pocId}`, {
      method: 'PUT',
      body: JSON.stringify(pocData),
    });
  },

  async deletePoc(pocId: string): Promise<void> {
    return apiCall<void>(`/pocs/${pocId}`, {
      method: 'DELETE',
    });
  },

  // Dashboard and Analytics
  async getDashboardData(): Promise<{
    vendorHealthSummary: VendorHealthSummary;
    pocTransitionTracker: PocTransitionTracker;
    escalationRisk: EscalationRisk;
  }> {
    return apiCall('/dashboard');
  },

  async getVendorHealthSummary(): Promise<VendorHealthSummary> {
    return apiCall('/dashboard/vendor-health');
  },

  async getPocTransitionTracker(): Promise<PocTransitionTracker> {
    return apiCall('/dashboard/poc-transitions');
  },

  async getEscalationRisk(): Promise<EscalationRisk> {
    return apiCall('/dashboard/escalation-risk');
  },

  // Validation and Communication
  async getValidationReminders(): Promise<ValidationReminder[]> {
    return apiCall('/validation-reminders');
  },

  async createValidationReminder(reminderData: Partial<ValidationReminder>): Promise<ValidationReminder> {
    return apiCall('/validation-reminders', {
      method: 'POST',
      body: JSON.stringify(reminderData),
    });
  },

  async sendValidationReminder(reminderId: string): Promise<void> {
    return apiCall(`/validation-reminders/${reminderId}/send`, {
      method: 'POST',
    });
  },

  async sendBulkValidationReminders(reminderIds: string[]): Promise<void> {
    return apiCall('/validation-reminders/bulk-send', {
      method: 'POST',
      body: JSON.stringify({ reminderIds }),
    });
  },

  async getCommunicationLogs(vendorId?: string, pocId?: string): Promise<CommunicationLog[]> {
    const params = new URLSearchParams();
    if (vendorId) params.append('vendorId', vendorId);
    if (pocId) params.append('pocId', pocId);
    
    return apiCall(`/communications?${params.toString()}`);
  },

  async logCommunication(communicationData: Partial<CommunicationLog>): Promise<CommunicationLog> {
    return apiCall('/communications', {
      method: 'POST',
      body: JSON.stringify(communicationData),
    });
  },

  // Email Templates
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return apiCall('/email-templates');
  },

  async getEmailTemplateById(templateId: string): Promise<EmailTemplate> {
    return apiCall(`/email-templates/${templateId}`);
  },

  async createEmailTemplate(templateData: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return apiCall('/email-templates', {
      method: 'POST',
      body: JSON.stringify(templateData),
    });
  },

  async updateEmailTemplate(templateId: string, templateData: Partial<EmailTemplate>): Promise<EmailTemplate> {
    return apiCall(`/email-templates/${templateId}`, {
      method: 'PUT',
      body: JSON.stringify(templateData),
    });
  },

  // Automation Settings
  async getAutomationSettings(): Promise<{
    validationReminderEnabled: boolean;
    validationIntervalMonths: number;
    reminderDaysBeforeExpiry: number;
    maxReminderAttempts: number;
    escalationEnabled: boolean;
  }> {
    return apiCall('/automation/settings');
  },

  async updateAutomationSettings(settings: {
    validationReminderEnabled?: boolean;
    validationIntervalMonths?: number;
    reminderDaysBeforeExpiry?: number;
    maxReminderAttempts?: number;
    escalationEnabled?: boolean;
  }): Promise<void> {
    return apiCall('/automation/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // PoC Validation
  async validatePoc(pocId: string, validationData: {
    isValid: boolean;
    notes?: string;
    validatedBy: string;
  }): Promise<PointOfContact> {
    return apiCall(`/pocs/${pocId}/validate`, {
      method: 'POST',
      body: JSON.stringify(validationData),
    });
  },

  async markPocAsValidated(pocId: string): Promise<PointOfContact> {
    return apiCall(`/pocs/${pocId}/mark-validated`, {
      method: 'POST',
    });
  },

  // Consent and Signatures
  async recordConsent(consentData: Partial<ConsentRecord>): Promise<ConsentRecord> {
    return apiCall('/consent', {
      method: 'POST',
      body: JSON.stringify(consentData),
    });
  },

  async getConsentRecords(vendorId?: string, pocId?: string): Promise<ConsentRecord[]> {
    const params = new URLSearchParams();
    if (vendorId) params.append('vendorId', vendorId);
    if (pocId) params.append('pocId', pocId);
    
    return apiCall(`/consent?${params.toString()}`);
  },

  // Bulk Operations
  async bulkUpdateVendors(vendorIds: string[], updateData: Partial<VendorFormData>): Promise<void> {
    return apiCall('/vendors/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ vendorIds, updateData }),
    });
  },

  async bulkUpdatePocs(pocIds: string[], updateData: Partial<PocFormData>): Promise<void> {
    return apiCall('/pocs/bulk-update', {
      method: 'POST',
      body: JSON.stringify({ pocIds, updateData }),
    });
  },

  // Export/Import
  async exportVendors(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/vendors/export?format=${format}`);
    return response.blob();
  },

  async exportPocs(format: 'csv' | 'xlsx' = 'csv'): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/pocs/export?format=${format}`);
    return response.blob();
  },

  async importVendors(file: File): Promise<{ success: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/vendors/import`, {
      method: 'POST',
      body: formData,
    });
    
    return response.json();
  },

  // Workflow Integration
  async getActivePocsForAssignment(vendorId?: string): Promise<PointOfContact[]> {
    const params = vendorId ? `?vendorId=${vendorId}` : '';
    return apiCall(`/pocs/active-for-assignment${params}`);
  },

  async getApprovalRoutes(documentType: string, vendorId: string): Promise<{
    primaryApprover: PointOfContact;
    backupApprover?: PointOfContact;
    escalationChain: PointOfContact[];
  }> {
    return apiCall(`/approval-routes?documentType=${documentType}&vendorId=${vendorId}`);
  },

  // Notifications
  async triggerExitWorkflow(pocId: string, exitData: {
    exitDate: Date;
    reason: string;
    replacementPocId?: string;
  }): Promise<void> {
    return apiCall(`/pocs/${pocId}/exit-workflow`, {
      method: 'POST',
      body: JSON.stringify(exitData),
    });
  }
};
