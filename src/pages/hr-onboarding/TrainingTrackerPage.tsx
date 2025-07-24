import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  GraduationCap,
  User,
  Calendar,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import { OnboardingTraining, TrainingFilters, TrainingStatus } from '@/types/hrOnboarding';

const TrainingTrackerPage: React.FC = () => {
  const [trainings, setTrainings] = useState<OnboardingTraining[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrainings, setSelectedTrainings] = useState<string[]>([]);
  const [filters, setFilters] = useState<TrainingFilters>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainingToDelete, setTrainingToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTrainings();
  }, [pagination.page, filters, searchTerm]);

  const loadTrainings = async () => {
    try {
      setLoading(true);
      const searchFilters = searchTerm ? { ...filters, search: searchTerm } : filters;
      const response = await hrOnboardingService.getTrainings(
        pagination.page,
        pagination.limit,
        searchFilters
      );
      setTrainings(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error loading trainings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load trainings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTraining = async (id: string) => {
    try {
      await hrOnboardingService.deleteTraining(id);
      toast({
        title: 'Success',
        description: 'Training deleted successfully',
      });
      loadTrainings();
    } catch (error) {
      console.error('Error deleting training:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete training',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setTrainingToDelete(null);
  };

  const handleStatusUpdate = async (trainingId: string, status: TrainingStatus) => {
    try {
      const updateData: any = {
        id: trainingId,
        status,
      };

      if (status === 'in-progress') {
        updateData.startDate = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completedDate = new Date().toISOString();
        updateData.completionPercentage = 100;
      }

      await hrOnboardingService.updateTraining(updateData);
      toast({
        title: 'Success',
        description: 'Training status updated successfully',
      });
      loadTrainings();
    } catch (error) {
      console.error('Error updating training status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update training status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: TrainingStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'orientation':
        return 'bg-blue-100 text-blue-800';
      case 'safety':
        return 'bg-red-100 text-red-800';
      case 'compliance':
        return 'bg-purple-100 text-purple-800';
      case 'technical':
        return 'bg-green-100 text-green-800';
      case 'soft-skills':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'online':
        return 'bg-blue-100 text-blue-800';
      case 'in-person':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-purple-100 text-purple-800';
      case 'self-paced':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: TrainingStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Play className="h-4 w-4" />;
      case 'not-started':
        return <Clock className="h-4 w-4" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const isOverdue = (dueDate: string, status: TrainingStatus) => {
    return status !== 'completed' && new Date(dueDate) < new Date();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTrainings(trainings.map(t => t.id));
    } else {
      setSelectedTrainings([]);
    }
  };

  const handleSelectTraining = (trainingId: string, checked: boolean) => {
    if (checked) {
      setSelectedTrainings(prev => [...prev, trainingId]);
    } else {
      setSelectedTrainings(prev => prev.filter(id => id !== trainingId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Training Tracker</h1>
          <p className="text-gray-600 mt-1">Monitor and manage onboarding training programs</p>
        </div>
        <Link to="/hr-onboarding/training/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Training
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trainings</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {trainings.filter(t => t.status === 'in-progress').length}
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
              {trainings.filter(t => t.status === 'completed').length}
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
              {trainings.filter(t => isOverdue(t.dueDate, t.status)).length}
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
                  placeholder="Search trainings..."
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
                status: value === 'all' ? undefined : value as TrainingStatus
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
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
                <SelectItem value="orientation">Orientation</SelectItem>
                <SelectItem value="safety">Safety</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="soft-skills">Soft Skills</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.format || 'all'}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                format: value === 'all' ? undefined : value
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In-Person</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="self-paced">Self-Paced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trainings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trainings ({pagination.total})</CardTitle>
          <CardDescription>
            Overview of all onboarding training programs
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
                      checked={selectedTrainings.length === trainings.length && trainings.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Training</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Instructor</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainings.map((training) => (
                  <TableRow key={training.id} className={isOverdue(training.dueDate, training.status) ? 'bg-red-50' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTrainings.includes(training.id)}
                        onCheckedChange={(checked) => handleSelectTraining(training.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{training.title}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {training.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{training.duration}h</span>
                          {training.required && (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(training.category)}>
                        {training.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getFormatColor(training.format)}>
                        {training.format}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span>{training.instructor}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={training.completionPercentage} className="w-16" />
                        <span className="text-sm text-gray-600">{training.completionPercentage}%</span>
                      </div>
                      {training.assessmentScore && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Award className="h-3 w-3 text-yellow-500" />
                          <span className="text-xs text-gray-500">
                            Score: {training.assessmentScore}/{training.passingScore}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={isOverdue(training.dueDate, training.status) ? 'text-red-600 font-medium' : ''}>
                          {new Date(training.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(isOverdue(training.dueDate, training.status) && training.status !== 'completed' ? 'expired' : training.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(training.status)}
                          {isOverdue(training.dueDate, training.status) && training.status !== 'completed' ? 'overdue' : training.status}
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
                          {training.status === 'not-started' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(training.id, 'in-progress')}
                            >
                              <Play className="mr-2 h-4 w-4" />
                              Start Training
                            </DropdownMenuItem>
                          )}
                          {training.status === 'in-progress' && (
                            <DropdownMenuItem
                              onClick={() => handleStatusUpdate(training.id, 'completed')}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Training
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setTrainingToDelete(training.id);
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
            <DialogTitle>Delete Training</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this training? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => trainingToDelete && handleDeleteTraining(trainingToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrainingTrackerPage;
