import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { roleService, Role, BatchRolePermissionsData, RolePermissionData } from '@/services/roleService';
import { permissionService, PermissionGroup } from '@/services/permissionService';

// Define permission modules and features
const permissionModules = [
  {
    id: 'student-information',
    name: 'Student Information',
    features: [
      { id: 'student', name: 'Student' },
      { id: 'import-student', name: 'Import Student' },
      { id: 'student-categories', name: 'Student Categories' },
      { id: 'student-houses', name: 'Student Houses' },
      { id: 'disable-student', name: 'Disable Student' },
      { id: 'student-timeline', name: 'Student Timeline' },
      { id: 'disable-reason', name: 'Disable Reason' },
    ],
  },
  {
    id: 'fees-collection',
    name: 'Fees Collection',
    features: [
      { id: 'collect-fees', name: 'Collect Fees' },
      { id: 'fees-carry-forward', name: 'Fees Carry Forward' },
      { id: 'fees-master', name: 'Fees Master' },
      { id: 'fees-group', name: 'Fees Group' },
      { id: 'fees-group-assign', name: 'Fees Group Assign' },
      { id: 'fees-type', name: 'Fees Type' },
      { id: 'fees-discount', name: 'Fees Discount' },
      { id: 'fees-discount-assign', name: 'Fees Discount Assign' },
      { id: 'search-fees-payment', name: 'Search Fees Payment' },
      { id: 'search-due-fees', name: 'Search Due Fees' },
      { id: 'fees-reminder', name: 'Fees Reminder' },
      { id: 'offline-bank-payments', name: 'Offline Bank Payments' },
    ],
  },
];

// Permission types
const permissionTypes = [
  { id: 'view', name: 'View' },
  { id: 'add', name: 'Add' },
  { id: 'edit', name: 'Edit' },
  { id: 'delete', name: 'Delete' },
];

const RolePermissionsPage = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [permissionGroups, setPermissionGroups] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);  useEffect(() => {
    const fetchRoleDetails = async () => {
      setIsLoading(true);
      try {
        if (!roleId) {
          toast({
            title: "Invalid role ID",
            description: "No role ID was provided.",
            variant: "destructive",
          });
          navigate('/roles');
          return;
        }

        const response = await roleService.getRoleById(roleId);

        if (response.success && response.data) {
          setRole(response.data);
        } else {
          toast({
            title: "Role not found",
            description: "The requested role could not be found.",
            variant: "destructive",
          });
          navigate('/roles');
        }
      } catch (error) {
        console.error('Error fetching role details:', error);
        toast({
          title: "Error",
          description: "Failed to load role details. Please try again.",
          variant: "destructive",
        });
        navigate('/roles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoleDetails();
  }, [roleId, navigate, toast]);
  // Load existing permissions when role and permission groups are loaded
  useEffect(() => {
    const fetchExistingPermissions = async () => {
      if (!roleId || !role || permissionGroups.length === 0) return;

      try {
        console.log('Fetching existing permissions for role:', roleId);
        const response = await roleService.getRolePermissions(roleId);
        
        if (response.success && response.data) {
          console.log('Existing permissions response:', response.data);
          
          // Convert existing permissions to our permissions state format
          const existingPermissions: Record<string, string[]> = {};
          
          // First, initialize all categories with empty arrays
          permissionGroups.forEach(group => {
            const categories = group.categories && group.categories.length > 0 
              ? group.categories 
              : (group.PermissionCategories || []);
            
            categories.forEach(category => {
              existingPermissions[category.short_code] = [];
            });
          });
          
          // Then, populate with actual permissions from API
          response.data.forEach((permission: any) => {
            const category = permission.PermissionCategory;
            if (category && category.short_code) {
              const permTypes = [];
              if (permission.can_view) permTypes.push('view');
              if (permission.can_add) permTypes.push('add');
              if (permission.can_edit) permTypes.push('edit');
              if (permission.can_delete) permTypes.push('delete');
              
              existingPermissions[category.short_code] = permTypes;
            }
          });
          
          console.log('Processed existing permissions:', existingPermissions);
          setPermissions(existingPermissions);
        }
      } catch (error) {
        console.error('Error fetching existing permissions:', error);
        // Don't show error toast for this as it's not critical
      }
    };

    fetchExistingPermissions();
  }, [roleId, role, permissionGroups]);

  useEffect(() => {
    const fetchPermissionGroups = async () => {
      setIsLoadingPermissions(true);
      try {
        const response = await permissionService.getPermissionGroupsWithCategories({
          is_active: true,
          limit: 100 // Get all active permission groups
        });        if (response.success) {
          console.log('Permission groups response:', response);
          setPermissionGroups(response.data);
          
          // Process categories to ensure consistency
          response.data.forEach(group => {
            console.log('Processing group:', group.name);
            
            // Process categories based on whichever array is available
            const categories = group.categories && group.categories.length > 0 
              ? group.categories 
              : (group.PermissionCategories || []);
              
            // Make sure we add categories property for consistency
            if (!group.categories) {
              group.categories = [...categories];
            }
            
            console.log(`Group ${group.name} has ${categories.length} categories`);
          });

          console.log('Permission groups loaded, existing permissions will be loaded next');
        } else {
          toast({
            title: "Error",
            description: "Failed to load permission groups. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Error fetching permission groups:', error);
        toast({
          title: "Error",
          description: "Failed to load permission groups. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingPermissions(false);
      }
    };

    fetchPermissionGroups();
  }, [toast]);

  const handlePermissionChange = (featureId: string, permissionType: string, checked: boolean) => {
    setPermissions(prev => {
      const updatedPermissions = { ...prev };

      if (!updatedPermissions[featureId]) {
        updatedPermissions[featureId] = [];
      }

      if (checked) {
        if (!updatedPermissions[featureId].includes(permissionType)) {
          updatedPermissions[featureId] = [...updatedPermissions[featureId], permissionType];
        }
      } else {
        updatedPermissions[featureId] = updatedPermissions[featureId].filter(p => p !== permissionType);
      }

      return updatedPermissions;
    });
  };  const isPermissionSelected = (featureId: string, permissionType: string) => {
    return permissions[featureId]?.includes(permissionType) || false;
  };const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!roleId || !user?.id) {
        throw new Error('Missing role ID or user information');
      }

      // Convert permissions state to API format
      const permissionsList: RolePermissionData[] = [];
      
      // Iterate through all permission groups and their categories
      permissionGroups.forEach(group => {
        const categories = group.categories && group.categories.length > 0 
          ? group.categories 
          : (group.PermissionCategories || []);
          
        categories.forEach(category => {
          const categoryPermissions = permissions[category.short_code] || [];
          
          // Create a permission entry for ALL categories (both checked and unchecked)
          // This ensures unchecked permissions are properly removed/set to false
          permissionsList.push({
            perm_cat_id: category.id,
            can_view: categoryPermissions.includes('view'),
            can_add: categoryPermissions.includes('add'),
            can_edit: categoryPermissions.includes('edit'),
            can_delete: categoryPermissions.includes('delete'),
            branch_id: user.branchId || 1 // Use user's branch or default to 1
          });
        });
      });      // Prepare the batch permissions data
      const batchData: BatchRolePermissionsData = {
        role_id: parseInt(roleId),
        created_by: typeof user.id === 'string' ? parseInt(user.id) : user.id,
        updated_by: typeof user.id === 'string' ? parseInt(user.id) : user.id,
        permissions: permissionsList
      };

      console.log('Sending batch permissions data:', batchData);

      // Call the batch permissions API
      const response = await roleService.batchUpdateRolePermissions(batchData);

      if (response.success) {
        toast({
          title: "Permissions Updated",
          description: `Permissions for role "${role?.name}" have been updated successfully.`,
        });

        // Navigate back to roles list
        navigate('/roles');
      } else {
        throw new Error(response.message || 'Failed to update permissions');
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update permissions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isLoading || isLoadingPermissions) {
    return (
      <div className="container mx-auto py-6 flex flex-col justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading {isLoading ? 'role details' : 'permissions'}...</p>
        {!isLoading && permissionGroups.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Loaded {permissionGroups.length} permission groups</p>
            {permissionGroups.map(group => (
              <div key={group.id}>
                <p>- {group.name}: {(group.categories?.length || group.PermissionCategories?.length || 0)} categories</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (!role) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <p>Role not found.</p>
      </div>
    );
  }
  // Check if we have any permission groups with categories
  const hasPermissionCategories = permissionGroups.some(group => {
    const categories = group.categories && group.categories.length > 0 
      ? group.categories 
      : (group.PermissionCategories || []);
    return categories.length > 0;
  });
  if (permissionGroups.length === 0 || !hasPermissionCategories) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/roles')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Roles
          </Button>
          <h1 className="text-2xl font-bold">Assign Permission ({role.name})</h1>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <p>No permission groups or categories found. Please create permission groups and categories first.</p>
            <div className="mt-4 text-sm text-gray-500">
              <p>Debug info:</p>
              <p>Permission groups loaded: {permissionGroups.length}</p>
              <p>Has categories: {hasPermissionCategories ? 'Yes' : 'No'}</p>
              {permissionGroups.length > 0 && (
                <div>
                  <p>Groups detail:</p>
                  {permissionGroups.map(group => (
                    <div key={group.id}>
                      <p>- {group.name}: {(group.categories?.length || group.PermissionCategories?.length || 0)} categories</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/roles')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roles
        </Button>
        <h1 className="text-2xl font-bold">Assign Permission ({role.name})</h1>
      </div>

      {/* Debug information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Debug Information</h3>
          <div className="text-sm text-blue-700">
            <p>Permission Groups: {permissionGroups.length}</p>
            <p>Current Permissions State: {JSON.stringify(permissions, null, 2)}</p>
            <p>Total Categories: {permissionGroups.reduce((acc, group) => {
              const categories = group.categories && group.categories.length > 0 
                ? group.categories 
                : (group.PermissionCategories || []);
              return acc + categories.length;
            }, 0)}</p>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/4">Module</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 w-1/4">Feature</th>
                    {permissionTypes.map(type => (
                      <th key={type.id} className="text-center py-3 px-4 font-medium text-gray-700">
                        {type.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {permissionGroups.map(group => (
                    <React.Fragment key={group.id}>                      {(group.categories && group.categories.length > 0 
                        ? group.categories 
                        : group.PermissionCategories || []).map((category, categoryIndex) => (
                        <tr key={category.id} className={categoryIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          {categoryIndex === 0 ? (
                            <td
                              className="py-3 px-4 border-t"
                              rowSpan={(group.categories && group.categories.length > 0 
                                ? group.categories.length 
                                : (group.PermissionCategories || []).length)}
                            >
                              {group.name}
                            </td>
                          ) : null}
                          <td className="py-3 px-4 border-t">{category.name}</td>                          {permissionTypes.map(type => (
                            <td key={type.id} className="text-center py-3 px-4 border-t">
                              {/* Show checkbox for all permission types */}
                              <Checkbox
                                id={`${category.short_code}-${type.id}`}
                                checked={isPermissionSelected(category.short_code, type.id)}
                                onCheckedChange={(checked) =>
                                  handlePermissionChange(category.short_code, type.id, checked as boolean)
                                }
                                disabled={isSubmitting}
                                className="mx-auto"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/roles/${roleId}`)}
            className="mr-2"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Permissions
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RolePermissionsPage;
