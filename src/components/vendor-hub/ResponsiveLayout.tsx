// Responsive Layout Component for Vendor Hub
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Menu, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Smartphone,
  Tablet,
  Monitor
} from 'lucide-react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
}

// Hook for detecting screen size
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWidth(newWidth);
      
      if (newWidth < 768) {
        setScreenSize('mobile');
      } else if (newWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { screenSize, width, isMobile: screenSize === 'mobile', isTablet: screenSize === 'tablet', isDesktop: screenSize === 'desktop' };
};

// Responsive Grid Component
export const ResponsiveGrid: React.FC<{
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
  className?: string;
}> = ({ children, cols = { mobile: 1, tablet: 2, desktop: 3 }, gap = 4, className }) => {
  const gridClasses = cn(
    'grid',
    `gap-${gap}`,
    `grid-cols-${cols.mobile || 1}`,
    `md:grid-cols-${cols.tablet || 2}`,
    `lg:grid-cols-${cols.desktop || 3}`,
    className
  );

  return <div className={gridClasses}>{children}</div>;
};

// Responsive Card Stack Component
export const ResponsiveCardStack: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { isMobile } = useScreenSize();

  return (
    <div className={cn(
      'space-y-4',
      !isMobile && 'md:space-y-6',
      className
    )}>
      {children}
    </div>
  );
};

// Responsive Table Wrapper
export const ResponsiveTableWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    return (
      <div className={cn('space-y-4', className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <div className="min-w-full">
        {children}
      </div>
    </div>
  );
};

// Mobile-First Navigation
export const MobileNavigation: React.FC<{
  items: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
    active?: boolean;
  }>;
  onItemClick?: (href: string) => void;
}> = ({ items, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <ScrollArea className="h-full">
          <nav className="space-y-2">
            {items.map((item, index) => (
              <Button
                key={index}
                variant={item.active ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  onItemClick?.(item.href);
                  setIsOpen(false);
                }}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </Button>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

// Responsive Action Bar
export const ResponsiveActionBar: React.FC<{
  primaryActions: React.ReactNode[];
  secondaryActions?: React.ReactNode[];
  title?: string;
  subtitle?: string;
  className?: string;
}> = ({ primaryActions, secondaryActions, title, subtitle, className }) => {
  const { isMobile } = useScreenSize();

  if (isMobile) {
    return (
      <div className={cn('space-y-4', className)}>
        {(title || subtitle) && (
          <div>
            {title && <h1 className="text-2xl font-bold">{title}</h1>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="flex flex-col space-y-2">
          {primaryActions.map((action, index) => (
            <div key={index} className="w-full">
              {action}
            </div>
          ))}
        </div>
        {secondaryActions && secondaryActions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {secondaryActions.map((action, index) => (
              <div key={index}>
                {action}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div>
        {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-2">
        {secondaryActions?.map((action, index) => (
          <div key={index}>{action}</div>
        ))}
        {primaryActions.map((action, index) => (
          <div key={index}>{action}</div>
        ))}
      </div>
    </div>
  );
};

// Responsive Form Layout
export const ResponsiveFormLayout: React.FC<{
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  className?: string;
}> = ({ children, columns = { mobile: 1, tablet: 2, desktop: 2 }, className }) => {
  return (
    <div className={cn(
      'grid gap-4',
      `grid-cols-${columns.mobile || 1}`,
      `md:grid-cols-${columns.tablet || 2}`,
      `lg:grid-cols-${columns.desktop || 2}`,
      className
    )}>
      {children}
    </div>
  );
};

// Responsive Stats Grid
export const ResponsiveStatsGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <div className={cn(
      'grid gap-4',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-4',
      className
    )}>
      {children}
    </div>
  );
};

// Responsive Content Container
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}> = ({ children, maxWidth = 'full', padding = true, className }) => {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'mx-auto',
      maxWidthClasses[maxWidth],
      padding && 'px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  );
};

// Responsive Sidebar Layout
export const ResponsiveSidebarLayout: React.FC<{
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarWidth?: string;
  collapsible?: boolean;
  className?: string;
}> = ({ sidebar, children, sidebarWidth = '280px', collapsible = true, className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isMobile, isTablet } = useScreenSize();

  if (isMobile) {
    return (
      <div className={cn('flex flex-col h-full', className)}>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('flex h-full', className)}>
      {/* Sidebar */}
      <div 
        className={cn(
          'flex-shrink-0 border-r bg-background transition-all duration-300',
          isCollapsed ? 'w-16' : `w-[${sidebarWidth}]`,
          isTablet && 'w-16'
        )}
      >
        {collapsible && !isMobile && (
          <div className="flex justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8"
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
        <div className={cn(
          'overflow-hidden',
          (isCollapsed || isTablet) && 'px-2'
        )}>
          {sidebar}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

// Device Preview Component (for testing)
export const DevicePreview: React.FC<{
  children: React.ReactNode;
  device: 'mobile' | 'tablet' | 'desktop';
}> = ({ children, device }) => {
  const deviceStyles = {
    mobile: 'w-[375px] h-[667px]',
    tablet: 'w-[768px] h-[1024px]',
    desktop: 'w-[1200px] h-[800px]'
  };

  const deviceIcons = {
    mobile: Smartphone,
    tablet: Tablet,
    desktop: Monitor
  };

  const Icon = deviceIcons[device];

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <div className="flex items-center space-x-2 mb-4">
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium capitalize">{device} Preview</span>
      </div>
      <div className={cn(
        'border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg',
        deviceStyles[device]
      )}>
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Main Responsive Layout Component
const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  sidebar,
  header,
  className
}) => {
  const { isMobile } = useScreenSize();

  return (
    <div className={cn('min-h-screen bg-background', className)}>
      {header && (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          {header}
        </header>
      )}
      
      <div className="flex h-[calc(100vh-4rem)]">
        {sidebar && !isMobile && (
          <aside className="w-64 border-r bg-background overflow-auto">
            {sidebar}
          </aside>
        )}
        
        <main className="flex-1 overflow-auto">
          <ResponsiveContainer>
            {children}
          </ResponsiveContainer>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveLayout;
