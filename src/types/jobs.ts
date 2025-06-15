// Job listing types and mock data

export type JobStatus = 'draft' | 'published' | 'in-progress' | 'on-hold' | 'filled' | 'closed';

export type JobPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface JobListing {
  id: string;
  title: string;
  description: string;
  department: string;
  departmentId: string;
  location: string;
  locationId: string;
  status: JobStatus;
  priority: JobPriority;
  assignedTo: string | null; // User ID
  assignedToName: string | null; // User name
  applicantsCount: number;
  createdAt: string;
  updatedAt: string;
  deadline: string | null;
  clientName?: string; // Client company name
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  // Profit optimization fields
  clientBudget?: number; // Amount client pays per hour
  companyProfit?: number; // Amount company keeps from client budget
  companyProfitPercentage?: number; // Percentage company keeps from client budget
  candidateOffer?: number; // Amount offered to candidate per hour
  consultancyFee?: number; // Amount company keeps from candidate offer
  consultancyFeePercentage?: number; // Percentage company keeps from candidate offer
  finalCandidateRate?: number; // Final amount candidate receives per hour

  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  isRemote: boolean;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary' | 'internship';
}

export interface JobCandidate {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  status: 'new' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes: string;
  appliedAt: string;
  lastUpdated: string;
}

// Mock data for job listings
export const mockJobListings: JobListing[] = [
  // Miami Headquarters
  {
    id: 'JOB-001',
    title: 'Senior Recruitment Specialist',
    description: 'We are looking for a Senior Recruitment Specialist to join our team...',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    status: 'published',
    priority: 'high',
    assignedTo: 'user-20', // Jordan Lee (Recruitment Specialist)
    assignedToName: 'Jordan Lee',
    applicantsCount: 12,
    createdAt: '2023-06-15T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z',
    deadline: '2023-07-30T00:00:00Z',
    clientName: 'TechCorp Inc.',
    salary: {
      min: 120000,
      max: 150000,
      currency: 'USD'
    },
    clientBudget: 100,
    companyProfit: 35,
    companyProfitPercentage: 35,
    candidateOffer: 65,
    consultancyFee: 19.5,
    consultancyFeePercentage: 30,
    finalCandidateRate: 45.5,
    requirements: [
      '5+ years of experience in software development',
      'Strong knowledge of JavaScript and TypeScript',
      'Experience with React and Node.js',
      'Bachelor\'s degree in Computer Science or related field'
    ],
    responsibilities: [
      'Design and implement new features',
      'Collaborate with cross-functional teams',
      'Mentor junior developers',
      'Participate in code reviews'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Flexible work hours'
    ],
    isRemote: true,
    employmentType: 'full-time'
  },
  {
    id: 'JOB-002',
    title: 'Account Executive',
    description: 'We are seeking an Account Executive to manage client relationships and drive sales...',
    department: 'Sales',
    departmentId: 'dept-2',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    status: 'in-progress',
    priority: 'medium',
    assignedTo: 'user-21', // Taylor Smith (Account Executive)
    assignedToName: 'Taylor Smith',
    applicantsCount: 8,
    createdAt: '2023-06-10T00:00:00Z',
    updatedAt: '2023-06-18T00:00:00Z',
    deadline: '2023-07-25T00:00:00Z',
    clientName: 'Global Finance Ltd.',
    salary: {
      min: 90000,
      max: 110000,
      currency: 'USD'
    },
    requirements: [
      '3+ years of experience in sales',
      'Proven track record of meeting or exceeding sales targets',
      'Strong negotiation and relationship-building skills',
      'Bachelor\'s degree in Business, Sales, or related field'
    ],
    responsibilities: [
      'Develop and maintain client relationships',
      'Identify and pursue new business opportunities',
      'Negotiate contracts and close deals',
      'Meet or exceed sales targets'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Professional development opportunities'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },

  {
    id: 'JOB-003',
    title: 'Sales Representative',
    description: 'We are looking for a Sales Representative to join our growing team...',
    department: 'Sales',
    departmentId: 'dept-2',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    status: 'filled',
    priority: 'high',
    assignedTo: 'user-21', // Taylor Smith (Account Executive)
    assignedToName: 'Taylor Smith',
    applicantsCount: 15,
    createdAt: '2023-05-20T00:00:00Z',
    updatedAt: '2023-06-30T00:00:00Z',
    deadline: '2023-06-30T00:00:00Z',
    clientName: 'Retail Solutions Co.',
    salary: {
      min: 70000,
      max: 90000,
      currency: 'USD'
    },
    requirements: [
      '2+ years of sales experience',
      'Strong communication skills',
      'Self-motivated and goal-oriented',
      'Bachelor\'s degree preferred'
    ],
    responsibilities: [
      'Generate new sales leads',
      'Meet or exceed sales targets',
      'Maintain customer relationships',
      'Provide product demonstrations'
    ],
    benefits: [
      'Competitive base salary + commission',
      'Health insurance',
      '401(k) matching',
      'Sales training and development'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },

  {
    id: 'JOB-004',
    title: 'Recruitment Specialist',
    description: 'We are looking for a Recruitment Specialist to help us find and attract top talent...',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-1',
    location: 'Miami Headquarters',
    locationId: 'loc-1',
    status: 'published',
    priority: 'high',
    assignedTo: 'user-20', // Jordan Lee (Recruitment Specialist)
    assignedToName: 'Jordan Lee',
    applicantsCount: 7,
    createdAt: '2023-05-15T00:00:00Z',
    updatedAt: '2023-06-25T00:00:00Z',
    deadline: '2023-07-15T00:00:00Z',
    clientName: 'InnoTech Systems',
    salary: {
      min: 80000,
      max: 100000,
      currency: 'USD'
    },
    requirements: [
      '2+ years of recruitment experience',
      'Experience with applicant tracking systems',
      'Strong communication and interpersonal skills',
      'Knowledge of talent acquisition strategies'
    ],
    responsibilities: [
      'Source and screen candidates',
      'Conduct initial interviews',
      'Coordinate with hiring managers',
      'Manage candidate pipeline'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Remote work options'
    ],
    isRemote: true,
    employmentType: 'full-time'
  },

  // New York Office
  {
    id: 'JOB-005',
    title: 'Senior Account Executive',
    description: 'We are seeking a Senior Account Executive to drive sales and manage key client relationships...',
    department: 'Sales',
    departmentId: 'dept-4',
    location: 'New York Office',
    locationId: 'loc-2',
    status: 'published',
    priority: 'high',
    assignedTo: 'user-29', // Casey Wilson (Account Executive)
    assignedToName: 'Casey Wilson',
    applicantsCount: 9,
    createdAt: '2023-06-05T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z',
    deadline: '2023-07-20T00:00:00Z',
    clientName: 'Manhattan Financial Group',
    salary: {
      min: 100000,
      max: 130000,
      currency: 'USD'
    },
    clientBudget: 110,
    companyProfit: 38.5,
    companyProfitPercentage: 35,
    candidateOffer: 71.5,
    consultancyFee: 21.45,
    consultancyFeePercentage: 30,
    finalCandidateRate: 50.05,
    requirements: [
      '5+ years of sales experience',
      'Proven track record of exceeding sales targets',
      'Strong negotiation and relationship-building skills',
      'Experience in the recruitment or staffing industry preferred'
    ],
    responsibilities: [
      'Develop and maintain client relationships',
      'Identify and pursue new business opportunities',
      'Negotiate contracts and close deals',
      'Meet or exceed sales targets'
    ],
    benefits: [
      'Competitive salary + commission',
      'Health insurance',
      '401(k) matching',
      'Professional development opportunities'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },
  {
    id: 'JOB-006',
    title: 'Recruitment Team Lead',
    description: 'We are looking for a Recruitment Team Lead to manage our recruitment team and drive hiring strategies...',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-3',
    location: 'New York Office',
    locationId: 'loc-2',
    status: 'published',
    priority: 'high',
    assignedTo: 'user-28', // Jamie Rivera (Recruitment Specialist)
    assignedToName: 'Jamie Rivera',
    applicantsCount: 6,
    createdAt: '2023-06-08T00:00:00Z',
    updatedAt: '2023-06-18T00:00:00Z',
    deadline: '2023-07-22T00:00:00Z',
    clientName: 'East Coast Enterprises',
    salary: {
      min: 110000,
      max: 140000,
      currency: 'USD'
    },
    clientBudget: 120,
    companyProfit: 42,
    companyProfitPercentage: 35,
    candidateOffer: 78,
    consultancyFee: 23.4,
    consultancyFeePercentage: 30,
    finalCandidateRate: 54.6,
    requirements: [
      '5+ years of recruitment experience',
      '2+ years of team leadership experience',
      'Strong understanding of recruitment processes and strategies',
      'Experience with applicant tracking systems'
    ],
    responsibilities: [
      'Lead and manage a team of recruitment specialists',
      'Develop and implement recruitment strategies',
      'Build relationships with hiring managers',
      'Ensure recruitment targets are met'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Professional development opportunities'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },

  // San Francisco Branch
  {
    id: 'JOB-007',
    title: 'Technical Recruiter',
    description: 'We are seeking a Technical Recruiter to help us find and attract top tech talent...',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-5',
    location: 'San Francisco Branch',
    locationId: 'loc-3',
    status: 'published',
    priority: 'medium',
    assignedTo: 'user-30', // Avery Thomas (Recruitment Specialist)
    assignedToName: 'Avery Thomas',
    applicantsCount: 4,
    createdAt: '2023-06-12T00:00:00Z',
    updatedAt: '2023-06-22T00:00:00Z',
    deadline: '2023-07-25T00:00:00Z',
    clientName: 'Silicon Valley Tech',
    salary: {
      min: 90000,
      max: 110000,
      currency: 'USD'
    },
    clientBudget: 100,
    companyProfit: 35,
    companyProfitPercentage: 35,
    candidateOffer: 65,
    consultancyFee: 19.5,
    consultancyFeePercentage: 30,
    finalCandidateRate: 45.5,
    requirements: [
      '3+ years of technical recruitment experience',
      'Understanding of technical roles and skills',
      'Experience with sourcing techniques for tech talent',
      'Strong communication and interpersonal skills'
    ],
    responsibilities: [
      'Source and screen technical candidates',
      'Conduct initial technical interviews',
      'Coordinate with hiring managers',
      'Manage candidate pipeline'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Remote work options'
    ],
    isRemote: true,
    employmentType: 'full-time'
  },
  {
    id: 'JOB-008',
    title: 'Business Development Manager',
    description: 'We are looking for a Business Development Manager to expand our client base in the tech sector...',
    department: 'Sales',
    departmentId: 'dept-6',
    location: 'San Francisco Branch',
    locationId: 'loc-3',
    status: 'draft',
    priority: 'high',
    assignedTo: 'user-31', // Quinn Martinez (Account Executive)
    assignedToName: 'Quinn Martinez',
    applicantsCount: 0,
    createdAt: '2023-06-25T00:00:00Z',
    updatedAt: '2023-06-25T00:00:00Z',
    deadline: '2023-08-01T00:00:00Z',
    clientName: 'Bay Area Innovations',
    salary: {
      min: 110000,
      max: 140000,
      currency: 'USD'
    },
    clientBudget: 125,
    companyProfit: 43.75,
    companyProfitPercentage: 35,
    candidateOffer: 81.25,
    consultancyFee: 24.38,
    consultancyFeePercentage: 30,
    finalCandidateRate: 56.87,
    requirements: [
      '5+ years of business development experience',
      'Experience in the tech sector',
      'Strong network of industry contacts',
      'Proven track record of meeting or exceeding sales targets'
    ],
    responsibilities: [
      'Identify and pursue new business opportunities',
      'Build and maintain relationships with key clients',
      'Develop and implement business development strategies',
      'Meet or exceed sales targets'
    ],
    benefits: [
      'Competitive salary + commission',
      'Health insurance',
      '401(k) matching',
      'Remote work options'
    ],
    isRemote: true,
    employmentType: 'full-time'
  },

  // Chicago Office
  {
    id: 'JOB-009',
    title: 'Talent Acquisition Specialist',
    description: 'We are looking for a Talent Acquisition Specialist to join our Chicago recruitment team...',
    department: 'Marketing (Recruitment)',
    departmentId: 'dept-7',
    location: 'Chicago Office',
    locationId: 'loc-4',
    status: 'published',
    priority: 'medium',
    assignedTo: 'user-32', // Cameron Lopez (Recruitment Specialist)
    assignedToName: 'Cameron Lopez',
    applicantsCount: 3,
    createdAt: '2023-06-20T00:00:00Z',
    updatedAt: '2023-06-28T00:00:00Z',
    deadline: '2023-07-28T00:00:00Z',
    clientName: 'Midwest Industries',
    salary: {
      min: 75000,
      max: 95000,
      currency: 'USD'
    },
    clientBudget: 90,
    companyProfit: 31.5,
    companyProfitPercentage: 35,
    candidateOffer: 58.5,
    consultancyFee: 17.55,
    consultancyFeePercentage: 30,
    finalCandidateRate: 40.95,
    requirements: [
      '2+ years of recruitment experience',
      'Experience with applicant tracking systems',
      'Strong communication and interpersonal skills',
      'Bachelor\'s degree in Human Resources or related field'
    ],
    responsibilities: [
      'Source and screen candidates',
      'Conduct initial interviews',
      'Coordinate with hiring managers',
      'Manage candidate pipeline'
    ],
    benefits: [
      'Competitive salary',
      'Health insurance',
      '401(k) matching',
      'Professional development opportunities'
    ],
    isRemote: false,
    employmentType: 'full-time'
  },
  {
    id: 'JOB-010',
    title: 'Sales Development Representative',
    description: 'We are seeking a Sales Development Representative to generate leads and qualify prospects...',
    department: 'Sales',
    departmentId: 'dept-8',
    location: 'Chicago Office',
    locationId: 'loc-4',
    status: 'published',
    priority: 'medium',
    assignedTo: 'user-33', // Riley Patel (Account Executive)
    assignedToName: 'Riley Patel',
    applicantsCount: 5,
    createdAt: '2023-06-18T00:00:00Z',
    updatedAt: '2023-06-26T00:00:00Z',
    deadline: '2023-07-26T00:00:00Z',
    clientName: 'Great Lakes Corp',
    salary: {
      min: 65000,
      max: 85000,
      currency: 'USD'
    },
    clientBudget: 80,
    companyProfit: 28,
    companyProfitPercentage: 35,
    candidateOffer: 52,
    consultancyFee: 15.6,
    consultancyFeePercentage: 30,
    finalCandidateRate: 36.4,
    requirements: [
      '1+ years of sales experience',
      'Strong communication skills',
      'Self-motivated and goal-oriented',
      'Bachelor\'s degree preferred'
    ],
    responsibilities: [
      'Generate leads through outbound prospecting',
      'Qualify prospects and schedule meetings for Account Executives',
      'Research potential clients',
      'Meet or exceed sales development targets'
    ],
    benefits: [
      'Competitive base salary + commission',
      'Health insurance',
      '401(k) matching',
      'Sales training and development'
    ],
    isRemote: false,
    employmentType: 'full-time'
  }
];

// Mock data for job candidates
export const mockJobCandidates: JobCandidate[] = [
  {
    id: 'candidate-1',
    jobId: 'job-1',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    resumeUrl: '/resumes/alex-johnson.pdf',
    status: 'interview',
    notes: 'Strong recruitment experience, good cultural fit',
    appliedAt: '2023-06-16T00:00:00Z',
    lastUpdated: '2023-06-22T00:00:00Z'
  },
  {
    id: 'candidate-2',
    jobId: 'job-1',
    name: 'Sam Smith',
    email: 'sam.smith@example.com',
    phone: '(555) 234-5678',
    resumeUrl: '/resumes/sam-smith.pdf',
    status: 'screening',
    notes: 'Good experience, needs further assessment',
    appliedAt: '2023-06-17T00:00:00Z',
    lastUpdated: '2023-06-20T00:00:00Z'
  },
  {
    id: 'candidate-3',
    jobId: 'job-2',
    name: 'Jamie Garcia',
    email: 'jamie.garcia@example.com',
    phone: '(555) 345-6789',
    resumeUrl: '/resumes/jamie-garcia.pdf',
    status: 'offer',
    notes: 'Excellent sales experience, great communicator',
    appliedAt: '2023-06-12T00:00:00Z',
    lastUpdated: '2023-06-25T00:00:00Z'
  },
  {
    id: 'candidate-4',
    jobId: 'job-2',
    name: 'Taylor Chen',
    email: 'taylor.chen@example.com',
    phone: '(555) 456-7890',
    resumeUrl: '/resumes/taylor-chen.pdf',
    status: 'new',
    notes: 'Strong sales background, needs initial screening',
    appliedAt: '2023-06-18T00:00:00Z',
    lastUpdated: '2023-06-18T00:00:00Z'
  },
  {
    id: 'candidate-5',
    jobId: 'job-4',
    name: 'Morgan Davis',
    email: 'morgan.davis@example.com',
    phone: '(555) 567-8901',
    resumeUrl: '/resumes/morgan-davis.pdf',
    status: 'screening',
    notes: 'Good recruitment background, promising candidate',
    appliedAt: '2023-06-10T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: 'candidate-6',
    jobId: 'job-3',
    name: 'Casey Wilson',
    email: 'casey.wilson@example.com',
    phone: '(555) 678-9012',
    resumeUrl: '/resumes/casey-wilson.pdf',
    status: 'hired',
    notes: 'Excellent sales background, great cultural fit',
    appliedAt: '2023-05-25T00:00:00Z',
    lastUpdated: '2023-06-28T00:00:00Z'
  },
  {
    id: 'candidate-7',
    jobId: 'job-5',
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 789-0123',
    resumeUrl: '/resumes/alex-johnson.pdf',
    status: 'interview',
    notes: 'Strong sales experience, excellent communication skills',
    appliedAt: '2023-06-08T00:00:00Z',
    lastUpdated: '2023-06-18T00:00:00Z'
  },
  {
    id: 'candidate-8',
    jobId: 'job-6',
    name: 'Jordan Smith',
    email: 'jordan.smith@example.com',
    phone: '(555) 890-1234',
    resumeUrl: '/resumes/jordan-smith.pdf',
    status: 'screening',
    notes: 'Extensive recruitment leadership experience',
    appliedAt: '2023-06-12T00:00:00Z',
    lastUpdated: '2023-06-20T00:00:00Z'
  },
  {
    id: 'candidate-9',
    jobId: 'job-7',
    name: 'Taylor Chen',
    email: 'taylor.chen@example.com',
    phone: '(555) 901-2345',
    resumeUrl: '/resumes/taylor-chen.pdf',
    status: 'new',
    notes: 'Strong technical recruitment background',
    appliedAt: '2023-06-15T00:00:00Z',
    lastUpdated: '2023-06-15T00:00:00Z'
  },
  {
    id: 'candidate-10',
    jobId: 'job-9',
    name: 'Riley Morgan',
    email: 'riley.morgan@example.com',
    phone: '(555) 012-3456',
    resumeUrl: '/resumes/riley-morgan.pdf',
    status: 'screening',
    notes: 'Good recruitment experience, strong interpersonal skills',
    appliedAt: '2023-06-22T00:00:00Z',
    lastUpdated: '2023-06-25T00:00:00Z'
  },
  {
    id: 'candidate-11',
    jobId: 'job-10',
    name: 'Jamie Davis',
    email: 'jamie.davis@example.com',
    phone: '(555) 123-4567',
    resumeUrl: '/resumes/jamie-davis.pdf',
    status: 'interview',
    notes: 'Promising sales background, high energy',
    appliedAt: '2023-06-20T00:00:00Z',
    lastUpdated: '2023-06-27T00:00:00Z'
  }
];

// Helper functions
export const getJobListingsByLocationId = (locationId: string): JobListing[] => {
  return mockJobListings.filter(job => job.locationId === locationId);
};

export const getJobListingsByAssignedUser = (userId: string): JobListing[] => {
  return mockJobListings.filter(job => job.assignedTo === userId);
};

export const getJobCandidatesByJobId = (jobId: string): JobCandidate[] => {
  return mockJobCandidates.filter(candidate => candidate.jobId === jobId);
};

export const getJobListingById = (jobId: string): JobListing | undefined => {
  return mockJobListings.find(job => job.id === jobId);
};

// Status color mapping for UI
export const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800';
    case 'published':
      return 'bg-blue-100 text-blue-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'on-hold':
      return 'bg-purple-100 text-purple-800';
    case 'filled':
      return 'bg-green-100 text-green-800';
    case 'closed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Priority color mapping for UI
export const getPriorityColor = (priority: JobPriority): string => {
  switch (priority) {
    case 'low':
      return 'bg-gray-100 text-gray-800';
    case 'medium':
      return 'bg-blue-100 text-blue-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'urgent':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Scenario-specific status labels
export const getStatusLabel = (status: JobStatus): string => {
  switch (status) {
    case 'draft':
      return 'Pending Approval';
    case 'published':
      return 'Active';
    case 'in-progress':
      return 'Interviewing';
    case 'on-hold':
      return 'Paused';
    case 'filled':
      return 'Placement Made';
    case 'closed':
      return 'Cancelled';
    default:
      return String(status).charAt(0).toUpperCase() + String(status).slice(1);
  }
};
