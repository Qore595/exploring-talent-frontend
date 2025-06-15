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
  Building,
  MapPin,
  Phone,
  Mail,
  Users,
  Briefcase,
  Loader2
} from 'lucide-react';
import { branchService, Branch } from '@/services/branchService';
import { formatErrorMessage } from '@/utils/apiErrors';

// Mock branches data - same as in BranchesPage
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

// Mock employees for the branch
const mockEmployees = [
  { id: '1', name: 'Sarah Chen', role: 'CEO', department: 'Executive' },
  { id: '2', name: 'Michael Thompson', role: 'Branch Manager', department: 'Management' },
  { id: '3', name: 'Emma Rodriguez', role: 'Marketing Head', department: 'Marketing' },
  { id: '4', name: 'David Kim', role: 'Marketing Supervisor', department: 'Marketing' },
  { id: '5', name: 'Jordan Lee', role: 'Marketing Recruiter', department: 'Recruitment' },
];

const BranchDetailsPage = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates if component unmounts

    const fetchBranchDetails = async () => {
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }

        // Check for mock data first
        const mockBranchId = parseInt(branchId || '0');
        const foundMockBranch = mockBranches.find(b => b.id === mockBranchId);

        // Try to fetch from API
        try {
          const response = await branchService.getBranchById(branchId || '0');

          // Only update state if component is still mounted
          if (!isMounted) return;

          if (response && response.data) {
            // Use API data if available
            setBranch(response.data);
            return; // Exit early after setting branch data
          }
        } catch (apiErr) {
          console.error('API error:', apiErr);
          // Continue to use mock data if API fails
        }

        // If API failed or returned no data, use mock data
        if (!isMounted) return;

        if (foundMockBranch) {
          setBranch(foundMockBranch);
        } else {
          // No data available at all
          setError('Branch not found');
          toast({
            title: "Branch not found",
            description: "The requested branch could not be found.",
            variant: "destructive",
          });
          navigate('/branches');
        }
      } catch (err) {
        if (!isMounted) return;
        console.error('Error in fetchBranchDetails:', err);
        setError('An unexpected error occurred');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBranchDetails();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [branchId, navigate, toast]);

  const handleEditBranch = () => {
    navigate(`/branches/edit/${branchId}`);
  };

  const handleDeleteBranch = async () => {
    if (branch?.is_default) {
      toast({
        title: "Cannot Delete Default Branch",
        description: "The default branch cannot be deleted.",
        variant: "destructive",
      });
      return;
    }

    // Confirm deletion with the user
    if (!window.confirm(`Are you sure you want to delete branch "${branch?.name}"? This action cannot be undone.`)) {
      return;
    }

    // Show loading toast
    const loadingToast = toast({
      title: "Deleting Branch",
      description: "Please wait while the branch is being deleted...",
    });

    try {
      // Log the branch ID being deleted
      console.log('Attempting to delete branch with ID:', branchId);

      // Call API to delete branch
      const response = await branchService.deleteBranch(branchId || '0');
      console.log('Delete response:', response);

      // Check if the response matches the expected format
      if (response && response.success) {
        // Success toast with the message from the API
        toast({
          title: "Success",
          description: response.message || `Branch "${branch?.name}" has been deleted successfully.`,
        });
      } else {
        // Success toast with default message
        toast({
          title: "Branch Deleted",
          description: `Branch "${branch?.name}" has been deleted successfully.`,
        });
      }

      // Navigate back to branches list
      navigate('/branches');
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
        navigate('/branches');
      }
    }
  };

  const handleViewEmployees = () => {
    // In a real app, this would navigate to a filtered employees page
    toast({
      title: "View Employees",
      description: "This feature is not implemented yet.",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Loading branch details...</p>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="container mx-auto py-6 flex justify-center">
        <div className="text-center">
          <p className="text-destructive font-medium mb-2">Branch not found</p>
          <p className="text-muted-foreground mb-4">The requested branch could not be found.</p>
          <Button onClick={() => navigate('/branches')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Branches
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/branches')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Branches
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center">
            <Building className="h-6 w-6 mr-2 text-primary" />
            {branch.name}
            {branch.is_default && (
              <Badge className="ml-2" variant="secondary">Headquarters</Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Branch Code: {branch.code}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleEditBranch}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Branch
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteBranch}
            disabled={branch.is_default} // Prevent deleting default branch
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete Branch
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branch Information</CardTitle>
            <CardDescription>
              Basic information about the branch
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
              <div className="flex items-start mt-1">
                <MapPin className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-base">{branch.address || 'N/A'}</p>
                  <p className="text-base">{branch.city}, {branch.state} {branch.postal_code}</p>
                  <p className="text-base">{branch.country}</p>
                  {branch.google_maps_url && (
                    <a
                      href={branch.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline mt-1 inline-block"
                    >
                      View on Google Maps
                    </a>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <div className="flex items-center mt-1">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-base">{branch.phone || 'N/A'}</p>
                </div>
                {branch.alt_phone && (
                  <div className="flex items-center mt-1">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground opacity-0" />
                    <p className="text-sm text-muted-foreground">Alt: {branch.alt_phone}</p>
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-base">{branch.email || 'N/A'}</p>
                </div>
                {branch.fax && (
                  <div className="flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground opacity-0" />
                    <p className="text-sm text-muted-foreground">Fax: {branch.fax}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Employees</h3>
              <div className="flex items-center mt-1 justify-between">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Badge variant="outline">{branch.no_of_employees || 0}</Badge>
                </div>
                <Button variant="outline" size="sm" onClick={handleViewEmployees}>
                  View Employees
                </Button>
              </div>
            </div>

            {branch.description && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                <p className="text-base mt-1">{branch.description}</p>
              </div>
            )}

            {branch.branch_type && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Branch Type</h3>
                <p className="text-base mt-1 capitalize">{branch.branch_type.replace('_', ' ')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Personnel</CardTitle>
            <CardDescription>
              Management and key staff at this branch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEmployees.slice(0, 5).map((employee) => (
                <div key={employee.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{employee.name}</p>
                    <p className="text-sm text-muted-foreground">{employee.role}</p>
                  </div>
                  <Badge variant="outline">{employee.department}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={handleViewEmployees}>
              <Users className="h-4 w-4 mr-2" />
              View All Employees
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Branch Activity</CardTitle>
          <CardDescription>
            Recent activity and statistics for this branch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Employee Count
              </h3>
              <p className="text-2xl font-bold">{branch.no_of_employees || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {(branch.no_of_employees || 0) > 20 ? 'Large branch' : (branch.no_of_employees || 0) > 10 ? 'Medium branch' : 'Small branch'}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Briefcase className="h-4 w-4 mr-2" />
                Active Jobs
              </h3>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground mt-1">
                4 positions filled this month
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Branch Status
              </h3>
              <p className="text-lg font-medium">
                <Badge
                  variant="outline"
                  className={branch.is_active
                    ? "bg-green-500/10 text-green-600 hover:bg-green-500/10 hover:text-green-600"
                    : "bg-red-500/10 text-red-600 hover:bg-red-500/10 hover:text-red-600"
                  }
                >
                  {branch.is_active ? 'Active' : 'Inactive'}
                </Badge>
                {branch.is_default && (
                  <Badge className="ml-2" variant="secondary">Default</Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Established: {branch.opening_date
                  ? new Date(branch.opening_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                  : 'Unknown'
                }
              </p>
              {branch.last_renovated && (
                <p className="text-xs text-muted-foreground">
                  Last renovated: {new Date(branch.last_renovated).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>


    </div>
  );
};

export default BranchDetailsPage;
