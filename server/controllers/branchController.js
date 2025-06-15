const { Branch } = require('../models/Branch');
const { Department } = require('../models/Department');
const { Designation } = require('../models/Designation');
const { Role } = require('../models/Role');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Get all branches with pagination and filtering
exports.getBranches = async (req, res) => {
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

    // Filter by branch_type
    if (req.query.branch_type) {
      whereConditions.branch_type = req.query.branch_type;
    }

    // Filter by city
    if (req.query.city) {
      whereConditions.city = req.query.city;
    }

    // Filter by state
    if (req.query.state) {
      whereConditions.state = req.query.state;
    }

    // Filter by country
    if (req.query.country) {
      whereConditions.country = req.query.country;
    }

    // Search by name, code, or description
    if (req.query.search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { code: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    // Get branches with pagination
    const { count, rows } = await Branch.findAndCountAll({
      where: whereConditions,
      order: [
        ['name', 'ASC'],
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
    console.error('Error in getBranches:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get branch by ID
exports.getBranchById = async (req, res) => {
  try {
    const { id } = req.params;

    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    console.error('Error in getBranchById:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Get branch with related data (departments, designations, and roles)
exports.getBranchWithRelatedData = async (req, res) => {
  try {
    console.log('getBranchWithRelatedData called with params:', req.params);
    const { branchId } = req.params;

    if (!branchId) {
      console.log('Branch ID is missing in request params');
      return res.status(400).json({
        success: false,
        message: 'Branch ID is required',
      });
    }

    console.log('Fetching branch with ID:', branchId);

    // Find branch
    const branch = await Branch.findByPk(branchId);
    console.log('Branch found:', branch ? 'Yes' : 'No');

    if (!branch) {
      console.log('Branch not found with ID:', branchId);
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    console.log('Branch details:', {
      id: branch.id,
      name: branch.name,
      code: branch.code,
      is_active: branch.is_active
    });

    // Find departments for this branch
    const departments = await Department.findAll({
      where: {
        branch_id: branchId,
        is_active: true,
      },
      order: [['name', 'ASC']],
    });
    console.log(`Found ${departments.length} departments for branch ID ${branchId}`);

    // Find designations for this branch
    const designations = await Designation.findAll({
      where: {
        branch_id: branchId,
        is_active: true,
      },
      order: [['name', 'ASC']],
    });
    console.log(`Found ${designations.length} designations for branch ID ${branchId}`);

    // Find roles for this branch
    const roles = await Role.findAll({
      where: {
        branch_id: branchId,
        is_active: true,
      },
      order: [['name', 'ASC']],
    });
    console.log(`Found ${roles.length} roles for branch ID ${branchId}`);

    const responseData = {
      success: true,
      data: {
        branch,
        departments,
        designations,
        roles,
      },
    };

    console.log('Sending response with data structure:', {
      success: true,
      data: {
        branch: 'Branch object',
        departments: `Array with ${departments.length} items`,
        designations: `Array with ${designations.length} items`,
        roles: `Array with ${roles.length} items`,
      },
    });

    return res.status(200).json(responseData);
  } catch (error) {
    console.error('Error in getBranchWithRelatedData:', error);
    console.error('Error stack:', error.stack);

    // Check if this is a Sequelize error
    if (error.name === 'SequelizeConnectionError') {
      console.error('Database connection error');
    }

    // Check if models are properly defined
    console.log('Checking models:', {
      Branch: !!Branch,
      Department: !!Department,
      Designation: !!Designation,
      Role: !!Role
    });

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Create a new branch
exports.createBranch = async (req, res) => {
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

    // Check if code already exists
    const existingBranch = await Branch.findOne({
      where: { code: req.body.code },
    });

    if (existingBranch) {
      return res.status(400).json({
        success: false,
        message: 'A branch with this code already exists',
      });
    }

    // Create branch
    const branch = await Branch.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: branch,
    });
  } catch (error) {
    console.error('Error in createBranch:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Update branch
exports.updateBranch = async (req, res) => {
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

    // Find branch
    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    // Check if code already exists (if changing code)
    if (req.body.code && req.body.code !== branch.code) {
      const existingBranch = await Branch.findOne({
        where: {
          code: req.body.code,
          id: { [Op.ne]: id },
        },
      });

      if (existingBranch) {
        return res.status(400).json({
          success: false,
          message: 'A branch with this code already exists',
        });
      }
    }

    // Update branch
    await branch.update(req.body);

    return res.status(200).json({
      success: true,
      message: 'Branch updated successfully',
      data: branch,
    });
  } catch (error) {
    console.error('Error in updateBranch:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// Delete branch
exports.deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    // Find branch
    const branch = await Branch.findByPk(id);

    if (!branch) {
      return res.status(404).json({
        success: false,
        message: 'Branch not found',
      });
    }

    // Delete branch (soft delete)
    const result = await branch.destroy();

    return res.status(200).json({
      success: true,
      message: 'Branch deleted successfully',
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
    console.error('Error in deleteBranch:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
