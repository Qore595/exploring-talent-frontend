import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Mail, 
  Users, 
  FileText, 
  Files, 
  X, 
  Plus,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  GroupEmailData, 
  EmailRecipient, 
  SendEmailRequest 
} from '@/types/documentation';
import emailService from '@/services/emailService';

interface EmailGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  groupName: string;
}

const EmailGroupDialog: React.FC<EmailGroupDialogProps> = ({
  open,
  onOpenChange,
  groupId,
  groupName
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailData, setEmailData] = useState<GroupEmailData | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [customEmails, setCustomEmails] = useState<string>('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [includeTemplates, setIncludeTemplates] = useState(true);
  const [includeDocuments, setIncludeDocuments] = useState(true);
  const [recipientFilter, setRecipientFilter] = useState<string>('all');

  useEffect(() => {
    if (open && groupId) {
      fetchEmailData();
    }
  }, [open, groupId]);

  const fetchEmailData = async () => {
    try {
      setLoading(true);
      const data = await emailService.generateEmailContent(groupId);
      setEmailData(data);
      setSubject(data.subject);
      setMessage(data.message);
      
      // Auto-select suggested recipients based on group category
      const suggested = await emailService.getSuggestedRecipients(data.groupCategory);
      setSelectedRecipients(suggested.map(r => r.email));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load email data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecipientToggle = (email: string, checked: boolean) => {
    setSelectedRecipients(prev => 
      checked 
        ? [...prev, email]
        : prev.filter(e => e !== email)
    );
  };

  const handleCustomEmailsChange = (value: string) => {
    setCustomEmails(value);
  };

  const getCustomEmailsList = (): string[] => {
    return customEmails
      .split(/[,;\n]/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
  };

  const getAllRecipients = (): string[] => {
    const customEmailsList = getCustomEmailsList();
    return [...new Set([...selectedRecipients, ...customEmailsList])];
  };

  const validateEmails = (): { valid: string[]; invalid: string[] } => {
    const allRecipients = getAllRecipients();
    return emailService.validateEmailAddresses(allRecipients);
  };

  const handleSendEmail = async () => {
    const { valid, invalid } = validateEmails();
    
    if (invalid.length > 0) {
      toast({
        title: 'Invalid Email Addresses',
        description: `Please fix these email addresses: ${invalid.join(', ')}`,
        variant: 'destructive',
      });
      return;
    }

    if (valid.length === 0) {
      toast({
        title: 'No Recipients',
        description: 'Please select at least one recipient',
        variant: 'destructive',
      });
      return;
    }

    if (!subject.trim()) {
      toast({
        title: 'Missing Subject',
        description: 'Please enter an email subject',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSending(true);
      
      const attachmentIds = [
        ...(includeTemplates ? emailData?.templates.map(t => t.id) || [] : []),
        ...(includeDocuments ? emailData?.documents.map(d => d.id) || [] : [])
      ];

      const emailRequest: SendEmailRequest = {
        groupId,
        recipients: valid,
        subject: subject.trim(),
        message: message.trim(),
        includeTemplates,
        includeDocuments,
        attachmentIds
      };

      const response = await emailService.sendGroupEmail(emailRequest);
      
      toast({
        title: 'Email Sent Successfully',
        description: response.message,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Failed to Send Email',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  const getFilteredRecipients = (): EmailRecipient[] => {
    if (!emailData) return [];
    
    switch (recipientFilter) {
      case 'hr':
        return emailData.recipients.filter(r => r.department === 'Human Resources');
      case 'legal':
        return emailData.recipients.filter(r => r.department === 'Legal');
      case 'operations':
        return emailData.recipients.filter(r => r.department === 'Operations');
      case 'development':
        return emailData.recipients.filter(r => r.department === 'Development');
      case 'marketing':
        return emailData.recipients.filter(r => r.department === 'Marketing');
      default:
        return emailData.recipients;
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading email data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Send Email - {groupName}
          </DialogTitle>
          <DialogDescription>
            Compose and send an email with the documents from this group
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Recipients Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Recipients
                </Label>
                <Select value={recipientFilter} onValueChange={setRecipientFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-32 overflow-y-auto border rounded-lg p-3">
                {getFilteredRecipients().map((recipient) => (
                  <div key={recipient.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`recipient-${recipient.id}`}
                      checked={selectedRecipients.includes(recipient.email)}
                      onCheckedChange={(checked) => 
                        handleRecipientToggle(recipient.email, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`recipient-${recipient.id}`}
                      className="text-sm cursor-pointer flex-1"
                    >
                      <div>
                        <p className="font-medium">{recipient.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {recipient.email} • {recipient.role}
                        </p>
                      </div>
                    </Label>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customEmails">Additional Email Addresses</Label>
                <Textarea
                  id="customEmails"
                  placeholder="Enter additional email addresses (separated by commas, semicolons, or new lines)"
                  value={customEmails}
                  onChange={(e) => handleCustomEmailsChange(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {getAllRecipients().map((email) => (
                  <Badge key={email} variant="secondary" className="text-xs">
                    {email}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Email Content Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Email Content</Label>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter email message"
                  rows={6}
                />
              </div>
            </div>

            <Separator />

            {/* Attachments Section */}
            <div className="space-y-4">
              <Label className="text-base font-medium">Attachments</Label>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeTemplates"
                    checked={includeTemplates}
                    onCheckedChange={setIncludeTemplates}
                  />
                  <Label htmlFor="includeTemplates" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Include Document Templates ({emailData?.templates.length || 0})
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDocuments"
                    checked={includeDocuments}
                    onCheckedChange={setIncludeDocuments}
                  />
                  <Label htmlFor="includeDocuments" className="flex items-center gap-2">
                    <Files className="h-4 w-4" />
                    Include Manual Documents ({emailData?.documents.length || 0})
                  </Label>
                </div>
              </div>

              {(includeTemplates || includeDocuments) && (
                <div className="bg-muted/30 p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    The following items will be attached:
                  </p>
                  <div className="space-y-1">
                    {includeTemplates && emailData?.templates.map((template) => (
                      <div key={template.id} className="flex items-center gap-2 text-sm">
                        <FileText className="h-3 w-3" />
                        {template.name}
                      </div>
                    ))}
                    {includeDocuments && emailData?.documents.map((document) => (
                      <div key={document.id} className="flex items-center gap-2 text-sm">
                        <Files className="h-3 w-3" />
                        {document.name} ({document.fileName})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSendEmail} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Email
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailGroupDialog;
