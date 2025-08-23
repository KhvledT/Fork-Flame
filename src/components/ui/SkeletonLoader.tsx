/**
 * Skeleton Loader Component
 * Shows animated loading placeholders while content is being fetched
 */

import React from 'react';
import type { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';

type SkeletonVariant = 'default' | 'text' | 'title' | 'subtitle' | 'avatar' | 'image' | 'button' | 'card' | 'foodCard' | 'foodCardCompactImage' | 'foodCardCompactLine';

interface SkeletonLoaderProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'default',
  className = '',
  ...props
}) => {
  // Base skeleton classes
  const baseClasses = 'bg-gradient-to-r from-surface-lightHover to-surface-lightTertiary dark:from-surface-darkHover dark:to-surface-darkTertiary rounded animate-pulse';
  
  // Variant classes
  const variantClasses: Record<SkeletonVariant, string> = {
    default: 'h-4',
    text: 'h-4',
    title: 'h-6',
    subtitle: 'h-5',
    avatar: 'h-12 w-12 rounded-full',
    image: 'h-48 w-full',
    button: 'h-10 w-24',
    card: 'h-64 w-full rounded-xl',
    foodCard: 'h-80 w-full rounded-xl',
    foodCardCompactImage: 'h-28 w-full rounded-lg',
    foodCardCompactLine: 'h-3 w-3/4'
  };
  
  // Combine classes
  const skeletonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <div
      className={skeletonClasses}
      {...props}
    />
  );
};

// Food Card Skeleton
interface FoodCardSkeletonProps {
  className?: string;
}

export const FoodCardSkeleton: React.FC<FoodCardSkeletonProps> = ({ className = '' }) => (
  <div className={`bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg border border-surface-lightBorder dark:border-surface-darkBorder overflow-hidden ${className}`}>
    <div className="relative">
      <SkeletonLoader variant="image" className="h-48 w-full hidden md:block" />
      <SkeletonLoader variant="foodCardCompactImage" className="block md:hidden" />
    </div>
    <div className="p-4 md:p-6 space-y-2 md:space-y-3">
      <SkeletonLoader variant="title" className="w-3/4 h-5 md:h-6" />
      <SkeletonLoader variant="text" className="w-full h-3 md:h-4" />
      <SkeletonLoader variant="text" className="w-2/3 h-3 md:h-4" />
      <div className="flex items-center justify-between pt-2 md:pt-4">
        <SkeletonLoader variant="text" className="w-16 h-5 md:w-20 md:h-6" />
        <SkeletonLoader variant="button" className="w-20 h-9 md:w-24 md:h-10" />
      </div>
    </div>
  </div>
);

// Grid of food card skeletons
interface FoodGridSkeletonProps {
  count?: number;
  className?: string;
}

export const FoodGridSkeleton: React.FC<FoodGridSkeletonProps> = ({ count = 12, className = '' }) => (
  <div className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <FoodCardSkeleton key={index} />
    ))}
  </div>
);

// Text skeleton with multiple lines
interface TextSkeletonProps {
  lines?: number;
  className?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader
        key={index}
        variant="text"
        className={index === lines - 1 ? 'w-2/3' : 'w-full'}
      />
    ))}
  </div>
);

// Card skeleton
interface CardSkeletonProps {
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ className = '' }) => (
  <div className={`bg-white dark:bg-secondary-dark rounded-xl shadow-lg p-6 ${className}`}>
    <div className="space-y-4">
      <SkeletonLoader variant="title" className="w-1/2" />
      <TextSkeleton lines={3} />
      <div className="flex justify-between items-center pt-4">
        <SkeletonLoader variant="button" />
        <SkeletonLoader variant="button" />
      </div>
    </div>
  </div>
);

// List skeleton
interface ListSkeletonProps {
  items?: number;
  className?: string;
}

export const ListSkeleton: React.FC<ListSkeletonProps> = ({ items = 5, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 p-4 bg-white dark:bg-secondary-dark rounded-lg">
        <SkeletonLoader variant="avatar" />
        <div className="flex-1 space-y-2">
          <SkeletonLoader variant="title" className="w-1/3" />
          <SkeletonLoader variant="text" className="w-2/3" />
        </div>
      </div>
    ))}
  </div>
);

export default SkeletonLoader;
