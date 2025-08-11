import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Building,
  Home,
  Users,
  FileText,
  Bell,
  MessageSquare,
  Shield,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  User,
  ChevronDown,
  Activity
} from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';

const VendorPortalLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, vendor, logout } = useVendorAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/vendor-portal/dashboard',
      icon: Home,
      description: 'Overview and quick actions'
    },
    {
      title: 'Profile',
      href: '/vendor-portal/profile',
      icon: Building,
      description: 'Company information and compliance'
    },
    {
      title: 'Contacts',
      href: '/vendor-portal/contacts',
      icon: Users,
      description: 'Manage points of contact'
    },
    {
      title: 'Assignments',
      href: '/vendor-portal/assignments',
      icon: FileText,
      description: 'View and manage assignments'
    },
    {
      title: 'Messages',
      href: '/vendor-portal/messages',
      icon: MessageSquare,
      description: 'Communication center'
    },
    {
      title: 'Notifications',
      href: '/vendor-portal/notifications',
      icon: Bell,
      description: 'System alerts and updates'
    }
  ];

  // Add commission item for sub-vendors
  if (vendor?.vendorType === 'Sub Vendor') {
    navigationItems.push({
      title: 'Commission',
      href: '/vendor-portal/commission',
      icon: DollarSign,
      description: 'Payment and commission details'
    });
  }

  navigationItems.push(
    {
      title: 'Reports',
      href: '/vendor-portal/reports',
      icon: Activity,
      description: 'Analytics and reports'
    },
    {
      title: 'Settings',
      href: '/vendor-portal/settings',
      icon: Settings,
      description: 'Account and preferences'
    }
  );

  const handleLogout = async () => {
    await logout();
    navigate('/vendor-portal/login');
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const NavigationContent = () => (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <div className="flex items-center space-x-2 mb-4">
          <Building className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Vendor Portal</h2>
            <p className="text-xs text-muted-foreground">{vendor?.displayName}</p>
          </div>
        </div>
        <Separator />
      </div>
      
      <div className="px-3">
        <nav className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                  isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground hidden lg:block">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:z-50 md:flex md:w-72 md:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card px-6">
          <NavigationContent />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <NavigationContent />
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-semibold">Vendor Portal</span>
          </div>
          
          {/* Mobile User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/vendor-portal/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/vendor-portal/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden md:block">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm md:ml-72">
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-lg font-semibold">
                  {navigationItems.find(item => isActiveRoute(item.href))?.title || 'Vendor Portal'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {vendor?.displayName} • {vendor?.vendorType}
                </p>
              </div>
              <Badge variant={vendor?.status === 'Active' ? 'success' : 'secondary'}>
                {vendor?.status}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" asChild>
                <Link to="/vendor-portal/notifications">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
              
              {/* Messages */}
              <Button variant="ghost" size="icon" asChild>
                <Link to="/vendor-portal/messages">
                  <MessageSquare className="h-4 w-4" />
                </Link>
              </Button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user?.role}</p>
                    </div>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <Badge variant="outline" className="w-fit text-xs">
                        {user?.role}
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/vendor-portal/profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/vendor-portal/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-72">
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default VendorPortalLayout;
