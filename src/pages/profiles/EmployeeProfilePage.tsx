import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  Building,
  MapPin,
  User,
  Users,
  FileText,
  CreditCard,
  Landmark,
  Home,
  Heart,
  GraduationCap,
  Clock,
  Award,
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { employeeService } from '@/services/employeeService';
import { isAdmin, isBranchManagerOrHigher } from '@/utils/adminPermissions';
import { useAuth } from '@/context/AuthContext';

// Helper function to get initials from name
const getInitials = (firstName: string, lastName?: string | null) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

// Helper function to format date
const formatDate = (dateString?: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

const EmployeeProfilePage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const managerOrHigher = isBranchManagerOrHigher(user?.role);
  
  const [employee, setEmployee] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('personal');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!profileId) {
        setError('No employee ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const response = await employeeService.getEmployeeById(profileId);
        
        if (response.success && response.data) {
          setEmployee(response.data);
        } else {
          setError(response.message || 'Failed to load employee data');
          toast({
            title: "Error",
            description: response.message || 'Failed to load employee data',
            variant: "destructive",
          });
        }
      } catch (err: any) {
        console.error('Error fetching employee data:', err);
        setError(err.message || 'An error occurred while fetching employee data');
        toast({
          title: "Error",
          description: err.message || 'An error occurred while fetching employee data',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, [profileId]);

  const handleEditProfile = () => {
    navigate(`/hr/employees/edit/${profileId}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading employee profile...</p>
      </div>
    );
  }

  if (error || !employee) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error || 'Employee not found'}. <Link to="/profiles" className="underline">Return to employee list</Link>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/profiles">
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{`${employee.first_name} ${employee.last_name || ''}`}</h1>
            <p className="text-muted-foreground mt-1">
              {employee.Designation?.name || employee.position || 'Employee'} 
              {employee.Department && ` • ${employee.Department.name}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {(adminUser || managerOrHigher) && (
            <Button onClick={handleEditProfile}>
              <FileText className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Employee profile content */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[600px]">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Info Card */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Personal details and contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={employee.photo || undefined} alt={`${employee.first_name} ${employee.last_name || ''}`} />
                    <AvatarFallback className="text-lg">{getInitials(employee.first_name, employee.last_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{`${employee.first_name} ${employee.last_name || ''}`}</h3>
                    <p className="text-muted-foreground">{employee.employee_id}</p>
                    <Badge variant={employee.is_active ? "default" : "destructive"} className="mt-1">
                      {employee.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {employee.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.email}</span>
                    </div>
                  )}
                  
                  {employee.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  
                  {employee.gender && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{employee.gender.charAt(0).toUpperCase() + employee.gender.slice(1)}</span>
                    </div>
                  )}
                  
                  {employee.dob && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Born: {formatDate(employee.dob)}</span>
                    </div>
                  )}
                  
                  {employee.marital_status && (
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Marital Status: {employee.marital_status}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Family Information */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Family Information</CardTitle>
                <CardDescription>Family and emergency contacts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.father_name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Father's Name</p>
                    <p>{employee.father_name}</p>
                  </div>
                )}
                
                {employee.mother_name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Mother's Name</p>
                    <p>{employee.mother_name}</p>
                  </div>
                )}
                
                {employee.emergency_contact && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Emergency Contact</p>
                    <p>{employee.emergency_contact}</p>
                    {employee.emergency_contact_relation && (
                      <p className="text-sm text-muted-foreground">
                        Relation: {employee.emergency_contact_relation}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
                <CardDescription>Current and permanent addresses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.current_location && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Current Location</p>
                    <p>{employee.current_location}</p>
                  </div>
                )}
                
                {employee.local_address && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Local Address</p>
                    <p className="whitespace-pre-line">{employee.local_address}</p>
                  </div>
                )}
                
                {employee.permanent_address && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Permanent Address</p>
                    <p className="whitespace-pre-line">{employee.permanent_address}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Employment Tab */}
        <TabsContent value="employment" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Job Information */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
                <CardDescription>Position and department details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.Branch && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Branch</p>
                    <p>{employee.Branch.name}</p>
                  </div>
                )}
                
                {employee.Department && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Department</p>
                    <p>{employee.Department.name}</p>
                  </div>
                )}
                
                {employee.Designation && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Designation</p>
                    <p>{employee.Designation.name}</p>
                    {employee.Designation.short_code && (
                      <p className="text-sm text-muted-foreground">
                        Code: {employee.Designation.short_code}
                      </p>
                    )}
                  </div>
                )}
                
                {employee.position && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Position</p>
                    <p>{employee.position}</p>
                  </div>
                )}
                
                {employee.Manager && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Reports To</p>
                    <p>{`${employee.Manager.first_name} ${employee.Manager.last_name || ''}`}</p>
                    <p className="text-sm text-muted-foreground">
                      ID: {employee.Manager.employee_id}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Employment Details */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
                <CardDescription>Employment status and dates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.employment_status && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Employment Status</p>
                    <p>{employee.employment_status.charAt(0).toUpperCase() + employee.employment_status.slice(1)}</p>
                  </div>
                )}
                
                {employee.contract_type && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Contract Type</p>
                    <p>{employee.contract_type}</p>
                  </div>
                )}
                
                {employee.work_shift && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Work Shift</p>
                    <p>{employee.work_shift}</p>
                  </div>
                )}
                
                {employee.hire_date && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Hire Date</p>
                    <p>{formatDate(employee.hire_date)}</p>
                  </div>
                )}
                
                {employee.date_of_leaving && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Date of Leaving</p>
                    <p>{formatDate(employee.date_of_leaving)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Qualifications */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Qualifications</CardTitle>
                <CardDescription>Education and experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.qualification && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Education</p>
                    <p className="whitespace-pre-line">{employee.qualification}</p>
                  </div>
                )}
                
                {employee.work_experience && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Work Experience</p>
                    <p className="whitespace-pre-line">{employee.work_experience}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Salary Information */}
            <Card>
              <CardHeader>
                <CardTitle>Salary Information</CardTitle>
                <CardDescription>Compensation details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.basic_salary && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Basic Salary</p>
                    <p>${employee.basic_salary.toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bank Information */}
            <Card>
              <CardHeader>
                <CardTitle>Bank Information</CardTitle>
                <CardDescription>Banking and payment details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.bank_account_name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Account Name</p>
                    <p>{employee.bank_account_name}</p>
                  </div>
                )}
                
                {employee.bank_account_no && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Account Number</p>
                    <p>{employee.bank_account_no}</p>
                  </div>
                )}
                
                {employee.bank_name && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Bank Name</p>
                    <p>{employee.bank_name}</p>
                  </div>
                )}
                
                {employee.bank_branch && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Bank Branch</p>
                    <p>{employee.bank_branch}</p>
                  </div>
                )}
                
                {employee.ifsc_code && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">IFSC Code</p>
                    <p>{employee.ifsc_code}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Uploaded documents and files</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.resume && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Resume</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={employee.resume} target="_blank" rel="noopener noreferrer">View</a>
                    </Button>
                  </div>
                )}
                
                {employee.joining_letter && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Joining Letter</span>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={employee.joining_letter} target="_blank" rel="noopener noreferrer">View</a>
                    </Button>
                  </div>
                )}
                
                {employee.other_documents && (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Other Documents</p>
                    <p className="whitespace-pre-line">{employee.other_documents}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>Social media profiles</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {employee.facebook && (
                  <div className="flex items-center">
                    <Facebook className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={employee.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Facebook Profile
                    </a>
                  </div>
                )}
                
                {employee.twitter && (
                  <div className="flex items-center">
                    <Twitter className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={employee.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Twitter Profile
                    </a>
                  </div>
                )}
                
                {employee.linkedin && (
                  <div className="flex items-center">
                    <Linkedin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={employee.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                
                {employee.instagram && (
                  <div className="flex items-center">
                    <Instagram className="h-4 w-4 mr-2 text-muted-foreground" />
                    <a href={employee.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Instagram Profile
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmployeeProfilePage;
