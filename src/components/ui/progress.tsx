import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary transition-all duration-300",
  {
    variants: {
      size: {
        sm: "h-2",
        default: "h-4",
        lg: "h-6",
      },
      variant: {
        default: "bg-secondary",
        gradient: "bg-gradient-to-r from-muted to-muted/50",
        minimal: "bg-muted/30",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
)

const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        gradient: "bg-gradient-to-r from-primary to-secondary",
        success: "bg-green-500",
        warning: "bg-yellow-500",
        danger: "bg-red-500",
        animated: "bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {
  indicatorClassName?: string;
  indicatorVariant?: VariantProps<typeof indicatorVariants>['variant'];
  showValue?: boolean;
  label?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({
  className,
  value,
  indicatorClassName,
  size,
  variant,
  indicatorVariant = "default",
  showValue = false,
  label,
  ...props
}, ref) => (
  <div className="w-full">
    {(label || showValue) && (
      <div className="flex justify-between items-center mb-2">
        {label && <span className="text-sm font-medium text-foreground">{label}</span>}
        {showValue && <span className="text-sm text-muted-foreground">{value}%</span>}
      </div>
    )}
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ size, variant, className }))}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(indicatorVariants({ variant: indicatorVariant }), indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  </div>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
