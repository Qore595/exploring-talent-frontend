# TalentSpark Recruit - User Flows

This document outlines the detailed user flows for each role in the TalentSpark Recruit application. It provides a comprehensive overview of how different users interact with the system and the specific actions they can take.

## Table of Contents

1. [CEO Flows](#ceo-flows)
2. [Branch Manager Flows](#branch-manager-flows)
3. [Marketing Head Flows](#marketing-head-flows)
4. [Marketing Supervisor Flows](#marketing-supervisor-flows)
5. [Marketing Recruiter Flows](#marketing-recruiter-flows)
6. [Marketing Associate Flows](#marketing-associate-flows)
7. [Applicant Flows](#applicant-flows)
8. [Cross-Role Workflows](#cross-role-workflows)

---

## CEO Flows

CEOs have the highest level of access and are responsible for managing the entire recruitment platform, including teams, budgets, and profit configurations.

### Dashboard Overview Flow

1. **Access Dashboard**
   - Log in with company admin credentials (email: admin@talentspark.com)
   - View comprehensive dashboard with:
     - Total employees (128 across all teams)
     - Monthly hires (24 this month)
     - Monthly revenue ($110,000)
     - Monthly profit ($42,500 with 38.6% margin)
   - Monitor profit metrics:
     - Total profit ($87,500)
     - Client-to-company profit ($65,000)
     - Company-to-candidate profit ($22,500)
   - Review revenue and profit charts showing monthly trends
   - Analyze team performance metrics including profit margins
   - Examine position profit analysis showing detailed breakdown by position type

### Team Management Flow

1. **Create Team**
   - Navigate to Teams page
   - Click "Add Team" button
   - Enter team details (name, description, department)
   - Assign a Hiring Manager as team lead
   - Set default profit split configuration (e.g., 70-30)
   - Save team

2. **Manage Team Members**
   - Navigate to Teams page
   - Select a team to view details
   - View team members list
   - Add new members (Hiring Managers, Talent Scouts, Team Members)
   - Edit member roles and permissions
   - Remove members if needed

### Budget Management Flow

1. **Allocate Department Budget**
   - Navigate to Budget Management page
   - Click "Allocate Budget" button
   - Select department
   - Enter total budget amount
   - Specify number of positions
   - Configure default profit settings:
     - Client Budget (e.g., $120/hr)
     - Internal Budget (e.g., $85/hr)
     - Candidate Split (e.g., 80%)
     - Company Split (e.g., 20%)
   - Review profit preview showing:
     - Client-to-Company Profit
     - Company-to-Candidate Profit
     - Total Profit and Margin
   - Confirm allocation

2. **Monitor Budget Utilization**
   - View budget overview dashboard
   - Track department spending
   - Analyze profit metrics by department and position
   - Export budget reports

### Profit Tracking Flow

1. **View Profit Dashboard**
   - Navigate to Budget Management page
   - Select "Profit Tracking" tab
   - View profit metrics:
     - Total Profit
     - Client-to-Company Profit
     - Company-to-Candidate Profit
   - Analyze profit by position type
   - Review recruiter performance with profit metrics

2. **Generate Profit Reports**
   - Filter profit data by date range and department
   - Export profit reports
   - Review profit trends over time

### Platform Administration Flow

1. **Manage User Accounts**
   - Create new user accounts
   - Assign roles (Hiring Manager, Talent Scout, Team Member)
   - Configure permissions
   - Deactivate accounts when needed

2. **Configure Platform Settings**
   - Set default profit configurations
   - Configure notification settings
   - Manage integration settings

---

## Hiring Manager Flows

Hiring Managers oversee specific teams, manage job descriptions, and control budget allocation for their positions.

### Dashboard Overview Flow

1. **Access Dashboard**
   - Log in with hiring manager credentials (email: manager@talentspark.com)
   - View dashboard with:
     - Total budget ($32,500)
     - Average profit margin (32%)
     - Open positions (8)
     - Average time to fill (25 days)
   - Monitor budget and profit breakdown by position:
     - Client budget vs. internal budget
     - Candidate share vs. company share
     - Total profit and margin per position
   - Track active recruitments with profit metrics:
     - Senior React Developer (45.5% margin)
     - Data Engineer (46.7% margin)
     - Product Manager (46.9% margin)
   - View team performance metrics and hiring progress

### Job Creation Flow

1. **Create Job Description**
   - Navigate to Job Descriptions page
   - Click "Create New Job" button
   - Enter job details:
     - Title, Department, Location
     - Client and Client Budget (e.g., $120/hr)
     - Internal Budget (e.g., $85/hr)
     - Candidate/Company Split (e.g., 80/20)
   - Add job description, responsibilities, requirements, benefits
   - Review profit configuration:
     - Client-to-Company Profit: $35/hr
     - Company-to-Candidate Profit: $17/hr
     - Total Profit: $52/hr (43.3% margin)
   - Publish job

2. **Manage Active Jobs**
   - View list of active job descriptions
   - Monitor applicant numbers
   - Edit job details or profit configuration
   - Close positions when filled

### Candidate Review Flow

1. **Review Matched Candidates**
   - Navigate to Candidates page
   - Filter by job position
   - View candidate match scores and profiles
   - Review screening results
   - Shortlist candidates for interviews

2. **Manage Hiring Pipeline**
   - Track candidates through hiring stages
   - Review interview feedback
   - Make hiring decisions
   - Configure and send offers

### Budget Monitoring Flow

1. **Track Team Budget**
   - View budget allocation for team
   - Monitor spending by position
   - Analyze profit margins
   - Request additional budget if needed

2. **Adjust Profit Configuration**
   - Modify client budget or internal budget
   - Adjust candidate/company split
   - Review impact on profit margins
   - Apply changes to specific positions

---

## Talent Scout Flows

Talent Scouts focus on sourcing candidates, uploading resumes, and managing the initial screening process.

### Dashboard Overview Flow

1. **Access Dashboard**
   - Log in with talent scout credentials (email: scout@talentspark.com)
   - View dashboard with:
     - Active candidates (23)
     - Screenings this week (15)
     - Resume uploads this month (42)
     - Successful hires this quarter (8)
   - View recent candidates and upcoming screenings:
     - Candidates in screening stage
     - Candidates in interview stage
     - Candidates with pending feedback
   - Access quick actions for resume upload and screenings
   - Monitor candidate pipeline metrics and conversion rates

### Resume Management Flow

1. **Upload Resumes**
   - Navigate to Resume Upload page
   - Select upload mode (Single or Bulk)
   - Drag and drop resume files (PDF, DOC, DOCX)
   - For single upload:
     - Enter job title and description
     - Upload resumes
     - View parsing results
   - For bulk upload:
     - Upload multiple resumes to database
     - View upload progress and confirmation

2. **Parse and Review Resumes**
   - View parsed resume information
   - Review extracted skills, experience, education
   - Validate parsed data
   - Save to database

### Candidate Matching Flow

1. **Match Resumes with Jobs**
   - Navigate to Job Descriptions page
   - Select a job description
   - Click "Find Matches" button
   - View matched candidates with scores
   - Review match details and candidate profiles

2. **Search Resume Database**
   - Navigate to Resume Database
   - Enter search criteria (job title, skills)
   - View matching candidates
   - Select candidates for screening

### Screening Management Flow

1. **Initiate Candidate Screening**
   - Select candidates for screening
   - Click "Send Screening" button
   - System generates screening questions based on job requirements
   - Screening link sent to candidate
   - Track screening status

2. **Review Screening Results**
   - Navigate to Screenings page
   - View completed screenings
   - Review AI-generated feedback and transcripts
   - Make decision to advance or reject candidate
   - Provide feedback for rejected candidates

---

## Team Member Flows

Team Members participate in the interview process and provide feedback on candidates.

### Dashboard Overview Flow

1. **Access Dashboard**
   - Log in with team member credentials (email: member@talentspark.com)
   - View dashboard with:
     - Upcoming interviews (2)
     - Pending feedback (1)
     - Assigned candidates (2)
     - Recent interview activity
   - Access quick links to:
     - Join upcoming interviews
     - Provide pending feedback
     - View assigned candidates
   - Monitor interview schedule and deadlines
   - View recent team hiring activity

### Interview Management Flow

1. **View Assigned Interviews**
   - Navigate to Interviews page
   - View upcoming interview schedule
   - Review candidate profiles and resumes
   - Prepare for interviews

2. **Schedule Interviews**
   - Click "Schedule Interview" button
   - Select candidate from list
   - Choose interview type (technical, behavioral, etc.)
   - Set date and time
   - Select interviewers
   - Send interview invitations

3. **Conduct Interviews**
   - Join interview at scheduled time
   - Follow interview structure
   - Take notes during interview

### Feedback Submission Flow

1. **Provide Interview Feedback**
   - Navigate to Feedback page
   - Select candidate from list
   - Complete feedback form:
     - Technical skills assessment
     - Cultural fit evaluation
     - Strengths and weaknesses
     - Hiring recommendation
   - Submit feedback

2. **Review Team Feedback**
   - View consolidated feedback from all interviewers
   - Discuss candidate with team
   - Contribute to hiring decision

---

## Applicant Flows

Applicants can track their application status and participate in the screening and interview process.

### Dashboard Overview Flow

1. **Access Dashboard**
   - Log in with applicant credentials (email: applicant@example.com)
   - View dashboard with:
     - Current application status
     - Upcoming actions required
     - Recent activity timeline
     - Application progress indicator
   - Access quick links to:
     - Complete screening (if pending)
     - Schedule or join interviews
     - Review offer details (if available)
   - View feedback highlights from previous stages
   - Check application timeline with dates and status changes

### Application Tracking Flow

1. **View Application Status**
   - Log in to applicant dashboard
   - View current application status
   - Track progress through hiring stages:
     - Applied
     - Screening
     - Interview
     - Offer
     - Hired

2. **Complete Required Actions**
   - Receive notifications for required actions
   - Complete AI screening when prompted
   - Schedule interviews
   - Review and respond to offers

### Screening Participation Flow

1. **Complete AI Screening**
   - Receive screening link via email
   - Access screening platform
   - Answer AI-generated questions
   - Complete voice-based assessment
   - Submit screening

2. **View Screening Results**
   - Receive notification of screening completion
   - View next steps (interview invitation or rejection)
   - Prepare for interviews if advanced

### Interview Participation Flow

1. **Schedule Interviews**
   - Receive interview invitation
   - Select available time slot
   - Confirm interview details

2. **Attend Interviews**
   - Join interview at scheduled time
   - Participate in interview process
   - Ask questions about position and company

### Offer Management Flow

1. **Review Offer**
   - Receive job offer notification
   - View offer details:
     - Position
     - Compensation
     - Start date
     - Other terms

2. **Respond to Offer**
   - Accept, negotiate, or decline offer
   - Complete required paperwork if accepting
   - Provide feedback if declining

---

## Cross-Role Workflows

These workflows involve multiple roles working together through the hiring process. These end-to-end flows demonstrate how different users collaborate within the TalentSpark Recruit platform to achieve recruitment goals.

### End-to-End Hiring Process

1. **Job Creation (Hiring Manager)**
   - Create job description with profit configuration
   - Publish job opening

2. **Candidate Sourcing (Talent Scout)**
   - Upload and parse resumes
   - Match candidates with job description
   - Initiate AI screening

3. **Screening Process (Talent Scout & Applicant)**
   - Applicant completes AI screening
   - Talent Scout reviews screening results
   - Shortlist candidates for interviews

4. **Interview Process (Team Member & Applicant)**
   - Schedule interviews
   - Conduct interviews
   - Provide feedback

5. **Hiring Decision (Hiring Manager)**
   - Review all feedback
   - Make hiring decision
   - Configure offer with profit split

6. **Offer Management (Hiring Manager & Applicant)**
   - Send offer to candidate
   - Candidate accepts, negotiates, or declines
   - Finalize hiring if accepted

7. **Profit Tracking (Company Admin)**
   - Track profit metrics for placement
   - Update budget utilization
   - Generate reports

### Profit Optimization Workflow

1. **Configure Default Profit Settings (Company Admin)**
   - Set default client-to-company profit margin
   - Configure default candidate-company split

2. **Apply Position-Specific Profit Configuration (Hiring Manager)**
   - Adjust client budget based on market rates
   - Set internal budget visible to employees
   - Configure candidate-company split

3. **Track Two-Level Profit (Company Admin & Hiring Manager)**
   - Monitor client-to-company profit (client budget - internal budget)
   - Track company-to-candidate profit (company's share of internal budget)
   - Calculate total profit and margin

4. **Analyze and Optimize (Company Admin)**
   - Review profit metrics by position and department
   - Identify opportunities for optimization
   - Adjust profit configuration for future positions

---

## User Login Information

Below are the login credentials for each role in the TalentSpark Recruit application:

### CEO
- **Email:** ceo@talentspark.com
- **Password:** admin123
- **Access Level:** Full access to all features and data
- **Dashboard URL:** /dashboard/ceo

### Branch Manager
- **Email:** branch-manager@talentspark.com
- **Password:** manager123
- **Access Level:** Branch-specific access with budget control
- **Dashboard URL:** /dashboard/branch-manager

### Marketing Head
- **Email:** marketing-head@talentspark.com
- **Password:** manager123
- **Access Level:** Marketing department access with budget control
- **Dashboard URL:** /dashboard/marketing-head

### Marketing Supervisor
- **Email:** marketing-supervisor@talentspark.com
- **Password:** manager123
- **Access Level:** Marketing team supervision with budget visibility
- **Dashboard URL:** /dashboard/marketing-supervisor

### Marketing Recruiter
- **Email:** recruiter@talentspark.com
- **Password:** scout123
- **Access Level:** Resume and candidate management
- **Dashboard URL:** /dashboard/marketing-recruiter

### Marketing Associate
- **Email:** associate@talentspark.com
- **Password:** member123
- **Access Level:** Interview and feedback access
- **Dashboard URL:** /dashboard/marketing-associate

### Applicant
- **Email:** applicant@example.com
- **Password:** applicant123
- **Access Level:** Application tracking only
- **Dashboard URL:** /dashboard/applicant

## Technical Implementation Details

The user flows in this document are implemented using the following technologies:

- **Frontend:** React with TypeScript, using the Next.js framework
- **UI Components:** Custom Shadcn UI components
- **State Management:** React Context API and useState hooks
- **Routing:** React Router for navigation between pages
- **Authentication:** JWT-based authentication (simulated in the current version)
- **Data Storage:** Mock data with future PostgreSQL integration planned

Each dashboard and feature is implemented as a separate React component, with role-based access control determining which components are accessible to each user type.
