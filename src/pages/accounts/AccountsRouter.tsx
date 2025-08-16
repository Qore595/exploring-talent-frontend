import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import Accounts pages
import InvoicesPage from './InvoicesPage';
import TimesheetsPage from './TimesheetsPage';
import PTOManagementPage from './PTOManagementPage';
import ApprovalsPage from './ApprovalsPage';
import OverdueDashboardPage from './OverdueDashboardPage';

const AccountsRouter: React.FC = () => {
  return (
    <Routes>
      {/* Default route - redirect to invoices */}
      <Route path="/" element={<Navigate to="/accounts/invoices" replace />} />
      
      {/* Invoices */}
      <Route path="/invoices" element={<InvoicesPage />} />
      
      {/* Timesheets */}
      <Route path="/timesheets" element={<TimesheetsPage />} />
      
      {/* PTO Management */}
      <Route path="/pto-management" element={<PTOManagementPage />} />
      
      {/* Approvals */}
      <Route path="/approvals" element={<ApprovalsPage />} />
      
      {/* Overdue Dashboard */}
      <Route path="/overdue-dashboard" element={<OverdueDashboardPage />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/accounts/invoices" replace />} />
    </Routes>
  );
};

export default AccountsRouter;
