import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/accounts/DataTable";
import { StatusBadge } from "@/components/accounts/StatusBadge";
import { FileUpload } from "@/components/accounts/FileUpload";
import { accountsService, Timesheet } from "@/services/accountsService";
import {
  Upload,
  Eye,
  Edit,
  Paperclip,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  AlertCircle,
  Calendar
} from "lucide-react";

const TimesheetsPage: React.FC = () => {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTimesheets = async () => {
      try {
        const data = await accountsService.getTimesheets();
        setTimesheets(data);
      } catch (error) {
        console.error('Failed to load timesheets:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTimesheets();
  }, []);

  const columns: Column<Timesheet>[] = [
    {
      key: 'candidateName',
      header: 'Candidate Name',
      sortable: true,
      className: 'font-medium'
    },
    {
      key: 'weekPeriod',
      header: 'Week/Period',
      className: 'text-sm'
    },
    {
      key: 'billableHours',
      header: 'Billable Hours',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4 text-muted-foreground" />
          {value}h
        </div>
      )
    },
    {
      key: 'nonBillableHours',
      header: 'Non-Billable Hours',
      render: (value) => (
        <span className="text-muted-foreground">{value}h</span>
      )
    },
    {
      key: 'hourlyRate',
      header: 'Hourly Rate',
      render: (value) => `$${value}/hr`
    },
    {
      key: 'lineAmount',
      header: 'Line Amount',
      sortable: true,
      render: (value) => (
        <span className="font-medium">${value.toLocaleString()}</span>
      )
    },
    {
      key: 'approvalStatus',
      header: 'Status',
      render: (value) => {
        const statusMap = {
          'Approved': 'approved',
          'Needs Approval': 'pending',
          'Rejected': 'rejected'
        };
        return (
          <StatusBadge
            status={statusMap[value] as any}
            type="approval"
          />
        );
      }
    },
    {
      key: 'attachments',
      header: 'Attachments',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Paperclip className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'hasOCRData',
      header: 'OCR',
      render: (value) => (
        value ? (
          <Badge variant="success" className="text-xs">
            <Eye className="h-3 w-3 mr-1" />
            Available
          </Badge>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        )
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: () => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Upload className="h-4 w-4" />
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
          <h1 className="text-3xl font-bold tracking-tight">Timesheets</h1>
          <p className="text-muted-foreground">
            Upload, review, and approve candidate timesheets
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Timesheet
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Timesheets</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,456</div>
            <p className="text-xs text-muted-foreground">Billable hours</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <AlertCircle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$267K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Timesheet Management */}
      <Card>
        <CardHeader>
          <CardTitle>Timesheet Management</CardTitle>
          <CardDescription>
            Review and approve candidate timesheets with OCR extraction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={timesheets}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search timesheets..."
            emptyMessage="No timesheets found"
          />

          {/* File Upload Section */}
          <div className="mt-6">
            <h4 className="text-lg font-medium mb-4">Upload New Timesheets</h4>
            <FileUpload
              multiple={true}
              accept=".pdf,.jpg,.jpeg,.png"
              maxSize={10}
              maxFiles={5}
              onUpload={async (files) => {
                // Simulate upload process
                console.log('Uploading files:', files);
                await new Promise(resolve => setTimeout(resolve, 2000));
              }}
            />
          </div>

          {/* OCR Preview Section */}
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">OCR Extract Preview</CardTitle>
                <CardDescription>
                  Preview of extracted timesheet data (Mock/Demo UI)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Extracted Hours:</span>
                      <div className="mt-1 p-2 bg-background rounded border">40.0</div>
                    </div>
                    <div>
                      <span className="font-medium">Rate Detected:</span>
                      <div className="mt-1 p-2 bg-background rounded border">$75.00</div>
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span>
                      <div className="mt-1 p-2 bg-background rounded border text-green-600">95%</div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-muted-foreground">
                    * OCR extraction is currently in demo mode. Actual implementation will process uploaded documents.
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimesheetsPage;
