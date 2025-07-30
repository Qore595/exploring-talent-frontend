const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BenchResource = sequelize.define('BenchResource', {
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
  skills_summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  preferred_roles: {
    type: DataTypes.JSON, // Array of role preferences
    allowNull: true,
  },
  location_flexibility: {
    type: DataTypes.ENUM('remote', 'hybrid', 'onsite', 'flexible'),
    allowNull: false,
    defaultValue: 'flexible',
  },
  availability_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  last_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  desired_rate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  work_authorization: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('available', 'in_hotlist', 'submitted', 'interviewing', 'offered', 'deployed'),
    allowNull: false,
    defaultValue: 'available',
  },
  auto_enrolled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  enrollment_source: {
    type: DataTypes.ENUM('manual', 'auto_assignment_end', 'auto_project_completion'),
    allowNull: false,
    defaultValue: 'manual',
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
  tableName: 'bench_resources',
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

  // BenchResource belongs to Employee
  BenchResource.belongsTo(Employee, {
    foreignKey: 'employee_id',
    as: 'Employee',
  });

  // BenchResource belongs to User (created_by)
  BenchResource.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });

  // BenchResource belongs to User (updated_by)
  BenchResource.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'Updater',
  });
};

module.exports = {
  BenchResource,
  setupAssociations,
};
