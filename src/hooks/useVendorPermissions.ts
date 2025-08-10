// Vendor Hub Permissions Hook
import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  VendorHubPermission,
  VendorHubRole,
  VendorHubUserPermissions,
  PermissionContext,
  AuditEvent,
  AuditEventType
} from '@/types/vendorPermissions';
import { vendorPermissionsService } from '@/services/vendorPermissionsService';

// Permissions Context
interface VendorPermissionsContextType {
  permissions: VendorHubUserPermissions | null;
  hasPermission: (permission: VendorHubPermission, context?: Partial<PermissionContext>) => boolean;
  hasAnyPermission: (permissions: VendorHubPermission[], context?: Partial<PermissionContext>) => boolean;
  hasAllPermissions: (permissions: VendorHubPermission[], context?: Partial<PermissionContext>) => boolean;
  hasRole: (role: VendorHubRole) => boolean;
  hasAnyRole: (roles: VendorHubRole[]) => boolean;
  isLoading: boolean;
  error: Error | null;
  logAuditEvent: (
    eventType: AuditEventType,
    action: string,
    details: Record<string, any>,
    resourceType?: 'vendor' | 'poc' | 'communication' | 'validation' | 'consent',
    resourceId?: string
  ) => Promise<void>;
}

const VendorPermissionsContext = createContext<VendorPermissionsContextType | null>(null);

// Permissions Provider Component
export const VendorPermissionsProvider: React.FC<{ 
  children: React.ReactNode;
  userId: string;
}> = ({ children, userId }) => {
  const [permissions, setPermissions] = useState<VendorHubUserPermissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Initialize permissions
  useEffect(() => {
    const initializePermissions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userPermissions = await vendorPermissionsService.initializePermissions(userId);
        setPermissions(userPermissions);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      initializePermissions();
    }
  }, [userId]);

  // Permission check functions
  const hasPermission = useCallback((permission: VendorHubPermission, context?: Partial<PermissionContext>) => {
    return vendorPermissionsService.hasPermission(permission, context);
  }, []);

  const hasAnyPermission = useCallback((permissions: VendorHubPermission[], context?: Partial<PermissionContext>) => {
    return vendorPermissionsService.hasAnyPermission(permissions, context);
  }, []);

  const hasAllPermissions = useCallback((permissions: VendorHubPermission[], context?: Partial<PermissionContext>) => {
    return vendorPermissionsService.hasAllPermissions(permissions, context);
  }, []);

  const hasRole = useCallback((role: VendorHubRole) => {
    return vendorPermissionsService.hasRole(role);
  }, []);

  const hasAnyRole = useCallback((roles: VendorHubRole[]) => {
    return vendorPermissionsService.hasAnyRole(roles);
  }, []);

  const logAuditEvent = useCallback(async (
    eventType: AuditEventType,
    action: string,
    details: Record<string, any>,
    resourceType?: 'vendor' | 'poc' | 'communication' | 'validation' | 'consent',
    resourceId?: string
  ) => {
    await vendorPermissionsService.logAuditEvent(
      eventType,
      action,
      details,
      resourceType,
      resourceId
    );
  }, []);

  const contextValue: VendorPermissionsContextType = {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isLoading,
    error,
    logAuditEvent
  };

  return (
    <VendorPermissionsContext.Provider value={contextValue}>
      {children}
    </VendorPermissionsContext.Provider>
  );
};

// Main permissions hook
export const useVendorPermissions = () => {
  const context = useContext(VendorPermissionsContext);
  if (!context) {
    throw new Error('useVendorPermissions must be used within a VendorPermissionsProvider');
  }
  return context;
};

// Specific permission hooks
export const useHasPermission = (permission: VendorHubPermission, context?: Partial<PermissionContext>) => {
  const { hasPermission } = useVendorPermissions();
  return hasPermission(permission, context);
};

export const useHasAnyPermission = (permissions: VendorHubPermission[], context?: Partial<PermissionContext>) => {
  const { hasAnyPermission } = useVendorPermissions();
  return hasAnyPermission(permissions, context);
};

export const useHasRole = (role: VendorHubRole) => {
  const { hasRole } = useVendorPermissions();
  return hasRole(role);
};

// Permission-based component wrapper hook
export const usePermissionGuard = (
  permission: VendorHubPermission | VendorHubPermission[],
  context?: Partial<PermissionContext>
) => {
  const { hasPermission, hasAnyPermission } = useVendorPermissions();
  
  const isAllowed = Array.isArray(permission) 
    ? hasAnyPermission(permission, context)
    : hasPermission(permission, context);

  return {
    isAllowed,
    PermissionGuard: ({ children, fallback }: { 
      children: React.ReactNode; 
      fallback?: React.ReactNode;
    }) => {
      if (isAllowed) {
        return <>{children}</>;
      }
      return <>{fallback || null}</>;
    }
  };
};

// Audit events hook
export const useAuditEvents = (filters?: {
  eventType?: AuditEventType;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  dateFrom?: Date;
  dateTo?: Date;
}) => {
  const { hasPermission } = useVendorPermissions();
  
  const auditQuery = useQuery({
    queryKey: ['audit-events', filters],
    queryFn: () => vendorPermissionsService.getAuditEvents(filters),
    enabled: hasPermission('audit:view'),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  return {
    auditEvents: auditQuery.data || [],
    isLoading: auditQuery.isLoading,
    error: auditQuery.error,
    refetch: auditQuery.refetch,
    canViewAudit: hasPermission('audit:view')
  };
};

// Role management hook (for admin users)
export const useRoleManagement = () => {
  const { hasPermission, logAuditEvent } = useVendorPermissions();
  const queryClient = useQueryClient();

  const canManageRoles = hasPermission('admin:user_management');

  const assignRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: VendorHubRole }) => {
      if (!canManageRoles) {
        throw new Error('Insufficient permissions to manage roles');
      }
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await logAuditEvent(
        'permission_granted',
        'Role assigned',
        { userId, role, assignedBy: 'current_user' },
        undefined,
        userId
      );
      
      return { userId, role };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    }
  });

  const revokeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: VendorHubRole }) => {
      if (!canManageRoles) {
        throw new Error('Insufficient permissions to manage roles');
      }
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await logAuditEvent(
        'permission_revoked',
        'Role revoked',
        { userId, role, revokedBy: 'current_user' },
        undefined,
        userId
      );
      
      return { userId, role };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions'] });
    }
  });

  return {
    canManageRoles,
    assignRole: assignRoleMutation.mutate,
    revokeRole: revokeRoleMutation.mutate,
    isAssigning: assignRoleMutation.isPending,
    isRevoking: revokeRoleMutation.isPending,
    assignError: assignRoleMutation.error,
    revokeError: revokeRoleMutation.error
  };
};

// Security validation hook
export const useSecurityValidation = () => {
  const { hasPermission, logAuditEvent } = useVendorPermissions();

  const validateAction = useCallback(async (
    action: VendorHubPermission,
    context?: Partial<PermissionContext>,
    auditDetails?: Record<string, any>
  ) => {
    const isAllowed = hasPermission(action, context);
    
    if (!isAllowed) {
      await logAuditEvent(
        'unauthorized_access',
        `Attempted ${action}`,
        { 
          action, 
          context, 
          reason: 'Insufficient permissions',
          ...auditDetails 
        }
      );
      throw new Error(`Permission denied: ${action}`);
    }

    // Log successful permission check for sensitive actions
    const sensitiveActions: VendorHubPermission[] = [
      'vendor:delete',
      'poc:delete',
      'consent:revoke',
      'admin:settings',
      'admin:user_management'
    ];

    if (sensitiveActions.includes(action)) {
      await logAuditEvent(
        'permission_granted',
        `Authorized ${action}`,
        { action, context, ...auditDetails }
      );
    }

    return true;
  }, [hasPermission, logAuditEvent]);

  return { validateAction };
};

// Permission-based navigation hook
export const usePermissionBasedNavigation = () => {
  const { hasPermission } = useVendorPermissions();

  const getAvailableRoutes = useCallback(() => {
    const routes = [
      {
        path: '/vendor-hub/dashboard',
        label: 'Dashboard',
        permission: 'dashboard:view' as VendorHubPermission
      },
      {
        path: '/vendor-hub/vendors',
        label: 'Vendor Registry',
        permission: 'vendor:view' as VendorHubPermission
      },
      {
        path: '/vendor-hub/pocs',
        label: 'PoC Management',
        permission: 'poc:view' as VendorHubPermission
      },
      {
        path: '/vendor-hub/validation-reminders',
        label: 'Validation Reminders',
        permission: 'validation:view' as VendorHubPermission
      },
      {
        path: '/vendor-hub/communication-logs',
        label: 'Communication Logs',
        permission: 'communication:view' as VendorHubPermission
      },
      {
        path: '/vendor-hub/reports',
        label: 'Reports & Analytics',
        permission: 'dashboard:reports' as VendorHubPermission
      },
      {
        path: '/vendor-hub/settings',
        label: 'Settings',
        permission: 'admin:settings' as VendorHubPermission
      }
    ];

    return routes.filter(route => hasPermission(route.permission));
  }, [hasPermission]);

  return { getAvailableRoutes };
};
