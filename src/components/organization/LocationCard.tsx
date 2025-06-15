import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Users, ChevronDown, ChevronRight, Settings, Plus } from 'lucide-react';
import { Location, Department, getDepartmentsByLocationId } from '@/types/organization';
import { DepartmentCard } from './DepartmentCard';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';

interface LocationCardProps {
  location: Location;
  isAdmin: boolean;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, isAdmin }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [departments, setDepartments] = useState<Department[]>(getDepartmentsByLocationId(location.id));
  const [isAddDepartmentOpen, setIsAddDepartmentOpen] = useState(false);
  const [isEditLocationOpen, setIsEditLocationOpen] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [newDepartmentDescription, setNewDepartmentDescription] = useState('');

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Admin users can add departments to any location
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newDepartmentName.trim()) {
      toast({
        title: "Error",
        description: "Department name is required",
        variant: "destructive",
      });
      return;
    }

    // In a real app, this would be an API call
    const newDepartment: Department = {
      id: `dept-${Date.now()}`,
      name: newDepartmentName,
      description: newDepartmentDescription,
      locationId: location.id,
      teamLeadId: null,
      memberCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDepartments([...departments, newDepartment]);
    setIsAddDepartmentOpen(false);
    setNewDepartmentName('');
    setNewDepartmentDescription('');

    toast({
      title: "Department Added",
      description: `${newDepartmentName} has been added to ${location.name}`,
    });
  };

  const handleEditLocation = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the location
    setIsEditLocationOpen(false);
    toast({
      title: "Location Updated",
      description: `${location.name} has been updated`,
    });
  };

  return (
    <Card className="mb-4 border-l-4 border-l-primary">
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
            <CardTitle className="text-xl flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-primary" />
              {location.name}
            </CardTitle>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Dialog open={isEditLocationOpen} onOpenChange={setIsEditLocationOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Location</DialogTitle>
                    <DialogDescription>
                      Update the details for this location.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleEditLocation}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          defaultValue={location.name}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Address
                        </Label>
                        <Input
                          id="address"
                          defaultValue={location.address}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="city" className="text-right">
                          City
                        </Label>
                        <Input
                          id="city"
                          defaultValue={location.city}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="state" className="text-right">
                          State
                        </Label>
                        <Input
                          id="state"
                          defaultValue={location.state}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="zipCode" className="text-right">
                          Zip Code
                        </Label>
                        <Input
                          id="zipCode"
                          defaultValue={location.zipCode}
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

              <Dialog open={isAddDepartmentOpen} onOpenChange={setIsAddDepartmentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="h-8">
                    <Plus className="h-4 w-4 mr-1" /> Add Department
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Department</DialogTitle>
                    <DialogDescription>
                      Create a new department for {location.name}.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDepartment}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="departmentName" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="departmentName"
                          value={newDepartmentName}
                          onChange={(e) => setNewDepartmentName(e.target.value)}
                          placeholder="e.g., Marketing"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="departmentDescription" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="departmentDescription"
                          value={newDepartmentDescription}
                          onChange={(e) => setNewDepartmentDescription(e.target.value)}
                          placeholder="Describe the department's responsibilities"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Department</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
        <CardDescription>
          {location.address}, {location.city}, {location.state} {location.zipCode}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{departments.length} Departments</span>
          </div>
          <div>
            {location.hiringManagerIds.length} Hiring Manager{location.hiringManagerIds.length !== 1 ? 's' : ''}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 pl-6 space-y-4 animate-fade-in">
            {departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                isAdmin={isAdmin}
              />
            ))}

            {departments.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <p>No departments found for this location.</p>
                {isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => setIsAddDepartmentOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Department
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationCard;
