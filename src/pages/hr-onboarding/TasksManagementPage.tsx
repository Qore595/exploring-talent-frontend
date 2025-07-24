import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Tag,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { hrOnboardingService } from '@/services/hrOnboardingService';
import { OnboardingTask, TaskFilters, TaskStatus, Priority } from '@/types/hrOnboarding';

const TasksManagementPage: React.FC = () => {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, [pagination.page, filters, searchTerm]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const searchFilters = searchTerm ? { ...filters, search: searchTerm } : filters;
      const response = await hrOnboardingService.getTasks(
        pagination.page,
        pagination.limit,
        searchFilters
      );
      setTasks(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await hrOnboardingService.deleteTask(id);
      toast({
        title: 'Success',
        description: 'Task deleted successfully',
      });
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleBulkAssign = async (assignedTo: string) => {
    if (selectedTasks.length === 0) return;

    try {
      await hrOnboardingService.bulkAssignTasks(selectedTasks, assignedTo);
      toast({
        title: 'Success',
        description: `${selectedTasks.length} tasks assigned successfully`,
      });
      setSelectedTasks([]);
      loadTasks();
    } catch (error) {
      console.error('Error assigning tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to assign tasks',
        variant: 'destructive',
      });
    }
  };

  const handleStatusUpdate = async (taskId: string, status: TaskStatus) => {
    try {
      await hrOnboardingService.updateTask({
        id: taskId,
        status,
        completedDate: status === 'completed' ? new Date().toISOString() : undefined,
      });
      toast({
        title: 'Success',
        description: 'Task status updated successfully',
      });
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'documentation':
        return 'bg-blue-100 text-blue-800';
      case 'training':
        return 'bg-purple-100 text-purple-800';
      case 'setup':
        return 'bg-green-100 text-green-800';
      case 'meeting':
        return 'bg-orange-100 text-orange-800';
      case 'compliance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: string, status: TaskStatus) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTasks(tasks.map(t => t.id));
    } else {
      setSelectedTasks([]);
    }
  };

  const handleSelectTask = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedTasks(prev => [...prev, taskId]);
    } else {
      setSelectedTasks(prev => prev.filter(id => id !== taskId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
          <p className="text-gray-600 mt-1">Manage onboarding tasks and workflows</p>
        </div>
        <Link to="/hr-onboarding/tasks/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Task
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {tasks.filter(t => t.status === 'in-progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {tasks.filter(t => t.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {tasks.filter(t => isOverdue(t.dueDate, t.status)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                status: value === 'all' ? undefined : value as TaskStatus
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                category: value === 'all' ? undefined : value
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="documentation">Documentation</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="setup">Setup</SelectItem>
                <SelectItem value="meeting">Meeting</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.priority || 'all'}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                priority: value === 'all' ? undefined : value as Priority
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedTasks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedTasks.length} task(s) selected
              </p>
              <div className="flex gap-2">
                <Select onValueChange={handleBulkAssign}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Assign to..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr-1">HR Assistant</SelectItem>
                    <SelectItem value="hr-2">HR Specialist</SelectItem>
                    <SelectItem value="it-1">IT Support</SelectItem>
                    <SelectItem value="mgr-1">Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tasks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks ({pagination.total})</CardTitle>
          <CardDescription>
            Overview of all onboarding tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTasks.length === tasks.length && tasks.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className={isOverdue(task.dueDate, task.status) ? 'bg-red-50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTasks.includes(task.id)}
                        onCheckedChange={(checked) => handleSelectTask(task.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{task.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {task.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(task.category)}>
                        {task.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{task.assignedToName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={isOverdue(task.dueDate, task.status) ? 'text-red-600 font-medium' : ''}>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(isOverdue(task.dueDate, task.status) ? 'overdue' : task.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(task.status)}
                          {isOverdue(task.dueDate, task.status) ? 'overdue' : task.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          {task.status !== 'completed' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(task.id, 'completed')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Task
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setTaskToDelete(task.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => taskToDelete && handleDeleteTask(taskToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TasksManagementPage;
