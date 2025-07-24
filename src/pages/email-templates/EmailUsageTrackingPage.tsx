import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Search, 
  BarChart3, 
  Calendar, 
  User, 
  Mail,
  TrendingUp,
  TrendingDown,
  Eye,
  ExternalLink
} from 'lucide-react';
import { emailTemplateService } from '@/services/emailTemplateService';
import { 
  EmailTemplateUsage,
  EmailTemplate,
  EMAIL_STATUS_LABELS,
  EMAIL_STATUS_COLORS
} from '@/types/emailTemplates';

const EmailUsageTrackingPage = () => {
  const { toast } = useToast();
  
  const [usage, setUsage] = useState<EmailTemplateUsage[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('all');

  // Load usage data
  const loadUsage = async () => {
    try {
      setLoading(true);
      const templateId = selectedTemplate !== 'all' ? selectedTemplate : undefined;
      const response = await emailTemplateService.getEmailTemplateUsage(1, 50, templateId);
      
      // Filter by search term if provided
      let filteredUsage = response.data;
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredUsage = filteredUsage.filter(item =>
          item.templateName.toLowerCase().includes(searchLower) ||
          item.recipientEmail.toLowerCase().includes(searchLower) ||
          item.usedBy.toLowerCase().includes(searchLower) ||
          item.subject.toLowerCase().includes(searchLower)
        );
      }
      
      setUsage(filteredUsage);
    } catch (error) {
      console.error('Failed to load usage data:', error);
      toast({
        title: "Error",
        description: "Failed to load usage data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Load templates for filter
  const loadTemplates = async () => {
    try {
      const response = await emailTemplateService.getEmailTemplates(1, 100);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to load templates:', error);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    loadUsage();
  }, [selectedTemplate, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculate usage statistics
  const usageStats = React.useMemo(() => {
    const totalUsage = usage.length;
    const uniqueTemplates = new Set(usage.map(u => u.templateId)).size;
    const uniqueUsers = new Set(usage.map(u => u.usedBy)).size;
    const successfulEmails = usage.filter(u => u.status === 'delivered' || u.status === 'read').length;
    const successRate = totalUsage > 0 ? Math.round((successfulEmails / totalUsage) * 100) : 0;

    return {
      totalUsage,
      uniqueTemplates,
      uniqueUsers,
      successRate
    };
  }, [usage]);

  // Get most used templates
  const mostUsedTemplates = React.useMemo(() => {
    const templateUsage = usage.reduce((acc, item) => {
      acc[item.templateId] = (acc[item.templateId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(templateUsage)
      .map(([templateId, count]) => {
        const template = templates.find(t => t.id === templateId);
        return {
          templateId,
          templateName: template?.name || 'Unknown Template',
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [usage, templates]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/email-management">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Email Management
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Email Usage Tracking</h1>
            <p className="text-muted-foreground mt-2">
              Analyze email template performance and usage patterns
            </p>
          </div>
        </div>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usage</p>
                <h2 className="text-3xl font-bold mt-1">{usageStats.totalUsage}</h2>
              </div>
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Templates</p>
                <h2 className="text-3xl font-bold mt-1">{usageStats.uniqueTemplates}</h2>
              </div>
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <h2 className="text-3xl font-bold mt-1">{usageStats.uniqueUsers}</h2>
              </div>
              <User className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <h2 className="text-3xl font-bold mt-1">{usageStats.successRate}%</h2>
              </div>
              {usageStats.successRate >= 80 ? (
                <TrendingUp className="h-8 w-8 text-green-600" />
              ) : (
                <TrendingDown className="h-8 w-8 text-red-600" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Most Used Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Most Used Templates</CardTitle>
          <CardDescription>Top performing email templates by usage count</CardDescription>
        </CardHeader>
        <CardContent>
          {mostUsedTemplates.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No usage data available</p>
          ) : (
            <div className="space-y-3">
              {mostUsedTemplates.map((item, index) => (
                <div key={item.templateId} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.templateName}</p>
                      <p className="text-sm text-muted-foreground">{item.count} uses</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/email-templates/${item.templateId}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search usage records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="All Templates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Templates</SelectItem>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
          <CardDescription>Detailed log of email template usage</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-4 p-3 border rounded-md">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          ) : usage.length === 0 ? (
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No usage data found</h3>
              <p className="text-muted-foreground">
                {searchTerm || selectedTemplate !== 'all'
                  ? "No usage records match your current filters."
                  : "No email templates have been used yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {usage.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.templateName}</p>
                      <p className="text-sm text-muted-foreground">{item.subject}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span>To: {item.recipientEmail}</span>
                        <span>By: {item.usedBy}</span>
                        <span>{formatDate(item.usedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={EMAIL_STATUS_COLORS[item.status]}>
                      {EMAIL_STATUS_LABELS[item.status]}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/email-templates/${item.templateId}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination would go here in a real implementation */}
      {usage.length > 0 && (
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Showing {usage.length} usage records
          </p>
        </div>
      )}
    </div>
  );
};

export default EmailUsageTrackingPage;
