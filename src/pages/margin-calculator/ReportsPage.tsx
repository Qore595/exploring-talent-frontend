import React, { useState, useEffect } from 'react';
import { FileText, Download, Filter, ArrowLeft, TrendingUp, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isAdmin } from '@/utils/adminPermissions';
import { AuditLogEntry } from '@/types/marginCalculator';
import { marginCalculatorService } from '@/services/marginCalculatorService';
import { toast } from '@/hooks/use-toast';

const ReportsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const adminUser = isAdmin(user?.role);
  const isManager = user?.role === 'branch-manager' || user?.role === 'marketing-head' || user?.role === 'marketing-supervisor';
  const canViewAllReports = adminUser || isManager;

  // State
  const [reportData, setReportData] = useState<any[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [statistics, setStatistics] = useState({
    totalCalculations: 0,
    averageNetMargin: 0,
    totalRevenue: 0,
    averageClientRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    engagementType: 'all',
    status: 'all',
  });

  // Load data
  useEffect(() => {
    loadReportData();
    loadAuditLog();
    loadStatistics();
  }, []);

  const loadReportData = async () => {
    try {
      const data = await marginCalculatorService.getCalculations(filters);
      setReportData(data);
    } catch (error) {
      console.error('Error loading report data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load report data',
        variant: 'destructive',
      });
    }
  };

  const loadAuditLog = async () => {
    try {
      const log = await marginCalculatorService.getAuditLog();
      setAuditLog(log);
    } catch (error) {
      console.error('Error loading audit log:', error);
      toast({
        title: 'Error',
        description: 'Failed to load audit log',
        variant: 'destructive',
      });
    }
  };

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const stats = await marginCalculatorService.getStatistics();
      setStatistics({
        totalCalculations: stats.totalCalculations,
        averageNetMargin: stats.averageNetMargin,
        totalRevenue: stats.averageNetMargin * 160, // Monthly estimate
        averageClientRate: 108, // This would come from the actual data
      });
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    loadReportData();
  };

  const handleExportReport = () => {
    // In a real implementation, this would generate and download a report
    toast({
      title: 'Export Started',
      description: 'Your report is being generated and will be downloaded shortly.',
    });
  };



  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/margin-calculator/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-500" />
            Reports & Audit Trail
          </h1>
          <p className="text-muted-foreground mt-2">
            View margin calculation reports and audit logs
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter reports by date range, type, and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date From</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Date To</label>
              <Input type="date" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Engagement Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="w2-hourly">W2 Hourly</SelectItem>
                  <SelectItem value="w2-salary">W2 Salary</SelectItem>
                  <SelectItem value="1099">1099</SelectItem>
                  <SelectItem value="c2c">C2C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" onClick={handleApplyFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
            <Button onClick={handleExportReport}>
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Placements</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCalculations}</div>
            <p className="text-xs text-muted-foreground">This period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Client Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${statistics.averageClientRate}
            </div>
            <p className="text-xs text-muted-foreground">Per hour</p>
          </CardContent>
        </Card>

        {canViewAllReports && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Net Margin</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${statistics.averageNetMargin.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Per hour</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${statistics.totalRevenue.toFixed(0)}
                </div>
                <p className="text-xs text-muted-foreground">Monthly estimate</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Detailed Report */}
      <Card>
        <CardHeader>
          <CardTitle>Margin Calculation Report</CardTitle>
          <CardDescription>Detailed breakdown of all margin calculations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Candidate</th>
                  <th className="text-left p-2">Position</th>
                  <th className="text-left p-2">Source Type</th>
                  <th className="text-left p-2">Engagement</th>
                  <th className="text-left p-2">Client Rate</th>
                  <th className="text-left p-2">Vendor Fee</th>
                  {canViewAllReports && (
                    <>
                      <th className="text-left p-2">Available Margin</th>
                      <th className="text-left p-2">Candidate Cost</th>
                      <th className="text-left p-2">Net Margin</th>
                      <th className="text-left p-2">Recruiter Comm.</th>
                    </>
                  )}
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{item.candidateName}</td>
                    <td className="p-2">{item.position}</td>
                    <td className="p-2">{item.sourceType}</td>
                    <td className="p-2">{item.engagementType}</td>
                    <td className="p-2">${item.clientRate}/hr</td>
                    <td className="p-2">${item.vendorFee}</td>
                    {canViewAllReports && (
                      <>
                        <td className="p-2">${item.availableMargin}</td>
                        <td className="p-2">${item.candidateCost}/hr</td>
                        <td className="p-2 text-green-600 font-medium">${item.netMargin}/hr</td>
                        <td className="p-2">${item.recruiterCommission}</td>
                      </>
                    )}
                    <td className="p-2">{item.placementDate}</td>
                    <td className="p-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
          <CardDescription>Complete log of all margin calculator actions and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLog.map((log) => (
              <div key={log.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium">{log.action}</span>
                    <span className="text-sm text-muted-foreground">by {log.user}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    <strong>Candidate:</strong> {log.candidateName}
                  </p>
                  <p className="text-sm mb-2">{log.details}</p>
                  <p className="text-xs text-muted-foreground">{log.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
