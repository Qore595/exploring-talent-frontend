import apiClient from './api';
import {
  Hotlist,
  HotlistCandidate,
  HotlistAnalytics,
  CreateHotlistRequest,
  UpdateHotlistRequest,
  AddCandidatesToHotlistRequest,
  UpdateHotlistCandidateRequest,
  HotlistFilters,
  HotlistCandidateFilters,
  HotlistResponse,
  HotlistsResponse,
  HotlistCandidateResponse,
  HotlistCandidatesResponse,
  HotlistAnalyticsResponse,
  HotlistStats,
  HotlistPerformanceMetrics,
  HotlistDashboardData,
  SubjectToken,
  SubjectTemplate,
  ScheduleConfig,
  CandidatePreviewCard
} from '@/types/hotlists';

// Utility function to simulate API delay for development
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class HotlistService {
  // Hotlists
  async getHotlists(
    filters?: HotlistFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<HotlistsResponse> {
    try {
      const params = {
        page,
        limit,
        ...filters
      };

      const response = await apiClient.get('/hotlists', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching hotlists:', error);
      throw error;
    }
  }

  async getHotlistById(id: string): Promise<HotlistResponse> {
    try {
      const response = await apiClient.get(`/hotlists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotlist:', error);
      throw error;
    }
  }

  async createHotlist(data: CreateHotlistRequest): Promise<HotlistResponse> {
    try {
      const response = await apiClient.post('/hotlists', data);
      return response.data;
    } catch (error) {
      console.error('Error creating hotlist:', error);
      throw error;
    }
  }

  async updateHotlist(data: UpdateHotlistRequest): Promise<HotlistResponse> {
    try {
      const response = await apiClient.put(`/hotlists/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating hotlist:', error);
      throw error;
    }
  }

  async deleteHotlist(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/hotlists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting hotlist:', error);
      throw error;
    }
  }

  // Hotlist Candidates
  async getHotlistCandidates(
    hotlistId: string,
    filters?: HotlistCandidateFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<HotlistCandidatesResponse> {
    try {
      const params = {
        page,
        limit,
        ...filters
      };

      const response = await apiClient.get(`/hotlists/${hotlistId}/candidates`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching hotlist candidates:', error);
      throw error;
    }
  }

  async addCandidatesToHotlist(data: AddCandidatesToHotlistRequest): Promise<{ success: boolean; message: string; added: number }> {
    try {
      const response = await apiClient.post(`/hotlists/${data.hotlistId}/candidates`, data);
      return response.data;
    } catch (error) {
      console.error('Error adding candidates to hotlist:', error);
      throw error;
    }
  }

  async updateHotlistCandidate(data: UpdateHotlistCandidateRequest): Promise<HotlistCandidateResponse> {
    try {
      const response = await apiClient.put(`/hotlist-candidates/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating hotlist candidate:', error);
      throw error;
    }
  }

  async removeCandidateFromHotlist(candidateId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/hotlist-candidates/${candidateId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing candidate from hotlist:', error);
      throw error;
    }
  }

  // Scheduling
  async scheduleHotlist(hotlistId: string, scheduleConfig: ScheduleConfig): Promise<HotlistResponse> {
    try {
      const response = await apiClient.post(`/hotlists/${hotlistId}/schedule`, scheduleConfig);
      return response.data;
    } catch (error) {
      console.error('Error scheduling hotlist:', error);
      throw error;
    }
  }

  async sendHotlistNow(hotlistId: string): Promise<{ success: boolean; message: string; sent: number }> {
    try {
      const response = await apiClient.post(`/hotlists/${hotlistId}/send`);
      return response.data;
    } catch (error) {
      console.error('Error sending hotlist:', error);
      throw error;
    }
  }

  async cancelScheduledHotlist(hotlistId: string): Promise<HotlistResponse> {
    try {
      const response = await apiClient.post(`/hotlists/${hotlistId}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling scheduled hotlist:', error);
      throw error;
    }
  }

  // Analytics
  async getHotlistAnalytics(
    hotlistId?: string,
    dateRange?: { start: string; end: string }
  ): Promise<HotlistAnalyticsResponse> {
    try {
      const params = {
        hotlistId,
        ...dateRange
      };

      const response = await apiClient.get('/hotlists/analytics', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching hotlist analytics:', error);
      throw error;
    }
  }

  async getHotlistPerformanceMetrics(hotlistId: string): Promise<{ success: boolean; data: HotlistPerformanceMetrics }> {
    try {
      const response = await apiClient.get(`/hotlists/${hotlistId}/metrics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching hotlist performance metrics:', error);
      throw error;
    }
  }

  async getHotlistStats(): Promise<{ success: boolean; data: HotlistStats }> {
    try {
      const response = await apiClient.get('/hotlists/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching hotlist stats:', error);
      throw error;
    }
  }

  async getDashboardData(): Promise<{ success: boolean; data: HotlistDashboardData }> {
    try {
      const response = await apiClient.get('/hotlists/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Subject Builder and Templates
  async getSubjectTokens(): Promise<{ success: boolean; data: SubjectToken[] }> {
    try {
      const response = await apiClient.get('/hotlists/subject-tokens');
      return response.data;
    } catch (error) {
      console.error('Error fetching subject tokens:', error);
      throw error;
    }
  }

  async getSubjectTemplates(): Promise<{ success: boolean; data: SubjectTemplate[] }> {
    try {
      const response = await apiClient.get('/hotlists/subject-templates');
      return response.data;
    } catch (error) {
      console.error('Error fetching subject templates:', error);
      throw error;
    }
  }

  async createSubjectTemplate(template: Omit<SubjectTemplate, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<{ success: boolean; data: SubjectTemplate }> {
    try {
      const response = await apiClient.post('/hotlists/subject-templates', template);
      return response.data;
    } catch (error) {
      console.error('Error creating subject template:', error);
      throw error;
    }
  }

  async updateSubjectTemplate(id: string, template: Partial<SubjectTemplate>): Promise<{ success: boolean; data: SubjectTemplate }> {
    try {
      const response = await apiClient.put(`/hotlists/subject-templates/${id}`, template);
      return response.data;
    } catch (error) {
      console.error('Error updating subject template:', error);
      throw error;
    }
  }

  async deleteSubjectTemplate(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/hotlists/subject-templates/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subject template:', error);
      throw error;
    }
  }

  // Candidate Preview and Selection
  async getAvailableCandidates(filters?: any): Promise<{ success: boolean; data: CandidatePreviewCard[] }> {
    try {
      const response = await apiClient.get('/hotlists/available-candidates', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching available candidates:', error);
      throw error;
    }
  }

  async previewCandidateEmail(candidateId: string, templateId: string): Promise<{ success: boolean; data: { subject: string; content: string } }> {
    try {
      const response = await apiClient.post('/hotlists/preview-email', {
        candidateId,
        templateId
      });
      return response.data;
    } catch (error) {
      console.error('Error previewing candidate email:', error);
      throw error;
    }
  }

  // Lock and Unlock
  async lockHotlist(hotlistId: string): Promise<HotlistResponse> {
    try {
      const response = await apiClient.post(`/hotlists/${hotlistId}/lock`);
      return response.data;
    } catch (error) {
      console.error('Error locking hotlist:', error);
      throw error;
    }
  }

  async unlockHotlist(hotlistId: string): Promise<HotlistResponse> {
    try {
      const response = await apiClient.post(`/hotlists/${hotlistId}/unlock`);
      return response.data;
    } catch (error) {
      console.error('Error unlocking hotlist:', error);
      throw error;
    }
  }

  // Export and Import
  async exportHotlist(hotlistId: string, format: 'csv' | 'excel' = 'csv'): Promise<Blob> {
    try {
      const response = await apiClient.get(`/hotlists/${hotlistId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting hotlist:', error);
      throw error;
    }
  }

  async duplicateHotlist(hotlistId: string, newName: string): Promise<HotlistResponse> {
    try {
      const response = await apiClient.post(`/hotlists/${hotlistId}/duplicate`, {
        name: newName
      });
      return response.data;
    } catch (error) {
      console.error('Error duplicating hotlist:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkUpdateCandidateStatus(candidateIds: string[], status: string): Promise<{ success: boolean; message: string; updated: number }> {
    try {
      const response = await apiClient.put('/hotlist-candidates/bulk/status', {
        candidateIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating candidate status:', error);
      throw error;
    }
  }
}

// Create and export service instance
const hotlistService = new HotlistService();
export default hotlistService;
