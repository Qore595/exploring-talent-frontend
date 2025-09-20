import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton, SkeletonCard, SkeletonTable } from './skeleton';
import { Card, CardContent, CardHeader } from './card';

interface LoadingStateProps {
  variant?: 'dashboard' | 'table' | 'cards' | 'form';
  count?: number;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  variant = 'dashboard', 
  count = 4,
  className 
}) => {
  const renderDashboardLoading = () => (
    <div className="space-y-8">
      {/* Header Loading */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" variant="shimmer" />
        <Skeleton className="h-4 w-96" variant="shimmer" />
      </div>

      {/* Stats Cards Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <SkeletonCard variant="shimmer" />
          </motion.div>
        ))}
      </div>

      {/* Charts Loading */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} variant="elevated">
            <CardHeader>
              <Skeleton className="h-6 w-32" variant="shimmer" />
              <Skeleton className="h-4 w-48" variant="shimmer" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" variant="wave" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Loading */}
      <Card variant="elevated">
        <CardHeader>
          <Skeleton className="h-6 w-40" variant="shimmer" />
          <Skeleton className="h-4 w-64" variant="shimmer" />
        </CardHeader>
        <CardContent>
          <SkeletonTable rows={5} cols={6} variant="wave" />
        </CardContent>
      </Card>
    </div>
  );

  const renderTableLoading = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" variant="shimmer" />
        <Skeleton className="h-4 w-72" variant="shimmer" />
      </CardHeader>
      <CardContent>
        <SkeletonTable rows={count} cols={5} variant="wave" />
      </CardContent>
    </Card>
  );

  const renderCardsLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <SkeletonCard variant="shimmer" />
        </motion.div>
      ))}
    </div>
  );

  const renderFormLoading = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-56" variant="shimmer" />
        <Skeleton className="h-4 w-80" variant="shimmer" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" variant="shimmer" />
            <Skeleton className="h-10 w-full" variant="wave" />
          </div>
        ))}
        <div className="flex gap-3 pt-4">
          <Skeleton className="h-10 w-24" variant="shimmer" />
          <Skeleton className="h-10 w-20" variant="shimmer" />
        </div>
      </CardContent>
    </Card>
  );

  const variants = {
    dashboard: renderDashboardLoading,
    table: renderTableLoading,
    cards: renderCardsLoading,
    form: renderFormLoading,
  };

  return (
    <div className={className}>
      {variants[variant]()}
    </div>
  );
};

// Pulse Loading Animation Component
export const PulseLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} rounded-full bg-primary animate-pulse`} />
    </div>
  );
};

// Spinner Loading Component
export const SpinnerLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin`} />
    </div>
  );
};
