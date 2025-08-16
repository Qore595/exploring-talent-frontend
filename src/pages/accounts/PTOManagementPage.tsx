import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DataTable, Column } from "@/components/accounts/DataTable";
import { StatusBadge } from "@/components/accounts/StatusBadge";
import { accountsService, PTOEmployee } from "@/services/accountsService";
import {
  Plus,
  Edit,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  User,
  TrendingUp
} from "lucide-react";

const PTOManagementPage: React.FC = () => {
  const [employees, setEmployees] = useState<PTOEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddPTOOpen, setIsAddPTOOpen] = useState(false);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await accountsService.getPTOEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to load PTO employees:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  const getBalanceColor = (status: string) => {
    if (status === 'exceeded') return 'text-destructive font-bold';
    if (status === 'nearing') return 'text-warning font-medium';
    return 'text-foreground';
  };

  const columns: Column<PTOEmployee>[] = [
    {
      key: 'employeeName',
      header: 'Employee Name',
      sortable: true,
      className: 'font-medium'
    },
    {
      key: 'startDate',
      header: 'Start Date',
      sortable: true,
      className: 'text-sm'
    },
    {
      key: 'tenure',
      header: 'Tenure',
      sortable: true
    },
    {
      key: 'ptoEarned',
      header: 'PTO Earned',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {value}h
        </div>
      )
    },
    {
      key: 'ptoTaken',
      header: 'PTO Taken',
      render: (value) => `${value}h`
    },
    {
      key: 'balance',
      header: 'Balance',
      render: (value, row) => (
        <span className={getBalanceColor(row.status)}>
          {value}h
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const statusMap = {
          'within': 'success',
          'nearing': 'warning',
          'exceeded': 'error'
        };
        const labelMap = {
          'within': 'Within Balance',
          'nearing': 'Nearing Limit',
          'exceeded': 'Exceeded'
        };
        return (
          <StatusBadge
            status={statusMap[value] as any}
            type="general"
          />
        );
      }
    },
    {
      key: 'alerts',
      header: 'Alerts',
      render: (alerts) => (
        alerts.length > 0 ? (
          <div className="space-y-1">
            {alerts.map((alert, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {alert}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">No alerts</span>
        )
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">PTO Management</h1>
          <p className="text-muted-foreground">
            Track and manage employee PTO accruals and balances
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddPTOOpen} onOpenChange={setIsAddPTOOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add PTO Adjustment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add PTO Adjustment</DialogTitle>
                <DialogDescription>
                  Make manual adjustments to employee PTO balances
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee">Employee</Label>
                  <Input id="employee" placeholder="Select employee..." />
                </div>
                <div>
                  <Label htmlFor="adjustment">Adjustment (hours)</Label>
                  <Input id="adjustment" type="number" placeholder="Enter hours (+ or -)" />
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Input id="reason" placeholder="Reason for adjustment..." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddPTOOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddPTOOpen(false)}>
                    Apply Adjustment
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">Active employees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total PTO Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,670</div>
            <p className="text-xs text-muted-foreground">Earned this year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PTO Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">Average usage</p>
          </CardContent>
        </Card>
      </div>

      {/* PTO Accrual Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>PTO Accrual Tracker</CardTitle>
          <CardDescription>
            Monitor employee PTO balances and identify alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={employees}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search employees..."
            emptyMessage="No employees found"
            rowClassName={(row) => {
              if (row.status === 'exceeded') return 'bg-destructive/5 border-destructive/20';
              if (row.status === 'nearing') return 'bg-warning/5 border-warning/20';
              return '';
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PTOManagementPage;
