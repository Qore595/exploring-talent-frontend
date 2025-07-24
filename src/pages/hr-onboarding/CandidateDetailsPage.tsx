import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { hrOnboardingService } from '@/services/hrOnboardingService';
import { OnboardingCandidate, OnboardingTask, OnboardingDocument, OnboardingTraining } from '@/types/hrOnboarding';

const CandidateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [candidate, setCandidate] = useState<OnboardingCandidate | null>(null);
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [documents, setDocuments] = useState<OnboardingDocument[]>([]);
  const [trainings, setTrainings] = useState<OnboardingTraining[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadCandidateDetails();
    }
  }, [id]);

  const loadCandidateDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const [candidateResponse, tasksResponse, documentsResponse, trainingsResponse] = await Promise.all([
        hrOnboardingService.getCandidateById(id),
        hrOnboardingService.getTasks(1, 100, { candidateId: id }),
        hrOnboardingService.getDocuments(1, 100, { candidateId: id }),
        hrOnboardingService.getTrainings(1, 100, { candidateId: id }),
      ]);

      setCandidate(candidateResponse.data);
      setTasks(tasksResponse.data);
      setDocuments(documentsResponse.data);
      setTrainings(trainingsResponse.data);
    } catch (error) {
      console.error('Error loading candidate details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load candidate details',
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

  const getStatusIcon = (status: string) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Candidate not found</p>
        <Button onClick={() => navigate('/hr-onboarding/candidates')} className="mt-4">
          Back to Candidates
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/hr-onboarding/candidates')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-lg">
                {candidate.firstName[0]}{candidate.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {candidate.firstName} {candidate.lastName}
              </h1>
              <p className="text-gray-600">{candidate.position} • {candidate.department}</p>
            </div>
          </div>
        </div>
        <Link to={`/hr-onboarding/candidates/${candidate.id}/edit`}>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Candidate
          </Button>
        </Link>
      </div>

      {/* Status Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge className={getStatusColor(candidate.status)}>
                <span className="flex items-center gap-1">
                  {getStatusIcon(candidate.status)}
                  {candidate.status}
                </span>
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <Progress value={candidate.progress} className="w-32" />
                <span className="text-sm font-medium">{candidate.progress}%</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-medium">{new Date(candidate.startDate).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{candidate.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{candidate.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{candidate.location}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Employment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Briefcase className="h-4 w-4 text-gray-400" />
              <span>{candidate.position}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-400" />
              <span>{candidate.manager}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{candidate.employmentType}</span>
            </div>
            {candidate.salary && (
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>${candidate.salary.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="tasks" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" />
            Tasks ({tasks.length})
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents ({documents.length})
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Training ({trainings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Tasks</CardTitle>
              <CardDescription>Tasks assigned to this candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <p className="text-sm text-gray-500">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{task.category}</Badge>
                        <Badge variant="outline">{task.priority}</Badge>
                        <span className="text-xs text-gray-500">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(task.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        {task.status}
                      </span>
                    </Badge>
                  </div>
                ))}
                {tasks.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No tasks assigned yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>Documents needed for onboarding</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((document) => (
                  <div key={document.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{document.name}</h4>
                      <p className="text-sm text-gray-500">{document.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{document.category}</Badge>
                        {document.required && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(document.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(document.status)}
                        {document.status}
                      </span>
                    </Badge>
                  </div>
                ))}
                {documents.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No documents required yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training">
          <Card>
            <CardHeader>
              <CardTitle>Training Programs</CardTitle>
              <CardDescription>Training assigned to this candidate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainings.map((training) => (
                  <div key={training.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{training.title}</h4>
                      <p className="text-sm text-gray-500">{training.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{training.category}</Badge>
                        <Badge variant="outline">{training.format}</Badge>
                        {training.required && (
                          <Badge variant="destructive">Required</Badge>
                        )}
                        <span className="text-xs text-gray-500">
                          Due: {new Date(training.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Progress value={training.completionPercentage} className="w-24" />
                        <span className="text-xs text-gray-500">{training.completionPercentage}%</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(training.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(training.status)}
                        {training.status}
                      </span>
                    </Badge>
                  </div>
                ))}
                {trainings.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No training assigned yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDetailsPage;
