// Mock data and types for the Accounts module

export interface Invoice {
  id: number;
  invoiceNumber: string;
  client: string;
  vendor: string;
  servicePeriod: string;
  invoiceType: 'Monthly' | 'Weekly' | 'Project' | 'Hourly';
  totalAmount: number;
  approvalStatus: 'Approved' | 'Pending' | 'Rejected';
  clientPaymentStatus: 'Paid' | 'Pending' | 'Unpaid' | 'Overdue';
  candidatePaymentStatus: 'Paid' | 'Pending' | 'Unpaid' | 'Overdue';
  dueDate: string;
  isOverdue: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

export interface Timesheet {
  id: number;
  candidateName: string;
  weekPeriod: string;
  billableHours: number;
  nonBillableHours: number;
  hourlyRate: number;
  lineAmount: number;
  approvalStatus: 'Approved' | 'Needs Approval' | 'Rejected';
  attachments: number;
  hasOCRData: boolean;
  submittedBy: string;
  submittedAt: string;
}

export interface PTOEmployee {
  id: number;
  employeeName: string;
  startDate: string;
  tenure: string;
  ptoEarned: number;
  ptoTaken: number;
  balance: number;
  status: 'within' | 'nearing' | 'exceeded';
  alerts: string[];
}

export interface ApprovalItem {
  id: number;
  itemType: 'Invoice' | 'Timesheet' | 'PTO Request';
  candidateClient: string;
  amount?: number;
  hours?: number;
  requestedBy: string;
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  comments: Array<{
    user: string;
    comment: string;
    date: string;
  }>;
  isLocked: boolean;
}

export interface OverdueInvoice {
  id: number;
  invoiceNumber: string;
  client: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
  escalationLevel: 'Level 1' | 'Level 2' | 'Level 3';
  contact: string;
  phone: string;
}

export interface SystemAlert {
  id: number;
  type: 'Missing Timesheet' | 'PTO Overuse' | 'Overdue Invoice' | 'Approval Pending';
  message: string;
  severity: 'warning' | 'error' | 'info';
  date: string;
}

// Mock data
export const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-001',
    client: 'TechCorp Inc.',
    vendor: 'ABC Consulting',
    servicePeriod: '2024-01-01 to 2024-01-31',
    invoiceType: 'Monthly',
    totalAmount: 15000,
    approvalStatus: 'Approved',
    clientPaymentStatus: 'Paid',
    candidatePaymentStatus: 'Pending',
    dueDate: '2024-02-15',
    isOverdue: false,
    createdBy: 'Sarah Manager',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-15',
    attachments: ['timesheet.pdf', 'contract.pdf']
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-002',
    client: 'StartupXYZ',
    vendor: 'DEF Solutions',
    servicePeriod: '2024-01-15 to 2024-02-14',
    invoiceType: 'Project',
    totalAmount: 8500,
    approvalStatus: 'Pending',
    clientPaymentStatus: 'Unpaid',
    candidatePaymentStatus: 'Unpaid',
    dueDate: '2024-01-30',
    isOverdue: true,
    createdBy: 'Mike Supervisor',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-003',
    client: 'Enterprise Ltd.',
    vendor: 'GHI Partners',
    servicePeriod: '2024-02-01 to 2024-02-28',
    invoiceType: 'Weekly',
    totalAmount: 22000,
    approvalStatus: 'Approved',
    clientPaymentStatus: 'Paid',
    candidatePaymentStatus: 'Paid',
    dueDate: '2024-03-15',
    isOverdue: false,
    createdBy: 'Lisa Admin',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-10'
  }
];

export const mockTimesheets: Timesheet[] = [
  {
    id: 1,
    candidateName: 'John Smith',
    weekPeriod: '2024-01-15 to 2024-01-21',
    billableHours: 40,
    nonBillableHours: 0,
    hourlyRate: 75,
    lineAmount: 3000,
    approvalStatus: 'Approved',
    attachments: 2,
    hasOCRData: true,
    submittedBy: 'John Smith',
    submittedAt: '2024-01-22'
  },
  {
    id: 2,
    candidateName: 'Sarah Johnson',
    weekPeriod: '2024-01-15 to 2024-01-21',
    billableHours: 35,
    nonBillableHours: 5,
    hourlyRate: 80,
    lineAmount: 2800,
    approvalStatus: 'Needs Approval',
    attachments: 1,
    hasOCRData: false,
    submittedBy: 'Sarah Johnson',
    submittedAt: '2024-01-22'
  }
];

export const mockPTOEmployees: PTOEmployee[] = [
  {
    id: 1,
    employeeName: 'John Smith',
    startDate: '2023-01-15',
    tenure: '1.2 years',
    ptoEarned: 120,
    ptoTaken: 45,
    balance: 75,
    status: 'within',
    alerts: []
  },
  {
    id: 2,
    employeeName: 'Sarah Johnson',
    startDate: '2022-06-01',
    tenure: '1.8 years',
    ptoEarned: 160,
    ptoTaken: 140,
    balance: 20,
    status: 'nearing',
    alerts: ['Low balance warning']
  },
  {
    id: 3,
    employeeName: 'Mike Davis',
    startDate: '2021-03-10',
    tenure: '3.1 years',
    ptoEarned: 200,
    ptoTaken: 220,
    balance: -20,
    status: 'exceeded',
    alerts: ['Exceeded PTO limit', 'Requires manager approval']
  }
];

export const mockApprovals: ApprovalItem[] = [
  {
    id: 1,
    itemType: 'Invoice',
    candidateClient: 'TechCorp Inc. / John Smith',
    amount: 15000,
    requestedBy: 'Sarah Manager',
    requestDate: '2024-01-15',
    status: 'Pending',
    priority: 'High',
    description: 'Monthly invoice for consulting services',
    comments: [],
    isLocked: false
  },
  {
    id: 2,
    itemType: 'Timesheet',
    candidateClient: 'StartupXYZ / Emily Chen',
    hours: 42,
    requestedBy: 'Mike Supervisor',
    requestDate: '2024-01-14',
    status: 'Pending',
    priority: 'Medium',
    description: 'Weekly timesheet submission',
    comments: [
      { user: 'Mike Supervisor', comment: 'Please review overtime hours', date: '2024-01-14' }
    ],
    isLocked: false
  }
];

export const mockOverdueInvoices: OverdueInvoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-002',
    client: 'StartupXYZ',
    amount: 8500,
    dueDate: '2024-01-30',
    daysOverdue: 15,
    escalationLevel: 'Level 1',
    contact: 'john@startupxyz.com',
    phone: '+1-555-0123'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2023-089',
    client: 'TechSolutions Ltd.',
    amount: 22000,
    dueDate: '2023-12-15',
    daysOverdue: 45,
    escalationLevel: 'Level 3',
    contact: 'billing@techsolutions.com',
    phone: '+1-555-0456'
  }
];

export const mockSystemAlerts: SystemAlert[] = [
  {
    id: 1,
    type: 'Missing Timesheet',
    message: 'John Smith has not submitted timesheet for week ending 2024-01-21',
    severity: 'warning',
    date: '2024-01-22'
  },
  {
    id: 2,
    type: 'PTO Overuse',
    message: 'Mike Davis has exceeded PTO limit by 20 hours',
    severity: 'error',
    date: '2024-01-21'
  },
  {
    id: 3,
    type: 'Overdue Invoice',
    message: 'Invoice INV-2023-089 is 45 days overdue ($22,000)',
    severity: 'error',
    date: '2024-01-20'
  }
];

// API simulation functions
export const accountsService = {
  // Invoices
  getInvoices: async (): Promise<Invoice[]> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    return mockInvoices;
  },

  getInvoiceById: async (id: number): Promise<Invoice | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockInvoices.find(invoice => invoice.id === id) || null;
  },

  // Timesheets
  getTimesheets: async (): Promise<Timesheet[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTimesheets;
  },

  // PTO Management
  getPTOEmployees: async (): Promise<PTOEmployee[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockPTOEmployees;
  },

  // Approvals
  getApprovals: async (): Promise<ApprovalItem[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockApprovals;
  },

  approveItem: async (id: number): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate approval logic
    return true;
  },

  rejectItem: async (id: number, reason: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Simulate rejection logic
    return true;
  },

  // Overdue Dashboard
  getOverdueInvoices: async (): Promise<OverdueInvoice[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockOverdueInvoices;
  },

  getSystemAlerts: async (): Promise<SystemAlert[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSystemAlerts;
  }
};
