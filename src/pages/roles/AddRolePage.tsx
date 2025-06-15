import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { roleService } from '@/services/roleService';
import { branchService, Branch } from '@/services/branchService';


const AddRolePage = () => {
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
  });

  // Fetch branches for the branch dropdown
  useEffect(() => {
    const fetchBranches = async () => {
      setIsLoadingBranches(true);
      try {
        const response = await branchService.getBranches({ is_active: true });
        if (response.data) {
          setBranches(response.data);
        }
      } catch (error) {
        console.error('Error fetching branches:', error);
        toast({
          title: 'Error',
          description: 'Failed to load branches. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoadingBranches(false);
      }
    };

    fetchBranches();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-generate slug from name (lowercase, hyphenated)
    if (name === 'name') {
      setFormData({
        ...formData,
        name: value,
        slug: value.toLowerCase().replace(/\s+/g, '-'),
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
      // Add created_by from the current user
      const roleData = {
        ...formData,
        created_by: parseInt(user?.id || '1') // Default to 1 if user ID is not available
      };

      console.log('Creating role with data:', roleData);
      const response = await roleService.createRole(roleData);

      toast({
        title: "Role Created",
        description: `Role "${formData.name}" has been created successfully. You can now assign permissions to this role.`,
      });

      // Navigate back to roles list
      navigate('/roles');
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create the role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/roles')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Roles
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Role</h1>
          <p className="text-muted-foreground">
            Create a new role with specific permissions
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="max-w-2xl mx-auto">
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
                placeholder="e.g., Marketing Manager"
                value={formData.name}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Role Slug *</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="e.g., marketing-manager"
                value={formData.slug}
                onChange={handleInputChange}
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Unique identifier for the role (auto-generated from name)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the role's responsibilities and access level"
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
                disabled={isLoadingBranches || isSubmitting}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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

            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                After creating the role, you can assign permissions from the roles list.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/roles')}
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
                Save Role
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddRolePage;
