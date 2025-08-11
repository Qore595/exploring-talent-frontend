import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Eye, Upload, Download } from 'lucide-react';
import { VendorAssignment } from '@/types/vendor-portal';

const VendorAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<VendorAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock assignments
    const mockAssignments: VendorAssignment[] = [
      {
        id: '1',
        clientName: 'TechCorp Inc',
        positionTitle: 'Senior Software Developer',
        status: 'Open',
        startDate: new Date('2024-02-01'),
        candidates: [],
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        sowDocument: 'sow_techcorp_dev.pdf',
        agreementDocument: 'agreement_techcorp.pdf'
      },
      {
        id: '2',
        clientName: 'DataFlow Systems',
        positionTitle: 'DevOps Engineer',
        status: 'In Progress',
        startDate: new Date('2024-01-15'),
        candidates: [
          {
            id: '1',
            assignmentId: '2',
            name: 'John Doe',
            email: 'john.doe@email.com',
            status: 'Interviewing',
            submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '3',
        clientName: 'SecureNet Corp',
        positionTitle: 'Security Analyst',
        status: 'Filled',
        startDate: new Date('2023-12-01'),
        endDate: new Date('2024-01-31'),
        candidates: [
          {
            id: '2',
            assignmentId: '3',
            name: 'Jane Smith',
            email: 'jane.smith@email.com',
            status: 'Selected',
            submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            lastUpdated: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
          }
        ],
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
      }
    ];

    setAssignments(mockAssignments);
    setIsLoading(false);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Open': 'default',
      'In Progress': 'warning',
      'Filled': 'success',
      'Cancelled': 'secondary',
      'Completed': 'success'
    };
    return variants[status] || 'secondary';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
        <p className="text-muted-foreground">
          View and manage your assignment opportunities
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Assignment Management
          </CardTitle>
          <CardDescription>
            Current and historical assignment opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Position</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell className="font-medium">{assignment.positionTitle}</TableCell>
                  <TableCell>{assignment.clientName}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(assignment.status)}>
                      {assignment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{assignment.startDate.toLocaleDateString()}</TableCell>
                  <TableCell>{assignment.candidates.length}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {assignment.status === 'Open' && (
                        <Button size="sm">
                          <Upload className="h-3 w-3 mr-1" />
                          Submit
                        </Button>
                      )}
                      {assignment.sowDocument && (
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          SOW
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorAssignments;
