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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { roleService, Role } from '@/services/roleService';
import { branchService, Branch } from '@/services/branchService';

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

const RoleEditPage = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    branch_id: null as number | null,
    is_system: false,
    priority: 10,
    is_active: true,
    permissions: [] as string[],
  });

  const [originalSlug, setOriginalSlug] = useState('');
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch role data and branches
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch branches first
        setIsLoadingBranches(true);
        const branchesResponse = await branchService.getBranches({ is_active: true });
        if (branchesResponse.data) {
          setBranches(branchesResponse.data);
        }
        setIsLoadingBranches(false);

        // Then fetch role details
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
          const role = response.data;
          setFormData({
            name: role.name,
            slug: role.slug,
            description: role.description,
            branch_id: role.branch_id,
            is_system: role.is_system,
            priority: role.priority,
            is_active: role.is_active,
            permissions: ['users.view', 'users.edit'], // Mock permissions until we implement the permissions API
          });
          setOriginalSlug(role.slug);
        } else {
          toast({
            title: "Role not found",
            description: "The requested role could not be found.",
            variant: "destructive",
          });
          navigate('/roles');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load role data. Please try again.",
          variant: "destructive",
        });
        navigate('/roles');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [roleId, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'slug') {
      setIsSlugEdited(true);
    }

    if (name === 'name' && !isSlugEdited) {
      setFormData({
        ...formData,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, '-'),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value === 'null' ? null : parseInt(value),
    });
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: checked
        ? [...formData.permissions, permissionId]
        : formData.permissions.filter(id => id !== permissionId),
    });
  };

  const handleCategorySelectAll = (categoryId: string, checked: boolean) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    if (!category) return;

    const categoryPermissionIds = category.permissions.map(p => p.id);

    setFormData({
      ...formData,
      permissions: checked
        ? [...new Set([...formData.permissions, ...categoryPermissionIds])]
        : formData.permissions.filter(id => !categoryPermissionIds.includes(id)),
    });
  };

  const isCategorySelected = (categoryId: string) => {
    const category = permissionCategories.find(cat => cat.id === categoryId);
    if (!category) return false;

    return category.permissions.every(p => formData.permissions.includes(p.id));
  };

  const isPermissionSelected = (permissionId: string) => {
    return formData.permissions.includes(permissionId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form
    if (!formData.name || !formData.slug || !formData.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Add updated_by from the current user
      const roleData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        branch_id: formData.branch_id,
        is_system: formData.is_system,
        priority: formData.priority,
        is_active: formData.is_active,
        updated_by: parseInt(user?.id || '1') // Default to 1 if user ID is not available
      };

      console.log('Updating role with data:', roleData);
      const response = await roleService.updateRole(roleId, roleData);

      toast({
        title: "Role Updated",
        description: `Role "${formData.name}" has been updated successfully.`,
      });

      // Navigate back to role details
      navigate(`/roles/${roleId}`);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update the role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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

  // Prevent editing system roles
  const isSystemRole = formData.is_system;

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(`/roles/${roleId}`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Role Details
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
          <p className="text-muted-foreground">
            Update role information and permissions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Role Information</CardTitle>
              <CardDescription>
                Basic information about the role
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSystemRole || isSubmitting} // Prevent editing system role name
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Role Slug *</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  disabled={isSystemRole || isSubmitting} // Prevent editing system role slug
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for the role
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch_id">Branch</Label>
                <Select
                  disabled={isLoadingBranches || isSystemRole || isSubmitting}
                  value={formData.branch_id === null ? 'null' : formData.branch_id.toString()}
                  onValueChange={(value) => handleSelectChange('branch_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="null">Global (All Branches)</SelectItem>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id.toString()}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Leave as "Global" for roles that apply to all branches
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  name="priority"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="10"
                  value={formData.priority}
                  onChange={handleInputChange}
                  disabled={isSystemRole || isSubmitting}
                />
                <p className="text-xs text-muted-foreground">
                  Higher priority roles (1-100) take precedence in case of conflicts
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_system"
                  checked={formData.is_system}
                  onCheckedChange={(checked) => handleSwitchChange('is_system', checked)}
                  disabled={isSystemRole || isSubmitting} // Can't change system status of system roles
                />
                <Label htmlFor="is_system">System Role</Label>
                <p className="text-xs text-muted-foreground ml-2">
                  System roles cannot be modified or deleted by regular users
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleSwitchChange('is_active', checked)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Permissions</CardTitle>
              <CardDescription>
                Select the permissions for this role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {permissionCategories.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={isCategorySelected(category.id)}
                          onCheckedChange={(checked) =>
                            handleCategorySelectAll(category.id, checked as boolean)
                          }
                          onClick={(e) => e.stopPropagation()}
                          disabled={isSystemRole || isSubmitting} // Prevent editing system role permissions
                        />
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {category.name}
                        </Label>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-6 space-y-2">
                        {category.permissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={isPermissionSelected(permission.id)}
                              onCheckedChange={(checked) =>
                                handlePermissionChange(permission.id, checked as boolean)
                              }
                              disabled={isSystemRole || isSubmitting} // Prevent editing system role permissions
                            />
                            <Label
                              htmlFor={permission.id}
                              className="text-sm"
                            >
                              {permission.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {isSystemRole && (
                <div className="bg-primary/10 p-3 rounded-md mt-4">
                  <p className="text-sm">
                    System roles have predefined permissions that cannot be modified.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
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
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RoleEditPage;
