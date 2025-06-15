
import { useState } from 'react';
import { Calendar, MessageSquare, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { CandidateCard, Candidate } from '@/components/ui/candidate-card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Mock data for interviews
const mockInterviews = [
  {
    id: '1',
    candidate: 'Jordan Lee',
    position: 'Senior Software Engineer',
    date: '2025-04-27T14:00:00',
    status: 'upcoming',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '2',
    candidate: 'Taylor Smith',
    position: 'Frontend Developer',
    date: '2025-04-28T11:30:00',
    status: 'upcoming',
    avatarUrl: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: '3',
    candidate: 'Casey Wilson',
    position: 'UX Designer',
    date: '2025-04-25T15:00:00',
    status: 'completed',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

// Mock candidates
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jordan Lee',
    position: 'Senior Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    status: 'interview',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Taylor Smith',
    position: 'Frontend Developer',
    skills: ['React', 'CSS', 'JavaScript'],
    status: 'interview',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
];

const TeamMemberDashboard = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const filterInterviews = (status: string) => {
    return mockInterviews.filter(interview => interview.status === status);
  };

  const handleJoinInterview = (id: string) => {
    toast({
      title: "Joining Interview",
      description: `Opening Zoom meeting for interview ID: ${id}`,
    });
  };

  const handleProvideFeedback = (id: string) => {
    toast({
      title: "Provide Feedback",
      description: `Opening feedback form for interview ID: ${id}`,
    });
  };

  const handleViewCandidate = (id: string) => {
    toast({
      title: "View Candidate",
      description: `Viewing candidate profile ID: ${id}`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Team Member Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage your interviews, provide feedback, and track candidates
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatsCard
          title="Upcoming Interviews"
          value="2"
          description="Next 7 days"
          icon={<Calendar className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Pending Feedback"
          value="1"
          description="Awaiting your input"
          icon={<MessageSquare className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Your Candidates"
          value="2"
          description="Assigned to you"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* Interview Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Interview Schedule</CardTitle>
          <CardDescription>Your upcoming and past interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming">
              {filterInterviews('upcoming').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming interviews scheduled
                </div>
              ) : (
                <div className="divide-y">
                  {filterInterviews('upcoming').map(interview => (
                    <div key={interview.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img 
                            src={interview.avatarUrl} 
                            alt={interview.candidate} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{interview.candidate}</h3>
                          <p className="text-sm text-muted-foreground">{interview.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-6">
                          <p className="font-medium">
                            {new Date(interview.date).toLocaleDateString(undefined, { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(interview.date).toLocaleTimeString(undefined, { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <Button onClick={() => handleJoinInterview(interview.id)}>
                          Join Call
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              {filterInterviews('completed').length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No completed interviews
                </div>
              ) : (
                <div className="divide-y">
                  {filterInterviews('completed').map(interview => (
                    <div key={interview.id} className="py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden">
                          <img 
                            src={interview.avatarUrl} 
                            alt={interview.candidate} 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{interview.candidate}</h3>
                          <p className="text-sm text-muted-foreground">{interview.position}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right mr-6">
                          <p className="font-medium">
                            {new Date(interview.date).toLocaleDateString(undefined, { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <Badge variant="outline" className="bg-recruit-success text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" /> Completed
                          </Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => handleProvideFeedback(interview.id)}
                        >
                          Provide Feedback
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Your Candidates */}
      <Card>
        <CardHeader>
          <CardTitle>Your Candidates</CardTitle>
          <CardDescription>Candidates assigned to you for interviewing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onView={handleViewCandidate}
                actionLabel="View Details"
              />
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>Your feedback on recent interviews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            <div className="py-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Casey Wilson - UX Designer</h3>
                <Badge variant="outline" className="bg-recruit-info">April 25, 2025</Badge>
              </div>
              <p className="text-sm mb-3">
                Excellent design skills and portfolio. Strong understanding of user research and usability testing. 
                Communication skills need improvement, but technical abilities are impressive.
              </p>
              <div className="flex space-x-2 text-xs">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Recommended for Hire
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Technical: 9/10
                </Badge>
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  Communication: 7/10
                </Badge>
              </div>
            </div>
            
            <div className="py-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Alex Wong - Backend Developer</h3>
                <Badge variant="outline" className="bg-recruit-info">April 22, 2025</Badge>
              </div>
              <p className="text-sm mb-3">
                Strong technical background with excellent problem-solving skills. 
                Well-versed in distributed systems. Works well under pressure. Great culture fit.
              </p>
              <div className="flex space-x-2 text-xs">
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Recommended for Hire
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-800">
                  Technical: 8/10
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  Communication: 9/10
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamMemberDashboard;
