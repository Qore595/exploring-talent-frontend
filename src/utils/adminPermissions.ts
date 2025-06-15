import { UserRole } from '@/context/AuthContext';

/**
 * Check if a user has admin permissions
 * @param userRole The user's role
 * @param requiredRoles Optional array of roles that are normally required for an action
 * @returns Boolean indicating if the user has permission
 */
export const hasPermission = (userRole: UserRole | undefined, requiredRoles: UserRole[] = []): boolean => {
  // If no user role is provided, deny permission
  if (!userRole) return false;

  // CEO always has permission for everything
  if (userRole === 'ceo') return true;

  // If no specific roles are required, allow access
  if (requiredRoles.length === 0) return true;

  // Otherwise, check if the user's role is in the required roles
  return requiredRoles.includes(userRole);
};

/**
 * Check if a user is an admin (CEO)
 * @param userRole The user's role
 * @returns Boolean indicating if the user is an admin
 */
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ceo';
};

/**
 * Check if a user is a branch manager or higher
 * @param userRole The user's role
 * @returns Boolean indicating if the user is a branch manager or higher
 */
export const isBranchManagerOrHigher = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ceo' || userRole === 'branch-manager';
};

/**
 * Check if a user is a marketing head or higher
 * @param userRole The user's role
 * @returns Boolean indicating if the user is a marketing head or higher
 */
export const isMarketingHeadOrHigher = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ceo' || userRole === 'branch-manager' || userRole === 'marketing-head';
};

/**
 * Check if a user is a marketing supervisor or higher
 * @param userRole The user's role
 * @returns Boolean indicating if the user is a marketing supervisor or higher
 */
export const isMarketingSupervisorOrHigher = (userRole: UserRole | undefined): boolean => {
  return userRole === 'ceo' || userRole === 'branch-manager' ||
         userRole === 'marketing-head' || userRole === 'marketing-supervisor';
};

/**
 * Get a list of roles that includes CEO and the provided roles
 * Useful for components that need to check against a list of roles
 * @param roles Array of roles
 * @returns Array of roles including CEO
 */
export const withAdminRole = (roles: UserRole[]): UserRole[] => {
  if (roles.includes('ceo')) return roles;
  return ['ceo', ...roles];
};
