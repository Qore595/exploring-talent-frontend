import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import VendorPortalLayout from '@/components/layout/VendorPortalLayout';
import VendorLogin from './VendorLogin';
import VendorDashboard from './VendorDashboard';
import VendorProfile from './VendorProfile';
import VendorContacts from './VendorContacts';
import VendorAssignments from './VendorAssignments';
import VendorMessages from './VendorMessages';
import VendorNotifications from './VendorNotifications';
import VendorCommission from './VendorCommission';
import VendorReports from './VendorReports';
import VendorSettings from './VendorSettings';
import VendorAuthProtection from '@/components/auth/VendorAuthProtection';

const VendorPortalRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<VendorLogin />} />
      <Route path="/forgot-password" element={<div>Forgot Password Page</div>} />
      <Route path="/reset-password" element={<div>Reset Password Page</div>} />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <VendorAuthProtection>
          <VendorPortalLayout />
        </VendorAuthProtection>
      }>
        <Route index element={<Navigate to="/vendor-portal/dashboard" replace />} />
        <Route path="dashboard" element={<VendorDashboard />} />
        <Route path="profile" element={<VendorProfile />} />
        <Route path="contacts" element={<VendorContacts />} />
        <Route path="contacts/:contactId" element={<div>Contact Details</div>} />
        <Route path="contacts/:contactId/edit" element={<div>Edit Contact</div>} />
        <Route path="contacts/new" element={<div>New Contact</div>} />
        <Route path="assignments" element={<VendorAssignments />} />
        <Route path="assignments/:assignmentId" element={<div>Assignment Details</div>} />
        <Route path="assignments/:assignmentId/submit" element={<div>Submit Candidate</div>} />
        <Route path="messages" element={<VendorMessages />} />
        <Route path="messages/:messageId" element={<div>Message Details</div>} />
        <Route path="messages/new" element={<div>New Message</div>} />
        <Route path="notifications" element={<VendorNotifications />} />
        <Route path="commission" element={<VendorCommission />} />
        <Route path="reports" element={<VendorReports />} />
        <Route path="settings" element={<VendorSettings />} />
      </Route>
      
      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/vendor-portal/dashboard" replace />} />
    </Routes>
  );
};

export default VendorPortalRouter;
