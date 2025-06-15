import React, { useState } from 'react';
import { UserPlus, Search, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { JobListing } from '@/types/jobs';
import { useAuth } from '@/context/AuthContext';
import { mockUsers } from '@/types/users';

// Filter users to only include recruiters and associates
const assignableUsers = mockUsers.filter(user =>
  user.role === 'marketing-recruiter' || user.role === 'marketing-associate'
);

interface AssignJobDialogProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobListing;
  onAssign: (jobId: string, userId: string, userName: string) => void;
}

export const AssignJobDialog: React.FC<AssignJobDialogProps> = ({
  isOpen,
  onClose,
  job,
  onAssign
}) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(job.assignedTo);

  // Filter users based on search query
  const filteredUsers = assignableUsers.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  // Handle user selection
  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  // Handle assignment
  const handleAssign = () => {
    if (!selectedUserId) return;

    const selectedUser = assignableUsers.find(user => user.id === selectedUserId);
    if (selectedUser) {
      onAssign(job.id, selectedUser.id, selectedUser.name);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Job</DialogTitle>
          <DialogDescription>
            Assign this job to a scout or team member
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4">
            <div className="font-medium mb-1">Job</div>
            <div className="text-sm">{job.title}</div>
            <div className="text-xs text-muted-foreground">{job.department} • {job.location}</div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or role..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-md overflow-hidden">
            <div className="max-h-[240px] overflow-y-auto">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`flex items-center justify-between p-3 hover:bg-muted/50 cursor-pointer ${
                      selectedUserId === user.id ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleSelectUser(user.id)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.role === 'marketing-recruiter' ? 'Marketing Recruiter' : 'Marketing Associate'}
                        </div>
                      </div>
                    </div>

                    {selectedUserId === user.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  No users found matching your search
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedUserId
              ? `Assigning to ${assignableUsers.find(u => u.id === selectedUserId)?.name}`
              : 'Select a user to assign'
            }
          </div>
          <Button
            onClick={handleAssign}
            disabled={!selectedUserId}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Assign Job
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AssignJobDialog;
