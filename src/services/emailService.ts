import {
  EmailRecipient,
  EmailAttachment,
  GroupEmailData,
  SendEmailRequest,
  SendEmailResponse,
  EmailService,
  DocumentTemplate,
  ManualDocument
} from '@/types/documentation';
import { 
  findGroupById, 
  findTemplateById, 
  findDocumentById, 
  delay 
} from './mockDocumentationData';

// Mock email recipients data
const mockRecipients: EmailRecipient[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'HR Manager',
    department: 'Human Resources'
  },
  {
    id: 'user-2',
    name: 'Jane Doe',
    email: 'jane.doe@company.com',
    role: 'Project Manager',
    department: 'Operations'
  },
  {
    id: 'user-3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'Team Lead',
    department: 'Development'
  },
  {
    id: 'user-4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'Legal Counsel',
    department: 'Legal'
  },
  {
    id: 'user-5',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    role: 'Marketing Manager',
    department: 'Marketing'
  },
  {
    id: 'user-6',
    name: 'Robert Brown',
    email: 'robert.brown@company.com',
    role: 'Operations Manager',
    department: 'Operations'
  }
];

class MockEmailService implements EmailService {
  async getEmailRecipients(): Promise<EmailRecipient[]> {
    await delay(300);
    return [...mockRecipients];
  }

  async generateEmailContent(groupId: string): Promise<GroupEmailData> {
    await delay(500);
    
    const group = findGroupById(groupId);
    if (!group) {
      throw new Error('Group not found');
    }

    // Get templates and documents for this group
    const templates: DocumentTemplate[] = [];
    const documents: ManualDocument[] = [];
    const attachments: EmailAttachment[] = [];

    // Fetch templates
    for (const templateId of group.templateIds) {
      const template = findTemplateById(templateId);
      if (template) {
        templates.push(template);
        attachments.push({
          id: template.id,
          name: template.name,
          type: 'template',
          fileName: `${template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`,
          content: template.content
        });
      }
    }

    // Fetch documents
    for (const documentId of group.documentIds) {
      const document = findDocumentById(documentId);
      if (document) {
        documents.push(document);
        attachments.push({
          id: document.id,
          name: document.name,
          type: 'document',
          fileName: document.fileName,
          fileSize: document.fileSize,
          filePath: document.filePath
        });
      }
    }

    // Generate default email content
    const subject = `Document Group: ${group.name}`;
    const message = this.generateDefaultEmailMessage(group.name, group.description, templates, documents);

    return {
      groupId: group.id,
      groupName: group.name,
      groupDescription: group.description,
      groupCategory: group.category,
      templates,
      documents,
      recipients: mockRecipients,
      subject,
      message,
      attachments
    };
  }

  async sendGroupEmail(data: SendEmailRequest): Promise<SendEmailResponse> {
    await delay(1500); // Simulate email sending delay
    
    // Mock email sending - in real implementation, this would call an email API
    console.log('📧 Mock Email Sent:', {
      groupId: data.groupId,
      recipients: data.recipients,
      subject: data.subject,
      message: data.message,
      includeTemplates: data.includeTemplates,
      includeDocuments: data.includeDocuments,
      attachmentIds: data.attachmentIds,
      sentAt: new Date().toISOString()
    });

    // Simulate occasional failures for testing
    if (Math.random() < 0.1) { // 10% chance of failure
      throw new Error('Failed to send email. Please try again.');
    }

    return {
      success: true,
      message: `Email sent successfully to ${data.recipients.length} recipient(s)`,
      emailId: `email-${Date.now()}`,
      sentAt: new Date().toISOString()
    };
  }

  private generateDefaultEmailMessage(
    groupName: string, 
    groupDescription: string, 
    templates: DocumentTemplate[], 
    documents: ManualDocument[]
  ): string {
    let message = `Dear Team,\n\n`;
    message += `I'm sharing the "${groupName}" document group with you.\n\n`;
    message += `${groupDescription}\n\n`;

    if (templates.length > 0) {
      message += `📋 Document Templates (${templates.length}):\n`;
      templates.forEach((template, index) => {
        message += `${index + 1}. ${template.name} - ${template.description}\n`;
      });
      message += `\n`;
    }

    if (documents.length > 0) {
      message += `📁 Manual Documents (${documents.length}):\n`;
      documents.forEach((document, index) => {
        message += `${index + 1}. ${document.name} - ${document.description}\n`;
      });
      message += `\n`;
    }

    message += `Please review the attached documents and templates. If you have any questions, feel free to reach out.\n\n`;
    message += `Best regards,\n`;
    message += `Documentation Team`;

    return message;
  }

  // Helper method to get recipients by department
  async getRecipientsByDepartment(department: string): Promise<EmailRecipient[]> {
    await delay(200);
    return mockRecipients.filter(recipient => 
      recipient.department?.toLowerCase() === department.toLowerCase()
    );
  }

  // Helper method to get recipients by role
  async getRecipientsByRole(role: string): Promise<EmailRecipient[]> {
    await delay(200);
    return mockRecipients.filter(recipient => 
      recipient.role?.toLowerCase().includes(role.toLowerCase())
    );
  }

  // Helper method to validate email addresses
  validateEmailAddresses(emails: string[]): { valid: string[]; invalid: string[] } {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid: string[] = [];
    const invalid: string[] = [];

    emails.forEach(email => {
      if (emailRegex.test(email.trim())) {
        valid.push(email.trim());
      } else {
        invalid.push(email.trim());
      }
    });

    return { valid, invalid };
  }

  // Helper method to get suggested recipients based on group category
  async getSuggestedRecipients(groupCategory: string): Promise<EmailRecipient[]> {
    await delay(200);
    
    const categoryMappings: Record<string, string[]> = {
      'HR Documents': ['HR Manager', 'HR Director'],
      'Legal Documents': ['Legal Counsel', 'Legal'],
      'Project Documents': ['Project Manager', 'Operations Manager'],
      'Technical Documentation': ['Team Lead', 'Development'],
      'Marketing Materials': ['Marketing Manager', 'Marketing'],
      'Administrative': ['Operations Manager', 'HR Manager']
    };

    const relevantRoles = categoryMappings[groupCategory] || [];
    
    return mockRecipients.filter(recipient => 
      relevantRoles.some(role => 
        recipient.role?.includes(role) || recipient.department?.includes(role)
      )
    );
  }
}

export const emailService = new MockEmailService();
export default emailService;
