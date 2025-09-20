import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border bg-background text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input hover:border-primary/50 focus-visible:border-primary",
        filled: "border-transparent bg-muted hover:bg-muted/80 focus-visible:bg-background focus-visible:border-primary",
        outline: "border-2 border-input hover:border-primary/50 focus-visible:border-primary",
        ghost: "border-transparent hover:border-input focus-visible:border-primary",
      },
      inputSize: {
        default: "h-10 px-3 py-2",
        sm: "h-8 px-2 py-1 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
      state: {
        default: "",
        error: "border-destructive focus-visible:ring-destructive",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      }
    },
    defaultVariants: {
      variant: "default",
      inputSize: "default",
      state: "default",
    },
  }
)

export interface InputProps
  extends React.ComponentProps<"input">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, inputSize, state, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, inputSize, state, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }
