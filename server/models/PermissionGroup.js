const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PermissionGroup = sequelize.define('PermissionGroup', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id',
    },
  },
}, {
  tableName: 'permission_groups',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { User } = require('./User');
  const { PermissionCategory } = require('./PermissionCategory');

  // PermissionGroup belongs to User (created_by)
  PermissionGroup.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'CreatedBy',
  });

  // PermissionGroup belongs to User (updated_by)
  PermissionGroup.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'UpdatedBy',
  });

  // PermissionGroup has many PermissionCategories
  PermissionGroup.hasMany(PermissionCategory, {
    foreignKey: 'perm_group_id',
    as: 'PermissionCategories',
  });
};

module.exports = {
  PermissionGroup,
  setupAssociations,
};
