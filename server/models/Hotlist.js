const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Hotlist = sequelize.define('Hotlist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  batch_size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'scheduled', 'sent', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'draft',
  },
  email_template_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'email_templates',
      key: 'id',
    },
  },
  subject_template: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  email_content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  schedule_type: {
    type: DataTypes.ENUM('immediate', 'daily', 'weekly', 'bi_weekly', 'custom'),
    allowNull: false,
    defaultValue: 'immediate',
  },
  schedule_config: {
    type: DataTypes.JSON, // Configuration for scheduling (time, days, etc.)
    allowNull: true,
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  target_audience: {
    type: DataTypes.JSON, // Array of vendor emails or criteria
    allowNull: true,
  },
  show_work_authorization: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  auto_lock_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  locked_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  locked_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  metadata: {
    type: DataTypes.JSON, // Additional configuration and tracking data
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'hotlists',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { User } = require('./User');

  // Hotlist belongs to User (created_by)
  Hotlist.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });

  // Hotlist belongs to User (updated_by)
  Hotlist.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'Updater',
  });

  // Hotlist belongs to User (locked_by)
  Hotlist.belongsTo(User, {
    foreignKey: 'locked_by',
    as: 'LockedBy',
  });
};

module.exports = {
  Hotlist,
  setupAssociations,
};
