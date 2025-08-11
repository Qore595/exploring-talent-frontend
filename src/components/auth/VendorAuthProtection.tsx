import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Building, Loader2, Shield } from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';

interface VendorAuthProtectionProps {
  children: ReactNode;
  requiredRole?: 'Vendor Admin' | 'Vendor PoC';
  requiredPermission?: string;
}

const VendorAuthProtection: React.FC<VendorAuthProtectionProps> = ({ 
  children, 
  requiredRole,
  requiredPermission 
}) => {
  const { user, vendor, isAuthenticated, isLoading, checkPermission } = useVendorAuth();
  const location = useLocation();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Building className="h-12 w-12 text-primary mb-4" />
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">Loading Vendor Portal</h2>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we verify your credentials...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/vendor-portal/login" state={{ from: location }} replace />;
  }

  // Check if user account is active
  if (user?.status !== 'Active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-red-900">Account Suspended</CardTitle>
            <CardDescription>
              Your vendor account has been {user?.status?.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {user?.status === 'Suspended' 
                  ? 'Your account has been temporarily suspended. Please contact your account manager for assistance.'
                  : 'Your account is currently inactive. Please contact support to reactivate your account.'
                }
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Need help? Contact your account manager or technical support.
              </p>
              <Button variant="outline" onClick={() => window.location.href = 'mailto:support@company.com'}>
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if vendor is active
  if (vendor?.status !== 'Active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Building className="h-12 w-12 text-yellow-500" />
            </div>
            <CardTitle className="text-yellow-900">Vendor Account Inactive</CardTitle>
            <CardDescription>
              {vendor?.displayName} is currently {vendor?.status?.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your vendor account is not active. Please contact your account manager to resolve this issue.
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Account Status: <strong>{vendor?.status}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Onboard Date: {vendor?.onboardDate.toLocaleDateString()}
              </p>
              <Button variant="outline" onClick={() => window.location.href = 'mailto:support@company.com'}>
                Contact Account Manager
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role-based access
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-red-900">Access Denied</CardTitle>
            <CardDescription>
              Insufficient permissions to access this resource
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This page requires <strong>{requiredRole}</strong> role. 
                Your current role is <strong>{user?.role}</strong>.
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check permission-based access
  if (requiredPermission && !checkPermission(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-red-500" />
            </div>
            <CardTitle className="text-red-900">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to perform this action
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                This action requires additional permissions. Please contact your administrator if you believe this is an error.
              </AlertDescription>
            </Alert>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Your Role: <strong>{user?.role}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Required Permission: <strong>{requiredPermission}</strong>
              </p>
              <Button variant="outline" onClick={() => window.history.back()}>
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // All checks passed, render children
  return <>{children}</>;
};

export default VendorAuthProtection;
