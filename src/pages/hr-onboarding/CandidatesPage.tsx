import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Download,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { hrOnboardingService } from '@/services/hrOnboardingService';
import { OnboardingCandidate, CandidateFilters, OnboardingStatus } from '@/types/hrOnboarding';

const CandidatesPage: React.FC = () => {
  const [candidates, setCandidates] = useState<OnboardingCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [filters, setFilters] = useState<CandidateFilters>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadCandidates();
  }, [pagination.page, filters, searchTerm]);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const searchFilters = searchTerm ? { ...filters, search: searchTerm } : filters;
      const response = await hrOnboardingService.getCandidates(
        pagination.page,
        pagination.limit,
        searchFilters
      );
      setCandidates(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error loading candidates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load candidates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      await hrOnboardingService.deleteCandidate(id);
      toast({
        title: 'Success',
        description: 'Candidate deleted successfully',
      });
      loadCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete candidate',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  };

  const handleBulkStatusUpdate = async (status: OnboardingStatus) => {
    if (selectedCandidates.length === 0) return;

    try {
      await hrOnboardingService.bulkUpdateCandidateStatus(selectedCandidates, status);
      toast({
        title: 'Success',
        description: `${selectedCandidates.length} candidates updated successfully`,
      });
      setSelectedCandidates([]);
      loadCandidates();
    } catch (error) {
      console.error('Error updating candidates:', error);
      toast({
        title: 'Error',
        description: 'Failed to update candidates',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: OnboardingStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OnboardingStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(candidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (candidateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates(prev => [...prev, candidateId]);
    } else {
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Onboarding Candidates</h1>
          <p className="text-gray-600 mt-1">Manage and track candidate onboarding progress</p>
        </div>
        <Link to="/hr-onboarding/candidates/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search candidates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                status: value === 'all' ? undefined : value as OnboardingStatus
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.department || 'all'}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                department: value === 'all' ? undefined : value
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Sales">Sales</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedCandidates.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedCandidates.length} candidate(s) selected
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('in-progress')}
                >
                  Mark In Progress
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('completed')}
                >
                  Mark Completed
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusUpdate('on-hold')}
                >
                  Put On Hold
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates ({pagination.total})</CardTitle>
          <CardDescription>
            Overview of all onboarding candidates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedCandidates.length === candidates.length && candidates.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={(checked) => handleSelectCandidate(candidate.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={candidate.avatar} />
                          <AvatarFallback>
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{candidate.firstName} {candidate.lastName}</p>
                          <p className="text-sm text-gray-500">{candidate.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{candidate.position}</TableCell>
                    <TableCell>{candidate.department}</TableCell>
                    <TableCell>{candidate.manager}</TableCell>
                    <TableCell>{new Date(candidate.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(candidate.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(candidate.status)}
                          {candidate.status}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Progress value={candidate.progress} className="w-16" />
                        <span className="text-sm text-gray-600">{candidate.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <Link to={`/hr-onboarding/candidates/${candidate.id}`}>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                          </Link>
                          <Link to={`/hr-onboarding/candidates/${candidate.id}/edit`}>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setCandidateToDelete(candidate.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this candidate? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => candidateToDelete && handleDeleteCandidate(candidateToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidatesPage;
