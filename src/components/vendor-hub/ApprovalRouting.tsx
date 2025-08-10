// Approval Routing Component for Workflow Integration
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Mail,
  Phone,
  Building,
  FileText,
  Settings,
  RefreshCw
} from 'lucide-react';
import { PointOfContact } from '@/types/vendor';

interface ApprovalRoute {
  id: string;
  documentType: string;
  vendorId: string;
  vendorName: string;
  primaryApprover: PointOfContact;
  backupApprover?: PointOfContact;
  escalationChain: PointOfContact[];
  timeoutHours: number;
  autoEscalate: boolean;
  requiresBackupApproval: boolean;
}

interface ApprovalStep {
  id: string;
  approver: PointOfContact;
  stepType: 'primary' | 'backup' | 'escalation';
  status: 'pending' | 'approved' | 'rejected' | 'timeout' | 'skipped';
  approvedAt?: Date;
  timeoutAt?: Date;
  notes?: string;
}

interface ApprovalRoutingProps {
  documentType: string;
  vendorId: string;
  onRouteSelect?: (route: ApprovalRoute) => void;
  onStepsGenerated?: (steps: ApprovalStep[]) => void;
  showPreview?: boolean;
  className?: string;
}

const ApprovalRouting: React.FC<ApprovalRoutingProps> = ({
  documentType,
  vendorId,
  onRouteSelect,
  onStepsGenerated,
  showPreview = true,
  className
}) => {
  const [route, setRoute] = useState<ApprovalRoute | null>(null);
  const [approvalSteps, setApprovalSteps] = useState<ApprovalStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    if (vendorId && documentType) {
      setIsLoading(true);
      
      // Simulate API call to get approval route
      setTimeout(() => {
        const mockRoute: ApprovalRoute = {
          id: '1',
          documentType,
          vendorId,
          vendorName: 'TechCorp Solutions',
          primaryApprover: {
            id: '1',
            vendorId,
            name: 'John Smith',
            role: 'Relationship Manager',
            email: 'john.smith@techcorp.com',
            phone: '+1-555-0123',
            status: 'Active',
            isPrimary: true,
            isBackup: false,
            lastValidated: new Date('2024-01-01'),
            validationStatus: 'Validated',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2024-01-01'),
            createdBy: 'admin',
            updatedBy: 'admin'
          },
          backupApprover: {
            id: '2',
            vendorId,
            name: 'Sarah Johnson',
            role: 'Technical Lead',
            email: 'sarah.johnson@techcorp.com',
            phone: '+1-555-0124',
            status: 'Active',
            isPrimary: false,
            isBackup: true,
            lastValidated: new Date('2024-01-05'),
            validationStatus: 'Validated',
            createdAt: new Date('2023-02-01'),
            updatedAt: new Date('2024-01-05'),
            createdBy: 'admin',
            updatedBy: 'admin'
          },
          escalationChain: [
            {
              id: '3',
              vendorId,
              name: 'Mike Davis',
              role: 'Legal Contact',
              email: 'mike.davis@techcorp.com',
              status: 'Active',
              isPrimary: false,
              isBackup: false,
              lastValidated: new Date('2023-12-15'),
              validationStatus: 'Validated',
              createdAt: new Date('2023-01-15'),
              updatedAt: new Date('2023-12-15'),
              createdBy: 'admin',
              updatedBy: 'admin'
            }
          ],
          timeoutHours: 24,
          autoEscalate: true,
          requiresBackupApproval: documentType === 'contract' || documentType === 'invoice'
        };

        setRoute(mockRoute);
        
        // Generate approval steps
        const steps: ApprovalStep[] = [
          {
            id: '1',
            approver: mockRoute.primaryApprover,
            stepType: 'primary',
            status: 'pending',
            timeoutAt: new Date(Date.now() + mockRoute.timeoutHours * 60 * 60 * 1000)
          }
        ];

        if (mockRoute.requiresBackupApproval && mockRoute.backupApprover) {
          steps.push({
            id: '2',
            approver: mockRoute.backupApprover,
            stepType: 'backup',
            status: 'pending'
          });
        }

        if (mockRoute.autoEscalate && mockRoute.escalationChain.length > 0) {
          mockRoute.escalationChain.forEach((escalationContact, index) => {
            steps.push({
              id: `escalation-${index + 1}`,
              approver: escalationContact,
              stepType: 'escalation',
              status: 'pending'
            });
          });
        }

        setApprovalSteps(steps);
        setIsLoading(false);

        // Notify parent components
        onRouteSelect?.(mockRoute);
        onStepsGenerated?.(steps);
      }, 1000);
    }
  }, [vendorId, documentType, onRouteSelect, onStepsGenerated]);

  const getStepStatusBadge = (status: ApprovalStep['status']) => {
    const variants: Record<ApprovalStep['status'], any> = {
      'pending': { variant: 'secondary', icon: Clock, text: 'Pending' },
      'approved': { variant: 'success', icon: CheckCircle, text: 'Approved' },
      'rejected': { variant: 'destructive', icon: AlertTriangle, text: 'Rejected' },
      'timeout': { variant: 'warning', icon: AlertTriangle, text: 'Timeout' },
      'skipped': { variant: 'outline', icon: ArrowRight, text: 'Skipped' },
    };
    
    const config = variants[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const getStepTypeLabel = (stepType: ApprovalStep['stepType']) => {
    const labels = {
      'primary': 'Primary Approver',
      'backup': 'Backup Approver',
      'escalation': 'Escalation'
    };
    return labels[stepType];
  };

  const getValidationWarning = (approver: PointOfContact) => {
    if (approver.validationStatus === 'Overdue' || approver.validationStatus === 'Failed') {
      return (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {approver.name}'s contact validation is {approver.validationStatus.toLowerCase()}. 
            This may affect approval delivery.
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };

  const handleRefreshRoute = () => {
    setIsLoading(true);
    setError(null);
    // Trigger re-fetch of approval route
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading approval route...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!route) {
    return (
      <Alert className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          No approval route configured for {documentType} documents with this vendor.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Approval Routing</CardTitle>
            <CardDescription>
              {documentType} approval workflow for {route.vendorName}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleRefreshRoute}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Route Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Document Type</span>
            </div>
            <p className="text-sm text-muted-foreground capitalize">{route.documentType}</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Timeout</span>
            </div>
            <p className="text-sm text-muted-foreground">{route.timeoutHours} hours</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Auto Escalate</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {route.autoEscalate ? 'Enabled' : 'Disabled'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Approval Steps */}
        {showPreview && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Approval Steps</h4>
            
            <div className="space-y-4">
              {approvalSteps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Connection Line */}
                  {index < approvalSteps.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border-2 border-border bg-background flex items-center justify-center">
                      <span className="text-sm font-medium">{index + 1}</span>
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium">{step.approver.name}</h5>
                            <Badge variant="outline" className="text-xs">
                              {getStepTypeLabel(step.stepType)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{step.approver.role}</p>
                        </div>
                        {getStepStatusBadge(step.status)}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span>{step.approver.email}</span>
                        </div>
                        {step.approver.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{step.approver.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      {step.timeoutAt && step.status === 'pending' && (
                        <div className="text-xs text-muted-foreground">
                          Timeout: {step.timeoutAt.toLocaleString()}
                        </div>
                      )}
                      
                      {step.approvedAt && (
                        <div className="text-xs text-muted-foreground">
                          Approved: {step.approvedAt.toLocaleString()}
                        </div>
                      )}
                      
                      {step.notes && (
                        <div className="text-xs text-muted-foreground">
                          Notes: {step.notes}
                        </div>
                      )}
                      
                      {getValidationWarning(step.approver)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Route Configuration Summary */}
        <Separator />
        
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Configuration</h4>
          
          <div className="grid gap-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Requires backup approval:</span>
              <Badge variant={route.requiresBackupApproval ? 'default' : 'secondary'}>
                {route.requiresBackupApproval ? 'Yes' : 'No'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Escalation contacts:</span>
              <span>{route.escalationChain.length}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Auto-escalation:</span>
              <Badge variant={route.autoEscalate ? 'default' : 'secondary'}>
                {route.autoEscalate ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Validation Warnings Summary */}
        {approvalSteps.some(step => 
          step.approver.validationStatus === 'Overdue' || 
          step.approver.validationStatus === 'Failed'
        ) && (
          <>
            <Separator />
            <Alert variant="warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                One or more approvers have outdated contact validation. 
                Consider sending validation reminders before initiating approval.
              </AlertDescription>
            </Alert>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovalRouting;
