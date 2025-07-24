import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Send, 
  Inbox, 
  BarChart3, 
  ArrowRight,
  FileText,
  Users,
  Clock
} from 'lucide-react';

const EmailManagementPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Email Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage your email communications and track template usage
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Templates</p>
                <h2 className="text-3xl font-bold mt-1">12</h2>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails Sent</p>
                <h2 className="text-3xl font-bold mt-1">245</h2>
              </div>
              <Send className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails Received</p>
                <h2 className="text-3xl font-bold mt-1">89</h2>
              </div>
              <Inbox className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <h2 className="text-3xl font-bold mt-1">8</h2>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Template Manager */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>Template Manager</CardTitle>
                <CardDescription>Create and manage email templates</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Create, edit, and organize your email templates for consistent communication across your team.
            </p>
            <Button asChild className="w-full">
              <Link to="/email-templates">
                Manage Templates
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Received Emails */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Inbox className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Received Emails</CardTitle>
                <CardDescription>View incoming messages</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Monitor and manage emails received from candidates, clients, and other stakeholders.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4" />
              <span>Last updated: 2 hours ago</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/email-management/received">
                View Received
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Sent History */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Sent History</CardTitle>
                <CardDescription>Track outgoing communications</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Review all emails sent using templates, including delivery status and recipient information.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Mail className="h-4 w-4" />
              <span>245 emails sent this month</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/email-management/sent">
                View Sent History
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Usage Tracking */}
        <Card className="hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Usage Tracking</CardTitle>
                <CardDescription>Analyze template performance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Get insights into which templates are most effective and track usage patterns across your team.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics available</span>
            </div>
            <Button asChild variant="outline" className="w-full">
              <Link to="/email-management/usage">
                View Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest email communications and template usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Send className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Interview invitation sent</p>
                <p className="text-sm text-muted-foreground">
                  To john.doe@email.com using "Interview Invitation - Technical Role" template
                </p>
              </div>
              <span className="text-sm text-muted-foreground">2 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Inbox className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New email received</p>
                <p className="text-sm text-muted-foreground">
                  From jane.smith@email.com regarding job application
                </p>
              </div>
              <span className="text-sm text-muted-foreground">4 hours ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="p-2 bg-primary/10 rounded-full">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">New template created</p>
                <p className="text-sm text-muted-foreground">
                  "Follow-up Email - Post Interview" template added by Mike Johnson
                </p>
              </div>
              <span className="text-sm text-muted-foreground">1 day ago</span>
            </div>

            <div className="flex items-center gap-4 p-3 border rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Send className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Job offer sent</p>
                <p className="text-sm text-muted-foreground">
                  To alice.wilson@email.com using "Job Offer - Standard" template
                </p>
              </div>
              <span className="text-sm text-muted-foreground">2 days ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailManagementPage;
