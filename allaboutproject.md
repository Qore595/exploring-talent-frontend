QORE Recruit Platform Documentation
Version 1.1
SmartMatch-Powered Recruitment Platform for Consulting Companies
Updated: April 26, 2025

Table of Contents

Introduction
User Roles & Access Control
Resume Management
Candidate Matching with Agentic RAG and n8n
Hiring Process Automation
Automation & Integration
On-Premise Deployment & Licensing
US Job Consultancy Scenarios
Technical Requirements & Architecture
Dashboards
Deliverables (Version 1.1)
Assumptions & Limitations
Conclusion
Key Citations & Technologies


1. Introduction
QORE Recruit is an advanced SmartMatch-powered recruitment platform tailored for consulting companies in the US. It streamlines the hiring process by integrating cutting-edge technologies such as TalentPulse for voice-based candidate screening, n8n.io for workflow automation, and a secure on-premise deployment model. The platform maximizes profits for consulting agencies by efficiently managing client budgets and candidate offers, offering role-specific dashboards for transparency, and ensuring robust security through subscription-based licensing.
Key Objectives

Profit Optimization: Maximize agency margins through configurable budget splits (e.g., client budget of $100/hour, candidate offered $65/hour, agency retains $35/hour).
Automation: Automate hiring with SmartMatch-driven voice screening and detailed feedback collection.
Visibility: Provide end-to-end transparency via role-specific dashboards.
Security: Ensure secure, on-premise deployment with subscription-based licensing.


2. User Roles & Access Control
TalentSpark Recruit employs Role-Based Access Control (RBAC) with clearly defined roles tailored to the needs of consulting companies. Each role has specific responsibilities and permissions to ensure secure and efficient operation.
Roles and Responsibilities



Role
Description



CEO
Manages platform settings, adds teams/users, monitors hiring, budgets, and profits.


Branch Manager
Oversees branch operations, budgets, sets profit splits, tracks hiring progress within their branch.


Marketing Head
Oversees marketing department, manages budgets, tracks hiring progress within marketing teams.


Marketing Supervisor
Supervises marketing teams, manages team assignments, tracks team performance.


Marketing Recruiter
Uploads resumes/JDs, initiates screening, shortlists candidates, tracks progress.


Marketing Associate
Conducts interviews, provides feedback, views assigned candidate details.


Applicant
Participates in AI screening, tracks application status, receives interview/offer details.


Access Control Matrix



Action
CEO
Branch Manager
Marketing Head
Marketing Supervisor
Marketing Recruiter
Marketing Associate
Applicant



Add Teams/Users
Yes
No
No
No
No


Upload Resume/JD
Yes
Yes
Yes
No
No


Edit/Delete Resume/JD
Yes
Yes*
Yes**
No
No


View All Candidates
Yes
Yes*
No
No
No


View Assigned Candidates
Yes
Yes*
Yes
Yes
No


Initiate Screening
Yes
Yes
Yes
No
No


Schedule Interview
Yes
Yes
Yes
Yes*
No


Provide Feedback
Yes
Yes
Yes
Yes
No


View Own Application
No
No
No
No
Yes


Set Profit Splits
Yes
Yes
No
No
No


View Budget Reports
Yes
Yes
No
No
No


Notes:

*Hiring Manager access is limited to their team/organization.
*Team Member scheduling and feedback are limited to assigned candidates.
**Talent Scout can edit/delete only their uploaded resumes/JDs.

User Flows & Practical Scenarios

Company Admin:

Flow: Logs in → Adds a new team → Assigns Hiring Manager → Sets default profit split (e.g., 70-30) → Monitors total hires and profits.
Scenario: Adds "Team Alpha," assigns Hiring Manager Jane, sets a 70-30 split. Views 20 hires generating $700/hour profit.


Hiring Manager:

Flow: Logs in → Views client budget → Sets candidate offer → Assigns Talent Scout → Tracks progress.
Scenario: Views $120/hour budget for a "Data Scientist" role, sets $80/hour offer (retaining $40/hour), assigns Talent Scout Mike.


Talent Scout:

Flow: Logs in → Uploads resumes/JD → Initiates screening → Reviews matches → Shortlists candidates → Tracks progress.
Scenario: Uploads 10 resumes and a "Software Engineer" JD. System matches 5 candidates (e.g., 85% score), initiates screening for 3.


Team Member:

Flow: Logs in → Views assigned candidates → Schedules interview → Conducts interview → Provides feedback.
Scenario: Assigned Candidate A, schedules a Zoom interview, notes "Strong Python skills," moves forward.


Applicant:

Flow: Receives screening link → Completes AI screening → Tracks status → Attends interview → Accepts/Rejects offer.
Scenario: Receives email link, completes screening, sees "Interview scheduled," attends, accepts $65/hour offer.




3. Resume Management
TalentSpark Recruit efficiently manages resume and job description (JD) uploads to prepare for candidate screening and matching.
Features

Upload & Storage: Talent Scouts upload resumes and JDs, stored in PostgreSQL with metadata (e.g., uploader's ID, timestamp).
Data Extraction: Parses resumes to extract details (e.g., skills, experience, education) for screening and matching.
JD Preparation: Analyzes JDs to define screening questions and matching criteria.
Edit/Delete: Authorized users can modify or remove uploaded data.

Technical Details

Accepted Formats: Resumes (PDF, DOCX, max 5MB), JDs (PDF, DOCX, TXT, max 2MB).
Storage: PostgreSQL table with columns: id, uploader_id, file_type, file_path, metadata, upload_timestamp.
Error Handling: Invalid formats or parsing failures flagged with error messages (e.g., "Unable to parse resume").

Resume Management Flow
Start
  ↓
Talent Scout uploads resumes and JD
  ↓
System validates formats (PDF, DOCX, etc.)
  ↓
Data stored in PostgreSQL with uploader_id
  ↓
System parses resumes (extracts skills, experience)
  ↓
System processes JD (defines screening questions)
  ↓
Ready for candidate matching and screening
  ↓
End

Practical Scenarios

Successful Upload:

Action: Talent Scout uploads 5 resumes and a JD for "Software Engineer" (Python, 3+ years).
Result: Stored with uploader_id=123, metadata extracted (e.g., "Python, 4 years"), screening questions prepared (e.g., "Describe Python projects").


Edit Resume:

Action: Talent Scout updates a resume with missing experience details.
Result: Metadata updated in PostgreSQL, re-parsed for matching.


Delete Resume:

Action: Talent Scout deletes an outdated resume.
Result: Record removed from PostgreSQL, no longer available for matching.


Error Case:

Action: Uploads a corrupted PDF.
Result: System flags "Invalid file format," prompts re-upload.




4. Candidate Matching with Agentic RAG and n8n
TalentSpark Recruit leverages Retrieval-Augmented Generation (RAG) and n8n workflows to match resumes to JDs semantically, providing scored candidate profiles.
What is Agentic RAG?
Agentic RAG enhances traditional RAG by combining retrieval-based methods with generative SmartMatch, enabling context-aware, semantic matching of resumes to JDs beyond keyword searches. It uses vector embeddings to capture meaning and intent.
Features

Resume Indexing: Parses and indexes resumes using vector embeddings for semantic search.
JD Processing: Extracts requirements (e.g., skills, experience) from JDs.
Semantic Matching: RAG retrieves resumes matching JD criteria semantically.
Scoring: Assigns similarity scores (0-100%) based on skill overlap, experience, and context.
n8n Automation: Automates workflows (e.g., notify Talent Scout of top matches).

Technical Details

Vector Embeddings: Generated using pre-trained language models (e.g., BERT).
Storage: Embeddings stored in PostgreSQL with pgvector extension.
Scoring Algorithm: Cosine similarity between JD and resume embeddings, weighted by criteria (e.g., skills 50%, experience 30%, education 20%).
n8n Workflow: Trigger: onJDUpload → Retrieve matches → Score → Notify.

Matching Flow
Start
  ↓
Talent Scout uploads JD
  ↓
System processes JD (extracts requirements)
  ↓
RAG queries resume index (semantic search)
  ↓
Top-matching resumes retrieved with scores
  ↓
n8n workflow notifies Talent Scout
  ↓
Talent Scout reviews matches
  ↓
End

Practical Scenarios

Basic Matching:

JD: "Data Scientist, Python, Machine Learning, 5+ years."
Result: Returns Candidate A (85%), Candidate B (78%), notifies Talent Scout via email.


Complex JD:

JD: "Software Engineer, Python, AWS, Agile, 3-5 years."
Result: Matches Candidate C (90%, AWS expertise), Candidate D (75%, Agile missing), scores reflect fit.


No Matches:

JD: "Quantum Physicist, 10+ years."
Result: No candidates exceed 50% threshold, Talent Scout notified to upload more resumes.


Automation Trigger:

Action: JD uploaded, 5 matches found.
Result: n8n sends WhatsApp message: "5 candidates matched for Software Engineer role."




5. Hiring Process Automation
TalentSpark Recruit automates the hiring process from resume upload to offer acceptance, integrating SmartMatch screening and feedback loops.
Features

SmartMatch Screening: TalentPulse conducts voice-based screening, generates transcripts and feedback.
Screening Link: Unique links sent via email/WhatsApp.
Shortlisting: Marketing Recruiters review SmartMatch feedback to shortlist candidates.
Interview Scheduling: Automated Zoom link generation and notifications.
Feedback Collection: Mandatory at each rejection point (SmartMatch, Marketing Recruiter, interview).
Offer Management: Configures profit splits and sends offers.
Multi-Round Interviews: Supports multiple interview stages (e.g., technical, HR).

Hiring Process Flow
graph TD
    A[Start] --> B[Talent Scout uploads resumes/JD]
    B --> C[System generates screening questions]
    C --> D[Screening link sent to Applicant]
    D --> E[Applicant completes AI screening]
    E --> F[Transcript/feedback stored]
    F --> G{AI Rejects?}
    G -->|Yes| H[Record feedback, notify Applicant, End]
    G -->|No| I[Talent Scout reviews]
    I --> J{Talent Scout Rejects?}
    J -->|Yes| K[Record feedback, notify Applicant, End]
    J -->|No| L[Schedule 1st interview]
    L --> M[Team Member conducts interview]
    M --> N[Provide feedback]
    N --> O{Interview Rejects?}
    O -->|Yes| P[Record feedback, notify Applicant, End]
    O -->|No| Q{Need 2nd Interview?}
    Q -->|Yes| L
    Q -->|No| R[Configure profit split, send offer]
    R --> S{Offer Accepted?}
    S -->|Yes| T[Hired, End]
    S -->|No| U[Notify Applicant, return to shortlist or End]

Edge Cases

Candidate Withdrawal: System records withdrawal, notifies Talent Scout.
Offer Negotiation: Applicant requests $70/hour from $65/hour; Hiring Manager adjusts within budget.
Technical Failure: Screening link fails; system resends or logs error.
AI Rejection Appeal: Applicant disputes rejection; Talent Scout overrides.

Practical Scenarios

Standard Hire:

Flow: Upload → Screening (AI: "Strong SQL") → Interview ("Good fit") → Offer ($65/hour from $100/hour) → Accepted.
Result: Candidate hired, $35/hour profit retained.


Multi-Round Interview:

Flow: Screening → Technical Interview ("Solid coding") → HR Interview ("Cultural fit") → Offer → Accepted.
Result: Two feedback entries logged, hired.


Rejection at SmartMatch:

Flow: Screening (SmartMatch: "Weak communication") → Rejected → Feedback recorded.
Result: Applicant notified via email.


Negotiation:

Flow: Offer ($65/hour) → Applicant requests $70/hour → Hiring Manager adjusts → Accepted.
Result: Hired at $70/hour, $30/hour profit.




6. Automation & Integration
Automation reduces manual effort through seamless integrations.
Features

Notifications: Email/WhatsApp for screening links, interviews, rejections.
TalentPulse Integration: SmartMatch screening with transcript/feedback generation.
n8n Workflows: Triggers actions based on events (e.g., onScreeningCompleted).

Technical Details

Email Setup: SMTP configuration (e.g., host, port, credentials).
WhatsApp: WhatsApp Business API integration.
n8n Workflows:
onScreeningCompleted: Store transcript, notify Talent Scout, send rejection if applicable.
onInterviewScheduled: Generate Zoom link, notify Team Member/Applicant.



Practical Scenarios

Screening Completion:

Trigger: Applicant completes screening.
Result: Transcript stored, Talent Scout emailed: "Screening completed for John Doe."


Interview Notification:

Trigger: Interview scheduled.
Result: Zoom link sent to Applicant and Team Member via WhatsApp.


Rejection:

Trigger: SmartMatch rejects Applicant.
Result: Email sent: "Thank you for applying, unfortunately…"




7. On-Premise Deployment & Licensing
RecruitAI offers secure, self-hosted deployment with subscription control.
Deployment Features

Docker-Based: Delivered as a Docker image with Node.js, PostgreSQL, n8n.
Secure Code: Obfuscated for security.
Setup: Configured via docker-compose.yml.

Licensing

License Key: Required for activation, issued upon subscription.
Validation: Periodic checks (online every 30 days, offline signed key option).
Enforcement: Grace period (7 days), restricted mode (no new screenings), disablement after non-payment.

Technical Requirements

OS: Docker-enabled Linux/Windows
RAM: 8GB+
CPU: 4+ cores
Storage: 50GB+ SSD

Deployment Flow
Start
  ↓
Client installs Docker
  ↓
Downloads RecruitAI Docker image
  ↓
Runs docker-compose up -d
  ↓
Company Admin enters license key
  ↓
System validates key
  ↓
Full functionality enabled
  ↓
Periodic license checks
  ↓
End

Practical Scenarios

Successful Deployment:

Action: Client runs Docker image, enters key.
Result: Platform activates, all features available.


License Expiry:

Action: Subscription lapses.
Result: 7-day grace period, then restricted mode (view-only).




8. US Job Consultancy Scenarios
RecruitAI optimizes profits for consulting companies by managing budgets and offers with a sophisticated two-level profit tracking system.
Features

Two-Level Profit Tracking:
- Client-to-Company: Tracks difference between client budget and internal budget (e.g., $120/hr client budget - $85/hr internal budget = $35/hr profit)
- Company-to-Candidate: Tracks configurable split of internal budget (e.g., 80% to candidate, 20% to company from $85/hr = $17/hr additional profit)
- Total Profit: Combines both levels (e.g., $35/hr + $17/hr = $52/hr total profit)

Configurable Profit Splits:
- Default department-level profit configurations
- Position-specific customization
- Real-time profit calculation and preview

Comprehensive Reporting:
- Profit tracking dashboards with detailed metrics
- Position-level profit analysis
- Recruiter performance tracking with profit metrics
- Department-level profit aggregation

Practical Scenarios

Standard Two-Level Profit:

Client Budget: $120/hour, Internal Budget: $85/hour
Candidate Split: 80% ($68/hour), Company Split: 20% ($17/hour)
Result: Client-to-Company profit: $35/hour, Company-to-Candidate profit: $17/hour
Total Profit: $52/hour (43.3% margin), tracked in dashboard

High Margin Configuration:

Client Budget: $130/hour, Internal Budget: $90/hour
Candidate Split: 75% ($67.50/hour), Company Split: 25% ($22.50/hour)
Result: Client-to-Company profit: $40/hour, Company-to-Candidate profit: $22.50/hour
Total Profit: $62.50/hour (48.1% margin), tracked in dashboard

Negotiation Impact:

Client Budget: $110/hour, Initial Internal Budget: $75/hour, Adjusted: $80/hour
Candidate Split: 80% ($64/hour), Company Split: 20% ($16/hour)
Result: Client-to-Company profit reduced from $35/hour to $30/hour
Company-to-Candidate profit: $16/hour
Total Profit: $46/hour (41.8% margin), updated in dashboard




9. Technical Requirements & Architecture
Tech Stack

Frontend: Next.js (React)
Backend: Node.js (Express)
Database: PostgreSQL (with pgvector for embeddings)
SmartMatch: TalentPulse API
Automation: n8n.io
Deployment: Docker

Architecture

Frontend: Interactive UI for role-based access.
Backend: Manages APIs, licensing, data flow.
Database: Stores resumes, JDs, transcripts, embeddings.
SmartMatch: TalentPulse handles screening.
Automation: n8n orchestrates workflows.


10. Dashboards
Role-specific dashboards provide comprehensive visibility with detailed profit tracking metrics.
Dashboard Details

Company Admin:
- Overview: Total employees, candidates, monthly hires, monthly revenue, monthly profit
- Profit Metrics: Total profit, client-to-company profit, company-to-candidate profit
- Revenue & Profit Charts: Monthly trends and breakdowns
- Team Performance: Hires, revenue, profit, and profit margins by team
- Position Profit Analysis: Detailed breakdown of profit by position type


Hiring Manager:
- Budget & Profit Breakdown: Client budget, internal budget, candidate share, company share, total profit
- Active Recruitments: Position details with profit configuration and margins
- Team Performance: Recruiter effectiveness with profit metrics
- Profit Margin Tracking: Average profit margin per placement


Talent Scout:
- Candidate Pipeline: Resumes uploaded, screenings completed, interviews scheduled
- Matching Scores: Candidate match percentages (e.g., 85%, 78%)
- Position Details: Budget information and profit targets
- Candidate Progress: Status tracking through hiring stages


Team Member:
- Upcoming Interviews: Scheduled interviews with candidate details
- Feedback Requests: Pending feedback submissions
- Candidate Information: Assigned candidates with relevant details


Applicant:
- Application Status: Current stage in the hiring process
- Interview Schedule: Upcoming and past interviews
- Feedback Highlights: Key points from previous stages
- Offer Details: When an offer is received



Practical Scenarios

Company Admin:
- Views dashboard showing 24 monthly hires generating $110,000 in revenue and $42,500 in profit (38.6% margin)
- Analyzes profit breakdown: $65,000 from client-to-company and $22,500 from company-to-candidate
- Reviews position profit analysis showing Software Engineer positions generating 43.3% profit margin

Hiring Manager:
- Reviews budget allocation showing $120/hr client budget with $85/hr internal budget
- Monitors active recruitments with profit metrics (e.g., Senior React Developer at 45.5% margin)
- Tracks team performance with profit contribution by recruiter

Marketing Recruiter:
- Tracks 10 candidates in pipeline with 3 completed screenings
- Reviews match scores (85%, 78%) with budget and profit targets
- Monitors candidate progress through hiring stages


11. Deliverables (Version 1.1)

Feature descriptions.
Flowcharts for all processes.
Dashboard specs.
Architecture and deployment guidelines.


12. Assumptions & Limitations
Assumptions

Target: US consulting companies.
Infrastructure: Docker-capable systems.

Limitations

Internet required for license checks.
Basic technical skills needed.

Future Enhancements

Mobile app.
Advanced analytics.


13. Conclusion
TalentSpark Recruit Version 1.1 empowers consulting companies with profit optimization, automation, transparency, and security.

14. Key Citations & Technologies

TalentPulse API
n8n.io
Next.js
Node.js
PostgreSQL
Docker


TalentSpark Recruit Platform Documentation v1.1 | © 2025
