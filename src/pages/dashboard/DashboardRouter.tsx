
import { useAuth } from '@/context/AuthContext';
import CompanyAdminDashboard from './CompanyAdminDashboard';
import HiringManagerDashboard from './HiringManagerDashboard';
import MarketingHeadDashboard from './MarketingHeadDashboard';
import MarketingSupervisorDashboard from './MarketingSupervisorDashboard';
import TalentScoutDashboard from './TalentScoutDashboard';
import TeamMemberDashboard from './TeamMemberDashboard';
import ApplicantDashboard from './ApplicantDashboard';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Render the appropriate dashboard based on the user's role
  switch (user.role) {
    case 'ceo':
      return <CompanyAdminDashboard />;
    case 'branch-manager':
      return <HiringManagerDashboard />;
    case 'marketing-head':
      return <MarketingHeadDashboard />;
    case 'marketing-supervisor':
      return <MarketingSupervisorDashboard />;
    case 'marketing-recruiter':
      return <TalentScoutDashboard />;
    case 'marketing-associate':
      return <TeamMemberDashboard />;
    case 'applicant':
      return <ApplicantDashboard />;
    default:
      return <div>Unknown user role</div>;
  }
};

export default DashboardRouter;
