
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  Building,
  CreditCard,
  Lock,
  Mic,
  Database,
  LayoutDashboard,
  Activity
} from "lucide-react";
import ActivityLogs from "@/components/admin/ActivityLogs";

const SettingsPage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account, notifications, security, and system settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-background">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-background">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-background">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          {(user?.role === "company-admin" || user?.role === "hiring-manager") && (
            <TabsTrigger value="company" className="data-[state=active]:bg-background">
              <Building className="h-4 w-4 mr-2" />
              Company
            </TabsTrigger>
          )}
          {(user?.role === "ceo" || user?.role === "branch-manager") && (
            <TabsTrigger value="activity-logs" className="data-[state=active]:bg-background">
              <Activity className="h-4 w-4 mr-2" />
              Activity Logs
            </TabsTrigger>
          )}
          {user?.role === "ceo" && (
            <>
              <TabsTrigger value="billing" className="data-[state=active]:bg-background">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="system" className="data-[state=active]:bg-background">
                <Settings className="h-4 w-4 mr-2" />
                System
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user?.name?.split(' ')[0] || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue={user?.name?.split(' ')[1] || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
              </div>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
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
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important events
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Browser Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive browser notifications when in the app
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for critical alerts
                    </p>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="newCandidate">New candidate matches</Label>
                    <Switch id="newCandidate" defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="screeningComplete">Screening completed</Label>
                    <Switch id="screeningComplete" defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="interviewScheduled">Interview scheduled</Label>
                    <Switch id="interviewScheduled" defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="feedbackReceived">Feedback received</Label>
                    <Switch id="feedbackReceived" defaultChecked={true} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="offerSent">Offer sent</Label>
                    <Switch id="offerSent" defaultChecked={true} />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Preferences"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and authentication options
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Password</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </div>
                <Button variant="outline" className="mt-2">
                  <Key className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch id="2fa" defaultChecked={false} />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Active Sessions</h4>
                <div className="rounded-md border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">Current Session</p>
                      <p className="text-xs text-muted-foreground">
                        Windows 11 · Chrome · New York, USA
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Started: Today at 10:43 AM
                      </p>
                    </div>
                    <Lock className="h-4 w-4 text-green-500" />
                  </div>
                </div>
              </div>

              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Security Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Settings */}
        {(user?.role === "ceo" || user?.role === "branch-manager" || user?.role === "marketing-head" || user?.role === "marketing-supervisor") && (
          <TabsContent value="company" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Company Settings</CardTitle>
                <CardDescription>
                  Manage your company profile and team structure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Company Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input id="companyName" defaultValue="Acme Consulting, Inc." />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input id="industry" defaultValue="IT Consulting" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Company Website</Label>
                      <Input id="companyWebsite" defaultValue="https://acme-consulting.example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company Size</Label>
                      <Input id="companySize" defaultValue="50-100 employees" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Default Profit Split</h4>
                    {user?.role === "ceo" && (
                      <Button variant="outline" size="sm">
                        Edit Split
                      </Button>
                    )}
                  </div>
                  <div className="bg-muted p-4 rounded-md">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Client Budget</span>
                      <span className="text-sm">$100/hr</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Candidate Offer</span>
                      <span className="text-sm">$65/hr</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm font-medium">Company Profit</span>
                      <span className="text-sm font-medium">$35/hr (35%)</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Company Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Billing Settings */}
        {user?.role === "ceo" && (
          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Current Plan</h4>
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">Enterprise Plan</p>
                        <p className="text-sm text-muted-foreground">
                          $999/month · Unlimited users
                        </p>
                      </div>
                      <Button size="sm">Upgrade</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Payment Method</h4>
                  <div className="bg-muted/50 p-4 rounded-md border flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="h-10 w-14 bg-background rounded-md border flex items-center justify-center mr-4">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Expires 12/25
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Billing History</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">Description</th>
                          <th className="text-right py-3 px-4">Amount</th>
                          <th className="text-right py-3 px-4">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-3 px-4">Apr 1, 2025</td>
                          <td className="py-3 px-4">Enterprise Plan - Monthly</td>
                          <td className="py-3 px-4 text-right">$999.00</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-3 px-4">Mar 1, 2025</td>
                          <td className="py-3 px-4">Enterprise Plan - Monthly</td>
                          <td className="py-3 px-4 text-right">$999.00</td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              Download
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Activity Logs */}
        {(user?.role === "ceo" || user?.role === "branch-manager") && (
          <TabsContent value="activity-logs" className="space-y-4">
            <ActivityLogs />
          </TabsContent>
        )}

        {/* System Settings */}
        {user?.role === "ceo" && (
          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system-wide settings and integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">License Information</h4>
                  <div className="bg-muted/50 p-4 rounded-md border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">TalentSpark Enterprise License</p>
                        <p className="text-sm text-muted-foreground">
                          Valid until: December 31, 2025
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Active
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">TalentPulse Voice Screening</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        TalentPulse Integration Status
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enable or disable TalentPulse voice screening functionality
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Mic className="h-4 w-4 text-green-600 mr-2" />
                      <Switch id="aiVoice" defaultChecked={true} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Database Configuration</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        PostgreSQL Connection
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Current status: Connected
                      </p>
                    </div>
                    <div className="flex items-center">
                      <Database className="h-4 w-4 text-green-600 mr-2" />
                      <Button variant="outline" size="sm">
                        Test Connection
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">n8n Workflow Integration</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">
                        Automation Workflows Status
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Enable or disable automated workflows
                      </p>
                    </div>
                    <div className="flex items-center">
                      <LayoutDashboard className="h-4 w-4 text-green-600 mr-2" />
                      <Switch id="workflows" defaultChecked={true} />
                    </div>
                  </div>
                </div>

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save System Settings"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
