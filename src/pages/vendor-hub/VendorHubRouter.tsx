import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Vendor Hub pages
import VendorHubDashboard from './VendorHubDashboard';
import VendorRegistry from './VendorRegistry';
import VendorDetails from './VendorDetails';
import VendorForm from './VendorForm';
import PocManagement from './PocManagement';
import PocDetails from './PocDetails';
import PocForm from './PocForm';
import ValidationReminders from './ValidationReminders';
import CommunicationLogs from './CommunicationLogs';
import VendorReports from './VendorReports';
import VendorSettings from './VendorSettings';

const VendorHubRouter: React.FC = () => {
  return (
    <Routes>
      {/* Default route - redirect to dashboard */}
      <Route path="/" element={<Navigate to="/vendor-hub/dashboard" replace />} />
      
      {/* Dashboard */}
      <Route path="/dashboard" element={<VendorHubDashboard />} />
      
      {/* Vendor Registry */}
      <Route path="/vendors" element={<VendorRegistry />} />
      <Route path="/vendors/new" element={<VendorForm />} />
      <Route path="/vendors/:vendorId" element={<VendorDetails />} />
      <Route path="/vendors/:vendorId/edit" element={<VendorForm />} />
      
      {/* Point of Contact Management */}
      <Route path="/pocs" element={<PocManagement />} />
      <Route path="/pocs/new" element={<PocForm />} />
      <Route path="/pocs/:pocId" element={<PocDetails />} />
      <Route path="/pocs/:pocId/edit" element={<PocForm />} />
      <Route path="/vendors/:vendorId/pocs/new" element={<PocForm />} />
      
      {/* Validation & Communication */}
      <Route path="/validation-reminders" element={<ValidationReminders />} />
      <Route path="/communication-logs" element={<CommunicationLogs />} />
      
      {/* Reports & Analytics */}
      <Route path="/reports" element={<VendorReports />} />
      
      {/* Settings */}
      <Route path="/settings" element={<VendorSettings />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/vendor-hub/dashboard" replace />} />
    </Routes>
  );
};

export default VendorHubRouter;
