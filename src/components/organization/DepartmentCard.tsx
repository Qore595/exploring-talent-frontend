import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Users, Settings, UserPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { Department, TeamMember, getTeamLeadByDepartmentId, getTeamMembersByDepartmentId } from '@/types/organization';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';

interface DepartmentCardProps {
  department: Department;
  isAdmin: boolean;
}

export const DepartmentCard: React.FC<DepartmentCardProps> = ({ department, isAdmin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [teamLead, setTeamLead] = useState<TeamMember | undefined>(getTeamLeadByDepartmentId(department.id));
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(getTeamMembersByDepartmentId(department.id));

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEditDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the department
    setIsEditOpen(false);
    toast({
      title: "Department Updated",
      description: `${department.name} has been updated`,
    });
  };

  // Admin users can add members to any department
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMemberName.trim() || !newMemberEmail.trim() || !newMemberRole.trim()) {
      toast({
        title: "Error",
        description: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    const newMember: TeamMember = {
      id: `user-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      departmentId: department.id,
      hireDate: new Date().toISOString().split('T')[0],
      skills: [],
      status: 'active',
    };

    setTeamMembers([...teamMembers, newMember]);
    setIsAddMemberOpen(false);
    setNewMemberName('');
    setNewMemberEmail('');
    setNewMemberRole('');

    toast({
      title: "Team Member Added",
      description: `${newMemberName} has been added to ${department.name}`,
    });
  };

  return (
    <Card className="border-l-4 border-l-secondary">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleToggleExpand}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <CardTitle className="text-lg flex items-center">
              <Briefcase className="h-4 w-4 mr-2 text-secondary" />
              {department.name}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Department</DialogTitle>
                  <DialogDescription>
                    Update the details for this department.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditDepartment}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="name"
                        defaultValue={department.name}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        defaultValue={department.description}
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8">
                  <UserPlus className="h-4 w-4 mr-1" /> Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Team Member</DialogTitle>
                  <DialogDescription>
                    Add a new team member to {department.name}.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMember}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="memberName" className="text-right">
                        Name
                      </Label>
                      <Input
                        id="memberName"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                        placeholder="Full Name"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="memberEmail" className="text-right">
                        Email
                      </Label>
                      <Input
                        id="memberEmail"
                        type="email"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="memberRole" className="text-right">
                        Role
                      </Label>
                      <Input
                        id="memberRole"
                        value={newMemberRole}
                        onChange={(e) => setNewMemberRole(e.target.value)}
                        placeholder="e.g., Software Engineer"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Add Member</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <CardDescription>
          {department.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{department.memberCount} Team Members</span>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fade-in">
            {teamLead && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Team Lead</h4>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={teamLead.avatar} alt={teamLead.name} />
                    <AvatarFallback>{teamLead.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{teamLead.name}</p>
                    <p className="text-xs text-muted-foreground">{teamLead.role}</p>
                  </div>
                </div>
              </div>
            )}

            {teamMembers.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Team Members</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="p-2 border rounded-md flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {teamMembers.length === 0 && !teamLead && (
              <div className="text-center py-4 text-muted-foreground">
                <p>No team members found for this department.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => setIsAddMemberOpen(true)}
                >
                  <UserPlus className="h-4 w-4 mr-1" /> Add Team Member
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
