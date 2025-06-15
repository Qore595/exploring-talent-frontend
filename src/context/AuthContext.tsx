import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/services/authService';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'ceo' | 'branch-manager' | 'marketing-head' | 'marketing-supervisor' | 'marketing-recruiter' | 'marketing-associate' | 'applicant';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  locationId?: string;
  departmentId?: string;
  employeeId?: string;
  branchId?: number;
  designationId?: number;
  isActive?: boolean;
  isSuperadmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setRole = (role: UserRole) => {
    if (user) {
      setUser({ ...user, role });
    }
  };

  // Check for existing user session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      try {
        // Check if we have a token
        if (authService.isAuthenticated()) {
          // Get user data from localStorage
          const userData = authService.getCurrentUser();
          
          if (userData) {
            // Map the user data to our User interface
            const mappedUser: User = {
              id: userData.id.toString(),
              name: userData.name,
              email: userData.email,
              // Map the role - if superadmin, use 'ceo', otherwise determine based on designation or default to 'marketing-associate'
              role: userData.isSuperadmin ? 'ceo' : determineRole(userData),
              branchId: userData.branchId,
              departmentId: userData.departmentId?.toString(),
              locationId: userData.branchId?.toString(),
              employeeId: userData.employeeId,
              designationId: userData.designationId,
              isActive: userData.isActive,
              isSuperadmin: userData.isSuperadmin,
              // Use a default avatar based on role
              avatar: getAvatarForRole(userData.isSuperadmin ? 'ceo' : determineRole(userData))
            };
            
            setUser(mappedUser);
            
            // Optionally verify with the server
            try {
              await authService.checkStatus();
            } catch (error) {
              console.error('Token validation failed, logging out');
              await handleLogout();
            }
          }
        }
      } catch (error) {
        console.error('Auth status check error:', error);
        // Clear any invalid session data
        await handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // Helper function to determine role based on user data
  const determineRole = (userData: any): UserRole => {
    // This is a simplified mapping - in a real app, you'd have more sophisticated logic
    // based on the user's actual roles and permissions from the backend
    if (userData.isSuperadmin) return 'ceo';
    
    // You could use designation_id to determine role more accurately
    // For now, we'll use a simple mapping
    const designationMap: Record<number, UserRole> = {
      1: 'branch-manager',
      2: 'marketing-head',
      3: 'marketing-supervisor',
      4: 'marketing-recruiter',
      5: 'marketing-associate'
    };
    
    return designationMap[userData.designationId] || 'marketing-associate';
  };
  
  // Helper function to get avatar based on role
  const getAvatarForRole = (role: UserRole): string => {
    const avatars: Record<UserRole, string> = {
      'ceo': 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'branch-manager': 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'marketing-head': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'marketing-supervisor': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'marketing-recruiter': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'marketing-associate': 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      'applicant': 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    };
    
    return avatars[role] || avatars['marketing-associate'];
  };

  // Login function
  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      
      if (response.success && response.data) {
        const employeeData = response.data.employee;
        
        // Map the employee data to our User interface
        const mappedUser: User = {
          id: employeeData.id.toString(),
          name: `${employeeData.first_name} ${employeeData.last_name || ''}`.trim(),
          email: employeeData.email,
          role: employeeData.is_superadmin ? 'ceo' : determineRole({
            isSuperadmin: employeeData.is_superadmin,
            designationId: employeeData.designation_id
          }),
          branchId: employeeData.branch_id,
          departmentId: employeeData.department_id?.toString(),
          locationId: employeeData.branch_id?.toString(),
          employeeId: employeeData.employee_id,
          designationId: employeeData.designation_id,
          isActive: employeeData.is_active,
          isSuperadmin: employeeData.is_superadmin,
          avatar: getAvatarForRole(employeeData.is_superadmin ? 'ceo' : determineRole({
            isSuperadmin: employeeData.is_superadmin,
            designationId: employeeData.designation_id
          }))
        };
        
        setUser(mappedUser);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${mappedUser.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Login Failed",
          description: response.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      // Even if the API call fails, we still want to clear the local session
      setUser(null);
      
      toast({
        title: "Logout Issue",
        description: "You've been logged out locally, but there was an issue with the server",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, logout: handleLogout, setRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
