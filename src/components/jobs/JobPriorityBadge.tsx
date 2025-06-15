import React from 'react';
import { Badge } from '@/components/ui/badge';
import { JobPriority } from '@/types/jobs';
import { AlertCircle, AlertTriangle, Clock } from 'lucide-react';

interface JobPriorityBadgeProps {
  priority: JobPriority;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const JobPriorityBadge: React.FC<JobPriorityBadgeProps> = ({
  priority,
  showIcon = true,
  size = 'md'
}) => {
  // Get badge styles based on priority
  const getBadgeStyles = () => {
    switch (priority) {
      case 'urgent':
        return {
          variant: 'destructive' as const,
          icon: <AlertCircle className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />,
          label: 'Urgent'
        };
      case 'high':
        return {
          variant: 'default' as const,
          icon: <AlertTriangle className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />,
          label: 'High'
        };
      case 'medium':
        return {
          variant: 'secondary' as const,
          icon: <Clock className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />,
          label: 'Medium'
        };
      case 'low':
        return {
          variant: 'outline' as const,
          icon: <Clock className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />,
          label: 'Low'
        };
      default:
        return {
          variant: 'outline' as const,
          icon: <Clock className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />,
          label: 'Normal'
        };
    }
  };

  const { variant, icon, label } = getBadgeStyles();
  
  // Apply size-specific styles
  const sizeStyles = {
    sm: 'text-xs py-0 px-1.5',
    md: 'text-xs py-0.5 px-2',
    lg: 'text-sm py-1 px-2.5'
  };

  return (
    <Badge variant={variant} className={sizeStyles[size]}>
      {showIcon && icon}
      {label}
    </Badge>
  );
};

export default JobPriorityBadge;
