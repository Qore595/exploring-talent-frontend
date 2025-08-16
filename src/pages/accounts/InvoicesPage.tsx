import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/accounts/DataTable";
import { StatusBadge } from "@/components/accounts/StatusBadge";
import { accountsService, Invoice } from "@/services/accountsService";
import {
  Download,
  Eye,
  Edit,
  Paperclip,
  History,
  Calendar,
  DollarSign,
  FileText,
  AlertTriangle
} from "lucide-react";

const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await accountsService.getInvoices();
        setInvoices(data);
      } catch (error) {
        console.error('Failed to load invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNumber',
      header: 'Invoice Number',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {row.isOverdue && <AlertTriangle className="h-4 w-4 text-destructive" />}
          <span className="font-medium">{value}</span>
        </div>
      )
    },
    {
      key: 'client',
      header: 'Client',
      sortable: true
    },
    {
      key: 'vendor',
      header: 'Vendor',
      sortable: true
    },
    {
      key: 'servicePeriod',
      header: 'Service Period',
      className: 'text-sm'
    },
    {
      key: 'invoiceType',
      header: 'Type',
      sortable: true
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      sortable: true,
      render: (value) => (
        <span className="font-medium">${value.toLocaleString()}</span>
      )
    },
    {
      key: 'approvalStatus',
      header: 'Approval',
      render: (value) => (
        <StatusBadge
          status={value.toLowerCase() as any}
          type="approval"
        />
      )
    },
    {
      key: 'clientPaymentStatus',
      header: 'Client Payment',
      render: (value) => (
        <StatusBadge
          status={value.toLowerCase() as any}
          type="payment"
        />
      )
    },
    {
      key: 'candidatePaymentStatus',
      header: 'Candidate Payment',
      render: (value) => (
        <StatusBadge
          status={value.toLowerCase() as any}
          type="payment"
        />
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <History className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage and track all invoices, payments, and approvals
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Invoice
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
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">8</div>
            <p className="text-xs text-muted-foreground">Immediate action needed</p>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Management */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
          <CardDescription>
            Filter and search through all invoices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={invoices}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search invoices..."
            emptyMessage="No invoices found"
            rowClassName={(row) =>
              row.isOverdue ? 'bg-destructive/5 border-destructive/20' : ''
            }
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoicesPage;
