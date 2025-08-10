// Mobile-Optimized Vendor Card Component
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Building,
  Users,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Plus
} from 'lucide-react';
import { VendorWithPocs } from '@/types/vendor';
import { cn } from '@/lib/utils';

interface MobileVendorCardProps {
  vendor: VendorWithPocs;
  onEdit?: (vendor: VendorWithPocs) => void;
  onDelete?: (vendor: VendorWithPocs) => void;
  onAddPoc?: (vendor: VendorWithPocs) => void;
  className?: string;
}

const MobileVendorCard: React.FC<MobileVendorCardProps> = ({
  vendor,
  onEdit,
  onDelete,
  onAddPoc,
  className
}) => {
  const primaryPoc = vendor.pointsOfContact.find(poc => poc.isPrimary);
  const activePocs = vendor.pointsOfContact.filter(poc => poc.status === 'Active');
  const outdatedPocs = vendor.pointsOfContact.filter(poc => 
    poc.validationStatus === 'Overdue' || poc.validationStatus === 'Failed'
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': { variant: 'success', icon: CheckCircle },
      'Inactive': { variant: 'secondary', icon: Clock },
    };
    
    const config = variants[status] || { variant: 'secondary', icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getVendorTypeBadge = (type: string) => {
    return (
      <Badge variant={type === 'Prime Vendor' ? 'default' : 'secondary'} className="text-xs">
        {type === 'Prime Vendor' ? <Building className="h-3 w-3 mr-1" /> : <Users className="h-3 w-3 mr-1" />}
        {type}
      </Badge>
    );
  };

  const getValidationAlert = () => {
    if (outdatedPocs.length > 0) {
      return (
        <div className="flex items-center space-x-1 text-xs text-destructive">
          <AlertTriangle className="h-3 w-3" />
          <span>{outdatedPocs.length} PoC(s) need validation</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{vendor.vendorName}</h3>
            <div className="flex items-center space-x-2 mt-1">
              {getVendorTypeBadge(vendor.vendorType)}
              {getStatusBadge(vendor.status)}
              {vendor.tierLevel && (
                <Badge variant="outline" className="text-xs">
                  {vendor.tierLevel}
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
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
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(vendor)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Vendor
                </DropdownMenuItem>
              )}
              {onAddPoc && (
                <DropdownMenuItem onClick={() => onAddPoc(vendor)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add PoC
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onDelete(vendor)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Vendor
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="space-y-1">
            <div className="text-lg font-semibold">{vendor.pointsOfContact.length}</div>
            <div className="text-xs text-muted-foreground">Total PoCs</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold">{activePocs.length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="space-y-1">
            <div className={cn(
              "text-lg font-semibold",
              outdatedPocs.length > 0 ? "text-destructive" : "text-muted-foreground"
            )}>
              {outdatedPocs.length}
            </div>
            <div className="text-xs text-muted-foreground">Overdue</div>
          </div>
        </div>

        {/* Primary PoC */}
        {primaryPoc ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Primary Contact</h4>
              <Badge variant={primaryPoc.validationStatus === 'Validated' ? 'success' : 'warning'} className="text-xs">
                {primaryPoc.validationStatus}
              </Badge>
            </div>
            <div className="bg-muted/50 rounded-lg p-3 space-y-2">
              <div className="font-medium text-sm">{primaryPoc.name}</div>
              <div className="text-xs text-muted-foreground">{primaryPoc.role}</div>
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{primaryPoc.email}</span>
                </div>
                {primaryPoc.phone && (
                  <div className="flex items-center space-x-1">
                    <Phone className="h-3 w-3" />
                    <span>{primaryPoc.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Primary Contact</h4>
            <div className="bg-muted/50 rounded-lg p-3 text-center">
              <div className="text-sm text-muted-foreground mb-2">No primary contact assigned</div>
              {onAddPoc && (
                <Button size="sm" variant="outline" onClick={() => onAddPoc(vendor)}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add PoC
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Validation Alert */}
        {getValidationAlert()}

        {/* Vendor Info */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Onboard Date:</span>
            <span>{vendor.onboardDate.toLocaleDateString()}</span>
          </div>
          {vendor.offboardDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Offboard Date:</span>
              <span>{vendor.offboardDate.toLocaleDateString()}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Last Updated:</span>
            <span>{vendor.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>

        {/* Notes Preview */}
        {vendor.notes && (
          <div className="space-y-1">
            <div className="text-xs font-medium">Notes</div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {vendor.notes}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link to={`/vendor-hub/vendors/${vendor.id}`}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Link>
          </Button>
          {onEdit && (
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onEdit(vendor)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Mobile PoC Card Component
export const MobilePocCard: React.FC<{
  poc: any; // PointOfContact with vendorName
  onEdit?: (poc: any) => void;
  onDelete?: (poc: any) => void;
  onValidate?: (poc: any) => void;
  className?: string;
}> = ({ poc, onEdit, onDelete, onValidate, className }) => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': { variant: 'success', icon: CheckCircle },
      'Replaced': { variant: 'warning', icon: AlertTriangle },
      'Inactive': { variant: 'secondary', icon: Clock },
      'Leaving': { variant: 'destructive', icon: AlertTriangle },
    };
    
    const config = variants[status] || { variant: 'secondary', icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getValidationBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Validated': { variant: 'success', icon: CheckCircle },
      'Pending': { variant: 'warning', icon: Clock },
      'Overdue': { variant: 'destructive', icon: AlertTriangle },
      'Failed': { variant: 'destructive', icon: AlertTriangle },
    };
    
    const config = variants[status] || { variant: 'secondary', icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="text-xs">
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{poc.name}</h3>
            <div className="text-sm text-muted-foreground truncate">{poc.vendorName}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline" className="text-xs">{poc.role}</Badge>
              {poc.isPrimary && <Badge variant="default" className="text-xs">Primary</Badge>}
              {poc.isBackup && <Badge variant="secondary" className="text-xs">Backup</Badge>}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                <MoreVertical className="h-4 w-4" />
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
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(poc)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit PoC
                </DropdownMenuItem>
              )}
              {onValidate && (
                <DropdownMenuItem onClick={() => onValidate(poc)}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Send Validation
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem 
                  className="text-destructive"
                  onClick={() => onDelete(poc)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove PoC
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Status Badges */}
        <div className="flex items-center space-x-2">
          {getStatusBadge(poc.status)}
          {getValidationBadge(poc.validationStatus)}
        </div>

        {/* Contact Information */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">{poc.email}</span>
          </div>
          {poc.phone && (
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span>{poc.phone}</span>
            </div>
          )}
        </div>

        {/* Last Validated */}
        {poc.lastValidated && (
          <div className="text-xs text-muted-foreground">
            Last validated: {poc.lastValidated.toLocaleDateString()}
          </div>
        )}

        {/* Notes Preview */}
        {poc.notes && (
          <div className="space-y-1">
            <div className="text-xs font-medium">Notes</div>
            <div className="text-xs text-muted-foreground line-clamp-2">
              {poc.notes}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1" asChild>
            <Link to={`/vendor-hub/pocs/${poc.id}`}>
              <Eye className="h-3 w-3 mr-1" />
              View
            </Link>
          </Button>
          {onValidate && poc.validationStatus !== 'Validated' && (
            <Button size="sm" variant="outline" className="flex-1" onClick={() => onValidate(poc)}>
              <CheckCircle className="h-3 w-3 mr-1" />
              Validate
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileVendorCard;
