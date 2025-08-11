import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Plus, Reply, Paperclip } from 'lucide-react';
import { VendorMessage } from '@/types/vendor-portal';

const VendorMessages: React.FC = () => {
  const [messages, setMessages] = useState<VendorMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock messages
    const mockMessages: VendorMessage[] = [
      {
        id: '1',
        vendorId: 'vendor-1',
        fromUser: 'Sarah Johnson',
        toUser: 'John Smith',
        subject: 'New Assignment Opportunity - Senior Developer',
        content: 'Hi John,\n\nWe have a new assignment opportunity for a Senior Software Developer position at TechCorp Inc. The client is looking for someone with 5+ years of experience in React and Node.js.\n\nPlease review the attached job description and let me know if you have any qualified candidates.\n\nBest regards,\nSarah',
        isRead: false,
        attachments: [
          {
            id: '1',
            fileName: 'job_description_senior_dev.pdf',
            fileSize: 245760,
            fileType: 'application/pdf',
            downloadUrl: '/api/files/job_description_senior_dev.pdf'
          }
        ],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: '2',
        vendorId: 'vendor-1',
        fromUser: 'John Smith',
        toUser: 'Sarah Johnson',
        subject: 'Re: Compliance Document Update Required',
        content: 'Hi Sarah,\n\nThank you for the reminder. I have uploaded the updated Certificate of Insurance to our vendor profile. Please let me know if you need any additional documentation.\n\nBest regards,\nJohn',
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        vendorId: 'vendor-1',
        fromUser: 'Mike Davis',
        toUser: 'John Smith',
        subject: 'Payment Schedule Update',
        content: 'Hello John,\n\nI wanted to inform you that we have updated our payment schedule. Payments will now be processed on the 15th and 30th of each month instead of monthly.\n\nThis change will take effect starting next month. Please update your records accordingly.\n\nIf you have any questions, please don\'t hesitate to reach out.\n\nBest,\nMike Davis\nAccounts Payable',
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        id: '4',
        vendorId: 'vendor-1',
        fromUser: 'Lisa Chen',
        toUser: 'John Smith',
        subject: 'Quarterly Business Review Invitation',
        content: 'Dear John,\n\nI hope this message finds you well. We would like to invite you to our Quarterly Business Review meeting scheduled for next month.\n\nDuring this meeting, we will discuss:\n- Performance metrics for Q4\n- Upcoming opportunities\n- Process improvements\n- Strategic planning for 2024\n\nPlease let me know your availability for the week of February 12-16.\n\nLooking forward to our discussion.\n\nBest regards,\nLisa Chen\nVendor Relations Manager',
        isRead: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];

    setMessages(mockMessages);
    setIsLoading(false);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Communication center for direct messaging with account managers
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {messages.filter(m => !m.isRead).length} unread
          </Badge>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={`${!message.isRead ? 'border-l-4 border-l-primary' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>{getInitials(message.fromUser)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg">{message.subject}</CardTitle>
                      {!message.isRead && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      From: <strong>{message.fromUser}</strong> • {message.createdAt.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Reply className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {message.content}
                  </pre>
                </div>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Paperclip className="h-4 w-4 mr-2" />
                      Attachments ({message.attachments.length})
                    </h4>
                    <div className="space-y-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex items-center space-x-2">
                            <Paperclip className="h-4 w-4 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{attachment.fileName}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(attachment.fileSize)}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    {message.updatedAt.toLocaleString()}
                  </div>
                  <Button variant="outline" size="sm">
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {messages.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages</h3>
              <p className="text-gray-500 mb-4">You don't have any messages yet.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Send First Message
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorMessages;
