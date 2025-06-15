const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PermissionCategory = sequelize.define('PermissionCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  perm_group_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'permission_groups',
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  short_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  enable_view: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  enable_add: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  enable_edit: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  enable_delete: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_system: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  display_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  tableName: 'permission_categories',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { PermissionGroup } = require('./PermissionGroup');

  // PermissionCategory belongs to PermissionGroup
  PermissionCategory.belongsTo(PermissionGroup, {
    foreignKey: 'perm_group_id',
    as: 'PermissionGroup',
  });
};

module.exports = {
  PermissionCategory,
  setupAssociations,
};
