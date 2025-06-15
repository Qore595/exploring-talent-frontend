
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, ClipboardCheck, FileSearch, Award, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { CandidateCard, Candidate } from '@/components/ui/candidate-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from '@/hooks/use-toast';

// Mock data for candidates
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Jordan Lee',
    position: 'Senior Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    status: 'screening',
    matchScore: 92,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Taylor Smith',
    position: 'Frontend Developer',
    skills: ['React', 'CSS', 'JavaScript'],
    status: 'interview',
    matchScore: 87,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Morgan Chen',
    position: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    status: 'offer',
    matchScore: 95,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Jesse Patel',
    position: 'DevOps Engineer',
    skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
    status: 'hired',
    matchScore: 89,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '5',
    name: 'Casey Wilson',
    position: 'UX Designer',
    skills: ['Figma', 'User Research', 'UI Design'],
    status: 'screening',
    matchScore: 83,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

const TalentScoutDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredCandidates = statusFilter === 'all' 
    ? mockCandidates 
    : mockCandidates.filter(c => c.status === statusFilter);

  const handleViewCandidate = (id: string) => {
    toast({
      title: "View Candidate",
      description: `Viewing candidate details for ID: ${id}`,
    });
  };

  const handleCandidateAction = (id: string) => {
    toast({
      title: "Candidate Action",
      description: `Moving candidate ${id} to next step`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Talent Scout Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Manage candidates, screenings, and track recruitment metrics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Candidates"
          value="23"
          description="In recruitment pipeline"
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Screenings"
          value="15"
          description="This week"
          icon={<FileSearch className="h-6 w-6 text-primary" />}
          trend={{ value: 5, isPositive: true }}
        />
        <StatsCard
          title="Resume Uploads"
          value="42"
          description="This month"
          icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Successful Hires"
          value="8"
          description="This quarter"
          icon={<Award className="h-6 w-6 text-primary" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <Link to="/resume-upload">
          <Button>
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Upload Resumes
          </Button>
        </Link>
        <Link to="/screenings">
          <Button variant="outline">
            <FileSearch className="mr-2 h-4 w-4" />
            View Screenings
          </Button>
        </Link>
      </div>

      {/* Recent Candidates */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Candidates</CardTitle>
            <CardDescription>Manage and track candidate progress</CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={statusFilter} 
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                onView={handleViewCandidate}
                onAction={handleCandidateAction}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Screenings */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Screenings</CardTitle>
          <CardDescription>Scheduled AI screenings for this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Candidate</th>
                  <th className="text-left py-3 px-4">Position</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Screening Link</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Ryan Johnson</td>
                  <td className="py-3 px-4">Backend Developer</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-800 text-xs">
                      Pending
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a href="#" className="text-primary hover:underline">
                      https://screening.link/abc123
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">Resend</Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Lin Zhang</td>
                  <td className="py-3 px-4">Product Manager</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                      Scheduled
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a href="#" className="text-primary hover:underline">
                      https://screening.link/def456
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">View</Button>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">Jordan Patel</td>
                  <td className="py-3 px-4">UI Designer</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                      Completed
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <a href="#" className="text-primary hover:underline">
                      https://screening.link/ghi789
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">Results</Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TalentScoutDashboard;
