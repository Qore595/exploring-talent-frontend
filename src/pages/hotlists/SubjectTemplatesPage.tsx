import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Copy, Star, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import SubjectBuilder from '@/components/hotlists/SubjectBuilder';

// Mock template data
const mockTemplates = [
  {
    id: '1',
    name: 'Urgent Opportunity',
    template: 'Urgent: {{job_title}} opportunity at {{company_name}} - {{urgency}}',
    category: 'Urgent',
    isDefault: true,
    usageCount: 45,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    tokens: [
      { id: 'job_title', label: 'Job Title', value: '{{job_title}}', category: 'job' },
      { id: 'company_name', label: 'Company Name', value: '{{company_name}}', category: 'company' },
      { id: 'urgency', label: 'Urgency', value: '{{urgency}}', category: 'custom' }
    ]
  },
  {
    id: '2',
    name: 'Personalized Greeting',
    template: 'Hi {{candidate_name}}, perfect {{job_title}} role for you at {{company_name}}',
    category: 'Personal',
    isDefault: false,
    usageCount: 32,
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:15:00Z',
    tokens: [
      { id: 'candidate_name', label: 'Candidate Name', value: '{{candidate_name}}', category: 'candidate' },
      { id: 'job_title', label: 'Job Title', value: '{{job_title}}', category: 'job' },
      { id: 'company_name', label: 'Company Name', value: '{{company_name}}', category: 'company' }
    ]
  },
  {
    id: '3',
    name: 'Skills Match',
    template: '{{candidate_name}}, your {{candidate_skills}} skills are perfect for this {{job_title}} role',
    category: 'Skills',
    isDefault: false,
    usageCount: 28,
    createdAt: '2024-01-08T16:00:00Z',
    updatedAt: '2024-01-22T13:45:00Z',
    tokens: [
      { id: 'candidate_name', label: 'Candidate Name', value: '{{candidate_name}}', category: 'candidate' },
      { id: 'candidate_skills', label: 'Candidate Skills', value: '{{candidate_skills}}', category: 'candidate' },
      { id: 'job_title', label: 'Job Title', value: '{{job_title}}', category: 'job' }
    ]
  },
  {
    id: '4',
    name: 'Location Based',
    template: 'Remote {{job_title}} opportunity - {{company_name}} is hiring!',
    category: 'Location',
    isDefault: false,
    usageCount: 19,
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-01-19T10:20:00Z',
    tokens: [
      { id: 'job_title', label: 'Job Title', value: '{{job_title}}', category: 'job' },
      { id: 'company_name', label: 'Company Name', value: '{{company_name}}', category: 'company' }
    ]
  }
];

const SubjectTemplatesPage = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState(mockTemplates);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const [newTemplate, setNewTemplate] = useState('');

  const handleBack = () => {
    navigate('/hotlists');
  };

  const handleSaveTemplate = (templateData: any) => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...templateData, updatedAt: new Date().toISOString() }
          : t
      ));
      toast({
        title: "Template Updated",
        description: `Template "${templateData.name}" has been updated successfully.`,
      });
      setEditingTemplate(null);
    } else {
      // Create new template
      const newTemplateObj = {
        id: Date.now().toString(),
        ...templateData,
        usageCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setTemplates(prev => [newTemplateObj, ...prev]);
      toast({
        title: "Template Created",
        description: `Template "${templateData.name}" has been created successfully.`,
      });
    }
    setIsCreateDialogOpen(false);
    setNewTemplate('');
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "Template has been deleted successfully.",
    });
  };

  const handleCopyTemplate = (template: any) => {
    navigator.clipboard.writeText(template.template);
    toast({
      title: "Template Copied",
      description: "Template has been copied to clipboard.",
    });
  };

  const handleToggleDefault = (templateId: string) => {
    setTemplates(prev => prev.map(t => ({
      ...t,
      isDefault: t.id === templateId ? !t.isDefault : t.isDefault
    })));
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.template.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Hotlists
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Subject Templates</h1>
            <p className="text-gray-600">Manage and create reusable email subject templates</p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Edit Template' : 'Create New Template'}
              </DialogTitle>
              <DialogDescription>
                Use the subject builder to create a new email subject template with dynamic tokens.
              </DialogDescription>
            </DialogHeader>
            <SubjectBuilder
              value={newTemplate}
              onChange={setNewTemplate}
              onSaveTemplate={handleSaveTemplate}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="max-w-full mx-auto space-y-6">
          {/* Filters */}
          <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <span>{template.name}</span>
                    {template.isDefault && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="secondary">{template.category}</Badge>
                    <Badge variant="outline">{template.usageCount} uses</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyTemplate(template)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingTemplate(template);
                      setNewTemplate(template.template);
                      setIsCreateDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Template:</h4>
                  <div className="p-3 bg-gray-50 rounded-md text-sm font-mono">
                    {template.template}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Preview:</h4>
                  <div className="p-3 bg-blue-50 rounded-md text-sm">
                    {template.template
                      .replace(/\{\{candidate_name\}\}/g, 'John Doe')
                      .replace(/\{\{job_title\}\}/g, 'Senior Full Stack Developer')
                      .replace(/\{\{company_name\}\}/g, 'TechCorp Inc.')
                      .replace(/\{\{urgency\}\}/g, 'ASAP')
                      .replace(/\{\{candidate_skills\}\}/g, 'React, Node.js')
                    }
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Tokens Used:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.tokens.map((token) => (
                      <Badge key={token.id} variant="outline" className="text-xs">
                        {token.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-gray-500">
                    Updated {new Date(template.updatedAt).toLocaleDateString()}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleDefault(template.id)}
                  >
                    <Star className={`h-4 w-4 ${template.isDefault ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No templates found</div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Template
          </Button>
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectTemplatesPage;
