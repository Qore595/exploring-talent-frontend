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

import {
  getMockTemplates,
  getMockGroups,
  getMockDocuments,
  getMockCategories,
  setMockTemplates,
  setMockGroups,
  setMockDocuments,
  generateId,
  delay,
  findTemplateById,
  findGroupById,
  findDocumentById
} from './mockDocumentationData';

class MockDocumentationService {
  // Document Templates
  async getDocumentTemplates(
    filters?: DocumentTemplateFilters,
    pagination?: PaginationParams
  ): Promise<DocumentTemplatesResponse> {
    await delay(500); // Simulate network delay
    
    let templates = getMockTemplates();
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        templates = templates.filter(t => t.category === filters.category);
      }
      if (filters.isActive !== undefined) {
        templates = templates.filter(t => t.isActive === filters.isActive);
      }
      if (filters.createdBy) {
        templates = templates.filter(t => t.createdBy.toLowerCase().includes(filters.createdBy!.toLowerCase()));
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        templates = templates.filter(t => 
          t.name.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower) ||
          t.content.toLowerCase().includes(searchLower)
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        templates = templates.filter(t => 
          t.tags && t.tags.some(tag => filters.tags!.includes(tag))
        );
      }
    }
    
    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTemplates = templates.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedTemplates,
      total: templates.length,
      page,
      limit
    };
  }

  async getDocumentTemplateById(id: string): Promise<DocumentTemplateResponse> {
    await delay(300);
    
    const template = findTemplateById(id);
    if (!template) {
      throw new Error('Template not found');
    }
    
    return {
      success: true,
      data: template
    };
  }

  async createDocumentTemplate(data: CreateDocumentTemplateRequest): Promise<DocumentTemplateResponse> {
    await delay(800);
    
    const newTemplate: DocumentTemplate = {
      id: generateId('template'),
      name: data.name,
      description: data.description,
      content: data.content,
      category: data.category,
      tags: data.tags || [],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User', // In real app, get from auth context
      lastModifiedBy: 'Current User'
    };
    
    const templates = getMockTemplates();
    templates.push(newTemplate);
    setMockTemplates(templates);
    
    return {
      success: true,
      data: newTemplate
    };
  }

  async updateDocumentTemplate(data: UpdateDocumentTemplateRequest): Promise<DocumentTemplateResponse> {
    await delay(600);
    
    const templates = getMockTemplates();
    const index = templates.findIndex(t => t.id === data.id);
    
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    const updatedTemplate: DocumentTemplate = {
      ...templates[index],
      name: data.name || templates[index].name,
      description: data.description || templates[index].description,
      content: data.content || templates[index].content,
      category: data.category || templates[index].category,
      tags: data.tags || templates[index].tags,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User'
    };
    
    templates[index] = updatedTemplate;
    setMockTemplates(templates);
    
    return {
      success: true,
      data: updatedTemplate
    };
  }

  async deleteDocumentTemplate(id: string): Promise<{ success: boolean; message?: string }> {
    await delay(400);
    
    const templates = getMockTemplates();
    const index = templates.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    templates.splice(index, 1);
    setMockTemplates(templates);
    
    return {
      success: true,
      message: 'Template deleted successfully'
    };
  }

  // Document Groups
  async getDocumentGroups(
    filters?: DocumentGroupFilters,
    pagination?: PaginationParams
  ): Promise<DocumentGroupsResponse> {
    await delay(500);
    
    let groups = getMockGroups();
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        groups = groups.filter(g => g.category === filters.category);
      }
      if (filters.isActive !== undefined) {
        groups = groups.filter(g => g.isActive === filters.isActive);
      }
      if (filters.createdBy) {
        groups = groups.filter(g => g.createdBy.toLowerCase().includes(filters.createdBy!.toLowerCase()));
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        groups = groups.filter(g => 
          g.name.toLowerCase().includes(searchLower) ||
          g.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGroups = groups.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedGroups,
      total: groups.length,
      page,
      limit
    };
  }

  async getDocumentGroupById(id: string): Promise<DocumentGroupResponse> {
    await delay(300);
    
    const group = findGroupById(id);
    if (!group) {
      throw new Error('Group not found');
    }
    
    return {
      success: true,
      data: group
    };
  }

  async createDocumentGroup(data: CreateDocumentGroupRequest): Promise<DocumentGroupResponse> {
    await delay(800);
    
    const newGroup: DocumentGroup = {
      id: generateId('group'),
      name: data.name,
      description: data.description,
      category: data.category,
      color: data.color || 'blue',
      isActive: true,
      templateIds: data.templateIds || [],
      documentIds: data.documentIds || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      lastModifiedBy: 'Current User'
    };
    
    const groups = getMockGroups();
    groups.push(newGroup);
    setMockGroups(groups);
    
    return {
      success: true,
      data: newGroup
    };
  }

  async updateDocumentGroup(data: UpdateDocumentGroupRequest): Promise<DocumentGroupResponse> {
    await delay(600);
    
    const groups = getMockGroups();
    const index = groups.findIndex(g => g.id === data.id);
    
    if (index === -1) {
      throw new Error('Group not found');
    }
    
    const updatedGroup: DocumentGroup = {
      ...groups[index],
      name: data.name || groups[index].name,
      description: data.description || groups[index].description,
      category: data.category || groups[index].category,
      color: data.color || groups[index].color,
      templateIds: data.templateIds || groups[index].templateIds,
      documentIds: data.documentIds || groups[index].documentIds,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User'
    };
    
    groups[index] = updatedGroup;
    setMockGroups(groups);
    
    return {
      success: true,
      data: updatedGroup
    };
  }

  async deleteDocumentGroup(id: string): Promise<{ success: boolean; message?: string }> {
    await delay(400);
    
    const groups = getMockGroups();
    const index = groups.findIndex(g => g.id === id);
    
    if (index === -1) {
      throw new Error('Group not found');
    }
    
    groups.splice(index, 1);
    setMockGroups(groups);
    
    return {
      success: true,
      message: 'Group deleted successfully'
    };
  }

  // Manual Documents
  async getManualDocuments(
    filters?: ManualDocumentFilters,
    pagination?: PaginationParams
  ): Promise<ManualDocumentsResponse> {
    await delay(500);
    
    let documents = getMockDocuments();
    
    // Apply filters
    if (filters) {
      if (filters.category) {
        documents = documents.filter(d => d.category === filters.category);
      }
      if (filters.fileType) {
        documents = documents.filter(d => d.fileType === filters.fileType);
      }
      if (filters.isActive !== undefined) {
        documents = documents.filter(d => d.isActive === filters.isActive);
      }
      if (filters.uploadedBy) {
        documents = documents.filter(d => d.uploadedBy.toLowerCase().includes(filters.uploadedBy!.toLowerCase()));
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        documents = documents.filter(d => 
          d.name.toLowerCase().includes(searchLower) ||
          d.description.toLowerCase().includes(searchLower) ||
          d.fileName.toLowerCase().includes(searchLower)
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        documents = documents.filter(d => 
          d.tags && d.tags.some(tag => filters.tags!.includes(tag))
        );
      }
      if (filters.groupIds && filters.groupIds.length > 0) {
        documents = documents.filter(d => 
          d.groupIds.some(groupId => filters.groupIds!.includes(groupId))
        );
      }
    }
    
    // Apply pagination
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocuments = documents.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: paginatedDocuments,
      total: documents.length,
      page,
      limit
    };
  }

  async getManualDocumentById(id: string): Promise<ManualDocumentResponse> {
    await delay(300);
    
    const document = findDocumentById(id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    return {
      success: true,
      data: document
    };
  }

  async uploadManualDocument(data: CreateManualDocumentRequest): Promise<ManualDocumentResponse> {
    await delay(1200); // Longer delay to simulate file upload
    
    const newDocument: ManualDocument = {
      id: generateId('doc'),
      name: data.name,
      description: data.description,
      fileName: data.file.name,
      fileSize: data.file.size,
      fileType: data.file.type,
      filePath: `/documents/${data.file.name}`,
      category: data.category,
      tags: data.tags || [],
      groupIds: data.groupIds || [],
      isActive: true,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'Current User',
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User'
    };
    
    const documents = getMockDocuments();
    documents.push(newDocument);
    setMockDocuments(documents);
    
    return {
      success: true,
      data: newDocument
    };
  }

  async updateManualDocument(data: UpdateManualDocumentRequest): Promise<ManualDocumentResponse> {
    await delay(600);
    
    const documents = getMockDocuments();
    const index = documents.findIndex(d => d.id === data.id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    const updatedDocument: ManualDocument = {
      ...documents[index],
      name: data.name || documents[index].name,
      description: data.description || documents[index].description,
      category: data.category || documents[index].category,
      tags: data.tags || documents[index].tags,
      groupIds: data.groupIds || documents[index].groupIds,
      lastModifiedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User'
    };
    
    documents[index] = updatedDocument;
    setMockDocuments(documents);
    
    return {
      success: true,
      data: updatedDocument
    };
  }

  async deleteManualDocument(id: string): Promise<{ success: boolean; message?: string }> {
    await delay(400);
    
    const documents = getMockDocuments();
    const index = documents.findIndex(d => d.id === id);
    
    if (index === -1) {
      throw new Error('Document not found');
    }
    
    documents.splice(index, 1);
    setMockDocuments(documents);
    
    return {
      success: true,
      message: 'Document deleted successfully'
    };
  }

  async downloadDocument(id: string): Promise<Blob> {
    await delay(800);
    
    const document = findDocumentById(id);
    if (!document) {
      throw new Error('Document not found');
    }
    
    // Create a mock blob for download
    const content = `Mock content for ${document.fileName}`;
    return new Blob([content], { type: document.fileType });
  }

  // Categories
  async getDocumentCategories(): Promise<DocumentCategoriesResponse> {
    await delay(200);
    
    return {
      success: true,
      data: getMockCategories()
    };
  }

  // File Upload Utility
  async uploadFile(file: File, onProgress?: (progress: number) => void): Promise<FileUploadResponse> {
    // Simulate upload progress
    if (onProgress) {
      for (let i = 0; i <= 100; i += 10) {
        await delay(100);
        onProgress(i);
      }
    } else {
      await delay(1000);
    }
    
    return {
      success: true,
      data: {
        fileName: file.name,
        filePath: `/uploads/${file.name}`,
        fileSize: file.size,
        fileType: file.type
      }
    };
  }
}

export const mockDocumentationService = new MockDocumentationService();
export default mockDocumentationService;
