import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Copy, 
  Trash2, 
  Eye,
  Mail,
  Calendar,
  User,
  Tag,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { emailTemplateService } from '@/services/emailTemplateService';
import { 
  EmailTemplate, 
  EmailTemplateFilters, 
  EMAIL_TEMPLATE_CATEGORIES,
  EmailTemplateCategory 
} from '@/types/emailTemplates';

const EmailTemplatesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EmailTemplateCategory | 'all'>('all');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<EmailTemplate | null>(null);

  // Load templates
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const filters: EmailTemplateFilters = {};
      
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory;
      }
      if (showActiveOnly) {
        filters.isActive = true;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await emailTemplateService.getEmailTemplates(1, 50, filters);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to load email templates:', error);
      toast({
        title: "Error",
        description: "Failed to load email templates",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, showActiveOnly, searchTerm]);

  const handleDeleteTemplate = async (template: EmailTemplate) => {
    try {
      await emailTemplateService.deleteEmailTemplate(template.id);
      toast({
        title: "Success",
        description: "Email template deleted successfully",
      });
      loadTemplates();
    } catch (error) {
      console.error('Failed to delete template:', error);
      toast({
        title: "Error",
        description: "Failed to delete email template",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTemplateToDelete(null);
    }
  };

  const handleDuplicateTemplate = async (template: EmailTemplate) => {
    try {
      await emailTemplateService.duplicateEmailTemplate(template.id);
      toast({
        title: "Success",
        description: "Email template duplicated successfully",
      });
      loadTemplates();
    } catch (error) {
      console.error('Failed to duplicate template:', error);
      toast({
        title: "Error",
        description: "Failed to duplicate email template",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (template: EmailTemplate) => {
    try {
      await emailTemplateService.toggleTemplateStatus(template.id);
      toast({
        title: "Success",
        description: `Template ${template.isActive ? 'deactivated' : 'activated'} successfully`,
      });
      loadTemplates();
    } catch (error) {
      console.error('Failed to toggle template status:', error);
      toast({
        title: "Error",
        description: "Failed to update template status",
        variant: "destructive",
      });
    }
  };

  const getCategoryLabel = (category: EmailTemplateCategory) => {
    const categoryInfo = EMAIL_TEMPLATE_CATEGORIES.find(c => c.value === category);
    return categoryInfo?.label || category;
  };

  const getCategoryColor = (category: EmailTemplateCategory) => {
    const colors: Record<EmailTemplateCategory, string> = {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Email Templates</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage email templates for consistent communication
          </p>
        </div>
        <Button asChild>
          <Link to="/email-templates/create">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as EmailTemplateCategory | 'all')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EMAIL_TEMPLATE_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant={showActiveOnly ? "default" : "outline"}
              onClick={() => setShowActiveOnly(!showActiveOnly)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {showActiveOnly ? "Active Only" : "All Status"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No email templates found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'all' || showActiveOnly
                ? "No templates match your current filters."
                : "Get started by creating your first email template."}
            </p>
            <Button asChild>
              <Link to="/email-templates/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Template
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-1">{template.name}</CardTitle>
                    <CardDescription className="line-clamp-1 mt-1">
                      {template.subject}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/email-templates/${template.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate(`/email-templates/${template.id}/edit`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleStatus(template)}>
                        {template.isActive ? (
                          <ToggleLeft className="h-4 w-4 mr-2" />
                        ) : (
                          <ToggleRight className="h-4 w-4 mr-2" />
                        )}
                        {template.isActive ? 'Deactivate' : 'Activate'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => {
                          setTemplateToDelete(template);
                          setDeleteDialogOpen(true);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(template.category)}>
                      {getCategoryLabel(template.category)}
                    </Badge>
                    <Badge variant={template.isActive ? "default" : "secondary"}>
                      {template.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {template.createdBy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {template.usageCount}
                    </div>
                  </div>

                  {template.tags.length > 0 && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Email Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => templateToDelete && handleDeleteTemplate(templateToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmailTemplatesPage;
