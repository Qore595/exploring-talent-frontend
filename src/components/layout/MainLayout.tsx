import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import AppSidebar from './AppSidebar';
import Navbar from './Navbar';
import { employeeService } from '@/services/employeeService';
import { SidebarMenu } from '@/services/employeeService';
import { cn } from '@/lib/utils';
import '../../styles/perfect-sidebar.css';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const { user } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default to open on desktop
  const [sidebarMenus, setSidebarMenus] = useState<SidebarMenu[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobile = useIsMobile();

  // Sidebar dimensions
  const SIDEBAR_WIDTH_EXPANDED = 256; // 16rem
  const SIDEBAR_WIDTH_COLLAPSED = 80;  // 5rem

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      if (user?.id) {
        try {
          const response = await employeeService.getEmployeeById(user.id);
          console.log("MainLayout - Full employee profile response:", response);
          
          // Check if response has the expected structure
          if (response?.success && response?.data) {
            // Extract sidebar menus from the response
            const menus = response.sidebar_menus || [];
            setSidebarMenus(menus);
            console.log("MainLayout - Successfully set sidebar menus:", menus);
          } else {
            console.error("Failed to fetch sidebar menus or menus not found:", response);
            setSidebarMenus([]); // Set empty array if menus not found
          }
        } catch (error) {
          console.error("Error fetching employee profile for sidebar:", error);
          setSidebarMenus([]); // Set empty array on error
        }
      }
    };

    fetchEmployeeProfile();
  }, [user?.id]); // Refetch when user ID changes

  // Handle sidebar toggle with smooth transitions
  const handleSidebarToggle = useCallback(() => {
    setIsTransitioning(true);
    setSidebarOpen(prev => !prev);
    
    // Reset transition state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, []);

  // Set initial sidebar state based on screen size
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    // Add a slight delay for the animation to take effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Calculate current sidebar width
  const currentSidebarWidth = isMobile
    ? (sidebarOpen ? SIDEBAR_WIDTH_EXPANDED : 0)
    : (sidebarOpen ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED);

  // If no user, don't render the layout (will be handled by auth protection)
  if (!user) return <>{children}</>;

  return (
    <div className={cn(
      "perfect-layout sidebar-optimized",
      isTransitioning && "layout-transitioning"
    )}>
      {/* Mobile Overlay */}
      <div
        className={cn(
          "perfect-overlay",
          isMobile && sidebarOpen && "visible"
        )}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Container */}
      <div
        className={cn(
          "perfect-sidebar",
          isMobile
            ? (sidebarOpen ? "expanded" : "mobile-hidden")
            : (sidebarOpen ? "expanded" : "collapsed")
        )}
      >
        <AppSidebar
          isOpen={sidebarOpen}
          onOpenChange={setSidebarOpen}
          isMobile={isMobile}
          sidebarMenus={sidebarMenus}
        />
      </div>

      {/* Main Content Container */}
      <div
        className={cn(
          "perfect-main",
          isLoaded ? 'opacity-100' : 'opacity-0',
          isMobile
            ? "mobile"
            : (sidebarOpen ? "with-expanded-sidebar" : "with-collapsed-sidebar")
        )}
      >
        {/* Navbar */}
        <div className="perfect-navbar">
          <Navbar onMenuClick={handleSidebarToggle} />
        </div>

        {/* Main Content Area */}
        <main className="perfect-content !p-0 bg-background/50">
          <div className={cn(
            "transition-all duration-300 ease-in-out h-full min-h-screen",
            isLoaded ? "animate-fade-in" : "opacity-0"
          )}>
            <div className="p-6 space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
