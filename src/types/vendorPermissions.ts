// Vendor Hub Permissions and Security Types

export type VendorHubPermission = 
  // Vendor permissions
  | 'vendor:view'
  | 'vendor:create'
  | 'vendor:edit'
  | 'vendor:delete'
  | 'vendor:export'
  | 'vendor:import'
  
  // PoC permissions
  | 'poc:view'
  | 'poc:create'
  | 'poc:edit'
  | 'poc:delete'
  | 'poc:validate'
  | 'poc:export'
  
  // Communication permissions
  | 'communication:view'
  | 'communication:send'
  | 'communication:bulk_send'
  | 'communication:templates'
  
  // Validation permissions
  | 'validation:view'
  | 'validation:create'
  | 'validation:send'
  | 'validation:bulk_send'
  | 'validation:configure'
  
  // Dashboard permissions
  | 'dashboard:view'
  | 'dashboard:analytics'
  | 'dashboard:reports'
  
  // Automation permissions
  | 'automation:view'
  | 'automation:configure'
  | 'automation:enable_disable'
  
  // Consent permissions
  | 'consent:view'
  | 'consent:collect'
  | 'consent:revoke'
  | 'consent:export'
  
  // Audit permissions
  | 'audit:view'
  | 'audit:export'
  
  // Admin permissions
  | 'admin:settings'
  | 'admin:user_management'
  | 'admin:system_config';

export type VendorHubRole = 
  | 'vendor_admin'
  | 'vendor_manager'
  | 'vendor_coordinator'
  | 'poc_manager'
  | 'compliance_officer'
  | 'hr_manager'
  | 'account_manager'
  | 'viewer';

export interface VendorHubRoleDefinition {
  role: VendorHubRole;
  name: string;
  description: string;
  permissions: VendorHubPermission[];
  inherits?: VendorHubRole[];
}

export interface VendorHubUserPermissions {
  userId: string;
  roles: VendorHubRole[];
  permissions: VendorHubPermission[];
  restrictions?: {
    vendorIds?: string[]; // Restrict to specific vendors
    vendorTypes?: ('Prime Vendor' | 'Sub Vendor')[]; // Restrict to vendor types
    pocRoles?: string[]; // Restrict to specific PoC roles
  };
}

export interface PermissionContext {
  action: VendorHubPermission;
  resource?: {
    type: 'vendor' | 'poc' | 'communication' | 'validation' | 'consent';
    id?: string;
    vendorId?: string;
    vendorType?: 'Prime Vendor' | 'Sub Vendor';
    pocRole?: string;
  };
  user: {
    id: string;
    roles: VendorHubRole[];
    permissions: VendorHubPermission[];
    restrictions?: VendorHubUserPermissions['restrictions'];
  };
}

// Default role definitions
export const VENDOR_HUB_ROLES: Record<VendorHubRole, VendorHubRoleDefinition> = {
  vendor_admin: {
    role: 'vendor_admin',
    name: 'Vendor Administrator',
    description: 'Full access to all vendor hub functionality',
    permissions: [
      'vendor:view', 'vendor:create', 'vendor:edit', 'vendor:delete', 'vendor:export', 'vendor:import',
      'poc:view', 'poc:create', 'poc:edit', 'poc:delete', 'poc:validate', 'poc:export',
      'communication:view', 'communication:send', 'communication:bulk_send', 'communication:templates',
      'validation:view', 'validation:create', 'validation:send', 'validation:bulk_send', 'validation:configure',
      'dashboard:view', 'dashboard:analytics', 'dashboard:reports',
      'automation:view', 'automation:configure', 'automation:enable_disable',
      'consent:view', 'consent:collect', 'consent:revoke', 'consent:export',
      'audit:view', 'audit:export',
      'admin:settings', 'admin:user_management', 'admin:system_config'
    ]
  },
  
  vendor_manager: {
    role: 'vendor_manager',
    name: 'Vendor Manager',
    description: 'Manage vendors and PoCs with full operational access',
    permissions: [
      'vendor:view', 'vendor:create', 'vendor:edit', 'vendor:export',
      'poc:view', 'poc:create', 'poc:edit', 'poc:validate', 'poc:export',
      'communication:view', 'communication:send', 'communication:bulk_send',
      'validation:view', 'validation:create', 'validation:send', 'validation:bulk_send',
      'dashboard:view', 'dashboard:analytics', 'dashboard:reports',
      'automation:view',
      'consent:view', 'consent:collect', 'consent:export',
      'audit:view'
    ]
  },
  
  vendor_coordinator: {
    role: 'vendor_coordinator',
    name: 'Vendor Coordinator',
    description: 'Day-to-day vendor operations and PoC management',
    permissions: [
      'vendor:view', 'vendor:edit',
      'poc:view', 'poc:create', 'poc:edit', 'poc:validate',
      'communication:view', 'communication:send',
      'validation:view', 'validation:send',
      'dashboard:view',
      'consent:view', 'consent:collect'
    ]
  },
  
  poc_manager: {
    role: 'poc_manager',
    name: 'PoC Manager',
    description: 'Specialized in point of contact management and validation',
    permissions: [
      'vendor:view',
      'poc:view', 'poc:create', 'poc:edit', 'poc:validate', 'poc:export',
      'communication:view', 'communication:send',
      'validation:view', 'validation:create', 'validation:send', 'validation:bulk_send',
      'dashboard:view',
      'consent:view', 'consent:collect'
    ]
  },
  
  compliance_officer: {
    role: 'compliance_officer',
    name: 'Compliance Officer',
    description: 'Focus on compliance, consent, and audit functions',
    permissions: [
      'vendor:view',
      'poc:view',
      'communication:view',
      'validation:view',
      'dashboard:view', 'dashboard:reports',
      'consent:view', 'consent:collect', 'consent:revoke', 'consent:export',
      'audit:view', 'audit:export'
    ]
  },
  
  hr_manager: {
    role: 'hr_manager',
    name: 'HR Manager',
    description: 'HR-focused access for vendor relationship management',
    permissions: [
      'vendor:view',
      'poc:view', 'poc:edit', 'poc:validate',
      'communication:view', 'communication:send',
      'validation:view', 'validation:send',
      'dashboard:view',
      'consent:view'
    ]
  },
  
  account_manager: {
    role: 'account_manager',
    name: 'Account Manager',
    description: 'Client-facing role with vendor relationship focus',
    permissions: [
      'vendor:view',
      'poc:view', 'poc:edit',
      'communication:view', 'communication:send',
      'dashboard:view'
    ]
  },
  
  viewer: {
    role: 'viewer',
    name: 'Viewer',
    description: 'Read-only access to vendor information',
    permissions: [
      'vendor:view',
      'poc:view',
      'communication:view',
      'dashboard:view'
    ]
  }
};

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  vendor_management: [
    'vendor:view', 'vendor:create', 'vendor:edit', 'vendor:delete', 'vendor:export', 'vendor:import'
  ],
  poc_management: [
    'poc:view', 'poc:create', 'poc:edit', 'poc:delete', 'poc:validate', 'poc:export'
  ],
  communication: [
    'communication:view', 'communication:send', 'communication:bulk_send', 'communication:templates'
  ],
  validation: [
    'validation:view', 'validation:create', 'validation:send', 'validation:bulk_send', 'validation:configure'
  ],
  analytics: [
    'dashboard:view', 'dashboard:analytics', 'dashboard:reports'
  ],
  automation: [
    'automation:view', 'automation:configure', 'automation:enable_disable'
  ],
  compliance: [
    'consent:view', 'consent:collect', 'consent:revoke', 'consent:export', 'audit:view', 'audit:export'
  ],
  administration: [
    'admin:settings', 'admin:user_management', 'admin:system_config'
  ]
} as const;

// Security levels
export type SecurityLevel = 'public' | 'internal' | 'confidential' | 'restricted';

export interface SecurityClassification {
  level: SecurityLevel;
  requiredPermissions: VendorHubPermission[];
  additionalRestrictions?: {
    requiresMFA?: boolean;
    requiresApproval?: boolean;
    auditRequired?: boolean;
    ipRestrictions?: string[];
    timeRestrictions?: {
      allowedHours?: [number, number]; // [start, end] in 24h format
      allowedDays?: number[]; // 0-6, Sunday = 0
    };
  };
}

// Data classification for different types of vendor information
export const DATA_CLASSIFICATIONS: Record<string, SecurityClassification> = {
  vendor_basic_info: {
    level: 'internal',
    requiredPermissions: ['vendor:view']
  },
  vendor_financial_info: {
    level: 'confidential',
    requiredPermissions: ['vendor:view'],
    additionalRestrictions: {
      auditRequired: true
    }
  },
  poc_contact_info: {
    level: 'internal',
    requiredPermissions: ['poc:view']
  },
  poc_personal_info: {
    level: 'confidential',
    requiredPermissions: ['poc:view'],
    additionalRestrictions: {
      auditRequired: true
    }
  },
  communication_logs: {
    level: 'internal',
    requiredPermissions: ['communication:view']
  },
  consent_records: {
    level: 'restricted',
    requiredPermissions: ['consent:view'],
    additionalRestrictions: {
      requiresMFA: true,
      auditRequired: true
    }
  },
  audit_logs: {
    level: 'restricted',
    requiredPermissions: ['audit:view'],
    additionalRestrictions: {
      requiresMFA: true,
      auditRequired: true
    }
  }
};

// API endpoint security configuration
export interface EndpointSecurity {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  requiredPermissions: VendorHubPermission[];
  dataClassification: SecurityLevel;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  additionalValidation?: {
    requiresOwnership?: boolean; // User must own or have access to the resource
    requiresVendorAccess?: boolean; // User must have access to the specific vendor
    requiresApproval?: boolean; // Action requires approval workflow
  };
}

// Audit event types
export type AuditEventType = 
  | 'vendor_created'
  | 'vendor_updated'
  | 'vendor_deleted'
  | 'poc_created'
  | 'poc_updated'
  | 'poc_deleted'
  | 'poc_validated'
  | 'communication_sent'
  | 'validation_sent'
  | 'consent_collected'
  | 'consent_revoked'
  | 'permission_granted'
  | 'permission_revoked'
  | 'login_attempt'
  | 'unauthorized_access'
  | 'data_export'
  | 'settings_changed';

export interface AuditEvent {
  id: string;
  eventType: AuditEventType;
  userId: string;
  userRole: VendorHubRole[];
  timestamp: Date;
  resourceType?: 'vendor' | 'poc' | 'communication' | 'validation' | 'consent';
  resourceId?: string;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  success: boolean;
  errorMessage?: string;
  securityLevel: SecurityLevel;
  metadata?: Record<string, any>;
}
