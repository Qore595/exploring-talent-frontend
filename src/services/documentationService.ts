// Import mock service instead of API client for development
import mockDocumentationService from './mockDocumentationService';
import {
  DocumentTemplate,
  DocumentGroup,
  ManualDocument,
  DocumentCategory,
  CreateDocumentTemplateRequest,
  UpdateDocumentTemplateRequest,
  CreateDocumentGroupRequest,
  UpdateDocumentGroupRequest,
  CreateManualDocumentRequest,
  UpdateManualDocumentRequest,
  DocumentTemplateResponse,
  DocumentTemplatesResponse,
  DocumentGroupResponse,
  DocumentGroupsResponse,
  ManualDocumentResponse,
  ManualDocumentsResponse,
  DocumentCategoriesResponse,
  DocumentTemplateFilters,
  DocumentGroupFilters,
  ManualDocumentFilters,
  PaginationParams,
  FileUploadResponse,
} from '@/types/documentation';

class DocumentationService {
  // Document Templates
  async getDocumentTemplates(
    filters?: DocumentTemplateFilters,
    pagination?: PaginationParams
  ): Promise<DocumentTemplatesResponse> {
    return mockDocumentationService.getDocumentTemplates(filters, pagination);
  }

  async getDocumentTemplateById(id: string): Promise<DocumentTemplateResponse> {
    return mockDocumentationService.getDocumentTemplateById(id);
  }

  async createDocumentTemplate(data: CreateDocumentTemplateRequest): Promise<DocumentTemplateResponse> {
    return mockDocumentationService.createDocumentTemplate(data);
  }

  async updateDocumentTemplate(data: UpdateDocumentTemplateRequest): Promise<DocumentTemplateResponse> {
    return mockDocumentationService.updateDocumentTemplate(data);
  }

  async deleteDocumentTemplate(id: string): Promise<{ success: boolean; message?: string }> {
    return mockDocumentationService.deleteDocumentTemplate(id);
  }

  // Document Groups
  async getDocumentGroups(
    filters?: DocumentGroupFilters,
    pagination?: PaginationParams
  ): Promise<DocumentGroupsResponse> {
    return mockDocumentationService.getDocumentGroups(filters, pagination);
  }

  async getDocumentGroupById(id: string): Promise<DocumentGroupResponse> {
    return mockDocumentationService.getDocumentGroupById(id);
  }

  async createDocumentGroup(data: CreateDocumentGroupRequest): Promise<DocumentGroupResponse> {
    return mockDocumentationService.createDocumentGroup(data);
  }

  async updateDocumentGroup(data: UpdateDocumentGroupRequest): Promise<DocumentGroupResponse> {
    return mockDocumentationService.updateDocumentGroup(data);
  }

  async deleteDocumentGroup(id: string): Promise<{ success: boolean; message?: string }> {
    return mockDocumentationService.deleteDocumentGroup(id);
  }

  // Manual Documents
  async getManualDocuments(
    filters?: ManualDocumentFilters,
    pagination?: PaginationParams
  ): Promise<ManualDocumentsResponse> {
    return mockDocumentationService.getManualDocuments(filters, pagination);
  }

  async getManualDocumentById(id: string): Promise<ManualDocumentResponse> {
    return mockDocumentationService.getManualDocumentById(id);
  }

  async uploadManualDocument(data: CreateManualDocumentRequest): Promise<ManualDocumentResponse> {
    return mockDocumentationService.uploadManualDocument(data);
  }

  async updateManualDocument(data: UpdateManualDocumentRequest): Promise<ManualDocumentResponse> {
    return mockDocumentationService.updateManualDocument(data);
  }

  async deleteManualDocument(id: string): Promise<{ success: boolean; message?: string }> {
    return mockDocumentationService.deleteManualDocument(id);
  }

  async downloadDocument(id: string): Promise<Blob> {
    return mockDocumentationService.downloadDocument(id);
  }

  // Categories
  async getDocumentCategories(): Promise<DocumentCategoriesResponse> {
    return mockDocumentationService.getDocumentCategories();
  }

  // File Upload Utility
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<FileUploadResponse> {
    return mockDocumentationService.uploadFile(file, onProgress);
  }
}

export const documentationService = new DocumentationService();
export default documentationService;
