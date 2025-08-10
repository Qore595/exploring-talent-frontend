import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Mail,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Calendar,
  Users,
  Building,
  MoreHorizontal,
  Play,
  Pause,
  Settings,
  RefreshCw,
  Eye,
  History,
  Plus
} from 'lucide-react';
import { ValidationReminder, CommunicationLog } from '@/types/vendor';

const ValidationReminders: React.FC = () => {
  const [reminders, setReminders] = useState<ValidationReminder[]>([]);
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);
  const [selectedReminders, setSelectedReminders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [automationEnabled, setAutomationEnabled] = useState(true);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockReminders: ValidationReminder[] = [
      {
        id: '1',
        vendorId: '1',
        pocId: '1',
        reminderType: 'Internal',
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        status: 'Scheduled',
        recipientEmails: ['hr@company.com', 'compliance@company.com'],
        templateId: 'internal-reminder-1',
        notes: 'Quarterly validation reminder',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        vendorId: '2',
        pocId: '3',
        reminderType: 'External',
        scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        status: 'Scheduled',
        recipientEmails: ['lisa.chen@dataflow.com'],
        templateId: 'external-validation-1',
        notes: 'Overdue validation follow-up',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        vendorId: '1',
        pocId: '2',
        reminderType: 'Internal',
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        sentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        status: 'Sent',
        recipientEmails: ['admin@company.com'],
        templateId: 'internal-reminder-1',
        notes: 'Backup contact validation',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ];

    const mockCommunications: CommunicationLog[] = [
      {
        id: '1',
        vendorId: '1',
        pocId: '1',
        communicationType: 'Email',
        subject: 'PoC Validation Reminder - TechCorp Solutions',
        content: 'Please validate your contact information...',
        status: 'Delivered',
        sentBy: 'system',
        sentTo: ['john.smith@techcorp.com'],
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        responseReceived: true,
        responseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        templateUsed: 'external-validation-1',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        vendorId: '2',
        pocId: '3',
        communicationType: 'Email',
        subject: 'Urgent: PoC Validation Required - DataFlow Inc',
        content: 'Your contact validation is overdue...',
        status: 'Opened',
        sentBy: 'system',
        sentTo: ['lisa.chen@dataflow.com'],
        sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        responseReceived: false,
        templateUsed: 'external-validation-urgent',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    // Load data immediately for better UX
    setReminders(mockReminders);
    setCommunications(mockCommunications);
    setIsLoading(false);

    console.log('Loaded validation reminders:', { mockReminders, mockCommunications });
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Scheduled': { variant: 'secondary', icon: Clock },
      'Sent': { variant: 'success', icon: Send },
      'Completed': { variant: 'success', icon: CheckCircle },
      'Failed': { variant: 'destructive', icon: AlertTriangle },
      'Delivered': { variant: 'success', icon: CheckCircle },
      'Opened': { variant: 'warning', icon: Eye },
      'Responded': { variant: 'success', icon: CheckCircle },
    };

    const config = variants[status] || { variant: 'secondary', icon: Clock };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleSelectReminder = (reminderId: string, checked: boolean) => {
    if (checked) {
      setSelectedReminders(prev => [...prev, reminderId]);
    } else {
      setSelectedReminders(prev => prev.filter(id => id !== reminderId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedReminders(reminders.filter(r => r.status === 'Scheduled').map(r => r.id));
    } else {
      setSelectedReminders([]);
    }
  };

  const handleBulkSend = () => {
    // TODO: Implement bulk send functionality
    console.log('Sending reminders:', selectedReminders);
  };

  const handleToggleAutomation = () => {
    setAutomationEnabled(!automationEnabled);
    // TODO: Update automation settings via API
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading validation reminders...</p>
        </div>
      </div>
    );
  }

  const scheduledReminders = reminders.filter(r => r.status === 'Scheduled');
  const sentReminders = reminders.filter(r => r.status === 'Sent' || r.status === 'Completed');
  const recentCommunications = communications.slice(0, 5);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Validation Reminders</h1>
          <p className="text-muted-foreground">
            Manage PoC validation reminders and automation
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={automationEnabled ? "default" : "outline"}
            size="sm"
            onClick={handleToggleAutomation}
          >
            {automationEnabled ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
            {automationEnabled ? 'Pause' : 'Resume'} Automation
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Reminder
          </Button>
        </div>
      </div>

      {/* Automation Status Alert */}
      <Alert variant={automationEnabled ? "default" : "destructive"}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {automationEnabled
            ? "Automated validation reminders are active. PoCs will be validated every 3-6 months."
            : "Automated validation reminders are paused. Manual intervention required."
          }
        </AlertDescription>
      </Alert>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledReminders.length}</div>
            <p className="text-xs text-muted-foreground">
              Upcoming reminders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sent Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communications.filter(c =>
                c.sentAt.toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Communications sent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((communications.filter(c => c.responseReceived).length / communications.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communications.filter(c =>
                !c.responseReceived &&
                (Date.now() - c.sentAt.getTime()) > 7 * 24 * 60 * 60 * 1000
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              No response > 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="scheduled" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scheduled">Scheduled Reminders</TabsTrigger>
          <TabsTrigger value="history">Communication History</TabsTrigger>
          <TabsTrigger value="templates">Email Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="scheduled" className="space-y-4">
          {/* Bulk Actions */}
          {selectedReminders.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedReminders.length} reminder(s) selected
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handleBulkSend}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Now ({selectedReminders.length})
                    </Button>
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Reschedule
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scheduled Reminders Table */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Reminders</CardTitle>
              <CardDescription>
                Scheduled validation reminders for PoCs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectedReminders.length === scheduledReminders.length && scheduledReminders.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Vendor/PoC</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scheduled Date</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduledReminders.map((reminder) => (
                    <TableRow key={reminder.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedReminders.includes(reminder.id)}
                          onCheckedChange={(checked) => handleSelectReminder(reminder.id, checked as boolean)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">TechCorp Solutions</p>
                          <p className="text-sm text-muted-foreground">John Smith - Relationship Manager</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={reminder.reminderType === 'Internal' ? 'secondary' : 'default'}>
                          {reminder.reminderType}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{reminder.scheduledDate.toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {reminder.scheduledDate.toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{reminder.recipientEmails.length} recipient(s)</p>
                          <p className="text-xs text-muted-foreground">
                            {reminder.recipientEmails[0]}
                            {reminder.recipientEmails.length > 1 && ` +${reminder.recipientEmails.length - 1} more`}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Send className="h-4 w-4 mr-2" />
                              Send Now
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Reschedule
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Cancel Reminder
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {scheduledReminders.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No scheduled reminders</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Communications</CardTitle>
              <CardDescription>
                History of sent validation reminders and responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vendor/PoC</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Response</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentCommunications.map((comm) => (
                    <TableRow key={comm.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">TechCorp Solutions</p>
                          <p className="text-sm text-muted-foreground">John Smith</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{comm.subject}</p>
                          <p className="text-xs text-muted-foreground">
                            To: {comm.sentTo.join(', ')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm">{comm.sentAt.toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">
                            {comm.sentAt.toLocaleTimeString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(comm.status)}</TableCell>
                      <TableCell>
                        {comm.responseReceived ? (
                          <div className="space-y-1">
                            <Badge variant="success">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Responded
                            </Badge>
                            {comm.responseDate && (
                              <p className="text-xs text-muted-foreground">
                                {comm.responseDate.toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Resend
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <History className="h-4 w-4 mr-2" />
                              View Thread
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {recentCommunications.length === 0 && (
                <div className="text-center py-8">
                  <Mail className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No communications sent yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>
                Manage email templates for validation reminders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Internal Reminder</CardTitle>
                    <CardDescription>
                      Template for internal team notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Subject:</strong> PoC Validation Required - {'{vendor_name}'}</p>
                      <p className="text-sm text-muted-foreground">
                        Used for notifying internal teams about upcoming validations
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">External Validation</CardTitle>
                    <CardDescription>
                      Template for vendor PoC validation requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Subject:</strong> Please Validate Your Contact Information</p>
                      <p className="text-sm text-muted-foreground">
                        Sent directly to vendor PoCs for validation
                      </p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ValidationReminders;
