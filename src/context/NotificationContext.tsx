import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

export type NotificationType = 
  | 'assignment' 
  | 'reassignment'
  | 'status_change' 
  | 'deadline' 
  | 'priority_change'
  | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  jobId?: string;
  senderId?: string;
  senderName?: string;
  recipientId?: string;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  sendEmailNotification: (recipientEmail: string, subject: string, body: string) => Promise<boolean>;
}

// Mock function to simulate sending email notifications
const mockSendEmail = async (recipientEmail: string, subject: string, body: string): Promise<boolean> => {
  console.log(`Sending email to ${recipientEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return success (in a real app, this would be the API response)
  return true;
};

// Create the context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock notifications data - in a real app, this would come from an API
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'assignment',
    title: 'New Job Assignment',
    message: 'You have been assigned to "Senior Software Engineer" job',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    read: false,
    link: '/jobs/JOB-001',
    jobId: 'JOB-001',
    senderId: 'user-1',
    senderName: 'Sarah Chen'
  },
  {
    id: 'notif-2',
    type: 'status_change',
    title: 'Candidate Status Update',
    message: 'Alex Johnson has been moved to Interview stage',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: false,
    link: '/candidates/candidate-1',
    jobId: 'JOB-001'
  },
  {
    id: 'notif-3',
    type: 'deadline',
    title: 'Deadline Approaching',
    message: 'The "Marketing Manager" job posting closes in 2 days',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    read: true,
    link: '/jobs/JOB-002',
    jobId: 'JOB-002'
  },
  {
    id: 'notif-4',
    type: 'priority_change',
    title: 'Job Priority Changed',
    message: 'The "Senior Recruitment Specialist" job priority has been changed to Urgent',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
    read: true,
    link: '/jobs/JOB-001',
    jobId: 'JOB-001'
  }
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Load notifications when user changes
  useEffect(() => {
    if (user) {
      // In a real app, this would be an API call to fetch notifications for the current user
      setNotifications(mockNotifications);
    } else {
      setNotifications([]);
    }
  }, [user]);
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });
  };
  
  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Delete a notification
  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Send email notification
  const sendEmailNotification = async (recipientEmail: string, subject: string, body: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call to send an email
      const success = await mockSendEmail(recipientEmail, subject, body);
      
      if (success) {
        toast({
          title: "Email Sent",
          description: `Notification email sent to ${recipientEmail}`,
        });
      }
      
      return success;
    } catch (error) {
      console.error('Failed to send email notification:', error);
      
      toast({
        title: "Email Failed",
        description: "Failed to send notification email",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        sendEmailNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  
  return context;
};
