import {
  EmailTemplate,
  EmailMessage,
  EmailTemplateUsage,
  CreateEmailTemplateRequest,
  UpdateEmailTemplateRequest,
  EmailTemplateResponse,
  EmailTemplatesResponse,
  EmailMessagesResponse,
  EmailTemplateUsageResponse,
  EmailTemplateFilters,
  EmailMessageFilters,
  EmailTemplateCategory,
  EmailStatus,
} from '@/types/emailTemplates';

// Mock data
const mockEmailTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Interview Invitation - Technical Role',
    subject: 'Interview Invitation for {{position}} at {{company}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Interview Invitation</h2>
        <p>Dear {{candidateName}},</p>
        <p>We are pleased to invite you for an interview for the <strong>{{position}}</strong> position at {{company}}.</p>
        <p><strong>Interview Details:</strong></p>
        <ul>
          <li>Date: {{interviewDate}}</li>
          <li>Time: {{interviewTime}}</li>
          <li>Location: {{interviewLocation}}</li>
          <li>Duration: {{duration}}</li>
        </ul>
        <p>Please confirm your availability by replying to this email.</p>
        <p>Best regards,<br>{{senderName}}<br>{{senderTitle}}</p>
      </div>
    `,
    category: 'interview_invitation',
    tags: ['interview', 'technical', 'invitation'],
    isActive: true,
    createdBy: 'John Doe',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    usageCount: 25,
    lastUsed: '2024-01-25T09:15:00Z',
  },
  {
    id: '2',
    name: 'Job Offer - Standard',
    subject: 'Job Offer - {{position}} at {{company}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations! Job Offer</h2>
        <p>Dear {{candidateName}},</p>
        <p>We are delighted to offer you the position of <strong>{{position}}</strong> at {{company}}.</p>
        <p><strong>Offer Details:</strong></p>
        <ul>
          <li>Position: {{position}}</li>
          <li>Department: {{department}}</li>
          <li>Start Date: {{startDate}}</li>
          <li>Salary: {{salary}}</li>
          <li>Benefits: {{benefits}}</li>
        </ul>
        <p>Please review the attached offer letter and let us know your decision by {{responseDeadline}}.</p>
        <p>We look forward to welcoming you to our team!</p>
        <p>Best regards,<br>{{senderName}}<br>{{senderTitle}}</p>
      </div>
    `,
    category: 'job_offer',
    tags: ['offer', 'employment', 'congratulations'],
    isActive: true,
    createdBy: 'Jane Smith',
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-18T16:45:00Z',
    usageCount: 12,
    lastUsed: '2024-01-24T11:30:00Z',
  },
  {
    id: '3',
    name: 'Application Rejection - Polite',
    subject: 'Update on Your Application for {{position}}',
    content: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Application Update</h2>
        <p>Dear {{candidateName}},</p>
        <p>Thank you for your interest in the <strong>{{position}}</strong> position at {{company}} and for taking the time to interview with us.</p>
        <p>After careful consideration, we have decided to move forward with another candidate whose experience more closely matches our current needs.</p>
        <p>We were impressed by your qualifications and encourage you to apply for future opportunities that match your skills and experience.</p>
        <p>We wish you all the best in your job search.</p>
        <p>Best regards,<br>{{senderName}}<br>{{senderTitle}}</p>
      </div>
    `,
    category: 'rejection',
    tags: ['rejection', 'polite', 'encouragement'],
    isActive: true,
    createdBy: 'Mike Johnson',
    createdAt: '2024-01-12T12:00:00Z',
    updatedAt: '2024-01-22T10:15:00Z',
    usageCount: 8,
    lastUsed: '2024-01-23T15:45:00Z',
  },
];

const mockEmailMessages: EmailMessage[] = [
  {
    id: '1',
    from: 'hr@company.com',
    to: ['john.doe@email.com'],
    subject: 'Interview Invitation for Senior Developer at QORE',
    content: 'Dear John, We are pleased to invite you for an interview...',
    htmlContent: '<div>Dear John, We are pleased to invite you for an interview...</div>',
    templateId: '1',
    templateName: 'Interview Invitation - Technical Role',
    status: 'delivered',
    sentAt: '2024-01-25T09:15:00Z',
    attachments: [],
    metadata: {
      candidateId: 'candidate-1',
      jobId: 'job-1',
      source: 'email_template',
    },
  },
  {
    id: '2',
    from: 'hr@company.com',
    to: ['jane.smith@email.com'],
    subject: 'Job Offer - Marketing Manager at QORE',
    content: 'Dear Jane, We are delighted to offer you the position...',
    htmlContent: '<div>Dear Jane, We are delighted to offer you the position...</div>',
    templateId: '2',
    templateName: 'Job Offer - Standard',
    status: 'read',
    sentAt: '2024-01-24T11:30:00Z',
    readAt: '2024-01-24T14:20:00Z',
    attachments: [
      {
        id: 'att-1',
        name: 'offer_letter.pdf',
        size: 245760,
        type: 'application/pdf',
      },
    ],
    metadata: {
      candidateId: 'candidate-2',
      jobId: 'job-2',
      source: 'email_template',
    },
  },
];

const mockEmailTemplateUsage: EmailTemplateUsage[] = [
  {
    id: '1',
    templateId: '1',
    templateName: 'Interview Invitation - Technical Role',
    usedBy: 'John Doe',
    usedAt: '2024-01-25T09:15:00Z',
    recipientEmail: 'john.doe@email.com',
    subject: 'Interview Invitation for Senior Developer at QORE',
    status: 'delivered',
    candidateId: 'candidate-1',
    jobId: 'job-1',
  },
  {
    id: '2',
    templateId: '2',
    templateName: 'Job Offer - Standard',
    usedBy: 'Jane Smith',
    usedAt: '2024-01-24T11:30:00Z',
    recipientEmail: 'jane.smith@email.com',
    subject: 'Job Offer - Marketing Manager at QORE',
    status: 'read',
    candidateId: 'candidate-2',
    jobId: 'job-2',
  },
];

// Utility function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class EmailTemplateService {
  // Email Templates CRUD
  async getEmailTemplates(
    page: number = 1,
    limit: number = 10,
    filters?: EmailTemplateFilters
  ): Promise<EmailTemplatesResponse> {
    await delay(500);

    let filteredTemplates = [...mockEmailTemplates];

    // Apply filters
    if (filters) {
      if (filters.category) {
        filteredTemplates = filteredTemplates.filter(t => t.category === filters.category);
      }
      if (filters.isActive !== undefined) {
        filteredTemplates = filteredTemplates.filter(t => t.isActive === filters.isActive);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredTemplates = filteredTemplates.filter(t =>
          t.name.toLowerCase().includes(searchLower) ||
          t.subject.toLowerCase().includes(searchLower) ||
          t.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      if (filters.tags && filters.tags.length > 0) {
        filteredTemplates = filteredTemplates.filter(t =>
          filters.tags!.some(tag => t.tags.includes(tag))
        );
      }
    }

    const total = filteredTemplates.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedTemplates,
      total,
      page,
      limit,
    };
  }

  async getEmailTemplateById(id: string): Promise<EmailTemplateResponse> {
    await delay(300);

    const template = mockEmailTemplates.find(t => t.id === id);
    if (!template) {
      throw new Error('Email template not found');
    }

    return {
      success: true,
      data: template,
    };
  }

  async createEmailTemplate(data: CreateEmailTemplateRequest): Promise<EmailTemplateResponse> {
    await delay(800);

    const newTemplate: EmailTemplate = {
      id: Date.now().toString(),
      ...data,
      isActive: data.isActive ?? true,
      createdBy: 'Current User', // In real app, get from auth context
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0,
    };

    mockEmailTemplates.unshift(newTemplate);

    return {
      success: true,
      data: newTemplate,
      message: 'Email template created successfully',
    };
  }

  async updateEmailTemplate(data: UpdateEmailTemplateRequest): Promise<EmailTemplateResponse> {
    await delay(600);

    const index = mockEmailTemplates.findIndex(t => t.id === data.id);
    if (index === -1) {
      throw new Error('Email template not found');
    }

    const updatedTemplate: EmailTemplate = {
      ...mockEmailTemplates[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    mockEmailTemplates[index] = updatedTemplate;

    return {
      success: true,
      data: updatedTemplate,
      message: 'Email template updated successfully',
    };
  }

  async deleteEmailTemplate(id: string): Promise<{ success: boolean; message: string }> {
    await delay(400);

    const index = mockEmailTemplates.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Email template not found');
    }

    mockEmailTemplates.splice(index, 1);

    return {
      success: true,
      message: 'Email template deleted successfully',
    };
  }
}

export const emailTemplateService = new EmailTemplateService();
export default emailTemplateService;
