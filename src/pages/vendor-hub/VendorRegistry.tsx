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
  Building,
  Users,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload
} from 'lucide-react';
import { VendorWithPocs, VendorFilters, VendorType, VendorStatus, VendorTierLevel } from '@/types/vendor';

const VendorRegistry: React.FC = () => {
  const [vendors, setVendors] = useState<VendorWithPocs[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<VendorWithPocs[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [filters, setFilters] = useState<VendorFilters>({
    searchTerm: '',
    vendorType: [],
    status: [],
    tierLevel: [],
    hasOutdatedPocs: undefined
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockVendors: VendorWithPocs[] = [
      {
        id: '1',
        vendorType: 'Prime Vendor',
        vendorName: 'TechCorp Solutions',
        status: 'Active',
        onboardDate: new Date('2023-01-15'),
        tierLevel: 'Preferred',
        notes: 'Primary technology partner',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-10'),
        createdBy: 'admin',
        updatedBy: 'admin',
        pointsOfContact: [
          {
            id: '1',
            vendorId: '1',
            name: 'John Smith',
            role: 'Relationship Manager',
            email: 'john.smith@techcorp.com',
            phone: '+1-555-0123',
            status: 'Active',
            isPrimary: true,
            isBackup: false,
            lastValidated: new Date('2024-01-01'),
            validationStatus: 'Validated',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2024-01-01'),
            createdBy: 'admin',
            updatedBy: 'admin'
          }
        ]
      },
      {
        id: '2',
        vendorType: 'Sub Vendor',
        vendorName: 'DataFlow Inc',
        status: 'Active',
        onboardDate: new Date('2023-03-20'),
        tierLevel: 'Tier-2',
        notes: 'Specialized in data processing',
        createdAt: new Date('2023-03-20'),
        updatedAt: new Date('2024-01-05'),
        createdBy: 'admin',
        updatedBy: 'admin',
        pointsOfContact: [
          {
            id: '2',
            vendorId: '2',
            name: 'Lisa Chen',
            role: 'Account Manager',
            email: 'lisa.chen@dataflow.com',
            status: 'Active',
            isPrimary: true,
            isBackup: false,
            lastValidated: new Date('2023-10-15'),
            validationStatus: 'Overdue',
            createdAt: new Date('2023-03-20'),
            updatedAt: new Date('2023-10-15'),
            createdBy: 'admin',
            updatedBy: 'admin'
          }
        ]
      },
      {
        id: '3',
        vendorType: 'Prime Vendor',
        vendorName: 'SecureNet Corp',
        status: 'Inactive',
        onboardDate: new Date('2022-08-10'),
        offboardDate: new Date('2023-12-31'),
        tierLevel: 'Standard',
        notes: 'Contract ended',
        createdAt: new Date('2022-08-10'),
        updatedAt: new Date('2023-12-31'),
        createdBy: 'admin',
        updatedBy: 'admin',
        pointsOfContact: []
      }
    ];

    // Load data immediately for better UX
    setVendors(mockVendors);
    setFilteredVendors(mockVendors);
    setIsLoading(false);

    console.log('Loaded mock vendors:', mockVendors);
  }, []);

  // Filter vendors based on current filters
  useEffect(() => {
    let filtered = vendors;

    if (filters.searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.vendorName.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
        vendor.pointsOfContact.some(poc => 
          poc.name.toLowerCase().includes(filters.searchTerm!.toLowerCase()) ||
          poc.email.toLowerCase().includes(filters.searchTerm!.toLowerCase())
        )
      );
    }

    if (filters.vendorType && filters.vendorType.length > 0) {
      filtered = filtered.filter(vendor => filters.vendorType!.includes(vendor.vendorType));
    }

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(vendor => filters.status!.includes(vendor.status));
    }

    if (filters.tierLevel && filters.tierLevel.length > 0) {
      filtered = filtered.filter(vendor => 
        vendor.tierLevel && filters.tierLevel!.includes(vendor.tierLevel)
      );
    }

    if (filters.hasOutdatedPocs !== undefined) {
      filtered = filtered.filter(vendor => {
        const hasOutdated = vendor.pointsOfContact.some(poc => 
          poc.validationStatus === 'Overdue' || poc.validationStatus === 'Failed'
        );
        return filters.hasOutdatedPocs ? hasOutdated : !hasOutdated;
      });
    }

    setFilteredVendors(filtered);
  }, [vendors, filters]);

  const handleSelectVendor = (vendorId: string, checked: boolean) => {
    if (checked) {
      setSelectedVendors(prev => [...prev, vendorId]);
    } else {
      setSelectedVendors(prev => prev.filter(id => id !== vendorId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVendors(filteredVendors.map(v => v.id));
    } else {
      setSelectedVendors([]);
    }
  };

  const getStatusBadge = (status: VendorStatus) => {
    return (
      <Badge variant={status === 'Active' ? 'success' : 'secondary'}>
        {status === 'Active' ? <CheckCircle className="h-3 w-3 mr-1" /> : null}
        {status}
      </Badge>
    );
  };

  const getValidationStatusBadge = (vendor: VendorWithPocs) => {
    const hasOverdue = vendor.pointsOfContact.some(poc => 
      poc.validationStatus === 'Overdue' || poc.validationStatus === 'Failed'
    );
    
    if (hasOverdue) {
      return (
        <Badge variant="destructive">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Needs Attention
        </Badge>
      );
    }
    
    return (
      <Badge variant="success">
        <CheckCircle className="h-3 w-3 mr-1" />
        Up to Date
      </Badge>
    );
  };

  const getPrimaryPoc = (vendor: VendorWithPocs) => {
    return vendor.pointsOfContact.find(poc => poc.isPrimary);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Registry</h1>
          <p className="text-muted-foreground">
            Manage all vendor relationships and contacts
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
          <Button asChild>
            <Link to="/vendor-hub/vendors/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search vendors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vendors or contacts..."
                  value={filters.searchTerm || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Vendor Type</label>
              <Select
                value={filters.vendorType?.[0] || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  vendorType: value === 'all' ? [] : [value as VendorType]
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  <SelectItem value="Prime Vendor">Prime Vendor</SelectItem>
                  <SelectItem value="Sub Vendor">Sub Vendor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={filters.status?.[0] || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  status: value === 'all' ? [] : [value as VendorStatus]
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tier Level</label>
              <Select
                value={filters.tierLevel?.[0] || 'all'}
                onValueChange={(value) => setFilters(prev => ({
                  ...prev,
                  tierLevel: value === 'all' ? [] : [value as VendorTierLevel]
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All tiers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All tiers</SelectItem>
                  <SelectItem value="Preferred">Preferred</SelectItem>
                  <SelectItem value="Tier-2">Tier-2</SelectItem>
                  <SelectItem value="Tier-3">Tier-3</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredVendors.length} of {vendors.length} vendors
          {selectedVendors.length > 0 && ` (${selectedVendors.length} selected)`}
        </p>
        {selectedVendors.length > 0 && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              Bulk Actions
            </Button>
          </div>
        )}
      </div>

      {/* Vendors Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Primary PoC</TableHead>
              <TableHead>PoC Status</TableHead>
              <TableHead>Onboard Date</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => {
              const primaryPoc = getPrimaryPoc(vendor);
              return (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedVendors.includes(vendor.id)}
                      onCheckedChange={(checked) => handleSelectVendor(vendor.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{vendor.vendorName}</p>
                      {vendor.tierLevel && (
                        <Badge variant="outline" className="text-xs">
                          {vendor.tierLevel}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={vendor.vendorType === 'Prime Vendor' ? 'default' : 'secondary'}>
                      {vendor.vendorType === 'Prime Vendor' ? <Building className="h-3 w-3 mr-1" /> : <Users className="h-3 w-3 mr-1" />}
                      {vendor.vendorType}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(vendor.status)}</TableCell>
                  <TableCell>
                    {primaryPoc ? (
                      <div className="space-y-1">
                        <p className="font-medium">{primaryPoc.name}</p>
                        <p className="text-sm text-muted-foreground">{primaryPoc.role}</p>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No primary PoC</span>
                    )}
                  </TableCell>
                  <TableCell>{getValidationStatusBadge(vendor)}</TableCell>
                  <TableCell>{vendor.onboardDate.toLocaleDateString()}</TableCell>
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
                          <Link to={`/vendor-hub/vendors/${vendor.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/vendor-hub/vendors/${vendor.id}/edit`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Vendor
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Vendor
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {filteredVendors.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No vendors found</h3>
            <p className="text-muted-foreground mb-4">
              {vendors.length === 0 
                ? "Get started by adding your first vendor."
                : "Try adjusting your filters or search terms."
              }
            </p>
            {vendors.length === 0 && (
              <Button asChild>
                <Link to="/vendor-hub/vendors/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Vendor
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VendorRegistry;
