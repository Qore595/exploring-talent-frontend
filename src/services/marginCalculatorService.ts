import { api } from './api';
import {
  MarginCalculationInput,
  MarginCalculationResult,
  ApprovalRequest,
  AuditLogEntry,
} from '@/types/marginCalculator';

// Mock data for development - replace with actual API calls
const mockApprovalRequests: ApprovalRequest[] = [
  {
    id: '1',
    type: 'commission-override',
    candidateName: 'John Doe',
    position: 'Senior Developer',
    requestedBy: 'Alice Johnson',
    reason: 'Internal referral - employee requested commission override',
    originalValue: 0,
    requestedValue: 500,
    clientBudget: 120,
    submittedDate: '2024-01-15',
    priority: 'high',
    status: 'pending',
  },
  {
    id: '2',
    type: 'vendor-commission-change',
    candidateName: 'Jane Smith',
    position: 'Project Manager',
    requestedBy: 'Bob Wilson',
    reason: 'Client negotiated lower vendor commission rate',
    originalValue: 3,
    requestedValue: 2.5,
    clientBudget: 110,
    submittedDate: '2024-01-14',
    priority: 'medium',
    status: 'pending',
  },
];

const mockAuditLog: AuditLogEntry[] = [
  {
    id: '1',
    action: 'Commission Override Approved',
    user: 'Admin User',
    candidateName: 'John Doe',
    details: 'Internal referral commission override: $0 → $300',
    timestamp: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    action: 'Vendor Commission Changed',
    user: 'Branch Manager',
    candidateName: 'Jane Smith',
    details: 'Vendor commission rate: 3% → 2.5%',
    timestamp: '2024-01-14 14:15:00',
  },
];

export interface MarginCalculationSaveRequest {
  input: MarginCalculationInput;
  result: MarginCalculationResult;
  candidateName: string;
  position: string;
  notes?: string;
}

export interface ApprovalRequestCreate {
  type: ApprovalRequest['type'];
  candidateName: string;
  position: string;
  reason: string;
  originalValue: number;
  requestedValue: number;
  clientBudget: number;
  priority: ApprovalRequest['priority'];
  metadata?: Record<string, any>;
}

export interface ApprovalAction {
  requestId: string;
  action: 'approve' | 'reject';
  comments?: string;
}

class MarginCalculatorService {
  // Save a margin calculation
  async saveCalculation(request: MarginCalculationSaveRequest): Promise<{ id: string }> {
    try {
      // In a real implementation, this would make an API call
      // const response = await api.post('/margin-calculations', request);
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: `calc_${Date.now()}` });
        }, 500);
      });
    } catch (error) {
      console.error('Error saving calculation:', error);
      throw new Error('Failed to save calculation');
    }
  }

  // Get saved calculations
  async getCalculations(filters?: {
    dateFrom?: string;
    dateTo?: string;
    engagementType?: string;
    status?: string;
  }): Promise<any[]> {
    try {
      // In a real implementation, this would make an API call
      // const response = await api.get('/margin-calculations', { params: filters });
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              candidateName: 'John Doe',
              position: 'Senior Developer',
              sourceType: 'Internal Recruiter Sourced',
              engagementType: 'W2 Hourly',
              clientRate: 120,
              vendorFee: 3.6,
              availableMargin: 116.4,
              candidateCost: 85,
              netMargin: 31.4,
              recruiterCommission: 300,
              placementDate: '2024-01-15',
              status: 'Active',
            },
            {
              id: '2',
              candidateName: 'Jane Smith',
              position: 'Project Manager',
              sourceType: 'External Referral',
              engagementType: 'W2 Salary',
              clientRate: 110,
              vendorFee: 3.3,
              availableMargin: 106.7,
              candidateCost: 75,
              netMargin: 31.7,
              recruiterCommission: 0,
              placementDate: '2024-01-14',
              status: 'Active',
            },
          ]);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching calculations:', error);
      throw new Error('Failed to fetch calculations');
    }
  }

  // Create approval request
  async createApprovalRequest(request: ApprovalRequestCreate): Promise<ApprovalRequest> {
    try {
      // In a real implementation, this would make an API call
      // const response = await api.post('/approval-requests', request);
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          const newRequest: ApprovalRequest = {
            id: `req_${Date.now()}`,
            ...request,
            requestedBy: 'Current User', // Would come from auth context
            submittedDate: new Date().toISOString().split('T')[0],
            status: 'pending',
          };
          mockApprovalRequests.push(newRequest);
          resolve(newRequest);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating approval request:', error);
      throw new Error('Failed to create approval request');
    }
  }

  // Get pending approval requests
  async getPendingApprovals(): Promise<ApprovalRequest[]> {
    try {
      // In a real implementation, this would make an API call
      // const response = await api.get('/approval-requests?status=pending');
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(mockApprovalRequests.filter(req => req.status === 'pending'));
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      throw new Error('Failed to fetch pending approvals');
    }
  }

  // Get all approval requests
  async getApprovalRequests(filters?: {
    status?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApprovalRequest[]> {
    try {
      // In a real implementation, this would make an API call
      // const response = await api.get('/approval-requests', { params: filters });
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...mockApprovalRequests];
          
          if (filters?.status) {
            filtered = filtered.filter(req => req.status === filters.status);
          }
          
          if (filters?.type) {
            filtered = filtered.filter(req => req.type === filters.type);
          }
          
          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching approval requests:', error);
      throw new Error('Failed to fetch approval requests');
    }
  }

  // Process approval action
  async processApproval(action: ApprovalAction): Promise<ApprovalRequest> {
    try {
      // In a real implementation, this would make an API call
      // const response = await api.post(`/approval-requests/${action.requestId}/process`, action);
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const requestIndex = mockApprovalRequests.findIndex(req => req.id === action.requestId);
          
          if (requestIndex === -1) {
            reject(new Error('Approval request not found'));
            return;
          }
          
          const request = mockApprovalRequests[requestIndex];
          request.status = action.action === 'approve' ? 'approved' : 'rejected';
          request.approvedBy = 'Current User'; // Would come from auth context
          request.approvedDate = new Date().toISOString().split('T')[0];
          request.comments = action.comments;
          
          // Add to audit log
          const auditEntry: AuditLogEntry = {
            id: `audit_${Date.now()}`,
            action: `${request.type} ${action.action}d`,
            user: 'Current User',
            candidateName: request.candidateName,
            details: `${request.type}: ${request.originalValue} → ${request.requestedValue}. ${action.comments || ''}`,
            timestamp: new Date().toISOString(),
          };
          mockAuditLog.unshift(auditEntry);
          
          resolve(request);
        }, 500);
      });
    } catch (error) {
      console.error('Error processing approval:', error);
      throw new Error('Failed to process approval');
    }
  }

  // Get audit log
  async getAuditLog(filters?: {
    dateFrom?: string;
    dateTo?: string;
    user?: string;
    action?: string;
  }): Promise<AuditLogEntry[]> {
    try {
      // In a real implementation, this would make an API call
      // const response = await api.get('/audit-log', { params: filters });
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          let filtered = [...mockAuditLog];
          
          if (filters?.user) {
            filtered = filtered.filter(entry => entry.user.toLowerCase().includes(filters.user!.toLowerCase()));
          }
          
          if (filters?.action) {
            filtered = filtered.filter(entry => entry.action.toLowerCase().includes(filters.action!.toLowerCase()));
          }
          
          resolve(filtered);
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching audit log:', error);
      throw new Error('Failed to fetch audit log');
    }
  }

  // Get calculation statistics
  async getStatistics(filters?: {
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{
    totalCalculations: number;
    averageNetMargin: number;
    pendingApprovals: number;
    approvedToday: number;
    averageResponseTime: string;
  }> {
    try {
      // In a real implementation, this would make an API call
      // const response = await api.get('/margin-calculations/statistics', { params: filters });
      // return response.data;
      
      // Mock implementation
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            totalCalculations: 247,
            averageNetMargin: 23.45,
            pendingApprovals: mockApprovalRequests.filter(req => req.status === 'pending').length,
            approvedToday: 15,
            averageResponseTime: '2.3h',
          });
        }, 300);
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw new Error('Failed to fetch statistics');
    }
  }
}

export const marginCalculatorService = new MarginCalculatorService();
