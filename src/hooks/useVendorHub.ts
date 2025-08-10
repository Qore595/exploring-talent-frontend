// Custom hooks for Vendor Hub operations
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vendorService } from '@/services/vendorService';
import {
  VendorWithPocs,
  PointOfContact,
  VendorHealthSummary,
  PocTransitionTracker,
  EscalationRisk,
  ValidationReminder,
  CommunicationLog,
  VendorFilters,
  PocFilters,
  VendorFormData,
  PocFormData
} from '@/types/vendor';

// Query keys
export const VENDOR_QUERY_KEYS = {
  vendors: ['vendors'] as const,
  vendor: (id: string) => ['vendors', id] as const,
  pocs: ['pocs'] as const,
  poc: (id: string) => ['pocs', id] as const,
  dashboard: ['dashboard'] as const,
  validationReminders: ['validation-reminders'] as const,
  communications: ['communications'] as const,
  automationSettings: ['automation-settings'] as const,
};

// Vendor operations hook
export const useVendors = (filters?: VendorFilters) => {
  const queryClient = useQueryClient();

  const vendorsQuery = useQuery({
    queryKey: [...VENDOR_QUERY_KEYS.vendors, filters],
    queryFn: () => vendorService.getVendors(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createVendorMutation = useMutation({
    mutationFn: vendorService.createVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendors });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  const updateVendorMutation = useMutation({
    mutationFn: ({ vendorId, data }: { vendorId: string; data: Partial<VendorFormData> }) =>
      vendorService.updateVendor(vendorId, data),
    onSuccess: (_, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendors });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendor(vendorId) });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  const deleteVendorMutation = useMutation({
    mutationFn: vendorService.deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendors });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  return {
    vendors: vendorsQuery.data?.data || [],
    pagination: vendorsQuery.data?.pagination,
    isLoading: vendorsQuery.isLoading,
    error: vendorsQuery.error,
    createVendor: createVendorMutation.mutate,
    updateVendor: updateVendorMutation.mutate,
    deleteVendor: deleteVendorMutation.mutate,
    isCreating: createVendorMutation.isPending,
    isUpdating: updateVendorMutation.isPending,
    isDeleting: deleteVendorMutation.isPending,
    refetch: vendorsQuery.refetch,
  };
};

// Single vendor hook
export const useVendor = (vendorId: string) => {
  const queryClient = useQueryClient();

  const vendorQuery = useQuery({
    queryKey: VENDOR_QUERY_KEYS.vendor(vendorId),
    queryFn: () => vendorService.getVendorById(vendorId),
    enabled: !!vendorId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    vendor: vendorQuery.data,
    isLoading: vendorQuery.isLoading,
    error: vendorQuery.error,
    refetch: vendorQuery.refetch,
  };
};

// PoC operations hook
export const usePocs = (filters?: PocFilters) => {
  const queryClient = useQueryClient();

  const pocsQuery = useQuery({
    queryKey: [...VENDOR_QUERY_KEYS.pocs, filters],
    queryFn: () => vendorService.getPocs(filters),
    staleTime: 5 * 60 * 1000,
  });

  const createPocMutation = useMutation({
    mutationFn: ({ vendorId, data }: { vendorId: string; data: PocFormData }) =>
      vendorService.createPoc(vendorId, data),
    onSuccess: (_, { vendorId }) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.pocs });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendor(vendorId) });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  const updatePocMutation = useMutation({
    mutationFn: ({ pocId, data }: { pocId: string; data: Partial<PocFormData> }) =>
      vendorService.updatePoc(pocId, data),
    onSuccess: (updatedPoc) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.pocs });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.poc(updatedPoc.id) });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendor(updatedPoc.vendorId) });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  const deletePocMutation = useMutation({
    mutationFn: vendorService.deletePoc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.pocs });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendors });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  const validatePocMutation = useMutation({
    mutationFn: ({ pocId, validationData }: { 
      pocId: string; 
      validationData: { isValid: boolean; notes?: string; validatedBy: string } 
    }) => vendorService.validatePoc(pocId, validationData),
    onSuccess: (updatedPoc) => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.pocs });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.poc(updatedPoc.id) });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendor(updatedPoc.vendorId) });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  return {
    pocs: pocsQuery.data?.data || [],
    pagination: pocsQuery.data?.pagination,
    isLoading: pocsQuery.isLoading,
    error: pocsQuery.error,
    createPoc: createPocMutation.mutate,
    updatePoc: updatePocMutation.mutate,
    deletePoc: deletePocMutation.mutate,
    validatePoc: validatePocMutation.mutate,
    isCreating: createPocMutation.isPending,
    isUpdating: updatePocMutation.isPending,
    isDeleting: deletePocMutation.isPending,
    isValidating: validatePocMutation.isPending,
    refetch: pocsQuery.refetch,
  };
};

// Single PoC hook
export const usePoc = (pocId: string) => {
  const pocQuery = useQuery({
    queryKey: VENDOR_QUERY_KEYS.poc(pocId),
    queryFn: () => vendorService.getPocById(pocId),
    enabled: !!pocId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    poc: pocQuery.data,
    isLoading: pocQuery.isLoading,
    error: pocQuery.error,
    refetch: pocQuery.refetch,
  };
};

// Dashboard hook
export const useVendorDashboard = () => {
  const dashboardQuery = useQuery({
    queryKey: VENDOR_QUERY_KEYS.dashboard,
    queryFn: vendorService.getDashboardData,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refresh every 5 minutes
  });

  return {
    vendorHealthSummary: dashboardQuery.data?.vendorHealthSummary,
    pocTransitionTracker: dashboardQuery.data?.pocTransitionTracker,
    escalationRisk: dashboardQuery.data?.escalationRisk,
    isLoading: dashboardQuery.isLoading,
    error: dashboardQuery.error,
    refetch: dashboardQuery.refetch,
  };
};

// Validation reminders hook
export const useValidationReminders = () => {
  const queryClient = useQueryClient();

  const remindersQuery = useQuery({
    queryKey: VENDOR_QUERY_KEYS.validationReminders,
    queryFn: vendorService.getValidationReminders,
    staleTime: 2 * 60 * 1000,
  });

  const sendReminderMutation = useMutation({
    mutationFn: vendorService.sendValidationReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.validationReminders });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.communications });
    },
  });

  const sendBulkRemindersMutation = useMutation({
    mutationFn: vendorService.sendBulkValidationReminders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.validationReminders });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.communications });
    },
  });

  return {
    reminders: remindersQuery.data || [],
    isLoading: remindersQuery.isLoading,
    error: remindersQuery.error,
    sendReminder: sendReminderMutation.mutate,
    sendBulkReminders: sendBulkRemindersMutation.mutate,
    isSending: sendReminderMutation.isPending,
    isSendingBulk: sendBulkRemindersMutation.isPending,
    refetch: remindersQuery.refetch,
  };
};

// Communication logs hook
export const useCommunicationLogs = (vendorId?: string, pocId?: string) => {
  const communicationsQuery = useQuery({
    queryKey: [...VENDOR_QUERY_KEYS.communications, vendorId, pocId],
    queryFn: () => vendorService.getCommunicationLogs(vendorId, pocId),
    staleTime: 2 * 60 * 1000,
  });

  return {
    communications: communicationsQuery.data || [],
    isLoading: communicationsQuery.isLoading,
    error: communicationsQuery.error,
    refetch: communicationsQuery.refetch,
  };
};

// Automation settings hook
export const useAutomationSettings = () => {
  const queryClient = useQueryClient();

  const settingsQuery = useQuery({
    queryKey: VENDOR_QUERY_KEYS.automationSettings,
    queryFn: vendorService.getAutomationSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const updateSettingsMutation = useMutation({
    mutationFn: vendorService.updateAutomationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.automationSettings });
    },
  });

  return {
    settings: settingsQuery.data,
    isLoading: settingsQuery.isLoading,
    error: settingsQuery.error,
    updateSettings: updateSettingsMutation.mutate,
    isUpdating: updateSettingsMutation.isPending,
    refetch: settingsQuery.refetch,
  };
};

// Bulk operations hook
export const useBulkOperations = () => {
  const queryClient = useQueryClient();

  const bulkUpdateVendorsMutation = useMutation({
    mutationFn: ({ vendorIds, updateData }: { vendorIds: string[]; updateData: Partial<VendorFormData> }) =>
      vendorService.bulkUpdateVendors(vendorIds, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendors });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  const bulkUpdatePocsMutation = useMutation({
    mutationFn: ({ pocIds, updateData }: { pocIds: string[]; updateData: Partial<PocFormData> }) =>
      vendorService.bulkUpdatePocs(pocIds, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.pocs });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.vendors });
      queryClient.invalidateQueries({ queryKey: VENDOR_QUERY_KEYS.dashboard });
    },
  });

  return {
    bulkUpdateVendors: bulkUpdateVendorsMutation.mutate,
    bulkUpdatePocs: bulkUpdatePocsMutation.mutate,
    isUpdatingVendors: bulkUpdateVendorsMutation.isPending,
    isUpdatingPocs: bulkUpdatePocsMutation.isPending,
  };
};

// Export/Import hook
export const useImportExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const exportVendors = useCallback(async (format: 'csv' | 'xlsx' = 'csv') => {
    setIsExporting(true);
    try {
      const blob = await vendorService.exportVendors(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vendors.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const exportPocs = useCallback(async (format: 'csv' | 'xlsx' = 'csv') => {
    setIsExporting(true);
    try {
      const blob = await vendorService.exportPocs(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pocs.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const importVendors = useCallback(async (file: File) => {
    setIsImporting(true);
    try {
      const result = await vendorService.importVendors(file);
      return result;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    } finally {
      setIsImporting(false);
    }
  }, []);

  return {
    exportVendors,
    exportPocs,
    importVendors,
    isExporting,
    isImporting,
  };
};
