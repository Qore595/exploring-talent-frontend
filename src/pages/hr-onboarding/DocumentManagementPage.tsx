import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Upload,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { OnboardingDocument, DocumentFilters, DocumentStatus } from '@/types/hrOnboarding';

const DocumentManagementPage: React.FC = () => {
  const [documents, setDocuments] = useState<OnboardingDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [filters, setFilters] = useState<DocumentFilters>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadDocuments();
  }, [pagination.page, filters, searchTerm]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const searchFilters = searchTerm ? { ...filters, search: searchTerm } : filters;
      const response = await hrOnboardingService.getDocuments(
        pagination.page,
        pagination.limit,
        searchFilters
      );
      setDocuments(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.total,
      }));
    } catch (error) {
      console.error('Error loading documents:', error);
      toast({
        title: 'Error',
        description: 'Failed to load documents',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await hrOnboardingService.deleteDocument(id);
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
      loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
    setDeleteDialogOpen(false);
    setDocumentToDelete(null);
  };

  const handleStatusUpdate = async (documentId: string, status: DocumentStatus) => {
    try {
      await hrOnboardingService.updateDocument({
        id: documentId,
        status,
        verifiedDate: status === 'verified' ? new Date().toISOString().split('T')[0] : undefined,
        verifiedBy: status === 'verified' ? 'Current User' : undefined,
      });
      toast({
        title: 'Success',
        description: 'Document status updated successfully',
      });
      loadDocuments();
    } catch (error) {
      console.error('Error updating document status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update document status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: DocumentStatus) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal':
        return 'bg-blue-100 text-blue-800';
      case 'legal':
        return 'bg-purple-100 text-purple-800';
      case 'tax':
        return 'bg-green-100 text-green-800';
      case 'benefits':
        return 'bg-orange-100 text-orange-800';
      case 'compliance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: DocumentStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'uploaded':
        return <Upload className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'rejected':
        return <X className="h-4 w-4" />;
      case 'expired':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(documents.map(d => d.id));
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments(prev => [...prev, documentId]);
    } else {
      setSelectedDocuments(prev => prev.filter(id => id !== documentId));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600 mt-1">Manage onboarding documents and verification</p>
        </div>
        <Link to="/hr-onboarding/documents/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {documents.filter(d => d.status === 'uploaded').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.status === 'verified').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {documents.filter(d => d.status === 'pending' && d.required).length}
            </div>
          </CardContent>
        </Card>
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
                  placeholder="Search documents..."
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
                status: value === 'all' ? undefined : value as DocumentStatus
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="uploaded">Uploaded</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                category: value === 'all' ? undefined : value
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="tax">Tax</SelectItem>
                <SelectItem value="benefits">Benefits</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.required !== undefined ? filters.required.toString() : 'all'}
              onValueChange={(value) => setFilters(prev => ({
                ...prev,
                required: value === 'all' ? undefined : value === 'true'
              }))}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Required" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="true">Required Only</SelectItem>
                <SelectItem value="false">Optional Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Documents ({pagination.total})</CardTitle>
          <CardDescription>
            Overview of all onboarding documents
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
                      checked={selectedDocuments.length === documents.length && documents.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Document</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>File Info</TableHead>
                  <TableHead>Upload Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedDocuments.includes(document.id)}
                        onCheckedChange={(checked) => handleSelectDocument(document.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{document.name}</p>
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {document.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(document.category)}>
                        {document.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {document.required ? (
                        <Badge variant="destructive">Required</Badge>
                      ) : (
                        <Badge variant="secondary">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {document.fileName ? (
                        <div>
                          <p className="text-sm font-medium">{document.fileName}</p>
                          <p className="text-xs text-gray-500">
                            {document.fileSize && formatFileSize(document.fileSize)}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400">No file uploaded</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {document.uploadedDate ? (
                        new Date(document.uploadedDate).toLocaleDateString()
                      ) : (
                        <span className="text-gray-400">Not uploaded</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(document.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(document.status)}
                          {document.status}
                        </span>
                      </Badge>
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
                          {document.fileName && (
                            <>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Document
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download
                              </DropdownMenuItem>
                            </>
                          )}
                          {document.status === 'uploaded' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(document.id, 'verified')}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Verify
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleStatusUpdate(document.id, 'rejected')}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setDocumentToDelete(document.id);
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
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => documentToDelete && handleDeleteDocument(documentToDelete)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagementPage;
