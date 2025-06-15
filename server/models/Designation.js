const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Designation = sequelize.define('Designation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'branches',
      key: 'id',
    },
  },
  short_code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
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
  tableName: 'designations',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Branch } = require('./Branch');
  const { User } = require('./User');

  // Designation belongs to Branch
  Designation.belongsTo(Branch, {
    foreignKey: 'branch_id',
    as: 'Branch',
  });

  // Designation belongs to User (created_by)
  Designation.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });

  // Designation belongs to User (updated_by)
  Designation.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'Updater',
  });
};

module.exports = {
  Designation,
  setupAssociations,
};
