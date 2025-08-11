import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Building,
  Calendar,
  Shield,
  FileText,
  Upload,
  Download,
  Eye,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  Clock,
  History
} from 'lucide-react';
import { useVendorAuth } from '@/context/VendorAuthContext';
import { VendorPortalInfo, ComplianceDocument, VendorProfileUpdateRequest } from '@/types/vendor-portal';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  vendorNotes: z.string().optional()
});

type ProfileFormData = z.infer<typeof profileSchema>;

const VendorProfile: React.FC = () => {
  const { vendor, user } = useVendorAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [complianceDocuments, setComplianceDocuments] = useState<ComplianceDocument[]>([]);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      vendorNotes: ''
    }
  });

  // Update form values when vendor data is loaded
  useEffect(() => {
    if (vendor) {
      form.reset({
        displayName: vendor.displayName || '',
        vendorNotes: vendor.vendorNotes || ''
      });
    }
  }, [vendor, form]);

  useEffect(() => {
    // Load compliance documents
    const loadComplianceDocuments = async () => {
      try {
        // Mock data - replace with actual API call
        const mockDocuments: ComplianceDocument[] = [
          {
            id: '1',
            type: 'Certificate of Insurance',
            name: 'General Liability Insurance',
            fileName: 'insurance_cert_2024.pdf',
            fileSize: 2048576,
            uploadDate: new Date('2024-01-15'),
            expiryDate: new Date('2024-12-31'),
            status: 'Valid',
            version: 2,
            uploadedBy: 'John Smith'
          },
          {
            id: '2',
            type: 'W9 Form',
            name: 'Tax Information Form',
            fileName: 'w9_form_2024.pdf',
            fileSize: 1024768,
            uploadDate: new Date('2024-01-10'),
            status: 'Valid',
            version: 1,
            uploadedBy: 'John Smith'
          },
          {
            id: '3',
            type: 'NDA',
            name: 'Non-Disclosure Agreement',
            fileName: 'nda_signed.pdf',
            fileSize: 512384,
            uploadDate: new Date('2023-12-01'),
            expiryDate: new Date('2025-12-01'),
            status: 'Valid',
            version: 1,
            uploadedBy: 'John Smith'
          },
          {
            id: '4',
            type: 'Business License',
            name: 'State Business License',
            fileName: 'business_license.pdf',
            fileSize: 768192,
            uploadDate: new Date('2023-11-15'),
            expiryDate: new Date('2024-11-15'),
            status: 'Expiring Soon',
            version: 1,
            uploadedBy: 'John Smith'
          }
        ];

        setComplianceDocuments(mockDocuments);
      } catch (error) {
        console.error('Failed to load compliance documents:', error);
      }
    };

    loadComplianceDocuments();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSaving(true);
      
      // Mock API call - replace with actual implementation
      const updateRequest: VendorProfileUpdateRequest = {
        displayName: data.displayName,
        vendorNotes: data.vendorNotes
      };

      console.log('Updating vendor profile:', updateRequest);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      // In real implementation, update the vendor context
      
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (file: File, documentType: string) => {
    try {
      setUploadingFile(documentType);
      
      // Mock file upload - replace with actual implementation
      console.log('Uploading file:', file.name, 'Type:', documentType);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new document to list
      const newDocument: ComplianceDocument = {
        id: Date.now().toString(),
        type: documentType as any,
        name: file.name.split('.')[0],
        fileName: file.name,
        fileSize: file.size,
        uploadDate: new Date(),
        status: 'Under Review',
        version: 1,
        uploadedBy: user?.firstName + ' ' + user?.lastName || 'Unknown'
      };

      setComplianceDocuments(prev => [...prev, newDocument]);
      
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploadingFile(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Valid': { variant: 'success', icon: CheckCircle },
      'Expired': { variant: 'destructive', icon: AlertTriangle },
      'Expiring Soon': { variant: 'warning', icon: Clock },
      'Under Review': { variant: 'secondary', icon: Clock }
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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!vendor) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to load vendor information. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vendor Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information and compliance documents
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={form.handleSubmit(onSubmit)} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <Building className="h-4 w-4 mr-2" />
            Profile Information
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Shield className="h-4 w-4 mr-2" />
            Compliance Documents
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Change History
          </TabsTrigger>
        </TabsList>

        {/* Profile Information Tab */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Company details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...form}>
                  <div className="space-y-4">
                    {/* Read-only fields */}
                    <div className="space-y-2">
                      <Label>Vendor Type</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{vendor.vendorType}</Badge>
                        <span className="text-sm text-muted-foreground">(Read-only)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Legal Name</Label>
                      <Input value={vendor.legalName} disabled />
                      <p className="text-xs text-muted-foreground">
                        Contact your account manager to change legal name
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Status</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant={vendor.status === 'Active' ? 'success' : 'secondary'}>
                          {vendor.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">(Read-only)</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Onboard Date</Label>
                      <Input value={vendor.onboardDate.toLocaleDateString()} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label>Tier Level</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{vendor.tierLevel}</Badge>
                        <span className="text-sm text-muted-foreground">(Read-only)</span>
                      </div>
                    </div>

                    {/* Editable fields */}
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display Name</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={!isEditing} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vendorNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Vendor Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              disabled={!isEditing}
                              placeholder="Add notes about your company..."
                              rows={3}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Form>
              </CardContent>
            </Card>

            {/* Compliance Status */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Status</CardTitle>
                <CardDescription>
                  Current compliance standing and requirements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Status:</span>
                  <Badge variant={vendor.complianceStatus.overall === 'Compliant' ? 'success' : 'destructive'}>
                    {vendor.complianceStatus.overall}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <span className="text-sm font-medium">Documents:</span>
                  <div className="text-sm text-muted-foreground">
                    {complianceDocuments.filter(doc => doc.status === 'Valid').length} valid, {' '}
                    {complianceDocuments.filter(doc => doc.status === 'Expiring Soon').length} expiring soon, {' '}
                    {complianceDocuments.filter(doc => doc.status === 'Expired').length} expired
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Last Review:</span>
                    <span>{vendor.complianceStatus.lastReview.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Next Review:</span>
                    <span>{vendor.complianceStatus.nextReview.toLocaleDateString()}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={() => {
                  // Switch to compliance tab
                  const tabTrigger = document.querySelector('[value="compliance"]') as HTMLElement;
                  tabTrigger?.click();
                }}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Documents
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Internal Notes (Admin only) */}
          {vendor.internalNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Internal Notes</CardTitle>
                <CardDescription>
                  Notes from your account management team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{vendor.internalNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Compliance Documents Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Documents</CardTitle>
              <CardDescription>
                Upload and manage required compliance documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload New Document</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Drag and drop files here, or click to browse
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Certificate of Insurance', 'W9 Form', 'NDA', 'Business License', 'Other'].map((type) => (
                      <div key={type}>
                        <input
                          type="file"
                          id={`upload-${type}`}
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, type);
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`upload-${type}`)?.click()}
                          disabled={uploadingFile === type}
                        >
                          {uploadingFile === type ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-2"></div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-3 w-3 mr-2" />
                              {type}
                            </>
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-4">
                <h4 className="text-lg font-medium">Current Documents</h4>
                {complianceDocuments.map((document) => (
                  <div key={document.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <h5 className="font-medium">{document.name}</h5>
                          <p className="text-sm text-gray-500">{document.type}</p>
                        </div>
                      </div>
                      {getStatusBadge(document.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">File:</span> {document.fileName}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {formatFileSize(document.fileSize)}
                      </div>
                      <div>
                        <span className="font-medium">Uploaded:</span> {document.uploadDate.toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Version:</span> {document.version}
                      </div>
                    </div>

                    {document.expiryDate && (
                      <div className="text-sm text-gray-600 mb-3">
                        <span className="font-medium">Expires:</span> {document.expiryDate.toLocaleDateString()}
                        {document.status === 'Expiring Soon' && (
                          <span className="text-yellow-600 ml-2">
                            (Expires in {Math.ceil((document.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days)
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Uploaded by {document.uploadedBy}
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                        {document.status === 'Expired' || document.status === 'Expiring Soon' ? (
                          <div>
                            <input
                              type="file"
                              id={`replace-${document.id}`}
                              className="hidden"
                              accept=".pdf,.doc,.docx,.jpg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, document.type);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => document.getElementById(`replace-${document.id}`)?.click()}
                            >
                              <Upload className="h-3 w-3 mr-1" />
                              Replace
                            </Button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}

                {complianceDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No compliance documents uploaded yet</p>
                    <p className="text-sm">Upload your first document to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Change History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Change History</CardTitle>
              <CardDescription>
                Track of all profile and document changes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock change history */}
                {[
                  {
                    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    action: 'Document Upload',
                    description: 'Uploaded new Certificate of Insurance',
                    user: 'John Smith'
                  },
                  {
                    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                    action: 'Profile Update',
                    description: 'Updated vendor notes',
                    user: 'John Smith'
                  },
                  {
                    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                    action: 'Document Upload',
                    description: 'Uploaded W9 Form',
                    user: 'John Smith'
                  }
                ].map((change, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{change.action}</h5>
                        <span className="text-sm text-gray-500">
                          {change.date.toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{change.description}</p>
                      <p className="text-xs text-gray-500 mt-1">by {change.user}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VendorProfile;
