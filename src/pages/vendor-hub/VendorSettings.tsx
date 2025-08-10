import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Settings as SettingsIcon,
  Save,
  RefreshCw,
  Bell,
  Mail,
  Shield,
  Database,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap
} from 'lucide-react';

interface VendorHubSettings {
  // Automation Settings
  validationReminderEnabled: boolean;
  validationIntervalMonths: number;
  reminderDaysBeforeExpiry: number;
  maxReminderAttempts: number;
  escalationEnabled: boolean;
  escalationDelayHours: number;

  // Notification Settings
  emailNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  inAppNotificationsEnabled: boolean;
  notificationEmail: string;

  // Data Management
  dataRetentionMonths: number;
  autoArchiveEnabled: boolean;
  exportFormat: 'CSV' | 'Excel' | 'JSON';

  // Security Settings
  requireMFAForSensitiveActions: boolean;
  sessionTimeoutMinutes: number;
  auditLogRetentionDays: number;

  // Integration Settings
  apiRateLimitPerHour: number;
  webhookEnabled: boolean;
  webhookUrl: string;

  // UI Preferences
  defaultPageSize: number;
  defaultSortOrder: 'asc' | 'desc';
  showAdvancedFilters: boolean;
  compactView: boolean;
}

const VendorSettings: React.FC = () => {
  const [settings, setSettings] = useState<VendorHubSettings>({
    // Automation Settings
    validationReminderEnabled: true,
    validationIntervalMonths: 6,
    reminderDaysBeforeExpiry: 30,
    maxReminderAttempts: 3,
    escalationEnabled: true,
    escalationDelayHours: 48,

    // Notification Settings
    emailNotificationsEnabled: true,
    smsNotificationsEnabled: false,
    inAppNotificationsEnabled: true,
    notificationEmail: 'admin@company.com',

    // Data Management
    dataRetentionMonths: 24,
    autoArchiveEnabled: true,
    exportFormat: 'Excel',

    // Security Settings
    requireMFAForSensitiveActions: true,
    sessionTimeoutMinutes: 60,
    auditLogRetentionDays: 365,

    // Integration Settings
    apiRateLimitPerHour: 1000,
    webhookEnabled: false,
    webhookUrl: '',

    // UI Preferences
    defaultPageSize: 25,
    defaultSortOrder: 'desc',
    showAdvancedFilters: true,
    compactView: false,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Load settings
  useEffect(() => {
    // Load data immediately for better UX
    setIsLoading(false);
    console.log('Loaded settings:', settings);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveMessage({ type: 'success', message: 'Settings saved successfully!' });
      console.log('Saved settings:', settings);
    } catch (error) {
      setSaveMessage({ type: 'error', message: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettings({
        validationReminderEnabled: true,
        validationIntervalMonths: 6,
        reminderDaysBeforeExpiry: 30,
        maxReminderAttempts: 3,
        escalationEnabled: true,
        escalationDelayHours: 48,
        emailNotificationsEnabled: true,
        smsNotificationsEnabled: false,
        inAppNotificationsEnabled: true,
        notificationEmail: 'admin@company.com',
        dataRetentionMonths: 24,
        autoArchiveEnabled: true,
        exportFormat: 'Excel',
        requireMFAForSensitiveActions: true,
        sessionTimeoutMinutes: 60,
        auditLogRetentionDays: 365,
        apiRateLimitPerHour: 1000,
        webhookEnabled: false,
        webhookUrl: '',
        defaultPageSize: 25,
        defaultSortOrder: 'desc',
        showAdvancedFilters: true,
        compactView: false,
      });
      setSaveMessage({ type: 'success', message: 'Settings reset to default values.' });
    }
  };

  const updateSetting = <K extends keyof VendorHubSettings>(
    key: K,
    value: VendorHubSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setSaveMessage(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Hub Settings</h1>
          <p className="text-muted-foreground">
            Configure automation, notifications, and system preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <Alert variant={saveMessage.type === 'error' ? 'destructive' : 'default'}>
          {saveMessage.type === 'success' ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertDescription>{saveMessage.message}</AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs defaultValue="automation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="automation">
            <Zap className="h-4 w-4 mr-2" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="h-4 w-4 mr-2" />
            Data
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="ui">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Interface
          </TabsTrigger>
        </TabsList>

        {/* Automation Settings */}
        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Validation Automation</CardTitle>
              <CardDescription>
                Configure automatic PoC validation reminders and escalation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Validation Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send validation reminders to PoCs
                  </p>
                </div>
                <Switch
                  checked={settings.validationReminderEnabled}
                  onCheckedChange={(checked) => updateSetting('validationReminderEnabled', checked)}
                />
              </div>

              {settings.validationReminderEnabled && (
                <>
                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="validationInterval">Validation Interval (months)</Label>
                      <Input
                        id="validationInterval"
                        type="number"
                        min="1"
                        max="24"
                        value={settings.validationIntervalMonths}
                        onChange={(e) => updateSetting('validationIntervalMonths', parseInt(e.target.value) || 6)}
                      />
                      <p className="text-xs text-muted-foreground">
                        How often PoCs should validate their information
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reminderDays">Reminder Days Before Expiry</Label>
                      <Input
                        id="reminderDays"
                        type="number"
                        min="1"
                        max="90"
                        value={settings.reminderDaysBeforeExpiry}
                        onChange={(e) => updateSetting('reminderDaysBeforeExpiry', parseInt(e.target.value) || 30)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Send first reminder this many days before expiry
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxAttempts">Maximum Reminder Attempts</Label>
                      <Input
                        id="maxAttempts"
                        type="number"
                        min="1"
                        max="10"
                        value={settings.maxReminderAttempts}
                        onChange={(e) => updateSetting('maxReminderAttempts', parseInt(e.target.value) || 3)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Maximum number of reminder attempts before escalation
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="escalationDelay">Escalation Delay (hours)</Label>
                      <Input
                        id="escalationDelay"
                        type="number"
                        min="1"
                        max="168"
                        value={settings.escalationDelayHours}
                        onChange={(e) => updateSetting('escalationDelayHours', parseInt(e.target.value) || 48)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Hours to wait between reminder attempts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Enable Escalation</Label>
                      <p className="text-sm text-muted-foreground">
                        Escalate to backup contacts when primary doesn't respond
                      </p>
                    </div>
                    <Switch
                      checked={settings.escalationEnabled}
                      onCheckedChange={(checked) => updateSetting('escalationEnabled', checked)}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.emailNotificationsEnabled}
                    onCheckedChange={(checked) => updateSetting('emailNotificationsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive urgent notifications via SMS
                    </p>
                  </div>
                  <Switch
                    checked={settings.smsNotificationsEnabled}
                    onCheckedChange={(checked) => updateSetting('smsNotificationsEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show notifications within the application
                    </p>
                  </div>
                  <Switch
                    checked={settings.inAppNotificationsEnabled}
                    onCheckedChange={(checked) => updateSetting('inAppNotificationsEnabled', checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="notificationEmail">Notification Email Address</Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  value={settings.notificationEmail}
                  onChange={(e) => updateSetting('notificationEmail', e.target.value)}
                  placeholder="admin@company.com"
                />
                <p className="text-xs text-muted-foreground">
                  Primary email address for system notifications
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Management Settings */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Configure data retention, archiving, and export preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dataRetention">Data Retention (months)</Label>
                  <Input
                    id="dataRetention"
                    type="number"
                    min="6"
                    max="120"
                    value={settings.dataRetentionMonths}
                    onChange={(e) => updateSetting('dataRetentionMonths', parseInt(e.target.value) || 24)}
                  />
                  <p className="text-xs text-muted-foreground">
                    How long to keep vendor and PoC data
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exportFormat">Default Export Format</Label>
                  <Select
                    value={settings.exportFormat}
                    onValueChange={(value: 'CSV' | 'Excel' | 'JSON') => updateSetting('exportFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSV">CSV</SelectItem>
                      <SelectItem value="Excel">Excel</SelectItem>
                      <SelectItem value="JSON">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Default format for data exports
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Auto-Archive Old Records</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically archive inactive vendor records
                  </p>
                </div>
                <Switch
                  checked={settings.autoArchiveEnabled}
                  onCheckedChange={(checked) => updateSetting('autoArchiveEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security & Access Control</CardTitle>
              <CardDescription>
                Configure security settings and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Require MFA for Sensitive Actions</Label>
                  <p className="text-sm text-muted-foreground">
                    Require multi-factor authentication for deletions and exports
                  </p>
                </div>
                <Switch
                  checked={settings.requireMFAForSensitiveActions}
                  onCheckedChange={(checked) => updateSetting('requireMFAForSensitiveActions', checked)}
                />
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="15"
                    max="480"
                    value={settings.sessionTimeoutMinutes}
                    onChange={(e) => updateSetting('sessionTimeoutMinutes', parseInt(e.target.value) || 60)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Automatic logout after inactivity
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="auditRetention">Audit Log Retention (days)</Label>
                  <Input
                    id="auditRetention"
                    type="number"
                    min="30"
                    max="2555"
                    value={settings.auditLogRetentionDays}
                    onChange={(e) => updateSetting('auditLogRetentionDays', parseInt(e.target.value) || 365)}
                  />
                  <p className="text-xs text-muted-foreground">
                    How long to keep audit logs
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API & Integration</CardTitle>
              <CardDescription>
                Configure API access and webhook settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiRateLimit">API Rate Limit (requests/hour)</Label>
                <Input
                  id="apiRateLimit"
                  type="number"
                  min="100"
                  max="10000"
                  value={settings.apiRateLimitPerHour}
                  onChange={(e) => updateSetting('apiRateLimitPerHour', parseInt(e.target.value) || 1000)}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum API requests per hour per user
                </p>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable Webhooks</Label>
                  <p className="text-sm text-muted-foreground">
                    Send real-time notifications to external systems
                  </p>
                </div>
                <Switch
                  checked={settings.webhookEnabled}
                  onCheckedChange={(checked) => updateSetting('webhookEnabled', checked)}
                />
              </div>

              {settings.webhookEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    type="url"
                    value={settings.webhookUrl}
                    onChange={(e) => updateSetting('webhookUrl', e.target.value)}
                    placeholder="https://your-system.com/webhook"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL to receive webhook notifications
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* UI Preferences */}
        <TabsContent value="ui" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Interface Preferences</CardTitle>
              <CardDescription>
                Customize the user interface and default behaviors
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="pageSize">Default Page Size</Label>
                  <Select
                    value={settings.defaultPageSize.toString()}
                    onValueChange={(value) => updateSetting('defaultPageSize', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 items</SelectItem>
                      <SelectItem value="25">25 items</SelectItem>
                      <SelectItem value="50">50 items</SelectItem>
                      <SelectItem value="100">100 items</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Number of items to show per page in tables
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Default Sort Order</Label>
                  <Select
                    value={settings.defaultSortOrder}
                    onValueChange={(value: 'asc' | 'desc') => updateSetting('defaultSortOrder', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Default sort order for tables
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Show Advanced Filters</Label>
                    <p className="text-sm text-muted-foreground">
                      Display advanced filtering options by default
                    </p>
                  </div>
                  <Switch
                    checked={settings.showAdvancedFilters}
                    onCheckedChange={(checked) => updateSetting('showAdvancedFilters', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Compact View</Label>
                    <p className="text-sm text-muted-foreground">
                      Use compact layout to show more information
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactView}
                    onCheckedChange={(checked) => updateSetting('compactView', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Current Configuration Summary</CardTitle>
              <CardDescription>
                Overview of your current settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Automation</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Validation Reminders:</span>
                      <Badge variant={settings.validationReminderEnabled ? 'success' : 'secondary'}>
                        {settings.validationReminderEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Validation Interval:</span>
                      <span>{settings.validationIntervalMonths} months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Escalation:</span>
                      <Badge variant={settings.escalationEnabled ? 'success' : 'secondary'}>
                        {settings.escalationEnabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Notifications</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <Badge variant={settings.emailNotificationsEnabled ? 'success' : 'secondary'}>
                        {settings.emailNotificationsEnabled ? 'On' : 'Off'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SMS:</span>
                      <Badge variant={settings.smsNotificationsEnabled ? 'success' : 'secondary'}>
                        {settings.smsNotificationsEnabled ? 'On' : 'Off'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>In-App:</span>
                      <Badge variant={settings.inAppNotificationsEnabled ? 'success' : 'secondary'}>
                        {settings.inAppNotificationsEnabled ? 'On' : 'Off'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Security</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>MFA Required:</span>
                      <Badge variant={settings.requireMFAForSensitiveActions ? 'success' : 'warning'}>
                        {settings.requireMFAForSensitiveActions ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Session Timeout:</span>
                      <span>{settings.sessionTimeoutMinutes}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Audit Retention:</span>
                      <span>{settings.auditLogRetentionDays}d</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorSettings;
