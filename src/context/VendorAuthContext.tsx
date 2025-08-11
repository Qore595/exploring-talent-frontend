import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { VendorUser, VendorPortalInfo, VendorLoginRequest, VendorLoginResponse, VendorSession } from '@/types/vendor-portal';
import { vendorAuthService } from '@/services/vendorAuthService';

interface VendorAuthContextType {
  user: VendorUser | null;
  vendor: VendorPortalInfo | null;
  session: VendorSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: VendorLoginRequest) => Promise<VendorLoginResponse>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  updateProfile: (updates: Partial<VendorUser>) => Promise<void>;
  checkPermission: (action: string, resource?: string) => boolean;
}

const VendorAuthContext = createContext<VendorAuthContextType | undefined>(undefined);

export const useVendorAuth = () => {
  const context = useContext(VendorAuthContext);
  if (context === undefined) {
    throw new Error('useVendorAuth must be used within a VendorAuthProvider');
  }
  return context;
};

interface VendorAuthProviderProps {
  children: ReactNode;
}

export const VendorAuthProvider: React.FC<VendorAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<VendorUser | null>(null);
  const [vendor, setVendor] = useState<VendorPortalInfo | null>(null);
  const [session, setSession] = useState<VendorSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!session;

  // Initialize auth state from stored token
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('vendor_token');
        if (token) {
          const response = await vendorAuthService.validateToken(token);
          if (response.success && response.user && response.vendor) {
            setUser(response.user);
            setVendor(response.vendor);
            setSession(response.session);
          } else {
            localStorage.removeItem('vendor_token');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        localStorage.removeItem('vendor_token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!session) return;

    const refreshInterval = setInterval(async () => {
      const timeUntilExpiry = session.expiresAt.getTime() - Date.now();
      const shouldRefresh = timeUntilExpiry < 5 * 60 * 1000; // 5 minutes

      if (shouldRefresh) {
        const success = await refreshToken();
        if (!success) {
          await logout();
        }
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(refreshInterval);
  }, [session]);

  // Session timeout warning
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let warningId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningId);

      if (session) {
        const timeUntilExpiry = session.expiresAt.getTime() - Date.now();
        
        // Show warning 5 minutes before expiry
        warningId = setTimeout(() => {
          const shouldExtend = window.confirm(
            'Your session will expire in 5 minutes. Would you like to extend it?'
          );
          if (shouldExtend) {
            refreshToken();
          }
        }, Math.max(0, timeUntilExpiry - 5 * 60 * 1000));

        // Auto logout at expiry
        timeoutId = setTimeout(() => {
          logout();
        }, timeUntilExpiry);
      }
    };

    resetTimeout();

    // Reset timeout on user activity
    const handleActivity = () => {
      if (session) {
        vendorAuthService.updateActivity();
        resetTimeout();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningId);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [session]);

  const login = async (credentials: VendorLoginRequest): Promise<VendorLoginResponse> => {
    try {
      setIsLoading(true);
      const response = await vendorAuthService.login(credentials);

      if (response.success && response.token && response.user && response.vendor) {
        localStorage.setItem('vendor_token', response.token);
        setUser(response.user);
        setVendor(response.vendor);
        setSession({
          id: 'session-' + Date.now(),
          userId: response.user.id,
          vendorId: response.vendor.id,
          token: response.token,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours
          lastActivity: new Date(),
          ipAddress: '',
          userAgent: navigator.userAgent
        });
      }

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (session) {
        await vendorAuthService.logout(session.token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('vendor_token');
      setUser(null);
      setVendor(null);
      setSession(null);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      if (!session) return false;
      
      const response = await vendorAuthService.refreshToken(session.token);
      if (response.success && response.token) {
        localStorage.setItem('vendor_token', response.token);
        setSession(prev => prev ? {
          ...prev,
          token: response.token!,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
          lastActivity: new Date()
        } : null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      return false;
    }
  };

  const updateProfile = async (updates: Partial<VendorUser>): Promise<void> => {
    if (!user) throw new Error('No user logged in');
    
    try {
      const updatedUser = await vendorAuthService.updateProfile(user.id, updates);
      setUser(updatedUser);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const checkPermission = (action: string, resource?: string): boolean => {
    if (!user) return false;

    // Vendor Admin has full access
    if (user.role === 'Vendor Admin') {
      return true;
    }

    // Vendor PoC has limited access
    if (user.role === 'Vendor PoC') {
      const allowedActions = [
        'view_profile',
        'update_own_contact',
        'view_assignments',
        'submit_candidates',
        'view_notifications',
        'send_messages'
      ];
      
      return allowedActions.includes(action);
    }

    return false;
  };

  const value: VendorAuthContextType = {
    user,
    vendor,
    session,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshToken,
    updateProfile,
    checkPermission
  };

  return (
    <VendorAuthContext.Provider value={value}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export default VendorAuthProvider;
