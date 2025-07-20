// Documentation module type definitions

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category?: string;
  tags?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface DocumentGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  color?: string;
  isActive: boolean;
  templateIds: string[];
  documentIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ManualDocument {
  id: string;
  name: string;
  description: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  filePath: string;
  category?: string;
  tags?: string[];
  groupIds: string[];
  isActive: boolean;
  uploadedAt: string;
  uploadedBy: string;
  lastModifiedAt: string;
  lastModifiedBy: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  isActive: boolean;
}

// Form types for creating/editing
export interface CreateDocumentTemplateRequest {
  name: string;
  description: string;
  content: string;
  category?: string;
  tags?: string[];
}

export interface UpdateDocumentTemplateRequest extends Partial<CreateDocumentTemplateRequest> {
  id: string;
}

export interface CreateDocumentGroupRequest {
  name: string;
  description: string;
  category: string;
  color?: string;
  templateIds?: string[];
  documentIds?: string[];
}

export interface UpdateDocumentGroupRequest extends Partial<CreateDocumentGroupRequest> {
  id: string;
}

export interface CreateManualDocumentRequest {
  name: string;
  description: string;
  file: File;
  category?: string;
  tags?: string[];
  groupIds?: string[];
}

export interface UpdateManualDocumentRequest {
  id: string;
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  groupIds?: string[];
}

// API Response types
export interface DocumentTemplateResponse {
  success: boolean;
  data: DocumentTemplate;
  message?: string;
}

export interface DocumentTemplatesResponse {
  success: boolean;
  data: DocumentTemplate[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface DocumentGroupResponse {
  success: boolean;
  data: DocumentGroup;
  message?: string;
}

export interface DocumentGroupsResponse {
  success: boolean;
  data: DocumentGroup[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface ManualDocumentResponse {
  success: boolean;
  data: ManualDocument;
  message?: string;
}

export interface ManualDocumentsResponse {
  success: boolean;
  data: ManualDocument[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

export interface DocumentCategoriesResponse {
  success: boolean;
  data: DocumentCategory[];
  message?: string;
}

// Filter and search types
export interface DocumentTemplateFilters {
  category?: string;
  tags?: string[];
  isActive?: boolean;
  createdBy?: string;
  search?: string;
}

export interface DocumentGroupFilters {
  category?: string;
  isActive?: boolean;
  createdBy?: string;
  search?: string;
}

export interface ManualDocumentFilters {
  category?: string;
  tags?: string[];
  fileType?: string;
  groupIds?: string[];
  isActive?: boolean;
  uploadedBy?: string;
  search?: string;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// File upload types
export interface FileUploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface FileUploadResponse {
  success: boolean;
  data: {
    fileName: string;
    filePath: string;
    fileSize: number;
    fileType: string;
  };
  message?: string;
}

// Rich text editor types
export interface RichTextContent {
  html: string;
  text: string;
  json?: any; // For storing editor state
}

// Component prop types
export interface DocumentTemplateFormProps {
  template?: DocumentTemplate;
  onSubmit: (data: CreateDocumentTemplateRequest | UpdateDocumentTemplateRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export interface DocumentGroupFormProps {
  group?: DocumentGroup;
  onSubmit: (data: CreateDocumentGroupRequest | UpdateDocumentGroupRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  availableTemplates?: DocumentTemplate[];
  availableDocuments?: ManualDocument[];
}

export interface ManualDocumentFormProps {
  document?: ManualDocument;
  onSubmit: (data: CreateManualDocumentRequest | UpdateManualDocumentRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
  availableGroups?: DocumentGroup[];
}

// Table column types
export interface DocumentTemplateTableColumn {
  key: keyof DocumentTemplate | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface DocumentGroupTableColumn {
  key: keyof DocumentGroup | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
}

export interface ManualDocumentTableColumn {
  key: keyof ManualDocument | 'actions';
  label: string;
  sortable?: boolean;
  width?: string;
}

// Error types
export interface DocumentationError {
  code: string;
  message: string;
  field?: string;
}

export interface DocumentationApiError {
  success: false;
  error: DocumentationError;
  message: string;
}

// Email types
export interface EmailRecipient {
  id: string;
  name: string;
  email: string;
  role?: string;
  department?: string;
}

export interface EmailAttachment {
  id: string;
  name: string;
  type: 'template' | 'document';
  fileName: string;
  fileSize?: number;
  content?: string; // For templates
  filePath?: string; // For documents
}

export interface GroupEmailData {
  groupId: string;
  groupName: string;
  groupDescription: string;
  groupCategory: string;
  templates: DocumentTemplate[];
  documents: ManualDocument[];
  recipients: EmailRecipient[];
  subject: string;
  message: string;
  attachments: EmailAttachment[];
}

export interface SendEmailRequest {
  groupId: string;
  recipients: string[]; // Email addresses
  subject: string;
  message: string;
  includeTemplates: boolean;
  includeDocuments: boolean;
  attachmentIds: string[];
}

export interface SendEmailResponse {
  success: boolean;
  message: string;
  emailId?: string;
  sentAt?: string;
}

export interface EmailTemplate {
  subject: string;
  message: string;
}

// Email service types
export interface EmailService {
  sendGroupEmail(data: SendEmailRequest): Promise<SendEmailResponse>;
  getEmailRecipients(): Promise<EmailRecipient[]>;
  generateEmailContent(groupId: string): Promise<GroupEmailData>;
}
