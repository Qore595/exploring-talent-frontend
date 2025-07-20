import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  Download,
  File,
  FileText,
  Tag,
  FolderOpen
} from 'lucide-react';
import { ManualDocument, DocumentGroup } from '@/types/documentation';
import { documentationService } from '@/services/documentationService';

const ManualDocumentDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [document, setDocument] = useState<ManualDocument | null>(null);
  const [groups, setGroups] = useState<DocumentGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/manual-documents');
      return;
    }

    fetchDocumentDetails();
  }, [id]);

  const fetchDocumentDetails = async () => {
    try {
      setLoading(true);
      const documentResponse = await documentationService.getManualDocumentById(id!);
      setDocument(documentResponse.data);

      // Fetch groups that contain this document
      const groupsResponse = await documentationService.getDocumentGroups({}, { page: 1, limit: 100 });
      const documentGroups = groupsResponse.data.filter(group => 
        documentResponse.data.groupIds.includes(group.id)
      );
      setGroups(documentGroups);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch document details',
        variant: 'destructive',
      });
      navigate('/manual-documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!document || !confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentationService.deleteManualDocument(document.id);
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
      navigate('/manual-documents');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = async () => {
    if (!document) return;

    try {
      const blob = await documentationService.downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download document',
        variant: 'destructive',
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <File className="h-5 w-5 text-red-500" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FileText className="h-5 w-5 text-blue-500" />;
    if (fileType.includes('text')) return <FileText className="h-5 w-5 text-gray-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!document) {
    return null;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/manual-documents')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Documents
          </Button>
          <div className="flex items-center gap-3">
            {getFileIcon(document.fileType)}
            <div>
              <h1 className="text-3xl font-bold">{document.name}</h1>
              <p className="text-muted-foreground mt-1">{document.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/manual-documents/${document.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Preview/Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Document Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">File Name</h4>
                  <p className="text-sm text-muted-foreground">{document.fileName}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">File Size</h4>
                  <p className="text-sm text-muted-foreground">{formatFileSize(document.fileSize)}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">File Type</h4>
                  <p className="text-sm text-muted-foreground">{document.fileType}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Status</h4>
                  <Badge variant={document.isActive ? "default" : "secondary"}>
                    {document.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              {document.category && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Category</h4>
                  <Badge variant="secondary">{document.category}</Badge>
                </div>
              )}

              {document.tags && document.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {groups.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Document Groups</h4>
                  <div className="space-y-2">
                    {groups.map((group) => (
                      <div 
                        key={group.id} 
                        className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/document-groups/${group.id}`)}
                      >
                        <FolderOpen className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{group.name}</p>
                          <p className="text-xs text-muted-foreground">{group.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Uploaded by</p>
                  <p className="text-muted-foreground">{document.uploadedBy}</p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Upload Date</p>
                  <p className="text-muted-foreground">
                    {new Date(document.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Modified</p>
                  <p className="text-muted-foreground">
                    {new Date(document.lastModifiedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Modified by</p>
                  <p className="text-muted-foreground">{document.lastModifiedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Document
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate(`/manual-documents/${document.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Document
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualDocumentDetailsPage;
