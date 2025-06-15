import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash,
  UserCheck,
  Shield,
  Eye,
  Loader2
} from 'lucide-react';
import { roleService, Role } from '@/services/roleService';

const RolesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  // Fetch roles
  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: pagination.page,
          limit: pagination.limit
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        const response = await roleService.getRoles(params);

        if (response.data) {
          setRoles(response.data);
          if (response.pagination) {
            setPagination(response.pagination);
          }
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load roles. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, [pagination.page, pagination.limit, searchQuery, toast]);

  // Filter roles based on search query for client-side filtering
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle role actions
  const handleViewRole = (roleId: number) => {
    console.log('Navigating to view role:', roleId);
    navigate(`/roles/${roleId}`);
  };

  const handleEditRole = (roleId: number) => {
    console.log('Navigating to edit role:', roleId);
    navigate(`/roles/edit/${roleId}`);
  };

  const handleAssignPermissions = (roleId: number) => {
    console.log('Navigating to role permissions:', roleId);
    navigate(`/roles/permissions/${roleId}`);
  };

  const handleDeleteRole = async (roleId: number) => {
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

        // Refresh the roles list
        const rolesResponse = await roleService.getRoles({
          page: pagination.page,
          limit: pagination.limit
        });

        if (rolesResponse.data) {
          setRoles(rolesResponse.data);
          if (rolesResponse.pagination) {
            setPagination(rolesResponse.pagination);
          }
        }
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

  const handleAddRole = () => {
    navigate('/roles/add');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles Management</h1>
          <p className="text-muted-foreground">
            View and manage user roles and their permissions
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate('/roles/permission-groups')}>
            <Shield className="mr-2 h-4 w-4" /> Permission Groups
          </Button>
          <Button onClick={handleAddRole}>
            <Plus className="mr-2 h-4 w-4" /> Add New Role
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Roles</CardTitle>
          <CardDescription>
            Manage the roles available in the system and their associated permissions
          </CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading roles...</span>
            </div>
          ) : roles.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No roles found. {searchQuery ? 'Try a different search term.' : 'Create your first role by clicking "Add New Role".'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Shield className="h-4 w-4 mr-2 text-primary" />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell>{role.description}</TableCell>
                    <TableCell>
                      {role.Branch ? (
                        <Badge variant="outline">{role.Branch.name}</Badge>
                      ) : (
                        <Badge variant="outline">Global</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{role.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      {role.is_active ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="destructive">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewRole(role.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditRole(role.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleAssignPermissions(role.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Assign Permissions
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRole(role.id)}
                            disabled={role.is_system} // Prevent deleting system roles
                            className={role.is_system ? 'text-muted-foreground' : 'text-destructive'}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredRoles.length} of {pagination.total} roles
          </p>
          {pagination.pages > 1 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1 || isLoading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages || isLoading}
              >
                Next
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default RolesPage;
