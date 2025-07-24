import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Edit, 
  Copy, 
  Trash2, 
  Mail, 
  Calendar, 
  User, 
  Tag, 
  ToggleLeft, 
  ToggleRight,
  Loader2,
  BarChart3
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { emailTemplateService } from '@/services/emailTemplateService';
import EmailTemplatePreview from '@/components/email-templates/EmailTemplatePreview';
import {
  EmailTemplate,
  EmailTemplateUsage,
  EMAIL_TEMPLATE_CATEGORIES
} from '@/types/emailTemplates';

const EmailTemplateDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [usage, setUsage] = useState<EmailTemplateUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [usageLoading, setUsageLoading] = useState(true);

  // Load template data
  useEffect(() => {
    const loadTemplate = async () => {
      if (!id) {
        navigate('/email-templates');
        return;
      }

      try {
        setLoading(true);
        const response = await emailTemplateService.getEmailTemplateById(id);
        setTemplate(response.data);
      } catch (error) {
        console.error('Failed to load email template:', error);
        toast({
          title: "Error",
          description: "Failed to load email template",
          variant: "destructive",
        });
        navigate('/email-templates');
      } finally {
        setLoading(false);
      }
    };

    loadTemplate();
  }, [id, navigate, toast]);

  // Load usage data
  useEffect(() => {
    const loadUsage = async () => {
      if (!id) return;

      try {
        setUsageLoading(true);
        const response = await emailTemplateService.getEmailTemplateUsage(1, 10, id);
        setUsage(response.data);
      } catch (error) {
        console.error('Failed to load template usage:', error);
      } finally {
        setUsageLoading(false);
      }
    };

    loadUsage();
  }, [id]);

  const handleDeleteTemplate = async () => {
    if (!template) return;

    try {
      await emailTemplateService.deleteEmailTemplate(template.id);
      toast({
        title: "Success",
        description: "Email template deleted successfully",
      });
      navigate('/email-templates');
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast({
        title: "Error",
        description: "Failed to delete email template",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateTemplate = async () => {
    if (!template) return;

    try {
      await emailTemplateService.duplicateEmailTemplate(template.id);
      toast({
        title: "Success",
        description: "Email template duplicated successfully",
      });
      navigate('/email-templates');
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate email template",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async () => {
    if (!template) return;

    try {
      const response = await emailTemplateService.toggleTemplateStatus(template.id);
      setTemplate(response.data);
      toast({
        title: "Success",
        description: `Template ${template.isActive ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Failed to toggle template status:', error);
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryInfo = EMAIL_TEMPLATE_CATEGORIES.find(c => c.value === category);
    return categoryInfo?.label || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      interview_invitation: 'bg-blue-100 text-blue-800',
      job_offer: 'bg-green-100 text-green-800',
      rejection: 'bg-red-100 text-red-800',
      follow_up: 'bg-yellow-100 text-yellow-800',
      welcome: 'bg-purple-100 text-purple-800',
      reminder: 'bg-orange-100 text-orange-800',
      general: 'bg-gray-100 text-gray-800',
      custom: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading template...</span>
        </div>
      </div>
    );
  }

  if (!template) {
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/email-templates')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{template.name}</h1>
            <p className="text-muted-foreground mt-2">
              Email template details and usage information
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleDuplicateTemplate}>
            <Copy className="h-4 w-4 mr-2" />
            Duplicate
          </Button>
          <Button variant="outline" onClick={handleToggleStatus}>
            {template.isActive ? (
              <ToggleLeft className="h-4 w-4 mr-2" />
            ) : (
              <ToggleRight className="h-4 w-4 mr-2" />
            )}
            {template.isActive ? 'Deactivate' : 'Activate'}
          </Button>
          <Button asChild>
            <Link to={`/email-templates/${template.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Email Template</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{template.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteTemplate}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Information */}
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Subject</h3>
                <p className="text-muted-foreground">{template.subject}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Content</h3>
                <div className="p-4 border rounded-md bg-muted/30 whitespace-pre-wrap text-sm">
                  {template.content}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Preview and Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Template Preview & Testing</CardTitle>
              <CardDescription>Preview and test your email template</CardDescription>
            </CardHeader>
            <CardContent>
              <EmailTemplatePreview template={template} />
            </CardContent>
          </Card>

          {/* Recent Usage */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Usage</CardTitle>
                  <CardDescription>Latest uses of this template</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/email-management/usage">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {usageLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : usage.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No usage history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {usage.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{item.recipientEmail}</p>
                        <p className="text-sm text-muted-foreground">{item.subject}</p>
                        <p className="text-xs text-muted-foreground">
                          Used by {item.usedBy} on {new Date(item.usedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={item.status === 'delivered' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Template Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={getCategoryColor(template.category)}>
                  {getCategoryLabel(template.category)}
                </Badge>
                <Badge variant={template.isActive ? "default" : "secondary"}>
                  {template.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{template.usageCount}</span>
                  <span className="text-muted-foreground">times used</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created by</span>
                  <span className="font-medium">{template.createdBy}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(template.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last updated</span>
                  <span className="font-medium">
                    {new Date(template.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                {template.lastUsed && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last used</span>
                    <span className="font-medium">
                      {new Date(template.lastUsed).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {template.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateDetailsPage;
