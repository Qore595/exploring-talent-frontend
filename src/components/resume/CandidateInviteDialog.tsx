import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { Mail, Copy, Check } from "lucide-react";

interface CandidateInviteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  candidateEmail: string;
}

const CandidateInviteDialog = ({
  isOpen,
  onClose,
  candidateName,
  candidateEmail,
}: CandidateInviteDialogProps) => {
  const [email, setEmail] = useState(candidateEmail);
  const [sendCopy, setSendCopy] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // Generate a temporary password
  const tempPassword = Math.random().toString(36).slice(-8);
  
  // Generate invitation link
  const invitationLink = `${window.location.origin}/register?email=${encodeURIComponent(email)}`;
  
  const handleSendInvitation = async () => {
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSending(true);
    
    try {
      // In a real application, this would call an API to send the invitation
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${candidateName} at ${email}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
    
    toast({
      title: "Copied to Clipboard",
      description: "Invitation link has been copied to clipboard",
    });
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite Candidate</DialogTitle>
          <DialogDescription>
            Send an invitation to {candidateName} to create an account
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@example.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Invitation Link</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={invitationLink}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(invitationLink)}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Share this link with the candidate to create their account
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Temporary Password</Label>
            <div className="flex items-center space-x-2">
              <Input
                value={tempPassword}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(tempPassword)}
              >
                {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              The candidate will need to change this password after first login
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sendCopy"
              checked={sendCopy}
              onCheckedChange={(checked) => setSendCopy(checked as boolean)}
            />
            <label
              htmlFor="sendCopy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Send me a copy of the invitation
            </label>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSendInvitation}
            disabled={isSending}
            className="gap-1"
          >
            <Mail className="h-4 w-4" />
            {isSending ? "Sending..." : "Send Invitation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateInviteDialog;
