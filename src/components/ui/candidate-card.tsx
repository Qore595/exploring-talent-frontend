
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MapPin, Building2, Calendar, Mail, Phone } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { mockLocations, mockDepartments, getLocationById, getDepartmentById } from "@/types/organization";

export type CandidateStatus =
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected';

export interface Candidate {
  id: string;
  name: string;
  position: string;
  skills: string[];
  status: CandidateStatus;
  matchScore?: number;
  avatar?: string;
  locationId?: string;
  departmentId?: string;
  appliedDate?: string;
  lastContactDate?: string;
  source?: string;
  assignedTo?: string;
  notes?: string;
  email?: string;
  phone?: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onView?: (id: string) => void;
  onAction?: (id: string) => void;
  actionLabel?: string;
  className?: string;
}

const statusConfig: Record<CandidateStatus, { label: string; color: string }> = {
  screening: { label: 'Screening', color: 'bg-amber-100 text-amber-800' },
  interview: { label: 'Interview', color: 'bg-blue-100 text-blue-800' },
  offer: { label: 'Offer', color: 'bg-purple-100 text-purple-800' },
  hired: { label: 'Hired', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800' },
};

export function CandidateCard({
  candidate,
  onView,
  onAction,
  actionLabel = "View Profile",
  className
}: CandidateCardProps) {
  const {
    id,
    name,
    position,
    skills,
    status,
    matchScore,
    avatar,
    locationId,
    departmentId,
    appliedDate,
    email,
    phone,
    source
  } = candidate;

  const { label, color } = statusConfig[status];

  // Get location and department information
  const location = locationId ? getLocationById(locationId) : undefined;
  const department = departmentId ? getDepartmentById(departmentId) : undefined;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={avatar} />
            <AvatarFallback className="text-lg">{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{name}</h3>
              <Badge className={color}>{label}</Badge>
            </div>

            <p className="text-muted-foreground">{position}</p>

            {/* Location and Department */}
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
              {location && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{location.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{location.address}, {location.city}, {location.state}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {department && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center">
                        <Building2 className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{department.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{department.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {appliedDate && (
                <div className="flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                  <span>Applied: {new Date(appliedDate).toLocaleDateString()}</span>
                </div>
              )}

              {source && (
                <div className="flex items-center">
                  <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {source}
                  </Badge>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="bg-accent/50">
                  {skill}
                </Badge>
              ))}
              {skills.length > 3 && (
                <Badge variant="outline" className="bg-accent/50">
                  +{skills.length - 3}
                </Badge>
              )}
            </div>

            {/* Contact Information */}
            {(email || phone) && (
              <div className="flex flex-wrap gap-3 mt-3 text-xs text-muted-foreground">
                {email && (
                  <div className="flex items-center">
                    <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">{email}</span>
                  </div>
                )}

                {phone && (
                  <div className="flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    <span>{phone}</span>
                  </div>
                )}
              </div>
            )}

            {/* Match score removed as it should only appear when matching candidates to specific job descriptions */}
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 bg-muted/30 flex justify-between">
        <Button
          variant="outline"
          onClick={() => onView && onView(id)}
        >
          {actionLabel}
        </Button>

        {onAction && (
          <Button
            onClick={() => onAction(id)}
            variant="default"
          >
            Next Step
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
