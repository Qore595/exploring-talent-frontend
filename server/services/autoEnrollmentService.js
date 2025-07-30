const { BenchResource } = require('../models/BenchResource');
const { Assignment } = require('../models/Assignment');
const { BenchAlert } = require('../models/BenchAlert');
const { Employee } = require('../models/Employee');
const { User } = require('../models/User');
const { Op } = require('sequelize');
const cron = require('node-cron');

class AutoEnrollmentService {
  constructor() {
    this.settings = {
      enabled: true,
      daysBeforeEndDate: 7,
      alertRoles: ['bench_sales', 'account_manager', 'cio_cto'],
      requireConfirmation: true,
      defaultStatus: 'available',
      emailTemplateId: null
    };
    
    // Schedule the auto-enrollment check to run daily at 9 AM
    this.scheduleAutoEnrollmentCheck();
  }

  // Get current auto-enrollment settings
  getSettings() {
    return this.settings;
  }

  // Update auto-enrollment settings
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    return this.settings;
  }

  // Schedule the auto-enrollment check
  scheduleAutoEnrollmentCheck() {
    // Run daily at 9:00 AM
    cron.schedule('0 9 * * *', () => {
      console.log('Running auto-enrollment check...');
      this.checkForAutoEnrollment();
    });
  }

  // Main auto-enrollment check function
  async checkForAutoEnrollment() {
    try {
      if (!this.settings.enabled) {
        console.log('Auto-enrollment is disabled');
        return;
      }

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() + this.settings.daysBeforeEndDate);

      // Find assignments ending within the specified timeframe
      const endingAssignments = await Assignment.findAll({
        where: {
          status: 'active',
          [Op.or]: [
            {
              confirmed_end_date: {
                [Op.lte]: cutoffDate,
                [Op.gte]: new Date()
              }
            },
            {
              end_date: {
                [Op.lte]: cutoffDate,
                [Op.gte]: new Date()
              },
              confirmed_end_date: null
            }
          ],
          auto_bench_enrollment: true,
          bench_alert_sent: false
        },
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'first_name', 'last_name', 'email']
          }
        ]
      });

      console.log(`Found ${endingAssignments.length} assignments ending soon`);

      for (const assignment of endingAssignments) {
        await this.processAssignmentForEnrollment(assignment);
      }

      return {
        success: true,
        processed: endingAssignments.length,
        message: `Processed ${endingAssignments.length} assignments for auto-enrollment`
      };
    } catch (error) {
      console.error('Error in auto-enrollment check:', error);
      throw error;
    }
  }

  // Process individual assignment for enrollment
  async processAssignmentForEnrollment(assignment) {
    try {
      const employeeId = assignment.employee_id;
      
      // Check if employee already has an active bench resource
      const existingBenchResource = await BenchResource.findOne({
        where: {
          employee_id: employeeId,
          is_active: true
        }
      });

      if (existingBenchResource) {
        console.log(`Employee ${employeeId} already has an active bench resource`);
        return;
      }

      if (this.settings.requireConfirmation) {
        // Create alert for confirmation
        await this.createConfirmationAlert(assignment);
      } else {
        // Auto-enroll directly
        await this.autoEnrollEmployee(assignment);
      }

      // Mark alert as sent for this assignment
      await assignment.update({
        bench_alert_sent: true,
        bench_alert_sent_at: new Date()
      });

    } catch (error) {
      console.error(`Error processing assignment ${assignment.id}:`, error);
      throw error;
    }
  }

  // Create confirmation alert
  async createConfirmationAlert(assignment) {
    try {
      const endDate = assignment.confirmed_end_date || assignment.end_date;
      const alertMessage = `Assignment "${assignment.project_name}" for ${assignment.Employee.first_name} ${assignment.Employee.last_name} is ending on ${endDate}. Please confirm if this employee should be added to the bench resources.`;

      await BenchAlert.create({
        employee_id: assignment.employee_id,
        assignment_id: assignment.id,
        alert_type: 'assignment_ending',
        alert_message: alertMessage,
        recipient_roles: this.settings.alertRoles,
        status: 'pending',
        priority: 'medium',
        metadata: {
          assignment_details: {
            project_name: assignment.project_name,
            client_name: assignment.client_name,
            role: assignment.role,
            end_date: endDate,
            rate: assignment.rate
          }
        },
        created_by: 1 // System user
      });

      console.log(`Created confirmation alert for employee ${assignment.employee_id}`);
    } catch (error) {
      console.error('Error creating confirmation alert:', error);
      throw error;
    }
  }

  // Auto-enroll employee directly
  async autoEnrollEmployee(assignment) {
    try {
      const endDate = assignment.confirmed_end_date || assignment.end_date;
      const availabilityDate = new Date(endDate);
      availabilityDate.setDate(availabilityDate.getDate() + 1); // Available day after assignment ends

      const benchResource = await BenchResource.create({
        employee_id: assignment.employee_id,
        skills_summary: `Previous role: ${assignment.role} at ${assignment.client_name || assignment.project_name}`,
        preferred_roles: [assignment.role],
        location_flexibility: assignment.work_type,
        availability_date: availabilityDate,
        last_rate: assignment.rate,
        desired_rate: assignment.rate ? assignment.rate * 1.1 : null, // 10% increase
        status: this.settings.defaultStatus,
        auto_enrolled: true,
        enrollment_source: 'auto_assignment_end',
        notes: `Auto-enrolled from assignment: ${assignment.project_name}`,
        created_by: 1, // System user
        updated_by: 1
      });

      // Create notification alert
      const alertMessage = `${assignment.Employee.first_name} ${assignment.Employee.last_name} has been automatically added to bench resources. Assignment "${assignment.project_name}" ended on ${endDate}.`;

      await BenchAlert.create({
        employee_id: assignment.employee_id,
        assignment_id: assignment.id,
        alert_type: 'manual_addition',
        alert_message: alertMessage,
        recipient_roles: this.settings.alertRoles,
        status: 'pending',
        priority: 'low',
        metadata: {
          bench_resource_id: benchResource.id,
          auto_enrolled: true
        },
        created_by: 1
      });

      console.log(`Auto-enrolled employee ${assignment.employee_id} to bench resources`);
      return benchResource;
    } catch (error) {
      console.error('Error auto-enrolling employee:', error);
      throw error;
    }
  }

  // Manual trigger for auto-enrollment (for testing or manual runs)
  async triggerManualEnrollment() {
    try {
      const result = await this.checkForAutoEnrollment();
      return result;
    } catch (error) {
      console.error('Error in manual enrollment trigger:', error);
      throw error;
    }
  }

  // Confirm enrollment from alert
  async confirmEnrollment(alertId, userId, additionalData = {}) {
    try {
      const alert = await BenchAlert.findByPk(alertId, {
        include: [
          {
            model: Assignment,
            as: 'Assignment'
          },
          {
            model: Employee,
            as: 'Employee'
          }
        ]
      });

      if (!alert) {
        throw new Error('Alert not found');
      }

      if (alert.status !== 'pending') {
        throw new Error('Alert has already been processed');
      }

      // Create bench resource
      const assignment = alert.Assignment;
      const endDate = assignment.confirmed_end_date || assignment.end_date;
      const availabilityDate = new Date(endDate);
      availabilityDate.setDate(availabilityDate.getDate() + 1);

      const benchResource = await BenchResource.create({
        employee_id: alert.employee_id,
        skills_summary: additionalData.skills_summary || `Previous role: ${assignment.role} at ${assignment.client_name || assignment.project_name}`,
        preferred_roles: additionalData.preferred_roles || [assignment.role],
        location_flexibility: additionalData.location_flexibility || assignment.work_type,
        availability_date: additionalData.availability_date || availabilityDate,
        last_rate: additionalData.last_rate || assignment.rate,
        desired_rate: additionalData.desired_rate || (assignment.rate ? assignment.rate * 1.1 : null),
        work_authorization: additionalData.work_authorization,
        status: this.settings.defaultStatus,
        auto_enrolled: true,
        enrollment_source: 'auto_assignment_end',
        notes: additionalData.notes || `Confirmed enrollment from assignment: ${assignment.project_name}`,
        created_by: userId,
        updated_by: userId
      });

      // Update alert status
      await alert.update({
        status: 'acknowledged',
        acknowledged_at: new Date(),
        acknowledged_by: userId
      });

      console.log(`Confirmed enrollment for employee ${alert.employee_id}`);
      return benchResource;
    } catch (error) {
      console.error('Error confirming enrollment:', error);
      throw error;
    }
  }

  // Dismiss enrollment alert
  async dismissEnrollment(alertId, userId, reason = '') {
    try {
      const alert = await BenchAlert.findByPk(alertId);

      if (!alert) {
        throw new Error('Alert not found');
      }

      if (alert.status !== 'pending') {
        throw new Error('Alert has already been processed');
      }

      await alert.update({
        status: 'dismissed',
        acknowledged_at: new Date(),
        acknowledged_by: userId,
        metadata: {
          ...alert.metadata,
          dismissal_reason: reason
        }
      });

      console.log(`Dismissed enrollment alert ${alertId}`);
      return alert;
    } catch (error) {
      console.error('Error dismissing enrollment:', error);
      throw error;
    }
  }

  // Get pending enrollment alerts
  async getPendingAlerts(page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await BenchAlert.findAndCountAll({
        where: {
          alert_type: 'assignment_ending',
          status: 'pending',
          is_active: true
        },
        include: [
          {
            model: Employee,
            as: 'Employee',
            attributes: ['id', 'first_name', 'last_name', 'email']
          },
          {
            model: Assignment,
            as: 'Assignment',
            attributes: ['id', 'project_name', 'client_name', 'role', 'end_date', 'confirmed_end_date']
          }
        ],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        success: true,
        data: rows,
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error fetching pending alerts:', error);
      throw error;
    }
  }
}

// Create and export service instance
const autoEnrollmentService = new AutoEnrollmentService();
module.exports = autoEnrollmentService;
