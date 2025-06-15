import { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Users, BadgeCheck, Building2, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/page-header';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext';
import { designationService, Designation } from '@/services/designationService';
import { branchService, Branch } from '@/services/branchService';
import { Badge } from '@/components/ui/badge';

// Form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Designation name must be at least 2 characters.' }),
  branch_id: z.coerce.number({ required_error: 'Branch is required' }),
  short_code: z.string().min(1, { message: 'Short code is required' }).max(10, { message: 'Short code must be at most 10 characters' }),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

const DesignationsPage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState<number | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState<Designation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  // Fetch designations and branches
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch branches first
        const branchesResponse = await branchService.getBranches({ is_active: true });
        if (branchesResponse.data) {
          setBranches(branchesResponse.data);
        }

        // Then fetch designations
        const params: any = {
          page: pagination.page,
          limit: pagination.limit
        };

        if (branchFilter !== 'all') {
          params.branch_id = branchFilter;
        }

        const designationsResponse = await designationService.getDesignations(params);

        if (designationsResponse.data) {
          setDesignations(designationsResponse.data);
          if (designationsResponse.pagination) {
            setPagination(designationsResponse.pagination);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load designations. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pagination.page, pagination.limit, branchFilter]);

  // Filter designations based on search query
  const filteredData = designations.filter((designation) => {
    return designation.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      branch_id: undefined,
      short_code: '',
      description: '',
      is_active: true,
    },
  });

  // Edit form
  const editForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      branch_id: undefined,
      short_code: '',
      description: '',
      is_active: true,
    },
  });

  // Handle add designation
  const onAddSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Add created_by from the current user
      const designationData = {
        ...values,
        created_by: parseInt(user?.id || '1') // Default to 1 if user ID is not available
      };

      console.log('Creating designation with data:', designationData);
      const response = await designationService.createDesignation(designationData);

      toast({
        title: 'Designation Added',
        description: 'The designation has been successfully added.',
      });

      // Close dialog and reset form
      setIsAddDialogOpen(false);
      form.reset();

      // Refresh the designations list
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (branchFilter !== 'all') {
        params.branch_id = branchFilter;
      }

      const designationsResponse = await designationService.getDesignations(params);

      if (designationsResponse.data) {
        setDesignations(designationsResponse.data);
        if (designationsResponse.pagination) {
          setPagination(designationsResponse.pagination);
        }
      }
    } catch (error) {
      console.error('Error adding designation:', error);
      toast({
        title: 'Error',
        description: 'There was an error adding the designation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit designation
  const onEditSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      if (!selectedDesignation) {
        throw new Error('No designation selected for editing');
      }

      console.log('Updating designation with data:', values);
      const response = await designationService.updateDesignation(selectedDesignation.id, values);

      toast({
        title: 'Designation Updated',
        description: 'The designation has been successfully updated.',
      });

      // Close dialog and reset form
      setIsEditDialogOpen(false);
      editForm.reset();

      // Refresh the designations list
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (branchFilter !== 'all') {
        params.branch_id = branchFilter;
      }

      const designationsResponse = await designationService.getDesignations(params);

      if (designationsResponse.data) {
        setDesignations(designationsResponse.data);
        if (designationsResponse.pagination) {
          setPagination(designationsResponse.pagination);
        }
      }
    } catch (error) {
      console.error('Error updating designation:', error);
      toast({
        title: 'Error',
        description: 'There was an error updating the designation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete designation
  const onDeleteConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (!selectedDesignation) {
        throw new Error('No designation selected for deletion');
      }

      console.log('Deleting designation:', selectedDesignation.id);
      const response = await designationService.deleteDesignation(selectedDesignation.id);

      toast({
        title: 'Designation Deleted',
        description: 'The designation has been successfully deleted.',
      });

      // Close dialog
      setIsDeleteDialogOpen(false);
      setSelectedDesignation(null);

      // Refresh the designations list
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (branchFilter !== 'all') {
        params.branch_id = branchFilter;
      }

      const designationsResponse = await designationService.getDesignations(params);

      if (designationsResponse.data) {
        setDesignations(designationsResponse.data);
        if (designationsResponse.pagination) {
          setPagination(designationsResponse.pagination);
        }
      }
    } catch (error) {
      console.error('Error deleting designation:', error);
      toast({
        title: 'Error',
        description: 'There was an error deleting the designation. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (designation: Designation) => {
    setSelectedDesignation(designation);
    editForm.setValue('name', designation.name);
    editForm.setValue('branch_id', designation.branch_id);
    editForm.setValue('short_code', designation.short_code);
    editForm.setValue('description', designation.description || '');
    editForm.setValue('is_active', designation.is_active);
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (designation: Designation) => {
    setSelectedDesignation(designation);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Designations"
        description="Manage job titles and positions within the company"
      />

      <div className="flex flex-col md:flex-row gap-4 mt-6 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search designations..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Select
            value={branchFilter === 'all' ? 'all' : branchFilter.toString()}
            onValueChange={(value) => setBranchFilter(value === 'all' ? 'all' : parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Designation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Designation</DialogTitle>
                <DialogDescription>
                  Create a new job title or position in the system. Fill in the details below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Designation Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CEO, Manager, Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="branch_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Branch *</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a branch" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {branches.map((branch) => (
                              <SelectItem key={branch.id} value={branch.id.toString()}>
                                {branch.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="short_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Code *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., CEO, MGR, DEV" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief description of the designation"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <p className="text-sm text-muted-foreground">
                            Is this designation currently active?
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Adding...' : 'Add Designation'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Designations</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Short Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((designation) => (
                    <TableRow key={designation.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <BadgeCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                          {designation.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
                          {designation.Branch?.name || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Code className="mr-2 h-4 w-4 text-muted-foreground" />
                          {designation.short_code}
                        </div>
                      </TableCell>
                      <TableCell>{designation.description || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={designation.is_active ? "default" : "secondary"}>
                          {designation.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(designation.created_at || '').toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(designation)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(designation)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4">
                      {isLoading ? 'Loading designations...' : 'No designations found'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                disabled={pagination.page <= 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {pagination.page} of {pagination.pages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
                disabled={pagination.page >= pagination.pages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Designation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Designation</DialogTitle>
            <DialogDescription>
              Update the designation details.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation Name *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="branch_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      defaultValue={field.value?.toString()}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id.toString()}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="short_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Code *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CEO, MGR, DEV" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="is_active"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Is this designation currently active?
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Designation'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the designation "{selectedDesignation?.name}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDeleteConfirm} disabled={isSubmitting}>
              {isSubmitting ? 'Deleting...' : 'Delete Designation'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DesignationsPage;
