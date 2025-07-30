const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HotlistCandidate = sequelize.define('HotlistCandidate', {
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
  bench_resource_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'bench_resources',
      key: 'id',
    },
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  position_in_batch: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  include_work_authorization: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  custom_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('selected', 'sent', 'responded', 'interviewed', 'placed', 'rejected'),
    allowNull: false,
    defaultValue: 'selected',
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  response_received_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  vendor_response: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  vendor_email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interview_scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  placement_confirmed_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  rejection_reason: {
    type: DataTypes.TEXT,
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
  tableName: 'hotlist_candidates',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Hotlist } = require('./Hotlist');
  const { BenchResource } = require('./BenchResource');
  const { Employee } = require('./Employee');
  const { User } = require('./User');

  // HotlistCandidate belongs to Hotlist
  HotlistCandidate.belongsTo(Hotlist, {
    foreignKey: 'hotlist_id',
    as: 'Hotlist',
  });

  // HotlistCandidate belongs to BenchResource
  HotlistCandidate.belongsTo(BenchResource, {
    foreignKey: 'bench_resource_id',
    as: 'BenchResource',
  });

  // HotlistCandidate belongs to Employee
  HotlistCandidate.belongsTo(Employee, {
    foreignKey: 'employee_id',
    as: 'Employee',
  });

  // HotlistCandidate belongs to User (created_by)
  HotlistCandidate.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });

  // HotlistCandidate belongs to User (updated_by)
  HotlistCandidate.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'Updater',
  });
};

module.exports = {
  HotlistCandidate,
  setupAssociations,
};
