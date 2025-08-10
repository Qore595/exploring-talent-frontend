import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Shield
} from 'lucide-react';
import { PointOfContact } from '@/types/vendor';

const PocDetails: React.FC = () => {
  const { pocId } = useParams();
  const navigate = useNavigate();
  const [poc, setPoc] = useState<PointOfContact & { vendorName: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    if (pocId) {
      const mockPoc = {
        id: pocId,
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
        notes: 'Primary contact for all strategic discussions and contract negotiations.',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2024-01-01'),
        createdBy: 'admin',
        updatedBy: 'admin'
      };

      // Load data immediately for better UX
      setPoc(mockPoc);
      setIsLoading(false);

      console.log('Loaded PoC details:', mockPoc);
    }
  }, [pocId]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading PoC details...</p>
        </div>
      </div>
    );
  }

  if (error || !poc) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Point of contact not found'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/vendor-hub/pocs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to PoCs
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{poc.name}</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="outline">{poc.role}</Badge>
              {getStatusBadge(poc.status)}
              {poc.isPrimary && <Badge variant="default">Primary</Badge>}
              {poc.isBackup && <Badge variant="secondary">Backup</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link to={`/vendor-hub/pocs/${poc.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit PoC
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/vendor-hub/vendors/${poc.vendorId}`}>
              <Building className="h-4 w-4 mr-2" />
              View Vendor
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Primary contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{poc.name}</p>
                  <p className="text-sm text-muted-foreground">{poc.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{poc.email}</p>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                </div>
              </div>

              {poc.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{poc.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{poc.vendorName}</p>
                  <p className="text-sm text-muted-foreground">Vendor</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status & Validation */}
        <Card>
          <CardHeader>
            <CardTitle>Status & Validation</CardTitle>
            <CardDescription>Current status and validation information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                {getStatusBadge(poc.status)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Validation Status:</span>
                {getValidationStatusBadge(poc.validationStatus)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Contact Type:</span>
                <div className="flex space-x-1">
                  {poc.isPrimary && <Badge variant="default">Primary</Badge>}
                  {poc.isBackup && <Badge variant="secondary">Backup</Badge>}
                  {!poc.isPrimary && !poc.isBackup && <Badge variant="outline">Standard</Badge>}
                </div>
              </div>

              {poc.lastValidated && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Last Validated:</span>
                  <span className="text-sm">{poc.lastValidated.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Information */}
      {poc.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Additional information about this contact</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{poc.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Audit Information */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Information</CardTitle>
          <CardDescription>Record creation and modification details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Created</h4>
              <div className="text-sm text-muted-foreground">
                <p>Date: {poc.createdAt.toLocaleDateString()}</p>
                <p>By: {poc.createdBy}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Last Updated</h4>
              <div className="text-sm text-muted-foreground">
                <p>Date: {poc.updatedAt.toLocaleDateString()}</p>
                <p>By: {poc.updatedBy}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PocDetails;
