import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, FileText, User, Briefcase, CheckCircle, XCircle, AlertCircle, BarChart4 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';

// Mock data for matching candidates
const mockMatchedCandidates = [
  {
    id: '1',
    name: 'Alex Johnson',
    position: 'Marketing Specialist',
    skills: ['Digital Marketing', 'Content Strategy', 'SEO', 'Social Media'],
    matchScore: 95,
    experience: '5 years',
    location: 'New York, NY',
    education: 'MBA, Marketing',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    position: 'Senior Marketing Manager',
    skills: ['Brand Strategy', 'Team Leadership', 'Campaign Management', 'Analytics'],
    matchScore: 88,
    experience: '8 years',
    location: 'Boston, MA',
    education: 'BS, Business Administration',
    status: 'interviewing',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Michael Torres',
    position: 'Content Marketing Specialist',
    skills: ['Content Creation', 'Copywriting', 'Email Marketing', 'Analytics'],
    matchScore: 82,
    experience: '4 years',
    location: 'Remote',
    education: 'BA, Communications',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Emily Wilson',
    position: 'Digital Marketing Coordinator',
    skills: ['Social Media', 'Google Analytics', 'Content Calendar', 'PPC'],
    matchScore: 78,
    experience: '3 years',
    location: 'Chicago, IL',
    education: 'BS, Marketing',
    status: 'available',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '5',
    name: 'David Kim',
    position: 'Marketing Analytics Specialist',
    skills: ['Data Analysis', 'Tableau', 'Google Analytics', 'SQL'],
    matchScore: 75,
    experience: '6 years',
    location: 'San Francisco, CA',
    education: 'MS, Analytics',
    status: 'interviewing',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  }
];

const JobMatchingResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { jobTitle, jobDescription } = location.state || { jobTitle: 'Marketing Specialist', jobDescription: 'We are looking for an experienced marketing professional...' };
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter candidates based on search term and active tab
  const filteredCandidates = mockMatchedCandidates.filter(candidate => {
    // Filter by search term
    if (searchTerm && !candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))) {
      return false;
    }
    
    // Filter by tab
    if (activeTab === 'high' && candidate.matchScore < 85) return false;
    if (activeTab === 'medium' && (candidate.matchScore < 70 || candidate.matchScore >= 85)) return false;
    if (activeTab === 'low' && candidate.matchScore >= 70) return false;
    
    return true;
  });
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'interviewing': return 'bg-blue-500';
      case 'offer': return 'bg-purple-500';
      case 'hired': return 'bg-recruit-primary';
      default: return 'bg-gray-500';
    }
  };
  
  const getMatchScoreColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-amber-600';
    return 'text-red-600';
  };
  
  const handleViewCandidate = (id) => {
    navigate(`/candidates/${id}`);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/job-descriptions')}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Descriptions
          </Button>
          <h1 className="text-2xl font-bold">Matching Candidates</h1>
          <p className="text-muted-foreground">
            Showing candidates matching the job description for <span className="font-medium">{jobTitle}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className="bg-recruit-primary hover:bg-recruit-primary/90">
            {mockMatchedCandidates.length} Matches Found
          </Badge>
        </div>
      </div>
      
      {/* Job Description Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Job Description Summary</CardTitle>
          <CardDescription>
            Key details from the job description used for matching
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium flex items-center">
                <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                Position
              </h4>
              <p className="text-sm">{jobTitle}</p>
            </div>
            <div className="space-y-1 md:col-span-2">
              <h4 className="text-sm font-medium flex items-center">
                <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                Description
              </h4>
              <p className="text-sm line-clamp-2">{jobDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or skills..."
            className="pl-8 w-full sm:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" className="w-full sm:w-auto" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 w-full sm:w-[400px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="high">High Match</TabsTrigger>
            <TabsTrigger value="medium">Medium</TabsTrigger>
            <TabsTrigger value="low">Low Match</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {/* Candidates List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCandidates.length > 0 ? (
          filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  {/* Match Score Column */}
                  <div className="w-full md:w-[120px] bg-muted p-4 flex flex-row md:flex-col items-center justify-center gap-2">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getMatchScoreColor(candidate.matchScore)}`}>
                        {candidate.matchScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">Match Score</div>
                    </div>
                    <BarChart4 className="h-5 w-5 text-muted-foreground hidden md:block" />
                  </div>
                  
                  {/* Candidate Details */}
                  <div className="flex-1 p-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={candidate.avatar} alt={candidate.name} />
                        <AvatarFallback>{candidate.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                          <h3 className="font-medium">{candidate.name}</h3>
                          <div className="flex items-center">
                            <span className={`h-2 w-2 rounded-full ${getStatusColor(candidate.status)} mr-1`}></span>
                            <span className="text-xs capitalize text-muted-foreground">{candidate.status}</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground">{candidate.position} • {candidate.experience} • {candidate.location}</div>
                        
                        <div className="mt-2 flex flex-wrap gap-1">
                          {candidate.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleViewCandidate(candidate.id)}
                        className="mt-2 md:mt-0"
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
              <h3 className="font-medium">No matching candidates found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobMatchingResultsPage;
