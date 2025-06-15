import apiClient from './api';
import axios from 'axios';

// Types
export interface PermissionCategory {
  id: number;
  perm_group_id: number;
  name: string;
  short_code: string;
  description: string;
  enable_view: boolean;
  enable_add: boolean;
  enable_edit: boolean;
  enable_delete: boolean;
  is_system: boolean;
  is_active: boolean;
  display_order: number;
}

export interface PermissionGroup {
  id: number;
  name: string;
  short_code: string;
  description: string;
  is_system: boolean;
  is_active: boolean;
  created_by: number;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  CreatedBy: {
    id: number;
    first_name: string;
    last_name: string;
    employee_id: string;
  };
  UpdatedBy: any | null;
  PermissionCategories: PermissionCategory[];
  // For backward compatibility
  categories?: PermissionCategory[];
}

export interface PermissionGroupsResponse {
  success: boolean;
  data: PermissionGroup[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface PermissionGroupQueryParams {
  page?: number;
  limit?: number;
  is_active?: boolean;
  is_system?: boolean;
  search?: string;
}

// Permission service
export const permissionService = {
  // Get all permission groups with categories
  getPermissionGroupsWithCategories: async (params: PermissionGroupQueryParams = {}): Promise<PermissionGroupsResponse> => {
    try {
      console.log('Fetching permission groups with params:', params);
      
      // Always use a high limit to ensure all permission groups are fetched
      const modifiedParams = { ...params, limit: Math.max(params.limit || 0, 1000) };
      
      // Make sure we're using the correct endpoint
      const response = await apiClient.get('/permission-groups-with-categories', { params: modifiedParams });
      console.log('Raw API response status:', response.status);

      // Map PermissionCategories to categories for backward compatibility
      if (response.data.success && response.data.data && Array.isArray(response.data.data)) {
        // Debug: Check and log all permission groups received
        console.log('Total permission groups received from API:', response.data.data.length);
        
        // Find Report Access group specifically for debugging
        const reportGroup = response.data.data.find(g => g.name === 'Report Access');
        if (reportGroup) {
          console.log('FOUND REPORT ACCESS GROUP:', reportGroup.id);
          console.log('- Has PermissionCategories:', reportGroup.PermissionCategories?.length || 0);
        }
        
        // Process each group to ensure it has categories property
        response.data.data = response.data.data.map((group: PermissionGroup) => {
          // Get categories from PermissionCategories if available
          const permCategories = Array.isArray(group.PermissionCategories) ? [...group.PermissionCategories] : [];
          
          // Log each group's data for debugging
          console.log(`Processing group: ${group.name}, ID: ${group.id}`);
          console.log(`- PermissionCategories: ${group.PermissionCategories?.length || 0} items`);
          
          // Create a complete group object with both properties normalized
          return {
            ...group,
            // Ensure categories property exists and has content
            categories: permCategories,
            // Keep PermissionCategories for compatibility with API
            PermissionCategories: permCategories
          };
        });
      }

      // Return the processed response data
      return response.data;
    } catch (error) {
      console.error('API error in getPermissionGroupsWithCategories:', error);
      throw error;
    }
  },
};

export default permissionService;
