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
  Filter, 
  Inbox, 
  Calendar, 
  User, 
  Mail,
  Paperclip,
  Eye,
  Reply,
  Forward,
  Archive
} from 'lucide-react';
import { emailTemplateService } from '@/services/emailTemplateService';
import { 
  EmailMessage, 
  EmailMessageFilters, 
  EmailStatus,
  EMAIL_STATUS_LABELS,
  EMAIL_STATUS_COLORS
} from '@/types/emailTemplates';

const ReceivedEmailsPage = () => {
  const { toast } = useToast();
  
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<EmailStatus | 'all'>('all');

  // Load emails
  const loadEmails = async () => {
    try {
      setLoading(true);
      const filters: EmailMessageFilters = {};
      
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus;
      }
      if (searchTerm) {
        filters.search = searchTerm;
      }

      const response = await emailTemplateService.getEmailMessages(1, 50, filters);
      // Filter to show only received emails (emails where we are the recipient)
      const receivedEmails = response.data.filter(email => 
        email.to.includes('hr@company.com') || email.to.includes('admin@company.com')
      );
      setEmails(receivedEmails);
    } catch (error) {
      console.error('Failed to load emails:', error);
      toast({
        title: "Error",
        description: "Failed to load emails",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmails();
  }, [selectedStatus, searchTerm]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleEmailAction = (action: string, email: EmailMessage) => {
    toast({
      title: "Action Performed",
      description: `${action} action performed on email from ${email.from}`,
    });
  };

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
            <h1 className="text-3xl font-bold">Received Emails</h1>
            <p className="text-muted-foreground mt-2">
              View and manage incoming email messages
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as EmailStatus | 'all')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {Object.entries(EMAIL_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Email List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-muted rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                  <div className="h-6 w-16 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : emails.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No emails found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedStatus !== 'all'
                ? "No emails match your current filters."
                : "You haven't received any emails yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <Card key={email.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{email.from}</h3>
                        <Badge className={EMAIL_STATUS_COLORS[email.status]}>
                          {EMAIL_STATUS_LABELS[email.status]}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {email.receivedAt ? formatDate(email.receivedAt) : 'Unknown'}
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-2 truncate">{email.subject}</h4>
                    
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {email.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          To: {email.to.join(', ')}
                        </div>
                        {email.attachments.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Paperclip className="h-3 w-3" />
                            {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
                          </div>
                        )}
                        {email.templateName && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            Template: {email.templateName}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEmailAction('View', email)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEmailAction('Reply', email)}
                        >
                          <Reply className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEmailAction('Forward', email)}
                        >
                          <Forward className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => handleEmailAction('Archive', email)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination would go here in a real implementation */}
      {emails.length > 0 && (
        <div className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Showing {emails.length} emails
          </p>
        </div>
      )}
    </div>
  );
};

export default ReceivedEmailsPage;
