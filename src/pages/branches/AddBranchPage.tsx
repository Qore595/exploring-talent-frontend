import { useState } from 'react';
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
import { branchService, BranchCreateData } from '@/services/branchService';
import { formatErrorMessage } from '@/utils/apiErrors';

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

const AddBranchPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Auto-generate branch code from name
    if (name === 'name' && !formData.code) {
      // Create a code based on the first 3 letters of the city name (if available) or branch name
      const city = formData.city.trim();
      let code = '';

      if (city) {
        code = city.substring(0, 3).toUpperCase();
      } else {
        code = value.substring(0, 3).toUpperCase();
      }

      // Add a sequence number
      code += '-01';

      setFormData({
        ...formData,
        code,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
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

    // Create branch data object
    const branchData: BranchCreateData = {
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
      monthly_rent: formData.monthly_rent || undefined,
      owned_or_rented: formData.owned_or_rented || undefined,
      no_of_employees: formData.no_of_employees ? parseInt(String(formData.no_of_employees)) : undefined,
      fire_safety_certified: formData.fire_safety_certified || undefined,
      is_default: formData.isHeadquarters || undefined,
      is_active: formData.is_active,
      created_by: parseInt(user?.id || '1'), // Default to 1 if user ID is not available
    };

    try {
      setIsSubmitting(true);
      const response = await branchService.createBranch(branchData);

      toast({
        title: "Branch Created",
        description: `Branch "${formData.name}" has been created successfully.`,
      });

      // Navigate back to branches list
      navigate('/branches');
    } catch (err) {
      toast({
        title: "Error",
        description: formatErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={() => navigate('/branches')} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Branches
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Branch</h1>
          <p className="text-muted-foreground">
            Create a new branch or office location
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
                  placeholder="e.g., New York Office"
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
                  placeholder="e.g., NYC-01"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Unique identifier for the branch (auto-generated from name)
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch_type">Branch Type</Label>
                <Select
                  value={formData.branch_type}
                  onValueChange={(value) => handleSelectChange('branch_type', value)}
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
                  onCheckedChange={(checked) => {
                    handleCheckboxChange('isHeadquarters', checked as boolean);
                    if (checked) {
                      handleSelectChange('branch_type', 'head_office');
                    }
                  }}
                />
                <Label
                  htmlFor="isHeadquarters"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  This is the company headquarters
                </Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of this branch"
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
                  placeholder="e.g., 1"
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
                  placeholder="e.g., 123 Main Street, Suite 100"
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
                    placeholder="e.g., New York"
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
                    placeholder="e.g., Manhattan"
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
                    placeholder="e.g., 10001"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="google_maps_url">Google Maps URL</Label>
                  <Input
                    id="google_maps_url"
                    name="google_maps_url"
                    placeholder="e.g., https://goo.gl/maps/example"
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
                    placeholder="e.g., 40.7128"
                    value={formData.location_lat}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location_lng">Longitude</Label>
                  <Input
                    id="location_lng"
                    name="location_lng"
                    placeholder="e.g., -74.0060"
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
                    placeholder="e.g., +1 (212) 555-1234"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt_phone">Alternative Phone</Label>
                  <Input
                    id="alt_phone"
                    name="alt_phone"
                    placeholder="e.g., +1 (212) 555-5678"
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
                    placeholder="e.g., newyork@qore.io"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fax">Fax Number</Label>
                  <Input
                    id="fax"
                    name="fax"
                    placeholder="e.g., +1 (212) 555-9876"
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
                    placeholder="e.g., support@qore.io"
                    value={formData.support_email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support_phone">Support Phone</Label>
                  <Input
                    id="support_phone"
                    name="support_phone"
                    placeholder="e.g., +1 (800) 555-1234"
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
                    placeholder="e.g., https://newyork.qore.io"
                    value={formData.website_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working_hours">Working Hours</Label>
                  <Input
                    id="working_hours"
                    name="working_hours"
                    placeholder="e.g., Mon-Fri: 9:00 AM - 5:00 PM"
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
                    placeholder="e.g., 25"
                    value={formData.no_of_employees}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    name="timezone"
                    placeholder="e.g., America/New_York"
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
                    placeholder="e.g., 5000"
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
          <Button type="button" variant="outline" onClick={() => navigate('/branches')} className="mr-2">
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
                Save Branch
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddBranchPage;
