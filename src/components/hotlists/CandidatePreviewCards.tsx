import { useState, useMemo } from 'react';
import { 
  User, MapPin, Calendar, DollarSign, Eye, EyeOff, 
  CheckCircle, Circle, Search, Filter, Users, 
  Briefcase, Clock, Mail, Phone
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CandidatePreviewCard } from '@/types/hotlists';

interface CandidatePreviewCardsProps {
  candidates: CandidatePreviewCard[];
  selectedCandidates: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  batchSize: number;
  showWorkAuthorization: boolean;
  onShowWorkAuthChange: (show: boolean) => void;
  className?: string;
}

// Mock candidates for development
const mockCandidates: CandidatePreviewCard[] = [
  {
    benchResourceId: '1',
    employee: { id: '1', name: 'John Doe', email: 'john.doe@email.com' },
    roles: ['Full Stack Developer', 'Frontend Developer'],
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
    location: 'Remote',
    availability: '2024-02-15',
    workAuthorization: 'US Citizen',
    includeWorkAuth: false,
    selected: false
  },
  {
    benchResourceId: '2',
    employee: { id: '2', name: 'Jane Smith', email: 'jane.smith@email.com' },
    roles: ['Data Scientist', 'ML Engineer'],
    skills: ['Python', 'TensorFlow', 'SQL', 'Tableau'],
    location: 'Hybrid - NYC',
    availability: '2024-02-20',
    workAuthorization: 'H1B',
    includeWorkAuth: false,
    selected: false
  },
  {
    benchResourceId: '3',
    employee: { id: '3', name: 'Mike Johnson', email: 'mike.johnson@email.com' },
    roles: ['DevOps Engineer', 'Cloud Architect'],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
    location: 'On-site - SF',
    availability: '2024-02-10',
    workAuthorization: 'Green Card',
    includeWorkAuth: false,
    selected: false
  },
  {
    benchResourceId: '4',
    employee: { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@email.com' },
    roles: ['UI/UX Designer', 'Product Designer'],
    skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
    location: 'Remote',
    availability: '2024-02-25',
    workAuthorization: 'US Citizen',
    includeWorkAuth: false,
    selected: false
  },
  {
    benchResourceId: '5',
    employee: { id: '5', name: 'David Chen', email: 'david.chen@email.com' },
    roles: ['Backend Developer', 'API Developer'],
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Redis'],
    location: 'Hybrid - LA',
    availability: '2024-03-01',
    workAuthorization: 'OPT',
    includeWorkAuth: false,
    selected: false
  }
];

const CandidatePreviewCards: React.FC<CandidatePreviewCardsProps> = ({
  candidates = mockCandidates,
  selectedCandidates,
  onSelectionChange,
  batchSize,
  showWorkAuthorization,
  onShowWorkAuthChange,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('');

  // Filter candidates based on search and filters
  const filteredCandidates = useMemo(() => {
    return candidates.filter(candidate => {
      const matchesSearch = searchTerm === '' || 
        candidate.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesSkill = skillFilter === '' || 
        candidate.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()));
      
      const matchesLocation = locationFilter === 'all' || 
        candidate.location.toLowerCase().includes(locationFilter.toLowerCase());
      
      const matchesRole = roleFilter === '' || 
        candidate.roles.some(role => role.toLowerCase().includes(roleFilter.toLowerCase()));
      
      return matchesSearch && matchesSkill && matchesLocation && matchesRole;
    });
  }, [candidates, searchTerm, skillFilter, locationFilter, roleFilter]);

  // Handle individual candidate selection
  const handleCandidateToggle = (candidateId: string) => {
    const newSelection = selectedCandidates.includes(candidateId)
      ? selectedCandidates.filter(id => id !== candidateId)
      : [...selectedCandidates, candidateId];
    
    // Limit selection to batch size
    if (newSelection.length <= batchSize) {
      onSelectionChange(newSelection);
    }
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedCandidates.length === Math.min(filteredCandidates.length, batchSize)) {
      onSelectionChange([]);
    } else {
      const newSelection = filteredCandidates
        .slice(0, batchSize)
        .map(candidate => candidate.benchResourceId);
      onSelectionChange(newSelection);
    }
  };

  // Get unique values for filters
  const uniqueSkills = useMemo(() => {
    const skills = new Set<string>();
    candidates.forEach(candidate => {
      candidate.skills.forEach(skill => skills.add(skill));
    });
    return Array.from(skills).sort();
  }, [candidates]);

  const uniqueLocations = useMemo(() => {
    const locations = new Set<string>();
    candidates.forEach(candidate => {
      locations.add(candidate.location);
    });
    return Array.from(locations).sort();
  }, [candidates]);

  const uniqueRoles = useMemo(() => {
    const roles = new Set<string>();
    candidates.forEach(candidate => {
      candidate.roles.forEach(role => roles.add(role));
    });
    return Array.from(roles).sort();
  }, [candidates]);

  const isSelectionFull = selectedCandidates.length >= batchSize;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with batch info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Select Candidates</span>
              </CardTitle>
              <CardDescription>
                Choose up to {batchSize} candidates for this hotlist
              </CardDescription>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                <span className="font-medium">{selectedCandidates.length}</span>
                <span className="text-gray-500"> / {batchSize} selected</span>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="showWorkAuth"
                  checked={showWorkAuthorization}
                  onCheckedChange={onShowWorkAuthChange}
                />
                <Label htmlFor="showWorkAuth" className="text-sm">
                  Show Work Authorization
                </Label>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Roles</SelectItem>
                {uniqueRoles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={skillFilter} onValueChange={setSkillFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Skills</SelectItem>
                {uniqueSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleSelectAll}
              disabled={filteredCandidates.length === 0}
            >
              {selectedCandidates.length === Math.min(filteredCandidates.length, batchSize) 
                ? 'Deselect All' 
                : `Select ${Math.min(filteredCandidates.length, batchSize)}`
              }
            </Button>
          </div>

          {/* Selection Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Selection Progress</span>
              <span>{selectedCandidates.length} / {batchSize}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${(selectedCandidates.length / batchSize) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidate Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map((candidate) => {
          const isSelected = selectedCandidates.includes(candidate.benchResourceId);
          const canSelect = !isSelectionFull || isSelected;
          
          return (
            <Card 
              key={candidate.benchResourceId} 
              className={`cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : canSelect 
                    ? 'hover:shadow-md hover:border-blue-300' 
                    : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => canSelect && handleCandidateToggle(candidate.benchResourceId)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {isSelected ? (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{candidate.employee.name}</CardTitle>
                      <CardDescription className="flex items-center space-x-1">
                        <Mail className="h-3 w-3" />
                        <span>{candidate.employee.email}</span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Roles */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Preferred Roles</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.roles.map((role, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {candidate.skills.slice(0, 4).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {candidate.skills.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{candidate.skills.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Location and Availability */}
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Available {new Date(candidate.availability).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Work Authorization */}
                {showWorkAuthorization && candidate.workAuthorization && (
                  <div className="pt-2 border-t">
                    <p className="text-sm">
                      <span className="font-medium">Work Auth:</span> {candidate.workAuthorization}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No candidates message */}
      {filteredCandidates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms to find candidates.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Selection limit warning */}
      {isSelectionFull && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-orange-800">
              <Users className="h-5 w-5" />
              <p className="font-medium">
                Batch limit reached ({batchSize} candidates selected)
              </p>
            </div>
            <p className="text-sm text-orange-700 mt-1">
              Deselect a candidate to add a different one, or increase the batch size.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CandidatePreviewCards;
