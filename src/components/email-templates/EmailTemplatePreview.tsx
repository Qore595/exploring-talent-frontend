import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Eye, 
  Send, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Mail,
  User,
  Building
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { EmailTemplate } from '@/types/emailTemplates';

interface EmailTemplatePreviewProps {
  template: EmailTemplate;
  className?: string;
}

interface TestVariables {
  candidateName: string;
  position: string;
  company: string;
  interviewDate: string;
  interviewTime: string;
  interviewLocation: string;
  duration: string;
  senderName: string;
  senderTitle: string;
  department: string;
  startDate: string;
  salary: string;
  benefits: string;
  responseDeadline: string;
}

const EmailTemplatePreview: React.FC<EmailTemplatePreviewProps> = ({ 
  template, 
  className = "" 
}) => {
  const { toast } = useToast();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [testEmailOpen, setTestEmailOpen] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [sending, setSending] = useState(false);
  
  const [testVariables, setTestVariables] = useState<TestVariables>({
    candidateName: 'John Doe',
    position: 'Senior Software Developer',
    company: 'QORE Technologies',
    interviewDate: 'March 15, 2024',
    interviewTime: '2:00 PM',
    interviewLocation: 'Conference Room A',
    duration: '1 hour',
    senderName: 'Jane Smith',
    senderTitle: 'HR Manager',
    department: 'Engineering',
    startDate: 'April 1, 2024',
    salary: '$85,000',
    benefits: 'Health insurance, 401k, PTO',
    responseDeadline: 'March 20, 2024',
  });

  // Replace template variables with test values
  const processTemplate = (content: string, variables: TestVariables) => {
    let processedContent = content;
    
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      processedContent = processedContent.replace(regex, value);
    });
    
    return processedContent;
  };

  const processedSubject = processTemplate(template.subject, testVariables);
  const processedContent = processTemplate(template.content, testVariables);

  // Extract variables from template
  const extractVariables = (text: string): string[] => {
    const regex = /{{(\w+)}}/g;
    const variables = new Set<string>();
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      variables.add(match[1]);
    }
    
    return Array.from(variables);
  };

  const templateVariables = [
    ...extractVariables(template.subject),
    ...extractVariables(template.content)
  ];
  const uniqueVariables = [...new Set(templateVariables)];

  const handleVariableChange = (variable: string, value: string) => {
    setTestVariables(prev => ({
      ...prev,
      [variable]: value
    }));
  };

  const handleSendTestEmail = async () => {
    if (!testEmail.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a test email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      
      // Simulate sending test email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Test Email Sent",
        description: `Test email sent to ${testEmail}`,
      });
      
      setTestEmailOpen(false);
      setTestEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test email",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const validateTemplate = () => {
    const issues = [];
    
    // Check for unresolved variables
    const unresolvedVars = uniqueVariables.filter(variable => 
      !testVariables.hasOwnProperty(variable) || !testVariables[variable as keyof TestVariables]
    );
    
    if (unresolvedVars.length > 0) {
      issues.push(`Unresolved variables: ${unresolvedVars.join(', ')}`);
    }
    
    // Check for empty content
    if (!template.content.trim()) {
      issues.push('Template content is empty');
    }
    
    // Check for empty subject
    if (!template.subject.trim()) {
      issues.push('Template subject is empty');
    }
    
    return issues;
  };

  const validationIssues = validateTemplate();
  const isValid = validationIssues.length === 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Template Validation Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div className="flex-1">
              <p className="font-medium">
                {isValid ? 'Template is ready' : 'Template has issues'}
              </p>
              {!isValid && (
                <ul className="text-sm text-muted-foreground mt-1">
                  {validationIssues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              )}
            </div>
            <Badge variant={isValid ? "default" : "destructive"}>
              {isValid ? 'Valid' : 'Issues Found'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Template Variables */}
      {uniqueVariables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Template Variables</CardTitle>
            <CardDescription>
              Set test values for template variables to preview the email
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {uniqueVariables.map((variable) => (
                <div key={variable} className="space-y-2">
                  <Label htmlFor={variable} className="capitalize">
                    {variable.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Input
                    id={variable}
                    value={testVariables[variable as keyof TestVariables] || ''}
                    onChange={(e) => handleVariableChange(variable, e.target.value)}
                    placeholder={`Enter ${variable}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview and Test Actions */}
      <div className="flex gap-4">
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              Preview Email
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Email Preview</DialogTitle>
              <DialogDescription>
                Preview how your email template will look with test data
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Email Header */}
              <div className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Subject:</span>
                </div>
                <p className="font-medium">{processedSubject}</p>
              </div>
              
              {/* Email Content */}
              <div className="border rounded-lg p-6 bg-white">
                <div className="whitespace-pre-wrap text-sm">
                  {processedContent}
                </div>
              </div>
              
              {/* Email Footer */}
              <div className="text-xs text-muted-foreground border-t pt-4">
                <p>This is a preview of the "{template.name}" email template.</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={testEmailOpen} onOpenChange={setTestEmailOpen}>
          <DialogTrigger asChild>
            <Button className="flex-1" disabled={!isValid}>
              <Send className="h-4 w-4 mr-2" />
              Send Test Email
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Test Email</DialogTitle>
              <DialogDescription>
                Send a test email using this template with the current variable values
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testEmail">Test Email Address</Label>
                <Input
                  id="testEmail"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Preview Subject</Label>
                <p className="text-sm text-muted-foreground p-2 bg-muted rounded">
                  {processedSubject}
                </p>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setTestEmailOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSendTestEmail} disabled={sending}>
                  {sending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Test
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmailTemplatePreview;
