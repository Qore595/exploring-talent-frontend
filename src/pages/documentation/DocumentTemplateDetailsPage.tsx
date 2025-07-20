import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Tag,
  Copy,
  Download
} from 'lucide-react';
import { DocumentTemplate } from '@/types/documentation';
import { documentationService } from '@/services/documentationService';

const DocumentTemplateDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [template, setTemplate] = useState<DocumentTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/document-templates');
      return;
    }

    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await documentationService.getDocumentTemplateById(id!);
      setTemplate(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch template',
        variant: 'destructive',
      });
      navigate('/document-templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!template || !confirm('Are you sure you want to delete this template?')) return;

    try {
      await documentationService.deleteDocumentTemplate(template.id);
      toast({
        title: 'Success',
        description: 'Template deleted successfully',
      });
      navigate('/document-templates');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete template',
        variant: 'destructive',
      });
    }
  };

  const handleCopyContent = () => {
    if (template) {
      // Create a temporary div to extract text content from HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = template.content;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      navigator.clipboard.writeText(textContent).then(() => {
        toast({
          title: 'Success',
          description: 'Template content copied to clipboard',
        });
      }).catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to copy content',
          variant: 'destructive',
        });
      });
    }
  };

  const handleExport = () => {
    if (template) {
      const content = `
Template: ${template.name}
Description: ${template.description}
Category: ${template.category || 'N/A'}
Tags: ${template.tags?.join(', ') || 'N/A'}

Content:
${template.content}
      `;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!template) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/document-templates')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground mt-1">{template.description}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyContent}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy Content
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/document-templates/${template.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Template Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: template.content }}
              />
            </CardContent>
          </Card>
        </div>

        {/* Template Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {template.category && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Category</h4>
                  <Badge variant="secondary">{template.category}</Badge>
                </div>
              )}

              {template.tags && template.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <Badge variant={template.isActive ? "default" : "secondary"}>
                  {template.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-muted-foreground">{template.createdBy}</p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Modified</p>
                  <p className="text-muted-foreground">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Modified by</p>
                  <p className="text-muted-foreground">{template.lastModifiedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DocumentTemplateDetailsPage;
