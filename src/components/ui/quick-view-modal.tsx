import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Building2, Calendar, Mail, 
  Phone, FileText, User, ArrowRight 
} from "lucide-react";
import { Candidate } from "@/components/ui/candidate-card";
import { useNavigate } from 'react-router-dom';
import { mockLocations, mockDepartments, getLocationById, getDepartmentById } from "@/types/organization";

interface QuickViewModalProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

const statusConfig: Record<string, { label: string; color: string }> = {
  screening: { label: 'Screening', color: 'bg-amber-100 text-amber-800' },
  interview: { label: 'Interview', color: 'bg-blue-100 text-blue-800' },
  offer: { label: 'Offer', color: 'bg-purple-100 text-purple-800' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

export function QuickViewModal({ candidate, isOpen, onClose }: QuickViewModalProps) {
  const navigate = useNavigate();
  
  if (!candidate) return null;
  
  const { label, color } = statusConfig[candidate.status];
  const location = candidate.locationId ? getLocationById(candidate.locationId) : undefined;
  const department = candidate.departmentId ? getDepartmentById(candidate.departmentId) : undefined;
  
  const handleViewDetails = () => {
    navigate(`/candidates/${candidate.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Candidate Profile</DialogTitle>
          <DialogDescription>Quick summary of candidate details</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-3">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={candidate.avatar} />
              <AvatarFallback className="text-lg">{candidate.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{candidate.name}</h3>
                <Badge className={color}>{label}</Badge>
              </div>
              <p className="text-muted-foreground">{candidate.position}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="bg-accent/50">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3 pt-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.email || 'Not provided'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.phone || 'Not provided'}</span>
            </div>
            
            {location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{location.name}, {location.city}, {location.state}</span>
              </div>
            )}
            
            {department && (
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{department.name}</span>
              </div>
            )}
            
            {candidate.appliedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Applied: {new Date(candidate.appliedDate).toLocaleDateString()}</span>
              </div>
            )}
            
            {candidate.notes && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Notes:</span>
                </div>
                <p className="text-sm bg-muted/50 p-2 rounded">{candidate.notes}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between border-t pt-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleViewDetails} className="flex items-center gap-1">
            View Full Profile
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
