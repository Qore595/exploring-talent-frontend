import React, { createContext, useContext, ReactNode } from 'react';

// Mock permissions for development
export interface MockPermissions {
  canViewWorkAuthorization: boolean;
  canManageBenchResources: boolean;
  canCreateBenchResource: boolean;
  canUpdateBenchResource: boolean;
  canDeleteBenchResource: boolean;
  canCreateHotlists: boolean;
  canViewAnalytics: boolean;
  canManageSettings: boolean;
}

const defaultPermissions: MockPermissions = {
  canViewWorkAuthorization: true,
  canManageBenchResources: true,
  canCreateBenchResource: true,
  canUpdateBenchResource: true,
  canDeleteBenchResource: true,
  canCreateHotlists: true,
  canViewAnalytics: true,
  canManageSettings: true,
};

const MockPermissionsContext = createContext<MockPermissions>(defaultPermissions);

interface MockPermissionsProviderProps {
  children: ReactNode;
  permissions?: Partial<MockPermissions>;
}

export const MockPermissionsProvider: React.FC<MockPermissionsProviderProps> = ({
  children,
  permissions = {}
}) => {
  const value = { ...defaultPermissions, ...permissions };

  return (
    <MockPermissionsContext.Provider value={value}>
      {children}
    </MockPermissionsContext.Provider>
  );
};

export const useMockPermissions = (): MockPermissions => {
  const context = useContext(MockPermissionsContext);
  if (context === undefined) {
    throw new Error('useMockPermissions must be used within a MockPermissionsProvider');
  }
  return context;
};

// Mock permission components for development
interface WithMockPermissionProps {
  permission: keyof MockPermissions;
  fallback?: ReactNode;
  children: ReactNode;
}

export const WithMockPermission: React.FC<WithMockPermissionProps> = ({
  permission,
  fallback = null,
  children
}) => {
  const permissions = useMockPermissions();
  
  if (permissions[permission]) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

// Specific permission hooks for different features
export const useBenchResourcePermissions = () => {
  const permissions = useMockPermissions();
  
  return {
    canView: true,
    canCreate: permissions.canCreateBenchResource,
    canUpdate: () => permissions.canUpdateBenchResource,
    canDelete: () => permissions.canDeleteBenchResource,
    canViewWorkAuth: permissions.canViewWorkAuthorization,
    canManage: permissions.canManageBenchResources
  };
};

export const useHotlistPermissions = () => {
  const permissions = useMockPermissions();
  
  return {
    canView: true,
    canCreate: permissions.canCreateHotlists,
    canCreateSpecific: () => permissions.canCreateHotlists,
    canUpdate: () => true,
    canDelete: () => true,
    canViewAnalytics: () => permissions.canViewAnalytics
  };
};

export const useAnalyticsPermissions = () => {
  const permissions = useMockPermissions();
  
  return {
    canView: permissions.canViewAnalytics,
    canViewDetailed: () => permissions.canViewAnalytics,
    canExport: permissions.canViewAnalytics
  };
};

export const useSettingsPermissions = () => {
  const permissions = useMockPermissions();
  
  return {
    canView: permissions.canManageSettings,
    canUpdate: permissions.canManageSettings,
    canViewAutoEnrollment: permissions.canManageSettings,
    canUpdateAutoEnrollment: permissions.canManageSettings
  };
};
