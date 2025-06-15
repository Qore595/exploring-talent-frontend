// Organization structure types

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  hiringManagerIds: string[]; // IDs of hiring managers assigned to this location
  departmentIds: string[]; // IDs of departments in this location
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  locationId: string; // ID of the location this department belongs to
  teamLeadId: string | null; // ID of the team lead (can be null)
  memberCount: number; // Number of team members
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  departmentId: string;
  avatar?: string;
  hireDate: string;
  skills: string[];
  status: 'active' | 'inactive';
}

// Mock data for locations
export const mockLocations: Location[] = [
  {
    id: 'loc-1',
    name: 'Miami Headquarters',
    address: '123 Ocean Drive',
    city: 'Miami',
    state: 'FL',
    zipCode: '33139',
    country: 'USA',
    hiringManagerIds: ['user-2', 'user-6'],
    departmentIds: ['dept-1', 'dept-2'],
    createdAt: '2023-01-15T00:00:00Z',
    updatedAt: '2023-06-10T00:00:00Z'
  },
  {
    id: 'loc-2',
    name: 'New York Office',
    address: '456 Broadway',
    city: 'New York',
    state: 'NY',
    zipCode: '10013',
    country: 'USA',
    hiringManagerIds: ['user-7'],
    departmentIds: ['dept-3', 'dept-4'],
    createdAt: '2023-02-20T00:00:00Z',
    updatedAt: '2023-06-15T00:00:00Z'
  },
  {
    id: 'loc-3',
    name: 'San Francisco Branch',
    address: '789 Market Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    country: 'USA',
    hiringManagerIds: ['user-8'],
    departmentIds: ['dept-5', 'dept-6'],
    createdAt: '2023-03-10T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z'
  },
  {
    id: 'loc-4',
    name: 'Chicago Office',
    address: '321 Michigan Avenue',
    city: 'Chicago',
    state: 'IL',
    zipCode: '60601',
    country: 'USA',
    hiringManagerIds: ['user-9'],
    departmentIds: ['dept-7', 'dept-8'],
    createdAt: '2023-04-05T00:00:00Z',
    updatedAt: '2023-06-25T00:00:00Z'
  }
];

// Mock data for departments
export const mockDepartments: Department[] = [
  // Miami Headquarters
  {
    id: 'dept-1',
    name: 'Marketing (Recruitment)',
    description: 'Handles recruitment marketing, candidate sourcing, and employer branding',
    locationId: 'loc-1',
    teamLeadId: 'user-11',
    memberCount: 8,
    createdAt: '2023-01-25T00:00:00Z',
    updatedAt: '2023-06-14T00:00:00Z'
  },
  {
    id: 'dept-2',
    name: 'Sales',
    description: 'Responsible for client acquisition and relationship management',
    locationId: 'loc-1',
    teamLeadId: 'user-14',
    memberCount: 10,
    createdAt: '2023-03-01T00:00:00Z',
    updatedAt: '2023-06-20T00:00:00Z'
  },

  // New York Office
  {
    id: 'dept-3',
    name: 'Marketing (Recruitment)',
    description: 'Handles recruitment marketing, candidate sourcing, and employer branding',
    locationId: 'loc-2',
    teamLeadId: 'user-22',
    memberCount: 6,
    createdAt: '2023-02-25T00:00:00Z',
    updatedAt: '2023-06-16T00:00:00Z'
  },
  {
    id: 'dept-4',
    name: 'Sales',
    description: 'Responsible for client acquisition and relationship management',
    locationId: 'loc-2',
    teamLeadId: 'user-23',
    memberCount: 7,
    createdAt: '2023-02-28T00:00:00Z',
    updatedAt: '2023-06-18T00:00:00Z'
  },

  // San Francisco Branch
  {
    id: 'dept-5',
    name: 'Marketing (Recruitment)',
    description: 'Handles recruitment marketing, candidate sourcing, and employer branding',
    locationId: 'loc-3',
    teamLeadId: 'user-24',
    memberCount: 5,
    createdAt: '2023-03-15T00:00:00Z',
    updatedAt: '2023-06-22T00:00:00Z'
  },
  {
    id: 'dept-6',
    name: 'Sales',
    description: 'Responsible for client acquisition and relationship management',
    locationId: 'loc-3',
    teamLeadId: 'user-25',
    memberCount: 6,
    createdAt: '2023-03-18T00:00:00Z',
    updatedAt: '2023-06-24T00:00:00Z'
  },

  // Chicago Office
  {
    id: 'dept-7',
    name: 'Marketing (Recruitment)',
    description: 'Handles recruitment marketing, candidate sourcing, and employer branding',
    locationId: 'loc-4',
    teamLeadId: 'user-26',
    memberCount: 4,
    createdAt: '2023-04-10T00:00:00Z',
    updatedAt: '2023-06-26T00:00:00Z'
  },
  {
    id: 'dept-8',
    name: 'Sales',
    description: 'Responsible for client acquisition and relationship management',
    locationId: 'loc-4',
    teamLeadId: 'user-27',
    memberCount: 5,
    createdAt: '2023-04-12T00:00:00Z',
    updatedAt: '2023-06-28T00:00:00Z'
  }
];

// Mock data for team members
export const mockTeamMembers: TeamMember[] = [
  // Miami Headquarters - Marketing (Recruitment)
  {
    id: 'user-11',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Recruitment Marketing Director',
    departmentId: 'dept-1',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-07-10',
    skills: ['Talent Acquisition', 'Employer Branding', 'Candidate Sourcing'],
    status: 'active'
  },
  {
    id: 'user-20',
    name: 'Jordan Lee',
    email: 'jordan.lee@example.com',
    role: 'Recruitment Specialist',
    departmentId: 'dept-1',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-08-15',
    skills: ['Candidate Screening', 'Job Description Writing', 'Talent Sourcing'],
    status: 'active'
  },

  // Miami Headquarters - Sales
  {
    id: 'user-14',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Sales Director',
    departmentId: 'dept-2',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-10-20',
    skills: ['Client Acquisition', 'Relationship Management', 'Sales Strategy'],
    status: 'active'
  },
  {
    id: 'user-21',
    name: 'Taylor Smith',
    email: 'taylor.smith@example.com',
    role: 'Account Executive',
    departmentId: 'dept-2',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-09-10',
    skills: ['Client Acquisition', 'Contract Negotiation', 'Relationship Building'],
    status: 'active'
  },

  // New York Office - Marketing (Recruitment)
  {
    id: 'user-22',
    name: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    role: 'Recruitment Team Lead',
    departmentId: 'dept-3',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-06-15',
    skills: ['Team Leadership', 'Recruitment Strategy', 'Talent Assessment'],
    status: 'active'
  },
  {
    id: 'user-28',
    name: 'Jamie Rivera',
    email: 'jamie.rivera@example.com',
    role: 'Recruitment Specialist',
    departmentId: 'dept-3',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-08-20',
    skills: ['Candidate Screening', 'Interview Coordination', 'Talent Sourcing'],
    status: 'active'
  },

  // New York Office - Sales
  {
    id: 'user-23',
    name: 'Riley Johnson',
    email: 'riley.johnson@example.com',
    role: 'Sales Team Lead',
    departmentId: 'dept-4',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-07-01',
    skills: ['Sales Leadership', 'Client Relationship', 'Revenue Growth'],
    status: 'active'
  },
  {
    id: 'user-29',
    name: 'Casey Wilson',
    email: 'casey.wilson@example.com',
    role: 'Account Executive',
    departmentId: 'dept-4',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-09-15',
    skills: ['Client Acquisition', 'Sales Negotiation', 'Account Management'],
    status: 'active'
  },

  // San Francisco Branch - Marketing (Recruitment)
  {
    id: 'user-24',
    name: 'Morgan Chen',
    email: 'morgan.chen@example.com',
    role: 'Recruitment Team Lead',
    departmentId: 'dept-5',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-08-10',
    skills: ['Recruitment Strategy', 'Team Management', 'Talent Acquisition'],
    status: 'active'
  },
  {
    id: 'user-30',
    name: 'Avery Thomas',
    email: 'avery.thomas@example.com',
    role: 'Recruitment Specialist',
    departmentId: 'dept-5',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-10-05',
    skills: ['Candidate Sourcing', 'Resume Screening', 'Interview Coordination'],
    status: 'active'
  },

  // San Francisco Branch - Sales
  {
    id: 'user-25',
    name: 'Jordan Taylor',
    email: 'jordan.taylor@example.com',
    role: 'Sales Team Lead',
    departmentId: 'dept-6',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-09-01',
    skills: ['Sales Strategy', 'Team Leadership', 'Client Relationship'],
    status: 'active'
  },
  {
    id: 'user-31',
    name: 'Quinn Martinez',
    email: 'quinn.martinez@example.com',
    role: 'Account Executive',
    departmentId: 'dept-6',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-11-10',
    skills: ['Client Acquisition', 'Sales Negotiation', 'Account Management'],
    status: 'active'
  },

  // Chicago Office - Marketing (Recruitment)
  {
    id: 'user-26',
    name: 'Taylor Reed',
    email: 'taylor.reed@example.com',
    role: 'Recruitment Team Lead',
    departmentId: 'dept-7',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-10-15',
    skills: ['Recruitment Strategy', 'Team Management', 'Talent Acquisition'],
    status: 'active'
  },
  {
    id: 'user-32',
    name: 'Cameron Lopez',
    email: 'cameron.lopez@example.com',
    role: 'Recruitment Specialist',
    departmentId: 'dept-7',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-12-01',
    skills: ['Candidate Sourcing', 'Resume Screening', 'Interview Coordination'],
    status: 'active'
  },

  // Chicago Office - Sales
  {
    id: 'user-27',
    name: 'Drew Garcia',
    email: 'drew.garcia@example.com',
    role: 'Sales Team Lead',
    departmentId: 'dept-8',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2022-11-01',
    skills: ['Sales Strategy', 'Team Leadership', 'Client Relationship'],
    status: 'active'
  },
  {
    id: 'user-33',
    name: 'Riley Patel',
    email: 'riley.patel@example.com',
    role: 'Account Executive',
    departmentId: 'dept-8',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    hireDate: '2023-01-10',
    skills: ['Client Acquisition', 'Sales Negotiation', 'Account Management'],
    status: 'active'
  }
];

// Helper function to get departments by location ID
export const getDepartmentsByLocationId = (locationId: string): Department[] => {
  return mockDepartments.filter(dept => dept.locationId === locationId);
};

// Helper function to get team members by department ID
export const getTeamMembersByDepartmentId = (departmentId: string): TeamMember[] => {
  return mockTeamMembers.filter(member => member.departmentId === departmentId);
};

// Helper function to get team lead by department ID
export const getTeamLeadByDepartmentId = (departmentId: string): TeamMember | undefined => {
  const department = mockDepartments.find(dept => dept.id === departmentId);
  if (!department || !department.teamLeadId) return undefined;

  return mockTeamMembers.find(member => member.id === department.teamLeadId);
};

// Helper function to get location by ID
export const getLocationById = (locationId: string): Location | undefined => {
  return mockLocations.find(location => location.id === locationId);
};

// Helper function to get department by ID
export const getDepartmentById = (departmentId: string): Department | undefined => {
  return mockDepartments.find(department => department.id === departmentId);
};
