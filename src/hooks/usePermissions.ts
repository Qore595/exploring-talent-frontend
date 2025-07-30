import React, { useContext, createContext, ReactNode, useEffect, useState } from 'react';
import permissionsService, { UserRole, UserPermissions } from '@/services/permissionsService';

interface PermissionsContextType {
  currentUser: { id: string; role: UserRole; accountIds?: string[] } | null;
  permissions: UserPermissions | null;
  hasPermission: (resource: string, action: string, context?: Record<string, any>) => boolean;
  canViewWorkAuthorization: () => boolean;
  canManageBenchResources: () => boolean;
  canCreateBenchResource: () => boolean;
  canUpdateBenchResource: (context?: Record<string, any>) => boolean;
  canDeleteBenchResource: (context?: Record<string, any>) => boolean;
  canCreateHotlists: () => boolean;
  canCreateHotlist: (context?: Record<string, any>) => boolean;
  canUpdateHotlist: (context?: Record<string, any>) => boolean;
  canDeleteHotlist: (context?: Record<string, any>) => boolean;
  canViewAnalytics: (context?: Record<string, any>) => boolean;
  canManageSettings: () => boolean;
  canViewAutoEnrollmentSettings: () => boolean;
  canUpdateAutoEnrollmentSettings: () => boolean;
  canAccessMenuItem: (menuItem: string) => boolean;
  filterBenchResources: <T extends { employeeId?: string; accountId?: string }>(resources: T[]) => T[];
  filterHotlists: <T extends { createdBy?: string; accountId?: string }>(hotlists: T[]) => T[];
  setCurrentUser: (user: { id: string; role: UserRole; accountIds?: string[] }) => void;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

interface PermissionsProviderProps {
  children: ReactNode;
  initialUser?: { id: string; role: UserRole; accountIds?: string[] };
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({ 
  children, 
  initialUser 
}) => {
  const [currentUser, setCurrentUserState] = useState<{ id: string; role: UserRole; accountIds?: string[] } | null>(
    initialUser || null
  );
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);

  // Update permissions when user changes
  useEffect(() => {
    if (currentUser) {
      permissionsService.setCurrentUser(currentUser);
      const userPermissions = permissionsService.getCurrentUserPermissions();
      setPermissions(userPermissions);
    } else {
      setPermissions(null);
    }
  }, [currentUser]);

  const setCurrentUser = (user: { id: string; role: UserRole; accountIds?: string[] }) => {
    setCurrentUserState(user);
  };

  const hasPermission = (resource: string, action: string, context?: Record<string, any>) => {
    return permissionsService.hasPermission(resource, action, context);
  };

  const canViewWorkAuthorization = () => {
    return permissionsService.canViewWorkAuthorization();
  };

  const canManageBenchResources = () => {
    return permissionsService.canManageBenchResources();
  };

  const canCreateBenchResource = () => {
    return permissionsService.canCreateBenchResource();
  };

  const canUpdateBenchResource = (context?: Record<string, any>) => {
    return permissionsService.canUpdateBenchResource(context);
  };

  const canDeleteBenchResource = (context?: Record<string, any>) => {
    return permissionsService.canDeleteBenchResource(context);
  };

  const canCreateHotlists = () => {
    return permissionsService.canCreateHotlists();
  };

  const canCreateHotlist = (context?: Record<string, any>) => {
    return permissionsService.canCreateHotlist(context);
  };

  const canUpdateHotlist = (context?: Record<string, any>) => {
    return permissionsService.canUpdateHotlist(context);
  };

  const canDeleteHotlist = (context?: Record<string, any>) => {
    return permissionsService.canDeleteHotlist(context);
  };

  const canViewAnalytics = (context?: Record<string, any>) => {
    return permissionsService.canViewAnalytics(context);
  };

  const canManageSettings = () => {
    return permissionsService.canManageSettings();
  };

  const canViewAutoEnrollmentSettings = () => {
    return permissionsService.canViewAutoEnrollmentSettings();
  };

  const canUpdateAutoEnrollmentSettings = () => {
    return permissionsService.canUpdateAutoEnrollmentSettings();
  };

  const canAccessMenuItem = (menuItem: string) => {
    return permissionsService.canAccessMenuItem(menuItem);
  };

  const filterBenchResources = <T extends { employeeId?: string; accountId?: string }>(resources: T[]) => {
    return permissionsService.filterBenchResources(resources);
  };

  const filterHotlists = <T extends { createdBy?: string; accountId?: string }>(hotlists: T[]) => {
    return permissionsService.filterHotlists(hotlists);
  };

  const value: PermissionsContextType = {
    currentUser,
    permissions,
    hasPermission,
    canViewWorkAuthorization,
    canManageBenchResources,
    canCreateBenchResource,
    canUpdateBenchResource,
    canDeleteBenchResource,
    canCreateHotlists,
    canCreateHotlist,
    canUpdateHotlist,
    canDeleteHotlist,
    canViewAnalytics,
    canManageSettings,
    canViewAutoEnrollmentSettings,
    canUpdateAutoEnrollmentSettings,
    canAccessMenuItem,
    filterBenchResources,
    filterHotlists,
    setCurrentUser
  };

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Hook to use permissions
export const usePermissions = (): PermissionsContextType => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};

// Higher-order component for permission-based rendering
interface WithPermissionProps {
  resource: string;
  action: string;
  context?: Record<string, any>;
  fallback?: ReactNode;
  children: ReactNode;
}

export const WithPermission: React.FC<WithPermissionProps> = ({
  resource,
  action,
  context,
  fallback = null,
  children
}) => {
  const { hasPermission } = usePermissions();
  
  if (hasPermission(resource, action, context)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

// Component for role-based rendering
interface WithRoleProps {
  roles: UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const WithRole: React.FC<WithRoleProps> = ({
  roles,
  fallback = null,
  children
}) => {
  const { currentUser } = usePermissions();
  
  if (currentUser && roles.includes(currentUser.role)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

// Hook for specific permission checks
export const useBenchResourcePermissions = () => {
  const permissions = usePermissions();
  
  return {
    canView: permissions.hasPermission('bench_resources', 'read'),
    canCreate: permissions.canCreateBenchResource(),
    canUpdate: (context?: Record<string, any>) => permissions.canUpdateBenchResource(context),
    canDelete: (context?: Record<string, any>) => permissions.canDeleteBenchResource(context),
    canViewWorkAuth: permissions.canViewWorkAuthorization(),
    canManage: permissions.canManageBenchResources()
  };
};

export const useHotlistPermissions = () => {
  const permissions = usePermissions();
  
  return {
    canView: permissions.hasPermission('hotlists', 'read'),
    canCreate: permissions.canCreateHotlists(),
    canCreateSpecific: (context?: Record<string, any>) => permissions.canCreateHotlist(context),
    canUpdate: (context?: Record<string, any>) => permissions.canUpdateHotlist(context),
    canDelete: (context?: Record<string, any>) => permissions.canDeleteHotlist(context),
    canViewAnalytics: (context?: Record<string, any>) => permissions.canViewAnalytics(context)
  };
};

export const useAnalyticsPermissions = () => {
  const permissions = usePermissions();
  
  return {
    canView: permissions.canViewAnalytics(),
    canViewDetailed: (context?: Record<string, any>) => permissions.canViewAnalytics(context),
    canExport: permissions.hasPermission('analytics', 'export')
  };
};

export const useSettingsPermissions = () => {
  const permissions = usePermissions();
  
  return {
    canView: permissions.canManageSettings(),
    canUpdate: permissions.canUpdateAutoEnrollmentSettings(),
    canViewAutoEnrollment: permissions.canViewAutoEnrollmentSettings(),
    canUpdateAutoEnrollment: permissions.canUpdateAutoEnrollmentSettings()
  };
};

// Utility hook to get user role display information
export const useUserRole = () => {
  const { currentUser, permissions } = usePermissions();
  
  return {
    role: currentUser?.role,
    displayName: currentUser?.role ? permissionsService.getRoleDisplayName(currentUser.role) : null,
    permissions: permissions?.permissions || [],
    isAdmin: currentUser?.role === 'admin',
    isBenchSales: currentUser?.role === 'bench_sales',
    isAccountManager: currentUser?.role === 'account_manager',
    isCioCto: currentUser?.role === 'cio_cto'
  };
};
