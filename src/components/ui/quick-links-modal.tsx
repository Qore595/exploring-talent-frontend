import React, { useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Users, ClipboardCheck, Calendar, MessageSquare, UserCog, Settings,
  Building, FileSearch, FileText, UserPlus, DollarSign, PieChart,
  Upload, Briefcase, Shield, UserCheck, Eye, LayoutDashboard,
  BookOpen, FolderOpen, FileUp, Mail, Send, Inbox, Archive,
  ClipboardList, FileCheck, GraduationCap, Workflow, Plus,
  BarChart, Calculator, TrendingUp, History, Handshake,
  Contact, CreditCard, Receipt, AlertTriangle, BarChart3,
  Home, MapPin, Phone, Globe, Award, Target, Clock,
  CheckCircle, XCircle, AlertCircle, Info, HelpCircle,
  Star, Heart, Bookmark, Flag, Tag, Filter, Search,
  Edit, Trash2, Copy, Share, Download, ExternalLink,
  ChevronRight, Grid3X3, List, Calendar as CalendarIcon,
  User, Users2, UserX, UserMinus, UserPlus2, Crown,
  Zap, Lightbulb, Rocket, Sparkles, Flame, Gem, Play,
  Menu as MenuIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { SidebarMenu, SubMenu } from '@/services/employeeService';

// Icon mapping for dynamic menu items
const iconMap: Record<string, React.ElementType> = {
  "dashboard": LayoutDashboard,
  "users": Users,
  "user": User,
  "user-plus": UserPlus,
  "user-check": UserCheck,
  "user-cog": UserCog,
  "settings": Settings,
  "building": Building,
  "briefcase": Briefcase,
  "file-text": FileText,
  "file-search": FileSearch,
  "file-check": FileCheck,
  "file-up": FileUp,
  "clipboard-check": ClipboardCheck,
  "clipboard-list": ClipboardList,
  "calendar": Calendar,
  "mail": Mail,
  "send": Send,
  "inbox": Inbox,
  "archive": Archive,
  "dollar-sign": DollarSign,
  "pie-chart": PieChart,
  "bar-chart": BarChart,
  "bar-chart-3": BarChart3,
  "trending-up": TrendingUp,
  "calculator": Calculator,
  "book-open": BookOpen,
  "graduation-cap": GraduationCap,
  "award": Award,
  "target": Target,
  "workflow": Workflow,
  "shield": Shield,
  "eye": Eye,
  "plus": Plus,
  "search": Search,
  "filter": Filter,
  "edit": Edit,
  "trash-2": Trash2,
  "copy": Copy,
  "share": Share,
  "download": Download,
  "external-link": ExternalLink,
  "globe": Globe,
  "home": Home,
  "map-pin": MapPin,
  "phone": Phone,
  "credit-card": CreditCard,
  "receipt": Receipt,
  "alert-triangle": AlertTriangle,
  "check-circle": CheckCircle,
  "x-circle": XCircle,
  "alert-circle": AlertCircle,
  "info": Info,
  "help-circle": HelpCircle,
  "star": Star,
  "heart": Heart,
  "bookmark": Bookmark,
  "flag": Flag,
  "tag": Tag,
  "clock": Clock,
  "history": History,
  "handshake": Handshake,
  "contact": Contact,
  "message-square": MessageSquare,
  "upload": Upload,
  "folder-open": FolderOpen,
  "list": List,
  "grid-3x3": Grid3X3,
  "menu": MenuIcon,
  "zap": Zap,
  "lightbulb": Lightbulb,
  "rocket": Rocket,
  "sparkles": Sparkles,
  "flame": Flame,
  "gem": Gem,
  "play": Play,
  "crown": Crown
};

// Define the menu item structure for quick links
interface QuickLinkItem {
  id: string | number;
  title: string;
  description?: string;
  icon: React.ElementType;
  url: string;
  category: string;
  badge?: string;
  level: number;
}

// Helper function to get icon component from string
const getIconComponent = (iconName: string): React.ElementType => {
  return iconMap[iconName] || MenuIcon;
};

// Helper function to process sidebar menus into quick links
const processSidebarMenus = (sidebarMenus: SidebarMenu[]): QuickLinkItem[] => {
  const quickLinks: QuickLinkItem[] = [];

  sidebarMenus.forEach(menu => {
    // Add main menu item if it has a URL
    if (menu.url) {
      quickLinks.push({
        id: menu.id,
        title: menu.menu,
        icon: getIconComponent(menu.icon),
        url: menu.url,
        category: 'Main Navigation',
        level: menu.level
      });
    }

    // Add submenu items
    if (menu.sub_menus && menu.sub_menus.length > 0) {
      menu.sub_menus.forEach(subMenu => {
        if (subMenu.is_active && subMenu.url) {
          quickLinks.push({
            id: `${menu.id}-${subMenu.id}`,
            title: subMenu.sub_menu,
            icon: getIconComponent(subMenu.icon),
            url: subMenu.url,
            category: menu.menu,
            level: subMenu.level
          });
        }
      });
    }
  });

  return quickLinks;
};

// Static menu items for features not yet in the API
const staticQuickLinks: QuickLinkItem[] = [
  // Main Navigation
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/dashboard',
    category: 'Main Navigation',
    level: 1
  },
  {
    id: 'coming-soon',
    title: 'Upcoming Features',
    icon: Rocket,
    url: '/coming-soon',
    category: 'Main Navigation',
    badge: 'New',
    level: 1
  },

  // Documentation
  {
    id: 'documentation',
    title: 'Documentation',
    icon: BookOpen,
    url: '/documentation',
    category: 'Documentation',
    level: 1
  },
  {
    id: 'document-templates',
    title: 'Document Templates',
    icon: FileText,
    url: '/document-templates',
    category: 'Documentation',
    level: 2
  },
  {
    id: 'document-groups',
    title: 'Document Groups',
    icon: FolderOpen,
    url: '/document-groups',
    category: 'Documentation',
    level: 2
  },
  {
    id: 'manual-documents',
    title: 'Manual Documents',
    icon: FileUp,
    url: '/manual-documents',
    category: 'Documentation',
    level: 2
  },

  // Email Templates
  {
    id: 'email-templates',
    title: 'Email Templates',
    icon: Mail,
    url: '/email-templates',
    category: 'Email Templates',
    level: 1
  },
  {
    id: 'template-manager',
    title: 'Template Manager',
    icon: Edit,
    url: '/email-templates',
    category: 'Email Templates',
    level: 2
  },
  {
    id: 'received-emails',
    title: 'Received Emails',
    icon: Inbox,
    url: '/email-management/received',
    category: 'Email Templates',
    level: 2
  },
  {
    id: 'sent-history',
    title: 'Sent History',
    icon: Send,
    url: '/email-management/sent',
    category: 'Email Templates',
    level: 2
  },
  {
    id: 'usage-tracking',
    title: 'Usage Tracking',
    icon: BarChart,
    url: '/email-management/usage',
    category: 'Email Templates',
    level: 2
  },

  // HR Onboarding
  {
    id: 'hr-onboarding',
    title: 'HR Onboarding',
    icon: UserPlus,
    url: '/hr-onboarding',
    category: 'HR Onboarding',
    level: 1
  },
  {
    id: 'hr-onboarding-dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/hr-onboarding/dashboard',
    category: 'HR Onboarding',
    level: 2
  },
  {
    id: 'hr-onboarding-candidates',
    title: 'Candidates',
    icon: Users,
    url: '/hr-onboarding/candidates',
    category: 'HR Onboarding',
    level: 2
  },
  {
    id: 'hr-onboarding-tasks',
    title: 'Tasks',
    icon: ClipboardList,
    url: '/hr-onboarding/tasks',
    category: 'HR Onboarding',
    level: 2
  },
  {
    id: 'hr-onboarding-documents',
    title: 'Documents',
    icon: FileText,
    url: '/hr-onboarding/documents',
    category: 'HR Onboarding',
    level: 2
  },
  {
    id: 'hr-onboarding-training',
    title: 'Training',
    icon: GraduationCap,
    url: '/hr-onboarding/training',
    category: 'HR Onboarding',
    level: 2
  },

  // Margin Calculator
  {
    id: 'margin-calculator',
    title: 'Margin Calculator',
    icon: Calculator,
    url: '/margin-calculator',
    category: 'Margin Calculator',
    level: 1
  },
  {
    id: 'margin-calculator-dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/margin-calculator/dashboard',
    category: 'Margin Calculator',
    level: 2
  },
  {
    id: 'hourly-calculator',
    title: 'Hourly Calculator',
    icon: Clock,
    url: '/margin-calculator/hourly',
    category: 'Margin Calculator',
    level: 2
  },
  {
    id: 'w2-salary-calculator',
    title: 'W2 Salary Calculator',
    icon: DollarSign,
    url: '/margin-calculator/w2-salary',
    category: 'Margin Calculator',
    level: 2
  },
  {
    id: 'contractor-calculator',
    title: '1099/C2C Calculator',
    icon: Calculator,
    url: '/margin-calculator/contractor',
    category: 'Margin Calculator',
    level: 2
  },
  {
    id: 'margin-calculator-approvals',
    title: 'Approvals',
    icon: CheckCircle,
    url: '/margin-calculator/approvals',
    category: 'Margin Calculator',
    level: 2
  },
  {
    id: 'margin-calculator-reports',
    title: 'Reports & Audit',
    icon: BarChart,
    url: '/margin-calculator/reports',
    category: 'Margin Calculator',
    level: 2
  },

  // Bench Resources
  {
    id: 'bench-resources',
    title: 'Bench Resources',
    icon: Users,
    url: '/bench-resources',
    category: 'Bench Resources',
    level: 1
  },
  {
    id: 'available-resources',
    title: 'Available Resources',
    icon: Users,
    url: '/bench-resources',
    category: 'Bench Resources',
    level: 2
  },
  {
    id: 'status-pipeline',
    title: 'Status Pipeline',
    icon: Workflow,
    url: '/bench-resources/pipeline',
    category: 'Bench Resources',
    level: 2
  },
  {
    id: 'auto-enrollment-settings',
    title: 'Auto-Enrollment Settings',
    icon: Settings,
    url: '/bench-resources/settings',
    category: 'Bench Resources',
    level: 2
  },

  // Vendor Hub
  {
    id: 'vendor-hub',
    title: 'Vendor Hub',
    icon: Handshake,
    url: '/vendor-hub',
    category: 'Vendor Hub',
    level: 1
  },
  {
    id: 'vendor-hub-dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/vendor-hub/dashboard',
    category: 'Vendor Hub',
    level: 2
  },
  {
    id: 'vendor-registry',
    title: 'Vendor Registry',
    icon: Building,
    url: '/vendor-hub/vendors',
    category: 'Vendor Hub',
    level: 2
  },
  {
    id: 'poc-management',
    title: 'PoC Management',
    icon: Contact,
    url: '/vendor-hub/pocs',
    category: 'Vendor Hub',
    level: 2
  },
  {
    id: 'validation-reminders',
    title: 'Validation Reminders',
    icon: AlertTriangle,
    url: '/vendor-hub/validation-reminders',
    category: 'Vendor Hub',
    level: 2
  },
  {
    id: 'communication-logs',
    title: 'Communication Logs',
    icon: MessageSquare,
    url: '/vendor-hub/communication-logs',
    category: 'Vendor Hub',
    level: 2
  },
  {
    id: 'vendor-hub-reports',
    title: 'Reports & Analytics',
    icon: BarChart,
    url: '/vendor-hub/reports',
    category: 'Vendor Hub',
    level: 2
  },
  {
    id: 'vendor-hub-settings',
    title: 'Settings',
    icon: Settings,
    url: '/vendor-hub/settings',
    category: 'Vendor Hub',
    level: 2
  },

  // Hotlist Management
  {
    id: 'hotlist-management',
    title: 'Hotlist Management',
    icon: Mail,
    url: '/hotlists',
    category: 'Hotlist Management',
    level: 1
  },
  {
    id: 'hotlist-dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/hotlists',
    category: 'Hotlist Management',
    level: 2
  },
  {
    id: 'create-hotlist',
    title: 'Create Hotlist',
    icon: Plus,
    url: '/hotlists/create',
    category: 'Hotlist Management',
    level: 2
  },
  {
    id: 'scheduled-hotlists',
    title: 'Scheduled Hotlists',
    icon: Calendar,
    url: '/hotlists/scheduled',
    category: 'Hotlist Management',
    level: 2
  },
  {
    id: 'performance-analytics',
    title: 'Performance Analytics',
    icon: BarChart,
    url: '/hotlists/analytics',
    category: 'Hotlist Management',
    level: 2
  },
  {
    id: 'subject-templates',
    title: 'Subject Templates',
    icon: FileText,
    url: '/hotlists/templates',
    category: 'Hotlist Management',
    level: 2
  },

  // Accounts
  {
    id: 'accounts',
    title: 'Accounts',
    icon: CreditCard,
    url: '/accounts',
    category: 'Accounts',
    level: 1
  },
  {
    id: 'invoices',
    title: 'Invoices',
    icon: Receipt,
    url: '/accounts/invoices',
    category: 'Accounts',
    level: 2
  },
  {
    id: 'timesheets',
    title: 'Timesheets',
    icon: Clock,
    url: '/accounts/timesheets',
    category: 'Accounts',
    level: 2
  },
  {
    id: 'pto-management',
    title: 'PTO Management',
    icon: Calendar,
    url: '/accounts/pto-management',
    category: 'Accounts',
    level: 2
  },
  {
    id: 'accounts-approvals',
    title: 'Approvals',
    icon: CheckCircle,
    url: '/accounts/approvals',
    category: 'Accounts',
    level: 2
  },
  {
    id: 'overdue-dashboard',
    title: 'Overdue Dashboard',
    icon: AlertTriangle,
    url: '/accounts/overdue-dashboard',
    category: 'Accounts',
    level: 2
  },

  // Administration
  {
    id: 'settings',
    title: 'Settings',
    icon: Settings,
    url: '/settings',
    category: 'Administration',
    level: 1
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: BarChart,
    url: '/reports',
    category: 'Analytics',
    level: 1
  },
];

// Interface for the modal props
interface QuickLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarMenus?: SidebarMenu[];
}

export function QuickLinksModal({ isOpen, onClose, sidebarMenus = [] }: QuickLinksModalProps) {
  // Process sidebar menus and combine with static links
  const allQuickLinks = useMemo(() => {
    const dynamicLinks = processSidebarMenus(sidebarMenus);
    return [...staticQuickLinks, ...dynamicLinks];
  }, [sidebarMenus]);

  // Group items by category
  const groupedQuickLinks = useMemo(() => {
    return allQuickLinks.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, QuickLinkItem[]>);
  }, [allQuickLinks]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Grid3X3 className="h-6 w-6 text-primary" />
            Quick Links
          </DialogTitle>
          <DialogDescription className="text-base">
            Access all modules and features quickly from here
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[calc(95vh-140px)]">
          <div className="space-y-8 py-4">
            {Object.entries(groupedQuickLinks).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center gap-3 pb-2">
                  <div className="h-px bg-gradient-to-r from-primary/50 to-transparent flex-1" />
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                    <Badge variant="secondary" className="text-xs px-2 py-0.5">
                      {items.length}
                    </Badge>
                  </div>
                  <div className="h-px bg-gradient-to-l from-primary/50 to-transparent flex-1" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {items.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.id}
                        to={item.url}
                        onClick={onClose}
                        className={cn(
                          "group relative p-4 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:scale-[1.02]",
                          "flex flex-col items-center text-center space-y-3 min-h-[120px] cursor-pointer"
                        )}
                      >
                        {item.badge && (
                          <Badge
                            variant="default"
                            className="absolute -top-2 -right-2 text-xs px-2 py-0.5 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-md"
                          >
                            {item.badge}
                          </Badge>
                        )}

                        <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-300 group-hover:scale-110">
                          <IconComponent className="h-6 w-6 text-primary group-hover:text-primary transition-colors" />
                        </div>

                        <div className="space-y-1 flex-1 flex flex-col justify-center">
                          <h4 className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2 transition-colors">
                            {item.title}
                          </h4>
                          {item.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 absolute bottom-3 right-3 group-hover:translate-x-0.5" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
