const { PermissionGroup } = require('../models/PermissionGroup');
const { PermissionCategory } = require('../models/PermissionCategory');
const { User } = require('../models/User');
const { Op } = require('sequelize');

// Get all permission groups with categories
exports.getPermissionGroupsWithCategories = async (req, res) => {
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

    // Filter by is_system
    if (req.query.is_system !== undefined) {
      whereConditions.is_system = req.query.is_system === 'true';
    }

    // Search by name, short_code, or description
    if (req.query.search) {
      whereConditions[Op.or] = [
        { name: { [Op.like]: `%${req.query.search}%` } },
        { short_code: { [Op.like]: `%${req.query.search}%` } },
        { description: { [Op.like]: `%${req.query.search}%` } },
      ];
    }

    console.log('Fetching permission groups with conditions:', whereConditions);

    // Get permission groups with pagination and include categories
    const { count, rows } = await PermissionGroup.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'CreatedBy',
          attributes: ['id', 'first_name', 'last_name', 'employee_id'],
        },        {
          model: PermissionCategory,
          as: 'PermissionCategories',
          // Remove is_active filter to ensure all categories are returned
          // Even if some are inactive, we should display them in the UI
          required: false, // LEFT JOIN - this ensures groups without categories are still returned
          order: [['display_order', 'ASC']],
        },
      ],      order: [
        ['name', 'ASC'],
      ],
      // Using a high limit to ensure all groups are returned
      limit: limit > 100 ? limit : 1000, // Override with a high value if the provided limit is too small
      offset,
    });    console.log(`Found ${count} permission groups, returning ${rows.length} rows`);
    
    // Enhanced debugging for permission groups
    if (rows.length > 0) {
      console.log('First group:', rows[0].name);
      console.log('Categories count:', rows[0].PermissionCategories ? rows[0].PermissionCategories.length : 0);
      
      // Log all groups and their categories
      rows.forEach((group, index) => {
        console.log(`Group ${index + 1}: ${group.name}, ID: ${group.id}`);
        console.log(`- Categories: ${group.PermissionCategories ? group.PermissionCategories.length : 0} items`);
        
        // Log the first few categories of each group if they exist
        if (group.PermissionCategories && group.PermissionCategories.length > 0) {
          group.PermissionCategories.slice(0, 3).forEach((category, catIndex) => {
            console.log(`  - Category ${catIndex + 1}: ${category.name}, enable_view: ${category.enable_view}`);
          });
          if (group.PermissionCategories.length > 3) {
            console.log(`  - ... and ${group.PermissionCategories.length - 3} more categories`);
          }
        }
      });
    }

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
    console.error('Error in getPermissionGroupsWithCategories:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
