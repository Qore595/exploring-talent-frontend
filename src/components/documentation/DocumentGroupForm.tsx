import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Save, ArrowLeft, Plus, X } from 'lucide-react';
import { 
  DocumentGroup, 
  DocumentTemplate,
  ManualDocument,
  CreateDocumentGroupRequest, 
  UpdateDocumentGroupRequest 
} from '@/types/documentation';
import { documentationService } from '@/services/documentationService';

interface DocumentGroupFormProps {
  group?: DocumentGroup;
  mode: 'create' | 'edit';
}

const DocumentGroupForm: React.FC<DocumentGroupFormProps> = ({ group, mode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [availableTemplates, setAvailableTemplates] = useState<DocumentTemplate[]>([]);
  const [availableDocuments, setAvailableDocuments] = useState<ManualDocument[]>([]);
  const [formData, setFormData] = useState({
    name: group?.name || '',
    description: group?.description || '',
    category: group?.category || '',
    color: group?.color || 'blue',
    templateIds: group?.templateIds || [],
    documentIds: group?.documentIds || []
  });

  const categories = [
    'HR Documents',
    'Legal Documents',
    'Marketing Materials',
    'Technical Documentation',
    'Training Materials',
    'Policies & Procedures',
    'Project Documents',
    'Other'
  ];

  const colors = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-500' },
    { value: 'green', label: 'Green', class: 'bg-green-500' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-500' },
    { value: 'red', label: 'Red', class: 'bg-red-500' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-500' },
  ];

  useEffect(() => {
    fetchAvailableItems();
  }, []);

  const fetchAvailableItems = async () => {
    try {
      const [templatesResponse, documentsResponse] = await Promise.all([
        documentationService.getDocumentTemplates({}, { page: 1, limit: 100 }),
        documentationService.getManualDocuments({}, { page: 1, limit: 100 })
      ]);
      
      setAvailableTemplates(templatesResponse.data);
      setAvailableDocuments(documentsResponse.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch available items',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateToggle = (templateId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      templateIds: checked 
        ? [...prev.templateIds, templateId]
        : prev.templateIds.filter(id => id !== templateId)
    }));
  };

  const handleDocumentToggle = (documentId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      documentIds: checked 
        ? [...prev.documentIds, documentId]
        : prev.documentIds.filter(id => id !== documentId)
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Group name is required',
        variant: 'destructive',
      });
      return false;
    }
    if (!formData.description.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Group description is required',
        variant: 'destructive',
      });
      return false;
    }
    if (!formData.category.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Group category is required',
        variant: 'destructive',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      if (mode === 'create') {
        const createData: CreateDocumentGroupRequest = {
          name: formData.name,
          description: formData.description,
          category: formData.category,
          color: formData.color,
          templateIds: formData.templateIds.length > 0 ? formData.templateIds : undefined,
          documentIds: formData.documentIds.length > 0 ? formData.documentIds : undefined
        };
        
        await documentationService.createDocumentGroup(createData);
        toast({
          title: 'Success',
          description: 'Group created successfully',
        });
      } else {
        const updateData: UpdateDocumentGroupRequest = {
          id: group!.id,
          name: formData.name,
          description: formData.description,
          category: formData.category,
          color: formData.color,
          templateIds: formData.templateIds.length > 0 ? formData.templateIds : undefined,
          documentIds: formData.documentIds.length > 0 ? formData.documentIds : undefined
        };
        
        await documentationService.updateDocumentGroup(updateData);
        toast({
          title: 'Success',
          description: 'Group updated successfully',
        });
      }
      
      navigate('/document-groups');
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${mode} group`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/document-groups')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Groups
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Create Group' : 'Edit Group'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'create' 
              ? 'Create a new document group to organize related content' 
              : 'Update the group information and content'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide the basic details for your document group
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter group name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this group contains"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Group Color</Label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`
                      w-8 h-8 rounded-full ${color.class} border-2 transition-all
                      ${formData.color === color.value ? 'border-primary scale-110' : 'border-gray-300'}
                    `}
                    onClick={() => handleInputChange('color', color.value)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Templates Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Document Templates</CardTitle>
            <CardDescription>
              Select templates to include in this group
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableTemplates.length === 0 ? (
              <p className="text-muted-foreground">No templates available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {availableTemplates.map((template) => (
                  <div key={template.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`template-${template.id}`}
                      checked={formData.templateIds.includes(template.id)}
                      onCheckedChange={(checked) => 
                        handleTemplateToggle(template.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`template-${template.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {template.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Documents Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Manual Documents</CardTitle>
            <CardDescription>
              Select documents to include in this group
            </CardDescription>
          </CardHeader>
          <CardContent>
            {availableDocuments.length === 0 ? (
              <p className="text-muted-foreground">No documents available</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto">
                {availableDocuments.map((document) => (
                  <div key={document.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`document-${document.id}`}
                      checked={formData.documentIds.includes(document.id)}
                      onCheckedChange={(checked) => 
                        handleDocumentToggle(document.id, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`document-${document.id}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {document.name}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/document-groups')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : mode === 'create' ? 'Create Group' : 'Update Group'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DocumentGroupForm;
