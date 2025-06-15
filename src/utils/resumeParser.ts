
// Resume parser utility to extract skills, experience, and other relevant information from resume files

export interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  summary?: string;
}

export interface Experience {
  company: string;
  position: string;
  duration: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

// Mock skills database for keyword matching
const skillsDatabase = [
  // Programming Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php', 'swift',
  // Web Technologies
  'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask', 'spring', 
  'asp.net', 'jquery', 'bootstrap', 'tailwind', 'redux', 'graphql', 'rest api',
  // Database Technologies
  'sql', 'mysql', 'postgresql', 'mongodb', 'firebase', 'dynamodb', 'redis', 'elasticsearch',
  'cassandra', 'oracle', 'sql server',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'gitlab ci/cd', 'github actions',
  'terraform', 'ansible', 'linux', 'nginx', 'apache',
  // Data Science & ML
  'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy',
  'r', 'tableau', 'power bi', 'data visualization', 'nlp', 'computer vision', 'statistics',
  // Design & UX
  'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux', 'wireframing', 'prototyping',
  'user research', 'accessibility',
  // Project Management
  'agile', 'scrum', 'jira', 'trello', 'asana', 'kanban', 'waterfall', 'prince2', 'pmp',
  // Soft Skills
  'teamwork', 'leadership', 'communication', 'problem-solving', 'time management', 'creativity',
  'critical thinking', 'presentation', 'negotiation'
];

/**
 * Parse resume text content to extract skills and other information
 * This is a mock implementation that would normally involve NLP or ML techniques
 * In a real implementation, we would use a more sophisticated parser
 */
export const parseResume = (fileContent: string): ParsedResume => {
  const content = fileContent.toLowerCase();
  
  // Extract skills by looking for matches in our skills database
  const skills = skillsDatabase.filter(skill => content.includes(skill.toLowerCase()));
  
  // Mock other data that would normally be extracted with ML/NLP
  const parsedResume: ParsedResume = {
    name: extractName(fileContent),
    email: extractEmail(fileContent),
    phone: extractPhone(fileContent),
    skills: skills,
    experience: extractExperience(fileContent),
    education: extractEducation(fileContent),
    summary: extractSummary(fileContent)
  };
  
  return parsedResume;
};

/**
 * Simulate parsing a PDF or Doc file to text
 * In a real implementation, we would use PDF.js, docx.js, or similar libraries
 */
export const fileToText = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate file reading delay
    setTimeout(() => {
      // Generate mock content based on filename
      const filename = file.name.toLowerCase();
      
      let mockContent = `
        John Doe
        john.doe@example.com
        (555) 123-4567
        
        Summary
        Experienced software developer with over 5 years in web development.
        
        Experience
        Senior Developer at Tech Corp
        2020-Present
        - Led development of React applications
        - Implemented CI/CD pipelines using GitHub Actions
        - Optimized database queries in PostgreSQL
        
        Developer at Startup Inc
        2018-2020
        - Built RESTful APIs using Node.js and Express
        - Developed front-end components with Angular
        - Worked in an Agile team environment
        
        Education
        Master of Computer Science
        University of Technology
        2018
        
        Bachelor of Software Engineering
        State University
        2016
        
        Skills
        JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, MongoDB, AWS, Docker,
        Git, CI/CD, Agile, Scrum, REST API, GraphQL, HTML, CSS
      `;
      
      // Add skills based on filename to simulate different resumes
      if (filename.includes('java')) {
        mockContent += ' Java, Spring Boot, Hibernate, Maven, Jenkins';
      } else if (filename.includes('python')) {
        mockContent += ' Python, Django, Flask, NumPy, Pandas, TensorFlow';
      } else if (filename.includes('data')) {
        mockContent += ' Data Science, Machine Learning, SQL, Tableau, R, Statistics';
      } else if (filename.includes('design')) {
        mockContent += ' UI/UX, Figma, Adobe XD, Sketch, User Research, Wireframing';
      } else if (filename.includes('manager')) {
        mockContent += ' Project Management, Team Leadership, Agile, JIRA, Stakeholder Management';
      }
      
      resolve(mockContent);
    }, 1000);
  });
};

/**
 * Mock implementation of name extraction
 */
const extractName = (content: string): string => {
  // In a real implementation, we would use regex or NLP
  const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Emily Brown', 'Robert Wilson'];
  return names[Math.floor(Math.random() * names.length)];
};

/**
 * Mock implementation of email extraction
 */
const extractEmail = (content: string): string => {
  // In a real implementation, we would use regex to find email patterns
  const emails = [
    'john.doe@example.com',
    'jane.smith@company.org',
    'michael.j@tech.io',
    'emily.brown@mail.net',
    'robert@wilson.dev'
  ];
  return emails[Math.floor(Math.random() * emails.length)];
};

/**
 * Mock implementation of phone extraction
 */
const extractPhone = (content: string): string => {
  // In a real implementation, we would use regex to find phone patterns
  const phones = [
    '(555) 123-4567',
    '555-987-6543',
    '(123) 456-7890',
    '987-654-3210',
    '(321) 654-0987'
  ];
  return phones[Math.floor(Math.random() * phones.length)];
};

/**
 * Mock implementation of experience extraction
 */
const extractExperience = (content: string): Experience[] => {
  // In a real implementation, we would use NLP to identify experience sections
  return [
    {
      company: 'Tech Corp',
      position: 'Senior Developer',
      duration: '2020-Present',
      responsibilities: [
        'Led development of React applications',
        'Implemented CI/CD pipelines',
        'Optimized database queries'
      ]
    },
    {
      company: 'Startup Inc',
      position: 'Developer',
      duration: '2018-2020',
      responsibilities: [
        'Built RESTful APIs',
        'Developed front-end components',
        'Worked in an Agile team'
      ]
    }
  ];
};

/**
 * Mock implementation of education extraction
 */
const extractEducation = (content: string): Education[] => {
  // In a real implementation, we would use NLP to identify education sections
  return [
    {
      institution: 'University of Technology',
      degree: 'Master of Computer Science',
      year: '2018'
    },
    {
      institution: 'State University',
      degree: 'Bachelor of Software Engineering',
      year: '2016'
    }
  ];
};

/**
 * Mock implementation of summary extraction
 */
const extractSummary = (content: string): string => {
  // In a real implementation, we would use NLP to identify the summary section
  const summaries = [
    'Experienced software developer with over 5 years in web development.',
    'Results-driven data scientist specializing in machine learning and predictive modeling.',
    'Creative UI/UX designer with a passion for building intuitive user experiences.',
    'Technical project manager with 8+ years leading cross-functional teams.',
    'Full-stack developer focused on building scalable web applications.'
  ];
  return summaries[Math.floor(Math.random() * summaries.length)];
};
