import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  User,
  Shield,
  Bell,
  Users,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Download
} from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';

// Form schemas
const accountSettingsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  timezone: z.string(),
  language: z.string(),
  dateFormat: z.string(),
  timeFormat: z.string()
});

const securitySettingsSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const notificationSettingsSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  assignmentUpdates: z.boolean(),
  complianceReminders: z.boolean(),
  pocValidationReminders: z.boolean(),
  paymentNotifications: z.boolean(),
  systemMaintenance: z.boolean(),
  marketingEmails: z.boolean()
});

type AccountSettingsData = z.infer<typeof accountSettingsSchema>;
type SecuritySettingsData = z.infer<typeof securitySettingsSchema>;
type NotificationSettingsData = z.infer<typeof notificationSettingsSchema>;

interface VendorUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastLogin: Date;
  createdAt: Date;
  permissions: string[];
}

interface SecurityLog {
  id: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  status: 'Success' | 'Failed' | 'Warning';
}

const VendorSettings: React.FC = () => {
  const { user, vendor, checkPermission } = useVendorAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [vendorUsers, setVendorUsers] = useState<VendorUser[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(480);

  // Form instances
  const accountForm = useForm<AccountSettingsData>({
    resolver: zodResolver(accountSettingsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      timezone: 'America/New_York',
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h'
    }
  });

  const securityForm = useForm<SecuritySettingsData>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const notificationForm = useForm<NotificationSettingsData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      assignmentUpdates: true,
      complianceReminders: true,
      pocValidationReminders: true,
      paymentNotifications: true,
      systemMaintenance: true,
      marketingEmails: false
    }
  });

  useEffect(() => {
    // Load user data and settings
    if (user) {
      accountForm.reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || '',
        timezone: 'America/New_York',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12h'
      });
    }

    // Load mock data
    const mockUsers: VendorUser[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@techcorp.com',
        role: 'Vendor Admin',
        status: 'Active',
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date('2023-01-15'),
        permissions: ['manage_profile', 'manage_contacts', 'manage_users', 'view_reports', 'manage_assignments']
      }
    ];

    const mockSecurityLogs: SecurityLog[] = [
      {
        id: '1',
        action: 'Login',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'Success'
      }
    ];

    setVendorUsers(mockUsers);
    setSecurityLogs(mockSecurityLogs);
    setMfaEnabled(user?.mfaEnabled || false);
  }, [user]);

  const onAccountSubmit = async (data: AccountSettingsData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Account settings updated:', data);
    } catch (error) {
      console.error('Failed to update account settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSecuritySubmit = async (data: SecuritySettingsData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Security settings updated:', data);
      securityForm.reset();
    } catch (error) {
      console.error('Failed to update security settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onNotificationSubmit = async (data: NotificationSettingsData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Notification settings updated:', data);
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaToggle = async (enabled: boolean) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMfaEnabled(enabled);
      console.log('MFA', enabled ? 'enabled' : 'disabled');
    } catch (error) {
      console.error('Failed to toggle MFA:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': 'success',
      'Inactive': 'secondary',
      'Pending': 'warning',
      'Success': 'success',
      'Failed': 'destructive',
      'Warning': 'warning'
    };
    return variants[status] || 'secondary';
  };

  const canManageUsers = checkPermission('manage_users');

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences, security settings, and user access
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="account" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Account</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          {canManageUsers && (
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Account Settings Tab */}
        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={accountForm.handleSubmit(onAccountSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      {...accountForm.register('firstName')}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      {...accountForm.register('lastName')}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...accountForm.register('email')}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password & Authentication</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...securityForm.register('currentPassword')}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...securityForm.register('newPassword')}
                    disabled={isLoading}
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">Multi-Factor Authentication</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={mfaEnabled}
                    onCheckedChange={handleMfaToggle}
                    disabled={isLoading}
                  />
                </div>
                {mfaEnabled && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      MFA is enabled. You'll need to provide a verification code when logging in.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs would go here */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Notification settings will be implemented here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Activity</CardTitle>
              <CardDescription>
                Recent security events and login history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadge(log.status)}>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                      <TableCell>{log.timestamp.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorSettings;
