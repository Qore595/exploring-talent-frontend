const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const EmployeeRole = sequelize.define('EmployeeRole', {
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
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'branches',
      key: 'id',
    },
  },
  is_primary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
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
  tableName: 'employee_roles',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Employee } = require('./Employee');
  const { Role } = require('./Role');
  const { Branch } = require('./Branch');
  const { User } = require('./User');

  // EmployeeRole belongs to Employee
  EmployeeRole.belongsTo(Employee, {
    foreignKey: 'employee_id',
    as: 'Employee',
  });

  // EmployeeRole belongs to Role
  EmployeeRole.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'Role',
  });

  // EmployeeRole belongs to Branch
  EmployeeRole.belongsTo(Branch, {
    foreignKey: 'branch_id',
    as: 'Branch',
  });

  // EmployeeRole belongs to User (created_by)
  EmployeeRole.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'CreatedBy',
  });

  // EmployeeRole belongs to User (updated_by)
  EmployeeRole.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'UpdatedBy',
  });
};

module.exports = {
  EmployeeRole,
  setupAssociations,
};
