import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, RefreshCw, AlertTriangle, CheckCircle, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

// Mock settings data
const mockSettings = {
  enabled: true,
  daysBeforeEndDate: 7,
  alertRoles: ['bench_sales', 'account_manager', 'cio_cto'],
  requireConfirmation: true,
  defaultStatus: 'available',
  emailTemplateId: 'template_1',
  autoLockEnabled: true,
  notificationSettings: {
    emailNotifications: true,
    slackNotifications: false,
    dashboardAlerts: true
  },
  advancedSettings: {
    skipWeekends: true,
    businessHoursOnly: true,
    minimumAssignmentDuration: 30,
    excludeShortTermContracts: true
  }
};

const AutoEnrollmentSettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(mockSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleBack = () => {
    navigate('/bench-resources');
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasChanges(true);
  };

  const handleNestedSettingChange = (parent: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleRoleToggle = (role: string, checked: boolean) => {
    setSettings(prev => ({
      ...prev,
      alertRoles: checked 
        ? [...prev.alertRoles, role]
        : prev.alertRoles.filter(r => r !== role)
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Mock save functionality
    toast({
      title: "Settings Saved",
      description: "Auto-enrollment settings have been updated successfully.",
    });
    setHasChanges(false);
  };

  const handleTriggerManual = () => {
    toast({
      title: "Manual Trigger Started",
      description: "Auto-enrollment process has been triggered manually. Check the alerts for results.",
    });
  };

  const availableRoles = [
    { id: 'bench_sales', label: 'Bench Sales', description: 'Sales team members' },
    { id: 'account_manager', label: 'Account Manager', description: 'Account management team' },
    { id: 'cio_cto', label: 'CIO/CTO', label: 'Executive leadership' },
    { id: 'hr', label: 'HR', description: 'Human resources team' },
    { id: 'recruiter', label: 'Recruiter', description: 'Recruitment team' }
  ];

  const statusOptions = [
    { value: 'available', label: 'Available' },
    { value: 'in_hotlist', label: 'In Hotlist' },
    { value: 'submitted', label: 'Submitted' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bench Resources
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Auto-Enrollment Settings</h1>
            <p className="text-gray-600">Configure automatic bench resource enrollment</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleTriggerManual}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Trigger Manual Run
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-full mx-auto">
            {hasChanges && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="text-yellow-800">You have unsaved changes</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
        {/* Basic Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Basic Settings</span>
            </CardTitle>
            <CardDescription>
              Configure the core auto-enrollment functionality
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Enable Auto-Enrollment</Label>
                <p className="text-sm text-gray-600">
                  Automatically enroll resources when assignments are ending
                </p>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daysBeforeEndDate">Days Before End Date</Label>
                <Input
                  id="daysBeforeEndDate"
                  type="number"
                  value={settings.daysBeforeEndDate}
                  onChange={(e) => handleSettingChange('daysBeforeEndDate', parseInt(e.target.value))}
                  min="1"
                  max="30"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How many days before assignment end date to trigger enrollment
                </p>
              </div>

              <div>
                <Label htmlFor="defaultStatus">Default Status</Label>
                <Select
                  value={settings.defaultStatus}
                  onValueChange={(value) => handleSettingChange('defaultStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Default status for auto-enrolled resources
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Require Confirmation</Label>
                <p className="text-sm text-gray-600">
                  Send alerts for manual confirmation before auto-enrollment
                </p>
              </div>
              <Switch
                checked={settings.requireConfirmation}
                onCheckedChange={(checked) => handleSettingChange('requireConfirmation', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Alert Recipients */}
        <Card>
          <CardHeader>
            <CardTitle>Alert Recipients</CardTitle>
            <CardDescription>
              Select which roles should receive auto-enrollment alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableRoles.map(role => (
                <div key={role.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={role.id}
                    checked={settings.alertRoles.includes(role.id)}
                    onCheckedChange={(checked) => handleRoleToggle(role.id, checked as boolean)}
                  />
                  <div className="flex-1">
                    <Label htmlFor={role.id} className="font-medium">
                      {role.label}
                    </Label>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>
              Configure how alerts are delivered
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Email Notifications</Label>
                <p className="text-sm text-gray-600">Send email alerts to recipients</p>
              </div>
              <Switch
                checked={settings.notificationSettings.emailNotifications}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange('notificationSettings', 'emailNotifications', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Slack Notifications</Label>
                <p className="text-sm text-gray-600">Send alerts to Slack channels</p>
              </div>
              <Switch
                checked={settings.notificationSettings.slackNotifications}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange('notificationSettings', 'slackNotifications', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Dashboard Alerts</Label>
                <p className="text-sm text-gray-600">Show alerts in the dashboard</p>
              </div>
              <Switch
                checked={settings.notificationSettings.dashboardAlerts}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange('notificationSettings', 'dashboardAlerts', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Fine-tune the auto-enrollment behavior
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Skip Weekends</Label>
                <p className="text-sm text-gray-600">Don't process enrollments on weekends</p>
              </div>
              <Switch
                checked={settings.advancedSettings.skipWeekends}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange('advancedSettings', 'skipWeekends', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Business Hours Only</Label>
                <p className="text-sm text-gray-600">Only send alerts during business hours</p>
              </div>
              <Switch
                checked={settings.advancedSettings.businessHoursOnly}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange('advancedSettings', 'businessHoursOnly', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Exclude Short-term Contracts</Label>
                <p className="text-sm text-gray-600">Skip assignments shorter than minimum duration</p>
              </div>
              <Switch
                checked={settings.advancedSettings.excludeShortTermContracts}
                onCheckedChange={(checked) => 
                  handleNestedSettingChange('advancedSettings', 'excludeShortTermContracts', checked)
                }
              />
            </div>

            <div>
              <Label htmlFor="minimumDuration">Minimum Assignment Duration (days)</Label>
              <Input
                id="minimumDuration"
                type="number"
                value={settings.advancedSettings.minimumAssignmentDuration}
                onChange={(e) => 
                  handleNestedSettingChange('advancedSettings', 'minimumAssignmentDuration', parseInt(e.target.value))
                }
                min="1"
                max="365"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Assignments shorter than this will be excluded from auto-enrollment
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
            <CardDescription>
              Overview of auto-enrollment activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-gray-600">Auto-enrolled this month</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">3</div>
                <div className="text-sm text-gray-600">Pending confirmations</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <RefreshCw className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">5</div>
                <div className="text-sm text-gray-600">Upcoming assignments</div>
              </div>
            </div>
          </CardContent>
        </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoEnrollmentSettingsPage;
