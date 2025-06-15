const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RefreshToken = sequelize.define('RefreshToken', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false,
    unique: true,
  },
  employee_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  is_revoked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  created_by_ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  revoked_by_ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  replaced_by_token: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
}, {
  tableName: 'refresh_tokens',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Employee } = require('./Employee');

  // RefreshToken belongs to Employee
  RefreshToken.belongsTo(Employee, {
    foreignKey: 'employee_id',
    as: 'Employee',
  });
};

module.exports = {
  RefreshToken,
  setupAssociations,
};
