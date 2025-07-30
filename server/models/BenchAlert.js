const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BenchAlert = sequelize.define('BenchAlert', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  assignment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'assignments',
      key: 'id',
    },
  },
  alert_type: {
    type: DataTypes.ENUM('assignment_ending', 'manual_addition', 'status_change'),
    allowNull: false,
  },
  alert_message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  recipient_roles: {
    type: DataTypes.JSON, // Array of roles to notify: ['bench_sales', 'account_manager', 'cio_cto']
    allowNull: false,
  },
  sent_to: {
    type: DataTypes.JSON, // Array of user IDs who received the alert
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'sent', 'acknowledged', 'dismissed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    allowNull: false,
    defaultValue: 'medium',
  },
  scheduled_for: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  sent_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  acknowledged_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  acknowledged_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  metadata: {
    type: DataTypes.JSON, // Additional data like assignment details, etc.
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
  tableName: 'bench_alerts',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Employee } = require('./Employee');
  const { Assignment } = require('./Assignment');
  const { User } = require('./User');

  // BenchAlert belongs to Employee
  BenchAlert.belongsTo(Employee, {
    foreignKey: 'employee_id',
    as: 'Employee',
  });

  // BenchAlert belongs to Assignment
  BenchAlert.belongsTo(Assignment, {
    foreignKey: 'assignment_id',
    as: 'Assignment',
  });

  // BenchAlert belongs to User (created_by)
  BenchAlert.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });

  // BenchAlert belongs to User (updated_by)
  BenchAlert.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'Updater',
  });

  // BenchAlert belongs to User (acknowledged_by)
  BenchAlert.belongsTo(User, {
    foreignKey: 'acknowledged_by',
    as: 'AcknowledgedBy',
  });
};

module.exports = {
  BenchAlert,
  setupAssociations,
};
