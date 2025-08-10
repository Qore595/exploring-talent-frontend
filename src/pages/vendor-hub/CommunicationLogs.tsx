import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Download,
  Eye,
  Send,
  Calendar,
  User,
  Building,
  MoreHorizontal,
  CheckCircle,
  AlertTriangle,
  Clock,
  RefreshCw,
  Plus,
  FileText
} from 'lucide-react';
import { CommunicationLog } from '@/types/vendor';

interface CommunicationFilters {
  searchTerm?: string;
  communicationType?: string[];
  status?: string[];
  vendorId?: string;
  pocId?: string;
  dateFrom?: string;
  dateTo?: string;
}

const CommunicationLogs: React.FC = () => {
  const [communications, setCommunications] = useState<CommunicationLog[]>([]);
  const [filteredCommunications, setFilteredCommunications] = useState<CommunicationLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCommunication, setSelectedCommunication] = useState<CommunicationLog | null>(null);
  const [filters, setFilters] = useState<CommunicationFilters>({
    searchTerm: '',
    communicationType: [],
    status: [],
    dateFrom: '',
    dateTo: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockCommunications: CommunicationLog[] = [
      {
        id: '1',
        vendorId: '1',
        pocId: '1',
        communicationType: 'Email',
        subject: 'PoC Validation Reminder - TechCorp Solutions',
        content: 'Dear John,\n\nThis is a reminder to validate your contact information for our vendor registry. Please click the link below to confirm your details are current.\n\nBest regards,\nVendor Management Team',
        status: 'Delivered',
        sentBy: 'system',
        sentTo: ['john.smith@techcorp.com'],
        sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        responseReceived: true,
        responseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        templateUsed: 'poc-validation-reminder',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        vendorId: '2',
        pocId: '3',
        communicationType: 'Email',
        subject: 'Urgent: PoC Validation Required - DataFlow Inc',
        content: 'Dear Lisa,\n\nYour contact validation is overdue. Please update your information immediately to avoid any disruption to our business relationship.\n\nRegards,\nCompliance Team',
        status: 'Opened',
        sentBy: 'compliance_officer',
        sentTo: ['lisa.chen@dataflow.com'],
        sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        responseReceived: false,
        templateUsed: 'poc-validation-urgent',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        vendorId: '1',
        pocId: '2',
        communicationType: 'Phone',
        subject: 'Follow-up call regarding contract renewal',
        content: 'Called Sarah Johnson to discuss upcoming contract renewal. She confirmed availability for meeting next week.',
        status: 'Completed',
        sentBy: 'account_manager',
        sentTo: ['sarah.johnson@techcorp.com'],
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        responseReceived: true,
        responseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        vendorId: '3',
        pocId: '4',
        communicationType: 'Email',
        subject: 'Welcome to Vendor Portal - SecureNet Corp',
        content: 'Welcome to our vendor portal! Your account has been set up and you can now access all vendor-related services.',
        status: 'Bounced',
        sentBy: 'system',
        sentTo: ['mike.davis@securenet.com'],
        sentAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        responseReceived: false,
        templateUsed: 'vendor-welcome',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        vendorId: '1',
        pocId: '1',
        communicationType: 'SMS',
        subject: 'Contract expiry notification',
        content: 'Your contract with us expires in 30 days. Please contact your account manager to discuss renewal.',
        status: 'Delivered',
        sentBy: 'system',
        sentTo: ['+1-555-0123'],
        sentAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        responseReceived: false,
        templateUsed: 'contract-expiry-sms',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    ];

    // Load data immediately for better UX
    setCommunications(mockCommunications);
    setFilteredCommunications(mockCommunications);
    setIsLoading(false);

    console.log('Loaded communication logs:', mockCommunications);
  }, []);

  // Filter communications based on current filters
  useEffect(() => {
    let filtered = communications;

    if (filters.searchTerm) {
      filtered = filtered.filter(comm =>
        comm.subject.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        comm.content.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        comm.sentTo.some(recipient => recipient.toLowerCase().includes(filters.searchTerm!.toLowerCase()))
      );
    }

    if (filters.communicationType && filters.communicationType.length > 0) {
      filtered = filtered.filter(comm => filters.communicationType!.includes(comm.communicationType));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(comm => filters.status!.includes(comm.status));
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(comm => comm.sentAt >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(comm => comm.sentAt <= toDate);
    }

    setFilteredCommunications(filtered);
  }, [communications, filters]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Delivered': { variant: 'success', icon: CheckCircle },
      'Sent': { variant: 'default', icon: Send },
      'Opened': { variant: 'warning', icon: Eye },
      'Clicked': { variant: 'success', icon: CheckCircle },
      'Bounced': { variant: 'destructive', icon: AlertTriangle },
      'Failed': { variant: 'destructive', icon: AlertTriangle },
      'Pending': { variant: 'secondary', icon: Clock },
      'Completed': { variant: 'success', icon: CheckCircle },
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

  const getCommunicationTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      'Email': Mail,
      'Phone': Phone,
      'SMS': MessageSquare,
      'In-Person': User,
    };

    const Icon = icons[type] || MessageSquare;
    return <Icon className="h-4 w-4" />;
  };

  const getVendorName = (vendorId: string) => {
    const vendorNames: Record<string, string> = {
      '1': 'TechCorp Solutions',
      '2': 'DataFlow Inc',
      '3': 'SecureNet Corp'
    };
    return vendorNames[vendorId] || 'Unknown Vendor';
  };

  const getPocName = (pocId: string) => {
    const pocNames: Record<string, string> = {
      '1': 'John Smith',
      '2': 'Sarah Johnson',
      '3': 'Lisa Chen',
      '4': 'Mike Davis'
    };
    return pocNames[pocId] || 'Unknown Contact';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading communication logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Communication Logs</h1>
          <p className="text-muted-foreground">
            View and manage all vendor and PoC communications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Log Communication
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Communications</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communications.length}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communications.filter(c =>
                (Date.now() - c.sentAt.getTime()) < 7 * 24 * 60 * 60 * 1000
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent activity
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
              Overall
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed/Bounced</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {communications.filter(c => c.status === 'Failed' || c.status === 'Bounced').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search communication logs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search communications..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={filters.communicationType?.[0] || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  communicationType: value === 'all' ? [] : [value]
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Phone">Phone</SelectItem>
                  <SelectItem value="SMS">SMS</SelectItem>
                  <SelectItem value="In-Person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status?.[0] || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  status: value === 'all' ? [] : [value]
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Opened">Opened</SelectItem>
                  <SelectItem value="Clicked">Clicked</SelectItem>
                  <SelectItem value="Bounced">Bounced</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <Input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <Input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCommunications.length} of {communications.length} communications
        </p>
        {Object.values(filters).some(filter => filter && (Array.isArray(filter) ? filter.length > 0 : true)) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters({ searchTerm: '', communicationType: [], status: [], dateFrom: '', dateTo: '' })}
          >
            Clear Filters
          </Button>
        )}
      </div>

      {/* Communications Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Vendor/PoC</TableHead>
              <TableHead>Recipients</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent Date</TableHead>
              <TableHead>Response</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommunications.map((comm) => (
              <TableRow key={comm.id}>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getCommunicationTypeIcon(comm.communicationType)}
                    <span className="text-sm">{comm.communicationType}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium text-sm">{comm.subject}</p>
                    {comm.templateUsed && (
                      <p className="text-xs text-muted-foreground">
                        Template: {comm.templateUsed}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{getVendorName(comm.vendorId)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{getPocName(comm.pocId)}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">{comm.sentTo.length} recipient(s)</p>
                    <p className="text-xs text-muted-foreground">
                      {comm.sentTo[0]}
                      {comm.sentTo.length > 1 && ` +${comm.sentTo.length - 1} more`}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(comm.status)}</TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <p className="text-sm">{comm.sentAt.toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {comm.sentAt.toLocaleTimeString()}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  {comm.responseReceived ? (
                    <div className="space-y-1">
                      <Badge variant="success" className="text-xs">
                        <CheckCircle className="h-2 w-2 mr-1" />
                        Responded
                      </Badge>
                      {comm.responseDate && (
                        <p className="text-xs text-muted-foreground">
                          {comm.responseDate.toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-2 w-2 mr-1" />
                      Pending
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{comm.subject}</DialogTitle>
                        <DialogDescription>
                          {comm.communicationType} sent on {comm.sentAt.toLocaleString()}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Communication Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Type:</span>
                                <span>{comm.communicationType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Status:</span>
                                {getStatusBadge(comm.status)}
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Sent by:</span>
                                <span>{comm.sentBy}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Recipients:</span>
                                <span>{comm.sentTo.length}</span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium mb-2">Vendor & Contact</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Vendor:</span>
                                <span>{getVendorName(comm.vendorId)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Contact:</span>
                                <span>{getPocName(comm.pocId)}</span>
                              </div>
                              {comm.templateUsed && (
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Template:</span>
                                  <span>{comm.templateUsed}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Content</h4>
                          <div className="p-3 border rounded-lg bg-muted/50">
                            <pre className="text-sm whitespace-pre-wrap">{comm.content}</pre>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Recipients</h4>
                          <div className="space-y-1">
                            {comm.sentTo.map((recipient, index) => (
                              <div key={index} className="text-sm text-muted-foreground">
                                {recipient}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {filteredCommunications.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No communications found</h3>
            <p className="text-muted-foreground mb-4">
              {communications.length === 0
                ? "No communications have been logged yet."
                : "Try adjusting your filters or search terms."
              }
            </p>
            {communications.length === 0 && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Log First Communication
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CommunicationLogs;
