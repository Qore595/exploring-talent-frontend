import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80 hover:shadow-md hover:shadow-primary/25",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-md hover:shadow-secondary/25",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:shadow-md hover:shadow-destructive/25",
        success:
          "border-transparent bg-green-500 text-white hover:bg-green-600 hover:shadow-md hover:shadow-green-500/25",
        warning:
          "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 hover:shadow-md hover:shadow-yellow-500/25",
        info:
          "border-transparent bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md hover:shadow-blue-500/25",
        outline:
          "text-foreground border-border hover:bg-accent hover:text-accent-foreground",
        ghost:
          "border-transparent bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
        gradient:
          "border-transparent bg-gradient-to-r from-primary to-secondary text-white hover:shadow-md hover:shadow-primary/25",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        default: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      shape: {
        default: "rounded-full",
        square: "rounded-md",
        pill: "rounded-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, shape, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size, shape }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
