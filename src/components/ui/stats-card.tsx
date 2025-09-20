
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  className?: string;
  variant?: "default" | "gradient" | "minimal" | "elevated";
  loading?: boolean;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
  variant = "default",
  loading = false,
  onClick
}: StatsCardProps) {
  const cardVariants = {
    default: "hover:shadow-md",
    gradient: "bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/10 hover:shadow-lg hover:shadow-primary/10",
    minimal: "border-0 shadow-none bg-muted/30 hover:bg-muted/50",
    elevated: "shadow-lg hover:shadow-xl hover:-translate-y-1"
  };

  const iconVariants = {
    default: "bg-accent text-accent-foreground",
    gradient: "bg-gradient-to-br from-primary to-secondary text-white",
    minimal: "bg-background text-foreground border",
    elevated: "bg-primary/10 text-primary"
  };

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", cardVariants[variant], className)}>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div className="flex-1">
              <div className="h-4 bg-muted rounded animate-pulse mb-3" />
              <div className="h-8 bg-muted rounded animate-pulse mb-2" />
              <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
            </div>
            <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: onClick ? 0.98 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          "overflow-hidden transition-all duration-300 cursor-pointer",
          cardVariants[variant],
          onClick && "hover:cursor-pointer",
          className
        )}
        onClick={onClick}
        variant={variant === "elevated" ? "elevated" : "default"}
      >
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
              <motion.h2
                className="text-3xl font-bold text-foreground mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {value}
              </motion.h2>
              {description && (
                <p className="text-sm text-muted-foreground mb-3">{description}</p>
              )}
              {trend && (
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                    trend.isPositive
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                  )}>
                    {trend.isPositive ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {trend.value}%
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {trend.label || "from last month"}
                  </span>
                </motion.div>
              )}
            </div>
            {icon && (
              <motion.div
                className={cn(
                  "rounded-full p-3 transition-all duration-200",
                  iconVariants[variant]
                )}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                {icon}
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
