const { PermissionGroup } = require('../models/PermissionGroup');
const { PermissionCategory } = require('../models/PermissionCategory');

// Seed permission groups and categories
const seedPermissions = async () => {
  try {
    console.log('Seeding permission groups and categories...');

    // Check if permission groups already exist
    const existingGroups = await PermissionGroup.count();
    if (existingGroups > 0) {
      console.log('Permission groups already exist. Skipping seeding.');
      return;
    }

    // Create permission groups
    const dashboardGroup = await PermissionGroup.create({
      name: 'Dashboard',
      short_code: 'dashboard',
      description: 'Dashboard access permissions',
      is_system: true,
      is_active: true,
      created_by: 1,
    });

    const userManagementGroup = await PermissionGroup.create({
      name: 'User Management',
      short_code: 'user_management',
      description: 'User management permissions',
      is_system: true,
      is_active: true,
      created_by: 1,
    });

    const roleManagementGroup = await PermissionGroup.create({
      name: 'Role Management',
      short_code: 'role_management',
      description: 'Role management permissions',
      is_system: true,
      is_active: true,
      created_by: 1,
    });

    // Create permission categories for Dashboard
    await PermissionCategory.create({
      perm_group_id: dashboardGroup.id,
      name: 'View Dashboard',
      short_code: 'view_dashboard',
      description: 'Permission to view dashboard',
      enable_view: true,
      enable_add: false,
      enable_edit: false,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 1,
    });

    // Create permission categories for User Management
    await PermissionCategory.create({
      perm_group_id: userManagementGroup.id,
      name: 'View Users',
      short_code: 'view_users',
      description: 'Permission to view users',
      enable_view: true,
      enable_add: false,
      enable_edit: false,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 1,
    });

    await PermissionCategory.create({
      perm_group_id: userManagementGroup.id,
      name: 'Add Users',
      short_code: 'add_users',
      description: 'Permission to add users',
      enable_view: false,
      enable_add: true,
      enable_edit: false,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 2,
    });

    await PermissionCategory.create({
      perm_group_id: userManagementGroup.id,
      name: 'Edit Users',
      short_code: 'edit_users',
      description: 'Permission to edit users',
      enable_view: false,
      enable_add: false,
      enable_edit: true,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 3,
    });

    await PermissionCategory.create({
      perm_group_id: userManagementGroup.id,
      name: 'Delete Users',
      short_code: 'delete_users',
      description: 'Permission to delete users',
      enable_view: false,
      enable_add: false,
      enable_edit: false,
      enable_delete: true,
      is_system: true,
      is_active: true,
      display_order: 4,
    });

    // Create permission categories for Role Management
    await PermissionCategory.create({
      perm_group_id: roleManagementGroup.id,
      name: 'View Roles',
      short_code: 'view_roles',
      description: 'Permission to view roles',
      enable_view: true,
      enable_add: false,
      enable_edit: false,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 1,
    });

    await PermissionCategory.create({
      perm_group_id: roleManagementGroup.id,
      name: 'Add Roles',
      short_code: 'add_roles',
      description: 'Permission to add roles',
      enable_view: false,
      enable_add: true,
      enable_edit: false,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 2,
    });

    await PermissionCategory.create({
      perm_group_id: roleManagementGroup.id,
      name: 'Edit Roles',
      short_code: 'edit_roles',
      description: 'Permission to edit roles',
      enable_view: false,
      enable_add: false,
      enable_edit: true,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 3,
    });

    await PermissionCategory.create({
      perm_group_id: roleManagementGroup.id,
      name: 'Delete Roles',
      short_code: 'delete_roles',
      description: 'Permission to delete roles',
      enable_view: false,
      enable_add: false,
      enable_edit: false,
      enable_delete: true,
      is_system: true,
      is_active: true,
      display_order: 4,    });

    // Create Report Access permission group
    const reportAccessGroup = await PermissionGroup.create({
      name: 'Report Access',
      short_code: 'report_access',
      description: 'Report access and management permissions',
      is_system: true,
      is_active: true,
      created_by: 1,
    });

    // Create permission categories for Report Access
    await PermissionCategory.create({
      perm_group_id: reportAccessGroup.id,
      name: 'View Reports',
      short_code: 'view_reports',
      description: 'Permission to view reports',
      enable_view: true,
      enable_add: false,
      enable_edit: false,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 1,
    });

    await PermissionCategory.create({
      perm_group_id: reportAccessGroup.id,
      name: 'Generate Reports',
      short_code: 'generate_reports',
      description: 'Permission to generate reports',
      enable_view: false,
      enable_add: true,
      enable_edit: false,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 2,
    });

    await PermissionCategory.create({
      perm_group_id: reportAccessGroup.id,
      name: 'Export Reports',
      short_code: 'export_reports',
      description: 'Permission to export reports',
      enable_view: false,
      enable_add: false,
      enable_edit: true,
      enable_delete: false,
      is_system: true,
      is_active: true,
      display_order: 3,
    });

    console.log('Permission groups and categories seeded successfully.');
  } catch (error) {
    console.error('Error seeding permission groups and categories:', error);
  }
};

module.exports = seedPermissions;
