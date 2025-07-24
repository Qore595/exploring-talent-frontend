import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, GraduationCap, User, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { hrOnboardingService } from '@/services/hrOnboardingService';
import { CreateTrainingRequest, OnboardingCandidate, Priority } from '@/types/hrOnboarding';

const CreateTrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<OnboardingCandidate[]>([]);
  const [formData, setFormData] = useState<CreateTrainingRequest>({
    candidateId: '',
    title: '',
    description: '',
    category: 'orientation',
    required: true,
    priority: 'medium',
    duration: 2,
    dueDate: '',
    instructorId: '',
    format: 'online',
    location: undefined,
    passingScore: 80,
    maxAttempts: 3,
  });

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const response = await hrOnboardingService.getCandidates(1, 100);
      setCandidates(response.data);
    } catch (error) {
      console.error('Error loading candidates:', error);
    }
  };

  const handleInputChange = (field: keyof CreateTrainingRequest, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.candidateId || !formData.instructorId || !formData.dueDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await hrOnboardingService.createTraining(formData);
      toast({
        title: 'Success',
        description: 'Training created successfully',
      });
      navigate('/hr-onboarding/training');
    } catch (error) {
      console.error('Error creating training:', error);
      toast({
        title: 'Error',
        description: 'Failed to create training',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/hr-onboarding/training')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Training</h1>
          <p className="text-gray-600 mt-1">Add a new training program</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Training Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Training Information
            </CardTitle>
            <CardDescription>
              Basic details about the training program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Training Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter training title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter training description"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="orientation">Orientation</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="technical">Technical</SelectItem>
                    <SelectItem value="soft-skills">Soft Skills</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value as Priority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Hours) *</Label>
                <Input
                  id="duration"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 2)}
                  placeholder="Enter duration"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Assignment Information
            </CardTitle>
            <CardDescription>
              Candidate and instructor details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidateId">Candidate *</Label>
                <Select
                  value={formData.candidateId}
                  onValueChange={(value) => handleInputChange('candidateId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select candidate" />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((candidate) => (
                      <SelectItem key={candidate.id} value={candidate.id}>
                        {candidate.firstName} {candidate.lastName} - {candidate.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructorId">Instructor *</Label>
                <Select
                  value={formData.instructorId}
                  onValueChange={(value) => handleInputChange('instructorId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr-mgr-1">HR Manager</SelectItem>
                    <SelectItem value="safety-1">Safety Officer</SelectItem>
                    <SelectItem value="tech-1">Technical Lead</SelectItem>
                    <SelectItem value="trainer-1">Training Specialist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => handleInputChange('required', checked as boolean)}
              />
              <Label htmlFor="required">This training is required for onboarding</Label>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delivery Information
            </CardTitle>
            <CardDescription>
              Format, location, and schedule details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="format">Format *</Label>
                <Select
                  value={formData.format}
                  onValueChange={(value) => handleInputChange('format', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="self-paced">Self-Paced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                />
              </div>
            </div>
            {(formData.format === 'in-person' || formData.format === 'hybrid') && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="Enter training location"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assessment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Assessment Information
            </CardTitle>
            <CardDescription>
              Scoring and attempt settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="passingScore">Passing Score (%)</Label>
                <Input
                  id="passingScore"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.passingScore}
                  onChange={(e) => handleInputChange('passingScore', parseInt(e.target.value) || 80)}
                  placeholder="Enter passing score"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Maximum Attempts</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.maxAttempts}
                  onChange={(e) => handleInputChange('maxAttempts', parseInt(e.target.value) || 3)}
                  placeholder="Enter max attempts"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/hr-onboarding/training')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Create Training
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTrainingPage;
