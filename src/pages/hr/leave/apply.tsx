import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { PageHeader } from '@/components/page-header';

// Form schema
const formSchema = z.object({
  leaveType: z.string().min(1, { message: 'Please select a leave type.' }),
  startDate: z.date({ required_error: 'Please select a start date.' }),
  endDate: z.date({ required_error: 'Please select an end date.' }),
  reason: z.string().min(5, { message: 'Reason must be at least 5 characters.' }),
  contactInfo: z.string().min(5, { message: 'Contact information must be at least 5 characters.' }),
  attachment: z.any().optional(),
});

// Mock data for leave types
const leaveTypes = [
  { id: 'annual', name: 'Annual Leave', balance: 15 },
  { id: 'sick', name: 'Sick Leave', balance: 10 },
  { id: 'personal', name: 'Personal Leave', balance: 5 },
  { id: 'maternity', name: 'Maternity Leave', balance: 90 },
  { id: 'paternity', name: 'Paternity Leave', balance: 14 },
  { id: 'bereavement', name: 'Bereavement Leave', balance: 3 },
  { id: 'unpaid', name: 'Unpaid Leave', balance: null },
];

const ApplyLeavePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      leaveType: '',
      reason: '',
      contactInfo: '',
    },
  });

  // Get leave balance for selected leave type
  const getLeaveBalance = (leaveTypeId: string) => {
    const leaveType = leaveTypes.find(type => type.id === leaveTypeId);
    return leaveType?.balance;
  };

  // Calculate number of days between start and end dates
  const calculateDays = (startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your API
      console.log(values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Leave Application Submitted',
        description: 'Your leave application has been successfully submitted.',
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'There was an error submitting your leave application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Watch for start and end dates to calculate days
  const startDate = form.watch('startDate');
  const endDate = form.watch('endDate');
  const leaveType = form.watch('leaveType');

  // Calculate number of days
  const numberOfDays = startDate && endDate ? calculateDays(startDate, endDate) : 0;

  // Update selected leave type
  const handleLeaveTypeChange = (value: string) => {
    setSelectedLeaveType(value);
    form.setValue('leaveType', value);
  };

  return (
    <div className="container mx-auto py-6">
      <PageHeader
        title="Apply for Leave"
        description="Submit a new leave application"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Leave Application Form</CardTitle>
              <CardDescription>
                Fill in the details below to submit your leave request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="leaveType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leave Type *</FormLabel>
                        <Select onValueChange={handleLeaveTypeChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a leave type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {leaveTypes.map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date *</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => startDate ? date < startDate : date < new Date()}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason for Leave *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide details about your leave request" 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="contactInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Information During Leave *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Phone number or email where you can be reached if needed" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="attachment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Attachment (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="file" 
                            onChange={(e) => field.onChange(e.target.files?.[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Submitting...' : 'Submit Leave Request'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Leave Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Selected Leave Type</h3>
                  <p className="text-lg font-semibold">
                    {selectedLeaveType 
                      ? leaveTypes.find(type => type.id === selectedLeaveType)?.name 
                      : 'None selected'}
                  </p>
                </div>
                
                {selectedLeaveType && getLeaveBalance(selectedLeaveType) !== null && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Available Balance</h3>
                    <p className="text-lg font-semibold">
                      {getLeaveBalance(selectedLeaveType)} days
                    </p>
                  </div>
                )}
                
                {startDate && endDate && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Duration</h3>
                      <p className="text-lg font-semibold">{numberOfDays} days</p>
                    </div>
                    
                    {selectedLeaveType && getLeaveBalance(selectedLeaveType) !== null && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Remaining Balance After Leave</h3>
                        <p className="text-lg font-semibold">
                          {Math.max(0, (getLeaveBalance(selectedLeaveType) || 0) - numberOfDays)} days
                        </p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Leave Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Leave requests should be submitted at least 7 days in advance.</li>
                <li>• Sick leave may require a medical certificate for absences longer than 2 days.</li>
                <li>• Unused annual leave can be carried forward to the next year (max 5 days).</li>
                <li>• Leave approval is subject to manager's discretion and team workload.</li>
                <li>• Emergency leave requests will be handled on a case-by-case basis.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeavePage;
