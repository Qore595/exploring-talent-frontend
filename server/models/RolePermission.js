const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolePermission = sequelize.define('RolePermission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id',
    },
  },
  perm_cat_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'permission_categories',
      key: 'id',
    },
  },
  can_view: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  can_add: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  can_edit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  can_delete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'branches',
      key: 'id',
    },
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
  custom_attributes: {
    type: DataTypes.JSON,
    allowNull: true,
  },
}, {
  tableName: 'role_permissions',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Role } = require('./Role');
  const { PermissionCategory } = require('./PermissionCategory');
  const { Branch } = require('./Branch');
  const { User } = require('./User');

  // RolePermission belongs to Role
  RolePermission.belongsTo(Role, {
    foreignKey: 'role_id',
    as: 'Role',
  });

  // RolePermission belongs to PermissionCategory
  RolePermission.belongsTo(PermissionCategory, {
    foreignKey: 'perm_cat_id',
    as: 'PermissionCategory',
  });

  // RolePermission belongs to Branch (optional)
  RolePermission.belongsTo(Branch, {
    foreignKey: 'branch_id',
    as: 'Branch',
  });

  // RolePermission belongs to User (created_by)
  RolePermission.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'CreatedBy',
  });

  // RolePermission belongs to User (updated_by)
  RolePermission.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'UpdatedBy',
  });
};

module.exports = {
  RolePermission,
  setupAssociations,
};