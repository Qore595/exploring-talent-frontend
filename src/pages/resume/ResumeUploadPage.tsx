
import { useState, useCallback, useEffect } from 'react';
import { Upload, FileUp, X, Check, FileText, Clock, Calendar, User, Briefcase, GraduationCap, Award, Tag, Eye, Download, Trash2, Phone, Mail, Info, MapPin, Building, ExternalLink } from 'lucide-react';
import { mockUploadResumeToServer } from './mockUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { toast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fileToText, parseResume, ParsedResume } from '@/utils/resumeParser';
import { mockLocations, getLocationById } from '@/types/organization';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CandidateInviteDialog from '@/components/resume/CandidateInviteDialog';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

// Define the Candidate interface
interface Candidate {
  id: string;
  name: string;
  position: string;
  skills: string[];
  status: string;
  matchScore: number;
  avatar?: string;
}

// Mock candidates (matching results after upload)
const matchedCandidates: Candidate[] = [
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
    position: 'Software Engineer',
    skills: ['JavaScript', 'Python', 'Docker'],
    status: 'screening',
    matchScore: 87,
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Morgan Chen',
    position: 'Frontend Developer',
    skills: ['React', 'CSS', 'UI/UX'],
    status: 'screening',
    matchScore: 85,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '4',
    name: 'Alex Wong',
    position: 'Backend Developer',
    skills: ['Node.js', 'MongoDB', 'Express'],
    status: 'screening',
    matchScore: 81,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Mock candidates for database view
const mockCandidates: Candidate[] = [
  {
    id: '5',
    name: 'Jamie Garcia',
    position: 'Product Manager',
    skills: ['Product Strategy', 'Agile', 'User Research'],
    status: 'available',
    matchScore: 0,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '6',
    name: 'Riley Johnson',
    position: 'UX Designer',
    skills: ['UI/UX', 'Figma', 'User Testing'],
    status: 'available',
    matchScore: 0,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '7',
    name: 'Casey Martinez',
    position: 'Data Scientist',
    skills: ['Python', 'Machine Learning', 'SQL'],
    status: 'available',
    matchScore: 0,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

// Define a type for user information
interface UserInfo {
  id: string;
  name: string;
  role: 'CEO' | 'Branch Manager' | 'Marketing Head' | 'Marketing Supervisor' | 'Marketing Recruiter' | 'Marketing Associate';
  avatar?: string;
}

// Define a type for the uploaded resume with additional metadata
interface UploadedResume {
  file: File;
  parsedData: ParsedResume;
  uploadDate: Date;
  id: string;
  status: 'processing' | 'completed' | 'error';
  uploadedBy: UserInfo;
  locationId?: string; // ID of the location this resume is associated with
  locationName?: string; // Name of the location (for display purposes)
  resumeUrl?: string; // URL to access the resume file (from server or local blob)
  fileName?: string; // Generated filename for the resume
  serverFilePath?: string; // Physical path where the file is stored on the server
}

// Mock users for demonstration
const mockUsers: UserInfo[] = [
  {
    id: 'user-1',
    name: 'John Smith',
    role: 'CEO',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'user-2',
    name: 'Sarah Johnson',
    role: 'Branch Manager',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'user-3',
    name: 'Michael Brown',
    role: 'Marketing Recruiter',
    avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'user-4',
    name: 'Emily Davis',
    role: 'Marketing Associate',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

/**
 * ResumeUploadPage - Handles resume uploads and displays uploaded resumes
 * Allows users to upload, view, and manage candidate resumes based on user role
 */
const ResumeUploadPage = () => {
  // State for file upload and processing
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // State for uploaded resumes
  const [uploadedResumes, setUploadedResumes] = useState<UploadedResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);

  // State for candidate invitation
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [candidateToInvite, setCandidateToInvite] = useState<{name: string, email: string} | null>(null);

  // Get the authenticated user from the auth context
  const { user } = useAuth();

  // State for location selection (for CEO users)
  const [selectedLocationId, setSelectedLocationId] = useState<string>(mockLocations[0].id);
  const [selectedLocation, setSelectedLocation] = useState(mockLocations[0]);

  // Create a currentUser object from the authenticated user
  const currentUser: UserInfo = {
    id: user?.id || 'unknown',
    name: user?.name || 'Unknown User',
    role: (user?.role === 'ceo' ? 'CEO' :
          user?.role === 'branch-manager' ? 'Branch Manager' :
          user?.role === 'marketing-head' ? 'Marketing Head' :
          user?.role === 'marketing-supervisor' ? 'Marketing Supervisor' :
          user?.role === 'marketing-recruiter' ? 'Marketing Recruiter' :
          'Marketing Associate') as UserInfo['role'],
    avatar: user?.avatar
  };

  // Check if user is admin (CEO or Branch Manager)
  const isAdmin = user?.role === 'ceo' || user?.role === 'branch-manager';

  // Check if user is CEO (needs location selector)
  const isCEO = user?.role === 'ceo';

  // Generate a unique ID for each resume
  const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  // No longer need the changeUser function since we're using real authentication

  // Sample resume data for demonstration
  const sampleResumeData = [
    {
      id: 'resume-1',
      parsedData: {
        name: 'John Anderson',
        email: 'john.anderson@example.com',
        phone: '(555) 123-4567',
        summary: 'Experienced software engineer with 8+ years of experience in full-stack development.',
        skills: ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
        experience: [
          {
            position: 'Senior Software Engineer',
            company: 'Tech Innovations Inc.',
            duration: '2019 - Present',
            responsibilities: [
              'Led development of customer-facing web applications using React and Node.js',
              'Implemented CI/CD pipelines using GitHub Actions',
              'Mentored junior developers and conducted code reviews'
            ]
          },
          {
            position: 'Software Developer',
            company: 'Digital Solutions LLC',
            duration: '2015 - 2019',
            responsibilities: [
              'Developed and maintained RESTful APIs',
              'Collaborated with UX designers to implement responsive interfaces',
              'Optimized database queries for improved performance'
            ]
          }
        ],
        education: [
          {
            degree: 'B.S. Computer Science',
            institution: 'University of Technology',
            year: '2015'
          }
        ],
        certifications: ['AWS Certified Developer', 'MongoDB Certified Developer']
      },
      uploadDate: new Date('2023-05-15'),
      status: 'completed',
      uploadedBy: mockUsers[0], // CEO
      file: new File(['dummy content'], 'john_anderson_resume.pdf', { type: 'application/pdf' }),
      locationId: 'loc-1',
      locationName: 'Miami Headquarters'
    },
    {
      id: 'resume-2',
      parsedData: {
        name: 'Sarah Williams',
        email: 'sarah.williams@example.com',
        phone: '(555) 987-6543',
        summary: 'Marketing professional with expertise in digital marketing and brand strategy.',
        skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media', 'Google Analytics', 'Adobe Creative Suite'],
        experience: [
          {
            position: 'Marketing Manager',
            company: 'Brand Forward',
            duration: '2018 - Present',
            responsibilities: [
              'Developed and executed comprehensive marketing strategies',
              'Managed a team of 5 marketing specialists',
              'Increased website traffic by 45% through SEO optimization'
            ]
          },
          {
            position: 'Digital Marketing Specialist',
            company: 'Creative Marketing Group',
            duration: '2016 - 2018',
            responsibilities: [
              'Managed social media accounts and created engaging content',
              'Analyzed campaign performance using Google Analytics',
              'Collaborated with design team on brand assets'
            ]
          }
        ],
        education: [
          {
            degree: 'B.A. Marketing',
            institution: 'State University',
            year: '2016'
          }
        ],
        certifications: ['Google Analytics Certified', 'HubSpot Inbound Marketing']
      },
      uploadDate: new Date('2023-06-22'),
      status: 'completed',
      uploadedBy: mockUsers[2], // Marketing Recruiter
      file: new File(['dummy content'], 'sarah_williams_resume.pdf', { type: 'application/pdf' }),
      locationId: 'loc-2',
      locationName: 'New York Office'
    },
    {
      id: 'resume-3',
      parsedData: {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '(555) 456-7890',
        summary: 'Data scientist with strong background in machine learning and statistical analysis.',
        skills: ['Python', 'R', 'Machine Learning', 'SQL', 'TensorFlow', 'Data Visualization', 'Statistical Analysis'],
        experience: [
          {
            position: 'Senior Data Scientist',
            company: 'Data Insights Corp',
            duration: '2020 - Present',
            responsibilities: [
              'Developed predictive models for customer behavior analysis',
              'Created data pipelines for automated reporting',
              'Presented findings to executive stakeholders'
            ]
          },
          {
            position: 'Data Analyst',
            company: 'Analytics Partners',
            duration: '2017 - 2020',
            responsibilities: [
              'Performed statistical analysis on large datasets',
              'Created interactive dashboards using Tableau',
              'Collaborated with cross-functional teams on business intelligence initiatives'
            ]
          }
        ],
        education: [
          {
            degree: 'M.S. Data Science',
            institution: 'Tech Institute',
            year: '2017'
          },
          {
            degree: 'B.S. Statistics',
            institution: 'National University',
            year: '2015'
          }
        ],
        certifications: ['TensorFlow Developer Certificate', 'AWS Certified Data Analytics']
      },
      uploadDate: new Date('2023-07-10'),
      status: 'completed',
      uploadedBy: mockUsers[1], // Branch Manager
      file: new File(['dummy content'], 'michael_chen_resume.pdf', { type: 'application/pdf' }),
      locationId: 'loc-3',
      locationName: 'San Francisco Branch'
    },
    {
      id: 'resume-4',
      parsedData: {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '(555) 789-0123',
        summary: 'UX/UI designer with a passion for creating intuitive and accessible user experiences.',
        skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Prototyping', 'Wireframing', 'Accessibility'],
        experience: [
          {
            position: 'UX/UI Designer',
            company: 'Creative Design Studio',
            duration: '2019 - Present',
            responsibilities: [
              'Designed user interfaces for web and mobile applications',
              'Conducted user research and usability testing',
              'Created design systems and component libraries'
            ]
          },
          {
            position: 'Web Designer',
            company: 'Digital Agency',
            duration: '2017 - 2019',
            responsibilities: [
              'Designed responsive websites for clients across industries',
              'Collaborated with developers to ensure design implementation',
              'Created visual assets and branding materials'
            ]
          }
        ],
        education: [
          {
            degree: 'B.F.A. Graphic Design',
            institution: 'Art Institute',
            year: '2017'
          }
        ],
        certifications: ['Certified UX Designer', 'Accessibility Specialist']
      },
      uploadDate: new Date('2023-08-05'),
      status: 'completed',
      uploadedBy: mockUsers[3], // Marketing Associate
      file: new File(['dummy content'], 'emily_rodriguez_resume.pdf', { type: 'application/pdf' }),
      locationId: 'loc-4',
      locationName: 'Chicago Office'
    }
  ];

  // Update selected location when locationId changes
  useEffect(() => {
    const location = mockLocations.find(loc => loc.id === selectedLocationId);
    if (location) {
      setSelectedLocation(location);
    }
  }, [selectedLocationId]);

  // Load saved resumes from localStorage on component mount or when user changes
  useEffect(() => {
    try {
      // Check if we already have resumes in localStorage
      const savedResumes = localStorage.getItem('uploadedResumes');

      if (savedResumes) {
        // Parse the saved resumes
        const parsedResumes = JSON.parse(savedResumes);

        // Process each resume to restore File objects and dates
        const processedResumes = parsedResumes.map((resume: any) => {
          // Create a new resume object with the correct date
          const processedResume = {
            ...resume,
            uploadDate: new Date(resume.uploadDate)
          };

          // If we have file information but not a real File object
          if (resume.file && typeof resume.file === 'object' && !(resume.file instanceof File)) {
            // Create a placeholder File object
            try {
              // Create a new File object if possible
              const fileData = new Uint8Array(10); // Empty placeholder
              processedResume.file = new File([fileData], resume.file.name || 'resume.pdf', {
                type: resume.file.type || 'application/pdf'
              });
            } catch (fileError) {
              console.error('Error creating File object:', fileError);
              // Keep the file info as is if we can't create a File object
            }
          }

          return processedResume;
        });

        // Filter resumes based on user role
        // Admin users (CEO, Branch Manager) can see all resumes
        // Other users can only see their own uploads
        if (isAdmin) {
          setUploadedResumes(processedResumes);
        } else {
          // Filter to only show resumes uploaded by the current user
          const filteredResumes = processedResumes.filter(
            (resume: UploadedResume) => resume.uploadedBy.id === currentUser.id
          );
          setUploadedResumes(filteredResumes);
        }

        console.log('Loaded', processedResumes.length, 'resumes from localStorage');
      } else {
        // If no resumes in localStorage, add sample data for demonstration
        localStorage.setItem('uploadedResumes', JSON.stringify(sampleResumeData));

        // Filter sample data based on user role
        if (isAdmin) {
          setUploadedResumes(sampleResumeData);
        } else {
          const filteredSamples = sampleResumeData.filter(
            resume => resume.uploadedBy.id === currentUser.id
          );
          setUploadedResumes(filteredSamples);
        }
      }
    } catch (error) {
      console.error('Error loading saved resumes:', error);
    }
  }, [currentUser.id, isAdmin]);

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newFiles = Array.from(e.dataTransfer.files);
    handleNewFiles(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      handleNewFiles(newFiles);
    }
  };

  const handleNewFiles = async (newFiles: File[]) => {
    // Check file types and sizes
    const maxSizeMB = 10; // 10MB max file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const validFiles: File[] = [];
    const invalidFiles: {name: string, reason: string}[] = [];

    newFiles.forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const isValidType = ext === 'pdf' || ext === 'doc' || ext === 'docx';
      const isValidSize = file.size <= maxSizeBytes;

      if (!isValidType) {
        invalidFiles.push({
          name: file.name,
          reason: `Invalid file type. Only PDF, DOC, and DOCX files are accepted.`
        });
      } else if (!isValidSize) {
        invalidFiles.push({
          name: file.name,
          reason: `File exceeds maximum size of ${maxSizeMB}MB.`
        });
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      // Show detailed error messages for each invalid file
      invalidFiles.forEach(file => {
        toast({
          title: `Error with file: ${file.name}`,
          description: file.reason,
          variant: "destructive",
        });
      });
    }

    setFiles(prev => [...prev, ...validFiles]);

    // Auto-parse and upload new files
    setParsing(true);
    try {
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];

        // Parse the resume text
        const text = await fileToText(file);
        const parsedResume = parseResume(text);

        try {
          // Upload the file to the server
          // Using the user ID as the employee ID for this demo
          const employeeId = user?.id || 'user-1';
          const uploadResult = await uploadResumeToServer(file, employeeId);

          // Create a new uploaded resume entry with current user information and location
          const newResume: UploadedResume = {
            file: file,
            parsedData: parsedResume,
            uploadDate: new Date(),
            id: generateId(),
            status: 'completed',
            uploadedBy: {
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.role,
              avatar: currentUser.avatar
            },
            // Store the server URL from the response
            resumeUrl: uploadResult.data.fullFileUrl,
            // Store the generated filename
            fileName: uploadResult.data.fileName,
            // For CEO users, use the selected location
            // For Branch Managers, use their assigned location (in a real app, this would come from user data)
            locationId: isCEO ? selectedLocationId :
                      (currentUser.role === 'Branch Manager' ? 'loc-2' : undefined),
            locationName: isCEO ? selectedLocation.name :
                        (currentUser.role === 'Branch Manager' ? 'New York Office' : undefined),
            // Store the server file path for reference
            serverFilePath: uploadResult.data.filePath
          };

          // Add to the uploaded resumes list
          setUploadedResumes(prev => {
            // Get all existing resumes from localStorage first
            let allResumes: UploadedResume[] = [];
            try {
              const savedResumes = localStorage.getItem('uploadedResumes');
              if (savedResumes) {
                allResumes = JSON.parse(savedResumes).map((resume: any) => ({
                  ...resume,
                  uploadDate: new Date(resume.uploadDate)
                }));
              }
            } catch (error) {
              console.error('Error loading existing resumes:', error);
            }

            // Add the new resume
            const updated = [...allResumes, newResume];

            // Save all resumes to localStorage
            try {
              // Create a serializable version of the resume without the File object
              const serializableResumes = updated.map(resume => ({
                ...resume,
                file: {
                  name: resume.file.name,
                  type: resume.file.type,
                  size: resume.file.size,
                },
                uploadDate: resume.uploadDate.toISOString(),
              }));
              localStorage.setItem('uploadedResumes', JSON.stringify(serializableResumes));
            } catch (error) {
              console.error('Error saving resumes to localStorage:', error);
            }

            // Return only the resumes this user should see based on role
            if (isAdmin) {
              return updated;
            } else {
              return updated.filter(resume => resume.uploadedBy.id === currentUser.id);
            }
          });
        } catch (uploadError) {
          console.error('Error uploading file to server:', uploadError);
          toast({
            title: `Upload Error: ${file.name}`,
            description: uploadError.message || "Failed to upload file to server",
            variant: "destructive",
          });
        }
      }

      // Show detailed success message with location information
      toast({
        title: "Resume Upload Successful",
        description: (
          <div className="space-y-1">
            <p>{`${validFiles.length} resume${validFiles.length > 1 ? 's' : ''} uploaded to server successfully`}</p>
            <p className="text-xs text-muted-foreground">Uploaded by {currentUser.name} ({currentUser.role})</p>
            {(isCEO || currentUser.role === 'Branch Manager') && (
              <p className="text-xs text-muted-foreground">
                Location: {isCEO ? selectedLocation.name : 'New York Office'}
              </p>
            )}
            <p className="text-xs text-muted-foreground">Timestamp: {new Date().toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Files saved to server at: C:\Users\pitti\Downloads\QORE-main\upload</p>
          </div>
        ),
      });
    } catch (error) {
      toast({
        title: "Parsing Error",
        description: "An error occurred while parsing the resume",
        variant: "destructive",
      });
    } finally {
      setParsing(false);
      // Clear the files array after processing
      setFiles([]);
    }
  };

  const removeResume = (id: string) => {
    // Get the resume to be removed
    const resumeToRemove = uploadedResumes.find(resume => resume.id === id);

    // Check if the current user has permission to remove this resume
    // Admin users can remove any resume, other users can only remove their own
    if (!resumeToRemove || (!isAdmin && resumeToRemove.uploadedBy.id !== currentUser.id)) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to remove this resume",
        variant: "destructive",
      });
      return;
    }

    // Get all resumes from localStorage
    let allResumes: UploadedResume[] = [];
    try {
      const savedResumes = localStorage.getItem('uploadedResumes');
      if (savedResumes) {
        allResumes = JSON.parse(savedResumes).map((resume: any) => ({
          ...resume,
          uploadDate: new Date(resume.uploadDate)
        }));
      }
    } catch (error) {
      console.error('Error loading existing resumes:', error);
    }

    // Remove the resume
    const updatedAllResumes = allResumes.filter(resume => resume.id !== id);

    // Save updated list to localStorage
    try {
      localStorage.setItem('uploadedResumes', JSON.stringify(updatedAllResumes));
    } catch (error) {
      console.error('Error saving resumes to localStorage:', error);
    }

    // Update state with filtered resumes based on user role
    setUploadedResumes(prev => {
      const updated = prev.filter(resume => resume.id !== id);
      return updated;
    });

    if (selectedResumeId === id) {
      setSelectedResumeId(null);
    }

    toast({
      title: "Resume Removed",
      description: "The resume has been removed from uploads",
    });
  };

  const viewResumeDetails = (id: string) => {
    setSelectedResumeId(id);
    setIsResumeDialogOpen(true);
  };

  // Function to invite a candidate
  const inviteCandidate = (id: string) => {
    const resume = uploadedResumes.find(r => r.id === id);
    if (!resume) return;

    setCandidateToInvite({
      name: resume.parsedData.name,
      email: resume.parsedData.email
    });
    setIsInviteDialogOpen(true);
  };

  // Function to upload a resume to the server
  const uploadResumeToServer = async (file: File, employeeId: string) => {
    try {
      console.log('Starting file upload to server...');
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type
      });
      console.log('Employee ID:', employeeId);

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      // Note: We're not appending employeeId to FormData as we're sending it in the URL
      // This is because the Vite plugin is using URL params instead of form data

      console.log('FormData created with file appended');
      console.log('Will send employeeId in URL:', employeeId);

      try {
        // Make the API call to the direct upload endpoint with employeeId as URL parameter
        const response = await fetch(`/direct-upload?employeeId=${encodeURIComponent(employeeId)}`, {
          method: 'POST',
          body: formData,
        });

        console.log('Response received:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Server response:', data);

        // If the server upload was successful, return the response
        if (data.success) {
          return data;
        }

        throw new Error(data.message || 'Unknown server error');
      } catch (serverError) {
        console.log('Server upload failed, using client-side fallback:', serverError);

        // Create a local URL for the file as fallback
        const fileUrl = URL.createObjectURL(file);

        // Generate a unique filename with employee ID
        const fileExtension = file.name.split('.').pop() || '';
        const fileName = `employee_${employeeId}_${Date.now()}.${fileExtension}`;

        // Create a success response with local file information
        const fallbackResponse = {
          success: true,
          message: 'Resume processed successfully (client-side)',
          data: {
            fileName: fileName,
            originalName: file.name,
            fileUrl: fileUrl,
            fullFileUrl: fileUrl,
            filePath: `C:\\Users\\pitti\\Downloads\\QORE-main\\upload\\${fileName}`,
            size: file.size,
            mimetype: file.type
          }
        };

        console.log('File processed successfully (client-side):', fallbackResponse);

        // Return the fallback response
        return fallbackResponse;
      }
    } catch (error) {
      console.error('Error processing file:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one resume to upload",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Process each file and upload to server
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Log file details
        console.log('Processing file:', file.name, 'Size:', file.size, 'Type:', file.type);

        // Calculate progress based on current file
        const progressPerFile = 100 / files.length;
        const baseProgress = i * progressPerFile;

        // Update progress to show we're starting to process this file
        setUploadProgress(baseProgress);

        try {
          // Parse the resume text locally first
          const text = await fileToText(file);
          const parsedResume = parseResume(text);

          // Update progress to show we've parsed the file
          setUploadProgress(baseProgress + (progressPerFile * 0.3));

          // Upload the file to the server
          // Using the user ID as the employee ID for this demo
          const employeeId = user?.id || 'user-1';
          console.log('Uploading file with employee ID:', employeeId);
          const uploadResult = await uploadResumeToServer(file, employeeId);
          console.log('Upload result:', uploadResult);

          // Update progress to show we've uploaded the file
          setUploadProgress(baseProgress + (progressPerFile * 0.8));

          // Create a new uploaded resume entry with current user information
          const newResume = {
            file: file,
            parsedData: parsedResume,
            uploadDate: new Date(),
            id: generateId(),
            status: 'completed',
            uploadedBy: {
              id: currentUser.id,
              name: currentUser.name,
              role: currentUser.role,
              avatar: currentUser.avatar
            },
            // Store the server URL from the response
            resumeUrl: uploadResult.data.fullFileUrl,
            // Store the generated filename
            fileName: uploadResult.data.fileName,
            locationId: isCEO ? selectedLocationId : undefined,
            locationName: isCEO ? selectedLocation.name : undefined,
            // Store the server file path for reference
            serverFilePath: uploadResult.data.filePath
          };

          // Add to the uploaded resumes list
          const updatedResumes = [...uploadedResumes, newResume];
          setUploadedResumes(updatedResumes);

          // Save to localStorage for persistence
          try {
            // We need to create a serializable version of the resume without the File object
            const serializableResumes = updatedResumes.map(resume => ({
              ...resume,
              file: {
                name: resume.file.name,
                type: resume.file.type,
                size: resume.file.size,
              },
              uploadDate: resume.uploadDate.toISOString(),
            }));
            localStorage.setItem('uploadedResumes', JSON.stringify(serializableResumes));
            console.log('Saved resumes to localStorage');
          } catch (storageError) {
            console.error('Error saving to localStorage:', storageError);
          }

        } catch (processError) {
          console.error('Error processing file:', processError);
          throw processError;
        }

        // Update progress to show we've completed this file
        setUploadProgress(baseProgress + progressPerFile);
      }

      // Set progress to 100% when all files are processed
      setUploadProgress(100);

      // Clear the file input
      setFiles([]);

      toast({
        title: "Resume Upload Successful",
        description: `${files.length} resume${files.length > 1 ? 's' : ''} uploaded to server successfully.`,
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: error.message || "An error occurred while uploading the resume to the server",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Function to download a resume
  const downloadResume = (id: string) => {
    const resume = uploadedResumes.find(r => r.id === id);
    if (!resume) return;

    // Make sure we have file information
    if (!resume.file) {
      toast({
        title: "Error",
        description: "File information is not available",
        variant: "destructive",
      });
      return;
    }

    // Get the file name safely
    const fileName = resume.file.name || "resume.pdf";

    // Check if we have a server URL for the resume
    if (resume.resumeUrl) {
      console.log('Downloading from server URL:', resume.resumeUrl);

      // Create a download link to the server URL
      const a = document.createElement('a');
      a.href = resume.resumeUrl;
      a.target = '_blank'; // Open in new tab
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      toast({
        title: "Download Started",
        description: `Downloading ${fileName} from server`,
      });
    } else if (resume.file instanceof File) {
      // Fallback to local file if server URL is not available
      console.log('Downloading from local file object');

      // Create a download link from the file object
      const url = URL.createObjectURL(resume.file);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Started",
        description: `Downloading ${fileName} from local cache`,
      });
    } else {
      toast({
        title: "Error",
        description: "Unable to download file - no valid source found",
        variant: "destructive",
      });
    }
  };

  // Function to clear all resumes
  const clearAllResumes = () => {
    if (confirm('Are you sure you want to remove all uploaded resumes? This action cannot be undone.')) {
      if (isAdmin) {
        // Admin can clear all resumes
        setUploadedResumes([]);
        localStorage.removeItem('uploadedResumes');

        toast({
          title: "All Resumes Removed",
          description: "All resumes have been cleared from the system",
        });
      } else {
        // Non-admin users can only clear their own resumes
        // Get all resumes from localStorage
        let allResumes: UploadedResume[] = [];
        try {
          const savedResumes = localStorage.getItem('uploadedResumes');
          if (savedResumes) {
            allResumes = JSON.parse(savedResumes).map((resume: any) => ({
              ...resume,
              uploadDate: new Date(resume.uploadDate)
            }));
          }
        } catch (error) {
          console.error('Error loading existing resumes:', error);
        }

        // Filter out the current user's resumes
        const updatedResumes = allResumes.filter(resume => resume.uploadedBy.id !== currentUser.id);

        // Save updated list to localStorage
        try {
          localStorage.setItem('uploadedResumes', JSON.stringify(updatedResumes));
        } catch (error) {
          console.error('Error saving resumes to localStorage:', error);
        }

        // Clear the user's view
        setUploadedResumes([]);

        toast({
          title: "Your Resumes Removed",
          description: "All resumes uploaded by you have been cleared",
        });
      }
    }
  };

  // State for PDF viewer dialog
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  // Function to view the resume in a new tab
  const viewResumeFile = (id: string) => {
    const resume = uploadedResumes.find(r => r.id === id);
    if (!resume) return;

    // Get the URL to the file
    let fileUrl = '';

    if (resume.resumeUrl) {
      // Use the stored URL if available (this will be a local blob URL for locally processed files)
      fileUrl = resume.resumeUrl;
      console.log('Using stored resumeUrl:', fileUrl);
    } else if (resume.file instanceof File) {
      // Create a new blob URL if we have the file object but no URL
      fileUrl = URL.createObjectURL(resume.file);
      console.log('Created new blob URL from file object:', fileUrl);
    } else {
      // If no file information is available, show an error
      toast({
        title: "Error",
        description: "File information is not available",
        variant: "destructive",
      });
      return;
    }

    // Check if this is a PDF file
    const isPdf = resume.file && resume.file.name ?
      resume.file.name.toLowerCase().endsWith('.pdf') : false;

    // For PDF files, we can also show in an embedded viewer
    if (isPdf) {
      setPdfUrl(fileUrl);
      setPdfViewerOpen(true);
    }

    console.log('Opening resume URL:', fileUrl);

    if (isPdf) {
      console.log('Opening PDF file:', fileUrl);

      // For PDFs, open in a new tab and also show in the embedded viewer
      window.open(fileUrl, '_blank');

      toast({
        title: "Opening PDF",
        description: "PDF is also available in the embedded viewer",
        duration: 3000,
      });
    } else {
      // For other file types, just open in a new tab
      window.open(fileUrl, '_blank');

      toast({
        title: "Opening Resume",
        description: `Opening ${resume.file.name} in a new tab`,
      });
    }
  };

  const renderResumeDetails = useCallback(() => {
    if (!selectedResumeId) return null;

    const resume = uploadedResumes.find(r => r.id === selectedResumeId);
    if (!resume) return null;

    const { parsedData } = resume;

    return (
      <ScrollArea className="h-[80vh] pr-4">
        <div className="space-y-6 p-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">{parsedData.name}</h3>
              <div className="space-y-1 mt-2">
                <p className="text-sm flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {parsedData.email}
                </p>
                {parsedData.phone && (
                  <p className="text-sm flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    {parsedData.phone}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => viewResumeFile(resume.id)}>
                      <FileText className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View Resume File</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => downloadResume(resume.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Download Resume</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Upload Date</p>
                <p className="text-sm font-medium">{format(resume.uploadDate, 'MMM d, yyyy')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">File Name</p>
                <p className="text-sm font-medium truncate max-w-[200px]">
                  {resume.fileName || resume.file.name}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Uploaded By</p>
                <div className="flex items-center gap-1">
                  <Avatar className="h-4 w-4">
                    {resume.uploadedBy.avatar ? (
                      <AvatarImage src={resume.uploadedBy.avatar} alt={resume.uploadedBy.name} />
                    ) : (
                      <AvatarFallback>{resume.uploadedBy.name.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <p className="text-sm font-medium">{resume.uploadedBy.name}</p>
                  <Badge variant="outline" className="text-xs ml-1 h-5">
                    {resume.uploadedBy.role}
                  </Badge>
                </div>
              </div>
            </div>
            {resume.locationId && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{resume.locationName}</p>
                </div>
              </div>
            )}

            {/* Show server file path if available */}
            {resume.serverFilePath && (
              <div className="flex items-center col-span-full">
                <Info className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Server File Path</p>
                  <p className="text-sm font-medium truncate max-w-full">{resume.serverFilePath}</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {parsedData.summary && (
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                Summary
              </h4>
              <p className="text-sm bg-muted/20 p-3 rounded-md">{parsedData.summary}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Tag className="h-4 w-4" />
              Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {parsedData.skills.map((skill, i) => (
                <Badge key={i} variant="outline" className="capitalize">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4" />
              Experience
            </h4>
            <div className="space-y-4">
              {parsedData.experience.map((exp, i) => (
                <div key={i} className="bg-muted/20 p-3 rounded-md space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{exp.position}</p>
                    <Badge variant="outline">{exp.duration}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                  <ul className="text-sm list-disc pl-5 space-y-1">
                    {exp.responsibilities.map((resp, j) => (
                      <li key={j}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <GraduationCap className="h-4 w-4" />
              Education
            </h4>
            <div className="space-y-2">
              {parsedData.education.map((edu, i) => (
                <div key={i} className="bg-muted/20 p-3 rounded-md space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{edu.degree}</p>
                    <Badge variant="outline">{edu.year}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                </div>
              ))}
            </div>
          </div>

          {parsedData.certifications && parsedData.certifications.length > 0 && (
            <div>
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Award className="h-4 w-4" />
                Certifications
              </h4>
              <div className="space-y-2">
                {parsedData.certifications.map((cert, i) => (
                  <div key={i} className="bg-muted/20 p-3 rounded-md">
                    <p className="font-medium">{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    );
  }, [selectedResumeId, uploadedResumes]);

  // State for tab management
  const [activeTab, setActiveTab] = useState<string>("upload");

  // PDF Viewer Dialog
  const PdfViewerDialog = () => {
    if (!pdfViewerOpen) return null;

    return (
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] h-[90vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-4 py-2 border-b">
            <div className="flex items-center justify-between w-full">
              <DialogTitle>PDF Viewer</DialogTitle>
              <DialogClose className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-gray-100">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
                sandbox="allow-same-origin allow-scripts allow-forms"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No PDF file to display</p>
              </div>
            )}
          </div>
          <div className="p-2 border-t flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              This is a local PDF file stored in your browser's memory.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(pdfUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Open in New Tab
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Create a download link
                  const a = document.createElement('a');
                  a.href = pdfUrl;
                  a.download = "resume.pdf";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* PDF Viewer Dialog */}
      <PdfViewerDialog />

      <div className="border-b pb-3 md:pb-4 mb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Resume Management</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage candidate resumes
            </p>
          </div>

          {/* User Info Display */}
          <div className="flex items-center gap-3 self-end md:self-auto">
            <div className="text-right">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser.role}</p>
            </div>
            <Avatar className="h-8 w-8 md:h-10 md:w-10">
              {currentUser.avatar ? (
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              ) : (
                <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
          </div>
        </div>
      </div>

      {/* Role Switcher (Demo Only) - Hidden by default */}
      <div className="bg-muted/30 p-3 rounded-lg mb-4 border border-dashed">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium">Demo Mode</h3>
              <p className="text-xs text-muted-foreground">Switch between different user roles to see how the interface changes</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {mockUsers.map(user => (
              <Button
                key={user.id}
                variant={user.id === currentUser.id ? "default" : "outline"}
                size="sm"
                onClick={() => changeUser(user.id)}
                className="flex items-center gap-1 text-xs h-8"
              >
                <Avatar className="h-4 w-4 md:h-5 md:w-5">
                  {user.avatar ? (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  ) : (
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <span className="truncate max-w-[80px] md:max-w-none">{user.role}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs for Upload and View */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Resumes
          </TabsTrigger>
          <TabsTrigger value="view" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Uploaded Resumes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4 md:mt-6">
          <Card>
            <CardHeader className="px-4 md:px-6 py-4 md:py-6">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                <Upload className="h-5 w-5" />
                Upload Resumes
              </CardTitle>
              <CardDescription>
                Upload candidate resumes to parse and store in the system
              </CardDescription>
            </CardHeader>
          <CardContent className="px-4 md:px-6 space-y-4">
            {/* Location Selector for CEO */}
            {isCEO && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mb-4">
                <h3 className="font-medium text-sm mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Select Location for Resume Upload
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    As CEO, you need to specify which location these resumes should be associated with.
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    <Select
                      value={selectedLocationId}
                      onValueChange={setSelectedLocationId}
                    >
                      <SelectTrigger className="w-full">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Select a location" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {mockLocations.map(location => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedLocation && (
                      <div className="bg-muted/30 p-2 rounded-md text-xs text-muted-foreground">
                        <p className="font-medium text-foreground">Selected Location:</p>
                        <p>{selectedLocation.name}</p>
                        <p>{selectedLocation.address}, {selectedLocation.city}, {selectedLocation.state} {selectedLocation.zipCode}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-muted/30 p-4 rounded-lg border border-muted">
              <h3 className="font-medium text-sm mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                Upload Instructions
              </h3>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                <li>Accepted file formats: <span className="font-medium text-foreground">.pdf, .doc, .docx</span></li>
                <li>Maximum file size: <span className="font-medium text-foreground">10MB per file</span></li>
                <li>You can upload multiple files at once</li>
                <li>Uploaded resumes will be automatically parsed to extract candidate information</li>
                <li>All uploads are tracked with your user information and timestamp</li>
                {isCEO && (
                  <li>Resumes will be associated with the <span className="font-medium text-foreground">selected location</span></li>
                )}
              </ul>

              {/* Test links for debugging */}
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <h4 className="text-sm font-medium text-yellow-700 mb-2">Debug Links</h4>
                <div className="flex flex-col gap-2">
                  <a
                    href="/test"
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Test Server Connection
                  </a>
                  <a
                    href="/upload/test.txt"
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Test File Access
                  </a>
                  <a
                    href="/list-uploads"
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    List All Uploaded Files
                  </a>
                  <a
                    href="/api/resumes/debug/list-files"
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Debug Resume Files
                  </a>
                  <a
                    href="/upload/test-write-permission.txt"
                    target="_blank"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Test Write Permission File
                  </a>
                </div>
              </div>
            </div>

            {/* Drop Zone */}
            <div
              className="border-2 border-dashed rounded-lg p-4 md:p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden group"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={() => document.getElementById('fileInput')?.click()}
              aria-label="Drop zone for resume files"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  document.getElementById('fileInput')?.click();
                }
              }}
            >
              <div className="absolute inset-0 bg-primary/5 scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom" aria-hidden="true"></div>
              <Upload className="h-8 w-8 md:h-10 md:w-10 text-muted-foreground mx-auto mb-2 md:mb-3 relative z-10" />
              <h3 className="font-medium mb-1 relative z-10">Drag & Drop Files Here</h3>
              <p className="text-sm text-muted-foreground mb-2 md:mb-3 relative z-10">
                or click to browse files
              </p>
              <Input
                id="fileInput"
                type="file"
                multiple
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                aria-label="File input for resumes"
              />
              <Button variant="outline" size="sm" className="relative z-10">
                <FileUp className="mr-2 h-4 w-4" />
                Select Files
              </Button>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium text-sm">Selected Files ({files.length})</h3>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${index}`}
                      className="flex items-center justify-between bg-muted p-3 rounded-md hover:bg-muted/80"
                    >
                      <div className="flex items-center overflow-hidden">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary/10 rounded-md flex items-center justify-center">
                          <FileUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-3 overflow-hidden">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-0.5 space-x-2">
                            <span>{(file.size / 1024).toFixed(0)} KB</span>
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              <span className="truncate max-w-[120px]">Will be uploaded by {currentUser.name}</span>
                            </span>
                            {(isCEO || currentUser.role === 'Branch Manager') && (
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-[120px]">
                                  {isCEO ? selectedLocation.name : 'New York Office'}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFiles(prev => prev.filter((_, i) => i !== index));
                        }}
                        className="h-8 w-8 p-0"
                        aria-label={`Remove ${file.name}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}

                  <div className="bg-muted/20 p-2 rounded-md mt-2">
                    <p className="text-xs text-muted-foreground flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      All uploads are tracked with your user information and timestamp for audit purposes
                    </p>
                  </div>
                </div>
              </div>
            )}

            {uploading && (
              <div className="space-y-2 bg-muted/30 p-3 rounded-md border border-muted animate-pulse">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Uploading and parsing resumes...
                  </span>
                  <span className="font-medium">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2.5" />
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Files will be automatically parsed to extract candidate information
                </p>
              </div>
            )}

            <Button
              className="w-full relative overflow-hidden group"
              disabled={uploading || parsing || files.length === 0}
              onClick={handleUpload}
              aria-label="Upload selected resume files"
            >
              {uploading ? (
                <div className="flex items-center justify-center">
                  <Clock className="animate-spin h-4 w-4 mr-2" />
                  Processing...
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-primary-foreground/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" aria-hidden="true"></div>
                  <Upload className="mr-2 h-4 w-4 relative z-10" />
                  <span className="relative z-10">Upload {files.length} Resume{files.length !== 1 ? 's' : ''}</span>
                </>
              )}
            </Button>

            {files.length === 0 && !uploading && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Select files to upload by dragging and dropping or using the file browser
              </p>
            )}
          </CardContent>
        </Card>

        {/* Uploaded Resumes Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Resumes
                </CardTitle>
                <CardDescription>
                  View and manage all uploaded candidate resumes
                </CardDescription>
              </div>
              {uploadedResumes.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAllResumes}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {uploadedResumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium mb-1">No Resumes Uploaded Yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Upload resumes using the form on the left to see them listed here
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Skills</TableHead>
                      {isAdmin && <TableHead>Uploaded By</TableHead>}
                      {isAdmin && <TableHead>Location</TableHead>}
                      <TableHead>Upload Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedResumes.map((resume) => (
                      <TableRow key={resume.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{resume.parsedData.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{resume.parsedData.name}</p>
                              <p className="text-xs text-muted-foreground">{resume.parsedData.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {resume.parsedData.skills.slice(0, 3).map((skill, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {resume.parsedData.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{resume.parsedData.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        {isAdmin && (
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                {resume.uploadedBy.avatar ? (
                                  <AvatarImage src={resume.uploadedBy.avatar} alt={resume.uploadedBy.name} />
                                ) : (
                                  <AvatarFallback>{resume.uploadedBy.name.charAt(0)}</AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{resume.uploadedBy.name}</p>
                                <p className="text-xs text-muted-foreground">{resume.uploadedBy.role}</p>
                              </div>
                            </div>
                          </TableCell>
                        )}
                        {isAdmin && (
                          <TableCell>
                            {resume.locationName ? (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{resume.locationName}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">Not specified</span>
                            )}
                          </TableCell>
                        )}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{format(resume.uploadDate, 'MMM d, yyyy')}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => viewResumeDetails(resume.id)}>
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => viewResumeFile(resume.id)}
                              className={resume.file && resume.file.name ? (resume.file.name.toLowerCase().endsWith('.pdf') ? "bg-red-50 hover:bg-red-100 border-red-200" : "") : ""}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              {resume.file && resume.file.name ? (resume.file.name.toLowerCase().endsWith('.pdf') ? "View PDF" : "View File") : "View File"}
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => downloadResume(resume.id)}>
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeResume(resume.id)}
                              disabled={!isAdmin && resume.uploadedBy.id !== currentUser.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="view" className="mt-4 md:mt-6">
          <Card>
            <CardHeader className="px-4 md:px-6 py-4 md:py-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <FileText className="h-5 w-5" />
                    Uploaded Resumes
                  </CardTitle>
                  <CardDescription>
                    {isAdmin
                      ? "View and manage all uploaded resumes across the organization"
                      : "View and manage your uploaded resumes"}
                  </CardDescription>
                </div>
                {uploadedResumes.length > 0 && (
                  <Button variant="outline" size="sm" onClick={clearAllResumes} className="self-start md:self-auto">
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isAdmin ? "Clear All" : "Clear My Uploads"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              {uploadedResumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 md:py-12 text-center">
                  <FileText className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-3 md:mb-4" />
                  <h3 className="font-medium mb-1">No Resumes Uploaded Yet</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md">
                    {isAdmin
                      ? "No resumes have been uploaded to the system yet"
                      : "You haven't uploaded any resumes yet"}
                  </p>
                  <Button onClick={() => setActiveTab("upload")}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Resumes
                  </Button>
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead className="hidden md:table-cell">Skills</TableHead>
                        {isAdmin && <TableHead className="hidden lg:table-cell">Uploaded By</TableHead>}
                        {isAdmin && <TableHead className="hidden lg:table-cell">Location</TableHead>}
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedResumes.map((resume) => (
                        <TableRow key={resume.id}>
                          <TableCell>
                            <div className="flex items-center gap-2 md:gap-3">
                              <Avatar className="h-7 w-7 md:h-8 md:w-8">
                                <AvatarFallback>{resume.parsedData.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm md:text-base">{resume.parsedData.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[120px] md:max-w-none">{resume.parsedData.email}</p>
                                <div className="md:hidden text-xs text-muted-foreground mt-1 flex items-center space-x-2">
                                  <span>{format(resume.uploadDate, 'MM/dd/yy')}</span>
                                  {isAdmin && resume.locationName && (
                                    <span className="flex items-center">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {resume.locationName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-wrap gap-1 max-w-[150px] lg:max-w-[200px]">
                              {resume.parsedData.skills.slice(0, 3).map((skill, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {resume.parsedData.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{resume.parsedData.skills.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          {isAdmin && (
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                  {resume.uploadedBy.avatar ? (
                                    <AvatarImage src={resume.uploadedBy.avatar} alt={resume.uploadedBy.name} />
                                  ) : (
                                    <AvatarFallback>{resume.uploadedBy.name.charAt(0)}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium">{resume.uploadedBy.name}</p>
                                  <p className="text-xs text-muted-foreground">{resume.uploadedBy.role}</p>
                                </div>
                              </div>
                            </TableCell>
                          )}
                          {isAdmin && (
                            <TableCell className="hidden lg:table-cell">
                              {resume.locationName ? (
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">{resume.locationName}</span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">Not specified</span>
                              )}
                            </TableCell>
                          )}
                          <TableCell className="hidden md:table-cell">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{format(resume.uploadDate, 'MMM d, yyyy')}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1 md:gap-2">
                              <Button variant="outline" size="sm" onClick={() => viewResumeDetails(resume.id)} className="h-8 w-8 md:w-auto md:px-3">
                                <Eye className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">Details</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => viewResumeFile(resume.id)}
                                className={`h-8 w-8 md:w-auto md:px-3 ${resume.file && resume.file.name ? (resume.file.name.toLowerCase().endsWith('.pdf') ? "bg-red-50 hover:bg-red-100 border-red-200" : "") : ""}`}
                              >
                                <FileText className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">{resume.file && resume.file.name ? (resume.file.name.toLowerCase().endsWith('.pdf') ? "PDF" : "File") : "File"}</span>
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => downloadResume(resume.id)} className="h-8 w-8 md:w-auto md:px-3">
                                <Download className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">Download</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => inviteCandidate(resume.id)}
                                className="h-8 w-8 md:w-auto md:px-3"
                              >
                                <Mail className="h-4 w-4 md:mr-1" />
                                <span className="hidden md:inline">Invite</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeResume(resume.id)}
                                disabled={!isAdmin && resume.uploadedBy.id !== currentUser.id}
                                className="h-8 w-8 md:w-auto md:px-3"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resume Details Dialog */}
      <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-4xl max-h-[90vh] overflow-hidden p-4 md:p-6">
          <DialogHeader className="pb-2 md:pb-4">
            <DialogTitle className="text-lg md:text-xl">Resume Details</DialogTitle>
            <DialogDescription>
              Detailed information extracted from the resume
            </DialogDescription>
          </DialogHeader>
          {renderResumeDetails()}
        </DialogContent>
      </Dialog>

      {/* Candidate Invite Dialog */}
      {candidateToInvite && (
        <CandidateInviteDialog
          isOpen={isInviteDialogOpen}
          onClose={() => {
            setIsInviteDialogOpen(false);
            setCandidateToInvite(null);
          }}
          candidateName={candidateToInvite.name}
          candidateEmail={candidateToInvite.email}
        />
      )}
    </div>
  );
};

export default ResumeUploadPage;
