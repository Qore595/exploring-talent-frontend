// Version History Component for Audit Tracking
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  History,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Download,
  Calendar,
  User,
  FileText,
  Edit,
  Trash2,
  Plus,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw
} from 'lucide-react';
import { VersionHistory } from '@/types/vendor';

interface VersionHistoryProps {
  entityType: 'Vendor' | 'PoC';
  entityId: string;
  entityName?: string;
  showFilters?: boolean;
  maxHeight?: string;
  className?: string;
}

const VersionHistoryComponent: React.FC<VersionHistoryProps> = ({
  entityType,
  entityId,
  entityName,
  showFilters = true,
  maxHeight = "400px",
  className
}) => {
  const [history, setHistory] = useState<VersionHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<VersionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<VersionHistory | null>(null);
  const [filters, setFilters] = useState({
    changeType: '',
    changedBy: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const mockHistory: VersionHistory[] = [
      {
        id: '1',
        entityType,
        entityId,
        changeType: 'Updated',
        fieldChanges: {
          email: { oldValue: 'old.email@company.com', newValue: 'new.email@company.com' },
          phone: { oldValue: '+1-555-0123', newValue: '+1-555-0124' },
          validationStatus: { oldValue: 'Overdue', newValue: 'Validated' }
        },
        changedBy: 'admin',
        changeReason: 'Contact information update requested by vendor',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        metadata: {
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0...',
          sessionId: 'sess_123456'
        }
      },
      {
        id: '2',
        entityType,
        entityId,
        changeType: 'Status Changed',
        fieldChanges: {
          status: { oldValue: 'Inactive', newValue: 'Active' },
          isPrimary: { oldValue: false, newValue: true }
        },
        changedBy: 'hr_manager',
        changeReason: 'Reactivated after vendor contract renewal',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        metadata: {
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0...',
          sessionId: 'sess_789012'
        }
      },
      {
        id: '3',
        entityType,
        entityId,
        changeType: 'Created',
        fieldChanges: {
          name: { oldValue: null, newValue: 'John Smith' },
          email: { oldValue: null, newValue: 'john.smith@company.com' },
          role: { oldValue: null, newValue: 'Relationship Manager' },
          status: { oldValue: null, newValue: 'Active' }
        },
        changedBy: 'system',
        changeReason: 'Initial contact creation during vendor onboarding',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        metadata: {
          ipAddress: '192.168.1.102',
          userAgent: 'System/1.0',
          sessionId: 'sys_345678'
        }
      }
    ];

    setTimeout(() => {
      setHistory(mockHistory);
      setFilteredHistory(mockHistory);
      setIsLoading(false);
    }, 1000);
  }, [entityType, entityId]);

  // Filter history based on current filters
  useEffect(() => {
    let filtered = history;

    if (filters.changeType) {
      filtered = filtered.filter(entry => entry.changeType === filters.changeType);
    }

    if (filters.changedBy) {
      filtered = filtered.filter(entry => 
        entry.changedBy.toLowerCase().includes(filters.changedBy.toLowerCase())
      );
    }

    if (filters.searchTerm) {
      filtered = filtered.filter(entry =>
        entry.changeReason?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        Object.keys(entry.fieldChanges).some(field =>
          field.toLowerCase().includes(filters.searchTerm.toLowerCase())
        )
      );
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(entry => entry.timestamp >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(entry => entry.timestamp <= toDate);
    }

    setFilteredHistory(filtered);
  }, [history, filters]);

  const getChangeTypeBadge = (changeType: string) => {
    const variants: Record<string, any> = {
      'Created': { variant: 'success', icon: Plus },
      'Updated': { variant: 'default', icon: Edit },
      'Status Changed': { variant: 'warning', icon: RefreshCw },
      'Deleted': { variant: 'destructive', icon: Trash2 },
    };
    
    const config = variants[changeType] || { variant: 'secondary', icon: FileText };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {changeType}
      </Badge>
    );
  };

  const formatFieldChange = (field: string, change: { oldValue: any; newValue: any }) => {
    const formatValue = (value: any) => {
      if (value === null || value === undefined) return 'None';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (value instanceof Date) return value.toLocaleDateString();
      return String(value);
    };

    return (
      <div className="space-y-1">
        <div className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</div>
        <div className="text-xs text-muted-foreground">
          <span className="line-through">{formatValue(change.oldValue)}</span>
          {' → '}
          <span className="font-medium">{formatValue(change.newValue)}</span>
        </div>
      </div>
    );
  };

  const handleExportHistory = () => {
    // TODO: Implement export functionality
    console.log('Exporting history for:', entityType, entityId);
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading version history...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Version History</span>
            </CardTitle>
            <CardDescription>
              Audit trail for {entityName || `${entityType} ${entityId}`}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleExportHistory}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        {showFilters && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search changes..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Change Type</label>
              <Select
                value={filters.changeType}
                onValueChange={(value) => setFilters(prev => ({ ...prev, changeType: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="Created">Created</SelectItem>
                  <SelectItem value="Updated">Updated</SelectItem>
                  <SelectItem value="Status Changed">Status Changed</SelectItem>
                  <SelectItem value="Deleted">Deleted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Changed By</label>
              <Input
                placeholder="Username..."
                value={filters.changedBy}
                onChange={(e) => setFilters(prev => ({ ...prev, changedBy: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="flex space-x-2">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  className="text-xs"
                />
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  className="text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {filteredHistory.length} of {history.length} entries</span>
          {Object.values(filters).some(filter => filter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ changeType: '', changedBy: '', dateFrom: '', dateTo: '', searchTerm: '' })}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {/* History Table */}
        <div style={{ maxHeight }} className="overflow-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Change</TableHead>
                <TableHead>Fields Modified</TableHead>
                <TableHead>Changed By</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistory.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="space-y-2">
                      {getChangeTypeBadge(entry.changeType)}
                      {entry.changeReason && (
                        <p className="text-xs text-muted-foreground">{entry.changeReason}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {Object.entries(entry.fieldChanges).slice(0, 2).map(([field, change]) => (
                        <div key={field} className="text-xs">
                          <span className="font-medium capitalize">
                            {field.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        </div>
                      ))}
                      {Object.keys(entry.fieldChanges).length > 2 && (
                        <p className="text-xs text-muted-foreground">
                          +{Object.keys(entry.fieldChanges).length - 2} more
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{entry.changedBy}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">{entry.timestamp.toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Change Details</DialogTitle>
                          <DialogDescription>
                            {entry.changeType} on {entry.timestamp.toLocaleString()}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-medium mb-2">Change Information</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Type:</span>
                                  {getChangeTypeBadge(entry.changeType)}
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Changed by:</span>
                                  <span>{entry.changedBy}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Date:</span>
                                  <span>{entry.timestamp.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                            
                            {entry.metadata && (
                              <div>
                                <h4 className="text-sm font-medium mb-2">Session Information</h4>
                                <div className="space-y-2 text-sm">
                                  {entry.metadata.ipAddress && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">IP Address:</span>
                                      <span className="font-mono text-xs">{entry.metadata.ipAddress}</span>
                                    </div>
                                  )}
                                  {entry.metadata.sessionId && (
                                    <div className="flex justify-between">
                                      <span className="text-muted-foreground">Session:</span>
                                      <span className="font-mono text-xs">{entry.metadata.sessionId}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="text-sm font-medium mb-3">Field Changes</h4>
                            <div className="grid gap-3 md:grid-cols-2">
                              {Object.entries(entry.fieldChanges).map(([field, change]) => (
                                <div key={field} className="p-3 border rounded-lg">
                                  {formatFieldChange(field, change)}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {entry.changeReason && (
                            <>
                              <Separator />
                              <div>
                                <h4 className="text-sm font-medium mb-2">Reason</h4>
                                <p className="text-sm text-muted-foreground">{entry.changeReason}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8">
            <History className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-sm font-medium mb-1">No history found</h3>
            <p className="text-xs text-muted-foreground">
              {history.length === 0 
                ? "No changes have been recorded yet."
                : "Try adjusting your filters."
              }
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VersionHistoryComponent;
