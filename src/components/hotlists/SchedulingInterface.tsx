import { useState, useEffect } from 'react';
import { Calendar, Clock, Repeat, Zap, Settings, AlertCircle } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ScheduleType, ScheduleConfig } from '@/types/hotlists';

interface SchedulingInterfaceProps {
  scheduleType: ScheduleType;
  scheduleConfig: ScheduleConfig;
  onScheduleTypeChange: (type: ScheduleType) => void;
  onScheduleConfigChange: (config: ScheduleConfig) => void;
  autoLockEnabled: boolean;
  onAutoLockChange: (enabled: boolean) => void;
  className?: string;
}

const scheduleTypeOptions = [
  {
    value: 'immediate' as ScheduleType,
    label: 'Send Immediately',
    description: 'Send the hotlist right away',
    icon: Zap,
    color: 'text-green-600'
  },
  {
    value: 'daily' as ScheduleType,
    label: 'Daily',
    description: 'Send at the same time every day',
    icon: Calendar,
    color: 'text-blue-600'
  },
  {
    value: 'weekly' as ScheduleType,
    label: 'Weekly',
    description: 'Send on specific days of the week',
    icon: Repeat,
    color: 'text-purple-600'
  },
  {
    value: 'bi_weekly' as ScheduleType,
    label: 'Bi-Weekly',
    description: 'Send every two weeks',
    icon: Calendar,
    color: 'text-orange-600'
  },
  {
    value: 'custom' as ScheduleType,
    label: 'Custom',
    description: 'Set a custom schedule',
    icon: Settings,
    color: 'text-gray-600'
  }
];

const daysOfWeek = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' }
];

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'UTC', label: 'UTC' }
];

const SchedulingInterface: React.FC<SchedulingInterfaceProps> = ({
  scheduleType,
  scheduleConfig,
  onScheduleTypeChange,
  onScheduleConfigChange,
  autoLockEnabled,
  onAutoLockChange,
  className = ''
}) => {
  const [selectedDays, setSelectedDays] = useState<number[]>(scheduleConfig.days || [1, 2, 3, 4, 5]); // Default to weekdays
  const [time, setTime] = useState(scheduleConfig.time || '09:00');
  const [timezone, setTimezone] = useState(scheduleConfig.timezone || 'America/New_York');
  const [interval, setInterval] = useState(scheduleConfig.interval || 1);
  const [endDate, setEndDate] = useState(scheduleConfig.endDate || '');
  const [maxOccurrences, setMaxOccurrences] = useState(scheduleConfig.maxOccurrences || '');

  // Update schedule config when values change
  useEffect(() => {
    const newConfig: ScheduleConfig = {
      time,
      timezone,
      days: selectedDays,
      interval,
      endDate: endDate || undefined,
      maxOccurrences: maxOccurrences ? parseInt(maxOccurrences) : undefined
    };
    onScheduleConfigChange(newConfig);
  }, [time, timezone, selectedDays, interval, endDate, maxOccurrences, onScheduleConfigChange]);

  const handleDayToggle = (dayValue: number) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue].sort()
    );
  };

  const getScheduleSummary = (): string => {
    switch (scheduleType) {
      case 'immediate':
        return 'Will be sent immediately upon creation';
      case 'daily':
        return `Will be sent daily at ${time} ${timezone}`;
      case 'weekly':
        const dayNames = selectedDays.map(d => daysOfWeek.find(day => day.value === d)?.short).join(', ');
        return `Will be sent on ${dayNames} at ${time} ${timezone}`;
      case 'bi_weekly':
        const biWeeklyDays = selectedDays.map(d => daysOfWeek.find(day => day.value === d)?.short).join(', ');
        return `Will be sent every 2 weeks on ${biWeeklyDays} at ${time} ${timezone}`;
      case 'custom':
        return `Custom schedule: every ${interval} day(s) at ${time} ${timezone}`;
      default:
        return '';
    }
  };

  const getNextSendDate = (): string => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    
    switch (scheduleType) {
      case 'immediate':
        return 'Now';
      case 'daily':
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hours, minutes, 0, 0);
        return tomorrow.toLocaleString();
      case 'weekly':
      case 'bi_weekly':
        const nextDay = selectedDays.find(day => day > now.getDay()) || selectedDays[0];
        const nextDate = new Date(now);
        const daysUntilNext = nextDay > now.getDay() ? nextDay - now.getDay() : 7 - now.getDay() + nextDay;
        nextDate.setDate(nextDate.getDate() + daysUntilNext);
        nextDate.setHours(hours, minutes, 0, 0);
        if (scheduleType === 'bi_weekly') {
          nextDate.setDate(nextDate.getDate() + 7); // Add another week for bi-weekly
        }
        return nextDate.toLocaleString();
      case 'custom':
        const customNext = new Date(now);
        customNext.setDate(customNext.getDate() + interval);
        customNext.setHours(hours, minutes, 0, 0);
        return customNext.toLocaleString();
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Schedule Configuration</span>
          </CardTitle>
          <CardDescription>
            Configure when and how often this hotlist should be sent
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Schedule Type Selection */}
          <div className="space-y-3">
            <Label>Schedule Type</Label>
            <RadioGroup value={scheduleType} onValueChange={onScheduleTypeChange}>
              {scheduleTypeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value} className="flex items-center space-x-2 cursor-pointer">
                      <Icon className={`h-4 w-4 ${option.color}`} />
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Time and Timezone (for all except immediate) */}
          {scheduleType !== 'immediate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select value={timezone} onValueChange={setTimezone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Days of Week (for weekly and bi-weekly) */}
          {(scheduleType === 'weekly' || scheduleType === 'bi_weekly') && (
            <div className="space-y-3">
              <Label>Days of Week</Label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <Button
                    key={day.value}
                    variant={selectedDays.includes(day.value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleDayToggle(day.value)}
                    className="w-16"
                  >
                    {day.short}
                  </Button>
                ))}
              </div>
              {selectedDays.length === 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please select at least one day of the week.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          {/* Custom Interval */}
          {scheduleType === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="interval">Interval (days)</Label>
              <Input
                id="interval"
                type="number"
                min="1"
                value={interval}
                onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                placeholder="Number of days between sends"
              />
            </div>
          )}

          {/* End Conditions (for recurring schedules) */}
          {scheduleType !== 'immediate' && (
            <div className="space-y-4">
              <Label>End Conditions (Optional)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxOccurrences">Max Occurrences</Label>
                  <Input
                    id="maxOccurrences"
                    type="number"
                    min="1"
                    value={maxOccurrences}
                    onChange={(e) => setMaxOccurrences(e.target.value)}
                    placeholder="Maximum number of sends"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Auto-Lock Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autoLock"
              checked={autoLockEnabled}
              onCheckedChange={onAutoLockChange}
            />
            <Label htmlFor="autoLock" className="text-sm">
              Auto-lock hotlist after sending (prevents further modifications)
            </Label>
          </div>

          {/* Schedule Summary */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Schedule Summary</h4>
            <p className="text-sm text-blue-800 mb-2">{getScheduleSummary()}</p>
            {scheduleType !== 'immediate' && (
              <div className="text-sm text-blue-700">
                <strong>Next send:</strong> {getNextSendDate()}
              </div>
            )}
          </div>

          {/* Warnings and Tips */}
          {scheduleType === 'immediate' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The hotlist will be sent immediately after creation. Make sure all candidates and content are ready.
              </AlertDescription>
            </Alert>
          )}

          {(scheduleType === 'weekly' || scheduleType === 'bi_weekly') && selectedDays.length === 0 && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please select at least one day of the week for the schedule to work.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulingInterface;
