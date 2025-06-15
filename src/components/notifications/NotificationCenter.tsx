import React, { useState, useEffect } from 'react';
import { Bell, X, Briefcase, UserPlus, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

export type NotificationType = 'assignment' | 'status' | 'deadline' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  jobId?: string;
}

// Mock notifications
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'assignment',
    title: 'New Job Assignment',
    message: 'You have been assigned to "Senior Software Engineer" job',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    link: '/jobs/job-1',
    jobId: 'job-1'
  },
  {
    id: 'notif-2',
    type: 'status',
    title: 'Candidate Status Update',
    message: 'Alex Johnson has been moved to Interview stage',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    link: '/jobs/job-1',
    jobId: 'job-1'
  },
  {
    id: 'notif-3',
    type: 'deadline',
    title: 'Deadline Approaching',
    message: 'The "Marketing Manager" job posting closes in 2 days',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
    link: '/jobs/job-2',
    jobId: 'job-2'
  },
  {
    id: 'notif-4',
    type: 'system',
    title: 'System Update',
    message: 'The job listings page has been updated with new features',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    read: true
  }
];

export const NotificationCenter: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  
  // Load notifications based on user
  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call filtered by user
      setNotifications(mockNotifications);
    }
  }, [user]);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Delete notification
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };
  
  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'assignment':
        return <UserPlus className="h-4 w-4 text-blue-500" />;
      case 'status':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'deadline':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'system':
        return <Briefcase className="h-4 w-4 text-purple-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-4 border-b hover:bg-muted/50 ${!notification.read ? 'bg-muted/20' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{notification.title}</div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0">New</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => deleteNotification(notification.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                {notification.link && (
                  <div className="mt-2 ml-7">
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-xs"
                      onClick={() => {
                        markAsRead(notification.id);
                        setIsOpen(false);
                        // In a real app, this would navigate to the link
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
