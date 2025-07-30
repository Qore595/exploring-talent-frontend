import { useState, useEffect, useMemo } from 'react';
import { Plus, X, Tag, User, Building, Briefcase, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { SubjectToken, SubjectTemplate } from '@/types/hotlists';

interface SubjectBuilderProps {
  value: string;
  onChange: (value: string) => void;
  onSaveTemplate?: (template: Omit<SubjectTemplate, 'id' | 'usageCount' | 'createdAt' | 'updatedAt'>) => void;
  className?: string;
}

// Mock tokens for development
const mockTokens: SubjectToken[] = [
  // Candidate tokens
  { id: 'candidate_name', label: 'Candidate Name', value: '{{candidate_name}}', category: 'candidate', description: 'Full name of the candidate' },
  { id: 'candidate_first_name', label: 'First Name', value: '{{candidate_first_name}}', category: 'candidate', description: 'Candidate\'s first name' },
  { id: 'candidate_skills', label: 'Skills', value: '{{candidate_skills}}', category: 'candidate', description: 'Candidate\'s key skills' },
  { id: 'candidate_experience', label: 'Experience', value: '{{candidate_experience}}', category: 'candidate', description: 'Years of experience' },
  { id: 'candidate_location', label: 'Location', value: '{{candidate_location}}', category: 'candidate', description: 'Candidate\'s location preference' },
  
  // Company tokens
  { id: 'company_name', label: 'Company Name', value: '{{company_name}}', category: 'company', description: 'Your company name' },
  { id: 'sender_name', label: 'Sender Name', value: '{{sender_name}}', category: 'company', description: 'Name of the person sending the email' },
  { id: 'sender_title', label: 'Sender Title', value: '{{sender_title}}', category: 'company', description: 'Title of the sender' },
  
  // Job tokens
  { id: 'job_title', label: 'Job Title', value: '{{job_title}}', category: 'job', description: 'Position title' },
  { id: 'job_location', label: 'Job Location', value: '{{job_location}}', category: 'job', description: 'Job location' },
  { id: 'job_type', label: 'Job Type', value: '{{job_type}}', category: 'job', description: 'Full-time, Contract, etc.' },
  { id: 'client_name', label: 'Client Name', value: '{{client_name}}', category: 'job', description: 'End client name' },
  
  // Custom tokens
  { id: 'current_date', label: 'Current Date', value: '{{current_date}}', category: 'custom', description: 'Today\'s date' },
  { id: 'urgency', label: 'Urgency', value: '{{urgency}}', category: 'custom', description: 'Urgency level (Urgent, ASAP, etc.)' },
  { id: 'batch_number', label: 'Batch Number', value: '{{batch_number}}', category: 'custom', description: 'Current batch number' }
];

const categoryIcons = {
  candidate: User,
  company: Building,
  job: Briefcase,
  custom: Settings
};

const categoryColors = {
  candidate: 'bg-blue-100 text-blue-800 border-blue-200',
  company: 'bg-green-100 text-green-800 border-green-200',
  job: 'bg-purple-100 text-purple-800 border-purple-200',
  custom: 'bg-orange-100 text-orange-800 border-orange-200'
};

const SubjectBuilder: React.FC<SubjectBuilderProps> = ({
  value,
  onChange,
  onSaveTemplate,
  className = ''
}) => {
  const [tokens] = useState<SubjectToken[]>(mockTokens);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  // Filter tokens based on category and search
  const filteredTokens = useMemo(() => {
    return tokens.filter(token => {
      const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
      const matchesSearch = searchTerm === '' || 
        token.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        token.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [tokens, selectedCategory, searchTerm]);

  // Group tokens by category
  const tokensByCategory = useMemo(() => {
    const grouped = filteredTokens.reduce((acc, token) => {
      if (!acc[token.category]) {
        acc[token.category] = [];
      }
      acc[token.category].push(token);
      return acc;
    }, {} as Record<string, SubjectToken[]>);
    return grouped;
  }, [filteredTokens]);

  // Insert token at cursor position
  const insertToken = (token: SubjectToken) => {
    const newValue = value.slice(0, cursorPosition) + token.value + value.slice(cursorPosition);
    onChange(newValue);
    setCursorPosition(cursorPosition + token.value.length);
  };

  // Handle input change and track cursor position
  const handleInputChange = (newValue: string) => {
    onChange(newValue);
  };

  // Handle cursor position tracking
  const handleInputClick = (event: React.MouseEvent<HTMLTextAreaElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setCursorPosition(target.selectionStart || 0);
  };

  // Save template
  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;

    const template = {
      name: templateName,
      template: value,
      tokens: getUsedTokens(),
      category: templateCategory || 'general',
      isDefault: false
    };

    onSaveTemplate?.(template);
    setShowSaveTemplate(false);
    setTemplateName('');
    setTemplateCategory('');
  };

  // Get tokens used in current template
  const getUsedTokens = (): SubjectToken[] => {
    return tokens.filter(token => value.includes(token.value));
  };

  // Preview the subject with sample data
  const getPreview = (): string => {
    let preview = value;
    const sampleData = {
      '{{candidate_name}}': 'John Doe',
      '{{candidate_first_name}}': 'John',
      '{{candidate_skills}}': 'React, Node.js, TypeScript',
      '{{candidate_experience}}': '5 years',
      '{{candidate_location}}': 'Remote',
      '{{company_name}}': 'TechCorp Solutions',
      '{{sender_name}}': 'Jane Smith',
      '{{sender_title}}': 'Technical Recruiter',
      '{{job_title}}': 'Senior Full Stack Developer',
      '{{job_location}}': 'New York, NY',
      '{{job_type}}': 'Full-time',
      '{{client_name}}': 'Fortune 500 Company',
      '{{current_date}}': new Date().toLocaleDateString(),
      '{{urgency}}': 'Urgent',
      '{{batch_number}}': '1'
    };

    Object.entries(sampleData).forEach(([token, replacement]) => {
      preview = preview.replace(new RegExp(token.replace(/[{}]/g, '\\$&'), 'g'), replacement);
    });

    return preview;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5" />
            <span>Subject Builder</span>
          </CardTitle>
          <CardDescription>
            Build dynamic email subjects using tokens that will be replaced with actual data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Subject Input */}
          <div className="space-y-2">
            <Label htmlFor="subject">Email Subject Template</Label>
            <Textarea
              id="subject"
              value={value}
              onChange={(e) => handleInputChange(e.target.value)}
              onClick={handleInputClick}
              onKeyUp={handleInputClick}
              placeholder="Enter your subject template here..."
              className="min-h-[100px] font-mono"
            />
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Click on tokens below to insert them at cursor position
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSaveTemplate(true)}
                disabled={!value.trim()}
              >
                Save as Template
              </Button>
            </div>
          </div>

          {/* Preview */}
          {value && (
            <div className="space-y-2">
              <Label>Preview</Label>
              <div className="p-3 bg-gray-50 rounded-md border">
                <p className="text-sm font-medium">{getPreview()}</p>
              </div>
            </div>
          )}

          {/* Token Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-xs"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="candidate">Candidate</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="job">Job</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tokens */}
          <div className="space-y-4">
            {Object.entries(tokensByCategory).map(([category, categoryTokens]) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <h4 className="font-medium capitalize">{category}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categoryTokens.map((token) => (
                      <Popover key={token.id}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={`${categoryColors[token.category]} hover:opacity-80`}
                            onClick={() => insertToken(token)}
                          >
                            {token.label}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">{token.label}</h4>
                            <p className="text-sm text-gray-600">{token.description}</p>
                            <div className="p-2 bg-gray-50 rounded font-mono text-sm">
                              {token.value}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Used Tokens */}
          {getUsedTokens().length > 0 && (
            <div className="space-y-2">
              <Label>Tokens Used in Template</Label>
              <div className="flex flex-wrap gap-2">
                {getUsedTokens().map((token) => (
                  <Badge key={token.id} variant="secondary" className="text-xs">
                    {token.label}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Template Modal */}
      {showSaveTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Save Template</CardTitle>
            <CardDescription>
              Save this subject template for future use
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="templateCategory">Category</Label>
              <Input
                id="templateCategory"
                value={templateCategory}
                onChange={(e) => setTemplateCategory(e.target.value)}
                placeholder="Enter category (optional)..."
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button onClick={handleSaveTemplate} disabled={!templateName.trim()}>
                Save Template
              </Button>
              <Button variant="outline" onClick={() => setShowSaveTemplate(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SubjectBuilder;
