import {
  OnboardingCandidate,
  OnboardingTask,
  OnboardingDocument,
  OnboardingTraining,
  OnboardingCandidateResponse,
  OnboardingCandidatesResponse,
  OnboardingTaskResponse,
  OnboardingTasksResponse,
  OnboardingDocumentResponse,
  OnboardingDocumentsResponse,
  OnboardingTrainingResponse,
  OnboardingTrainingsResponse,
  CreateCandidateRequest,
  UpdateCandidateRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  CreateDocumentRequest,
  UpdateDocumentRequest,
  CreateTrainingRequest,
  UpdateTrainingRequest,
  CandidateFilters,
  TaskFilters,
  DocumentFilters,
  TrainingFilters,
  OnboardingStats,
  OnboardingDashboardData,
} from '@/types/hrOnboarding';

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data
let mockCandidates: OnboardingCandidate[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '+1-555-0123',
    position: 'Software Engineer',
    department: 'Engineering',
    departmentId: 'dept-1',
    manager: 'Sarah Johnson',
    managerId: 'mgr-1',
    startDate: '2024-02-01',
    status: 'in-progress',
    progress: 65,
    location: 'New York Office',
    locationId: 'loc-1',
    salary: 85000,
    employmentType: 'full-time',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Manager'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    phone: '+1-555-0124',
    position: 'UX Designer',
    department: 'Design',
    departmentId: 'dept-2',
    manager: 'Mike Wilson',
    managerId: 'mgr-2',
    startDate: '2024-02-05',
    status: 'pending',
    progress: 25,
    location: 'San Francisco Office',
    locationId: 'loc-2',
    salary: 75000,
    employmentType: 'full-time',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Manager'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@company.com',
    phone: '+1-555-0125',
    position: 'Marketing Specialist',
    department: 'Marketing',
    departmentId: 'dept-3',
    manager: 'Lisa Davis',
    managerId: 'mgr-3',
    startDate: '2024-01-15',
    status: 'completed',
    progress: 100,
    location: 'Chicago Office',
    locationId: 'loc-3',
    salary: 65000,
    employmentType: 'full-time',
    createdAt: '2024-01-01T08:00:00Z',
    updatedAt: '2024-01-25T16:45:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Manager'
  }
];

let mockTasks: OnboardingTask[] = [
  {
    id: 'task-1',
    candidateId: '1',
    title: 'Complete I-9 Form',
    description: 'Fill out and submit the I-9 Employment Eligibility Verification form',
    category: 'documentation',
    status: 'completed',
    priority: 'high',
    assignedTo: 'hr-1',
    assignedToName: 'HR Assistant',
    dueDate: '2024-01-30',
    completedDate: '2024-01-28',
    estimatedHours: 1,
    actualHours: 0.5,
    dependencies: [],
    attachments: [],
    notes: 'Completed successfully with all required documentation',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-28T14:30:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Assistant'
  },
  {
    id: 'task-2',
    candidateId: '1',
    title: 'IT Equipment Setup',
    description: 'Set up laptop, accounts, and access permissions',
    category: 'setup',
    status: 'in-progress',
    priority: 'high',
    assignedTo: 'it-1',
    assignedToName: 'IT Support',
    dueDate: '2024-02-01',
    estimatedHours: 3,
    dependencies: ['task-1'],
    attachments: [],
    notes: 'Laptop ordered, waiting for delivery',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-29T09:15:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'IT Support'
  },
  {
    id: 'task-3',
    candidateId: '2',
    title: 'Background Check',
    description: 'Complete background verification process',
    category: 'compliance',
    status: 'pending',
    priority: 'urgent',
    assignedTo: 'hr-2',
    assignedToName: 'HR Specialist',
    dueDate: '2024-02-03',
    estimatedHours: 2,
    dependencies: [],
    attachments: [],
    notes: 'Waiting for candidate to provide additional references',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-22T11:15:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Specialist'
  }
];

let mockDocuments: OnboardingDocument[] = [
  {
    id: 'doc-1',
    candidateId: '1',
    name: 'Driver\'s License',
    description: 'Valid government-issued photo ID',
    category: 'personal',
    status: 'verified',
    required: true,
    fileName: 'drivers_license_john_doe.pdf',
    fileSize: 1024000,
    fileType: 'application/pdf',
    filePath: '/documents/drivers_license_john_doe.pdf',
    uploadedDate: '2024-01-20',
    verifiedDate: '2024-01-21',
    verifiedBy: 'HR Assistant',
    notes: 'Valid until 2028',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-21T13:45:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Assistant'
  },
  {
    id: 'doc-2',
    candidateId: '1',
    name: 'W-4 Tax Form',
    description: 'Employee\'s Withholding Certificate',
    category: 'tax',
    status: 'uploaded',
    required: true,
    fileName: 'w4_form_john_doe.pdf',
    fileSize: 512000,
    fileType: 'application/pdf',
    filePath: '/documents/w4_form_john_doe.pdf',
    uploadedDate: '2024-01-22',
    notes: 'Pending review by payroll department',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-22T10:30:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'John Doe'
  },
  {
    id: 'doc-3',
    candidateId: '2',
    name: 'Social Security Card',
    description: 'Social Security Administration issued card',
    category: 'personal',
    status: 'pending',
    required: true,
    notes: 'Waiting for candidate to upload',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Manager'
  }
];

let mockTrainings: OnboardingTraining[] = [
  {
    id: 'training-1',
    candidateId: '1',
    title: 'Company Orientation',
    description: 'Introduction to company culture, values, and policies',
    category: 'orientation',
    status: 'completed',
    required: true,
    priority: 'high',
    duration: 4,
    completionPercentage: 100,
    startDate: '2024-01-25',
    completedDate: '2024-01-25',
    dueDate: '2024-02-01',
    instructor: 'HR Manager',
    instructorId: 'hr-mgr-1',
    format: 'in-person',
    location: 'Conference Room A',
    materials: ['Employee Handbook', 'Company Presentation'],
    assessmentScore: 95,
    passingScore: 80,
    attempts: 1,
    maxAttempts: 3,
    notes: 'Excellent participation and understanding',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-25T16:00:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Manager'
  },
  {
    id: 'training-2',
    candidateId: '1',
    title: 'Safety Training',
    description: 'Workplace safety protocols and emergency procedures',
    category: 'safety',
    status: 'in-progress',
    required: true,
    priority: 'high',
    duration: 2,
    completionPercentage: 60,
    startDate: '2024-01-26',
    dueDate: '2024-02-02',
    instructor: 'Safety Officer',
    instructorId: 'safety-1',
    format: 'online',
    materials: ['Safety Manual', 'Emergency Procedures Video'],
    passingScore: 85,
    attempts: 0,
    maxAttempts: 2,
    notes: 'In progress, good engagement so far',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-26T14:20:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'Safety Officer'
  },
  {
    id: 'training-3',
    candidateId: '2',
    title: 'Technical Skills Assessment',
    description: 'Evaluate current technical skills and identify training needs',
    category: 'technical',
    status: 'not-started',
    required: false,
    priority: 'medium',
    duration: 3,
    completionPercentage: 0,
    dueDate: '2024-02-10',
    instructor: 'Technical Lead',
    instructorId: 'tech-1',
    format: 'hybrid',
    location: 'Lab Room 1',
    materials: ['Technical Assessment Guide'],
    passingScore: 75,
    attempts: 0,
    maxAttempts: 2,
    notes: 'Scheduled for next week',
    createdAt: '2024-01-18T09:00:00Z',
    updatedAt: '2024-01-18T09:00:00Z',
    createdBy: 'HR Manager',
    lastModifiedBy: 'HR Manager'
  }
];

class HROnboardingService {
  // Candidates CRUD
  async getCandidates(
    page: number = 1,
    limit: number = 10,
    filters?: CandidateFilters
  ): Promise<OnboardingCandidatesResponse> {
    await delay(500);

    let filteredCandidates = [...mockCandidates];

    // Apply filters
    if (filters) {
      if (filters.status) {
        filteredCandidates = filteredCandidates.filter(c => c.status === filters.status);
      }
      if (filters.department) {
        filteredCandidates = filteredCandidates.filter(c => c.department === filters.department);
      }
      if (filters.manager) {
        filteredCandidates = filteredCandidates.filter(c => c.manager === filters.manager);
      }
      if (filters.location) {
        filteredCandidates = filteredCandidates.filter(c => c.location === filters.location);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredCandidates = filteredCandidates.filter(c =>
          c.firstName.toLowerCase().includes(searchLower) ||
          c.lastName.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower) ||
          c.position.toLowerCase().includes(searchLower)
        );
      }
    }

    const total = filteredCandidates.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCandidates = filteredCandidates.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedCandidates,
      total,
      page,
      limit,
    };
  }

  async getCandidateById(id: string): Promise<OnboardingCandidateResponse> {
    await delay(300);

    const candidate = mockCandidates.find(c => c.id === id);
    if (!candidate) {
      throw new Error('Candidate not found');
    }

    return {
      success: true,
      data: candidate,
    };
  }

  async createCandidate(data: CreateCandidateRequest): Promise<OnboardingCandidateResponse> {
    await delay(800);

    const newCandidate: OnboardingCandidate = {
      id: Date.now().toString(),
      employeeId: `EMP${String(mockCandidates.length + 1).padStart(3, '0')}`,
      ...data,
      status: 'pending',
      progress: 0,
      department: 'Engineering', // This would be looked up from departmentId
      manager: 'Manager Name', // This would be looked up from managerId
      location: 'Office Location', // This would be looked up from locationId
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      lastModifiedBy: 'Current User',
    };

    mockCandidates.unshift(newCandidate);

    return {
      success: true,
      data: newCandidate,
      message: 'Candidate created successfully',
    };
  }

  async updateCandidate(data: UpdateCandidateRequest): Promise<OnboardingCandidateResponse> {
    await delay(600);

    const index = mockCandidates.findIndex(c => c.id === data.id);
    if (index === -1) {
      throw new Error('Candidate not found');
    }

    const updatedCandidate: OnboardingCandidate = {
      ...mockCandidates[index],
      ...data,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User',
    };

    mockCandidates[index] = updatedCandidate;

    return {
      success: true,
      data: updatedCandidate,
      message: 'Candidate updated successfully',
    };
  }

  async deleteCandidate(id: string): Promise<{ success: boolean; message: string }> {
    await delay(400);

    const index = mockCandidates.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Candidate not found');
    }

    mockCandidates.splice(index, 1);

    return {
      success: true,
      message: 'Candidate deleted successfully',
    };
  }

  // Tasks CRUD
  async getTasks(
    page: number = 1,
    limit: number = 10,
    filters?: TaskFilters
  ): Promise<OnboardingTasksResponse> {
    await delay(500);

    let filteredTasks = [...mockTasks];

    // Apply filters
    if (filters) {
      if (filters.candidateId) {
        filteredTasks = filteredTasks.filter(t => t.candidateId === filters.candidateId);
      }
      if (filters.status) {
        filteredTasks = filteredTasks.filter(t => t.status === filters.status);
      }
      if (filters.category) {
        filteredTasks = filteredTasks.filter(t => t.category === filters.category);
      }
      if (filters.assignedTo) {
        filteredTasks = filteredTasks.filter(t => t.assignedTo === filters.assignedTo);
      }
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTasks = filteredTasks.filter(t =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
        );
      }
    }

    const total = filteredTasks.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedTasks,
      total,
      page,
      limit,
    };
  }

  async getTaskById(id: string): Promise<OnboardingTaskResponse> {
    await delay(300);

    const task = mockTasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }

    return {
      success: true,
      data: task,
    };
  }

  async createTask(data: CreateTaskRequest): Promise<OnboardingTaskResponse> {
    await delay(800);

    const newTask: OnboardingTask = {
      id: `task-${Date.now()}`,
      ...data,
      status: 'pending',
      assignedToName: 'Assigned User', // This would be looked up from assignedTo
      completedDate: undefined,
      actualHours: undefined,
      attachments: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      lastModifiedBy: 'Current User',
    };

    mockTasks.unshift(newTask);

    return {
      success: true,
      data: newTask,
      message: 'Task created successfully',
    };
  }

  async updateTask(data: UpdateTaskRequest): Promise<OnboardingTaskResponse> {
    await delay(600);

    const index = mockTasks.findIndex(t => t.id === data.id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    const updatedTask: OnboardingTask = {
      ...mockTasks[index],
      ...data,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User',
    };

    mockTasks[index] = updatedTask;

    return {
      success: true,
      data: updatedTask,
      message: 'Task updated successfully',
    };
  }

  async deleteTask(id: string): Promise<{ success: boolean; message: string }> {
    await delay(400);

    const index = mockTasks.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }

    mockTasks.splice(index, 1);

    return {
      success: true,
      message: 'Task deleted successfully',
    };
  }

  // Documents CRUD
  async getDocuments(
    page: number = 1,
    limit: number = 10,
    filters?: DocumentFilters
  ): Promise<OnboardingDocumentsResponse> {
    await delay(500);

    let filteredDocuments = [...mockDocuments];

    // Apply filters
    if (filters) {
      if (filters.candidateId) {
        filteredDocuments = filteredDocuments.filter(d => d.candidateId === filters.candidateId);
      }
      if (filters.status) {
        filteredDocuments = filteredDocuments.filter(d => d.status === filters.status);
      }
      if (filters.category) {
        filteredDocuments = filteredDocuments.filter(d => d.category === filters.category);
      }
      if (filters.required !== undefined) {
        filteredDocuments = filteredDocuments.filter(d => d.required === filters.required);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredDocuments = filteredDocuments.filter(d =>
          d.name.toLowerCase().includes(searchLower) ||
          d.description.toLowerCase().includes(searchLower)
        );
      }
    }

    const total = filteredDocuments.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedDocuments = filteredDocuments.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedDocuments,
      total,
      page,
      limit,
    };
  }

  async getDocumentById(id: string): Promise<OnboardingDocumentResponse> {
    await delay(300);

    const document = mockDocuments.find(d => d.id === id);
    if (!document) {
      throw new Error('Document not found');
    }

    return {
      success: true,
      data: document,
    };
  }

  async createDocument(data: CreateDocumentRequest): Promise<OnboardingDocumentResponse> {
    await delay(800);

    const newDocument: OnboardingDocument = {
      id: `doc-${Date.now()}`,
      ...data,
      status: 'pending',
      fileName: undefined,
      fileSize: undefined,
      fileType: undefined,
      filePath: undefined,
      uploadedDate: undefined,
      verifiedDate: undefined,
      verifiedBy: undefined,
      rejectionReason: undefined,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      lastModifiedBy: 'Current User',
    };

    mockDocuments.unshift(newDocument);

    return {
      success: true,
      data: newDocument,
      message: 'Document created successfully',
    };
  }

  async updateDocument(data: UpdateDocumentRequest): Promise<OnboardingDocumentResponse> {
    await delay(600);

    const index = mockDocuments.findIndex(d => d.id === data.id);
    if (index === -1) {
      throw new Error('Document not found');
    }

    const updatedDocument: OnboardingDocument = {
      ...mockDocuments[index],
      ...data,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User',
    };

    mockDocuments[index] = updatedDocument;

    return {
      success: true,
      data: updatedDocument,
      message: 'Document updated successfully',
    };
  }

  async deleteDocument(id: string): Promise<{ success: boolean; message: string }> {
    await delay(400);

    const index = mockDocuments.findIndex(d => d.id === id);
    if (index === -1) {
      throw new Error('Document not found');
    }

    mockDocuments.splice(index, 1);

    return {
      success: true,
      message: 'Document deleted successfully',
    };
  }

  // Training CRUD
  async getTrainings(
    page: number = 1,
    limit: number = 10,
    filters?: TrainingFilters
  ): Promise<OnboardingTrainingsResponse> {
    await delay(500);

    let filteredTrainings = [...mockTrainings];

    // Apply filters
    if (filters) {
      if (filters.candidateId) {
        filteredTrainings = filteredTrainings.filter(t => t.candidateId === filters.candidateId);
      }
      if (filters.status) {
        filteredTrainings = filteredTrainings.filter(t => t.status === filters.status);
      }
      if (filters.category) {
        filteredTrainings = filteredTrainings.filter(t => t.category === filters.category);
      }
      if (filters.instructor) {
        filteredTrainings = filteredTrainings.filter(t => t.instructor === filters.instructor);
      }
      if (filters.required !== undefined) {
        filteredTrainings = filteredTrainings.filter(t => t.required === filters.required);
      }
      if (filters.format) {
        filteredTrainings = filteredTrainings.filter(t => t.format === filters.format);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTrainings = filteredTrainings.filter(t =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
        );
      }
    }

    const total = filteredTrainings.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTrainings = filteredTrainings.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedTrainings,
      total,
      page,
      limit,
    };
  }

  async getTrainingById(id: string): Promise<OnboardingTrainingResponse> {
    await delay(300);

    const training = mockTrainings.find(t => t.id === id);
    if (!training) {
      throw new Error('Training not found');
    }

    return {
      success: true,
      data: training,
    };
  }

  async createTraining(data: CreateTrainingRequest): Promise<OnboardingTrainingResponse> {
    await delay(800);

    const newTraining: OnboardingTraining = {
      id: `training-${Date.now()}`,
      ...data,
      status: 'not-started',
      completionPercentage: 0,
      startDate: undefined,
      completedDate: undefined,
      instructor: 'Instructor Name', // This would be looked up from instructorId
      materials: [],
      assessmentScore: undefined,
      attempts: 0,
      certificateUrl: undefined,
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User',
      lastModifiedBy: 'Current User',
    };

    mockTrainings.unshift(newTraining);

    return {
      success: true,
      data: newTraining,
      message: 'Training created successfully',
    };
  }

  async updateTraining(data: UpdateTrainingRequest): Promise<OnboardingTrainingResponse> {
    await delay(600);

    const index = mockTrainings.findIndex(t => t.id === data.id);
    if (index === -1) {
      throw new Error('Training not found');
    }

    const updatedTraining: OnboardingTraining = {
      ...mockTrainings[index],
      ...data,
      updatedAt: new Date().toISOString(),
      lastModifiedBy: 'Current User',
    };

    mockTrainings[index] = updatedTraining;

    return {
      success: true,
      data: updatedTraining,
      message: 'Training updated successfully',
    };
  }

  async deleteTraining(id: string): Promise<{ success: boolean; message: string }> {
    await delay(400);

    const index = mockTrainings.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Training not found');
    }

    mockTrainings.splice(index, 1);

    return {
      success: true,
      message: 'Training deleted successfully',
    };
  }

  // Dashboard and Statistics
  async getDashboardData(): Promise<OnboardingDashboardData> {
    await delay(600);

    const stats: OnboardingStats = {
      totalCandidates: mockCandidates.length,
      activeCandidates: mockCandidates.filter(c => c.status === 'in-progress').length,
      completedCandidates: mockCandidates.filter(c => c.status === 'completed').length,
      overdueTasks: mockTasks.filter(t =>
        t.status !== 'completed' && new Date(t.dueDate) < new Date()
      ).length,
      pendingDocuments: mockDocuments.filter(d => d.status === 'pending').length,
      completedTrainings: mockTrainings.filter(t => t.status === 'completed').length,
      averageCompletionTime: 14, // Mock average in days
      completionRate: 75, // Mock completion rate percentage
    };

    const recentCandidates = mockCandidates
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const upcomingTasks = mockTasks
      .filter(t => t.status !== 'completed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);

    const pendingDocuments = mockDocuments
      .filter(d => d.status === 'pending')
      .slice(0, 5);

    const overdueTrainings = mockTrainings
      .filter(t => t.status !== 'completed' && new Date(t.dueDate) < new Date())
      .slice(0, 5);

    return {
      stats,
      recentCandidates,
      upcomingTasks,
      pendingDocuments,
      overdueTrainings,
    };
  }

  // Bulk operations
  async bulkUpdateCandidateStatus(
    candidateIds: string[],
    status: OnboardingStatus
  ): Promise<{ success: boolean; message: string }> {
    await delay(800);

    candidateIds.forEach(id => {
      const index = mockCandidates.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCandidates[index] = {
          ...mockCandidates[index],
          status,
          updatedAt: new Date().toISOString(),
          lastModifiedBy: 'Current User',
        };
      }
    });

    return {
      success: true,
      message: `${candidateIds.length} candidates updated successfully`,
    };
  }

  async bulkAssignTasks(
    taskIds: string[],
    assignedTo: string
  ): Promise<{ success: boolean; message: string }> {
    await delay(800);

    taskIds.forEach(id => {
      const index = mockTasks.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTasks[index] = {
          ...mockTasks[index],
          assignedTo,
          assignedToName: 'Assigned User', // This would be looked up
          updatedAt: new Date().toISOString(),
          lastModifiedBy: 'Current User',
        };
      }
    });

    return {
      success: true,
      message: `${taskIds.length} tasks assigned successfully`,
    };
  }
}

export const hrOnboardingService = new HROnboardingService();
export default hrOnboardingService;
