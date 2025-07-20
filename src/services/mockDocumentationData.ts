import { 
  DocumentTemplate, 
  DocumentGroup, 
  ManualDocument, 
  DocumentCategory 
} from '@/types/documentation';

// Mock data storage
let mockTemplates: DocumentTemplate[] = [
  {
    id: 'template-1',
    name: 'Employee Onboarding Checklist',
    description: 'Comprehensive checklist for new employee onboarding process',
    content: '<h2>Employee Onboarding Checklist</h2><p>Welcome to our organization! This checklist will guide you through the onboarding process.</p><h3>Day 1:</h3><ul><li>Complete HR paperwork</li><li>Receive company handbook</li><li>Set up workstation</li><li>Meet your team</li></ul><h3>Week 1:</h3><ul><li>Complete mandatory training</li><li>Review job responsibilities</li><li>Schedule regular check-ins</li></ul>',
    category: 'HR Documents',
    tags: ['onboarding', 'checklist', 'new-hire'],
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'John Smith',
    lastModifiedBy: 'Jane Doe'
  },
  {
    id: 'template-2',
    name: 'Project Proposal Template',
    description: 'Standard template for project proposals and planning documents',
    content: '<h1>Project Proposal</h1><h2>Executive Summary</h2><p>Brief overview of the project...</p><h2>Project Objectives</h2><ul><li>Objective 1</li><li>Objective 2</li><li>Objective 3</li></ul><h2>Timeline</h2><p>Project timeline and milestones...</p><h2>Budget</h2><p>Estimated project costs...</p>',
    category: 'Project Documents',
    tags: ['project', 'proposal', 'planning'],
    isActive: true,
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    createdBy: 'Mike Johnson',
    lastModifiedBy: 'Sarah Wilson'
  },
  {
    id: 'template-3',
    name: 'Meeting Minutes Template',
    description: 'Standard format for recording meeting minutes and action items',
    content: '<h2>Meeting Minutes</h2><p><strong>Date:</strong> [Date]</p><p><strong>Attendees:</strong> [List of attendees]</p><h3>Agenda Items</h3><ol><li>Item 1</li><li>Item 2</li><li>Item 3</li></ol><h3>Action Items</h3><ul><li>Action 1 - Assigned to: [Name] - Due: [Date]</li><li>Action 2 - Assigned to: [Name] - Due: [Date]</li></ul>',
    category: 'Administrative',
    tags: ['meeting', 'minutes', 'action-items'],
    isActive: true,
    createdAt: '2024-01-08T11:20:00Z',
    updatedAt: '2024-01-22T13:10:00Z',
    createdBy: 'Emily Davis',
    lastModifiedBy: 'Emily Davis'
  },
  {
    id: 'template-4',
    name: 'Performance Review Template',
    description: 'Annual performance review template for employee evaluations',
    content: '<h1>Annual Performance Review</h1><h2>Employee Information</h2><p><strong>Name:</strong> [Employee Name]</p><p><strong>Position:</strong> [Job Title]</p><p><strong>Review Period:</strong> [Date Range]</p><h2>Performance Goals</h2><p>Review of goals set in previous period...</p><h2>Achievements</h2><p>Key accomplishments during review period...</p><h2>Areas for Improvement</h2><p>Development opportunities...</p><h2>Goals for Next Period</h2><p>Objectives for upcoming year...</p>',
    category: 'HR Documents',
    tags: ['performance', 'review', 'evaluation'],
    isActive: true,
    createdAt: '2024-01-05T08:30:00Z',
    updatedAt: '2024-01-18T15:20:00Z',
    createdBy: 'Robert Brown',
    lastModifiedBy: 'Lisa Anderson'
  }
];

let mockGroups: DocumentGroup[] = [
  {
    id: 'group-1',
    name: 'HR Onboarding Package',
    description: 'Complete set of documents and templates for new employee onboarding',
    category: 'HR Documents',
    color: 'blue',
    isActive: true,
    templateIds: ['template-1', 'template-4'],
    documentIds: ['doc-1', 'doc-2'],
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-25T14:30:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Manager'
  },
  {
    id: 'group-2',
    name: 'Project Management Toolkit',
    description: 'Essential documents and templates for project management',
    category: 'Project Documents',
    color: 'green',
    isActive: true,
    templateIds: ['template-2', 'template-3'],
    documentIds: ['doc-3'],
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-28T11:45:00Z',
    createdBy: 'Project Manager',
    lastModifiedBy: 'Project Manager'
  },
  {
    id: 'group-3',
    name: 'Legal Compliance Documents',
    description: 'Important legal and compliance documentation',
    category: 'Legal Documents',
    color: 'red',
    isActive: true,
    templateIds: [],
    documentIds: ['doc-4', 'doc-5'],
    createdAt: '2024-01-15T14:20:00Z',
    updatedAt: '2024-01-30T16:10:00Z',
    createdBy: 'Legal Team',
    lastModifiedBy: 'Legal Team'
  }
];

let mockDocuments: ManualDocument[] = [
  {
    id: 'doc-1',
    name: 'Company Handbook 2024',
    description: 'Updated company policies and procedures handbook',
    fileName: 'company-handbook-2024.pdf',
    fileSize: 2048576, // 2MB
    fileType: 'application/pdf',
    filePath: '/documents/company-handbook-2024.pdf',
    category: 'HR Documents',
    tags: ['handbook', 'policies', '2024'],
    groupIds: ['group-1'],
    isActive: true,
    uploadedAt: '2024-01-22T10:30:00Z',
    uploadedBy: 'HR Manager',
    lastModifiedAt: '2024-01-22T10:30:00Z',
    lastModifiedBy: 'HR Manager'
  },
  {
    id: 'doc-2',
    name: 'Benefits Overview',
    description: 'Comprehensive overview of employee benefits package',
    fileName: 'benefits-overview.docx',
    fileSize: 1024000, // 1MB
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    filePath: '/documents/benefits-overview.docx',
    category: 'HR Documents',
    tags: ['benefits', 'insurance', 'retirement'],
    groupIds: ['group-1'],
    isActive: true,
    uploadedAt: '2024-01-20T14:15:00Z',
    uploadedBy: 'Benefits Coordinator',
    lastModifiedAt: '2024-01-25T09:20:00Z',
    lastModifiedBy: 'Benefits Coordinator'
  },
  {
    id: 'doc-3',
    name: 'Project Charter Template',
    description: 'Standard project charter document template',
    fileName: 'project-charter-template.doc',
    fileSize: 512000, // 512KB
    fileType: 'application/msword',
    filePath: '/documents/project-charter-template.doc',
    category: 'Project Documents',
    tags: ['project', 'charter', 'template'],
    groupIds: ['group-2'],
    isActive: true,
    uploadedAt: '2024-01-19T11:45:00Z',
    uploadedBy: 'Project Manager',
    lastModifiedAt: '2024-01-24T13:30:00Z',
    lastModifiedBy: 'Senior Project Manager'
  },
  {
    id: 'doc-4',
    name: 'Data Privacy Policy',
    description: 'Company data privacy and protection policy document',
    fileName: 'data-privacy-policy.pdf',
    fileSize: 768000, // 768KB
    fileType: 'application/pdf',
    filePath: '/documents/data-privacy-policy.pdf',
    category: 'Legal Documents',
    tags: ['privacy', 'data', 'policy', 'gdpr'],
    groupIds: ['group-3'],
    isActive: true,
    uploadedAt: '2024-01-17T16:20:00Z',
    uploadedBy: 'Legal Counsel',
    lastModifiedAt: '2024-01-29T10:15:00Z',
    lastModifiedBy: 'Legal Counsel'
  },
  {
    id: 'doc-5',
    name: 'Code of Conduct',
    description: 'Employee code of conduct and ethics guidelines',
    fileName: 'code-of-conduct.txt',
    fileSize: 25600, // 25KB
    fileType: 'text/plain',
    filePath: '/documents/code-of-conduct.txt',
    category: 'Legal Documents',
    tags: ['conduct', 'ethics', 'guidelines'],
    groupIds: ['group-3'],
    isActive: true,
    uploadedAt: '2024-01-16T12:00:00Z',
    uploadedBy: 'HR Director',
    lastModifiedAt: '2024-01-27T14:45:00Z',
    lastModifiedBy: 'Legal Team'
  }
];

const mockCategories: DocumentCategory[] = [
  { id: 'cat-1', name: 'HR Documents', description: 'Human Resources related documents', color: 'blue', isActive: true },
  { id: 'cat-2', name: 'Legal Documents', description: 'Legal and compliance documents', color: 'red', isActive: true },
  { id: 'cat-3', name: 'Project Documents', description: 'Project management documents', color: 'green', isActive: true },
  { id: 'cat-4', name: 'Technical Documentation', description: 'Technical specifications and guides', color: 'purple', isActive: true },
  { id: 'cat-5', name: 'Training Materials', description: 'Training and educational content', color: 'orange', isActive: true },
  { id: 'cat-6', name: 'Administrative', description: 'Administrative and operational documents', color: 'yellow', isActive: true }
];

// Utility functions
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Export mock data and getters
export const getMockTemplates = (): DocumentTemplate[] => [...mockTemplates];
export const getMockGroups = (): DocumentGroup[] => [...mockGroups];
export const getMockDocuments = (): ManualDocument[] => [...mockDocuments];
export const getMockCategories = (): DocumentCategory[] => [...mockCategories];

// Export setters for CRUD operations
export const setMockTemplates = (templates: DocumentTemplate[]): void => {
  mockTemplates = templates;
};

export const setMockGroups = (groups: DocumentGroup[]): void => {
  mockGroups = groups;
};

export const setMockDocuments = (documents: ManualDocument[]): void => {
  mockDocuments = documents;
};

// Helper functions for finding items
export const findTemplateById = (id: string): DocumentTemplate | undefined => {
  return mockTemplates.find(template => template.id === id);
};

export const findGroupById = (id: string): DocumentGroup | undefined => {
  return mockGroups.find(group => group.id === id);
};

export const findDocumentById = (id: string): ManualDocument | undefined => {
  return mockDocuments.find(document => document.id === id);
};
