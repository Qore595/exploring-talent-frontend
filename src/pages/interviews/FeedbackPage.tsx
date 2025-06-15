import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Filter, ChevronDown, Star, Calendar, Clock, User, MapIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

// Types
interface Feedback {
  id: string;
  candidateId: string;
  candidateName: string;
  candidatePosition: string;
  candidateAvatar: string;
  interviewType: string;
  interviewDate: string;
  interviewers: string[];
  locationId: string;
  departmentId: string;
  rating: number;
  strengths: string;
  weaknesses: string;
  notes: string;
  recommendation: 'hire' | 'consider' | 'reject';
  technicalSkills: {
    technicalKnowledge: number;
    problemSolving: number;
  };
  softSkills: {
    communication: number;
    teamwork: number;
  };
  status: 'completed' | 'pending' | 'cancelled';
}

// Mock data for locations and departments
const locations = [
  { id: 'loc-1', name: 'San Francisco' },
  { id: 'loc-2', name: 'New York' },
  { id: 'loc-3', name: 'London' },
  { id: 'loc-4', name: 'Bangalore' },
];

const departments = [
  { id: 'dept-1', name: 'Engineering' },
  { id: 'dept-2', name: 'Product' },
  { id: 'dept-3', name: 'Data Science' },
  { id: 'dept-4', name: 'Design' },
  { id: 'dept-5', name: 'Marketing' },
];

// Mock feedback data
const mockFeedback: Feedback[] = [
  {
    id: '1',
    candidateId: '3',
    candidateName: 'Morgan Chen',
    candidatePosition: 'Data Scientist',
    candidateAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'technical',
    interviewDate: '2025-04-25T15:00:00',
    interviewers: ['Robin Taylor', 'Jamie Garcia'],
    locationId: 'loc-2',
    departmentId: 'dept-3',
    rating: 4,
    strengths: 'Strong technical skills in machine learning algorithms. Good understanding of data preprocessing techniques.',
    weaknesses: 'Could improve on communication of complex technical concepts to non-technical stakeholders.',
    notes: 'Overall a strong candidate with excellent technical background.',
    recommendation: 'hire',
    technicalSkills: {
      technicalKnowledge: 4,
      problemSolving: 5
    },
    softSkills: {
      communication: 3,
      teamwork: 4
    },
    status: 'completed'
  },
  {
    id: '2',
    candidateId: '4',
    candidateName: 'Casey Wilson',
    candidatePosition: 'UX Designer',
    candidateAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'portfolio',
    interviewDate: '2025-04-24T10:00:00',
    interviewers: ['Alex Johnson'],
    locationId: 'loc-3',
    departmentId: 'dept-5',
    rating: 5,
    strengths: 'Exceptional portfolio with strong user-centered design approach. Excellent understanding of design systems.',
    weaknesses: 'Limited experience with enterprise-level applications.',
    notes: 'Would be a great addition to the design team.',
    recommendation: 'hire',
    technicalSkills: {
      technicalKnowledge: 5,
      problemSolving: 4
    },
    softSkills: {
      communication: 5,
      teamwork: 4
    },
    status: 'completed'
  },
  {
    id: '3',
    candidateId: '7',
    candidateName: 'Alex Johnson',
    candidatePosition: 'Backend Developer',
    candidateAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'technical',
    interviewDate: '2025-04-23T14:00:00',
    interviewers: ['Taylor Reed', 'Drew Garcia'],
    locationId: 'loc-4',
    departmentId: 'dept-1',
    rating: 3,
    strengths: 'Good knowledge of backend technologies and database design.',
    weaknesses: 'Needs improvement in system architecture and scalability concepts.',
    notes: 'Has potential but requires mentoring in advanced concepts.',
    recommendation: 'consider',
    technicalSkills: {
      technicalKnowledge: 3,
      problemSolving: 3
    },
    softSkills: {
      communication: 4,
      teamwork: 3
    },
    status: 'completed'
  },
  {
    id: '4',
    candidateId: '8',
    candidateName: 'Jamie Rivera',
    candidatePosition: 'Product Manager',
    candidateAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'behavioral',
    interviewDate: '2025-04-20T11:30:00',
    interviewers: ['Sam Wilson', 'Pat Thomas'],
    locationId: 'loc-1',
    departmentId: 'dept-2',
    rating: 5,
    strengths: 'Excellent communication skills. Strong product vision and user empathy.',
    weaknesses: 'Could improve technical understanding of implementation constraints.',
    notes: 'Would make an excellent addition to the product team.',
    recommendation: 'hire',
    technicalSkills: {
      technicalKnowledge: 3,
      problemSolving: 5
    },
    softSkills: {
      communication: 5,
      teamwork: 5
    },
    status: 'completed'
  },
  {
    id: '5',
    candidateId: '12',
    candidateName: 'Jordan Smith',
    candidatePosition: 'Frontend Developer',
    candidateAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'technical',
    interviewDate: '2025-04-18T14:15:00',
    interviewers: ['Casey Lee', 'Morgan Williams'],
    locationId: 'loc-2',
    departmentId: 'dept-1',
    rating: 2,
    strengths: 'Good understanding of basic frontend concepts and some React knowledge.',
    weaknesses: 'Limited experience with modern frontend frameworks and state management.',
    notes: 'Does not meet the experience requirements for the role.',
    recommendation: 'reject',
    technicalSkills: {
      technicalKnowledge: 2,
      problemSolving: 2
    },
    softSkills: {
      communication: 3,
      teamwork: 3
    },
    status: 'completed'
  },
  {
    id: '6',
    candidateId: '15',
    candidateName: 'Taylor Kim',
    candidatePosition: 'Marketing Specialist',
    candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    interviewType: 'case-study',
    interviewDate: '2025-04-15T10:00:00',
    interviewers: ['Jamie Morgan', 'Alex Rivera'],
    locationId: 'loc-3',
    departmentId: 'dept-5',
    rating: 4,
    strengths: 'Creative approach to marketing challenges. Strong analytical skills for campaign optimization.',
    weaknesses: 'Limited experience with B2B marketing strategies.',
    notes: 'Would be a good fit for our consumer marketing initiatives.',
    recommendation: 'hire',
    technicalSkills: {
      technicalKnowledge: 4,
      problemSolving: 4
    },
    softSkills: {
      communication: 4,
      teamwork: 3
    },
    status: 'completed'
  }
];

// Helper components
const RatingStars = ({ rating }: { rating: number }) => (
  <div className="flex">
    {[1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ))}
  </div>
);

const FeedbackCard = ({ feedback }: { feedback: Feedback }) => {
  const location = locations.find(loc => loc.id === feedback.locationId)?.name || 'N/A';
  const department = departments.find(dept => dept.id === feedback.departmentId)?.name || 'N/A';
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={feedback.candidateAvatar} alt={feedback.candidateName} />
              <AvatarFallback>{feedback.candidateName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-medium">{feedback.candidateName}</h3>
              <p className="text-sm text-gray-500">{feedback.candidatePosition}</p>
            </div>
          </div>
          <Badge 
            variant={
              feedback.recommendation === 'hire' ? 'default' :
              feedback.recommendation === 'consider' ? 'secondary' : 'destructive'
            }
            className="capitalize"
          >
            {feedback.recommendation}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Interview Type</p>
            <p className="capitalize">{feedback.interviewType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p>{format(new Date(feedback.interviewDate), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rating</p>
            <RatingStars rating={feedback.rating} />
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500">Strengths</p>
          <p className="text-sm">{feedback.strengths}</p>
        </div>
        
        <div className="mt-2">
          <p className="text-sm text-gray-500">Areas for Improvement</p>
          <p className="text-sm">{feedback.weaknesses}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span>{feedback.interviewers.join(', ')}</span>
        </div>
        <div className="flex space-x-4">
          <span>{location}</span>
          <span>{department}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

const FeedbackPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [recommendationFilter, setRecommendationFilter] = useState('all');
  
  // Simulate API call
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, you would fetch data here
        // const response = await fetch('/api/feedback');
        // const data = await response.json();
        
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load feedback. Please try again later.');
        setIsLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);
  
  // Filter feedback based on search and filters
  const filteredFeedback = mockFeedback.filter(feedback => {
    // Filter by search term
    if (searchTerm && !feedback.candidateName.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by department
    if (departmentFilter !== 'all' && feedback.departmentId !== departmentFilter) {
      return false;
    }
    
    // Filter by location
    if (locationFilter !== 'all' && feedback.locationId !== locationFilter) {
      return false;
    }
    
    // Filter by recommendation
    if (recommendationFilter !== 'all' && feedback.recommendation !== recommendationFilter) {
      return false;
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading feedback...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 max-w-md">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to view interview feedback.</p>
          <Button>Log In</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Interview Feedback</h1>
          <p className="text-gray-500">Review and manage candidate feedback</p>
        </div>
        <Button className="mt-4 md:mt-0">
          Add New Feedback
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search candidates..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <MapIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc.id} value={loc.id}>
                    {loc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={recommendationFilter} onValueChange={setRecommendationFilter}>
              <SelectTrigger>
                <Star className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Recommendation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Recommendations</SelectItem>
                <SelectItem value="hire">Hire</SelectItem>
                <SelectItem value="consider">Consider</SelectItem>
                <SelectItem value="reject">Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Candidate Feedback</h2>
          <p className="text-sm text-gray-500">
            {filteredFeedback.length} {filteredFeedback.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
        
        {filteredFeedback.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">No feedback found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchTerm('');
                  setDepartmentFilter('all');
                  setLocationFilter('all');
                  setRecommendationFilter('all');
                }}
              >
                Clear filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFeedback.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
