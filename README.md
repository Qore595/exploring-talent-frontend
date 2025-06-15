# QORE - TalentPulse-Powered Recruitment Platform

<p align="center">
  <img src="public/logo.png" alt="QORE Logo" width="200"/>
</p>

## Project Overview

QORE is an advanced SmartMatch-powered recruitment platform designed for US-based recruiting consultancies. The platform streamlines the hiring process while maximizing profits through a sophisticated two-level profit tracking system. With its intuitive interface and powerful features, QORE helps recruitment agencies manage their entire workflow from job posting to candidate placement.

### Key Features

- **Role-Based Access Control**: Tailored dashboards and permissions for CEO, Branch Managers, Marketing Heads, Marketing Supervisors, Marketing Recruiters, Marketing Associates, and Applicants
- **Profit Optimization**: Two-level profit tracking (client-to-company and company-to-candidate) with configurable splits and detailed financial analytics
- **TalentPulse-Powered Matching**: Resume parsing and semantic matching using Retrieval-Augmented Generation (RAG) technology
- **Automated Screening**: Integration with TalentPulse for voice-based candidate screening and assessment
- **Comprehensive Analytics**: Detailed profit metrics, hiring efficiency, and team performance tracking with visual dashboards
- **Hierarchical Organization Structure**: Branch-based management with locations, departments, and teams
- **Job Management**: Complete job lifecycle management from creation to placement
- **Candidate Management**: Comprehensive candidate tracking, screening, and placement
- **Interview Scheduling**: Integrated interview scheduling and feedback collection
- **Offer Management**: Streamlined offer creation, approval, and tracking

## Architecture

QORE is built with a modern tech stack:

- **Frontend**: React with TypeScript, Vite, and TailwindCSS
- **Backend**: Node.js/Express with TypeScript and PostgreSQL
- **Authentication**: JWT-based authentication with role-based access control
- **Database**: PostgreSQL with Prisma ORM
- **AI Integration**: RAG-based resume parsing and job matching

## Project Structure

```
qore-recruit/
├── public/                # Static assets
├── src/                   # Frontend source code
│   ├── components/        # Reusable UI components
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── layouts/           # Page layout components
│   ├── pages/             # Page components
│   ├── services/          # API service modules
│   ├── styles/            # Global styles
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── backend/               # Backend source code
│   ├── prisma/            # Database schema and migrations
│   ├── src/               # Backend source files
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Entry point
│   └── package.json       # Backend dependencies
└── All Markdown/          # Comprehensive documentation
    ├── 1-Project Setup/   # Setup and configuration guides
    ├── 2-API Integration/ # API integration guides
    ├── 3-Feature Implementation/ # Feature implementation guides
    ├── 4-Deployment/      # Deployment guides
    ├── 5-Roadmap/         # Project roadmap and tasks
    ├── 6-Backend Documentation/ # API documentation
    ├── 7-Backend Analysis/ # Backend analysis
    └── 8-Production Guide/ # Production guides
```

## Development Setup

### Prerequisites

- Node.js (v16+) & npm
- PostgreSQL (v14+)
- Git

### Frontend Development

```sh
# Clone the repository
git clone https://github.com/yourusername/qore-recruit.git

# Navigate to the project directory
cd qore-recruit

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Backend Development

```sh
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update database connection string in .env
# DATABASE_URL="postgresql://username:password@localhost:5432/qore_recruit?schema=public"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed

# Start the backend server
npm run dev
```

The backend API will be available at `http://backend.exploring-talent.com/api`.

### Demo Credentials

Access different role-specific dashboards using these credentials:

- **CEO**: ceo@qore.io / admin123
- **Branch Manager**: branch-manager@qore.io / manager123
- **Marketing Head**: marketing-head@qore.io / manager123
- **Marketing Supervisor**: marketing-supervisor@qore.io / manager123
- **Marketing Recruiter**: recruiter@qore.io / scout123
- **Marketing Associate**: associate@qore.io / member123
- **Applicant**: applicant@qore.io / applicant123

## Comprehensive Documentation

For detailed documentation, refer to the `All Markdown` folder which contains comprehensive guides for all aspects of the project:

### Project Setup and Configuration
- Backend setup and database configuration
- Environment configuration
- Development workflow

### API Integration
- API client implementation
- Authentication service
- Service modules for all resources

### Feature Implementation
- Job management
- User management
- Application tracking
- Interview scheduling
- Offer management

### Deployment
- Backend deployment
- Frontend deployment
- CI/CD setup
- Production considerations

### Roadmap and Planning
- Project roadmap
- Task checklist
- Implementation timeline

### API Documentation
- Comprehensive API reference
- Authentication flows
- Data models and relationships

### Production Guide
- Backend usage in production
- Best practices
- Performance optimization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary software. All rights reserved.

## Contact

Project Link: [https://github.com/yourusername/qore-recruit](https://github.com/yourusername/qore-recruit)
