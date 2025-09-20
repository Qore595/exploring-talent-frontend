import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'centered' | 'minimal';
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
  className,
  variant = 'default'
}) => {
  const headerVariants = {
    default: "mb-8 pb-6 border-b border-border/40",
    centered: "mb-8 pb-6 text-center",
    minimal: "mb-6"
  };

  return (
    <motion.div
      className={cn(headerVariants[variant], className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage className="font-medium">
                      {item.label}
                    </BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      <div className={cn(
        "flex items-start justify-between gap-4",
        variant === 'centered' && "flex-col items-center"
      )}>
        <div className={cn(variant === 'centered' && "text-center")}>
          <motion.h1
            className="text-3xl font-bold tracking-tight text-foreground mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              className="text-muted-foreground text-lg leading-relaxed max-w-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}
        </div>

        {actions && (
          <motion.div
            className="flex items-center gap-2 flex-shrink-0"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {actions}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
