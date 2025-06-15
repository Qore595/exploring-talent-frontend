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
