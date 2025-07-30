import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Send, Calendar, Users, Mail, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import SubjectBuilder from '@/components/hotlists/SubjectBuilder';
import SchedulingInterface from '@/components/hotlists/SchedulingInterface';
import CandidatePreviewCards from '@/components/hotlists/CandidatePreviewCards';
import { ScheduleType, ScheduleConfig, CandidatePreviewCard } from '@/types/hotlists';

// Mock candidate data
const mockCandidates: CandidatePreviewCard[] = [
  {
    benchResourceId: '1',
    employee: {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@company.com',
      phone: '+1 (555) 123-4567'
    },
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    experience: '5+ years',
    location: 'Remote',
    rate: '$85/hr',
    availability: '2024-02-15',
    workAuthorization: 'US Citizen',
    status: 'available'
  },
  {
    benchResourceId: '2',
    employee: {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      phone: '+1 (555) 234-5678'
    },
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL'],
    experience: '4+ years',
    location: 'Hybrid',
    rate: '$90/hr',
    availability: '2024-02-20',
    workAuthorization: 'H1B',
    status: 'available'
  },
  {
    benchResourceId: '3',
    employee: {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike.johnson@company.com',
      phone: '+1 (555) 345-6789'
    },
    skills: ['AWS', 'Kubernetes', 'Docker', 'Terraform'],
    experience: '6+ years',
    location: 'Onsite',
    rate: '$95/hr',
    availability: '2024-02-10',
    workAuthorization: 'Green Card',
    status: 'available'
  }
];

const CreateHotlistPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    batchSize: 10,
    emailTemplateId: '',
    emailContent: ''
  });
  const [subjectTemplate, setSubjectTemplate] = useState('');
  const [scheduleType, setScheduleType] = useState<ScheduleType>('immediate');
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({});
  const [autoLockEnabled, setAutoLockEnabled] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [showWorkAuthorization, setShowWorkAuthorization] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleBack = () => {
    navigate('/hotlists');
  };

  const handleSaveTemplate = (template: any) => {
    toast({
      title: "Template Saved",
      description: `Subject template "${template.name}" has been saved successfully.`,
    });
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Hotlist has been saved as draft.",
    });
  };

  const handleSchedule = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a hotlist name.",
        variant: "destructive"
      });
      return;
    }

    if (selectedCandidates.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one candidate.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Hotlist Scheduled",
      description: `Hotlist "${formData.name}" has been scheduled successfully.`,
    });
    navigate('/hotlists');
  };

  const handleSendNow = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a hotlist name.",
        variant: "destructive"
      });
      return;
    }

    if (selectedCandidates.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one candidate.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Hotlist Sent",
      description: `Hotlist "${formData.name}" has been sent to ${selectedCandidates.length} candidates.`,
    });
    navigate('/hotlists');
  };

  const steps = [
    { id: 1, title: 'Basic Information', icon: Settings },
    { id: 2, title: 'Select Candidates', icon: Users },
    { id: 3, title: 'Email Content', icon: Mail },
    { id: 4, title: 'Schedule & Send', icon: Calendar }
  ];

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
            <h1 className="text-2xl font-bold">Create New Hotlist</h1>
            <p className="text-gray-600">Create and schedule a new candidate hotlist campaign</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.id 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'border-gray-300 text-gray-400'
            }`}>
              <step.icon className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
              }`}>
                Step {step.id}
              </p>
              <p className={`text-xs ${
                currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-16 h-0.5 mx-4 ${
                currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details for your hotlist campaign
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Hotlist Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Q1 2024 Frontend Developers"
                />
              </div>
              <div>
                <Label htmlFor="batchSize">Batch Size</Label>
                <Input
                  id="batchSize"
                  type="number"
                  value={formData.batchSize}
                  onChange={(e) => setFormData(prev => ({ ...prev, batchSize: parseInt(e.target.value) }))}
                  min="1"
                  max="50"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this hotlist campaign..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <CandidatePreviewCards
          candidates={mockCandidates}
          selectedCandidates={selectedCandidates}
          onSelectionChange={setSelectedCandidates}
          batchSize={formData.batchSize}
          showWorkAuthorization={showWorkAuthorization}
          onShowWorkAuthChange={setShowWorkAuthorization}
        />
      )}

      {currentStep === 3 && (
        <div className="space-y-6">
          <SubjectBuilder
            value={subjectTemplate}
            onChange={setSubjectTemplate}
            onSaveTemplate={handleSaveTemplate}
          />
          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
              <CardDescription>
                Customize the email content for your hotlist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.emailContent}
                onChange={(e) => setFormData(prev => ({ ...prev, emailContent: e.target.value }))}
                placeholder="Enter your email content here..."
                rows={8}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === 4 && (
        <SchedulingInterface
          scheduleType={scheduleType}
          scheduleConfig={scheduleConfig}
          onScheduleTypeChange={setScheduleType}
          onScheduleConfigChange={setScheduleConfig}
          autoLockEnabled={autoLockEnabled}
          onAutoLockChange={setAutoLockEnabled}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>

        <div className="flex items-center space-x-2">
          {currentStep < 4 ? (
            <Button onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}>
              Next
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleSchedule}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button onClick={handleSendNow}>
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            </>
          )}
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHotlistPage;
