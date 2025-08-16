import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/accounts/StatusBadge";
import { accountsService, OverdueInvoice, SystemAlert } from "@/services/accountsService";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Calendar,
  TrendingUp,
  Bell,
  Eye,
  Mail,
  Phone,
  User,
  Building
} from "lucide-react";

const OverdueDashboardPage: React.FC = () => {
  const [overdueInvoices, setOverdueInvoices] = useState<OverdueInvoice[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock aging data - in real app this would come from API
  const agingData = {
    '0-15': { count: 12, amount: 145000, percentage: 35 },
    '15-30': { count: 8, amount: 98000, percentage: 24 },
    '30+': { count: 15, amount: 167000, percentage: 41 }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [invoicesData, alertsData] = await Promise.all([
          accountsService.getOverdueInvoices(),
          accountsService.getSystemAlerts()
        ]);
        setOverdueInvoices(invoicesData);
        setAlerts(alertsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getEscalationBadge = (level: string) => {
    const variants = {
      'Level 1': 'warning',
      'Level 2': 'destructive',
      'Level 3': 'destructive'
    };

    return (
      <Badge variant={variants[level] as any} className="text-xs">
        {level}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Overdue Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor overdue invoices, aging reports, and system alerts
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Mail className="h-4 w-4 mr-2" />
            Send Reminders
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">Active invoices</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">35</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PTO Alerts</CardTitle>
            <Bell className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Active alerts</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Aging Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">0-15 Days</CardTitle>
            <CardDescription>Recent invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold">{agingData['0-15'].count}</span>
                <span className="text-lg font-medium">${agingData['0-15'].amount.toLocaleString()}</span>
              </div>
              <Progress value={agingData['0-15'].percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{agingData['0-15'].percentage}% of total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">15-30 Days</CardTitle>
            <CardDescription>Attention needed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-warning">{agingData['15-30'].count}</span>
                <span className="text-lg font-medium">${agingData['15-30'].amount.toLocaleString()}</span>
              </div>
              <Progress value={agingData['15-30'].percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{agingData['15-30'].percentage}% of total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">30+ Days</CardTitle>
            <CardDescription>Critical overdue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-destructive">{agingData['30+'].count}</span>
                <span className="text-lg font-medium">${agingData['30+'].amount.toLocaleString()}</span>
              </div>
              <Progress value={agingData['30+'].percentage} className="h-2" />
              <p className="text-xs text-muted-foreground">{agingData['30+'].percentage}% of total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overdue Invoices List */}
        <Card>
          <CardHeader>
            <CardTitle>Overdue Invoices</CardTitle>
            <CardDescription>
              Invoices requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueInvoices.map((invoice) => (
                <div key={invoice.id} className="p-4 border rounded-lg bg-destructive/5 border-destructive/20">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{invoice.invoiceNumber}</span>
                        {getEscalationBadge(invoice.escalationLevel)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Building className="h-3 w-3" />
                        {invoice.client}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${invoice.amount.toLocaleString()}</div>
                      <div className="text-sm text-destructive">{invoice.daysOverdue} days overdue</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {invoice.contact}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {invoice.phone}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Mail className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Section */}
        <Card>
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
            <CardDescription>
              Recent alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-sm">{alert.type}</span>
                      <StatusBadge
                        status={alert.severity as any}
                        type="general"
                        size="sm"
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverdueDashboardPage;
