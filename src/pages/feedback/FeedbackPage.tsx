import { useState } from 'react';
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Star, 
  Filter, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  Edit, 
  Trash2 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';

// Mock feedback data
const mockFeedback = [
  {
    id: '1',
    candidateName: 'Jordan Lee',
    candidatePosition: 'Senior Software Engineer',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Technical Interview',
    interviewDate: '2023-06-05T14:00:00',
    submittedDate: '2023-06-05T16:30:00',
    status: 'completed',
    rating: 4,
    strengths: [
      'Strong problem-solving skills',
      'Excellent knowledge of React and TypeScript',
      'Good communication skills'
    ],
    weaknesses: [
      'Limited experience with backend technologies',
      'Could improve system design knowledge'
    ],
    notes: 'Overall, a strong candidate with excellent frontend skills. Would be a good addition to the team.',
    recommendation: 'hire',
    author: {
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    }
  },
  {
    id: '2',
    candidateName: 'Taylor Smith',
    candidatePosition: 'Product Manager',
    candidateAvatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Behavioral Interview',
    interviewDate: '2023-06-08T10:00:00',
    submittedDate: '2023-06-08T11:45:00',
    status: 'completed',
    rating: 5,
    strengths: [
      'Excellent product sense',
      'Strong leadership skills',
      'Great communication and stakeholder management'
    ],
    weaknesses: [
      'Could improve technical knowledge'
    ],
    notes: 'Exceptional candidate with strong product management skills. Would be a great addition to the team.',
    recommendation: 'hire',
    author: {
      name: 'Morgan Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    }
  },
  {
    id: '3',
    candidateName: 'Casey Wilson',
    candidatePosition: 'UX Designer',
    candidateAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Portfolio Review',
    interviewDate: '2023-06-10T13:00:00',
    submittedDate: null,
    status: 'pending',
    rating: null,
    strengths: [],
    weaknesses: [],
    notes: '',
    recommendation: null,
    author: {
      name: 'Jamie Garcia',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    }
  }
];

// Mock pending interviews
const mockPendingInterviews = [
  {
    id: 'int-1',
    candidateName: 'Casey Wilson',
    candidatePosition: 'UX Designer',
    candidateAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Portfolio Review',
    interviewDate: '2023-06-10T13:00:00',
    status: 'completed',
    feedbackStatus: 'pending'
  },
  {
    id: 'int-2',
    candidateName: 'Robin Taylor',
    candidatePosition: 'Frontend Developer',
    candidateAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'Technical Interview',
    interviewDate: '2023-06-12T15:00:00',
    status: 'scheduled',
    feedbackStatus: 'not_started'
  }
];

const FeedbackPage = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 3,
    strengths: '',
    weaknesses: '',
    notes: '',
    recommendation: 'consider'
  });

  const filteredFeedback = mockFeedback.filter(feedback => {
    // Filter by search term
    if (searchTerm && !feedback.candidateName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by status
    if (statusFilter !== 'all' && feedback.status !== statusFilter) {
      return false;
    }
    
    return true;
  });

  const handleOpenFeedbackForm = (interview) => {
    setSelectedInterview(interview);
    setFeedbackForm({
      rating: 3,
      strengths: '',
      weaknesses: '',
      notes: '',
      recommendation: 'consider'
    });
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackForm.notes.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide feedback notes",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Feedback Submitted",
      description: `Your feedback for ${selectedInterview.candidateName} has been submitted`,
    });

    setShowFeedbackForm(false);
  };

  const handleEditFeedback = (id) => {
    const feedback = mockFeedback.find(f => f.id === id);
    
    if (!feedback) return;
    
    toast({
      title: "Edit Feedback",
      description: `Opening feedback editor for ${feedback.candidateName}`,
    });
  };

  const handleDeleteFeedback = (id) => {
    const feedback = mockFeedback.find(f => f.id === id);
    
    if (!feedback) return;
    
    toast({
      title: "Delete Feedback",
      description: `This would delete the feedback for ${feedback.candidateName}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Interview Feedback</h1>
          <p className="text-muted-foreground mt-2">
            Manage and submit feedback for candidate interviews
          </p>
        </div>
      </div>

      {/* Feedback Form Dialog */}
      <Dialog open={showFeedbackForm} onOpenChange={setShowFeedbackForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Submit Interview Feedback</DialogTitle>
            <DialogDescription>
              {selectedInterview && (
                <div className="flex items-center mt-2">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={selectedInterview.candidateAvatar} alt={selectedInterview.candidateName} />
                    <AvatarFallback>{selectedInterview.candidateName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedInterview.candidateName}</p>
                    <p className="text-xs text-muted-foreground">{selectedInterview.candidatePosition}</p>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Overall Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    variant={feedbackForm.rating === rating ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFeedbackForm({ ...feedbackForm, rating })}
                    className="w-10 h-10 p-0"
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="strengths">Strengths</Label>
              <Textarea
                id="strengths"
                placeholder="List candidate's strengths..."
                value={feedbackForm.strengths}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, strengths: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weaknesses">Areas for Improvement</Label>
              <Textarea
                id="weaknesses"
                placeholder="List areas where the candidate could improve..."
                value={feedbackForm.weaknesses}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, weaknesses: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Overall Assessment</Label>
              <Textarea
                id="notes"
                placeholder="Provide your overall assessment of the candidate..."
                value={feedbackForm.notes}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, notes: e.target.value })}
                className="min-h-[100px]"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recommendation">Recommendation</Label>
              <Select
                value={feedbackForm.recommendation}
                onValueChange={(value) => setFeedbackForm({ ...feedbackForm, recommendation: value })}
              >
                <SelectTrigger id="recommendation">
                  <SelectValue placeholder="Select your recommendation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hire">Hire</SelectItem>
                  <SelectItem value="consider">Consider</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFeedback}>
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="w-full sm:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <span>
                  {statusFilter === 'all' ? 'All Status' : 
                   statusFilter === 'completed' ? 'Completed' : 'Pending'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-2" />
            Pending Feedback
          </TabsTrigger>
          <TabsTrigger value="submitted">
            <CheckCircle className="h-4 w-4 mr-2" />
            Submitted Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {mockPendingInterviews.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Pending Feedback</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    You don't have any interviews that need feedback at the moment.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {mockPendingInterviews.map((interview) => (
                <Card key={interview.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={interview.candidateAvatar} alt={interview.candidateName} />
                          <AvatarFallback>{interview.candidateName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{interview.candidateName}</h3>
                          <p className="text-sm text-muted-foreground">{interview.candidatePosition}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end">
                        <div className="flex items-center mb-2">
                          <Badge className={
                            interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }>
                            {interview.status === 'scheduled' ? 'Scheduled' : 'Completed'}
                          </Badge>
                          <span className="mx-2">•</span>
                          <span className="text-sm text-muted-foreground">
                            {interview.interviewType}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>
                            {new Date(interview.interviewDate).toLocaleDateString()} at {new Date(interview.interviewDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <Button 
                          onClick={() => handleOpenFeedbackForm(interview)}
                          disabled={interview.status === 'scheduled'}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {interview.feedbackStatus === 'pending' ? 'Complete Feedback' : 'Provide Feedback'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          {filteredFeedback.length === 0 ? (
            <Card>
              <CardContent className="py-10">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Feedback Found</h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    No feedback matches your current filters. Try adjusting your search or filters.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredFeedback.filter(f => f.status === 'completed').map((feedback) => (
                <Card key={feedback.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-4">
                          <AvatarImage src={feedback.candidateAvatar} alt={feedback.candidateName} />
                          <AvatarFallback>{feedback.candidateName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{feedback.candidateName}</CardTitle>
                          <CardDescription>{feedback.candidatePosition}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge className={
                          feedback.recommendation === 'hire' ? 'bg-green-100 text-green-800' :
                          feedback.recommendation === 'consider' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {feedback.recommendation === 'hire' ? 'Hire' :
                           feedback.recommendation === 'consider' ? 'Consider' : 'Reject'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Interview Details</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              {new Date(feedback.interviewDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {feedback.interviewType} • Submitted on {new Date(feedback.submittedDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Overall Rating</h4>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <Star
                              key={rating}
                              className={`h-5 w-5 ${rating <= feedback.rating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground'}`}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Strengths</h4>
                          <ul className="text-sm space-y-1 list-disc pl-5">
                            {feedback.strengths.map((strength, i) => (
                              <li key={i}>{strength}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
                          <ul className="text-sm space-y-1 list-disc pl-5">
                            {feedback.weaknesses.map((weakness, i) => (
                              <li key={i}>{weakness}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Overall Assessment</h4>
                        <p className="text-sm">{feedback.notes}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/50 flex justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={feedback.author.avatar} alt={feedback.author.name} />
                        <AvatarFallback>{feedback.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>Feedback by {feedback.author.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditFeedback(feedback.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteFeedback(feedback.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedbackPage;
