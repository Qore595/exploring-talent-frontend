import React from 'react';
import { Info, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface DynamicFormFieldProps {
  id: string;
  label: string;
  type: 'input' | 'select';
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  visible?: boolean;
  tooltip?: string;
  helpText?: string;
  error?: string;
  warning?: string;
  suffix?: string;
  prefix?: string;
  step?: string;
  min?: number;
  max?: number;
  options?: Array<{ value: string; label: string; description?: string }>;
  className?: string;
}

const DynamicFormField: React.FC<DynamicFormFieldProps> = ({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  disabled = false,
  required = false,
  visible = true,
  tooltip,
  helpText,
  error,
  warning,
  suffix,
  prefix,
  step,
  min,
  max,
  options = [],
  className,
}) => {
  if (!visible) {
    return null;
  }

  const hasError = !!error;
  const hasWarning = !!warning && !hasError;

  const renderLabel = () => (
    <div className="flex items-center space-x-2 mb-2">
      <Label 
        htmlFor={id} 
        className={cn(
          "text-sm font-medium",
          hasError && "text-red-600",
          hasWarning && "text-yellow-600"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {disabled && <span className="text-muted-foreground ml-1">(Disabled)</span>}
      </Label>
      
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );

  const renderInput = () => {
    const inputClasses = cn(
      "transition-colors",
      hasError && "border-red-500 focus:border-red-500 focus:ring-red-500",
      hasWarning && "border-yellow-500 focus:border-yellow-500 focus:ring-yellow-500",
      disabled && "opacity-50 cursor-not-allowed"
    );

    if (type === 'select') {
      return (
        <Select
          value={value.toString()}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger className={inputClasses}>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div>
                  <div>{option.label}</div>
                  {option.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="relative">
        {prefix && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
            {prefix}
          </div>
        )}
        <Input
          id={id}
          type="number"
          value={value}
          onChange={(e) => {
            const newValue = e.target.value === '' ? 0 : parseFloat(e.target.value);
            onChange(newValue);
          }}
          placeholder={placeholder}
          disabled={disabled}
          step={step}
          min={min}
          max={max}
          className={cn(
            inputClasses,
            prefix && "pl-8",
            suffix && "pr-12"
          )}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm">
            {suffix}
          </div>
        )}
      </div>
    );
  };

  const renderFeedback = () => {
    if (error) {
      return (
        <div className="flex items-start space-x-2 mt-2 text-red-600">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      );
    }

    if (warning) {
      return (
        <div className="flex items-start space-x-2 mt-2 text-yellow-600">
          <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{warning}</span>
        </div>
      );
    }

    if (helpText) {
      return (
        <div className="mt-2 text-sm text-muted-foreground">
          {helpText}
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cn("space-y-1", className)}>
      {renderLabel()}
      {renderInput()}
      {renderFeedback()}
    </div>
  );
};

export default DynamicFormField;
