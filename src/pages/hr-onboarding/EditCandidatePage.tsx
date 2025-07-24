import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Briefcase, MapPin, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { hrOnboardingService } from '@/services/hrOnboardingService';
import { OnboardingCandidate, UpdateCandidateRequest, OnboardingStatus } from '@/types/hrOnboarding';

const EditCandidatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [candidate, setCandidate] = useState<OnboardingCandidate | null>(null);
  const [formData, setFormData] = useState<UpdateCandidateRequest>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    departmentId: '',
    managerId: '',
    startDate: '',
    locationId: '',
    salary: undefined,
    employmentType: 'full-time',
    status: 'pending',
  });

  useEffect(() => {
    if (id) {
      loadCandidate();
    }
  }, [id]);

  const loadCandidate = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await hrOnboardingService.getCandidateById(id);
      const candidateData = response.data;
      setCandidate(candidateData);
      setFormData({
        id: candidateData.id,
        firstName: candidateData.firstName,
        lastName: candidateData.lastName,
        email: candidateData.email,
        phone: candidateData.phone,
        position: candidateData.position,
        departmentId: candidateData.departmentId,
        managerId: candidateData.managerId,
        startDate: candidateData.startDate,
        locationId: candidateData.locationId,
        salary: candidateData.salary,
        employmentType: candidateData.employmentType,
        status: candidateData.status,
      });
    } catch (error) {
      console.error('Error loading candidate:', error);
      toast({
        title: 'Error',
        description: 'Failed to load candidate details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof UpdateCandidateRequest, value: string | number | OnboardingStatus) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await hrOnboardingService.updateCandidate(formData);
      toast({
        title: 'Success',
        description: 'Candidate updated successfully',
      });
      navigate(`/hr-onboarding/candidates/${id}`);
    } catch (error) {
      console.error('Error updating candidate:', error);
      toast({
        title: 'Error',
        description: 'Failed to update candidate',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !candidate) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Candidate not found</p>
        <Button onClick={() => navigate('/hr-onboarding/candidates')} className="mt-4">
          Back to Candidates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(`/hr-onboarding/candidates/${id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Candidate</h1>
          <p className="text-gray-600 mt-1">Update candidate information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Basic personal details of the candidate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment Information
            </CardTitle>
            <CardDescription>
              Job-related details and organizational structure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="Enter job position"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                <Select
                  value={formData.employmentType}
                  onValueChange={(value) => handleInputChange('employmentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departmentId">Department *</Label>
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => handleInputChange('departmentId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dept-1">Engineering</SelectItem>
                    <SelectItem value="dept-2">Design</SelectItem>
                    <SelectItem value="dept-3">Marketing</SelectItem>
                    <SelectItem value="dept-4">Sales</SelectItem>
                    <SelectItem value="dept-5">HR</SelectItem>
                    <SelectItem value="dept-6">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="managerId">Reporting Manager *</Label>
                <Select
                  value={formData.managerId}
                  onValueChange={(value) => handleInputChange('managerId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mgr-1">Sarah Johnson</SelectItem>
                    <SelectItem value="mgr-2">Mike Wilson</SelectItem>
                    <SelectItem value="mgr-3">Lisa Davis</SelectItem>
                    <SelectItem value="mgr-4">David Brown</SelectItem>
                    <SelectItem value="mgr-5">Emily Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value as OnboardingStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location and Compensation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Compensation
            </CardTitle>
            <CardDescription>
              Work location and salary information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="locationId">Work Location *</Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) => handleInputChange('locationId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="loc-1">New York Office</SelectItem>
                    <SelectItem value="loc-2">San Francisco Office</SelectItem>
                    <SelectItem value="loc-3">Chicago Office</SelectItem>
                    <SelectItem value="loc-4">Austin Office</SelectItem>
                    <SelectItem value="loc-5">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Annual Salary (Optional)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="salary"
                    type="number"
                    value={formData.salary || ''}
                    onChange={(e) => handleInputChange('salary', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Enter annual salary"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/hr-onboarding/candidates/${id}`)}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Candidate
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCandidatePage;
