import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FileText, User, Calendar } from 'lucide-react';
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
import { CreateDocumentRequest, OnboardingCandidate } from '@/types/hrOnboarding';

const CreateDocumentPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<OnboardingCandidate[]>([]);
  const [formData, setFormData] = useState<CreateDocumentRequest>({
    candidateId: '',
    name: '',
    description: '',
    category: 'personal',
    required: true,
    expiryDate: undefined,
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

  const handleInputChange = (field: keyof CreateDocumentRequest, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.candidateId || !formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await hrOnboardingService.createDocument(formData);
      toast({
        title: 'Success',
        description: 'Document created successfully',
      });
      navigate('/hr-onboarding/documents');
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: 'Error',
        description: 'Failed to create document',
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
          onClick={() => navigate('/hr-onboarding/documents')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Document</h1>
          <p className="text-gray-600 mt-1">Create a new document requirement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Document Information
            </CardTitle>
            <CardDescription>
              Basic details about the document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Document Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter document name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter document description"
                className="min-h-[100px]"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="tax">Tax</SelectItem>
                    <SelectItem value="benefits">Benefits</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
            </div>
          </CardContent>
        </Card>

        {/* Document Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Document Settings
            </CardTitle>
            <CardDescription>
              Additional settings and requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => handleInputChange('required', checked as boolean)}
              />
              <Label htmlFor="required">This document is required for onboarding</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ''}
                onChange={(e) => handleInputChange('expiryDate', e.target.value || undefined)}
              />
              <p className="text-sm text-gray-500">
                Leave empty if the document doesn't expire
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/hr-onboarding/documents')}
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
                Create Document
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDocumentPage;
