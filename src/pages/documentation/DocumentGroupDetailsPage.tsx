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
  FileText,
  Files,
  Eye,
  Download,
  Mail
} from 'lucide-react';
import { DocumentGroup, DocumentTemplate, ManualDocument } from '@/types/documentation';
import { documentationService } from '@/services/documentationService';
import EmailGroupDialog from '@/components/documentation/EmailGroupDialog';

const DocumentGroupDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [group, setGroup] = useState<DocumentGroup | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [documents, setDocuments] = useState<ManualDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate('/document-groups');
      return;
    }

    fetchGroupDetails();
  }, [id]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      const groupResponse = await documentationService.getDocumentGroupById(id!);
      setGroup(groupResponse.data);

      // Fetch templates and documents in the group
      const [templatesResponse, documentsResponse] = await Promise.all([
        documentationService.getDocumentTemplates({}, { page: 1, limit: 100 }),
        documentationService.getManualDocuments({}, { page: 1, limit: 100 })
      ]);

      // Filter to only include items in this group
      const groupTemplates = templatesResponse.data.filter(template => 
        groupResponse.data.templateIds.includes(template.id)
      );
      const groupDocuments = documentsResponse.data.filter(document => 
        groupResponse.data.documentIds.includes(document.id)
      );

      setTemplates(groupTemplates);
      setDocuments(groupDocuments);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch group details',
        variant: 'destructive',
      });
      navigate('/document-groups');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!group || !confirm('Are you sure you want to delete this group?')) return;

    try {
      await documentationService.deleteDocumentGroup(group.id);
      toast({
        title: 'Success',
        description: 'Group deleted successfully',
      });
      navigate('/document-groups');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete group',
        variant: 'destructive',
      });
    }
  };

  const getGroupColor = (color?: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
    };
    return colors[color || 'blue'] || colors.blue;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!group) {
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
            onClick={() => navigate('/document-groups')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Groups
          </Button>
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${getGroupColor(group.color)}`} />
            <div>
              <h1 className="text-3xl font-bold">{group.name}</h1>
              <p className="text-muted-foreground mt-1">{group.description}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailDialogOpen(true)}
          >
            <Mail className="h-4 w-4 mr-2" />
            Send Email
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/document-groups/${group.id}/edit`)}
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
        {/* Group Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Document Templates ({templates.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {templates.length === 0 ? (
                <p className="text-muted-foreground">No templates in this group</p>
              ) : (
                <div className="space-y-3">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/document-templates/${template.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Files className="h-5 w-5" />
                Manual Documents ({documents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-muted-foreground">No documents in this group</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((document) => (
                    <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{document.name}</h4>
                        <p className="text-sm text-muted-foreground">{document.description}</p>
                        <p className="text-xs text-muted-foreground">{document.fileName}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/manual-documents/${document.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Group Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Group Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Category</h4>
                <Badge variant="secondary">{group.category}</Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <Badge variant={group.isActive ? "default" : "secondary"}>
                  {group.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Content Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Templates:</span>
                    <span>{templates.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documents:</span>
                    <span>{documents.length}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Items:</span>
                    <span>{templates.length + documents.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created by</p>
                  <p className="text-muted-foreground">{group.createdBy}</p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Created</p>
                  <p className="text-muted-foreground">
                    {new Date(group.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Modified</p>
                  <p className="text-muted-foreground">
                    {new Date(group.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Last Modified by</p>
                  <p className="text-muted-foreground">{group.lastModifiedBy}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Email Dialog */}
      <EmailGroupDialog
        open={emailDialogOpen}
        onOpenChange={setEmailDialogOpen}
        groupId={group.id}
        groupName={group.name}
      />
    </div>
  );
};

export default DocumentGroupDetailsPage;
