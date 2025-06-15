const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define('Branch', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  postal_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
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
  tableName: 'branches',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Department } = require('./Department');
  const { Designation } = require('./Designation');
  const { Role } = require('./Role');
  const { User } = require('./User');

  // Branch has many Departments
  Branch.hasMany(Department, {
    foreignKey: 'branch_id',
    as: 'Departments',
  });

  // Branch has many Designations
  Branch.hasMany(Designation, {
    foreignKey: 'branch_id',
    as: 'Designations',
  });

  // Branch has many Roles
  Branch.hasMany(Role, {
    foreignKey: 'branch_id',
    as: 'Roles',
  });

  // Branch belongs to User (created_by)
  Branch.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });

  // Branch belongs to User (updated_by)
  Branch.belongsTo(User, {
    foreignKey: 'updated_by',
    as: 'Updater',
  });
};

module.exports = {
  Branch,
  setupAssociations,
};
