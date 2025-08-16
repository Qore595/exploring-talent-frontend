import React from 'react';
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  DollarSign,
  FileText
} from "lucide-react";

export type StatusType = 'approval' | 'payment' | 'general';
export type StatusValue = 'approved' | 'pending' | 'rejected' | 'paid' | 'unpaid' | 'overdue' | 'active' | 'inactive' | 'success' | 'warning' | 'error';

interface StatusBadgeProps {
  status: StatusValue;
  type?: StatusType;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'general',
  showIcon = true,
  size = 'md',
  className = ''
}) => {
  const getStatusConfig = () => {
    const configs = {
      // Approval statuses
      approved: {
        variant: 'success' as const,
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Approved'
      },
      pending: {
        variant: 'warning' as const,
        icon: <Clock className="h-3 w-3" />,
        label: 'Pending'
      },
      rejected: {
        variant: 'destructive' as const,
        icon: <XCircle className="h-3 w-3" />,
        label: 'Rejected'
      },
      // Payment statuses
      paid: {
        variant: 'success' as const,
        icon: <DollarSign className="h-3 w-3" />,
        label: 'Paid'
      },
      unpaid: {
        variant: 'destructive' as const,
        icon: <AlertTriangle className="h-3 w-3" />,
        label: 'Unpaid'
      },
      overdue: {
        variant: 'destructive' as const,
        icon: <AlertTriangle className="h-3 w-3" />,
        label: 'Overdue'
      },
      // General statuses
      active: {
        variant: 'success' as const,
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Active'
      },
      inactive: {
        variant: 'secondary' as const,
        icon: <XCircle className="h-3 w-3" />,
        label: 'Inactive'
      },
      success: {
        variant: 'success' as const,
        icon: <CheckCircle className="h-3 w-3" />,
        label: 'Success'
      },
      warning: {
        variant: 'warning' as const,
        icon: <AlertTriangle className="h-3 w-3" />,
        label: 'Warning'
      },
      error: {
        variant: 'destructive' as const,
        icon: <XCircle className="h-3 w-3" />,
        label: 'Error'
      }
    };

    return configs[status] || configs.pending;
  };

  const config = getStatusConfig();
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  };

  return (
    <Badge 
      variant={config.variant} 
      className={`flex items-center gap-1 ${sizeClasses[size]} ${className}`}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
};

// Specific badge components for common use cases
export const ApprovalBadge: React.FC<Omit<StatusBadgeProps, 'type'>> = (props) => (
  <StatusBadge {...props} type="approval" />
);

export const PaymentBadge: React.FC<Omit<StatusBadgeProps, 'type'>> = (props) => (
  <StatusBadge {...props} type="payment" />
);

export default StatusBadge;
