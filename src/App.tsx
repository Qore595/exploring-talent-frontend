
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/NotificationContext";
import MainLayout from "@/components/layout/MainLayout";
import AuthProtection from "@/components/auth/AuthProtection";
import NotFound from "./pages/NotFound";

// HR Pages
import EmployeeAddPage from "./pages/hr/employees/add";
import EmployeeEditPage from "./pages/hr/employees/edit";
import EmployeeAttendancePage from "./pages/hr/attendance";
import PayrollPage from "./pages/hr/payroll";
import DepartmentsPage from "./pages/hr/departments";
import DesignationsPage from "./pages/hr/designations";
import ApplyLeavePage from "./pages/hr/leave/apply";
import LeaveTypesPage from "./pages/hr/leave/types";
import LeaveRequestsPage from "./pages/hr/leave/requests";
import DisabledEmployeesPage from "./pages/hr/employees/disabled";

// HR Onboarding Pages
import HROnboardingRouter from "./pages/hr-onboarding/HROnboardingRouter";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Marketing Pages
import ComingSoonPage from "./pages/marketing/ComingSoonPage";
import PricingPage from "./pages/pricing/PricingPage";

// Dashboard Pages
import DashboardRouter from "./pages/dashboard/DashboardRouter";

// Roles Pages
import { RolesPage, AddRolePage, RoleDetailsPage, RoleEditPage, RolePermissionsPage, PermissionGroupsPage } from "./pages/roles";

// Branches Pages
import { BranchesPage, AddBranchPage, BranchDetailsPage, EditBranchPage } from "./pages/branches";

// Resume Pages
import ResumeUploadPage from "./pages/resume/ResumeUploadPage";

// Screening Pages
import ScreeningsPage from "./pages/screening/ScreeningsPage";

// Candidates Pages
import CandidatesPage from "./pages/candidates/CandidatesPage";
import CandidateDetailsPage from "./pages/candidates/CandidateDetailsPage";

// Interview Pages
import InterviewsPage from "./pages/interviews/InterviewsPage";
import FeedbackPage from "./pages/interviews/FeedbackPage";

// Application Pages
import ApplicationPage from "./pages/application/ApplicationPage";

// Settings Pages
import SettingsPage from "./pages/settings/SettingsPage";

// Teams Pages
import TeamsPage from "./pages/teams/TeamsPage";
import TeamDetailsPage from "./pages/teams/TeamDetailsPage";
import ProfileDetailsPage from "./pages/teams/ProfileDetailsPage";

// Profiles Pages
import ProfilesPage from "./pages/profiles/ProfilesPage";
import EmployeeProfilePage from "./pages/profiles/EmployeeProfilePage";

// Reports Page
import ReportsPage from "./pages/reports/ReportsPage";

// Job Pages
import JobDetailsPage from "./pages/jobs/JobDetailsPage";
import JobCreatePage from "./pages/jobs/JobCreatePage";
import UnifiedJobsPage from "./pages/jobs/UnifiedJobsPage";
import JobEditPage from "./pages/jobs/JobEditPage";

// Profit Pages
import ProfitCalculatorPage from "./pages/profit/ProfitCalculatorPage";

// Margin Calculator Pages
import MarginCalculatorDashboard from "./pages/margin-calculator/MarginCalculatorDashboard";
import HourlyCalculatorPage from "./pages/margin-calculator/HourlyCalculatorPage";
import W2SalaryCalculatorPage from "./pages/margin-calculator/W2SalaryCalculatorPage";
import ContractorCalculatorPage from "./pages/margin-calculator/ContractorCalculatorPage";
import ApprovalsPage from "./pages/margin-calculator/ApprovalsPage";
import MarginReportsPage from "./pages/margin-calculator/ReportsPage";

// Documentation Pages
import {
  DocumentTemplatesPage,
  DocumentGroupsPage,
  ManualDocumentsPage,
  CreateDocumentTemplatePage,
  EditDocumentTemplatePage,
  DocumentTemplateDetailsPage,
  CreateDocumentGroupPage,
  EditDocumentGroupPage,
  DocumentGroupDetailsPage,
  UploadManualDocumentPage,
  EditManualDocumentPage,
  ManualDocumentDetailsPage
} from "./pages/documentation";

// Email Template Pages
import {
  EmailTemplatesPage,
  CreateEmailTemplatePage,
  EditEmailTemplatePage,
  EmailTemplateDetailsPage,
  EmailManagementPage,
  ReceivedEmailsPage,
  SentEmailsPage,
  EmailUsageTrackingPage
} from "./pages/email-templates";

// Bench Resources Pages
import BenchResourcesPage from "./pages/bench-resources/BenchResourcesPage";
import StatusPipelinePage from "./pages/bench-resources/StatusPipelinePage";
import AutoEnrollmentSettingsPage from "./pages/bench-resources/AutoEnrollmentSettingsPage";

// Hotlist Management Pages
import HotlistsPage from "./pages/hotlists/HotlistsPage";
import CreateHotlistPage from "./pages/hotlists/CreateHotlistPage";
import ScheduledHotlistsPage from "./pages/hotlists/ScheduledHotlistsPage";
import PerformanceAnalyticsPage from "./pages/hotlists/PerformanceAnalyticsPage";
import SubjectTemplatesPage from "./pages/hotlists/SubjectTemplatesPage";

// Mock Permissions Provider
import { MockPermissionsProvider } from "./hooks/useMockPermissions";

// Feedback Page has been removed and integrated into ProfileDetailsPage

// Landing Page
import LandingPage from "./pages/LandingPage";

// Add Index page for routing decisions
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Index route for deciding where to redirect based on auth state */}
            <Route path="/index" element={<Index />} />

            {/* Protected Routes with MainLayout */}
            {/* Dashboard */}
            <Route
              path="/dashboard"
              element={
                <AuthProtection>
                  <MainLayout>
                    <DashboardRouter />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Admin Panel - Redirect to Settings */}
            <Route
              path="/admin"
              element={<Navigate to="/settings" replace />}
            />

            {/* Roles Management - For CEO Only */}
            {/* Note: Order matters! More specific routes must come before less specific ones */}

            {/* Add Role - For CEO Only */}
            <Route
              path="/roles/add"
              element={
                <AuthProtection >
                  <MainLayout>
                    <AddRolePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Edit Role - For CEO Only */}
            <Route
              path="/roles/edit/:roleId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <RoleEditPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Role Permissions - For CEO Only */}
            <Route
              path="/roles/permissions/:roleId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <RolePermissionsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Permission Groups - For CEO Only */}
            <Route
              path="/roles/permission-groups"
              element={
                <AuthProtection >
                  <MainLayout>
                    <PermissionGroupsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Role Details - For CEO Only */}
            <Route
              path="/roles/:roleId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <RoleDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Roles List - For CEO Only */}
            <Route
              path="/roles"
              element={
                <AuthProtection >
                  <MainLayout>
                    <RolesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Branches List - For CEO and Branch Manager */}
            <Route
              path="/branches"
              element={
                <AuthProtection>
                  <MainLayout>
                    <BranchesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Add Branch - For CEO and Branch Manager */}
            <Route
              path="/branches/add"
              element={
                <AuthProtection>
                  <MainLayout>
                    <AddBranchPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Branch Details - For CEO and Branch Manager */}
            <Route
              path="/branches/:branchId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <BranchDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Edit Branch - For CEO and Branch Manager */}
            <Route
              path="/branches/edit/:branchId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <EditBranchPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Teams - For CEO, Branch Manager, Marketing Head, Marketing Supervisor */}
            <Route
              path="/teams"
              element={
                <AuthProtection >
                  <MainLayout>
                    <TeamsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Team Details - For CEO, Branch Manager, Marketing Head, Marketing Supervisor */}
            <Route
              path="/teams/:teamId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <TeamDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Profiles - For All Roles except Applicant */}
            <Route
              path="/profiles"
              element={
                <AuthProtection >
                  <MainLayout>
                    <ProfilesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Profile Details - For All Roles except Applicant */}
            <Route
              path="/profiles/:profileId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <EmployeeProfilePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Resume Management - For All Roles except Applicant */}
            <Route
              path="/resume-upload"
              element={
                <AuthProtection >
                  <MainLayout>
                    <ResumeUploadPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Job Descriptions - Redirect to Unified Jobs Management */}
            <Route
              path="/job-descriptions"
              element={<Navigate to="/jobs-management" replace />}
            />

            {/* Job Matching Results - Redirect to Unified Jobs Management */}
            <Route
              path="/job-matching-results"
              element={<Navigate to="/jobs-management" replace />}
            />

            {/* Screenings - For CEO, Branch Manager, Marketing Recruiter */}
            <Route
              path="/screenings"
              element={
                <AuthProtection >
                  <MainLayout>
                    <ScreeningsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Candidates - For Everyone except Applicants */}
            <Route
              path="/candidates"
              element={
                <AuthProtection >
                  <MainLayout>
                    <CandidatesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Candidate Details - For Everyone except Applicants */}
            <Route
              path="/candidates/:candidateId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <CandidateDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Interviews - For CEO, Branch Manager, Marketing Associate */}
            <Route
              path="/interviews"
              element={
                <AuthProtection >
                  <MainLayout>
                    <InterviewsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Interview Feedback - For CEO, Branch Manager, Marketing Associate */}
            <Route
              path="/interviews/feedback"
              element={
                <AuthProtection >
                  <MainLayout>
                    <FeedbackPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Application - For Applicants */}
            <Route
              path="/application"
              element={
                <AuthProtection >
                  <MainLayout>
                    <ApplicationPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Reports - For CEO, Branch Manager, Marketing Head, Marketing Supervisor */}
            <Route
              path="/reports"
              element={
                <AuthProtection >
                  <MainLayout>
                    <ReportsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Coming Soon/Features Showcase - Public */}
            <Route
              path="/coming-soon"
              element={
                <MainLayout>
                  <ComingSoonPage />
                </MainLayout>
              }
            />

            {/* Pricing Page - Public */}
            <Route
              path="/pricing"
              element={<PricingPage />}
            />

            {/* Unified Jobs Management - For All Roles except Applicant */}
            <Route
              path="/jobs-management"
              element={
                <AuthProtection >
                  <MainLayout>
                    <UnifiedJobsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Legacy Job Listings - Redirect to Unified Jobs Management */}
            <Route
              path="/jobs"
              element={<Navigate to="/jobs-management" replace />}
            />

            {/* Job Details - For All Roles except Applicant */}
            <Route
              path="/jobs/:jobId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <JobDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Create Job - For CEO, Branch Manager, Marketing Head */}
            <Route
              path="/jobs/create"
              element={
                <AuthProtection >
                  <MainLayout>
                    <JobCreatePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Edit Job - For CEO, Branch Manager, Marketing Head */}
            <Route
              path="/jobs/:jobId/edit"
              element={
                <AuthProtection >
                  <MainLayout>
                    <JobEditPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Profit Calculator - For CEO, Branch Manager, Marketing Head, Marketing Supervisor */}
            <Route
              path="/profit-calculator"
              element={
                <AuthProtection >
                  <MainLayout>
                    <ProfitCalculatorPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Margin Calculator Routes */}
            <Route
              path="/margin-calculator"
              element={<Navigate to="/margin-calculator/dashboard" replace />}
            />
            <Route
              path="/margin-calculator/dashboard"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MarginCalculatorDashboard />
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/margin-calculator/hourly"
              element={
                <AuthProtection>
                  <MainLayout>
                    <HourlyCalculatorPage />
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/margin-calculator/w2-salary"
              element={
                <AuthProtection>
                  <MainLayout>
                    <W2SalaryCalculatorPage />
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/margin-calculator/contractor"
              element={
                <AuthProtection>
                  <MainLayout>
                    <ContractorCalculatorPage />
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/margin-calculator/approvals"
              element={
                <AuthProtection>
                  <MainLayout>
                    <ApprovalsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/margin-calculator/reports"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MarginReportsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Settings - For All Users */}
            <Route
              path="/settings"
              element={
                <AuthProtection>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Documentation Routes - For All Users */}
            <Route
              path="/document-templates"
              element={
                <AuthProtection>
                  <MainLayout>
                    <DocumentTemplatesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/document-templates/create"
              element={
                <AuthProtection>
                  <MainLayout>
                    <CreateDocumentTemplatePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/document-templates/:id"
              element={
                <AuthProtection>
                  <MainLayout>
                    <DocumentTemplateDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/document-templates/:id/edit"
              element={
                <AuthProtection>
                  <MainLayout>
                    <EditDocumentTemplatePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/document-groups"
              element={
                <AuthProtection>
                  <MainLayout>
                    <DocumentGroupsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/document-groups/create"
              element={
                <AuthProtection>
                  <MainLayout>
                    <CreateDocumentGroupPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/document-groups/:id"
              element={
                <AuthProtection>
                  <MainLayout>
                    <DocumentGroupDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/document-groups/:id/edit"
              element={
                <AuthProtection>
                  <MainLayout>
                    <EditDocumentGroupPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/manual-documents"
              element={
                <AuthProtection>
                  <MainLayout>
                    <ManualDocumentsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/manual-documents/upload"
              element={
                <AuthProtection>
                  <MainLayout>
                    <UploadManualDocumentPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/manual-documents/:id"
              element={
                <AuthProtection>
                  <MainLayout>
                    <ManualDocumentDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/manual-documents/:id/edit"
              element={
                <AuthProtection>
                  <MainLayout>
                    <EditManualDocumentPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Email Template Routes - For All Users */}
            <Route
              path="/email-templates"
              element={
                <AuthProtection>
                  <MainLayout>
                    <EmailTemplatesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/email-templates/create"
              element={
                <AuthProtection>
                  <MainLayout>
                    <CreateEmailTemplatePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/email-templates/:id"
              element={
                <AuthProtection>
                  <MainLayout>
                    <EmailTemplateDetailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/email-templates/:id/edit"
              element={
                <AuthProtection>
                  <MainLayout>
                    <EditEmailTemplatePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Email Management Routes - For All Users */}
            <Route
              path="/email-management"
              element={
                <AuthProtection>
                  <MainLayout>
                    <EmailManagementPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/email-management/received"
              element={
                <AuthProtection>
                  <MainLayout>
                    <ReceivedEmailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/email-management/sent"
              element={
                <AuthProtection>
                  <MainLayout>
                    <SentEmailsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            <Route
              path="/email-management/usage"
              element={
                <AuthProtection>
                  <MainLayout>
                    <EmailUsageTrackingPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* HR Routes - For All Roles except Applicant */}
            {/* Employee Add */}
            <Route
              path="/hr/employees/add"
              element={
                <AuthProtection  >
                  <MainLayout>
                    <EmployeeAddPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Employee Edit */}
            <Route
              path="/hr/employees/edit/:employeeId"
              element={
                <AuthProtection >
                  <MainLayout>
                    <EmployeeEditPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Employee Attendance */}
            <Route
              path="/hr/attendance"
              element={
                <AuthProtection  >
                  <MainLayout>
                    <EmployeeAttendancePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Payroll */}
            <Route
              path="/hr/payroll"
              element={
                <AuthProtection >
                  <MainLayout>
                    <PayrollPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Department */}
            <Route
              path="/hr/departments"
              element={
                <AuthProtection >
                  <MainLayout>
                    <DepartmentsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Designation */}
            <Route
              path="/hr/designations"
              element={
                <AuthProtection >
                  <MainLayout>
                    <DesignationsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Apply Leave */}
            <Route
              path="/hr/leave/apply"
              element={
                <AuthProtection  >
                  <MainLayout>
                    <ApplyLeavePage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Leave Type */}
            <Route
              path="/hr/leave/types"
              element={
                <AuthProtection >
                  <MainLayout>
                    <LeaveTypesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Leave Request */}
            <Route
              path="/hr/leave/requests"
              element={
                <AuthProtection >
                  <MainLayout>
                    <LeaveRequestsPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Disable Employees */}
            <Route
              path="/hr/employees/disabled"
              element={
                <AuthProtection >
                  <MainLayout>
                    <DisabledEmployeesPage />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* HR Onboarding Routes */}
            <Route
              path="/hr-onboarding/*"
              element={
                <AuthProtection>
                  <MainLayout>
                    <HROnboardingRouter />
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Bench Resources Routes */}
            <Route
              path="/bench-resources"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MockPermissionsProvider>
                      <BenchResourcesPage />
                    </MockPermissionsProvider>
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/bench-resources/pipeline"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MockPermissionsProvider>
                      <StatusPipelinePage />
                    </MockPermissionsProvider>
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/bench-resources/settings"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MockPermissionsProvider>
                      <AutoEnrollmentSettingsPage />
                    </MockPermissionsProvider>
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Hotlist Management Routes */}
            <Route
              path="/hotlists"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MockPermissionsProvider>
                      <HotlistsPage />
                    </MockPermissionsProvider>
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/hotlists/create"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MockPermissionsProvider>
                      <CreateHotlistPage />
                    </MockPermissionsProvider>
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/hotlists/scheduled"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MockPermissionsProvider>
                      <ScheduledHotlistsPage />
                    </MockPermissionsProvider>
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/hotlists/analytics"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MockPermissionsProvider>
                      <PerformanceAnalyticsPage />
                    </MockPermissionsProvider>
                  </MainLayout>
                </AuthProtection>
              }
            />
            <Route
              path="/hotlists/templates"
              element={
                <AuthProtection>
                  <MainLayout>
                    <MockPermissionsProvider>
                      <SubjectTemplatesPage />
                    </MockPermissionsProvider>
                  </MainLayout>
                </AuthProtection>
              }
            />

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
