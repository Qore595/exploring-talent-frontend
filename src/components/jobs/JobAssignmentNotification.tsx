import React, { useState } from 'react';
import { UserPlus, Mail, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useNotifications } from '@/context/NotificationContext';
import { JobListing } from '@/types/jobs';
import { mockUsers } from '@/types/users';

interface JobAssignmentNotificationProps {
  job: JobListing;
  assignedUserId: string;
  assignedUserName: string;
  onComplete: () => void;
}

const JobAssignmentNotification: React.FC<JobAssignmentNotificationProps> = ({
  job,
  assignedUserId,
  assignedUserName,
  onComplete
}) => {
  const { addNotification, sendEmailNotification } = useNotifications();
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [customMessage, setCustomMessage] = useState('');
  
  // Find the assigned user's email
  const assignedUser = mockUsers.find(user => user.id === assignedUserId);
  const userEmail = assignedUser?.email || '';
  
  // Handle notification sending
  const handleSendNotification = async () => {
    // Create in-app notification
    addNotification({
      type: 'assignment',
      title: 'New Job Assignment',
      message: `You have been assigned to "${job.title}" job`,
      link: `/jobs/${job.id}`,
      jobId: job.id,
      senderId: 'user-1', // Current user ID would be used in a real app
      senderName: 'Admin', // Current user name would be used in a real app
      recipientId: assignedUserId,
      metadata: {
        jobTitle: job.title,
        jobId: job.id,
        assignmentDate: new Date().toISOString()
      }
    });
    
    // Send email notification if checked
    if (sendEmail && userEmail) {
      const emailSubject = `New Job Assignment: ${job.title}`;
      const emailBody = `
        Hello ${assignedUserName},
        
        You have been assigned to the following job:
        
        Job Title: ${job.title}
        Job ID: ${job.id}
        Client: ${job.clientName || 'Internal'}
        Location: ${job.location}
        
        ${customMessage ? `\nMessage from the assigner:\n${customMessage}\n` : ''}
        
        Please log in to the TalentPulse platform to view the full job details and take appropriate action.
        
        Thank you,
        TalentPulse Team
      `;
      
      await sendEmailNotification(userEmail, emailSubject, emailBody);
    }
    
    // Close dialog and notify parent component
    setIsDialogOpen(false);
    onComplete();
  };
  
  // Handle dialog close
  const handleClose = () => {
    setIsDialogOpen(false);
    onComplete();
  };
  
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send Assignment Notification</DialogTitle>
          <DialogDescription>
            Notify {assignedUserName} about their assignment to "{job.title}"
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="sendEmail" 
                checked={sendEmail} 
                onCheckedChange={(checked) => setSendEmail(checked as boolean)} 
              />
              <div className="grid gap-1.5 leading-none">
                <Label htmlFor="sendEmail" className="text-sm font-medium">
                  Send email notification
                </Label>
                <p className="text-sm text-muted-foreground">
                  An email will be sent to {userEmail}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customMessage">Add a custom message (optional)</Label>
              <Textarea
                id="customMessage"
                placeholder="Enter any additional information or instructions..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <div className="flex items-start space-x-3">
                <UserPlus className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium">Notification Preview</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    You have been assigned to "{job.title}" job
                  </p>
                  {customMessage && (
                    <div className="mt-2 text-sm border-l-2 border-muted-foreground/20 pl-2">
                      {customMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button variant="outline" onClick={handleClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSendNotification}>
            <Mail className="h-4 w-4 mr-2" />
            Send Notification
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobAssignmentNotification;
