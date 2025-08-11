import { 
  VendorLoginRequest, 
  VendorLoginResponse, 
  VendorUser, 
  VendorPortalInfo,
  VendorSession,
  VendorApiResponse 
} from '@/types/vendor-portal';

class VendorAuthService {
  private baseUrl = '/api/vendor-portal';

  async login(credentials: VendorLoginRequest): Promise<VendorLoginResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Vendor login attempt:', credentials);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful login
      if (credentials.username === 'vendor@techcorp.com' && credentials.password === 'password123') {
        const mockUser: VendorUser = {
          id: 'vendor-user-1',
          vendorId: 'vendor-1',
          username: 'vendor@techcorp.com',
          email: 'vendor@techcorp.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'Vendor Admin',
          status: 'Active',
          lastLogin: new Date(),
          mfaEnabled: false,
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date()
        };

        const mockVendor: VendorPortalInfo = {
          id: 'vendor-1',
          vendorType: 'Prime Vendor',
          legalName: 'TechCorp Solutions LLC',
          displayName: 'TechCorp Solutions',
          status: 'Active',
          onboardDate: new Date('2023-01-15'),
          tierLevel: 'Preferred',
          internalNotes: 'Primary technology partner',
          vendorNotes: 'Specializing in cloud infrastructure and software development',
          complianceStatus: {
            overall: 'Compliant',
            documents: [],
            lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          },
          primaryContact: {
            id: '1',
            name: 'John Smith',
            role: 'Relationship Manager',
            email: 'john.smith@techcorp.com',
            phone: '+1-555-0123',
            status: 'Active',
            isPrimary: true,
            isBackup: false,
            lastValidated: new Date('2024-01-01'),
            validationStatus: 'Validated'
          }
        };

        return {
          success: true,
          token: 'mock-jwt-token-' + Date.now(),
          user: mockUser,
          vendor: mockVendor
        };
      }

      // Mock MFA required
      if (credentials.username === 'mfa@vendor.com') {
        return {
          success: false,
          requiresMfa: true,
          message: 'MFA code required'
        };
      }

      // Mock failed login
      return {
        success: false,
        message: 'Invalid username or password'
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  }

  async logout(token: string): Promise<VendorApiResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Vendor logout:', token);
      
      // In real implementation, invalidate token on server
      // const response = await fetch(`${this.baseUrl}/auth/logout`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, message: 'Logout failed' };
    }
  }

  async validateToken(token: string): Promise<VendorLoginResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Validating vendor token:', token);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock token validation
      if (token.startsWith('mock-jwt-token-')) {
        const mockUser: VendorUser = {
          id: 'vendor-user-1',
          vendorId: 'vendor-1',
          username: 'vendor@techcorp.com',
          email: 'vendor@techcorp.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'Vendor Admin',
          status: 'Active',
          lastLogin: new Date(),
          mfaEnabled: false,
          createdAt: new Date('2023-01-15'),
          updatedAt: new Date()
        };

        const mockVendor: VendorPortalInfo = {
          id: 'vendor-1',
          vendorType: 'Prime Vendor',
          legalName: 'TechCorp Solutions LLC',
          displayName: 'TechCorp Solutions',
          status: 'Active',
          onboardDate: new Date('2023-01-15'),
          tierLevel: 'Preferred',
          internalNotes: 'Primary technology partner',
          vendorNotes: 'Specializing in cloud infrastructure and software development',
          complianceStatus: {
            overall: 'Compliant',
            documents: [],
            lastReview: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            nextReview: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          },
          primaryContact: {
            id: '1',
            name: 'John Smith',
            role: 'Relationship Manager',
            email: 'john.smith@techcorp.com',
            phone: '+1-555-0123',
            status: 'Active',
            isPrimary: true,
            isBackup: false,
            lastValidated: new Date('2024-01-01'),
            validationStatus: 'Validated'
          }
        };

        const mockSession: VendorSession = {
          id: 'session-1',
          userId: 'vendor-user-1',
          vendorId: 'vendor-1',
          token: token,
          expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
          lastActivity: new Date(),
          ipAddress: '127.0.0.1',
          userAgent: navigator.userAgent
        };

        return {
          success: true,
          user: mockUser,
          vendor: mockVendor,
          session: mockSession
        };
      }

      return {
        success: false,
        message: 'Invalid token'
      };

    } catch (error) {
      console.error('Token validation error:', error);
      return {
        success: false,
        message: 'Token validation failed'
      };
    }
  }

  async refreshToken(token: string): Promise<VendorApiResponse<{ token: string }>> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Refreshing vendor token:', token);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      if (token.startsWith('mock-jwt-token-')) {
        return {
          success: true,
          data: {
            token: 'mock-jwt-token-' + Date.now()
          }
        };
      }

      return {
        success: false,
        message: 'Token refresh failed'
      };

    } catch (error) {
      console.error('Token refresh error:', error);
      return {
        success: false,
        message: 'Token refresh failed'
      };
    }
  }

  async updateProfile(userId: string, updates: Partial<VendorUser>): Promise<VendorUser> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Updating vendor profile:', userId, updates);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock updated user
      const updatedUser: VendorUser = {
        id: userId,
        vendorId: 'vendor-1',
        username: 'vendor@techcorp.com',
        email: updates.email || 'vendor@techcorp.com',
        firstName: updates.firstName || 'John',
        lastName: updates.lastName || 'Smith',
        role: 'Vendor Admin',
        status: 'Active',
        lastLogin: new Date(),
        mfaEnabled: updates.mfaEnabled || false,
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date()
      };

      return updatedUser;

    } catch (error) {
      console.error('Profile update error:', error);
      throw new Error('Profile update failed');
    }
  }

  async updateActivity(): Promise<void> {
    try {
      // Mock implementation - replace with actual API call
      const token = localStorage.getItem('vendor_token');
      if (!token) return;

      console.log('Updating vendor activity');
      
      // In real implementation, update last activity on server
      // await fetch(`${this.baseUrl}/auth/activity`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

    } catch (error) {
      console.error('Activity update error:', error);
    }
  }

  async requestPasswordReset(email: string): Promise<VendorApiResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Password reset requested for:', email);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Password reset instructions sent to your email'
      };

    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Password reset failed'
      };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<VendorApiResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Password reset with token:', token);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'Password reset successfully'
      };

    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        message: 'Password reset failed'
      };
    }
  }

  async enableMFA(userId: string): Promise<VendorApiResponse<{ qrCode: string; backupCodes: string[] }>> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Enabling MFA for user:', userId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        data: {
          qrCode: 'data:image/png;base64,mock-qr-code',
          backupCodes: ['123456', '789012', '345678', '901234', '567890']
        }
      };

    } catch (error) {
      console.error('MFA enable error:', error);
      return {
        success: false,
        message: 'Failed to enable MFA'
      };
    }
  }

  async disableMFA(userId: string, mfaCode: string): Promise<VendorApiResponse> {
    try {
      // Mock implementation - replace with actual API call
      console.log('Disabling MFA for user:', userId);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return {
        success: true,
        message: 'MFA disabled successfully'
      };

    } catch (error) {
      console.error('MFA disable error:', error);
      return {
        success: false,
        message: 'Failed to disable MFA'
      };
    }
  }
}

export const vendorAuthService = new VendorAuthService();
