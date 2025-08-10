// Vendor and PoC Selector Component for Workflow Integration
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, Building, Users, Mail, Phone, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VendorWithPocs, PointOfContact, PocRole } from '@/types/vendor';

interface VendorPocSelectorProps {
  // Required props
  onVendorSelect: (vendor: VendorWithPocs | null) => void;
  onPocSelect: (poc: PointOfContact | null) => void;
  
  // Optional props
  selectedVendorId?: string;
  selectedPocId?: string;
  requiredPocRoles?: PocRole[];
  allowMultiplePocs?: boolean;
  showValidationStatus?: boolean;
  disabled?: boolean;
  
  // Workflow context
  workflowType?: 'assignment' | 'approval' | 'communication' | 'escalation';
  documentType?: string;
  
  // Styling
  className?: string;
  compact?: boolean;
}

const VendorPocSelector: React.FC<VendorPocSelectorProps> = ({
  onVendorSelect,
  onPocSelect,
  selectedVendorId,
  selectedPocId,
  requiredPocRoles,
  allowMultiplePocs = false,
  showValidationStatus = true,
  disabled = false,
  workflowType = 'assignment',
  documentType,
  className,
  compact = false
}) => {
  const [vendors, setVendors] = useState<VendorWithPocs[]>([]);
  const [filteredPocs, setFilteredPocs] = useState<PointOfContact[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<VendorWithPocs | null>(null);
  const [selectedPoc, setSelectedPoc] = useState<PointOfContact | null>(null);
  const [vendorSearchOpen, setVendorSearchOpen] = useState(false);
  const [pocSearchOpen, setPocSearchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          },
          {
            id: '2',
            vendorId: '1',
            name: 'Sarah Johnson',
            role: 'Technical Lead',
            email: 'sarah.johnson@techcorp.com',
            phone: '+1-555-0124',
            status: 'Active',
            isPrimary: false,
            isBackup: true,
            lastValidated: new Date('2024-01-05'),
            validationStatus: 'Validated',
            createdAt: new Date('2023-02-01'),
            updatedAt: new Date('2024-01-05'),
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
            id: '3',
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
      }
    ];

    setTimeout(() => {
      setVendors(mockVendors);
      setIsLoading(false);
      
      // Set initial selections if provided
      if (selectedVendorId) {
        const vendor = mockVendors.find(v => v.id === selectedVendorId);
        if (vendor) {
          setSelectedVendor(vendor);
          onVendorSelect(vendor);
        }
      }
    }, 500);
  }, [selectedVendorId, onVendorSelect]);

  // Filter PoCs based on selected vendor and requirements
  useEffect(() => {
    if (!selectedVendor) {
      setFilteredPocs([]);
      return;
    }

    let pocs = selectedVendor.pointsOfContact.filter(poc => poc.status === 'Active');

    // Filter by required roles if specified
    if (requiredPocRoles && requiredPocRoles.length > 0) {
      pocs = pocs.filter(poc => requiredPocRoles.includes(poc.role));
    }

    // Filter by workflow type
    if (workflowType === 'approval') {
      // For approvals, prioritize primary and backup contacts
      pocs = pocs.filter(poc => poc.isPrimary || poc.isBackup);
    }

    setFilteredPocs(pocs);

    // Auto-select PoC if provided
    if (selectedPocId) {
      const poc = pocs.find(p => p.id === selectedPocId);
      if (poc) {
        setSelectedPoc(poc);
        onPocSelect(poc);
      }
    }
  }, [selectedVendor, requiredPocRoles, workflowType, selectedPocId, onPocSelect]);

  const handleVendorSelect = (vendor: VendorWithPocs) => {
    setSelectedVendor(vendor);
    setSelectedPoc(null); // Reset PoC selection when vendor changes
    onVendorSelect(vendor);
    onPocSelect(null);
    setVendorSearchOpen(false);
  };

  const handlePocSelect = (poc: PointOfContact) => {
    setSelectedPoc(poc);
    onPocSelect(poc);
    setPocSearchOpen(false);
  };

  const getValidationStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Validated': { variant: 'success', icon: CheckCircle },
      'Pending': { variant: 'warning', icon: AlertTriangle },
      'Overdue': { variant: 'destructive', icon: AlertTriangle },
      'Failed': { variant: 'destructive', icon: AlertTriangle },
    };
    
    const config = variants[status] || { variant: 'secondary', icon: AlertTriangle };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="h-2 w-2 mr-1" />
        {status}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading vendors...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={className}>
      {!compact && (
        <CardHeader>
          <CardTitle>Vendor & Contact Selection</CardTitle>
          <CardDescription>
            Select a vendor and point of contact for this {workflowType}
            {documentType && ` (${documentType})`}
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={compact ? "pt-6" : ""}>
        <div className="space-y-4">
          {/* Vendor Selection */}
          <div className="space-y-2">
            <Label>Vendor {!compact && <span className="text-destructive">*</span>}</Label>
            <Popover open={vendorSearchOpen} onOpenChange={setVendorSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={vendorSearchOpen}
                  className="w-full justify-between"
                  disabled={disabled}
                >
                  {selectedVendor ? (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{selectedVendor.vendorName}</span>
                      <Badge variant={selectedVendor.vendorType === 'Prime Vendor' ? 'default' : 'secondary'} className="text-xs">
                        {selectedVendor.vendorType}
                      </Badge>
                    </div>
                  ) : (
                    "Select vendor..."
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput placeholder="Search vendors..." />
                  <CommandEmpty>No vendor found.</CommandEmpty>
                  <CommandGroup>
                    {vendors.filter(v => v.status === 'Active').map((vendor) => (
                      <CommandItem
                        key={vendor.id}
                        onSelect={() => handleVendorSelect(vendor)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedVendor?.id === vendor.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-2">
                            <Building className="h-4 w-4" />
                            <span>{vendor.vendorName}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Badge variant={vendor.vendorType === 'Prime Vendor' ? 'default' : 'secondary'} className="text-xs">
                              {vendor.vendorType}
                            </Badge>
                            {vendor.tierLevel && (
                              <Badge variant="outline" className="text-xs">
                                {vendor.tierLevel}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* PoC Selection */}
          {selectedVendor && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Point of Contact {!compact && <span className="text-destructive">*</span>}</Label>
                {filteredPocs.length > 0 ? (
                  <Popover open={pocSearchOpen} onOpenChange={setPocSearchOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={pocSearchOpen}
                        className="w-full justify-between"
                        disabled={disabled}
                      >
                        {selectedPoc ? (
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>{selectedPoc.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {selectedPoc.role}
                            </Badge>
                            {selectedPoc.isPrimary && (
                              <Badge variant="default" className="text-xs">Primary</Badge>
                            )}
                            {selectedPoc.isBackup && (
                              <Badge variant="secondary" className="text-xs">Backup</Badge>
                            )}
                          </div>
                        ) : (
                          "Select contact..."
                        )}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search contacts..." />
                        <CommandEmpty>No contact found.</CommandEmpty>
                        <CommandGroup>
                          {filteredPocs.map((poc) => (
                            <CommandItem
                              key={poc.id}
                              onSelect={() => handlePocSelect(poc)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedPoc?.id === poc.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex items-center justify-between w-full">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <Users className="h-4 w-4" />
                                    <span className="font-medium">{poc.name}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Mail className="h-3 w-3" />
                                    <span>{poc.email}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end space-y-1">
                                  <Badge variant="outline" className="text-xs">
                                    {poc.role}
                                  </Badge>
                                  <div className="flex items-center space-x-1">
                                    {poc.isPrimary && (
                                      <Badge variant="default" className="text-xs">Primary</Badge>
                                    )}
                                    {poc.isBackup && (
                                      <Badge variant="secondary" className="text-xs">Backup</Badge>
                                    )}
                                    {showValidationStatus && (
                                      getValidationStatusBadge(poc.validationStatus)
                                    )}
                                  </div>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      No suitable contacts found for this vendor.
                      {requiredPocRoles && requiredPocRoles.length > 0 && (
                        <> Required roles: {requiredPocRoles.join(', ')}</>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </>
          )}

          {/* Selected Contact Details */}
          {selectedPoc && !compact && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Selected Contact Details</Label>
                <div className="p-3 border rounded-lg bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{selectedPoc.name}</h4>
                      <div className="flex items-center space-x-1">
                        {selectedPoc.isPrimary && (
                          <Badge variant="default" className="text-xs">Primary</Badge>
                        )}
                        {selectedPoc.isBackup && (
                          <Badge variant="secondary" className="text-xs">Backup</Badge>
                        )}
                        {showValidationStatus && (
                          getValidationStatusBadge(selectedPoc.validationStatus)
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedPoc.role}</p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3" />
                        <span>{selectedPoc.email}</span>
                      </div>
                      {selectedPoc.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span>{selectedPoc.phone}</span>
                        </div>
                      )}
                    </div>
                    {selectedPoc.lastValidated && (
                      <p className="text-xs text-muted-foreground">
                        Last validated: {selectedPoc.lastValidated.toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Validation Warnings */}
          {selectedPoc && showValidationStatus && (
            selectedPoc.validationStatus === 'Overdue' || selectedPoc.validationStatus === 'Failed'
          ) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This contact's validation is {selectedPoc.validationStatus.toLowerCase()}. 
                Consider sending a validation reminder before proceeding.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorPocSelector;
