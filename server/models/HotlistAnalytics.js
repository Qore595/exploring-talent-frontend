const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HotlistAnalytics = sequelize.define('HotlistAnalytics', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  hotlist_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'hotlists',
      key: 'id',
    },
  },
  hotlist_candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'hotlist_candidates',
      key: 'id',
    },
  },
  event_type: {
    type: DataTypes.ENUM('email_sent', 'email_opened', 'email_clicked', 'vendor_reply', 'interview_scheduled', 'placement_confirmed'),
    allowNull: false,
  },
  event_timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  vendor_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email_subject: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  clicked_link: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  response_time_hours: {
    type: DataTypes.DECIMAL(8, 2),
    allowNull: true,
  },
  conversion_value: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  metadata: {
    type: DataTypes.JSON, // Additional tracking data
    allowNull: true,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
}, {
  tableName: 'hotlist_analytics',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Hotlist } = require('./Hotlist');
  const { HotlistCandidate } = require('./HotlistCandidate');
  const { User } = require('./User');

  // HotlistAnalytics belongs to Hotlist
  HotlistAnalytics.belongsTo(Hotlist, {
    foreignKey: 'hotlist_id',
    as: 'Hotlist',
  });

  // HotlistAnalytics belongs to HotlistCandidate
  HotlistAnalytics.belongsTo(HotlistCandidate, {
    foreignKey: 'hotlist_candidate_id',
    as: 'HotlistCandidate',
  });

  // HotlistAnalytics belongs to User (created_by)
  HotlistAnalytics.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });
};

module.exports = {
  HotlistAnalytics,
  setupAssociations,
};
