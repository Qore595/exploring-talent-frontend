import React, { useState } from 'react';
import { Check, X, AlertTriangle, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ApprovalRequest } from '@/types/marginCalculator';
import { formatCurrency } from '@/utils/marginCalculations';

interface ApprovalDialogProps {
  request: ApprovalRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (requestId: string, comments?: string) => Promise<void>;
  onReject: (requestId: string, comments?: string) => Promise<void>;
  canApprove?: boolean;
}

const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  request,
  open,
  onOpenChange,
  onApprove,
  onReject,
  canApprove = true,
}) => {
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleApprove = async () => {
    if (!request) return;
    
    setIsProcessing(true);
    try {
      await onApprove(request.id, comments);
      setComments('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error approving request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!request) return;
    
    setIsProcessing(true);
    try {
      await onReject(request.id, comments);
      setComments('');
      onOpenChange(false);
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'commission-override': return 'Commission Override';
      case 'vendor-commission-change': return 'Vendor Commission Change';
      default: return type;
    }
  };

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Approval Request Review</span>
          </DialogTitle>
          <DialogDescription>
            Review and process the approval request for margin calculation changes
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Request Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">{getTypeLabel(request.type)}</Badge>
              <Badge className={getPriorityColor(request.priority)}>
                {request.priority.toUpperCase()}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground">
              Submitted: {request.submittedDate}
            </div>
          </div>

          {/* Candidate Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Candidate</Label>
              <p className="text-lg font-semibold">{request.candidateName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Position</Label>
              <p className="text-lg">{request.position}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Requested By</Label>
              <p>{request.requestedBy}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Client Budget</Label>
              <p className="font-medium">{formatCurrency(request.clientBudget)}/hr</p>
            </div>
          </div>

          <Separator />

          {/* Change Details */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Requested Change</Label>
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Current Value:</span>
                <span className="font-medium">
                  {request.type.includes('commission') 
                    ? formatCurrency(request.originalValue)
                    : `${request.originalValue}%`
                  }
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Requested Value:</span>
                <span className="font-medium text-blue-600">
                  {request.type.includes('commission') 
                    ? formatCurrency(request.requestedValue)
                    : `${request.requestedValue}%`
                  }
                </span>
              </div>
              <div className="mt-2 pt-2 border-t">
                <span className="text-sm text-muted-foreground">Change:</span>
                <span className={`font-medium ml-2 ${
                  request.requestedValue > request.originalValue 
                    ? 'text-red-600' 
                    : 'text-green-600'
                }`}>
                  {request.requestedValue > request.originalValue ? '+' : ''}
                  {request.type.includes('commission') 
                    ? formatCurrency(request.requestedValue - request.originalValue)
                    : `${(request.requestedValue - request.originalValue).toFixed(1)}%`
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Reason for Request</Label>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm">{request.reason}</p>
            </div>
          </div>

          {/* Impact Analysis */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Impact Analysis</Label>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Financial Impact:</span>
                  <p className="font-medium">
                    {request.type === 'commission-override' 
                      ? `${formatCurrency(Math.abs(request.requestedValue - request.originalValue))} ${request.requestedValue > request.originalValue ? 'cost increase' : 'cost decrease'}`
                      : `${Math.abs(request.requestedValue - request.originalValue).toFixed(1)}% margin ${request.requestedValue > request.originalValue ? 'increase' : 'decrease'}`
                    }
                  </p>
                </div>
                <div>
                  <span className="text-blue-700">Risk Level:</span>
                  <p className="font-medium capitalize">{request.priority}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments */}
          {canApprove && (
            <div>
              <Label htmlFor="comments" className="text-sm font-medium">
                Comments (Optional)
              </Label>
              <Textarea
                id="comments"
                placeholder="Add any comments about your decision..."
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              <Eye className="h-4 w-4 mr-2" />
              Close
            </Button>
          </div>
          
          {canApprove && (
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isProcessing}
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApprovalDialog;
