import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  MoreHorizontal,
  Building,
  Users,
  Calendar,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  MessageSquare,
  FileText,
  History
} from 'lucide-react';
import { VendorWithPocs, PointOfContact, CommunicationLog, VersionHistory } from '@/types/vendor';

const VendorDetails: React.FC = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<VendorWithPocs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    if (vendorId) {
      const mockVendor: VendorWithPocs = {
        id: vendorId,
        vendorType: 'Prime Vendor',
        vendorName: 'TechCorp Solutions',
        status: 'Active',
        onboardDate: new Date('2023-01-15'),
        tierLevel: 'Preferred',
        notes: 'Primary technology partner for cloud infrastructure and software development services.',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-10'),
        createdBy: 'admin',
        updatedBy: 'admin',
        pointsOfContact: [
          {
            id: '1',
            vendorId: vendorId,
            name: 'John Smith',
            role: 'Relationship Manager',
            email: 'john.smith@techcorp.com',
            phone: '+1-555-0123',
            status: 'Active',
            isPrimary: true,
            isBackup: false,
            lastValidated: new Date('2024-01-01'),
            validationStatus: 'Validated',
            notes: 'Primary contact for all strategic discussions',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2024-01-01'),
            createdBy: 'admin',
            updatedBy: 'admin'
          },
          {
            id: '2',
            vendorId: vendorId,
            name: 'Sarah Johnson',
            role: 'Technical Lead',
            email: 'sarah.johnson@techcorp.com',
            phone: '+1-555-0124',
            status: 'Active',
            isPrimary: false,
            isBackup: true,
            lastValidated: new Date('2024-01-05'),
            validationStatus: 'Validated',
            notes: 'Backup contact and technical escalation point',
            createdAt: new Date('2023-02-01'),
            updatedAt: new Date('2024-01-05'),
            createdBy: 'admin',
            updatedBy: 'admin'
          },
          {
            id: '3',
            vendorId: vendorId,
            name: 'Mike Davis',
            role: 'Legal Contact',
            email: 'mike.davis@techcorp.com',
            status: 'Replaced',
            isPrimary: false,
            isBackup: false,
            lastValidated: new Date('2023-08-15'),
            validationStatus: 'Overdue',
            notes: 'Replaced by new legal team member',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-10-01'),
            createdBy: 'admin',
            updatedBy: 'admin'
          }
        ]
      };

      // Load data immediately for better UX
      setVendor(mockVendor);
      setIsLoading(false);

      console.log('Loaded vendor details:', mockVendor);
    }
  }, [vendorId]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': { variant: 'success', icon: CheckCircle },
      'Inactive': { variant: 'secondary', icon: Clock },
      'Replaced': { variant: 'warning', icon: AlertTriangle },
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

  const getValidationStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Validated': { variant: 'success', icon: CheckCircle },
      'Pending': { variant: 'warning', icon: Clock },
      'Overdue': { variant: 'destructive', icon: AlertTriangle },
      'Failed': { variant: 'destructive', icon: AlertTriangle },
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

  const handleDeleteVendor = () => {
    if (window.confirm('Are you sure you want to delete this vendor? This action cannot be undone.')) {
      // TODO: Implement delete functionality
      console.log('Deleting vendor:', vendorId);
      navigate('/vendor-hub/vendors');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading vendor details...</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Vendor not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const activePocs = vendor.pointsOfContact.filter(poc => poc.status === 'Active');
  const primaryPoc = vendor.pointsOfContact.find(poc => poc.isPrimary);
  const backupPoc = vendor.pointsOfContact.find(poc => poc.isBackup);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/vendor-hub/vendors')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Vendors
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{vendor.vendorName}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={vendor.vendorType === 'Prime Vendor' ? 'default' : 'secondary'}>
                {vendor.vendorType === 'Prime Vendor' ? <Building className="h-3 w-3 mr-1" /> : <Users className="h-3 w-3 mr-1" />}
                {vendor.vendorType}
              </Badge>
              {getStatusBadge(vendor.status)}
              {vendor.tierLevel && (
                <Badge variant="outline">{vendor.tierLevel}</Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/vendor-hub/vendors/${vendor.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Vendor
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to={`/vendor-hub/vendors/${vendor.id}/pocs/new`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add PoC
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleDeleteVendor}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Vendor
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PoCs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendor.pointsOfContact.length}</div>
            <p className="text-xs text-muted-foreground">
              {activePocs.length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary PoC</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{primaryPoc?.name || 'None'}</div>
            <p className="text-xs text-muted-foreground">
              {primaryPoc?.role || 'No primary contact'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backup PoC</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{backupPoc?.name || 'None'}</div>
            <p className="text-xs text-muted-foreground">
              {backupPoc?.role || 'No backup contact'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Onboard Date</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{vendor.onboardDate.toLocaleDateString()}</div>
            <p className="text-xs text-muted-foreground">
              {Math.floor((Date.now() - vendor.onboardDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contacts">Points of Contact</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Vendor Information */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Information</CardTitle>
                <CardDescription>Basic vendor details and status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Vendor Type:</span>
                    <span className="text-sm">{vendor.vendorType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(vendor.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Tier Level:</span>
                    <span className="text-sm">{vendor.tierLevel || 'Not specified'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Onboard Date:</span>
                    <span className="text-sm">{vendor.onboardDate.toLocaleDateString()}</span>
                  </div>
                  {vendor.offboardDate && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Offboard Date:</span>
                      <span className="text-sm">{vendor.offboardDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {vendor.notes && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground">{vendor.notes}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Contact Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Summary</CardTitle>
                <CardDescription>Key contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {primaryPoc && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Primary Contact</h4>
                      {getValidationStatusBadge(primaryPoc.validationStatus)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{primaryPoc.name}</p>
                      <p className="text-sm text-muted-foreground">{primaryPoc.role}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{primaryPoc.email}</span>
                      </div>
                      {primaryPoc.phone && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{primaryPoc.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {backupPoc && (
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Backup Contact</h4>
                      {getValidationStatusBadge(backupPoc.validationStatus)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{backupPoc.name}</p>
                      <p className="text-sm text-muted-foreground">{backupPoc.role}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{backupPoc.email}</span>
                      </div>
                      {backupPoc.phone && (
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{backupPoc.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!primaryPoc && !backupPoc && (
                  <div className="text-center py-4">
                    <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No active contacts</p>
                    <Button size="sm" className="mt-2" asChild>
                      <Link to={`/vendor-hub/vendors/${vendor.id}/pocs/new`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Points of Contact</h3>
            <Button asChild>
              <Link to={`/vendor-hub/vendors/${vendor.id}/pocs/new`}>
                <Plus className="h-4 w-4 mr-2" />
                Add PoC
              </Link>
            </Button>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Validation</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendor.pointsOfContact.map((poc) => (
                  <TableRow key={poc.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{poc.name}</p>
                        {poc.lastValidated && (
                          <p className="text-xs text-muted-foreground">
                            Last validated: {poc.lastValidated.toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{poc.role}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-3 w-3" />
                          <span>{poc.email}</span>
                        </div>
                        {poc.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{poc.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(poc.status)}</TableCell>
                    <TableCell>{getValidationStatusBadge(poc.validationStatus)}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {poc.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
                        {poc.isBackup && <Badge variant="secondary" className="text-xs">Backup</Badge>}
                      </div>
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
                          <DropdownMenuItem asChild>
                            <Link to={`/vendor-hub/pocs/${poc.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/vendor-hub/pocs/${poc.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit PoC
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove PoC
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="communications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>Recent communications with this vendor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No communications recorded</p>
                <Button size="sm" className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Log Communication
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change History</CardTitle>
              <CardDescription>Audit trail of vendor and PoC changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No history available</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorDetails;
