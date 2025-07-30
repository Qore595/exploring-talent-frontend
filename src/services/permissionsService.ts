// Role-based access control service for bench resources and hotlist management

export type UserRole = 'admin' | 'bench_sales' | 'account_manager' | 'cio_cto' | 'recruiter' | 'hr' | 'employee';

export interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

export interface UserPermissions {
  role: UserRole;
  permissions: Permission[];
  canViewWorkAuthorization: boolean;
  canManageBenchResources: boolean;
  canCreateHotlists: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
}

// Define role-based permissions
const rolePermissions: Record<UserRole, UserPermissions> = {
  admin: {
    role: 'admin',
    permissions: [
      { resource: '*', action: '*' }
    ],
    canViewWorkAuthorization: true,
    canManageBenchResources: true,
    canCreateHotlists: true,
    canViewAnalytics: true,
    canManageSettings: true
  },
  
  bench_sales: {
    role: 'bench_sales',
    permissions: [
      { resource: 'bench_resources', action: 'read' },
      { resource: 'bench_resources', action: 'create' },
      { resource: 'bench_resources', action: 'update' },
      { resource: 'hotlists', action: 'read' },
      { resource: 'hotlists', action: 'create' },
      { resource: 'hotlists', action: 'update' },
      { resource: 'analytics', action: 'read' },
      { resource: 'work_authorization', action: 'read' }
    ],
    canViewWorkAuthorization: true,
    canManageBenchResources: true,
    canCreateHotlists: true,
    canViewAnalytics: true,
    canManageSettings: false
  },
  
  account_manager: {
    role: 'account_manager',
    permissions: [
      { resource: 'bench_resources', action: 'read' },
      { resource: 'bench_resources', action: 'update', conditions: { own_accounts_only: true } },
      { resource: 'hotlists', action: 'read' },
      { resource: 'hotlists', action: 'create', conditions: { own_accounts_only: true } },
      { resource: 'analytics', action: 'read', conditions: { own_accounts_only: true } },
      { resource: 'work_authorization', action: 'read' }
    ],
    canViewWorkAuthorization: true,
    canManageBenchResources: true,
    canCreateHotlists: true,
    canViewAnalytics: true,
    canManageSettings: false
  },
  
  cio_cto: {
    role: 'cio_cto',
    permissions: [
      { resource: 'bench_resources', action: 'read' },
      { resource: 'bench_resources', action: 'create' },
      { resource: 'bench_resources', action: 'update' },
      { resource: 'hotlists', action: 'read' },
      { resource: 'analytics', action: 'read' },
      { resource: 'settings', action: 'read' },
      { resource: 'settings', action: 'update' },
      { resource: 'work_authorization', action: 'read' }
    ],
    canViewWorkAuthorization: true,
    canManageBenchResources: true,
    canCreateHotlists: false,
    canViewAnalytics: true,
    canManageSettings: true
  },
  
  recruiter: {
    role: 'recruiter',
    permissions: [
      { resource: 'bench_resources', action: 'read' },
      { resource: 'hotlists', action: 'read' },
      { resource: 'analytics', action: 'read', conditions: { limited: true } }
    ],
    canViewWorkAuthorization: false,
    canManageBenchResources: false,
    canCreateHotlists: false,
    canViewAnalytics: true,
    canManageSettings: false
  },
  
  hr: {
    role: 'hr',
    permissions: [
      { resource: 'bench_resources', action: 'read' },
      { resource: 'analytics', action: 'read', conditions: { limited: true } }
    ],
    canViewWorkAuthorization: false,
    canManageBenchResources: false,
    canCreateHotlists: false,
    canViewAnalytics: true,
    canManageSettings: false
  },
  
  employee: {
    role: 'employee',
    permissions: [
      { resource: 'bench_resources', action: 'read', conditions: { own_only: true } }
    ],
    canViewWorkAuthorization: false,
    canManageBenchResources: false,
    canCreateHotlists: false,
    canViewAnalytics: false,
    canManageSettings: false
  }
};

class PermissionsService {
  private currentUser: { id: string; role: UserRole; accountIds?: string[] } | null = null;

  // Set current user context
  setCurrentUser(user: { id: string; role: UserRole; accountIds?: string[] }) {
    this.currentUser = user;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Get permissions for a role
  getPermissionsForRole(role: UserRole): UserPermissions {
    return rolePermissions[role];
  }

  // Get current user permissions
  getCurrentUserPermissions(): UserPermissions | null {
    if (!this.currentUser) return null;
    return this.getPermissionsForRole(this.currentUser.role);
  }

  // Check if user has permission for a specific action
  hasPermission(resource: string, action: string, context?: Record<string, any>): boolean {
    if (!this.currentUser) return false;

    const permissions = this.getCurrentUserPermissions();
    if (!permissions) return false;

    // Admin has all permissions
    if (this.currentUser.role === 'admin') return true;

    // Check specific permissions
    const hasPermission = permissions.permissions.some(permission => {
      // Wildcard permissions
      if (permission.resource === '*' && permission.action === '*') return true;
      if (permission.resource === resource && permission.action === '*') return true;
      if (permission.resource === '*' && permission.action === action) return true;
      
      // Exact match
      if (permission.resource === resource && permission.action === action) {
        // Check conditions if any
        if (permission.conditions) {
          return this.checkConditions(permission.conditions, context);
        }
        return true;
      }
      
      return false;
    });

    return hasPermission;
  }

  // Check permission conditions
  private checkConditions(conditions: Record<string, any>, context?: Record<string, any>): boolean {
    if (!context) return true;

    // Check own_accounts_only condition
    if (conditions.own_accounts_only && this.currentUser?.accountIds) {
      const resourceAccountId = context.accountId;
      if (resourceAccountId && !this.currentUser.accountIds.includes(resourceAccountId)) {
        return false;
      }
    }

    // Check own_only condition
    if (conditions.own_only && this.currentUser?.id) {
      const resourceUserId = context.userId || context.employeeId;
      if (resourceUserId && resourceUserId !== this.currentUser.id) {
        return false;
      }
    }

    return true;
  }

  // Specific permission checks for UI components
  canViewWorkAuthorization(): boolean {
    const permissions = this.getCurrentUserPermissions();
    return permissions?.canViewWorkAuthorization || false;
  }

  canManageBenchResources(): boolean {
    const permissions = this.getCurrentUserPermissions();
    return permissions?.canManageBenchResources || false;
  }

  canCreateBenchResource(): boolean {
    return this.hasPermission('bench_resources', 'create');
  }

  canUpdateBenchResource(resourceContext?: Record<string, any>): boolean {
    return this.hasPermission('bench_resources', 'update', resourceContext);
  }

  canDeleteBenchResource(resourceContext?: Record<string, any>): boolean {
    return this.hasPermission('bench_resources', 'delete', resourceContext);
  }

  canCreateHotlists(): boolean {
    const permissions = this.getCurrentUserPermissions();
    return permissions?.canCreateHotlists || false;
  }

  canCreateHotlist(hotlistContext?: Record<string, any>): boolean {
    return this.hasPermission('hotlists', 'create', hotlistContext);
  }

  canUpdateHotlist(hotlistContext?: Record<string, any>): boolean {
    return this.hasPermission('hotlists', 'update', hotlistContext);
  }

  canDeleteHotlist(hotlistContext?: Record<string, any>): boolean {
    return this.hasPermission('hotlists', 'delete', hotlistContext);
  }

  canViewAnalytics(analyticsContext?: Record<string, any>): boolean {
    const permissions = this.getCurrentUserPermissions();
    if (!permissions?.canViewAnalytics) return false;
    return this.hasPermission('analytics', 'read', analyticsContext);
  }

  canManageSettings(): boolean {
    const permissions = this.getCurrentUserPermissions();
    return permissions?.canManageSettings || false;
  }

  canViewAutoEnrollmentSettings(): boolean {
    return this.hasPermission('settings', 'read') && this.canManageSettings();
  }

  canUpdateAutoEnrollmentSettings(): boolean {
    return this.hasPermission('settings', 'update') && this.canManageSettings();
  }

  // Filter data based on permissions
  filterBenchResources<T extends { employeeId?: string; accountId?: string }>(resources: T[]): T[] {
    if (!this.currentUser) return [];

    const permissions = this.getCurrentUserPermissions();
    if (!permissions) return [];

    // Admin sees all
    if (this.currentUser.role === 'admin') return resources;

    return resources.filter(resource => {
      const context = {
        employeeId: resource.employeeId,
        accountId: resource.accountId,
        userId: resource.employeeId
      };
      return this.hasPermission('bench_resources', 'read', context);
    });
  }

  filterHotlists<T extends { createdBy?: string; accountId?: string }>(hotlists: T[]): T[] {
    if (!this.currentUser) return [];

    const permissions = this.getCurrentUserPermissions();
    if (!permissions) return [];

    // Admin sees all
    if (this.currentUser.role === 'admin') return hotlists;

    return hotlists.filter(hotlist => {
      const context = {
        userId: hotlist.createdBy,
        accountId: hotlist.accountId
      };
      return this.hasPermission('hotlists', 'read', context);
    });
  }

  // Get role display name
  getRoleDisplayName(role: UserRole): string {
    const roleNames: Record<UserRole, string> = {
      admin: 'Administrator',
      bench_sales: 'Bench Sales',
      account_manager: 'Account Manager',
      cio_cto: 'CIO/CTO',
      recruiter: 'Recruiter',
      hr: 'HR',
      employee: 'Employee'
    };
    return roleNames[role] || role;
  }

  // Get available actions for a resource
  getAvailableActions(resource: string, context?: Record<string, any>): string[] {
    const actions = ['read', 'create', 'update', 'delete'];
    return actions.filter(action => this.hasPermission(resource, action, context));
  }

  // Check if user can access a specific menu item
  canAccessMenuItem(menuItem: string): boolean {
    switch (menuItem) {
      case 'bench_resources':
        return this.hasPermission('bench_resources', 'read');
      case 'hotlist_management':
        return this.hasPermission('hotlists', 'read');
      case 'analytics':
        return this.canViewAnalytics();
      case 'settings':
        return this.canManageSettings();
      default:
        return false;
    }
  }
}

// Create and export service instance
const permissionsService = new PermissionsService();
export default permissionsService;
