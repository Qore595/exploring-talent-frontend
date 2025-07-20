import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  FolderOpen,
  Calendar,
  User,
  FileText,
  Files,
  Mail
} from 'lucide-react';
import { DocumentGroup, DocumentGroupFilters } from '@/types/documentation';
import { documentationService } from '@/services/documentationService';
import EmailGroupDialog from '@/components/documentation/EmailGroupDialog';

const DocumentGroupsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<DocumentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<DocumentGroupFilters>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [selectedGroupForEmail, setSelectedGroupForEmail] = useState<DocumentGroup | null>(null);

  useEffect(() => {
    fetchGroups();
  }, [filters, searchTerm]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await documentationService.getDocumentGroups(
        { ...filters, search: searchTerm },
        { page: 1, limit: 50 }
      );
      setGroups(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch document groups',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (id: string) => {
    if (!confirm('Are you sure you want to delete this group?')) return;

    try {
      await documentationService.deleteDocumentGroup(id);
      toast({
        title: 'Success',
        description: 'Group deleted successfully',
      });
      fetchGroups();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete group',
        variant: 'destructive',
      });
    }
  };

  const handleSendEmail = (group: DocumentGroup) => {
    setSelectedGroupForEmail(group);
    setEmailDialogOpen(true);
  };

  const filteredGroups = groups.filter(group => {
    if (selectedCategory !== 'all' && group.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const categories = ['all', ...Array.from(new Set(groups.map(g => g.category).filter(Boolean)))];

  const getGroupColor = (color?: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-800 border-blue-200',
      green: 'bg-green-100 text-green-800 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      red: 'bg-red-100 text-red-800 border-red-200',
      purple: 'bg-purple-100 text-purple-800 border-purple-200',
      orange: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[color || 'blue'] || colors.blue;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Document Groups</h1>
          <p className="text-muted-foreground mt-2">
            Organize and manage collections of related documents and templates
          </p>
        </div>
        <Button onClick={() => navigate('/document-groups/create')}>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="bg-muted/50">
          {categories.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="data-[state=active]:bg-background"
            >
              {category === 'all' ? 'All Groups' : category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredGroups.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No groups found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm ? 'No groups match your search criteria.' : 'Get started by creating your first document group.'}
                  </p>
                  <Button onClick={() => navigate('/document-groups/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className={`w-3 h-3 rounded-full ${getGroupColor(group.color)}`}
                          />
                          <CardTitle className="text-lg">{group.name}</CardTitle>
                        </div>
                        <CardDescription>
                          {group.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendEmail(group)}
                          title="Send Email"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/document-groups/${group.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/document-groups/${group.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteGroup(group.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Badge variant="secondary">{group.category}</Badge>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <FileText className="h-4 w-4 mr-1" />
                          {group.templateIds.length} templates
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Files className="h-4 w-4 mr-1" />
                          {group.documentIds.length} documents
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {group.createdBy}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(group.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Email Dialog */}
      {selectedGroupForEmail && (
        <EmailGroupDialog
          open={emailDialogOpen}
          onOpenChange={setEmailDialogOpen}
          groupId={selectedGroupForEmail.id}
          groupName={selectedGroupForEmail.name}
        />
      )}
    </div>
  );
};

export default DocumentGroupsPage;
