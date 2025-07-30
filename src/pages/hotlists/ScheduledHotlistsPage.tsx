import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Play, Pause, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from '@/hooks/use-toast';

// Mock scheduled hotlists data
const mockScheduledHotlists = [
  {
    id: '1',
    name: 'Weekly Frontend Developers',
    description: 'Weekly hotlist for frontend developer positions',
    scheduleType: 'weekly',
    nextRun: '2024-02-19T09:00:00Z',
    lastRun: '2024-02-12T09:00:00Z',
    status: 'active',
    batchSize: 15,
    candidatesCount: 45,
    responseRate: 78.5,
    totalSent: 180,
    createdBy: 'John Doe',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    name: 'Bi-weekly Data Scientists',
    description: 'Bi-weekly campaign for data science roles',
    scheduleType: 'bi_weekly',
    nextRun: '2024-02-21T14:00:00Z',
    lastRun: '2024-02-07T14:00:00Z',
    status: 'active',
    batchSize: 12,
    candidatesCount: 28,
    responseRate: 82.1,
    totalSent: 84,
    createdBy: 'Jane Smith',
    createdAt: '2024-01-20T11:00:00Z'
  },
  {
    id: '3',
    name: 'Daily DevOps Urgent',
    description: 'Daily urgent DevOps positions',
    scheduleType: 'daily',
    nextRun: '2024-02-16T08:00:00Z',
    lastRun: '2024-02-15T08:00:00Z',
    status: 'paused',
    batchSize: 8,
    candidatesCount: 22,
    responseRate: 91.3,
    totalSent: 176,
    createdBy: 'Mike Johnson',
    createdAt: '2024-01-10T09:00:00Z'
  },
  {
    id: '4',
    name: 'Monthly QA Engineers',
    description: 'Monthly quality assurance engineer positions',
    scheduleType: 'custom',
    nextRun: '2024-03-01T10:00:00Z',
    lastRun: '2024-02-01T10:00:00Z',
    status: 'active',
    batchSize: 20,
    candidatesCount: 35,
    responseRate: 65.7,
    totalSent: 140,
    createdBy: 'Sarah Wilson',
    createdAt: '2024-01-05T15:00:00Z'
  }
];

const ScheduledHotlistsPage = () => {
  const navigate = useNavigate();
  const [hotlists, setHotlists] = useState(mockScheduledHotlists);
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleFilter, setScheduleFilter] = useState('all');

  const handleBack = () => {
    navigate('/hotlists');
  };

  const handleToggleStatus = (hotlistId: string) => {
    setHotlists(prev => prev.map(h => 
      h.id === hotlistId 
        ? { ...h, status: h.status === 'active' ? 'paused' : 'active' }
        : h
    ));
    
    const hotlist = hotlists.find(h => h.id === hotlistId);
    toast({
      title: `Hotlist ${hotlist?.status === 'active' ? 'Paused' : 'Activated'}`,
      description: `"${hotlist?.name}" has been ${hotlist?.status === 'active' ? 'paused' : 'activated'}.`,
    });
  };

  const handleEdit = (hotlistId: string) => {
    toast({
      title: "Edit Hotlist",
      description: "Edit functionality would open here.",
    });
  };

  const handleDelete = (hotlistId: string) => {
    setHotlists(prev => prev.filter(h => h.id !== hotlistId));
    toast({
      title: "Hotlist Deleted",
      description: "Scheduled hotlist has been deleted.",
    });
  };

  const handleView = (hotlistId: string) => {
    toast({
      title: "View Details",
      description: "Detailed view would open here.",
    });
  };

  const filteredHotlists = hotlists.filter(hotlist => {
    const matchesStatus = statusFilter === 'all' || hotlist.status === statusFilter;
    const matchesSchedule = scheduleFilter === 'all' || hotlist.scheduleType === scheduleFilter;
    return matchesStatus && matchesSchedule;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800">Paused</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getScheduleTypeBadge = (scheduleType: string) => {
    const labels = {
      daily: 'Daily',
      weekly: 'Weekly',
      bi_weekly: 'Bi-weekly',
      custom: 'Custom'
    };
    return <Badge variant="outline">{labels[scheduleType as keyof typeof labels] || scheduleType}</Badge>;
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeUntilNext = (nextRun: string) => {
    const now = new Date();
    const next = new Date(nextRun);
    const diff = next.getTime() - now.getTime();
    
    if (diff < 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotlists
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Scheduled Hotlists</h1>
            <p className="text-gray-600">Manage recurring and scheduled hotlist campaigns</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Filters */}
          <div className="flex items-center space-x-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={scheduleFilter} onValueChange={setScheduleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Schedules</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi_weekly">Bi-weekly</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hotlists.length}</div>
            <p className="text-xs text-muted-foreground">
              {hotlists.filter(h => h.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Run</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {getTimeUntilNext(hotlists.filter(h => h.status === 'active')[0]?.nextRun || '')}
            </div>
            <p className="text-xs text-muted-foreground">
              Until next scheduled run
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(hotlists.reduce((acc, h) => acc + h.responseRate, 0) / hotlists.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all scheduled hotlists
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hotlists.reduce((acc, h) => acc + h.totalSent, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Emails sent this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Hotlists Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Hotlists</CardTitle>
          <CardDescription>
            Manage your recurring hotlist campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Response Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHotlists.map((hotlist) => (
                <TableRow key={hotlist.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{hotlist.name}</div>
                      <div className="text-sm text-gray-500">{hotlist.description}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {hotlist.batchSize} per batch • {hotlist.candidatesCount} candidates
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getScheduleTypeBadge(hotlist.scheduleType)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(hotlist.status)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{formatDateTime(hotlist.nextRun)}</div>
                      <div className="text-xs text-gray-500">
                        in {getTimeUntilNext(hotlist.nextRun)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{formatDateTime(hotlist.lastRun)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{hotlist.responseRate}%</div>
                    <div className="text-xs text-gray-500">{hotlist.totalSent} sent</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(hotlist.id)}
                      >
                        {hotlist.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(hotlist.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(hotlist.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(hotlist.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredHotlists.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No scheduled hotlists found</div>
          <Button onClick={() => navigate('/hotlists/create')}>
            Create Your First Scheduled Hotlist
          </Button>
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default ScheduledHotlistsPage;
