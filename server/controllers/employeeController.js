const { validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Employee } = require('../models/Employee');
const { Branch } = require('../models/Branch');
const { Department } = require('../models/Department');
const { Designation } = require('../models/Designation');

// Get all employees with pagination and filtering
exports.getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Build filter conditions
    const whereConditions = {};

    // Filter by is_active
    if (req.query.is_active !== undefined) {
      whereConditions.is_active = req.query.is_active === 'true';
    }

    // Filter by branch_id
    if (req.query.branch_id) {
      whereConditions.branch_id = req.query.branch_id;
    }

    // Filter by department_id
    if (req.query.department_id) {
      whereConditions.department_id = req.query.department_id;
    }

    // Filter by designation_id
    if (req.query.designation_id) {
      whereConditions.designation_id = req.query.designation_id;
    }

    // Filter by employment_status
    if (req.query.employment_status) {
      whereConditions.employment_status = req.query.employment_status;
    }

    // Search by first_name, last_name, employee_id, or email
    if (req.query.search) {
      whereConditions[Op.or] = [
        { first_name: { [Op.like]: `%${req.query.search}%` } },
        { last_name: { [Op.like]: `%${req.query.search}%` } },
        { employee_id: { [Op.like]: `%${req.query.search}%` } },
        { email: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    // Get employees with pagination
    const { count, rows } = await Employee.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name'],
        },
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'name'],
        },
        {
          model: Designation,
          as: 'Designation',
          attributes: ['id', 'name', 'short_code'],
        },
        {
          model: Employee,
          as: 'Manager',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
      ],
      attributes: { exclude: ['password'] }, // Exclude password from response
      order: [['id', 'ASC']],
      limit,
      offset,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(count / limit);

    return res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: totalPages,
      },
    });
  } catch (error) {
    console.error('Error in getEmployees:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name'],
        },
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'name'],
        },
        {
          model: Designation,
          as: 'Designation',
          attributes: ['id', 'name', 'short_code'],
        },
        {
          model: Employee,
          as: 'Manager',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
        {
          model: Employee,
          as: 'Subordinates',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
      ],
      attributes: { exclude: ['password'] }, // Exclude password from response
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error('Error in getEmployeeById:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get employee profile with sidebar menus
exports.getEmployeeProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name'],
        },
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'name'],
        },
        {
          model: Designation,
          as: 'Designation',
          attributes: ['id', 'name', 'short_code'],
        },
        {
          model: Employee,
          as: 'Manager',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
      ],
      attributes: { exclude: ['password'] },
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Generate sidebar menus based on role/permissions
    // Get user role from employee data or default to 'employee'
    const userRole = employee.role || 'employee';

    // Define role-based menu visibility
    const canAccessBenchResources = ['admin', 'bench_sales', 'account_manager', 'cio_cto'].includes(userRole);
    const canAccessHotlists = ['admin', 'bench_sales', 'account_manager'].includes(userRole);
    const canAccessSettings = ['admin', 'cio_cto'].includes(userRole);
    const canAccessAnalytics = ['admin', 'bench_sales', 'account_manager', 'cio_cto', 'recruiter', 'hr'].includes(userRole);

    const sidebarMenus = [];

    // Bench Resources Menu
    if (canAccessBenchResources) {
      const benchResourcesSubMenus = [
        {
          id: 101,
          sub_menu: 'Available Resources',
          icon: 'user-check',
          url: '/bench-resources',
          lang_key: 'available_resources',
          display_order: 1,
          level: 2,
          is_active: true,
          permission_categories: []
        },
        {
          id: 102,
          sub_menu: 'Status Pipeline',
          icon: 'workflow',
          url: '/bench-resources/pipeline',
          lang_key: 'status_pipeline',
          display_order: 2,
          level: 2,
          is_active: true,
          permission_categories: []
        }
      ];

      // Add settings submenu only for authorized roles
      if (canAccessSettings) {
        benchResourcesSubMenus.push({
          id: 103,
          sub_menu: 'Auto-Enrollment Settings',
          icon: 'settings',
          url: '/bench-resources/settings',
          lang_key: 'auto_enrollment_settings',
          display_order: 3,
          level: 2,
          is_active: true,
          permission_categories: []
        });
      }

      sidebarMenus.push({
        id: 1,
        menu: 'Bench Resources',
        icon: 'users',
        url: null,
        lang_key: 'bench_resources',
        display_order: 10,
        level: 1,
        sub_menus: benchResourcesSubMenus
      });
    }

    // Hotlist Management Menu
    if (canAccessHotlists) {
      const hotlistSubMenus = [
        {
          id: 201,
          sub_menu: 'Create Hotlist',
          icon: 'plus',
          url: '/hotlists/create',
          lang_key: 'create_hotlist',
          display_order: 1,
          level: 2,
          is_active: true,
          permission_categories: []
        },
        {
          id: 202,
          sub_menu: 'Scheduled Hotlists',
          icon: 'calendar',
          url: '/hotlists/scheduled',
          lang_key: 'scheduled_hotlists',
          display_order: 2,
          level: 2,
          is_active: true,
          permission_categories: []
        },
        {
          id: 204,
          sub_menu: 'Subject Templates',
          icon: 'file-text',
          url: '/hotlists/templates',
          lang_key: 'subject_templates',
          display_order: 4,
          level: 2,
          is_active: true,
          permission_categories: []
        }
      ];

      // Add analytics submenu only for authorized roles
      if (canAccessAnalytics) {
        hotlistSubMenus.splice(2, 0, {
          id: 203,
          sub_menu: 'Performance Analytics',
          icon: 'bar-chart',
          url: '/hotlists/analytics',
          lang_key: 'performance_analytics',
          display_order: 3,
          level: 2,
          is_active: true,
          permission_categories: []
        });
      }

      sidebarMenus.push({
        id: 2,
        menu: 'Hotlist Management',
        icon: 'mail',
        url: null,
        lang_key: 'hotlist_management',
        display_order: 11,
        level: 1,
        sub_menus: hotlistSubMenus
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
      sidebar_menus: sidebarMenus,
    });
  } catch (error) {
    console.error('Error in getEmployeeProfile:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    // Check if employee with same ID or email already exists
    const existingEmployee = await Employee.findOne({
      where: {
        [Op.or]: [
          { employee_id: req.body.employee_id },
          { email: req.body.email },
        ],
      },
    });

    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee with this employee ID or email already exists',
      });
    }

    // Create employee
    const employee = await Employee.create(req.body);

    // Fetch the created employee with associations
    const createdEmployee = await Employee.findByPk(employee.id, {
      include: [
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name'],
        },
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'name'],
        },
        {
          model: Designation,
          as: 'Designation',
          attributes: ['id', 'name', 'short_code'],
        },
      ],
      attributes: { exclude: ['password'] }, // Exclude password from response
    });

    return res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: createdEmployee,
    });
  } catch (error) {
    console.error('Error in createEmployee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { id } = req.params;

    // Find employee
    const employee = await Employee.findByPk(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if employee_id or email is being updated and already exists
    if (req.body.employee_id || req.body.email) {
      const whereConditions = {
        id: { [Op.ne]: id }, // Not the current employee
        [Op.or]: [],
      };

      if (req.body.employee_id) {
        whereConditions[Op.or].push({ employee_id: req.body.employee_id });
      }

      if (req.body.email) {
        whereConditions[Op.or].push({ email: req.body.email });
      }

      if (whereConditions[Op.or].length > 0) {
        const existingEmployee = await Employee.findOne({
          where: whereConditions,
        });

        if (existingEmployee) {
          return res.status(400).json({
            success: false,
            message: 'Employee with this employee ID or email already exists',
          });
        }
      }
    }

    // Update employee
    await employee.update(req.body);

    // Fetch the updated employee with associations
    const updatedEmployee = await Employee.findByPk(id, {
      include: [
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name'],
        },
        {
          model: Department,
          as: 'Department',
          attributes: ['id', 'name'],
        },
        {
          model: Designation,
          as: 'Designation',
          attributes: ['id', 'name', 'short_code'],
        },
        {
          model: Employee,
          as: 'Manager',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
      ],
      attributes: { exclude: ['password'] }, // Exclude password from response
    });

    return res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee,
    });
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee
    const employee = await Employee.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'Subordinates',
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if employee has subordinates
    if (employee.Subordinates && employee.Subordinates.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete employee with subordinates. Please reassign subordinates first.',
      });
    }

    // Delete employee (soft delete)
    await employee.destroy();

    return res.status(200).json({
      success: true,
      message: 'Employee deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleteEmployee:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
