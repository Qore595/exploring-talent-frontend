const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  employee_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true,
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  branch_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'branches',
      key: 'id',
    },
  },
  department_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'departments',
      key: 'id',
    },
  },
  designation_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'designations',
      key: 'id',
    },
  },
  position: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  qualification: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  work_experience: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hire_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  date_of_leaving: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  employment_status: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'intern', 'terminated'),
    allowNull: true,
    defaultValue: 'full-time',
  },
  contract_type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  work_shift: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  current_location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reporting_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  emergency_contact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  emergency_contact_relation: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  marital_status: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  father_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  mother_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  local_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  permanent_address: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bank_account_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bank_account_no: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bank_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bank_branch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ifsc_code: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  basic_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  facebook: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  twitter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedin: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  instagram: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  joining_letter: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  other_documents: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_superadmin: {
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
    allowNull: true,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  tableName: 'employees',
  timestamps: true,
  paranoid: true, // Enables soft deletes
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  hooks: {
    beforeCreate: async (employee) => {
      if (employee.password) {
        const bcrypt = require('bcryptjs');
        employee.password = await bcrypt.hash(employee.password, 10);
      }
    },
    beforeUpdate: async (employee) => {
      if (employee.changed('password') && employee.password) {
        const bcrypt = require('bcryptjs');
        employee.password = await bcrypt.hash(employee.password, 10);
      }
    },
  },
});

// Define associations in a separate function to avoid circular dependencies
const setupAssociations = () => {
  const { Branch } = require('./Branch');
  const { Department } = require('./Department');
  const { Designation } = require('./Designation');
  const { User } = require('./User');
  const { EmployeeRole } = require('./EmployeeRole');

  // Employee belongs to Branch
  Employee.belongsTo(Branch, {
    foreignKey: 'branch_id',
    as: 'Branch',
  });

  // Employee belongs to Department
  Employee.belongsTo(Department, {
    foreignKey: 'department_id',
    as: 'Department',
  });

  // Employee belongs to Designation
  Employee.belongsTo(Designation, {
    foreignKey: 'designation_id',
    as: 'Designation',
  });

  // Employee belongs to Employee (manager)
  Employee.belongsTo(Employee, {
    foreignKey: 'reporting_to',
    as: 'Manager',
  });

  // Employee has many Employees (subordinates)
  Employee.hasMany(Employee, {
    foreignKey: 'reporting_to',
    as: 'Subordinates',
  });

  // Employee has many EmployeeRoles
  Employee.hasMany(EmployeeRole, {
    foreignKey: 'employee_id',
    as: 'EmployeeRoles',
  });

  // Employee belongs to User (created_by)
  Employee.belongsTo(User, {
    foreignKey: 'created_by',
    as: 'Creator',
  });

  // Employee has many RefreshTokens
  const { RefreshToken } = require('./RefreshToken');
  Employee.hasMany(RefreshToken, {
    foreignKey: 'employee_id',
    as: 'RefreshTokens',
  });
};

module.exports = {
  Employee,
  setupAssociations,
};
