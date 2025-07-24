import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Plus, X, Eye, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { emailTemplateService } from '@/services/emailTemplateService';
import { 
  UpdateEmailTemplateRequest, 
  EmailTemplateCategory, 
  EMAIL_TEMPLATE_CATEGORIES,
  EmailTemplateFormData,
  EmailTemplate
} from '@/types/emailTemplates';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const EditEmailTemplatePage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [originalTemplate, setOriginalTemplate] = useState<EmailTemplate | null>(null);
  
  const [formData, setFormData] = useState<EmailTemplateFormData>({
    name: '',
    subject: '',
    content: '',
    category: 'general',
    tags: [],
    isActive: true,
  });

  // Load template data
  useEffect(() => {
    const loadTemplate = async () => {
      if (!id) {
        navigate('/email-templates');
        return;
      }

      try {
        setInitialLoading(true);
        const response = await emailTemplateService.getEmailTemplateById(id);
        const template = response.data;
        
        setOriginalTemplate(template);
        setFormData({
          name: template.name,
          subject: template.subject,
          content: template.content,
          category: template.category,
          tags: template.tags,
          isActive: template.isActive,
        });
      } catch (error) {
        console.error('Failed to load email template:', error);
        toast({
          title: "Error",
          description: "Failed to load email template",
          variant: "destructive",
        });
        navigate('/email-templates');
      } finally {
        setInitialLoading(false);
      }
    };

    loadTemplate();
  }, [id, navigate, toast]);

  const handleInputChange = (field: keyof EmailTemplateFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Template name is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.subject.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Template content is required",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      const updateRequest: UpdateEmailTemplateRequest = {
        id: id!,
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
        isActive: formData.isActive,
      };

      await emailTemplateService.updateEmailTemplate(updateRequest);
      
      toast({
        title: "Success",
        description: "Email template updated successfully",
      });
      
      navigate('/email-templates');
    } catch (error) {
      console.error('Failed to update email template:', error);
      toast({
        title: "Error",
        description: "Failed to update email template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderPreviewContent = () => {
    return (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Subject:</Label>
          <p className="text-sm text-muted-foreground mt-1">{formData.subject || 'No subject'}</p>
        </div>
        <div>
          <Label className="text-sm font-medium">Content:</Label>
          <div className="mt-2 p-4 border rounded-md bg-background min-h-[200px] whitespace-pre-wrap">
            {formData.content || 'No content'}
          </div>
        </div>
      </div>
    );
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading template...</span>
        </div>
      </div>
    );
  }

  if (!originalTemplate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Template Not Found</h2>
        <p className="text-muted-foreground mb-4">The email template you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/email-templates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/email-templates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Email Template</h1>
          <p className="text-muted-foreground mt-2">
            Update your email template: {originalTemplate.name}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update the basic details for your email template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Interview Invitation - Technical Role"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value as EmailTemplateCategory)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {EMAIL_TEMPLATE_CATEGORIES.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Interview Invitation for {{position}} at {{company}}"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use {{variableName}} for dynamic content (e.g., {{candidateName}}, {{position}})
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active template</Label>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
            <CardDescription>
              Add tags to help organize and find your templates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Template Content */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Template Content</CardTitle>
                <CardDescription>
                  Update the content for your email template using the rich text editor
                </CardDescription>
              </div>
              <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Email Template Preview</DialogTitle>
                    <DialogDescription>
                      Preview how your email template will look
                    </DialogDescription>
                  </DialogHeader>
                  {renderPreviewContent()}
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Template Content *</Label>
              <Textarea
                id="content"
                placeholder="Start creating your email template content..."
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                className="min-h-[300px]"
                required
              />
              <p className="text-xs text-muted-foreground">
                Use {{variableName}} for dynamic content that will be replaced when sending emails
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/email-templates')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Updating...' : 'Update Template'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditEmailTemplatePage;
