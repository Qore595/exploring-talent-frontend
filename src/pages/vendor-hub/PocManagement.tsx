import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  RefreshCw,
  Users,
  Building
} from 'lucide-react';
import { PointOfContact, PocFilters, PocRole, PocStatus, ValidationStatus } from '@/types/vendor';

const PocManagement: React.FC = () => {
  const [pocs, setPocs] = useState<(PointOfContact & { vendorName: string })[]>([]);
  const [filteredPocs, setFilteredPocs] = useState<(PointOfContact & { vendorName: string })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPocs, setSelectedPocs] = useState<string[]>([]);
  const [filters, setFilters] = useState<PocFilters>({
    searchTerm: '',
    role: [],
    status: [],
    validationStatus: [],
    isPrimary: undefined,
    isBackup: undefined
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockPocs: (PointOfContact & { vendorName: string })[] = [
      {
        id: '1',
        vendorId: '1',
        vendorName: 'TechCorp Solutions',
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
        vendorId: '1',
        vendorName: 'TechCorp Solutions',
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
        vendorId: '2',
        vendorName: 'DataFlow Inc',
        name: 'Lisa Chen',
        role: 'Account Manager',
        email: 'lisa.chen@dataflow.com',
        status: 'Active',
        isPrimary: true,
        isBackup: false,
        lastValidated: new Date('2023-10-15'),
        validationStatus: 'Overdue',
        notes: 'Needs validation update',
        createdAt: new Date('2023-03-20'),
        updatedAt: new Date('2023-10-15'),
        createdBy: 'admin',
        updatedBy: 'admin'
      },
      {
        id: '4',
        vendorId: '3',
        vendorName: 'SecureNet Corp',
        name: 'Mike Davis',
        role: 'Legal Contact',
        email: 'mike.davis@securenet.com',
        status: 'Replaced',
        isPrimary: false,
        isBackup: false,
        lastValidated: new Date('2023-08-15'),
        validationStatus: 'Failed',
        notes: 'Replaced by new legal team member',
        createdAt: new Date('2022-08-10'),
        updatedAt: new Date('2023-10-01'),
        createdBy: 'admin',
        updatedBy: 'admin'
      }
    ];

    // Load data immediately for better UX
    setPocs(mockPocs);
    setFilteredPocs(mockPocs);
    setIsLoading(false);

    console.log('Loaded mock PoCs:', mockPocs);
  }, []);

  // Filter PoCs based on current filters
  useEffect(() => {
    let filtered = pocs;

    if (filters.searchTerm) {
      filtered = filtered.filter(poc =>
        poc.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        poc.email.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        poc.vendorName.toLowerCase().includes(filters.searchTerm!.toLowerCase())
      );
    }

    if (filters.role && filters.role.length > 0) {
      filtered = filtered.filter(poc => filters.role!.includes(poc.role));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(poc => filters.status!.includes(poc.status));
    }

    if (filters.validationStatus && filters.validationStatus.length > 0) {
      filtered = filtered.filter(poc => filters.validationStatus!.includes(poc.validationStatus));
    }

    if (filters.isPrimary !== undefined) {
      filtered = filtered.filter(poc => poc.isPrimary === filters.isPrimary);
    }

    if (filters.isBackup !== undefined) {
      filtered = filtered.filter(poc => poc.isBackup === filters.isBackup);
    }

    setFilteredPocs(filtered);
  }, [pocs, filters]);

  const handleSelectPoc = (pocId: string, checked: boolean) => {
    if (checked) {
      setSelectedPocs(prev => [...prev, pocId]);
    } else {
      setSelectedPocs(prev => prev.filter(id => id !== pocId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPocs(filteredPocs.map(p => p.id));
    } else {
      setSelectedPocs([]);
    }
  };

  const getStatusBadge = (status: PocStatus) => {
    const variants: Record<PocStatus, any> = {
      'Active': { variant: 'success', icon: CheckCircle },
      'Replaced': { variant: 'warning', icon: AlertTriangle },
      'Inactive': { variant: 'secondary', icon: Clock },
      'Leaving': { variant: 'destructive', icon: AlertTriangle },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getValidationStatusBadge = (status: ValidationStatus) => {
    const variants: Record<ValidationStatus, any> = {
      'Validated': { variant: 'success', icon: CheckCircle },
      'Pending': { variant: 'warning', icon: Clock },
      'Overdue': { variant: 'destructive', icon: AlertTriangle },
      'Failed': { variant: 'destructive', icon: AlertTriangle },
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleBulkValidation = () => {
    // TODO: Implement bulk validation
    console.log('Sending validation to selected PoCs:', selectedPocs);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading points of contact...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PoC Management</h1>
          <p className="text-muted-foreground">
            Manage all points of contact across vendors
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Validation
          </Button>
          <Button asChild>
            <Link to="/vendor-hub/pocs/new">
              <Plus className="h-4 w-4 mr-2" />
              Add PoC
            </Link>
          </Button>
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
            <div className="text-2xl font-bold">{pocs.length}</div>
            <p className="text-xs text-muted-foreground">
              {pocs.filter(p => p.status === 'Active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Primary Contacts</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pocs.filter(p => p.isPrimary).length}</div>
            <p className="text-xs text-muted-foreground">
              Across all vendors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Validation Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pocs.filter(p => p.validationStatus === 'Overdue' || p.validationStatus === 'Failed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backup Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pocs.filter(p => p.isBackup).length}</div>
            <p className="text-xs text-muted-foreground">
              Escalation chain
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search points of contact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search PoCs or vendors..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={filters.role?.[0] || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  role: value === 'all' ? [] : [value as PocRole]
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All roles</SelectItem>
                  <SelectItem value="Relationship Manager">Relationship Manager</SelectItem>
                  <SelectItem value="Timesheet Approver">Timesheet Approver</SelectItem>
                  <SelectItem value="Legal Contact">Legal Contact</SelectItem>
                  <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                  <SelectItem value="Account Manager">Account Manager</SelectItem>
                  <SelectItem value="Billing Contact">Billing Contact</SelectItem>
                  <SelectItem value="HR Contact">HR Contact</SelectItem>
                  <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status?.[0] || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  status: value === 'all' ? [] : [value as PocStatus]
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Replaced">Replaced</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Leaving">Leaving</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Validation</label>
              <Select
                value={filters.validationStatus?.[0] || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  validationStatus: value === 'all' ? [] : [value as ValidationStatus]
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All validation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All validation</SelectItem>
                  <SelectItem value="Validated">Validated</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={
                  filters.isPrimary === true ? 'primary' :
                  filters.isBackup === true ? 'backup' : 'all'
                }
                onValueChange={(value) => {
                  if (value === 'primary') {
                    setFilters(prev => ({ ...prev, isPrimary: true, isBackup: undefined }));
                  } else if (value === 'backup') {
                    setFilters(prev => ({ ...prev, isPrimary: undefined, isBackup: true }));
                  } else {
                    setFilters(prev => ({ ...prev, isPrimary: undefined, isBackup: undefined }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="backup">Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPocs.length} of {pocs.length} contacts
          {selectedPocs.length > 0 && ` (${selectedPocs.length} selected)`}
        </p>
        {selectedPocs.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleBulkValidation}>
              <Mail className="h-4 w-4 mr-2" />
              Send Validation ({selectedPocs.length})
            </Button>
          </div>
        )}
      </div>

      {/* PoCs Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPocs.length === filteredPocs.length && filteredPocs.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Contact Info</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Validation</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPocs.map((poc) => (
              <TableRow key={poc.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedPocs.includes(poc.id)}
                    onCheckedChange={(checked) => handleSelectPoc(poc.id, checked as boolean)}
                  />
                </TableCell>
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
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{poc.vendorName}</span>
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
                      <DropdownMenuItem asChild>
                        <Link to={`/vendor-hub/vendors/${poc.vendorId}`}>
                          <Building className="h-4 w-4 mr-2" />
                          View Vendor
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Validation
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

      {filteredPocs.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
            <p className="text-muted-foreground mb-4">
              {pocs.length === 0
                ? "Get started by adding your first point of contact."
                : "Try adjusting your filters or search terms."
              }
            </p>
            {pocs.length === 0 && (
              <Button asChild>
                <Link to="/vendor-hub/pocs/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First PoC
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PocManagement;
