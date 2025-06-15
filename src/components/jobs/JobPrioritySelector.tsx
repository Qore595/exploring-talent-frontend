import React from 'react';
import { AlertCircle, AlertTriangle, Clock, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { JobPriority } from '@/types/jobs';
import { JobPriorityBadge } from './JobPriorityBadge';
import { useNotifications } from '@/context/NotificationContext';

interface JobPrioritySelectorProps {
  jobId: string;
  jobTitle: string;
  currentPriority: JobPriority;
  onPriorityChange: (jobId: string, newPriority: JobPriority) => void;
  disabled?: boolean;
}

export const JobPrioritySelector: React.FC<JobPrioritySelectorProps> = ({
  jobId,
  jobTitle,
  currentPriority,
  onPriorityChange,
  disabled = false
}) => {
  const { addNotification } = useNotifications();
  
  // Priority options
  const priorityOptions: { value: JobPriority; label: string; icon: React.ReactNode }[] = [
    { value: 'urgent', label: 'Urgent', icon: <AlertCircle className="h-4 w-4 text-destructive" /> },
    { value: 'high', label: 'High', icon: <AlertTriangle className="h-4 w-4 text-primary" /> },
    { value: 'medium', label: 'Medium', icon: <Clock className="h-4 w-4 text-secondary-foreground" /> },
    { value: 'low', label: 'Low', icon: <Clock className="h-4 w-4 text-muted-foreground" /> }
  ];
  
  // Handle priority change
  const handlePriorityChange = (newPriority: JobPriority) => {
    if (newPriority === currentPriority) return;
    
    onPriorityChange(jobId, newPriority);
    
    // Add notification for priority change
    addNotification({
      type: 'priority_change',
      title: 'Job Priority Changed',
      message: `The "${jobTitle}" job priority has been changed to ${newPriority}`,
      link: `/jobs/${jobId}`,
      jobId: jobId
    });
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-1 px-2 font-normal"
          disabled={disabled}
        >
          <JobPriorityBadge priority={currentPriority} size="sm" />
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {priorityOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            className={`flex items-center gap-2 ${option.value === currentPriority ? 'bg-muted' : ''}`}
            onClick={() => handlePriorityChange(option.value)}
          >
            {option.icon}
            <span>{option.label}</span>
            {option.value === currentPriority && (
              <span className="ml-auto text-xs text-muted-foreground">Current</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default JobPrioritySelector;
