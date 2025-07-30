const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Assignment = sequelize.define('Assignment', {
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
  project_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  client_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  confirmed_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'terminated', 'on_hold'),
    allowNull: false,
    defaultValue: 'active',
  },
  rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  work_type: {
    type: DataTypes.ENUM('remote', 'hybrid', 'onsite'),
    allowNull: false,
    defaultValue: 'remote',
  },
  auto_bench_enrollment: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  bench_alert_sent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  bench_alert_sent_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
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
  tableName: 'assignments',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Employee } = require('./Employee');
  const { User } = require('./User');

  // Assignment belongs to Employee
  Assignment.belongsTo(Employee, {
    foreignKey: 'employee_id',
    as: 'Employee',
  });

  // Assignment belongs to User (created_by)
  Assignment.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });

  // Assignment belongs to User (updated_by)
  Assignment.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'Updater',
  });
};

module.exports = {
  Assignment,
  setupAssociations,
};
