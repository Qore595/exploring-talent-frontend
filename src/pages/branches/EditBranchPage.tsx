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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Building, Loader2 } from 'lucide-react';
import { branchService, Branch, BranchCreateData } from '@/services/branchService';
import { formatErrorMessage } from '@/utils/apiErrors';

// Fallback mock data in case API is not available
const mockBranches: Branch[] = [
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

// Mock US states for dropdown
const usStates = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

// Mock countries for dropdown
const countries = [
  { value: 'USA', label: 'United States' },
  { value: 'CAN', label: 'Canada' },
  { value: 'MEX', label: 'Mexico' },
  { value: 'GBR', label: 'United Kingdom' },
];

// Branch types
const branchTypes = [
  { value: 'head_office', label: 'Head Office' },
  { value: 'regional', label: 'Regional Office' },
  { value: 'branch', label: 'Branch' },
  { value: 'satellite', label: 'Satellite Office' },
];

const EditBranchPage = () => {
  const { branchId } = useParams<{ branchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    slug: '',
    address: '',
    landmark: '',
    city: '',
    district: '',
    state: '',
    zipCode: '',
    country: 'USA',
    phone: '',
    alt_phone: '',
    email: '',
    fax: '',
    manager_id: '',
    description: '',
    location_lat: '',
    location_lng: '',
    google_maps_url: '',
    working_hours: '',
    timezone: '',
    logo_url: '',
    website_url: '',
    support_email: '',
    support_phone: '',
    branch_type: 'regional',
    opening_date: '',
    last_renovated: '',
    monthly_rent: '',
    owned_or_rented: 'rented',
    no_of_employees: 0,
    fire_safety_certified: false,
    isHeadquarters: false,
    is_active: true,
  });
  const [originalIsHeadquarters, setOriginalIsHeadquarters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBranchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // First try to get data from API
        try {
          const response = await branchService.getBranchById(branchId || '0');

          if (response && response.data) {
            const branch = response.data;

            // Map API data to form fields
            setFormData({
              name: branch.name || '',
              code: branch.code || '',
              slug: branch.slug || '',
              address: branch.address || '',
              landmark: branch.landmark || '',
              city: branch.city || '',
              district: branch.district || '',
              state: branch.state || '',
              zipCode: branch.postal_code || '',
              country: branch.country || 'USA',
              phone: branch.phone || '',
              alt_phone: branch.alt_phone || '',
              email: branch.email || '',
              fax: branch.fax || '',
              manager_id: branch.manager_id ? String(branch.manager_id) : '',
              description: branch.description || '',
              location_lat: branch.location_lat || '',
              location_lng: branch.location_lng || '',
              google_maps_url: branch.google_maps_url || '',
              working_hours: branch.working_hours || '',
              timezone: branch.timezone || '',
              logo_url: branch.logo_url || '',
              website_url: branch.website_url || '',
              support_email: branch.support_email || '',
              support_phone: branch.support_phone || '',
              branch_type: branch.branch_type || 'regional',
              opening_date: branch.opening_date || '',
              last_renovated: branch.last_renovated || '',
              monthly_rent: branch.monthly_rent ? String(branch.monthly_rent) : '',
              owned_or_rented: branch.owned_or_rented || 'rented',
              no_of_employees: branch.no_of_employees || 0,
              fire_safety_certified: branch.fire_safety_certified || false,
              isHeadquarters: branch.is_default || false,
              is_active: branch.is_active !== undefined ? branch.is_active : true,
            });

            setOriginalIsHeadquarters(branch.is_default || false);
            setIsLoading(false);
            return;
          }
        } catch (apiErr) {
          console.error('Error fetching branch from API:', apiErr);
          // Fall back to mock data
        }

        // If API fails, try to use mock data
        const mockBranchId = parseInt(branchId || '0');
        const foundBranch = mockBranches.find(b => b.id === mockBranchId);

        if (foundBranch) {
          setFormData({
            name: foundBranch.name || '',
            code: foundBranch.code || '',
            slug: foundBranch.slug || '',
            address: foundBranch.address || '',
            landmark: foundBranch.landmark || '',
            city: foundBranch.city || '',
            district: foundBranch.district || '',
            state: foundBranch.state || '',
            zipCode: foundBranch.postal_code || '',
            country: foundBranch.country || 'USA',
            phone: foundBranch.phone || '',
            alt_phone: foundBranch.alt_phone || '',
            email: foundBranch.email || '',
            fax: foundBranch.fax || '',
            manager_id: foundBranch.manager_id ? String(foundBranch.manager_id) : '',
            description: foundBranch.description || '',
            location_lat: foundBranch.location_lat || '',
            location_lng: foundBranch.location_lng || '',
            google_maps_url: foundBranch.google_maps_url || '',
            working_hours: foundBranch.working_hours || '',
            timezone: foundBranch.timezone || '',
            logo_url: foundBranch.logo_url || '',
            website_url: foundBranch.website_url || '',
            support_email: foundBranch.support_email || '',
            support_phone: foundBranch.support_phone || '',
            branch_type: foundBranch.branch_type || 'regional',
            opening_date: foundBranch.opening_date || '',
            last_renovated: foundBranch.last_renovated || '',
            monthly_rent: foundBranch.monthly_rent ? String(foundBranch.monthly_rent) : '',
            owned_or_rented: foundBranch.owned_or_rented || 'rented',
            no_of_employees: foundBranch.no_of_employees || 0,
            fire_safety_certified: foundBranch.fire_safety_certified || false,
            isHeadquarters: foundBranch.is_default || false,
            is_active: foundBranch.is_active !== undefined ? foundBranch.is_active : true,
          });

          setOriginalIsHeadquarters(foundBranch.is_default || false);
          setIsLoading(false);
        } else {
          // No data available at all
          toast({
            title: "Branch not found",
            description: "The requested branch could not be found.",
            variant: "destructive",
          });
          navigate('/branches');
        }
      } catch (err) {
        console.error('Error in fetchBranchDetails:', err);
        setError('An unexpected error occurred');
        setIsLoading(false);

        toast({
          title: "Error",
          description: formatErrorMessage(err),
          variant: "destructive",
        });
      }
    };

    fetchBranchDetails();
  }, [branchId, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    // If this branch is already the headquarters and we're trying to uncheck it,
    // show a warning and prevent the change
    if (name === 'isHeadquarters' && originalIsHeadquarters && !checked) {
      toast({
        title: "Cannot Change Headquarters",
        description: "You cannot remove headquarters status from this branch. Please designate another branch as headquarters first.",
        variant: "destructive",
      });
      return;
    }

    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.code || !formData.address || !formData.city || !formData.state || !formData.country) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Create branch data object for API
    const branchData: Partial<BranchCreateData> = {
      name: formData.name,
      code: formData.code,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      address: formData.address,
      landmark: formData.landmark || undefined,
      city: formData.city,
      district: formData.district || undefined,
      state: formData.state,
      country: formData.country,
      postal_code: formData.zipCode,
      phone: formData.phone || undefined,
      alt_phone: formData.alt_phone || undefined,
      email: formData.email || undefined,
      fax: formData.fax || undefined,
      manager_id: formData.manager_id ? parseInt(formData.manager_id) : undefined,
      description: formData.description || undefined,
      location_lat: formData.location_lat || undefined,
      location_lng: formData.location_lng || undefined,
      google_maps_url: formData.google_maps_url || undefined,
      working_hours: formData.working_hours || undefined,
      timezone: formData.timezone || undefined,
      logo_url: formData.logo_url || undefined,
      website_url: formData.website_url || undefined,
      support_email: formData.support_email || undefined,
      support_phone: formData.support_phone || undefined,
      branch_type: formData.isHeadquarters ? 'head_office' : formData.branch_type,
      opening_date: formData.opening_date || undefined,
      last_renovated: formData.last_renovated || undefined,
      monthly_rent: formData.monthly_rent ? formData.monthly_rent : undefined,
      owned_or_rented: formData.owned_or_rented || undefined,
      no_of_employees: formData.no_of_employees ? parseInt(String(formData.no_of_employees)) : undefined,
      fire_safety_certified: formData.fire_safety_certified || undefined,
      is_default: formData.isHeadquarters || undefined,
      is_active: formData.is_active,
    };

    try {
      setIsSubmitting(true);

      // Call API to update branch
      const response = await branchService.updateBranch(branchId || '0', branchData);

      toast({
        title: "Branch Updated",
        description: `Branch "${formData.name}" has been updated successfully.`,
      });

      // Navigate back to branch details
      navigate(`/branches/${branchId}`);
    } catch (err) {
      console.error('Error updating branch:', err);

      toast({
        title: "Error",
        description: formatErrorMessage(err),
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
        <p>Loading branch details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate(`/branches/${branchId}`)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Branch Details
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Branch</h1>
          <p className="text-muted-foreground">
            Update branch information and details
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Branch Information</CardTitle>
              <CardDescription>
                Basic information about the branch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Branch Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Branch Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for the branch
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch_type">Branch Type</Label>
                <Select
                  value={formData.branch_type}
                  onValueChange={(value) => handleSelectChange('branch_type', value)}
                  disabled={formData.isHeadquarters} // Disable if headquarters
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch type" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="isHeadquarters"
                  checked={formData.isHeadquarters}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('isHeadquarters', checked as boolean)
                  }
                  disabled={originalIsHeadquarters} // Prevent unchecking if this is already HQ
                />
                <Label
                  htmlFor="isHeadquarters"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is the company headquarters
                </Label>
              </div>
              {originalIsHeadquarters && (
                <p className="text-xs text-muted-foreground">
                  Headquarters status cannot be changed. To change headquarters, designate another branch as headquarters first.
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manager_id">Manager ID</Label>
                <Input
                  id="manager_id"
                  name="manager_id"
                  value={formData.manager_id}
                  onChange={handleInputChange}
                  type="number"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
              <CardDescription>
                Address and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landmark">Landmark</Label>
                <Input
                  id="landmark"
                  name="landmark"
                  placeholder="e.g., Near Central Park"
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Input
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Select
                    value={formData.state}
                    onValueChange={(value) => handleSelectChange('state', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {usStates.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleSelectChange('country', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google_maps_url">Google Maps URL</Label>
                  <Input
                    id="google_maps_url"
                    name="google_maps_url"
                    value={formData.google_maps_url}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location_lat">Latitude</Label>
                  <Input
                    id="location_lat"
                    name="location_lat"
                    value={formData.location_lat}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location_lng">Longitude</Label>
                  <Input
                    id="location_lng"
                    name="location_lng"
                    value={formData.location_lng}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                Communication details for this branch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt_phone">Alternative Phone</Label>
                  <Input
                    id="alt_phone"
                    name="alt_phone"
                    value={formData.alt_phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fax">Fax Number</Label>
                  <Input
                    id="fax"
                    name="fax"
                    value={formData.fax}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="support_email">Support Email</Label>
                  <Input
                    id="support_email"
                    name="support_email"
                    type="email"
                    value={formData.support_email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support_phone">Support Phone</Label>
                  <Input
                    id="support_phone"
                    name="support_phone"
                    value={formData.support_phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    name="website_url"
                    value={formData.website_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working_hours">Working Hours</Label>
                  <Input
                    id="working_hours"
                    name="working_hours"
                    value={formData.working_hours}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Details</CardTitle>
              <CardDescription>
                Other important information about this branch
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="opening_date">Opening Date</Label>
                  <Input
                    id="opening_date"
                    name="opening_date"
                    type="date"
                    value={formData.opening_date}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_renovated">Last Renovated</Label>
                  <Input
                    id="last_renovated"
                    name="last_renovated"
                    type="date"
                    value={formData.last_renovated}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="no_of_employees">Number of Employees</Label>
                  <Input
                    id="no_of_employees"
                    name="no_of_employees"
                    type="number"
                    value={formData.no_of_employees}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly_rent">Monthly Rent</Label>
                  <Input
                    id="monthly_rent"
                    name="monthly_rent"
                    type="number"
                    value={formData.monthly_rent}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owned_or_rented">Ownership Status</Label>
                  <Select
                    value={formData.owned_or_rented}
                    onValueChange={(value) => handleSelectChange('owned_or_rented', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owned">Owned</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                      <SelectItem value="leased">Leased</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="fire_safety_certified"
                  checked={formData.fire_safety_certified}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('fire_safety_certified', checked as boolean)
                  }
                />
                <Label
                  htmlFor="fire_safety_certified"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Fire Safety Certified
                </Label>
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange('is_active', checked as boolean)
                  }
                />
                <Label
                  htmlFor="is_active"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Branch is Active
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={() => navigate(`/branches/${branchId}`)} className="mr-2">
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

export default EditBranchPage;
