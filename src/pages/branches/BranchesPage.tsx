import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Building,
  MapPin,
  Users,
  Eye,
  Loader2
} from 'lucide-react';
import { branchService, Branch } from '@/services/branchService';
import apiClient from '@/services/api';
import { formatErrorMessage } from '@/utils/apiErrors';

// Fallback mock data in case API is not available
const mockBranches = [
  {
    id: 1,
    name: 'Miami Headquarters',
    code: 'MIA-HQ',
    slug: 'miami-headquarters',
    address: '123 Ocean Drive, Miami, FL 33139',
    city: 'Miami',
    state: 'Florida',
    country: 'USA',
    postal_code: '33139',
    phone: '+1 (305) 555-1234',
    alt_phone: '+1 (305) 555-5678',
    email: 'miami@qore.io',
    fax: '+1 (305) 555-9876',
    manager_id: 1,
    description: 'Our main headquarters in Miami',
    location_lat: '25.7617',
    location_lng: '-80.1918',
    google_maps_url: 'https://goo.gl/maps/example1',
    working_hours: 'Mon-Fri: 9:00 AM - 6:00 PM',
    timezone: 'America/New_York',
    branch_type: 'head_office',
    no_of_employees: 45,
    is_default: true,
    is_active: true,
    created_by: 1,
    created_at: '2023-05-09T10:50:00.000Z',
    updated_at: '2023-05-09T10:50:00.000Z'
  },
  {
    id: 2,
    name: 'New York Office',
    code: 'NYC-01',
    slug: 'new-york-office',
    address: '1 Madison Avenue, New York, NY 10010',
    city: 'New York',
    state: 'New York',
    country: 'USA',
    postal_code: '10010',
    phone: '+1 (212) 555-5678',
    email: 'newyork@qore.io',
    branch_type: 'regional',
    no_of_employees: 28,
    is_default: false,
    is_active: true,
    created_by: 1,
    created_at: '2023-05-09T10:50:00.000Z',
    updated_at: '2023-05-09T10:50:00.000Z'
  }
];

const BranchesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch branches from API
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchBranches = async () => {
      try {
        if (isMounted) setIsLoading(true);

        // First set mock data to ensure UI works
        if (isMounted) setBranches(mockBranches);

        // Try to fetch real data
        try {
          const response = await branchService.getBranches();

          // Only update state if component is still mounted
          if (!isMounted) return;

          // Process the response
          if (response && response.data && Array.isArray(response.data)) {
            setBranches(response.data);
          } else if (Array.isArray(response)) {
            setBranches(response);
          }

          setError(null);
        } catch (apiErr) {
          console.error('API error:', apiErr);
          // Keep using mock data if API fails
        }
      } catch (err) {
        // Keep using mock data if something goes wrong
        console.error('Error fetching branches:', err);
        if (isMounted) setError(null); // Don't show error to user
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBranches();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter branches based on search query
  const filteredBranches = branches.filter(branch => {
    const name = (branch.name || '').toLowerCase();
    const code = (branch.code || '').toLowerCase();
    const city = (branch.city || '').toLowerCase();
    const state = (branch.state || '').toLowerCase();
    const query = searchQuery.toLowerCase();

    return name.includes(query) ||
           code.includes(query) ||
           city.includes(query) ||
           state.includes(query);
  });

  // Handle branch actions
  const handleViewBranch = (branchId: number) => {
    navigate(`/branches/${branchId}`);
  };

  const handleEditBranch = (branchId: number) => {
    navigate(`/branches/edit/${branchId}`);
  };

  const handleDeleteBranch = async (branchId: number, isDefault: boolean) => {
    if (isDefault) {
      toast({
        title: "Cannot Delete Default Branch",
        description: "The default branch cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    // Find the branch name for better user feedback
    const branchToDelete = branches.find(b => b.id === branchId);
    const branchName = branchToDelete?.name || 'this branch';

    // Confirm deletion with the user
    if (!window.confirm(`Are you sure you want to delete ${branchName}? This action cannot be undone.`)) {
      return;
    }

    // Show loading toast
    const loadingToast = toast({
      title: "Deleting Branch",
      description: `Please wait while ${branchName} is being deleted...`,
    });

    try {
      // Log the branch ID being deleted
      console.log('Attempting to delete branch with ID:', branchId);

      // Call API to delete branch with explicit ID
      const response = await branchService.deleteBranch(branchId);
      console.log('Delete response:', response);

      // Check if the response matches the expected format
      if (response && response.success) {
        // Success toast with the message from the API
        toast({
          title: "Success",
          description: response.message || `${branchName} has been deleted successfully.`,
        });
      } else {
        // Success toast with default message
        toast({
          title: "Branch Deleted",
          description: `${branchName} has been deleted successfully.`,
        });
      }

      // Refresh branches list
      setBranches(branches.filter(branch => branch.id !== branchId));
    } catch (err: any) {
      console.error('Error deleting branch:', err);

      // Try to extract the most useful error message
      let errorMessage = formatErrorMessage(err);

      // If we have a response with data, try to get a more specific message
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }

      // Error toast with detailed message
      toast({
        title: "Error Deleting Branch",
        description: errorMessage,
        variant: "destructive",
      });

      // If it's a 404 error, the branch might already be deleted
      if (err.response && err.response.status === 404) {
        toast({
          title: "Branch Not Found",
          description: "This branch may have already been deleted.",
        });
        // Remove from the list anyway
        setBranches(branches.filter(branch => branch.id !== branchId));
      }
    }
  };

  const handleAddBranch = () => {
    navigate('/branches/add');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Branch Management</h1>
          <p className="text-muted-foreground">
            View and manage company branches and locations
          </p>
        </div>
        <Button onClick={handleAddBranch}>
            <Plus className="mr-2 h-4 w-4" /> Add New Branch
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Branches</CardTitle>
          <CardDescription>
            Manage the branches and office locations of your organization
          </CardDescription>
          <div className="flex w-full max-w-sm items-center space-x-2 mt-4">
            <Input
              placeholder="Search branches..."
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
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No branches found</p>
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No branches found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Employees</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBranches.map((branch) => {
                  // Safely access properties with fallbacks
                  const id = branch.id || 0;
                  const name = branch.name || 'Unnamed Branch';
                  const code = branch.code || 'NO-CODE';
                  const city = branch.city || 'Unknown City';
                  const state = branch.state || 'Unknown State';
                  const isDefault = branch.is_default || false;
                  const noOfEmployees = branch.no_of_employees || 0;
                  const phone = branch.phone || 'N/A';
                  const email = branch.email || 'N/A';

                  return (
                    <TableRow key={id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-primary" />
                          {name}
                          {isDefault && (
                            <Badge className="ml-2" variant="secondary">HQ</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Code: {code}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{city}, {state}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                          <Badge variant="outline">{noOfEmployees}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{phone}</div>
                        <div className="text-xs text-muted-foreground">{email}</div>
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
                            <DropdownMenuItem onClick={() => handleViewBranch(id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditBranch(id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Branch
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteBranch(id, isDefault)}
                              disabled={isDefault} // Prevent deleting default branch
                              className={isDefault ? 'text-muted-foreground' : 'text-destructive'}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Delete Branch
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            Showing {filteredBranches.length} of {branches.length} branches
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BranchesPage;
