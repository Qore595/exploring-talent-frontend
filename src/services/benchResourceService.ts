import apiClient from './api';
import {
  BenchResource,
  Assignment,
  BenchAlert,
  CreateBenchResourceRequest,
  UpdateBenchResourceRequest,
  CreateAssignmentRequest,
  UpdateAssignmentRequest,
  BenchResourceFilters,
  AssignmentFilters,
  BenchResourceResponse,
  BenchResourcesResponse,
  AssignmentResponse,
  AssignmentsResponse,
  BenchAlertResponse,
  BenchAlertsResponse,
  BenchResourceStats,
  BenchResourceDashboardData,
  AutoEnrollmentSettings
} from '@/types/benchResources';

// Utility function to simulate API delay for development
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class BenchResourceService {
  // Bench Resources
  async getBenchResources(
    filters?: BenchResourceFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<BenchResourcesResponse> {
    try {
      const params = {
        page,
        limit,
        ...filters
      };

      const response = await apiClient.get('/bench-resources', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching bench resources:', error);
      throw error;
    }
  }

  async getBenchResourceById(id: string): Promise<BenchResourceResponse> {
    try {
      const response = await apiClient.get(`/bench-resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bench resource:', error);
      throw error;
    }
  }

  async createBenchResource(data: CreateBenchResourceRequest): Promise<BenchResourceResponse> {
    try {
      const response = await apiClient.post('/bench-resources', data);
      return response.data;
    } catch (error) {
      console.error('Error creating bench resource:', error);
      throw error;
    }
  }

  async updateBenchResource(data: UpdateBenchResourceRequest): Promise<BenchResourceResponse> {
    try {
      const response = await apiClient.put(`/bench-resources/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating bench resource:', error);
      throw error;
    }
  }

  async deleteBenchResource(id: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiClient.delete(`/bench-resources/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting bench resource:', error);
      throw error;
    }
  }

  async getBenchResourceStats(): Promise<{ success: boolean; data: BenchResourceStats }> {
    try {
      const response = await apiClient.get('/bench-resources/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching bench resource stats:', error);
      throw error;
    }
  }

  // Assignments
  async getAssignments(
    filters?: AssignmentFilters,
    page: number = 1,
    limit: number = 10
  ): Promise<AssignmentsResponse> {
    try {
      const params = {
        page,
        limit,
        ...filters
      };

      const response = await apiClient.get('/assignments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  }

  async getAssignmentById(id: string): Promise<AssignmentResponse> {
    try {
      const response = await apiClient.get(`/assignments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching assignment:', error);
      throw error;
    }
  }

  async createAssignment(data: CreateAssignmentRequest): Promise<AssignmentResponse> {
    try {
      const response = await apiClient.post('/assignments', data);
      return response.data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  }

  async updateAssignment(data: UpdateAssignmentRequest): Promise<AssignmentResponse> {
    try {
      const response = await apiClient.put(`/assignments/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  }

  // Bench Alerts
  async getBenchAlerts(
    page: number = 1,
    limit: number = 10
  ): Promise<BenchAlertsResponse> {
    try {
      const params = { page, limit };
      const response = await apiClient.get('/bench-alerts', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching bench alerts:', error);
      throw error;
    }
  }

  async acknowledgeBenchAlert(id: string): Promise<BenchAlertResponse> {
    try {
      const response = await apiClient.put(`/bench-alerts/${id}/acknowledge`);
      return response.data;
    } catch (error) {
      console.error('Error acknowledging bench alert:', error);
      throw error;
    }
  }

  async dismissBenchAlert(id: string): Promise<BenchAlertResponse> {
    try {
      const response = await apiClient.put(`/bench-alerts/${id}/dismiss`);
      return response.data;
    } catch (error) {
      console.error('Error dismissing bench alert:', error);
      throw error;
    }
  }

  // Auto-Enrollment
  async getAutoEnrollmentSettings(): Promise<{ success: boolean; data: AutoEnrollmentSettings }> {
    try {
      const response = await apiClient.get('/bench-resources/auto-enrollment/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching auto-enrollment settings:', error);
      throw error;
    }
  }

  async updateAutoEnrollmentSettings(settings: AutoEnrollmentSettings): Promise<{ success: boolean; data: AutoEnrollmentSettings }> {
    try {
      const response = await apiClient.put('/bench-resources/auto-enrollment/settings', settings);
      return response.data;
    } catch (error) {
      console.error('Error updating auto-enrollment settings:', error);
      throw error;
    }
  }

  async triggerAutoEnrollment(): Promise<{ success: boolean; message: string; enrolled: number }> {
    try {
      const response = await apiClient.post('/bench-resources/auto-enrollment/trigger');
      return response.data;
    } catch (error) {
      console.error('Error triggering auto-enrollment:', error);
      throw error;
    }
  }

  // Dashboard Data
  async getDashboardData(): Promise<{ success: boolean; data: BenchResourceDashboardData }> {
    try {
      const response = await apiClient.get('/bench-resources/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  // Bulk Operations
  async bulkUpdateStatus(resourceIds: string[], status: string): Promise<{ success: boolean; message: string; updated: number }> {
    try {
      const response = await apiClient.put('/bench-resources/bulk/status', {
        resourceIds,
        status
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating status:', error);
      throw error;
    }
  }

  async exportBenchResources(filters?: BenchResourceFilters): Promise<Blob> {
    try {
      const response = await apiClient.get('/bench-resources/export', {
        params: filters,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting bench resources:', error);
      throw error;
    }
  }

  // Search and Suggestions
  async searchSkills(query: string): Promise<{ success: boolean; data: string[] }> {
    try {
      const response = await apiClient.get('/bench-resources/search/skills', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching skills:', error);
      throw error;
    }
  }

  async searchRoles(query: string): Promise<{ success: boolean; data: string[] }> {
    try {
      const response = await apiClient.get('/bench-resources/search/roles', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching roles:', error);
      throw error;
    }
  }

  // Status Pipeline Operations
  async moveToNextStatus(resourceId: string): Promise<BenchResourceResponse> {
    try {
      const response = await apiClient.put(`/bench-resources/${resourceId}/move-next`);
      return response.data;
    } catch (error) {
      console.error('Error moving resource to next status:', error);
      throw error;
    }
  }

  async moveToPreviousStatus(resourceId: string): Promise<BenchResourceResponse> {
    try {
      const response = await apiClient.put(`/bench-resources/${resourceId}/move-previous`);
      return response.data;
    } catch (error) {
      console.error('Error moving resource to previous status:', error);
      throw error;
    }
  }

  async updateStatusWithNotes(resourceId: string, status: string, notes: string): Promise<BenchResourceResponse> {
    try {
      const response = await apiClient.put(`/bench-resources/${resourceId}/status`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error('Error updating resource status:', error);
      throw error;
    }
  }
}

// Create and export service instance
const benchResourceService = new BenchResourceService();
export default benchResourceService;
