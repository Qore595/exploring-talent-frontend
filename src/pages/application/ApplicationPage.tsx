
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

// Mock application data
const applicationData = {
  id: '12345',
  position: 'Senior Software Engineer',
  company: 'Tech Innovations Inc.',
  location: 'Remote',
  salary: '$100,000 - $130,000',
  status: 'screening',
  progress: 25,
  appliedDate: '2025-04-15',
  jobDescription: `
    We are seeking an experienced Senior Software Engineer to join our team. The ideal candidate has strong experience with:

    • 5+ years of experience with React, TypeScript, and Node.js
    • Experience with cloud platforms like AWS or Azure
    • Strong problem-solving abilities and communication skills
    • Experience with CI/CD pipelines and DevOps practices
    • Ability to mentor junior developers

    This role offers competitive compensation, remote work flexibility, and opportunities for professional growth.
  `,
  nextStep: 'Complete TalentPulse Screening',
  screeningLink: 'https://screening.talentspark.com/abc123',
  screeningDeadline: '2025-04-30'
};

const ApplicationPage = () => {
  const { user } = useAuth();

  const handleStartScreening = () => {
    toast({
      title: "Starting Screening",
      description: "Redirecting to TalentPulse screening process",
    });
    window.open(applicationData.screeningLink, '_blank');
  };

  // Status steps for visualization
  const statusSteps = [
    { label: 'Applied', completed: true, current: false },
    { label: 'Screening', completed: false, current: true },
    { label: 'Interview', completed: false, current: false },
    { label: 'Offer', completed: false, current: false },
    { label: 'Hired', completed: false, current: false }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">{applicationData.position}</h1>
        <div className="flex items-center mt-2 text-muted-foreground">
          <span>{applicationData.company}</span>
          <span className="mx-2">•</span>
          <span>{applicationData.location}</span>
          <span className="mx-2">•</span>
          <span>Applied: {new Date(applicationData.appliedDate).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Application Status */}
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Track your application progress</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{applicationData.progress}%</span>
            </div>
            <Progress value={applicationData.progress} className="h-2" />
          </div>

          {/* Status Steps */}
          <div className="flex justify-between items-center mb-8">
            {statusSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center mb-2
                  ${step.completed ? 'bg-green-100 text-green-800' :
                    step.current ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' :
                    'bg-muted text-muted-foreground'}`}>
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className={`text-xs font-medium ${step.current ? 'text-blue-800' : ''}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {/* Next Steps */}
          <div className="bg-muted p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Next Step: {applicationData.nextStep}</h3>
              </div>
              <Badge>Action Required</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete your AI screening by {new Date(applicationData.screeningDeadline).toLocaleDateString()}
            </p>
            <Button className="mt-4" onClick={handleStartScreening}>
              Start Screening <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Details */}
      <Card>
        <CardHeader>
          <CardTitle>Job Details</CardTitle>
          <CardDescription>Information about the position you applied for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
              <p>{applicationData.position}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
              <p>{applicationData.company}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
              <p>{applicationData.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Salary Range</h3>
              <p>{applicationData.salary}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Job Description</h3>
            <div className="bg-muted p-4 rounded-md whitespace-pre-line">
              {applicationData.jobDescription}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Application Questions */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>Add any other information relevant to your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information you'd like the hiring team to know..."
                rows={5}
              />
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => {
                toast({
                  title: "Information Saved",
                  description: "Your additional information has been saved",
                });
              }}>
                Save Information
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationPage;
