import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Filter, Search, MoreVertical, User, Calendar, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

// Mock pipeline data
const mockPipelineData = {
  available: [
    {
      id: '1',
      name: 'John Doe',
      skills: ['React', 'Node.js', 'TypeScript'],
      rate: '$85/hr',
      availability: '2024-02-15',
      experience: '5+ years',
      location: 'Remote'
    },
    {
      id: '6',
      name: 'Emily Rodriguez',
      skills: ['Selenium', 'Cypress', 'Jest'],
      rate: '$70/hr',
      availability: '2024-02-18',
      experience: '3+ years',
      location: 'Remote'
    }
  ],
  in_hotlist: [
    {
      id: '2',
      name: 'Jane Smith',
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      rate: '$90/hr',
      availability: '2024-02-20',
      experience: '4+ years',
      location: 'Hybrid'
    }
  ],
  submitted: [
    {
      id: '3',
      name: 'Mike Johnson',
      skills: ['AWS', 'Kubernetes', 'Docker'],
      rate: '$95/hr',
      availability: '2024-02-10',
      experience: '6+ years',
      location: 'Onsite'
    }
  ],
  interviewing: [
    {
      id: '4',
      name: 'Sarah Wilson',
      skills: ['Figma', 'Adobe XD', 'Sketch'],
      rate: '$75/hr',
      availability: '2024-02-25',
      experience: '4+ years',
      location: 'Flexible'
    }
  ],
  offered: [
    {
      id: '5',
      name: 'David Chen',
      skills: ['Java', 'Spring Boot', 'PostgreSQL'],
      rate: '$80/hr',
      availability: '2024-03-01',
      experience: '5+ years',
      location: 'Hybrid'
    }
  ],
  deployed: []
};

const StatusPipelinePage = () => {
  const navigate = useNavigate();
  const [pipelineData, setPipelineData] = useState(mockPipelineData);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedItem, setDraggedItem] = useState<any>(null);

  const handleBack = () => {
    navigate('/bench-resources');
  };

  const statusColumns = [
    { key: 'available', title: 'Available', color: 'bg-blue-100 border-blue-200', count: pipelineData.available.length },
    { key: 'in_hotlist', title: 'In Hotlist', color: 'bg-yellow-100 border-yellow-200', count: pipelineData.in_hotlist.length },
    { key: 'submitted', title: 'Submitted', color: 'bg-purple-100 border-purple-200', count: pipelineData.submitted.length },
    { key: 'interviewing', title: 'Interviewing', color: 'bg-orange-100 border-orange-200', count: pipelineData.interviewing.length },
    { key: 'offered', title: 'Offered', color: 'bg-green-100 border-green-200', count: pipelineData.offered.length },
    { key: 'deployed', title: 'Deployed', color: 'bg-gray-100 border-gray-200', count: pipelineData.deployed.length }
  ];

  const handleDragStart = (e: React.DragEvent, item: any, fromStatus: string) => {
    setDraggedItem({ ...item, fromStatus });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toStatus: string) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.fromStatus === toStatus) {
      setDraggedItem(null);
      return;
    }

    // Remove item from source status
    const newPipelineData = { ...pipelineData };
    newPipelineData[draggedItem.fromStatus as keyof typeof pipelineData] = 
      newPipelineData[draggedItem.fromStatus as keyof typeof pipelineData].filter(
        (item: any) => item.id !== draggedItem.id
      );

    // Add item to target status
    const { fromStatus, ...itemWithoutFromStatus } = draggedItem;
    newPipelineData[toStatus as keyof typeof pipelineData].push(itemWithoutFromStatus);

    setPipelineData(newPipelineData);
    setDraggedItem(null);

    toast({
      title: "Status Updated",
      description: `${draggedItem.name} moved to ${toStatus.replace('_', ' ')}`,
    });
  };

  const handleAddResource = () => {
    toast({
      title: "Add Resource",
      description: "Add resource functionality would open here.",
    });
  };

  const handleResourceAction = (action: string, resourceId: string) => {
    toast({
      title: `${action} Resource`,
      description: `${action} functionality for resource ${resourceId} would execute here.`,
    });
  };

  const filteredData = Object.keys(pipelineData).reduce((acc, status) => {
    acc[status] = pipelineData[status as keyof typeof pipelineData].filter((item: any) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.skills.some((skill: string) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    return acc;
  }, {} as any);

  const ResourceCard = ({ resource, status }: { resource: any; status: string }) => (
    <Card
      className="mb-3 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => handleDragStart(e, resource, status)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="font-medium">{resource.name}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleResourceAction('View', resource.id)}>
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleResourceAction('Edit', resource.id)}>
                Edit Resource
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleResourceAction('Contact', resource.id)}>
                Contact Resource
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {resource.skills.slice(0, 3).map((skill: string) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {resource.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{resource.skills.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
              <span>{resource.rate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(resource.availability).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            {resource.experience} • {resource.location}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-white">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Bench Resources
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Status Pipeline</h1>
            <p className="text-gray-600">Drag and drop resources to update their status</p>
          </div>
        </div>
        <Button onClick={handleAddResource}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-full mx-auto space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search resources by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statusColumns.map((column) => (
          <div
            key={column.key}
            className={`${column.color} rounded-lg p-4 min-h-[600px]`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.key)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">{column.title}</h3>
              <Badge variant="outline" className="bg-white">
                {column.count}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {filteredData[column.key]?.map((resource: any) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  status={column.key}
                />
              ))}
              
              {filteredData[column.key]?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-sm">No resources</div>
                  <div className="text-xs">Drag resources here</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pipeline Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Resources:</span>
                <span className="font-medium">
                  {Object.values(pipelineData).reduce((acc, arr) => acc + arr.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Available:</span>
                <span className="font-medium">{pipelineData.available.length}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span className="font-medium">
                  {pipelineData.in_hotlist.length + pipelineData.submitted.length + pipelineData.interviewing.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Deployed:</span>
                <span className="font-medium">{pipelineData.deployed.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Hotlist → Submitted:</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="flex justify-between">
                <span>Submitted → Interview:</span>
                <span className="font-medium">60%</span>
              </div>
              <div className="flex justify-between">
                <span>Interview → Offer:</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex justify-between">
                <span>Offer → Deployed:</span>
                <span className="font-medium">80%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Average Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Available → Hotlist:</span>
                <span className="font-medium">2.5 days</span>
              </div>
              <div className="flex justify-between">
                <span>Hotlist → Submitted:</span>
                <span className="font-medium">1.2 days</span>
              </div>
              <div className="flex justify-between">
                <span>Submitted → Interview:</span>
                <span className="font-medium">3.8 days</span>
              </div>
              <div className="flex justify-between">
                <span>Interview → Deployed:</span>
                <span className="font-medium">7.2 days</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPipelinePage;
