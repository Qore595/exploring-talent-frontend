import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HROnboardingDashboard from './HROnboardingDashboard';
import CandidatesPage from './CandidatesPage';
import CreateCandidatePage from './CreateCandidatePage';
import CandidateDetailsPage from './CandidateDetailsPage';
import EditCandidatePage from './EditCandidatePage';
import TasksManagementPage from './TasksManagementPage';
import CreateTaskPage from './CreateTaskPage';
import DocumentManagementPage from './DocumentManagementPage';
import CreateDocumentPage from './CreateDocumentPage';
import TrainingTrackerPage from './TrainingTrackerPage';
import CreateTrainingPage from './CreateTrainingPage';

const HROnboardingRouter: React.FC = () => {
  return (
    <Routes>
      {/* Dashboard - Default route */}
      <Route index element={<HROnboardingDashboard />} />
      <Route path="dashboard" element={<HROnboardingDashboard />} />
      
      {/* Candidates Management */}
      <Route path="candidates" element={<CandidatesPage />} />
      <Route path="candidates/create" element={<CreateCandidatePage />} />
      <Route path="candidates/:id" element={<CandidateDetailsPage />} />
      <Route path="candidates/:id/edit" element={<EditCandidatePage />} />

      {/* Tasks Management */}
      <Route path="tasks" element={<TasksManagementPage />} />
      <Route path="tasks/create" element={<CreateTaskPage />} />
      <Route path="tasks/:id" element={<div>Task Details Page (TODO)</div>} />
      <Route path="tasks/:id/edit" element={<div>Edit Task Page (TODO)</div>} />

      {/* Document Management */}
      <Route path="documents" element={<DocumentManagementPage />} />
      <Route path="documents/create" element={<CreateDocumentPage />} />
      <Route path="documents/:id" element={<div>Document Details Page (TODO)</div>} />
      <Route path="documents/:id/edit" element={<div>Edit Document Page (TODO)</div>} />

      {/* Training Tracker */}
      <Route path="training" element={<TrainingTrackerPage />} />
      <Route path="training/create" element={<CreateTrainingPage />} />
      <Route path="training/:id" element={<div>Training Details Page (TODO)</div>} />
      <Route path="training/:id/edit" element={<div>Edit Training Page (TODO)</div>} />
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/hr-onboarding/dashboard" replace />} />
    </Routes>
  );
};

export default HROnboardingRouter;
