import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-muted relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-muted",
        shimmer: "bg-gradient-to-r from-muted via-muted/50 to-muted bg-[length:200%_100%] animate-[shimmer_2s_infinite]",
        wave: "bg-muted before:absolute before:inset-0 before:-translate-x-full before:animate-[wave_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      },
      speed: {
        slow: "animate-pulse [animation-duration:2s]",
        normal: "animate-pulse",
        fast: "animate-pulse [animation-duration:0.8s]",
      }
    },
    defaultVariants: {
      variant: "default",
      speed: "normal",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({
  className,
  variant,
  speed,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, speed, className }))}
      {...props}
    />
  )
}

// Predefined skeleton components for common use cases
const SkeletonText = ({ lines = 3, className, ...props }: { lines?: number } & SkeletonProps) => (
  <div className={cn("space-y-2", className)} {...props}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn(
          "h-4",
          i === lines - 1 ? "w-3/4" : "w-full"
        )}
        variant="shimmer"
      />
    ))}
  </div>
)

const SkeletonCard = ({ className, ...props }: SkeletonProps) => (
  <div className={cn("space-y-4 p-6 border rounded-lg", className)} {...props}>
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" variant="shimmer" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-1/2" variant="shimmer" />
        <Skeleton className="h-3 w-1/3" variant="shimmer" />
      </div>
    </div>
    <SkeletonText lines={2} variant="shimmer" />
  </div>
)

const SkeletonTable = ({ rows = 5, cols = 4, className, ...props }: { rows?: number; cols?: number } & SkeletonProps) => (
  <div className={cn("space-y-3", className)} {...props}>
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-8" variant="shimmer" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="grid gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, colIndex) => (
          <Skeleton key={colIndex} className="h-6" variant="wave" />
        ))}
      </div>
    ))}
  </div>
)

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable }
