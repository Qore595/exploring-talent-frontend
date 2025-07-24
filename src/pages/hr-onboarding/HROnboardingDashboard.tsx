import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  GraduationCap,
  TrendingUp,
  Calendar,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { hrOnboardingService } from '@/services/hrOnboardingService';
import { OnboardingDashboardData } from '@/types/hrOnboarding';

const HROnboardingDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<OnboardingDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await hrOnboardingService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load dashboard data</p>
        <Button onClick={loadDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const { stats, recentCandidates, upcomingTasks, pendingDocuments, overdueTrainings } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Onboarding Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and track employee onboarding processes</p>
        </div>
        <div className="flex gap-3">
          <Link to="/hr-onboarding/candidates/create">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Candidate
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeCandidates} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <Progress value={stats.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageCompletionTime}</div>
            <p className="text-xs text-muted-foreground">
              days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Candidates */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Candidates</CardTitle>
              <CardDescription>Latest onboarding candidates</CardDescription>
            </div>
            <Link to="/hr-onboarding/candidates">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={candidate.avatar} />
                    <AvatarFallback>
                      {candidate.firstName[0]}{candidate.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {candidate.firstName} {candidate.lastName}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {candidate.position} • {candidate.department}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(candidate.status)}>
                      {candidate.status}
                    </Badge>
                    <div className="text-right">
                      <p className="text-sm font-medium">{candidate.progress}%</p>
                      <Progress value={candidate.progress} className="w-16 h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Tasks</CardTitle>
              <CardDescription>Tasks due soon</CardDescription>
            </div>
            <Link to="/hr-onboarding/tasks">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      Assigned to {task.assignedToName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Documents */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pending Documents</CardTitle>
              <CardDescription>Documents awaiting review</CardDescription>
            </div>
            <Link to="/hr-onboarding/documents">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingDocuments.map((document) => (
                <div key={document.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {document.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {document.category}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(document.status)}>
                    {document.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Overdue Trainings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Overdue Trainings</CardTitle>
              <CardDescription>Training sessions past due</CardDescription>
            </div>
            <Link to="/hr-onboarding/training">
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overdueTrainings.map((training) => (
                <div key={training.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GraduationCap className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {training.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {training.instructor}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-red-100 text-red-800">
                      Overdue
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      Due {new Date(training.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HROnboardingDashboard;
