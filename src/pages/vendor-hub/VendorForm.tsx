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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Save, X, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { VendorFormData, VendorType, VendorStatus, VendorTierLevel } from '@/types/vendor';

// Validation schema
const vendorSchema = z.object({
  vendorType: z.enum(['Prime Vendor', 'Sub Vendor'], {
    required_error: 'Please select a vendor type',
  }),
  vendorName: z.string()
    .min(2, 'Vendor name must be at least 2 characters')
    .max(100, 'Vendor name must be less than 100 characters'),
  status: z.enum(['Active', 'Inactive'], {
    required_error: 'Please select a status',
  }),
  onboardDate: z.date({
    required_error: 'Please select an onboard date',
  }),
  offboardDate: z.date().optional().nullable(),
  tierLevel: z.enum(['Preferred', 'Tier-2', 'Tier-3', 'Standard']).optional(),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional(),
}).refine((data) => {
  if (data.offboardDate && data.onboardDate) {
    return data.offboardDate >= data.onboardDate;
  }
  return true;
}, {
  message: 'Offboard date must be after onboard date',
  path: ['offboardDate'],
});

type VendorFormValues = z.infer<typeof vendorSchema>;

const VendorForm: React.FC = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const isEditing = Boolean(vendorId);

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset
  } = useForm<VendorFormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      vendorType: 'Prime Vendor',
      status: 'Active',
      onboardDate: new Date(),
      offboardDate: null,
      tierLevel: 'Standard',
      notes: '',
    },
  });

  const watchedValues = watch();

  // Load vendor data if editing
  useEffect(() => {
    if (isEditing && vendorId) {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // Load data immediately for better UX
      const mockVendor = {
        vendorType: 'Prime Vendor' as VendorType,
        vendorName: 'TechCorp Solutions',
        status: 'Active' as VendorStatus,
        onboardDate: new Date('2023-01-15'),
        offboardDate: null,
        tierLevel: 'Preferred' as VendorTierLevel,
        notes: 'Primary technology partner',
      };
      reset(mockVendor);
      setIsLoading(false);

      console.log('Loaded vendor form data:', mockVendor);
    }
  }, [isEditing, vendorId, reset]);

  const onSubmit = async (data: VendorFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      console.log('Submitting vendor data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate back to vendor registry
      navigate('/vendor-hub/vendors');
    } catch (err) {
      setError('Failed to save vendor. Please try again.');
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
          <p className="mt-2">Loading vendor...</p>
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
              {isEditing ? 'Edit Vendor' : 'Add New Vendor'}
            </h1>
            <p className="text-muted-foreground">
              {isEditing ? 'Update vendor information' : 'Create a new vendor record'}
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
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Essential vendor details and classification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Vendor Type */}
              <div className="space-y-2">
                <Label htmlFor="vendorType">
                  Vendor Type <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watchedValues.vendorType}
                  onValueChange={(value) => setValue('vendorType', value as VendorType, { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prime Vendor">Prime Vendor</SelectItem>
                    <SelectItem value="Sub Vendor">Sub Vendor</SelectItem>
                  </SelectContent>
                </Select>
                {errors.vendorType && (
                  <p className="text-sm text-destructive">{errors.vendorType.message}</p>
                )}
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watchedValues.status}
                  onValueChange={(value) => setValue('status', value as VendorStatus, { shouldDirty: true })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-sm text-destructive">{errors.status.message}</p>
                )}
              </div>
            </div>

            {/* Vendor Name */}
            <div className="space-y-2">
              <Label htmlFor="vendorName">
                Vendor Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="vendorName"
                placeholder="Enter legal entity name"
                {...register('vendorName')}
                className={cn(errors.vendorName && "border-destructive")}
              />
              {errors.vendorName && (
                <p className="text-sm text-destructive">{errors.vendorName.message}</p>
              )}
            </div>

            {/* Tier Level */}
            <div className="space-y-2">
              <Label htmlFor="tierLevel">Tier Level</Label>
              <Select
                value={watchedValues.tierLevel || ''}
                onValueChange={(value) => setValue('tierLevel', value as VendorTierLevel, { shouldDirty: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tier level (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preferred">Preferred</SelectItem>
                  <SelectItem value="Tier-2">Tier-2</SelectItem>
                  <SelectItem value="Tier-3">Tier-3</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                </SelectContent>
              </Select>
              {errors.tierLevel && (
                <p className="text-sm text-destructive">{errors.tierLevel.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Important Dates</CardTitle>
            <CardDescription>
              Track vendor relationship timeline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Onboard Date */}
              <div className="space-y-2">
                <Label>
                  Onboard Date <span className="text-destructive">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedValues.onboardDate && "text-muted-foreground",
                        errors.onboardDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedValues.onboardDate ? (
                        format(watchedValues.onboardDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={watchedValues.onboardDate}
                      onSelect={(date) => setValue('onboardDate', date!, { shouldDirty: true })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.onboardDate && (
                  <p className="text-sm text-destructive">{errors.onboardDate.message}</p>
                )}
              </div>

              {/* Offboard Date */}
              <div className="space-y-2">
                <Label>Offboard Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedValues.offboardDate && "text-muted-foreground",
                        errors.offboardDate && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedValues.offboardDate ? (
                        format(watchedValues.offboardDate, "PPP")
                      ) : (
                        <span>Pick a date (optional)</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={watchedValues.offboardDate || undefined}
                      onSelect={(date) => setValue('offboardDate', date || null, { shouldDirty: true })}
                      initialFocus
                      disabled={(date) =>
                        watchedValues.onboardDate ? date < watchedValues.onboardDate : false
                      }
                    />
                  </PopoverContent>
                </Popover>
                {errors.offboardDate && (
                  <p className="text-sm text-destructive">{errors.offboardDate.message}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Leave empty for active vendors
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
            <CardDescription>
              Optional notes and comments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Enter any additional notes about this vendor..."
                rows={4}
                {...register('notes')}
                className={cn(errors.notes && "border-destructive")}
              />
              {errors.notes && (
                <p className="text-sm text-destructive">{errors.notes.message}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Maximum 500 characters
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
                      {isEditing ? 'Update Vendor' : 'Create Vendor'}
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

export default VendorForm;
