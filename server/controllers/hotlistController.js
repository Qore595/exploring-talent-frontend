const { Hotlist } = require('../models/Hotlist');
const { HotlistCandidate } = require('../models/HotlistCandidate');
const { HotlistAnalytics } = require('../models/HotlistAnalytics');
const { BenchResource } = require('../models/BenchResource');
const { Employee } = require('../models/Employee');
const { User } = require('../models/User');
const { Op, sequelize } = require('sequelize');

// Get all hotlists with filtering and pagination
const getHotlists = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      scheduleType,
      createdBy,
      search,
      batchSizeMin,
      batchSizeMax,
      dateRange
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = { is_active: true };

    // Apply filters
    if (status) {
      whereClause.status = Array.isArray(status) ? { [Op.in]: status } : status;
    }

    if (scheduleType) {
      whereClause.schedule_type = Array.isArray(scheduleType) 
        ? { [Op.in]: scheduleType } 
        : scheduleType;
    }

    if (createdBy) {
      whereClause.created_by = createdBy;
    }

    if (batchSizeMin || batchSizeMax) {
      whereClause.batch_size = {};
      if (batchSizeMin) {
        whereClause.batch_size[Op.gte] = batchSizeMin;
      }
      if (batchSizeMax) {
        whereClause.batch_size[Op.lte] = batchSizeMax;
      }
    }

    if (dateRange) {
      const { start, end } = JSON.parse(dateRange);
      whereClause.created_at = {
        [Op.between]: [start, end]
      };
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Hotlist.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: User,
          as: 'LockedBy',
          attributes: ['id', 'first_name', 'last_name'],
          required: false
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
    console.error('Error fetching hotlists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotlists',
      error: error.message
    });
  }
};

// Get hotlist by ID with candidates
const getHotlistById = async (req, res) => {
  try {
    const { id } = req.params;

    const hotlist = await Hotlist.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: User,
          as: 'LockedBy',
          attributes: ['id', 'first_name', 'last_name'],
          required: false
        }
      ]
    });

    if (!hotlist) {
      return res.status(404).json({
        success: false,
        message: 'Hotlist not found'
      });
    }

    // Get candidates for this hotlist
    const candidates = await HotlistCandidate.findAll({
      where: { 
        hotlist_id: id,
        is_active: true
      },
      include: [
        {
          model: Employee,
          as: 'Employee',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone']
        },
        {
          model: BenchResource,
          as: 'BenchResource',
          attributes: ['id', 'skills_summary', 'preferred_roles', 'location_flexibility', 
                      'availability_date', 'last_rate', 'desired_rate', 'work_authorization']
        }
      ],
      order: [['position_in_batch', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        ...hotlist.toJSON(),
        candidates
      }
    });
  } catch (error) {
    console.error('Error fetching hotlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hotlist',
      error: error.message
    });
  }
};

// Create new hotlist
const createHotlist = async (req, res) => {
  try {
    const {
      name,
      description,
      batch_size,
      email_template_id,
      subject_template,
      email_content,
      schedule_type,
      schedule_config,
      scheduled_at,
      target_audience,
      show_work_authorization,
      auto_lock_enabled,
      candidate_ids
    } = req.body;

    const created_by = req.user?.id || 1;

    // Create hotlist
    const hotlist = await Hotlist.create({
      name,
      description,
      batch_size,
      email_template_id,
      subject_template,
      email_content,
      schedule_type,
      schedule_config,
      scheduled_at,
      target_audience,
      show_work_authorization,
      auto_lock_enabled,
      created_by,
      updated_by: created_by
    });

    // Add candidates to hotlist if provided
    if (candidate_ids && candidate_ids.length > 0) {
      const candidatePromises = candidate_ids.slice(0, batch_size).map((candidateId, index) => {
        return HotlistCandidate.create({
          hotlist_id: hotlist.id,
          bench_resource_id: candidateId,
          employee_id: candidateId, // Assuming bench_resource_id maps to employee_id
          position_in_batch: index + 1,
          include_work_authorization: show_work_authorization,
          created_by
        });
      });

      await Promise.all(candidatePromises);
    }

    // Fetch created hotlist with associations
    const createdHotlist = await Hotlist.findByPk(hotlist.id, {
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: createdHotlist,
      message: 'Hotlist created successfully'
    });
  } catch (error) {
    console.error('Error creating hotlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hotlist',
      error: error.message
    });
  }
};

// Update hotlist
const updateHotlist = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      batch_size,
      email_template_id,
      subject_template,
      email_content,
      schedule_type,
      schedule_config,
      scheduled_at,
      target_audience,
      show_work_authorization,
      auto_lock_enabled,
      status
    } = req.body;

    const updated_by = req.user?.id || 1;

    const hotlist = await Hotlist.findByPk(id);
    if (!hotlist) {
      return res.status(404).json({
        success: false,
        message: 'Hotlist not found'
      });
    }

    await hotlist.update({
      name,
      description,
      batch_size,
      email_template_id,
      subject_template,
      email_content,
      schedule_type,
      schedule_config,
      scheduled_at,
      target_audience,
      show_work_authorization,
      auto_lock_enabled,
      status,
      updated_by
    });

    // Fetch updated hotlist with associations
    const updatedHotlist = await Hotlist.findByPk(id, {
      include: [
        {
          model: User,
          as: 'Creator',
          attributes: ['id', 'first_name', 'last_name']
        }
      ]
    });

    res.json({
      success: true,
      data: updatedHotlist,
      message: 'Hotlist updated successfully'
    });
  } catch (error) {
    console.error('Error updating hotlist:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update hotlist',
      error: error.message
    });
  }
};

module.exports = {
  getHotlists,
  getHotlistById,
  createHotlist,
  updateHotlist
};
