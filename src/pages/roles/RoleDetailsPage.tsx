import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Edit,
  Trash,
  Shield,
  Users,
  Check,
  X,
  Loader2,
  Calendar,
  Building
} from 'lucide-react';
import { roleService, Role } from '@/services/roleService';

// Mock permission categories - same as in AddRolePage
const permissionCategories = [
  {
    id: 'users',
    name: 'User Management',
    permissions: [
      { id: 'users.view', name: 'View Users' },
      { id: 'users.create', name: 'Create Users' },
      { id: 'users.edit', name: 'Edit Users' },
      { id: 'users.delete', name: 'Delete Users' },
    ],
  },
  {
    id: 'roles',
    name: 'Role Management',
    permissions: [
      { id: 'roles.view', name: 'View Roles' },
      { id: 'roles.create', name: 'Create Roles' },
      { id: 'roles.edit', name: 'Edit Roles' },
      { id: 'roles.delete', name: 'Delete Roles' },
    ],
  },
  {
    id: 'jobs',
    name: 'Job Management',
    permissions: [
      { id: 'jobs.view', name: 'View Jobs' },
      { id: 'jobs.create', name: 'Create Jobs' },
      { id: 'jobs.edit', name: 'Edit Jobs' },
      { id: 'jobs.delete', name: 'Delete Jobs' },
    ],
  },
  {
    id: 'candidates',
    name: 'Candidate Management',
    permissions: [
      { id: 'candidates.view', name: 'View Candidates' },
      { id: 'candidates.create', name: 'Create Candidates' },
      { id: 'candidates.edit', name: 'Edit Candidates' },
      { id: 'candidates.delete', name: 'Delete Candidates' },
    ],
  },
  {
    id: 'interviews',
    name: 'Interview Management',
    permissions: [
      { id: 'interviews.view', name: 'View Interviews' },
      { id: 'interviews.schedule', name: 'Schedule Interviews' },
      { id: 'interviews.feedback', name: 'Provide Interview Feedback' },
    ],
  },
];

// Helper function to check if a role has a specific permission
const hasPermission = (rolePermissions: string[], permissionId: string): boolean => {
  if (rolePermissions.includes('all')) return true;

  // Check for wildcard permissions (e.g., 'users.*' includes 'users.view')
  const wildcardPrefix = permissionId.split('.')[0] + '.*';
  if (rolePermissions.includes(wildcardPrefix)) return true;

  return rolePermissions.includes(permissionId);
};

const RoleDetailsPage = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState<string[]>([]);

  useEffect(() => {
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
          // For now, we'll use mock permissions until we implement the permissions API
          setPermissions(['users.view', 'users.edit']);
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

  const handleEditRole = () => {
    navigate(`/roles/edit/${roleId}`);
  };

  const handleDeleteRole = async () => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      try {
        // Show loading state
        toast({
          title: "Deleting role...",
          description: "Please wait while we process your request.",
        });

        // Call the delete API
        const response = await roleService.deleteRole(roleId);

        // Show success message with information about affected rows
        toast({
          title: "Role deleted",
          description: `${response.message} (${response.result?.affectedRows || 0} row affected)`,
        });

        // Navigate back to roles list
        navigate('/roles');
      } catch (error) {
        console.error('Error deleting role:', error);

        // Display a more specific error message
        let errorMessage = "Failed to delete the role. Please try again.";

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading role details...</p>
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/roles')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roles
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Shield className="h-6 w-6 mr-2 text-primary" />
            {role.name}
          </h1>
          <p className="text-muted-foreground">
            {role.description}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditRole}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Role
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteRole}
            disabled={role.is_system} // Prevent deleting system roles
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Role
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Role Information</CardTitle>
            <CardDescription>
              Basic information about the role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role Name</h3>
                <p className="text-base">{role.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role Slug</h3>
                <p className="text-base font-mono">{role.slug}</p>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base">{role.description}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Branch</h3>
                <div className="flex items-center mt-1">
                  <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                  {role.Branch ? (
                    <Badge variant="outline">{role.Branch.name}</Badge>
                  ) : (
                    <Badge variant="outline">Global</Badge>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Priority</h3>
                <div className="flex items-center mt-1">
                  <Badge variant="secondary">{role.priority}</Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                <div className="flex items-center mt-1">
                  {role.is_active ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">System Role</h3>
                <div className="flex items-center mt-1">
                  {role.is_system ? (
                    <Badge variant="outline" className="bg-primary/10">Yes</Badge>
                  ) : (
                    <Badge variant="outline">No</Badge>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Created At</h3>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{new Date(role.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                <div className="flex items-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{role.updated_at ? new Date(role.updated_at).toLocaleDateString() : 'Never'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>
              Permissions assigned to this role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {permissionCategories.map((category) => (
                <div key={category.id} className="border rounded-md p-4">
                  <h3 className="font-medium mb-2">{category.name}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {category.permissions.map((permission) => {
                      const hasAccess = hasPermission(permissions, permission.id);
                      return (
                        <div key={permission.id} className="flex items-center">
                          {hasAccess ? (
                            <Check className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <X className="h-4 w-4 mr-2 text-red-500" />
                          )}
                          <span className={hasAccess ? "" : "text-muted-foreground"}>
                            {permission.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              {permissions.includes('all') && (
                <div className="bg-primary/10 p-3 rounded-md mt-4">
                  <p className="text-sm font-medium flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    This role has full system access (all permissions)
                  </p>
                </div>
              )}

              {permissions.length === 0 && (
                <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground">
                  <p>No permissions have been assigned to this role yet.</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate(`/roles/permissions/${roleId}`)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Assign Permissions
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleDetailsPage;
