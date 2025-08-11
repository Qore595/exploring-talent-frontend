import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, AlertTriangle, Clock, Trash2 } from 'lucide-react';
import { VendorNotification } from '@/types/vendor-portal';

const VendorNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<VendorNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock notifications
    const mockNotifications: VendorNotification[] = [
      {
        id: '1',
        vendorId: 'vendor-1',
        type: 'Compliance Document',
        title: 'Insurance Certificate Expiring Soon',
        message: 'Your Certificate of Insurance expires in 30 days. Please upload a renewed certificate to maintain compliance.',
        priority: 'High',
        isRead: false,
        actionRequired: true,
        actionUrl: '/vendor-portal/profile',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        vendorId: 'vendor-1',
        type: 'PoC Validation',
        title: 'PoC Validation Required',
        message: 'Please validate your primary contact information to ensure we can reach you for important updates.',
        priority: 'Medium',
        isRead: false,
        actionRequired: true,
        actionUrl: '/vendor-portal/contacts',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        vendorId: 'vendor-1',
        type: 'Assignment Update',
        title: 'New Assignment Available',
        message: 'A new software developer position is available for TechCorp Inc. Review the requirements and submit qualified candidates.',
        priority: 'Medium',
        isRead: true,
        actionRequired: false,
        actionUrl: '/vendor-portal/assignments',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        vendorId: 'vendor-1',
        type: 'Payment Update',
        title: 'Payment Processed',
        message: 'Your payment for January 2024 has been processed and will be deposited within 2-3 business days.',
        priority: 'Low',
        isRead: true,
        actionRequired: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        id: '5',
        vendorId: 'vendor-1',
        type: 'System Maintenance',
        title: 'Scheduled Maintenance',
        message: 'The vendor portal will undergo scheduled maintenance on Sunday, February 4th from 2:00 AM to 4:00 AM EST.',
        priority: 'Low',
        isRead: false,
        actionRequired: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ];

    setNotifications(mockNotifications);
    setIsLoading(false);
  }, []);

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, any> = {
      'Critical': 'destructive',
      'High': 'destructive',
      'Medium': 'warning',
      'Low': 'secondary'
    };
    return variants[priority] || 'secondary';
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">
            System alerts, updates, and action items
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {notifications.filter(n => !n.isRead).length} unread
          </Badge>
          <Button variant="outline" onClick={() => {
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
          }}>
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`${!notification.isRead ? 'border-l-4 border-l-primary' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {notification.priority === 'Critical' || notification.priority === 'High' ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : notification.actionRequired ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{notification.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant={getPriorityBadge(notification.priority)}>
                        {notification.priority}
                      </Badge>
                      <Badge variant="outline">{notification.type}</Badge>
                      {!notification.isRead && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {!notification.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteNotification(notification.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">{notification.message}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {notification.createdAt.toLocaleString()}
                  {notification.expiresAt && (
                    <span className="ml-2">
                      • Expires: {notification.expiresAt.toLocaleDateString()}
                    </span>
                  )}
                </div>
                {notification.actionRequired && notification.actionUrl && (
                  <Button size="sm">
                    Take Action
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {notifications.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notifications</h3>
              <p className="text-gray-500">You're all caught up! Check back later for updates.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorNotifications;
