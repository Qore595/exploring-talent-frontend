import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save } from 'lucide-react';
import RichTextEditor from '@/components/ui/rich-text-editor';
import '@/components/ui/rich-text-editor.css';

const CreateEmailTemplatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Strip HTML tags for validation to check if there's actual content
    const stripHtml = (html: string) => {
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    };

    const contentText = stripHtml(formData.content).trim();

    if (!formData.name.trim() || !formData.subject.trim() || !contentText) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Email template created successfully",
      });
      
      navigate('/email-templates');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create email template",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/email-templates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Email Template</h1>
          <p className="text-muted-foreground mt-2">
            Create a new email template for consistent communication
          </p>
        </div>
      </div>

      {/* Create Email Template Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Set up the basic details for your email template
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
              <Label htmlFor="subject">Email Subject *</Label>
              <Input
                id="subject"
                placeholder="e.g., Interview Invitation for {{position}} at {{company}}"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                Use {`{{variableName}}`} for dynamic content (e.g., {`{{candidateName}}`}, {`{{position}}`})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template Content</CardTitle>
            <CardDescription>
              Create the content for your email template using the rich text editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="content">Template Content *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(value) => handleInputChange('content', value)}
                placeholder="Start creating your email template content..."
                minHeight="400px"
              />
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
            {loading ? 'Creating...' : 'Create Template'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEmailTemplatePage;
