import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DataTable, Column } from "@/components/accounts/DataTable";
import { StatusBadge } from "@/components/accounts/StatusBadge";
import { accountsService, ApprovalItem } from "@/services/accountsService";
import {
  CheckCircle,
  XCircle,
  Eye,
  Lock,
  Clock,
  DollarSign,
  FileText,
  User,
  AlertCircle,
  MessageSquare
} from "lucide-react";

const ApprovalsPage: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApprovals = async () => {
      try {
        const data = await accountsService.getApprovals();
        setApprovals(data);
      } catch (error) {
        console.error('Failed to load approvals:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApprovals();
  }, []);

  const getPriorityBadge = (priority: string) => {
    const variants = {
      'High': 'destructive',
      'Medium': 'warning',
      'Low': 'secondary'
    };

    return (
      <Badge variant={variants[priority] as any} className="text-xs">
        {priority}
      </Badge>
    );
  };

  const handleApprove = async (id: number) => {
    try {
      await accountsService.approveItem(id);
      // Refresh data
      const data = await accountsService.getApprovals();
      setApprovals(data);
    } catch (error) {
      console.error('Failed to approve item:', error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await accountsService.rejectItem(id, 'Rejected by user');
      // Refresh data
      const data = await accountsService.getApprovals();
      setApprovals(data);
    } catch (error) {
      console.error('Failed to reject item:', error);
    }
  };

  const columns: Column<ApprovalItem>[] = [
    {
      key: 'itemType',
      header: 'Item Type',
      render: (value, row) => (
        <div className="flex items-center gap-2">
          {value === 'Invoice' ? (
            <FileText className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="font-medium">{value}</span>
          {row.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
        </div>
      )
    },
    {
      key: 'candidateClient',
      header: 'Candidate/Client',
      render: (value) => (
        <div className="flex items-center gap-1">
          <User className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      )
    },
    {
      key: 'amount',
      header: 'Amount/Hours',
      render: (value, row) => (
        value ? (
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            ${value.toLocaleString()}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            {row.hours}h
          </div>
        )
      )
    },
    {
      key: 'requestedBy',
      header: 'Requested By',
      className: 'text-sm'
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (value) => getPriorityBadge(value)
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => {
        const statusMap = {
          'Pending': 'pending',
          'Approved': 'approved',
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
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Approval Details</DialogTitle>
                <DialogDescription>
                  Review item details and approval history
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Item Type</Label>
                    <div className="mt-1 p-2 bg-muted rounded">{row.itemType}</div>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <div className="mt-1">
                      <StatusBadge
                        status={row.status.toLowerCase() as any}
                        type="approval"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <div className="mt-1 p-2 bg-muted rounded">{row.description}</div>
                </div>
                {row.comments.length > 0 && (
                  <div>
                    <Label>Comments & History</Label>
                    <div className="mt-1 space-y-2">
                      {row.comments.map((comment, index) => (
                        <div key={index} className="p-2 bg-muted rounded text-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="h-3 w-3" />
                            <span className="font-medium">{comment.user}</span>
                            <span className="text-muted-foreground">{comment.date}</span>
                          </div>
                          <p>{comment.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {row.status === 'Pending' && !row.isLocked && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-green-600 hover:text-green-700"
                onClick={() => handleApprove(row.id)}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleReject(row.id)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve pending invoices, timesheets, and other items
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <CardTitle className="text-sm font-medium">Approved Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Completed approvals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Urgent items</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$485K</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Approvals</CardTitle>
          <CardDescription>
            Items awaiting executive sign-off and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={approvals}
            columns={columns}
            loading={loading}
            searchPlaceholder="Search approvals..."
            emptyMessage="No approvals found"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalsPage;
