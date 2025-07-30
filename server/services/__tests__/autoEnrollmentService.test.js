const autoEnrollmentService = require('../autoEnrollmentService');
const { BenchResource } = require('../../models/BenchResource');
const { Assignment } = require('../../models/Assignment');
const { BenchAlert } = require('../../models/BenchAlert');
const { Employee } = require('../../models/Employee');

// Mock the models
jest.mock('../../models/BenchResource');
jest.mock('../../models/Assignment');
jest.mock('../../models/BenchAlert');
jest.mock('../../models/Employee');

// Mock node-cron
jest.mock('node-cron', () => ({
  schedule: jest.fn()
}));

describe('AutoEnrollmentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSettings and updateSettings', () => {
    it('should return default settings', () => {
      const settings = autoEnrollmentService.getSettings();
      
      expect(settings).toEqual({
        enabled: true,
        daysBeforeEndDate: 7,
        alertRoles: ['bench_sales', 'account_manager', 'cio_cto'],
        requireConfirmation: true,
        defaultStatus: 'available',
        emailTemplateId: null
      });
    });

    it('should update settings', () => {
      const newSettings = {
        enabled: false,
        daysBeforeEndDate: 14,
        requireConfirmation: false
      };
      
      const updatedSettings = autoEnrollmentService.updateSettings(newSettings);
      
      expect(updatedSettings.enabled).toBe(false);
      expect(updatedSettings.daysBeforeEndDate).toBe(14);
      expect(updatedSettings.requireConfirmation).toBe(false);
      // Should preserve other settings
      expect(updatedSettings.alertRoles).toEqual(['bench_sales', 'account_manager', 'cio_cto']);
    });
  });

  describe('checkForAutoEnrollment', () => {
    it('should skip when auto-enrollment is disabled', async () => {
      autoEnrollmentService.updateSettings({ enabled: false });
      
      const result = await autoEnrollmentService.checkForAutoEnrollment();
      
      expect(Assignment.findAll).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should find and process ending assignments', async () => {
      autoEnrollmentService.updateSettings({ enabled: true, daysBeforeEndDate: 7 });
      
      const mockAssignments = [
        {
          id: 1,
          employee_id: 123,
          project_name: 'Test Project',
          end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          Employee: {
            id: 123,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john.doe@example.com'
          },
          update: jest.fn().mockResolvedValue(true)
        }
      ];
      
      Assignment.findAll.mockResolvedValue(mockAssignments);
      BenchResource.findOne.mockResolvedValue(null); // No existing bench resource
      BenchAlert.create.mockResolvedValue({ id: 1 });
      
      const result = await autoEnrollmentService.checkForAutoEnrollment();
      
      expect(Assignment.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({
          status: 'active',
          auto_bench_enrollment: true,
          bench_alert_sent: false
        }),
        include: expect.any(Array)
      }));
      
      expect(result).toEqual({
        success: true,
        processed: 1,
        message: 'Processed 1 assignments for auto-enrollment'
      });
    });

    it('should handle errors gracefully', async () => {
      autoEnrollmentService.updateSettings({ enabled: true });
      Assignment.findAll.mockRejectedValue(new Error('Database error'));
      
      await expect(autoEnrollmentService.checkForAutoEnrollment()).rejects.toThrow('Database error');
    });
  });

  describe('processAssignmentForEnrollment', () => {
    const mockAssignment = {
      id: 1,
      employee_id: 123,
      project_name: 'Test Project',
      client_name: 'Test Client',
      role: 'Developer',
      end_date: new Date(),
      rate: 100,
      Employee: {
        id: 123,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com'
      },
      update: jest.fn().mockResolvedValue(true)
    };

    it('should skip if employee already has active bench resource', async () => {
      BenchResource.findOne.mockResolvedValue({ id: 1 }); // Existing resource
      
      await autoEnrollmentService.processAssignmentForEnrollment(mockAssignment);
      
      expect(BenchAlert.create).not.toHaveBeenCalled();
      expect(BenchResource.create).not.toHaveBeenCalled();
    });

    it('should create confirmation alert when requireConfirmation is true', async () => {
      autoEnrollmentService.updateSettings({ requireConfirmation: true });
      BenchResource.findOne.mockResolvedValue(null);
      BenchAlert.create.mockResolvedValue({ id: 1 });
      
      await autoEnrollmentService.processAssignmentForEnrollment(mockAssignment);
      
      expect(BenchAlert.create).toHaveBeenCalledWith(expect.objectContaining({
        employee_id: 123,
        assignment_id: 1,
        alert_type: 'assignment_ending',
        status: 'pending',
        priority: 'medium'
      }));
      
      expect(mockAssignment.update).toHaveBeenCalledWith({
        bench_alert_sent: true,
        bench_alert_sent_at: expect.any(Date)
      });
    });

    it('should auto-enroll directly when requireConfirmation is false', async () => {
      autoEnrollmentService.updateSettings({ requireConfirmation: false });
      BenchResource.findOne.mockResolvedValue(null);
      BenchResource.create.mockResolvedValue({ id: 1 });
      BenchAlert.create.mockResolvedValue({ id: 1 });
      
      await autoEnrollmentService.processAssignmentForEnrollment(mockAssignment);
      
      expect(BenchResource.create).toHaveBeenCalledWith(expect.objectContaining({
        employee_id: 123,
        auto_enrolled: true,
        enrollment_source: 'auto_assignment_end',
        status: 'available'
      }));
    });
  });

  describe('autoEnrollEmployee', () => {
    const mockAssignment = {
      id: 1,
      employee_id: 123,
      project_name: 'Test Project',
      client_name: 'Test Client',
      role: 'Developer',
      end_date: new Date(),
      rate: 100,
      work_type: 'remote',
      Employee: {
        first_name: 'John',
        last_name: 'Doe'
      }
    };

    it('should create bench resource with correct data', async () => {
      BenchResource.create.mockResolvedValue({ id: 1 });
      BenchAlert.create.mockResolvedValue({ id: 1 });
      
      const result = await autoEnrollmentService.autoEnrollEmployee(mockAssignment);
      
      expect(BenchResource.create).toHaveBeenCalledWith(expect.objectContaining({
        employee_id: 123,
        skills_summary: 'Previous role: Developer at Test Client',
        preferred_roles: ['Developer'],
        location_flexibility: 'remote',
        last_rate: 100,
        desired_rate: 110, // 10% increase
        auto_enrolled: true,
        enrollment_source: 'auto_assignment_end'
      }));
      
      expect(result).toEqual({ id: 1 });
    });

    it('should create notification alert after enrollment', async () => {
      BenchResource.create.mockResolvedValue({ id: 1 });
      BenchAlert.create.mockResolvedValue({ id: 1 });
      
      await autoEnrollmentService.autoEnrollEmployee(mockAssignment);
      
      expect(BenchAlert.create).toHaveBeenCalledWith(expect.objectContaining({
        employee_id: 123,
        assignment_id: 1,
        alert_type: 'manual_addition',
        status: 'pending',
        priority: 'low',
        metadata: expect.objectContaining({
          bench_resource_id: 1,
          auto_enrolled: true
        })
      }));
    });
  });

  describe('confirmEnrollment', () => {
    const mockAlert = {
      id: 1,
      employee_id: 123,
      status: 'pending',
      Assignment: {
        id: 1,
        role: 'Developer',
        project_name: 'Test Project',
        end_date: new Date(),
        rate: 100,
        work_type: 'remote'
      },
      Employee: {
        id: 123,
        first_name: 'John',
        last_name: 'Doe'
      },
      update: jest.fn().mockResolvedValue(true)
    };

    it('should create bench resource and update alert', async () => {
      BenchAlert.findByPk.mockResolvedValue(mockAlert);
      BenchResource.create.mockResolvedValue({ id: 1 });
      
      const result = await autoEnrollmentService.confirmEnrollment(1, 456, {
        skills_summary: 'Custom skills',
        desired_rate: 120
      });
      
      expect(BenchResource.create).toHaveBeenCalledWith(expect.objectContaining({
        employee_id: 123,
        skills_summary: 'Custom skills',
        desired_rate: 120,
        created_by: 456
      }));
      
      expect(mockAlert.update).toHaveBeenCalledWith({
        status: 'acknowledged',
        acknowledged_at: expect.any(Date),
        acknowledged_by: 456
      });
      
      expect(result).toEqual({ id: 1 });
    });

    it('should throw error if alert not found', async () => {
      BenchAlert.findByPk.mockResolvedValue(null);
      
      await expect(autoEnrollmentService.confirmEnrollment(1, 456)).rejects.toThrow('Alert not found');
    });

    it('should throw error if alert already processed', async () => {
      const processedAlert = { ...mockAlert, status: 'acknowledged' };
      BenchAlert.findByPk.mockResolvedValue(processedAlert);
      
      await expect(autoEnrollmentService.confirmEnrollment(1, 456)).rejects.toThrow('Alert has already been processed');
    });
  });

  describe('dismissEnrollment', () => {
    const mockAlert = {
      id: 1,
      status: 'pending',
      metadata: { existing: 'data' },
      update: jest.fn().mockResolvedValue(true)
    };

    it('should update alert status to dismissed', async () => {
      BenchAlert.findByPk.mockResolvedValue(mockAlert);
      
      const result = await autoEnrollmentService.dismissEnrollment(1, 456, 'Not needed');
      
      expect(mockAlert.update).toHaveBeenCalledWith({
        status: 'dismissed',
        acknowledged_at: expect.any(Date),
        acknowledged_by: 456,
        metadata: {
          existing: 'data',
          dismissal_reason: 'Not needed'
        }
      });
      
      expect(result).toBe(mockAlert);
    });

    it('should throw error if alert not found', async () => {
      BenchAlert.findByPk.mockResolvedValue(null);
      
      await expect(autoEnrollmentService.dismissEnrollment(1, 456)).rejects.toThrow('Alert not found');
    });
  });

  describe('getPendingAlerts', () => {
    it('should fetch pending alerts with pagination', async () => {
      const mockAlerts = [
        { id: 1, alert_type: 'assignment_ending' },
        { id: 2, alert_type: 'assignment_ending' }
      ];
      
      BenchAlert.findAndCountAll.mockResolvedValue({
        count: 2,
        rows: mockAlerts
      });
      
      const result = await autoEnrollmentService.getPendingAlerts(1, 10);
      
      expect(BenchAlert.findAndCountAll).toHaveBeenCalledWith(expect.objectContaining({
        where: {
          alert_type: 'assignment_ending',
          status: 'pending',
          is_active: true
        },
        limit: 10,
        offset: 0
      }));
      
      expect(result).toEqual({
        success: true,
        data: mockAlerts,
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1
      });
    });
  });

  describe('triggerManualEnrollment', () => {
    it('should call checkForAutoEnrollment', async () => {
      const mockResult = { success: true, processed: 5 };
      
      // Mock the checkForAutoEnrollment method
      const originalMethod = autoEnrollmentService.checkForAutoEnrollment;
      autoEnrollmentService.checkForAutoEnrollment = jest.fn().mockResolvedValue(mockResult);
      
      const result = await autoEnrollmentService.triggerManualEnrollment();
      
      expect(autoEnrollmentService.checkForAutoEnrollment).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
      
      // Restore original method
      autoEnrollmentService.checkForAutoEnrollment = originalMethod;
    });
  });
});
