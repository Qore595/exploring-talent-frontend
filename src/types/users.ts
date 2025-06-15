import { UserRole } from '@/context/AuthContext';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  departmentId?: string;
  location?: string;
  locationId?: string;
  position?: string;
  bio?: string;
  skills?: string[];
  hireDate?: string;
  status?: 'active' | 'inactive' | 'pending';
}

// Mock users for the application
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    email: 'ceo@qore.io',
    role: 'ceo',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(305) 555-1234',
    department: 'Executive',
    departmentId: 'dept-0',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    position: 'Chief Executive Officer',
    bio: 'Experienced executive with a proven track record in recruitment and talent acquisition.',
    skills: ['Leadership', 'Strategy', 'Business Development'],
    hireDate: '2020-01-15T00:00:00Z',
    status: 'active'
  },
  {
    id: 'user-2',
    name: 'Michael Thompson',
    email: 'branch-manager@qore.io',
    role: 'branch-manager',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(305) 555-2345',
    department: 'Management',
    departmentId: 'dept-0',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    position: 'Branch Manager',
    bio: 'Experienced manager with expertise in team leadership and recruitment operations.',
    skills: ['Team Management', 'Recruitment', 'Client Relations'],
    hireDate: '2020-03-10T00:00:00Z',
    status: 'active'
  },
  {
    id: 'user-3',
    name: 'Emma Rodriguez',
    email: 'marketing-head@qore.io',
    role: 'marketing-head',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(305) 555-3456',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    position: 'Marketing Head',
    bio: 'Strategic marketing professional with a focus on recruitment marketing and employer branding.',
    skills: ['Marketing Strategy', 'Team Leadership', 'Employer Branding'],
    hireDate: '2020-05-20T00:00:00Z',
    status: 'active'
  },
  {
    id: 'user-4',
    name: 'David Kim',
    email: 'marketing-supervisor@qore.io',
    role: 'marketing-supervisor',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(305) 555-4567',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    position: 'Marketing Supervisor',
    bio: 'Experienced supervisor with expertise in recruitment marketing and team management.',
    skills: ['Team Supervision', 'Recruitment Marketing', 'Performance Management'],
    hireDate: '2020-07-15T00:00:00Z',
    status: 'active'
  },
  {
    id: 'user-5',
    name: 'Jordan Lee',
    email: 'recruiter@qore.io',
    role: 'marketing-recruiter',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(305) 555-5678',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    position: 'Marketing Recruiter',
    bio: 'Dedicated recruiter with a passion for connecting top talent with the right opportunities.',
    skills: ['Talent Sourcing', 'Candidate Screening', 'Recruitment Marketing'],
    hireDate: '2021-02-10T00:00:00Z',
    status: 'active'
  },
  {
    id: 'user-6',
    name: 'Taylor Smith',
    email: 'associate@qore.io',
    role: 'marketing-associate',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(305) 555-6789',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    position: 'Marketing Associate',
    bio: 'Detail-oriented associate with strong communication skills and a focus on candidate experience.',
    skills: ['Candidate Coordination', 'Interview Scheduling', 'Administrative Support'],
    hireDate: '2021-05-15T00:00:00Z',
    status: 'active'
  },
  {
    id: 'user-7',
    name: 'Alex Johnson',
    email: 'applicant@qore.io',
    role: 'applicant',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(305) 555-7890',
    position: 'Job Applicant',
    bio: 'Experienced professional seeking new opportunities in the recruitment industry.',
    skills: ['Communication', 'Problem Solving', 'Teamwork'],
    status: 'active'
  },
  // New York Office
  {
    id: 'user-10',
    name: 'Olivia Wilson',
    email: 'olivia.wilson@qore.io',
    role: 'marketing-recruiter',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(212) 555-1234',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'New York Office',
    locationId: 'loc-2',
    position: 'Marketing Recruiter',
    bio: 'Experienced recruiter specializing in technical talent acquisition.',
    skills: ['Technical Recruiting', 'Candidate Assessment', 'Salary Negotiation'],
    hireDate: '2021-03-20T00:00:00Z',
    status: 'active'
  },
  {
    id: 'user-11',
    name: 'Ethan Brown',
    email: 'ethan.brown@qore.io',
    role: 'marketing-associate',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(212) 555-2345',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'New York Office',
    locationId: 'loc-2',
    position: 'Marketing Associate',
    bio: 'Detail-oriented associate with a background in HR and recruitment support.',
    skills: ['Candidate Coordination', 'Documentation', 'Process Improvement'],
    hireDate: '2021-06-10T00:00:00Z',
    status: 'active'
  },
  // San Francisco Office
  {
    id: 'user-20',
    name: 'Sophia Garcia',
    email: 'sophia.garcia@qore.io',
    role: 'marketing-recruiter',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(415) 555-1234',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'San Francisco Office',
    locationId: 'loc-3',
    position: 'Marketing Recruiter',
    bio: 'Tech-focused recruiter with expertise in Silicon Valley talent acquisition.',
    skills: ['Tech Recruiting', 'Startup Hiring', 'Diversity Sourcing'],
    hireDate: '2021-04-15T00:00:00Z',
    status: 'active'
  },
  {
    id: 'user-21',
    name: 'Liam Martinez',
    email: 'liam.martinez@qore.io',
    role: 'marketing-associate',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '(415) 555-2345',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'San Francisco Office',
    locationId: 'loc-3',
    position: 'Marketing Associate',
    bio: 'Associate with a background in tech recruitment and candidate experience.',
    skills: ['Candidate Experience', 'Technical Screening', 'Social Media Recruiting'],
    hireDate: '2021-07-20T00:00:00Z',
    status: 'active'
  }
];
