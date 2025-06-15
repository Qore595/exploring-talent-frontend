
import { CheckCircle, Clock, FileQuestion, CalendarCheck, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

// Mock data for application status
const applicationStatus = {
  currentStage: 'interview',
  progress: 60,
  position: 'Senior Software Engineer',
  company: 'Tech Innovations Inc.',
  stages: [
    { name: 'Application', status: 'completed', date: '2025-04-15' },
    { name: 'Screening', status: 'completed', date: '2025-04-20' },
    { name: 'Interview', status: 'current', date: '2025-04-28' },
    { name: 'Technical Assessment', status: 'pending', date: null },
    { name: 'Offer', status: 'pending', date: null }
  ]
};

// Mock upcoming events
const upcomingEvents = [
  {
    id: '1',
    title: 'Technical Interview',
    date: '2025-04-28T14:00:00',
    type: 'interview',
    description: 'Technical interview with the engineering team',
    meetingLink: 'https://zoom.us/j/123456789'
  }
];

const ApplicantDashboard = () => {
  // Handle joining meeting
  const handleJoinMeeting = (link: string) => {
    toast({
      title: "Joining Meeting",
      description: "Opening Zoom meeting link",
    });
    window.open(link, '_blank');
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'current':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" /> In Progress</Badge>;
      case 'pending':
      default:
        return <Badge variant="outline"><FileQuestion className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Your Application</h1>
        <p className="text-muted-foreground mt-2">
          Track your application progress and upcoming events
        </p>
      </div>

      {/* Application Status Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-recruit-primary to-recruit-secondary text-white">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">{applicationStatus.position}</CardTitle>
              <CardDescription className="text-white/90">
                {applicationStatus.company}
              </CardDescription>
            </div>
            {applicationStatus.currentStage === 'interview' && (
              <Badge className="bg-white text-recruit-secondary">Interview Stage</Badge>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Application Progress</span>
              <span>{applicationStatus.progress}%</span>
            </div>
            <Progress value={applicationStatus.progress} className="h-2" />
          </div>
          
          {/* Application Timeline */}
          <div className="space-y-6">
            {applicationStatus.stages.map((stage, index) => (
              <div key={index} className="flex">
                <div className="mr-4 relative">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center
                    ${stage.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      stage.status === 'current' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'}`}>
                    {stage.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  {index < applicationStatus.stages.length - 1 && (
                    <div className={`absolute top-8 bottom-0 left-1/2 w-0.5 h-10 -ml-px
                      ${stage.status === 'completed' ? 'bg-green-200' : 'bg-gray-200'}`} />
                  )}
                </div>
                
                <div className="pb-8">
                  <div className="flex items-center">
                    <h3 className="font-medium">{stage.name}</h3>
                    <div className="ml-3">
                      {getStatusBadge(stage.status)}
                    </div>
                  </div>
                  
                  {stage.date && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {stage.status === 'current' ? 'Scheduled for: ' : ''}
                      {new Date(stage.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  )}
                  
                  {stage.status === 'current' && stage.name === 'Interview' && (
                    <div className="mt-3">
                      <Button 
                        size="sm"
                        onClick={() => handleJoinMeeting(upcomingEvents[0].meetingLink)}
                      >
                        <CalendarCheck className="mr-2 h-4 w-4" />
                        Prepare for Interview
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
          <CardDescription>Your scheduled interviews and assessments</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming events scheduled
            </div>
          ) : (
            <div className="divide-y">
              {upcomingEvents.map(event => (
                <div key={event.id} className="py-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <CalendarCheck className="h-5 w-5 text-primary mr-2" />
                      <h3 className="font-medium">{event.title}</h3>
                    </div>
                    <div className="mt-1">
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      <p className="text-sm font-medium mt-1">
                        {new Date(event.date).toLocaleDateString(undefined, { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })} at {new Date(event.date).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => handleJoinMeeting(event.meetingLink)}>
                    Join Meeting
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assessment Results */}
      <Card>
        <CardHeader>
          <CardTitle>AI Screening Results</CardTitle>
          <CardDescription>Your performance in the AI screening phase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Screening Completed</h3>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" /> Passed
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Technical Skills</span>
                  <span className="text-sm font-medium">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Communication</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Problem Solving</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>
            
            <div className="mt-6 bg-white p-4 rounded-md border">
              <h4 className="font-medium mb-2">Feedback Highlights:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Award className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>Excellent technical knowledge in React and TypeScript</span>
                </li>
                <li className="flex items-start">
                  <Award className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>Clear communication style with concise explanations</span>
                </li>
                <li className="flex items-start">
                  <Award className="h-4 w-4 text-primary mr-2 mt-0.5" />
                  <span>Good problem-solving approach for complex scenarios</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicantDashboard;
