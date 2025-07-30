const { BenchResource } = require('../models/BenchResource');
const { Assignment } = require('../models/Assignment');
const { BenchAlert } = require('../models/BenchAlert');
const { Employee } = require('../models/Employee');
const { Department } = require('../models/Department');
const { Designation } = require('../models/Designation');
const { User } = require('../models/User');
const { Op, sequelize } = require('sequelize');
const autoEnrollmentService = require('../services/autoEnrollmentService');

// Get all bench resources with filtering and pagination
const getBenchResources = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      locationFlexibility,
      availabilityDateFrom,
      availabilityDateTo,
      skills,
      preferredRoles,
      rateMin,
      rateMax,
      autoEnrolled,
      search,
      departmentId,
      designationId
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { is_active: true };
    const employeeWhereClause = {};

    // Apply filters
    if (status) {
      whereClause.status = Array.isArray(status) ? { [Op.in]: status } : status;
    }

    if (locationFlexibility) {
      whereClause.location_flexibility = Array.isArray(locationFlexibility) 
        ? { [Op.in]: locationFlexibility } 
        : locationFlexibility;
    }

    if (availabilityDateFrom || availabilityDateTo) {
      whereClause.availability_date = {};
      if (availabilityDateFrom) {
        whereClause.availability_date[Op.gte] = availabilityDateFrom;
      }
      if (availabilityDateTo) {
        whereClause.availability_date[Op.lte] = availabilityDateTo;
      }
    }

    if (rateMin || rateMax) {
      whereClause[Op.or] = [];
      if (rateMin) {
        whereClause[Op.or].push({
          [Op.or]: [
            { last_rate: { [Op.gte]: rateMin } },
            { desired_rate: { [Op.gte]: rateMin } }
          ]
        });
      }
      if (rateMax) {
        whereClause[Op.or].push({
          [Op.or]: [
            { last_rate: { [Op.lte]: rateMax } },
            { desired_rate: { [Op.lte]: rateMax } }
          ]
        });
      }
    }

    if (autoEnrolled !== undefined) {
      whereClause.auto_enrolled = autoEnrolled === 'true';
    }

    if (skills) {
      const skillsArray = Array.isArray(skills) ? skills : [skills];
      whereClause.skills_summary = {
        [Op.or]: skillsArray.map(skill => ({
          [Op.like]: `%${skill}%`
        }))
      };
    }

    if (preferredRoles) {
      const rolesArray = Array.isArray(preferredRoles) ? preferredRoles : [preferredRoles];
      whereClause.preferred_roles = {
        [Op.contains]: rolesArray
      };
    }

    if (departmentId) {
      employeeWhereClause.department_id = departmentId;
    }

    if (designationId) {
      employeeWhereClause.designation_id = designationId;
    }

    if (search) {
      employeeWhereClause[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
      whereClause[Op.or] = [
        { skills_summary: { [Op.like]: `%${search}%` } },
        { notes: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await BenchResource.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Employee,
          as: 'Employee',
          where: employeeWhereClause,
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          include: [
            {
              model: Department,
              as: 'Department',
              attributes: ['id', 'name']
            },
            {
              model: Designation,
              as: 'Designation',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'first_name', 'last_name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: rows,
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit)
    });
  } catch (error) {
    console.error('Error fetching bench resources:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bench resources',
      error: error.message
    });
  }
};

// Get bench resource by ID
const getBenchResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const benchResource = await BenchResource.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          include: [
            {
              model: Department,
              as: 'Department',
              attributes: ['id', 'name']
            },
            {
              model: Designation,
              as: 'Designation',
              attributes: ['id', 'name']
            }
          ]
        },
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: User,
          as: 'Updater',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    if (!benchResource) {
      return res.status(404).json({
        success: false,
        message: 'Bench resource not found'
      });
    }

    res.json({
      success: true,
      data: benchResource
    });
  } catch (error) {
    console.error('Error fetching bench resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bench resource',
      error: error.message
    });
  }
};

// Create new bench resource
const createBenchResource = async (req, res) => {
  try {
    const {
      employee_id,
      skills_summary,
      preferred_roles,
      location_flexibility,
      availability_date,
      last_rate,
      desired_rate,
      work_authorization,
      notes,
      enrollment_source = 'manual'
    } = req.body;

    const created_by = req.user?.id || 1; // Default to user ID 1 if not available

    // Check if employee already has an active bench resource
    const existingResource = await BenchResource.findOne({
      where: {
        employee_id,
        is_active: true
      }
    });

    if (existingResource) {
      return res.status(400).json({
        success: false,
        message: 'Employee already has an active bench resource'
      });
    }

    const benchResource = await BenchResource.create({
      employee_id,
      skills_summary,
      preferred_roles,
      location_flexibility,
      availability_date,
      last_rate,
      desired_rate,
      work_authorization,
      notes,
      enrollment_source,
      auto_enrolled: enrollment_source !== 'manual',
      created_by,
      updated_by: created_by
    });

    // Fetch the created resource with associations
    const createdResource = await BenchResource.findByPk(benchResource.id, {
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          include: [
            {
              model: Department,
              as: 'Department',
              attributes: ['id', 'name']
            },
            {
              model: Designation,
              as: 'Designation',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdResource,
      message: 'Bench resource created successfully'
    });
  } catch (error) {
    console.error('Error creating bench resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create bench resource',
      error: error.message
    });
  }
};

// Update bench resource
const updateBenchResource = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      skills_summary,
      preferred_roles,
      location_flexibility,
      availability_date,
      last_rate,
      desired_rate,
      work_authorization,
      status,
      notes
    } = req.body;

    const updated_by = req.user?.id || 1;

    const benchResource = await BenchResource.findByPk(id);
    if (!benchResource) {
      return res.status(404).json({
        success: false,
        message: 'Bench resource not found'
      });
    }

    await benchResource.update({
      skills_summary,
      preferred_roles,
      location_flexibility,
      availability_date,
      last_rate,
      desired_rate,
      work_authorization,
      status,
      notes,
      updated_by
    });

    // Fetch updated resource with associations
    const updatedResource = await BenchResource.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
          include: [
            {
              model: Department,
              as: 'Department',
              attributes: ['id', 'name']
            },
            {
              model: Designation,
              as: 'Designation',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });

    res.json({
      success: true,
      data: updatedResource,
      message: 'Bench resource updated successfully'
    });
  } catch (error) {
    console.error('Error updating bench resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update bench resource',
      error: error.message
    });
  }
};

// Delete bench resource (soft delete)
const deleteBenchResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updated_by = req.user?.id || 1;

    const benchResource = await BenchResource.findByPk(id);
    if (!benchResource) {
      return res.status(404).json({
        success: false,
        message: 'Bench resource not found'
      });
    }

    await benchResource.update({
      is_active: false,
      updated_by
    });

    res.json({
      success: true,
      message: 'Bench resource deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting bench resource:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bench resource',
      error: error.message
    });
  }
};

// Get bench resource statistics
const getBenchResourceStats = async (req, res) => {
  try {
    const stats = await BenchResource.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: { is_active: true },
      group: ['status'],
      raw: true
    });

    const autoEnrolledCount = await BenchResource.count({
      where: {
        is_active: true,
        auto_enrolled: true
      }
    });

    const manuallyAddedCount = await BenchResource.count({
      where: {
        is_active: true,
        auto_enrolled: false
      }
    });

    const statusStats = {
      available: 0,
      in_hotlist: 0,
      submitted: 0,
      interviewing: 0,
      offered: 0,
      deployed: 0
    };

    stats.forEach(stat => {
      statusStats[stat.status] = parseInt(stat.count);
    });

    const totalAvailable = Object.values(statusStats).reduce((sum, count) => sum + count, 0);

    res.json({
      success: true,
      data: {
        ...statusStats,
        totalAvailable,
        autoEnrolled: autoEnrolledCount,
        manuallyAdded: manuallyAddedCount
      }
    });
  } catch (error) {
    console.error('Error fetching bench resource stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bench resource statistics',
      error: error.message
    });
  }
};

// Auto-enrollment endpoints
const getAutoEnrollmentSettings = async (req, res) => {
  try {
    const settings = autoEnrollmentService.getSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching auto-enrollment settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch auto-enrollment settings',
      error: error.message
    });
  }
};

const updateAutoEnrollmentSettings = async (req, res) => {
  try {
    const settings = autoEnrollmentService.updateSettings(req.body);
    res.json({
      success: true,
      data: settings,
      message: 'Auto-enrollment settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating auto-enrollment settings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update auto-enrollment settings',
      error: error.message
    });
  }
};

const triggerAutoEnrollment = async (req, res) => {
  try {
    const result = await autoEnrollmentService.triggerManualEnrollment();
    res.json(result);
  } catch (error) {
    console.error('Error triggering auto-enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger auto-enrollment',
      error: error.message
    });
  }
};

const getPendingAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await autoEnrollmentService.getPendingAlerts(page, limit);
    res.json(result);
  } catch (error) {
    console.error('Error fetching pending alerts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending alerts',
      error: error.message
    });
  }
};

const confirmEnrollment = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user?.id || 1;
    const additionalData = req.body;

    const benchResource = await autoEnrollmentService.confirmEnrollment(alertId, userId, additionalData);
    res.json({
      success: true,
      data: benchResource,
      message: 'Enrollment confirmed successfully'
    });
  } catch (error) {
    console.error('Error confirming enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm enrollment',
      error: error.message
    });
  }
};

const dismissEnrollment = async (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user?.id || 1;
    const { reason } = req.body;

    const alert = await autoEnrollmentService.dismissEnrollment(alertId, userId, reason);
    res.json({
      success: true,
      data: alert,
      message: 'Enrollment dismissed successfully'
    });
  } catch (error) {
    console.error('Error dismissing enrollment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to dismiss enrollment',
      error: error.message
    });
  }
};

module.exports = {
  getBenchResources,
  getBenchResourceById,
  createBenchResource,
  updateBenchResource,
  deleteBenchResource,
  getBenchResourceStats,
  getAutoEnrollmentSettings,
  updateAutoEnrollmentSettings,
  triggerAutoEnrollment,
  getPendingAlerts,
  confirmEnrollment,
  dismissEnrollment
};
