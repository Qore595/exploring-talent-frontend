const { EmployeeRole } = require('../models/EmployeeRole');
const { Employee } = require('../models/Employee');
const { Role } = require('../models/Role');
const { Branch } = require('../models/Branch');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Get all employee roles with pagination and filtering
exports.getEmployeeRoles = async (req, res) => {
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

    // Filter by is_primary
    if (req.query.is_primary !== undefined) {
      whereConditions.is_primary = req.query.is_primary === 'true';
    }

    // Filter by employee_id
    if (req.query.employee_id) {
      whereConditions.employee_id = req.query.employee_id;
    }

    // Filter by role_id
    if (req.query.role_id) {
      whereConditions.role_id = req.query.role_id;
    }

    // Filter by branch_id
    if (req.query.branch_id) {
      whereConditions.branch_id = req.query.branch_id;
    }

    // Get employee roles with pagination
    const { count, rows } = await EmployeeRole.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
        {
          model: Role,
          as: 'Role',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [
        ['is_primary', 'DESC'],
        ['created_at', 'DESC'],
      ],
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
    console.error('Error in getEmployeeRoles:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get employee roles by employee ID
exports.getEmployeeRolesByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    // Get employee roles
    const employeeRoles = await EmployeeRole.findAll({
      where: {
        employee_id: employeeId,
        is_active: true,
      },
      include: [
        {
          model: Role,
          as: 'Role',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name', 'code'],
        },
      ],
      order: [
        ['is_primary', 'DESC'],
        ['created_at', 'DESC'],
      ],
    });

    return res.status(200).json({
      success: true,
      data: employeeRoles,
    });
  } catch (error) {
    console.error('Error in getEmployeeRolesByEmployeeId:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get employee role by ID
exports.getEmployeeRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    // Get employee role
    const employeeRole = await EmployeeRole.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
        {
          model: Role,
          as: 'Role',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    if (!employeeRole) {
      return res.status(404).json({
        success: false,
        message: 'Employee role not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: employeeRole,
    });
  } catch (error) {
    console.error('Error in getEmployeeRoleById:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Create a new employee role
exports.createEmployeeRole = async (req, res) => {
  try {
    console.log('Creating employee role with data:', req.body);

    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    // Check if employee exists
    console.log('Checking if employee exists with ID:', req.body.employee_id);
    const employee = await Employee.findByPk(req.body.employee_id);
    console.log('Employee found:', employee ? 'Yes' : 'No');
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if role exists
    console.log('Checking if role exists with ID:', req.body.role_id);
    const role = await Role.findByPk(req.body.role_id);
    console.log('Role found:', role ? 'Yes' : 'No');
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found',
      });
    }

    // Check if branch exists
    console.log('Checking if branch exists with ID:', req.body.branch_id);
    const branch = await Branch.findByPk(req.body.branch_id);
    console.log('Branch found:', branch ? 'Yes' : 'No');
    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    // If this is a primary role, update any existing primary roles for this employee
    if (req.body.is_primary) {
      console.log('Updating existing primary roles for employee ID:', req.body.employee_id);
      await EmployeeRole.update(
        { is_primary: false },
        {
          where: {
            employee_id: req.body.employee_id,
            is_primary: true,
          },
        }
      );
    }

    // Create employee role
    console.log('Creating employee role with data:', req.body);

    // If created_by is the same as employee_id, it means the employee is creating their own role
    // In a real application, this would be the current logged-in user's ID
    // For now, we'll allow this but in production, you might want to validate this
    console.log('Note: created_by ID is', req.body.created_by === req.body.employee_id ? 'the same as' : 'different from', 'employee_id');

    const employeeRole = await EmployeeRole.create(req.body);
    console.log('Employee role created with ID:', employeeRole.id);

    // Get the created employee role with associations
    console.log('Fetching created employee role with associations');
    const createdEmployeeRole = await EmployeeRole.findByPk(employeeRole.id, {
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
        {
          model: Role,
          as: 'Role',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });
    console.log('Created employee role with associations:', createdEmployeeRole ? 'Found' : 'Not found');

    return res.status(201).json({
      success: true,
      message: 'Employee role created successfully',
      data: createdEmployeeRole,
    });
  } catch (error) {
    console.error('Error in createEmployeeRole:', error);
    console.error('Error stack:', error.stack);

    // Check if this is a Sequelize error
    if (error.name && error.name.includes('Sequelize')) {
      console.error('Sequelize error details:', {
        name: error.name,
        message: error.message,
        sql: error.sql,
        parameters: error.parameters,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update employee role
exports.updateEmployeeRole = async (req, res) => {
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

    // Find employee role
    const employeeRole = await EmployeeRole.findByPk(id);

    if (!employeeRole) {
      return res.status(404).json({
        success: false,
        message: 'Employee role not found',
      });
    }

    // If changing to primary role, update any existing primary roles for this employee
    if (req.body.is_primary && !employeeRole.is_primary) {
      await EmployeeRole.update(
        { is_primary: false },
        {
          where: {
            employee_id: employeeRole.employee_id,
            is_primary: true,
            id: { [Op.ne]: id },
          },
        }
      );
    }

    // Update employee role
    await employeeRole.update(req.body);

    // Get updated employee role with associations
    const updatedEmployeeRole = await EmployeeRole.findByPk(id, {
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: ['id', 'employee_id', 'first_name', 'last_name'],
        },
        {
          model: Role,
          as: 'Role',
          attributes: ['id', 'name', 'slug'],
        },
        {
          model: Branch,
          as: 'Branch',
          attributes: ['id', 'name', 'code'],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: 'Employee role updated successfully',
      data: updatedEmployeeRole,
    });
  } catch (error) {
    console.error('Error in updateEmployeeRole:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Delete employee role
exports.deleteEmployeeRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Find employee role
    const employeeRole = await EmployeeRole.findByPk(id);

    if (!employeeRole) {
      return res.status(404).json({
        success: false,
        message: 'Employee role not found',
      });
    }

    // Delete employee role (soft delete)
    await employeeRole.destroy();

    return res.status(200).json({
      success: true,
      message: 'Employee role deleted successfully',
      result: {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 0
      }
    });
  } catch (error) {
    console.error('Error in deleteEmployeeRole:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
