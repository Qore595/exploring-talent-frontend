import benchResourceService from '../benchResourceService';
import apiClient from '../api';
import { CreateBenchResourceRequest, UpdateBenchResourceRequest, BenchResourceFilters } from '@/types/benchResources';

// Mock the API client
jest.mock('../api');
const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('BenchResourceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getBenchResources', () => {
    it('should fetch bench resources with default parameters', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: [],
          total: 0,
          page: 1,
          limit: 10
        }
      };
      
      mockedApiClient.get.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.getBenchResources();
      
      expect(mockedApiClient.get).toHaveBeenCalledWith('/bench-resources', {
        params: { page: 1, limit: 10 }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch bench resources with filters', async () => {
      const filters: BenchResourceFilters = {
        status: ['available', 'in_hotlist'],
        locationFlexibility: ['remote'],
        skills: ['React', 'Node.js']
      };
      
      const mockResponse = {
        data: {
          success: true,
          data: [],
          total: 0,
          page: 1,
          limit: 20
        }
      };
      
      mockedApiClient.get.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.getBenchResources(filters, 1, 20);
      
      expect(mockedApiClient.get).toHaveBeenCalledWith('/bench-resources', {
        params: { page: 1, limit: 20, ...filters }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle API errors', async () => {
      const error = new Error('API Error');
      mockedApiClient.get.mockRejectedValue(error);
      
      await expect(benchResourceService.getBenchResources()).rejects.toThrow('API Error');
    });
  });

  describe('getBenchResourceById', () => {
    it('should fetch a specific bench resource', async () => {
      const resourceId = '123';
      const mockResponse = {
        data: {
          success: true,
          data: { id: resourceId, employeeId: '456' }
        }
      };
      
      mockedApiClient.get.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.getBenchResourceById(resourceId);
      
      expect(mockedApiClient.get).toHaveBeenCalledWith(`/bench-resources/${resourceId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('createBenchResource', () => {
    it('should create a new bench resource', async () => {
      const createData: CreateBenchResourceRequest = {
        employeeId: '123',
        skillsSummary: 'React, Node.js',
        preferredRoles: ['Full Stack Developer'],
        locationFlexibility: 'remote',
        availabilityDate: '2024-02-15',
        lastRate: 85,
        desiredRate: 95
      };
      
      const mockResponse = {
        data: {
          success: true,
          data: { id: '456', ...createData },
          message: 'Bench resource created successfully'
        }
      };
      
      mockedApiClient.post.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.createBenchResource(createData);
      
      expect(mockedApiClient.post).toHaveBeenCalledWith('/bench-resources', createData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('updateBenchResource', () => {
    it('should update an existing bench resource', async () => {
      const updateData: UpdateBenchResourceRequest = {
        id: '123',
        skillsSummary: 'React, Node.js, TypeScript',
        status: 'in_hotlist'
      };
      
      const mockResponse = {
        data: {
          success: true,
          data: { ...updateData },
          message: 'Bench resource updated successfully'
        }
      };
      
      mockedApiClient.put.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.updateBenchResource(updateData);
      
      expect(mockedApiClient.put).toHaveBeenCalledWith(`/bench-resources/${updateData.id}`, updateData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('deleteBenchResource', () => {
    it('should delete a bench resource', async () => {
      const resourceId = '123';
      const mockResponse = {
        data: {
          success: true,
          message: 'Bench resource deleted successfully'
        }
      };
      
      mockedApiClient.delete.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.deleteBenchResource(resourceId);
      
      expect(mockedApiClient.delete).toHaveBeenCalledWith(`/bench-resources/${resourceId}`);
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getBenchResourceStats', () => {
    it('should fetch bench resource statistics', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            totalAvailable: 50,
            available: 30,
            in_hotlist: 10,
            submitted: 5,
            interviewing: 3,
            offered: 1,
            deployed: 1,
            autoEnrolled: 25,
            manuallyAdded: 25
          }
        }
      };
      
      mockedApiClient.get.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.getBenchResourceStats();
      
      expect(mockedApiClient.get).toHaveBeenCalledWith('/bench-resources/stats');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('auto-enrollment methods', () => {
    it('should get auto-enrollment settings', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            enabled: true,
            daysBeforeEndDate: 7,
            alertRoles: ['bench_sales', 'account_manager'],
            requireConfirmation: true,
            defaultStatus: 'available'
          }
        }
      };
      
      mockedApiClient.get.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.getAutoEnrollmentSettings();
      
      expect(mockedApiClient.get).toHaveBeenCalledWith('/bench-resources/auto-enrollment/settings');
      expect(result).toEqual(mockResponse.data);
    });

    it('should update auto-enrollment settings', async () => {
      const settings = {
        enabled: false,
        daysBeforeEndDate: 14,
        alertRoles: ['bench_sales'],
        requireConfirmation: false,
        defaultStatus: 'available' as const
      };
      
      const mockResponse = {
        data: {
          success: true,
          data: settings
        }
      };
      
      mockedApiClient.put.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.updateAutoEnrollmentSettings(settings);
      
      expect(mockedApiClient.put).toHaveBeenCalledWith('/bench-resources/auto-enrollment/settings', settings);
      expect(result).toEqual(mockResponse.data);
    });

    it('should trigger auto-enrollment', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Auto-enrollment triggered successfully',
          enrolled: 5
        }
      };
      
      mockedApiClient.post.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.triggerAutoEnrollment();
      
      expect(mockedApiClient.post).toHaveBeenCalledWith('/bench-resources/auto-enrollment/trigger');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('bulk operations', () => {
    it('should bulk update status', async () => {
      const resourceIds = ['1', '2', '3'];
      const status = 'in_hotlist';
      
      const mockResponse = {
        data: {
          success: true,
          message: 'Status updated successfully',
          updated: 3
        }
      };
      
      mockedApiClient.put.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.bulkUpdateStatus(resourceIds, status);
      
      expect(mockedApiClient.put).toHaveBeenCalledWith('/bench-resources/bulk/status', {
        resourceIds,
        status
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should export bench resources', async () => {
      const filters: BenchResourceFilters = { status: ['available'] };
      const mockBlob = new Blob(['csv data'], { type: 'text/csv' });
      
      const mockResponse = {
        data: mockBlob
      };
      
      mockedApiClient.get.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.exportBenchResources(filters);
      
      expect(mockedApiClient.get).toHaveBeenCalledWith('/bench-resources/export', {
        params: filters,
        responseType: 'blob'
      });
      expect(result).toEqual(mockBlob);
    });
  });

  describe('search methods', () => {
    it('should search skills', async () => {
      const query = 'React';
      const mockResponse = {
        data: {
          success: true,
          data: ['React', 'React Native', 'React Router']
        }
      };
      
      mockedApiClient.get.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.searchSkills(query);
      
      expect(mockedApiClient.get).toHaveBeenCalledWith('/bench-resources/search/skills', {
        params: { q: query }
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should search roles', async () => {
      const query = 'Developer';
      const mockResponse = {
        data: {
          success: true,
          data: ['Full Stack Developer', 'Frontend Developer', 'Backend Developer']
        }
      };
      
      mockedApiClient.get.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.searchRoles(query);
      
      expect(mockedApiClient.get).toHaveBeenCalledWith('/bench-resources/search/roles', {
        params: { q: query }
      });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('status pipeline operations', () => {
    it('should move resource to next status', async () => {
      const resourceId = '123';
      const mockResponse = {
        data: {
          success: true,
          data: { id: resourceId, status: 'in_hotlist' }
        }
      };
      
      mockedApiClient.put.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.moveToNextStatus(resourceId);
      
      expect(mockedApiClient.put).toHaveBeenCalledWith(`/bench-resources/${resourceId}/move-next`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should update status with notes', async () => {
      const resourceId = '123';
      const status = 'interviewing';
      const notes = 'Interview scheduled for next week';
      
      const mockResponse = {
        data: {
          success: true,
          data: { id: resourceId, status, notes }
        }
      };
      
      mockedApiClient.put.mockResolvedValue(mockResponse);
      
      const result = await benchResourceService.updateStatusWithNotes(resourceId, status, notes);
      
      expect(mockedApiClient.put).toHaveBeenCalledWith(`/bench-resources/${resourceId}/status`, {
        status,
        notes
      });
      expect(result).toEqual(mockResponse.data);
    });
  });
});
