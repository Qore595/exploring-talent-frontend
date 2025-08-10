// Vendor Hub Permissions Service
import {
  VendorHubPermission,
  VendorHubRole,
  VendorHubUserPermissions,
  PermissionContext,
  VENDOR_HUB_ROLES,
  SecurityLevel,
  AuditEvent,
  AuditEventType,
  EndpointSecurity
} from '@/types/vendorPermissions';

class VendorPermissionsService {
  private userPermissions: VendorHubUserPermissions | null = null;
  private auditEvents: AuditEvent[] = [];

  // Initialize user permissions
  async initializePermissions(userId: string): Promise<VendorHubUserPermissions> {
    try {
      // TODO: Replace with actual API call
      const mockPermissions: VendorHubUserPermissions = {
        userId,
        roles: ['vendor_manager'],
        permissions: VENDOR_HUB_ROLES.vendor_manager.permissions,
        restrictions: {
          vendorTypes: ['Prime Vendor', 'Sub Vendor']
        }
      };

      this.userPermissions = mockPermissions;
      return mockPermissions;
    } catch (error) {
      console.error('Failed to initialize permissions:', error);
      throw error;
    }
  }

  // Check if user has a specific permission
  hasPermission(permission: VendorHubPermission, context?: Partial<PermissionContext>): boolean {
    if (!this.userPermissions) {
      return false;
    }

    // Check if user has the permission directly
    if (!this.userPermissions.permissions.includes(permission)) {
      return false;
    }

    // Apply context-based restrictions
    if (context?.resource && this.userPermissions.restrictions) {
      const restrictions = this.userPermissions.restrictions;

      // Check vendor ID restrictions
      if (restrictions.vendorIds && context.resource.vendorId) {
        if (!restrictions.vendorIds.includes(context.resource.vendorId)) {
          return false;
        }
      }

      // Check vendor type restrictions
      if (restrictions.vendorTypes && context.resource.vendorType) {
        if (!restrictions.vendorTypes.includes(context.resource.vendorType)) {
          return false;
        }
      }

      // Check PoC role restrictions
      if (restrictions.pocRoles && context.resource.pocRole) {
        if (!restrictions.pocRoles.includes(context.resource.pocRole)) {
          return false;
        }
      }
    }

    return true;
  }

  // Check if user has any of the specified permissions
  hasAnyPermission(permissions: VendorHubPermission[], context?: Partial<PermissionContext>): boolean {
    return permissions.some(permission => this.hasPermission(permission, context));
  }

  // Check if user has all of the specified permissions
  hasAllPermissions(permissions: VendorHubPermission[], context?: Partial<PermissionContext>): boolean {
    return permissions.every(permission => this.hasPermission(permission, context));
  }

  // Check if user has a specific role
  hasRole(role: VendorHubRole): boolean {
    if (!this.userPermissions) {
      return false;
    }
    return this.userPermissions.roles.includes(role);
  }

  // Check if user has any of the specified roles
  hasAnyRole(roles: VendorHubRole[]): boolean {
    return roles.some(role => this.hasRole(role));
  }

  // Get all permissions for a role
  getRolePermissions(role: VendorHubRole): VendorHubPermission[] {
    const roleDefinition = VENDOR_HUB_ROLES[role];
    if (!roleDefinition) {
      return [];
    }

    let permissions = [...roleDefinition.permissions];

    // Add inherited permissions
    if (roleDefinition.inherits) {
      roleDefinition.inherits.forEach(inheritedRole => {
        const inheritedPermissions = this.getRolePermissions(inheritedRole);
        permissions = [...permissions, ...inheritedPermissions];
      });
    }

    // Remove duplicates
    return [...new Set(permissions)];
  }

  // Get user's current permissions
  getUserPermissions(): VendorHubUserPermissions | null {
    return this.userPermissions;
  }

  // Validate endpoint access
  validateEndpointAccess(endpoint: EndpointSecurity, context?: Partial<PermissionContext>): {
    allowed: boolean;
    reason?: string;
  } {
    // Check required permissions
    const hasRequiredPermissions = this.hasAllPermissions(endpoint.requiredPermissions, context);
    if (!hasRequiredPermissions) {
      return {
        allowed: false,
        reason: 'Insufficient permissions'
      };
    }

    // Additional validation checks
    if (endpoint.additionalValidation) {
      const validation = endpoint.additionalValidation;

      if (validation.requiresOwnership && context?.resource?.id) {
        // TODO: Implement ownership check
        // This would verify if the user owns or has access to the specific resource
      }

      if (validation.requiresVendorAccess && context?.resource?.vendorId) {
        const hasVendorAccess = this.hasPermission('vendor:view', {
          resource: { type: 'vendor', vendorId: context.resource.vendorId }
        });
        if (!hasVendorAccess) {
          return {
            allowed: false,
            reason: 'No access to this vendor'
          };
        }
      }

      if (validation.requiresApproval) {
        // TODO: Implement approval workflow check
        // This would verify if the action has been approved
      }
    }

    return { allowed: true };
  }

  // Log audit event
  async logAuditEvent(
    eventType: AuditEventType,
    action: string,
    details: Record<string, any>,
    resourceType?: 'vendor' | 'poc' | 'communication' | 'validation' | 'consent',
    resourceId?: string,
    success: boolean = true,
    errorMessage?: string
  ): Promise<void> {
    if (!this.userPermissions) {
      return;
    }

    const auditEvent: AuditEvent = {
      id: Date.now().toString(),
      eventType,
      userId: this.userPermissions.userId,
      userRole: this.userPermissions.roles,
      timestamp: new Date(),
      resourceType,
      resourceId,
      action,
      details,
      ipAddress: '192.168.1.100', // This would come from the request
      userAgent: navigator.userAgent,
      sessionId: 'session_' + Date.now(),
      success,
      errorMessage,
      securityLevel: this.getSecurityLevel(eventType),
      metadata: {
        permissions: this.userPermissions.permissions,
        restrictions: this.userPermissions.restrictions
      }
    };

    this.auditEvents.push(auditEvent);

    try {
      // TODO: Replace with actual API call to log audit event
      console.log('Audit event logged:', auditEvent);
    } catch (error) {
      console.error('Failed to log audit event:', error);
    }
  }

  // Get security level for audit event type
  private getSecurityLevel(eventType: AuditEventType): SecurityLevel {
    const highSecurityEvents: AuditEventType[] = [
      'vendor_deleted',
      'poc_deleted',
      'consent_revoked',
      'permission_granted',
      'permission_revoked',
      'unauthorized_access',
      'settings_changed'
    ];

    const confidentialEvents: AuditEventType[] = [
      'consent_collected',
      'data_export'
    ];

    if (highSecurityEvents.includes(eventType)) {
      return 'restricted';
    } else if (confidentialEvents.includes(eventType)) {
      return 'confidential';
    } else {
      return 'internal';
    }
  }

  // Get audit events (with permission check)
  async getAuditEvents(filters?: {
    eventType?: AuditEventType;
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }): Promise<AuditEvent[]> {
    if (!this.hasPermission('audit:view')) {
      throw new Error('Insufficient permissions to view audit events');
    }

    let events = [...this.auditEvents];

    if (filters) {
      if (filters.eventType) {
        events = events.filter(event => event.eventType === filters.eventType);
      }
      if (filters.userId) {
        events = events.filter(event => event.userId === filters.userId);
      }
      if (filters.resourceType) {
        events = events.filter(event => event.resourceType === filters.resourceType);
      }
      if (filters.resourceId) {
        events = events.filter(event => event.resourceId === filters.resourceId);
      }
      if (filters.dateFrom) {
        events = events.filter(event => event.timestamp >= filters.dateFrom!);
      }
      if (filters.dateTo) {
        events = events.filter(event => event.timestamp <= filters.dateTo!);
      }
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // Check if action requires approval
  requiresApproval(action: VendorHubPermission, context?: Partial<PermissionContext>): boolean {
    const highRiskActions: VendorHubPermission[] = [
      'vendor:delete',
      'poc:delete',
      'automation:enable_disable',
      'admin:settings',
      'admin:user_management',
      'admin:system_config'
    ];

    return highRiskActions.includes(action);
  }

  // Get permission description
  getPermissionDescription(permission: VendorHubPermission): string {
    const descriptions: Record<VendorHubPermission, string> = {
      'vendor:view': 'View vendor information',
      'vendor:create': 'Create new vendors',
      'vendor:edit': 'Edit vendor information',
      'vendor:delete': 'Delete vendors',
      'vendor:export': 'Export vendor data',
      'vendor:import': 'Import vendor data',
      'poc:view': 'View point of contact information',
      'poc:create': 'Create new points of contact',
      'poc:edit': 'Edit point of contact information',
      'poc:delete': 'Delete points of contact',
      'poc:validate': 'Validate point of contact information',
      'poc:export': 'Export point of contact data',
      'communication:view': 'View communication logs',
      'communication:send': 'Send communications',
      'communication:bulk_send': 'Send bulk communications',
      'communication:templates': 'Manage communication templates',
      'validation:view': 'View validation reminders',
      'validation:create': 'Create validation reminders',
      'validation:send': 'Send validation reminders',
      'validation:bulk_send': 'Send bulk validation reminders',
      'validation:configure': 'Configure validation settings',
      'dashboard:view': 'View dashboard',
      'dashboard:analytics': 'View analytics',
      'dashboard:reports': 'Generate reports',
      'automation:view': 'View automation settings',
      'automation:configure': 'Configure automation',
      'automation:enable_disable': 'Enable/disable automation',
      'consent:view': 'View consent records',
      'consent:collect': 'Collect consent',
      'consent:revoke': 'Revoke consent',
      'consent:export': 'Export consent records',
      'audit:view': 'View audit logs',
      'audit:export': 'Export audit logs',
      'admin:settings': 'Manage system settings',
      'admin:user_management': 'Manage users',
      'admin:system_config': 'Configure system'
    };

    return descriptions[permission] || 'Unknown permission';
  }

  // Clear permissions (for logout)
  clearPermissions(): void {
    this.userPermissions = null;
  }
}

// Create singleton instance
export const vendorPermissionsService = new VendorPermissionsService();

// Permission validation decorators/helpers
export const withPermission = (permission: VendorHubPermission) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (!vendorPermissionsService.hasPermission(permission)) {
        throw new Error(`Permission denied: ${permission}`);
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

export const withAnyPermission = (permissions: VendorHubPermission[]) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (!vendorPermissionsService.hasAnyPermission(permissions)) {
        throw new Error(`Permission denied: requires one of ${permissions.join(', ')}`);
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};

export const withRole = (role: VendorHubRole) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if (!vendorPermissionsService.hasRole(role)) {
        throw new Error(`Role required: ${role}`);
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
};
