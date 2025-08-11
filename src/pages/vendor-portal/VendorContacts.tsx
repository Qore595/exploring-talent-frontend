import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Mail,
  Phone,
  CheckCircle,
  AlertTriangle,
  Clock,
  MoreHorizontal,
  Shield,
  RefreshCw,
  Eye,
  Send
} from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { VendorPortalPoC } from '@/types/vendor-portal';

const VendorContacts: React.FC = () => {
  const { user, vendor, checkPermission } = useVendorAuth();
  const [contacts, setContacts] = useState<VendorPortalPoC[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<VendorPortalPoC[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<VendorPortalPoC | null>(null);

  useEffect(() => {
    // Load contacts
    const loadContacts = async () => {
      try {
        // Mock data - replace with actual API call
        const mockContacts: VendorPortalPoC[] = [
          {
            id: '1',
            name: 'John Smith',
            role: 'Relationship Manager',
            email: 'john.smith@techcorp.com',
            phone: '+1-555-0123',
            status: 'Active',
            isPrimary: true,
            isBackup: false,
            lastValidated: new Date('2024-01-01'),
            validationStatus: 'Validated'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            role: 'Technical Lead',
            email: 'sarah.johnson@techcorp.com',
            phone: '+1-555-0124',
            status: 'Active',
            isPrimary: false,
            isBackup: true,
            lastValidated: new Date('2024-01-05'),
            validationStatus: 'Validated'
          },
          {
            id: '3',
            name: 'Mike Davis',
            role: 'Legal Contact',
            email: 'mike.davis@techcorp.com',
            status: 'Replaced',
            isPrimary: false,
            isBackup: false,
            lastValidated: new Date('2023-08-15'),
            validationStatus: 'Overdue'
          },
          {
            id: '4',
            name: 'Lisa Chen',
            role: 'Account Manager',
            email: 'lisa.chen@techcorp.com',
            phone: '+1-555-0126',
            status: 'Active',
            isPrimary: false,
            isBackup: false,
            lastValidated: new Date('2023-12-20'),
            validationStatus: 'Pending'
          }
        ];

        setContacts(mockContacts);
        setFilteredContacts(mockContacts);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load contacts:', error);
        setIsLoading(false);
      }
    };

    loadContacts();
  }, []);

  // Filter contacts based on search term
  useEffect(() => {
    if (!searchTerm) {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    }
  }, [contacts, searchTerm]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': { variant: 'success', icon: CheckCircle },
      'Inactive': { variant: 'secondary', icon: Clock },
      'Replaced': { variant: 'warning', icon: AlertTriangle }
    };
    
    const config = variants[status] || { variant: 'secondary', icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getValidationStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Validated': { variant: 'success', icon: CheckCircle },
      'Pending': { variant: 'warning', icon: Clock },
      'Overdue': { variant: 'destructive', icon: AlertTriangle },
      'Failed': { variant: 'destructive', icon: AlertTriangle }
    };
    
    const config = variants[status] || { variant: 'secondary', icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleValidateContact = async (contactId: string) => {
    try {
      console.log('Validating contact:', contactId);
      
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update contact validation status
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, validationStatus: 'Validated', lastValidated: new Date() }
          : contact
      ));
      
    } catch (error) {
      console.error('Failed to validate contact:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      console.log('Deleting contact:', contactId);
      
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const canManageContacts = checkPermission('manage_contacts');
  const canEditContact = (contact: VendorPortalPoC) => {
    return canManageContacts || (user?.id === contact.id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Points of Contact</h1>
          <p className="text-muted-foreground">
            Manage your company's contact information and validation status
          </p>
        </div>
        {canManageContacts && (
          <Button asChild>
            <Link to="/vendor-portal/contacts/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Link>
          </Button>
        )}
      </div>

      {/* Validation Alert */}
      {contacts.some(c => c.validationStatus === 'Overdue' || c.validationStatus === 'Pending') && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Some contacts require validation. Please review and update contact information to maintain compliance.
          </AlertDescription>
        </Alert>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Management</CardTitle>
          <CardDescription>
            Search and manage your points of contact
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Contacts Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Validation</TableHead>
                  <TableHead>Last Validated</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-medium">{contact.name}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span>{contact.email}</span>
                        </div>
                        {contact.phone && (
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            <span>{contact.phone}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{contact.role}</TableCell>
                    <TableCell>{getStatusBadge(contact.status)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {contact.isPrimary && <Badge variant="default">Primary</Badge>}
                        {contact.isBackup && <Badge variant="secondary">Backup</Badge>}
                        {!contact.isPrimary && !contact.isBackup && (
                          <Badge variant="outline">Standard</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getValidationStatusBadge(contact.validationStatus)}</TableCell>
                    <TableCell>
                      {contact.lastValidated ? (
                        <span className="text-sm">
                          {contact.lastValidated.toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedContact(contact)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {canEditContact(contact) && (
                            <>
                              <DropdownMenuItem asChild>
                                <Link to={`/vendor-portal/contacts/${contact.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Contact
                                </Link>
                              </DropdownMenuItem>
                              {contact.validationStatus !== 'Validated' && (
                                <DropdownMenuItem onClick={() => handleValidateContact(contact.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Validate
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <Send className="mr-2 h-4 w-4" />
                                Send Validation Link
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {canManageContacts && !contact.isPrimary && (
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteContact(contact.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-sm mb-4">
                {searchTerm ? 'Try adjusting your search terms.' : 'No contacts have been added yet.'}
              </p>
              {canManageContacts && !searchTerm && (
                <Button asChild>
                  <Link to="/vendor-portal/contacts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Contact
                  </Link>
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Details Dialog */}
      <Dialog open={!!selectedContact} onOpenChange={() => setSelectedContact(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedContact?.name}</DialogTitle>
            <DialogDescription>
              Contact details and validation information
            </DialogDescription>
          </DialogHeader>
          {selectedContact && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span>{selectedContact.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span>{selectedContact.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedContact.email}</span>
                    </div>
                    {selectedContact.phone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span>{selectedContact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Status & Validation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      {getStatusBadge(selectedContact.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <div className="flex space-x-1">
                        {selectedContact.isPrimary && <Badge variant="default">Primary</Badge>}
                        {selectedContact.isBackup && <Badge variant="secondary">Backup</Badge>}
                        {!selectedContact.isPrimary && !selectedContact.isBackup && (
                          <Badge variant="outline">Standard</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Validation:</span>
                      {getValidationStatusBadge(selectedContact.validationStatus)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Validated:</span>
                      <span>
                        {selectedContact.lastValidated 
                          ? selectedContact.lastValidated.toLocaleDateString()
                          : 'Never'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setSelectedContact(null)}>
                  Close
                </Button>
                {canEditContact(selectedContact) && (
                  <Button asChild>
                    <Link to={`/vendor-portal/contacts/${selectedContact.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Contact
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VendorContacts;
