import permissionsService, { UserRole } from '../permissionsService';

describe('PermissionsService', () => {
  beforeEach(() => {
    // Reset service state before each test
    permissionsService.setCurrentUser({ id: '1', role: 'employee' });
  });

  describe('setCurrentUser and getCurrentUser', () => {
    it('should set and get current user correctly', () => {
      const user = { id: '123', role: 'admin' as UserRole };
      permissionsService.setCurrentUser(user);
      
      expect(permissionsService.getCurrentUser()).toEqual(user);
    });
  });

  describe('getPermissionsForRole', () => {
    it('should return correct permissions for admin role', () => {
      const permissions = permissionsService.getPermissionsForRole('admin');
      
      expect(permissions.role).toBe('admin');
      expect(permissions.canViewWorkAuthorization).toBe(true);
      expect(permissions.canManageBenchResources).toBe(true);
      expect(permissions.canCreateHotlists).toBe(true);
      expect(permissions.canViewAnalytics).toBe(true);
      expect(permissions.canManageSettings).toBe(true);
    });

    it('should return correct permissions for bench_sales role', () => {
      const permissions = permissionsService.getPermissionsForRole('bench_sales');
      
      expect(permissions.role).toBe('bench_sales');
      expect(permissions.canViewWorkAuthorization).toBe(true);
      expect(permissions.canManageBenchResources).toBe(true);
      expect(permissions.canCreateHotlists).toBe(true);
      expect(permissions.canViewAnalytics).toBe(true);
      expect(permissions.canManageSettings).toBe(false);
    });

    it('should return correct permissions for employee role', () => {
      const permissions = permissionsService.getPermissionsForRole('employee');
      
      expect(permissions.role).toBe('employee');
      expect(permissions.canViewWorkAuthorization).toBe(false);
      expect(permissions.canManageBenchResources).toBe(false);
      expect(permissions.canCreateHotlists).toBe(false);
      expect(permissions.canViewAnalytics).toBe(false);
      expect(permissions.canManageSettings).toBe(false);
    });
  });

  describe('hasPermission', () => {
    it('should grant all permissions to admin', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'admin' });
      
      expect(permissionsService.hasPermission('bench_resources', 'read')).toBe(true);
      expect(permissionsService.hasPermission('bench_resources', 'create')).toBe(true);
      expect(permissionsService.hasPermission('hotlists', 'delete')).toBe(true);
      expect(permissionsService.hasPermission('settings', 'update')).toBe(true);
    });

    it('should respect bench_sales permissions', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'bench_sales' });
      
      expect(permissionsService.hasPermission('bench_resources', 'read')).toBe(true);
      expect(permissionsService.hasPermission('bench_resources', 'create')).toBe(true);
      expect(permissionsService.hasPermission('hotlists', 'read')).toBe(true);
      expect(permissionsService.hasPermission('settings', 'update')).toBe(false);
    });

    it('should respect employee permissions', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'employee' });
      
      expect(permissionsService.hasPermission('bench_resources', 'read')).toBe(true); // with own_only condition
      expect(permissionsService.hasPermission('bench_resources', 'create')).toBe(false);
      expect(permissionsService.hasPermission('hotlists', 'read')).toBe(false);
      expect(permissionsService.hasPermission('settings', 'read')).toBe(false);
    });

    it('should handle own_only conditions correctly', () => {
      permissionsService.setCurrentUser({ id: '123', role: 'employee' });
      
      // Should allow access to own resources
      expect(permissionsService.hasPermission('bench_resources', 'read', { employeeId: '123' })).toBe(true);
      
      // Should deny access to other's resources
      expect(permissionsService.hasPermission('bench_resources', 'read', { employeeId: '456' })).toBe(false);
    });

    it('should handle own_accounts_only conditions correctly', () => {
      permissionsService.setCurrentUser({ 
        id: '1', 
        role: 'account_manager', 
        accountIds: ['acc1', 'acc2'] 
      });
      
      // Should allow access to own accounts
      expect(permissionsService.hasPermission('hotlists', 'create', { accountId: 'acc1' })).toBe(true);
      
      // Should deny access to other accounts
      expect(permissionsService.hasPermission('hotlists', 'create', { accountId: 'acc3' })).toBe(false);
    });
  });

  describe('specific permission methods', () => {
    it('should check work authorization visibility correctly', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'bench_sales' });
      expect(permissionsService.canViewWorkAuthorization()).toBe(true);
      
      permissionsService.setCurrentUser({ id: '1', role: 'employee' });
      expect(permissionsService.canViewWorkAuthorization()).toBe(false);
    });

    it('should check bench resource management correctly', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'bench_sales' });
      expect(permissionsService.canManageBenchResources()).toBe(true);
      
      permissionsService.setCurrentUser({ id: '1', role: 'recruiter' });
      expect(permissionsService.canManageBenchResources()).toBe(false);
    });

    it('should check hotlist creation correctly', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'bench_sales' });
      expect(permissionsService.canCreateHotlists()).toBe(true);
      
      permissionsService.setCurrentUser({ id: '1', role: 'cio_cto' });
      expect(permissionsService.canCreateHotlists()).toBe(false);
    });

    it('should check analytics access correctly', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'bench_sales' });
      expect(permissionsService.canViewAnalytics()).toBe(true);
      
      permissionsService.setCurrentUser({ id: '1', role: 'employee' });
      expect(permissionsService.canViewAnalytics()).toBe(false);
    });

    it('should check settings management correctly', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'admin' });
      expect(permissionsService.canManageSettings()).toBe(true);
      
      permissionsService.setCurrentUser({ id: '1', role: 'bench_sales' });
      expect(permissionsService.canManageSettings()).toBe(false);
    });
  });

  describe('data filtering', () => {
    it('should filter bench resources correctly for admin', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'admin' });
      
      const resources = [
        { id: '1', employeeId: '123' },
        { id: '2', employeeId: '456' },
        { id: '3', employeeId: '789' }
      ];
      
      const filtered = permissionsService.filterBenchResources(resources);
      expect(filtered).toHaveLength(3);
    });

    it('should filter bench resources correctly for employee', () => {
      permissionsService.setCurrentUser({ id: '123', role: 'employee' });
      
      const resources = [
        { id: '1', employeeId: '123' },
        { id: '2', employeeId: '456' },
        { id: '3', employeeId: '789' }
      ];
      
      const filtered = permissionsService.filterBenchResources(resources);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].employeeId).toBe('123');
    });

    it('should filter hotlists correctly for account manager', () => {
      permissionsService.setCurrentUser({ 
        id: '1', 
        role: 'account_manager', 
        accountIds: ['acc1', 'acc2'] 
      });
      
      const hotlists = [
        { id: '1', accountId: 'acc1', createdBy: '1' },
        { id: '2', accountId: 'acc2', createdBy: '2' },
        { id: '3', accountId: 'acc3', createdBy: '3' }
      ];
      
      const filtered = permissionsService.filterHotlists(hotlists);
      expect(filtered).toHaveLength(2);
      expect(filtered.map(h => h.accountId)).toEqual(['acc1', 'acc2']);
    });
  });

  describe('menu access', () => {
    it('should check menu access correctly for different roles', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'bench_sales' });
      expect(permissionsService.canAccessMenuItem('bench_resources')).toBe(true);
      expect(permissionsService.canAccessMenuItem('hotlist_management')).toBe(true);
      expect(permissionsService.canAccessMenuItem('analytics')).toBe(true);
      expect(permissionsService.canAccessMenuItem('settings')).toBe(false);
      
      permissionsService.setCurrentUser({ id: '1', role: 'employee' });
      expect(permissionsService.canAccessMenuItem('bench_resources')).toBe(true);
      expect(permissionsService.canAccessMenuItem('hotlist_management')).toBe(false);
      expect(permissionsService.canAccessMenuItem('analytics')).toBe(false);
      expect(permissionsService.canAccessMenuItem('settings')).toBe(false);
    });
  });

  describe('role display names', () => {
    it('should return correct display names for roles', () => {
      expect(permissionsService.getRoleDisplayName('admin')).toBe('Administrator');
      expect(permissionsService.getRoleDisplayName('bench_sales')).toBe('Bench Sales');
      expect(permissionsService.getRoleDisplayName('account_manager')).toBe('Account Manager');
      expect(permissionsService.getRoleDisplayName('cio_cto')).toBe('CIO/CTO');
      expect(permissionsService.getRoleDisplayName('recruiter')).toBe('Recruiter');
      expect(permissionsService.getRoleDisplayName('hr')).toBe('HR');
      expect(permissionsService.getRoleDisplayName('employee')).toBe('Employee');
    });
  });

  describe('available actions', () => {
    it('should return correct available actions for admin', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'admin' });
      
      const actions = permissionsService.getAvailableActions('bench_resources');
      expect(actions).toEqual(['read', 'create', 'update', 'delete']);
    });

    it('should return correct available actions for employee', () => {
      permissionsService.setCurrentUser({ id: '1', role: 'employee' });
      
      const actions = permissionsService.getAvailableActions('bench_resources');
      expect(actions).toEqual(['read']); // Only read with conditions
    });
  });
});
