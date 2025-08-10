import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, X, Mail, Phone, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PocFormData, PocRole, PocStatus } from '@/types/vendor';

// Validation schema
const pocSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  role: z.enum([
    'Relationship Manager',
    'Timesheet Approver',
    'Legal Contact',
    'Technical Lead',
    'Account Manager',
    'Billing Contact',
    'HR Contact',
    'Compliance Officer'
  ], {
    required_error: 'Please select a role',
  }),
  email: z.string()
    .email('Please enter a valid email address')
    .min(1, 'Email is required'),
  phone: z.string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),
  status: z.enum(['Active', 'Replaced', 'Inactive', 'Leaving'], {
    required_error: 'Please select a status',
  }),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
  isPrimary: z.boolean(),
  isBackup: z.boolean(),
}).refine((data) => {
  // Can't be both primary and backup
  return !(data.isPrimary && data.isBackup);
}, {
  message: 'Contact cannot be both primary and backup',
  path: ['isBackup'],
});

type PocFormValues = z.infer<typeof pocSchema>;

const PocForm: React.FC = () => {
  const navigate = useNavigate();
  const { pocId, vendorId } = useParams();
  const isEditing = Boolean(pocId);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vendorName, setVendorName] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset
  } = useForm<PocFormValues>({
    resolver: zodResolver(pocSchema),
    defaultValues: {
      name: '',
      role: 'Relationship Manager',
      email: '',
      phone: '',
      status: 'Active',
      notes: '',
      isPrimary: false,
      isBackup: false,
    },
  });

  const watchedValues = watch();

  // Load PoC data if editing
  useEffect(() => {
    if (isEditing && pocId) {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // Load data immediately for better UX
      const mockPoc = {
        name: 'John Smith',
        role: 'Relationship Manager' as PocRole,
        email: 'john.smith@techcorp.com',
        phone: '+1-555-0123',
        status: 'Active' as PocStatus,
        notes: 'Primary contact for all strategic discussions',
        isPrimary: true,
        isBackup: false,
      };
      reset(mockPoc);
      setVendorName('TechCorp Solutions');
      setIsLoading(false);

      console.log('Loaded PoC form data:', mockPoc);
    } else if (vendorId) {
      // Load vendor name for new PoC
      setIsLoading(true);
      // Load vendor name immediately
      setVendorName('TechCorp Solutions');
      setIsLoading(false);
    }
  }, [isEditing, pocId, vendorId, reset]);

  const onSubmit = async (data: PocFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      console.log('Submitting PoC data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate back to appropriate page
      if (vendorId) {
        navigate(`/vendor-hub/vendors/${vendorId}`);
      } else {
        navigate('/vendor-hub/pocs');
      }
    } catch (err) {
      setError('Failed to save point of contact. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Edit Point of Contact' : 'Add Point of Contact'}
            </h1>
            <p className="text-muted-foreground">
              {vendorName && `For ${vendorName}`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>
              Basic contact details and role information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter full name"
                  {...register('name')}
                  className={cn("pl-8", errors.name && "border-destructive")}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watchedValues.role}
                  onValueChange={(value) => setValue('role', value as PocRole, { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Relationship Manager">Relationship Manager</SelectItem>
                    <SelectItem value="Timesheet Approver">Timesheet Approver</SelectItem>
                    <SelectItem value="Legal Contact">Legal Contact</SelectItem>
                    <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                    <SelectItem value="Account Manager">Account Manager</SelectItem>
                    <SelectItem value="Billing Contact">Billing Contact</SelectItem>
                    <SelectItem value="HR Contact">HR Contact</SelectItem>
                    <SelectItem value="Compliance Officer">Compliance Officer</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watchedValues.status}
                  onValueChange={(value) => setValue('status', value as PocStatus, { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Replaced">Replaced</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Leaving">Leaving</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                    {...register('email')}
                    className={cn("pl-8", errors.email && "border-destructive")}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter phone number (optional)"
                    {...register('phone')}
                    className={cn("pl-8", errors.phone && "border-destructive")}
                  />
                </div>
                {errors.phone && (
                  <p className="text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Type & Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Type & Priority</CardTitle>
            <CardDescription>
              Define the contact's role in the escalation chain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Primary Contact */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isPrimary"
                    checked={watchedValues.isPrimary}
                    onCheckedChange={(checked) => {
                      setValue('isPrimary', checked as boolean, { shouldDirty: true });
                      // If setting as primary, unset backup
                      if (checked) {
                        setValue('isBackup', false, { shouldDirty: true });
                      }
                    }}
                  />
                  <Label htmlFor="isPrimary" className="text-sm font-medium">
                    Primary Contact
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  This person is the main point of contact for this vendor
                </p>
              </div>

              {/* Backup Contact */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isBackup"
                    checked={watchedValues.isBackup}
                    onCheckedChange={(checked) => {
                      setValue('isBackup', checked as boolean, { shouldDirty: true });
                      // If setting as backup, unset primary
                      if (checked) {
                        setValue('isPrimary', false, { shouldDirty: true });
                      }
                    }}
                  />
                  <Label htmlFor="isBackup" className="text-sm font-medium">
                    Backup Contact
                  </Label>
                </div>
                <p className="text-xs text-muted-foreground ml-6">
                  This person serves as an escalation contact when primary is unavailable
                </p>
              </div>
            </div>

            {errors.isBackup && (
              <Alert variant="destructive">
                <AlertDescription>{errors.isBackup.message}</AlertDescription>
              </Alert>
            )}

            {!watchedValues.isPrimary && !watchedValues.isBackup && (
              <Alert>
                <AlertDescription>
                  Consider designating this contact as either primary or backup for better organization.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Optional notes and comments about this contact
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes about this contact..."
                rows={4}
                {...register('notes')}
                className={cn(errors.notes && "border-destructive")}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 500 characters. Include transition information, escalation procedures, or special instructions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Form Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                <span className="text-destructive">*</span> Required fields
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isEditing ? 'Update Contact' : 'Create Contact'}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default PocForm;
