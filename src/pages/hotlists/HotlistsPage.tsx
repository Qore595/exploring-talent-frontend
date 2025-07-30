import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Filter, Mail, Calendar, BarChart3, Plus,
  Clock, Users, Send, CheckCircle, XCircle, Eye,
  Settings, Download, FileText, TrendingUp
} from 'lucide-react';
import { useHotlistPermissions, useAnalyticsPermissions, WithMockPermission } from '@/hooks/useMockPermissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Mock data for development
const mockHotlists = [
  {
    id: '1',
    name: 'Q1 2024 Frontend Developers',
    description: 'Hotlist for frontend developer positions in Q1 2024',
    batchSize: 10,
    status: 'sent',
    scheduleType: 'weekly',
    scheduledAt: '2024-01-15T09:00:00Z',
    sentAt: '2024-01-15T09:00:00Z',
    showWorkAuthorization: false,
    autoLockEnabled: true,
    createdAt: '2024-01-10T10:00:00Z',
    createdBy: 'John Doe',
    candidates: 10,
    responses: 7,
    interviews: 3,
    placements: 1
  },
  {
    id: '2',
    name: 'Data Science Specialists',
    description: 'Machine learning and data science experts',
    batchSize: 5,
    status: 'scheduled',
    scheduleType: 'daily',
    scheduledAt: '2024-02-01T08:00:00Z',
    showWorkAuthorization: true,
    autoLockEnabled: false,
    createdAt: '2024-01-25T14:30:00Z',
    createdBy: 'Jane Smith',
    candidates: 5,
    responses: 0,
    interviews: 0,
    placements: 0
  },
  {
    id: '3',
    name: 'DevOps Engineers - Urgent',
    description: 'Urgent requirement for DevOps engineers',
    batchSize: 15,
    status: 'completed',
    scheduleType: 'immediate',
    scheduledAt: '2024-01-20T10:00:00Z',
    sentAt: '2024-01-20T10:00:00Z',
    completedAt: '2024-01-28T16:00:00Z',
    showWorkAuthorization: false,
    autoLockEnabled: true,
    createdAt: '2024-01-18T11:00:00Z',
    createdBy: 'Mike Johnson',
    candidates: 15,
    responses: 12,
    interviews: 8,
    placements: 3
  }
];

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-500', textColor: 'text-gray-700', icon: FileText },
  scheduled: { label: 'Scheduled', color: 'bg-blue-500', textColor: 'text-blue-700', icon: Clock },
  sent: { label: 'Sent', color: 'bg-green-500', textColor: 'text-green-700', icon: Send },
  completed: { label: 'Completed', color: 'bg-purple-500', textColor: 'text-purple-700', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500', textColor: 'text-red-700', icon: XCircle }
};

const scheduleTypeConfig = {
  immediate: { label: 'Immediate', icon: '⚡' },
  daily: { label: 'Daily', icon: '📅' },
  weekly: { label: 'Weekly', icon: '📆' },
  bi_weekly: { label: 'Bi-Weekly', icon: '🗓️' },
  custom: { label: 'Custom', icon: '⚙️' }
};

const HotlistsPage = () => {
  const navigate = useNavigate();
  const hotlistPermissions = useHotlistPermissions();
  const analyticsPermissions = useAnalyticsPermissions();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scheduleFilter, setScheduleFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [hotlists, setHotlists] = useState(mockHotlists);

  // Filter hotlists based on search and filters
  const filteredHotlists = useMemo(() => {
    return hotlists.filter(hotlist => {
      const matchesSearch = searchTerm === '' || 
        hotlist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotlist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotlist.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || hotlist.status === statusFilter;
      const matchesSchedule = scheduleFilter === 'all' || hotlist.scheduleType === scheduleFilter;
      
      return matchesSearch && matchesStatus && matchesSchedule;
    });
  }, [hotlists, searchTerm, statusFilter, scheduleFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = hotlists.length;
    const active = hotlists.filter(h => h.status === 'sent' || h.status === 'scheduled').length;
    const completed = hotlists.filter(h => h.status === 'completed').length;
    const totalCandidates = hotlists.reduce((sum, h) => sum + h.candidates, 0);
    const totalResponses = hotlists.reduce((sum, h) => sum + h.responses, 0);
    const totalPlacements = hotlists.reduce((sum, h) => sum + h.placements, 0);
    const responseRate = totalCandidates > 0 ? (totalResponses / totalCandidates * 100) : 0;
    const conversionRate = totalResponses > 0 ? (totalPlacements / totalResponses * 100) : 0;
    
    return { 
      total, 
      active, 
      completed, 
      totalCandidates, 
      totalResponses, 
      totalPlacements, 
      responseRate, 
      conversionRate 
    };
  }, [hotlists]);

  const handleCreateHotlist = () => {
    navigate('/hotlists/create');
  };

  const handleViewAnalytics = () => {
    navigate('/hotlists/analytics');
  };

  const handleViewTemplates = () => {
    navigate('/hotlists/templates');
  };

  const handleHotlistClick = (hotlistId: string) => {
    navigate(`/hotlists/${hotlistId}`);
  };

  const renderHotlistCard = (hotlist: any) => {
    const status = statusConfig[hotlist.status as keyof typeof statusConfig];
    const schedule = scheduleTypeConfig[hotlist.scheduleType as keyof typeof scheduleTypeConfig];
    const StatusIcon = status.icon;
    
    return (
      <Card key={hotlist.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleHotlistClick(hotlist.id)}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{hotlist.name}</CardTitle>
              <CardDescription className="line-clamp-2">{hotlist.description}</CardDescription>
            </div>
            <Badge className={`${status.color} text-white ml-2`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-gray-700">Batch Size</p>
              <p className="text-gray-600">{hotlist.batchSize} candidates</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Schedule</p>
              <p className="text-gray-600">{schedule.icon} {schedule.label}</p>
            </div>
          </div>
          
          {hotlist.status !== 'draft' && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Response Rate</span>
                <span>{hotlist.candidates > 0 ? Math.round((hotlist.responses / hotlist.candidates) * 100) : 0}%</span>
              </div>
              <Progress value={hotlist.candidates > 0 ? (hotlist.responses / hotlist.candidates) * 100 : 0} className="h-2" />
              
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div>
                  <p className="font-medium text-blue-600">{hotlist.responses}</p>
                  <p className="text-gray-500">Responses</p>
                </div>
                <div>
                  <p className="font-medium text-purple-600">{hotlist.interviews}</p>
                  <p className="text-gray-500">Interviews</p>
                </div>
                <div>
                  <p className="font-medium text-green-600">{hotlist.placements}</p>
                  <p className="text-gray-500">Placements</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-3 border-t">
          <div className="flex items-center justify-between w-full text-xs text-gray-500">
            <span>By {hotlist.createdBy}</span>
            <span>
              {hotlist.status === 'scheduled' && hotlist.scheduledAt && 
                `Scheduled: ${new Date(hotlist.scheduledAt).toLocaleDateString()}`
              }
              {hotlist.status === 'sent' && hotlist.sentAt && 
                `Sent: ${new Date(hotlist.sentAt).toLocaleDateString()}`
              }
              {hotlist.status === 'completed' && hotlist.completedAt && 
                `Completed: ${new Date(hotlist.completedAt).toLocaleDateString()}`
              }
              {hotlist.status === 'draft' && 
                `Created: ${new Date(hotlist.createdAt).toLocaleDateString()}`
              }
            </span>
          </div>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hotlist Management</h1>
          <p className="text-muted-foreground">
            Create, schedule, and track performance of candidate hotlists
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleViewTemplates}>
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
          {analyticsPermissions.canView && (
            <Button variant="outline" onClick={handleViewAnalytics}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          )}
          {hotlistPermissions.canCreate && (
            <Button onClick={handleCreateHotlist}>
              <Plus className="h-4 w-4 mr-2" />
              Create Hotlist
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="p-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hotlists</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidates Sent</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.totalCandidates}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responses</CardTitle>
            <Send className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalResponses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.responseRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placements</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalPlacements}</div>
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex-1 p-6">
        <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search hotlists..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="sent">Sent</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={scheduleFilter} onValueChange={setScheduleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schedules</SelectItem>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi_weekly">Bi-Weekly</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'cards' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('cards')}
              >
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Table
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Hotlists ({filteredHotlists.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredHotlists.map(renderHotlistCard)}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Batch Size</TableHead>
                  <TableHead>Response Rate</TableHead>
                  <TableHead>Placements</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHotlists.map((hotlist) => {
                  const status = statusConfig[hotlist.status as keyof typeof statusConfig];
                  const schedule = scheduleTypeConfig[hotlist.scheduleType as keyof typeof scheduleTypeConfig];
                  const responseRate = hotlist.candidates > 0 ? Math.round((hotlist.responses / hotlist.candidates) * 100) : 0;
                  
                  return (
                    <TableRow 
                      key={hotlist.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleHotlistClick(hotlist.id)}
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{hotlist.name}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{hotlist.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${status.color} text-white`}>
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span>{schedule.icon} {schedule.label}</span>
                      </TableCell>
                      <TableCell>{hotlist.batchSize}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{responseRate}%</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full">
                            <div 
                              className="h-2 bg-blue-500 rounded-full" 
                              style={{ width: `${responseRate}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">{hotlist.placements}</span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{new Date(hotlist.createdAt).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">{hotlist.createdBy}</div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default HotlistsPage;
