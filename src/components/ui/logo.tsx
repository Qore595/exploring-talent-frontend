import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white"
}

export function Logo({ 
  className, 
  size = "md",
  variant = "default"
}: LogoProps) {
  const sizes = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12"
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 32 32"
        className={cn(sizes[size])}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm0 25.2c-6.188 0-11.2-5.012-11.2-11.2S9.812 4.8 16 4.8 27.2 9.812 27.2 16 22.188 27.2 16 27.2z"
          className={variant === "white" ? "fill-white" : "fill-recruit-primary"}
        />
        <path
          d="M16 7.6c-4.636 0-8.4 3.764-8.4 8.4s3.764 8.4 8.4 8.4 8.4-3.764 8.4-8.4-3.764-8.4-8.4-8.4zm0 14c-3.092 0-5.6-2.508-5.6-5.6s2.508-5.6 5.6-5.6 5.6 2.508 5.6 5.6-2.508 5.6-5.6 5.6z"
          className={variant === "white" ? "fill-white/90" : "fill-recruit-secondary"}
        />
        <circle 
          cx="16" 
          cy="16" 
          r="3.2"
          className={variant === "white" ? "fill-white/80" : "fill-recruit-tertiary"}
        />
      </svg>
      <span className={cn(
        "font-bold tracking-tight",
        {
          "text-lg": size === "sm",
          "text-xl": size === "md",
          "text-3xl": size === "lg",
        },
        variant === "white" ? "text-white" : "text-foreground"
      )}>
        QORE
      </span>
    </div>
  )
}