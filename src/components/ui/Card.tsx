/**
 * Reusable Card Component
 * Used for displaying food items, content sections, and other information
 */

import React, { useState } from 'react';
import type { ReactNode, HTMLAttributes } from 'react';
import type { FoodItem } from '../../types/index.ts';

type CardVariant = 'default' | 'elevated' | 'outlined' | 'primary' | 'food';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  size = 'md',
  hover = true,
  className = '',
  onClick,
  ...props
}) => {
  // Base card classes
  const baseClasses = 'bg-surface-light dark:bg-surface-dark rounded-xl shadow-lg transition-all duration-300 overflow-hidden';
  
  // Variant classes
  const variantClasses: Record<CardVariant, string> = {
    default: 'border border-surface-lightBorder dark:border-surface-darkBorder',
    elevated: 'shadow-xl hover:shadow-2xl',
    outlined: 'border-2 border-surface-lightBorder dark:border-surface-darkBorder',
    primary: 'border-2 border-primary/20 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20',
    food: 'border border-surface-lightBorder dark:border-surface-darkBorder hover:border-primary/30 hover:shadow-xl'
  };
  
  // Size classes
  const sizeClasses: Record<CardSize, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };
  
  // Hover effects
  const hoverClasses = hover ? 'hover:-translate-y-1 hover:shadow-xl' : '';
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${hoverClasses} ${className}`;
  
  // Click handler
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

// Card Header Component
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

// Card Body Component
interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '', ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

// Card Footer Component
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '', ...props }) => (
  <div className={`mt-4 pt-4 border-t border-surface-lightBorder dark:border-surface-darkBorder ${className}`} {...props}>
    {children}
  </div>
 );

// Food Item Card Component
interface FoodCardProps extends HTMLAttributes<HTMLDivElement> {
  food: FoodItem;
  onAddToCart?: (food: FoodItem) => void;
  className?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  onAddToCart,
  className = '',
  ...props
}) => {
  const { id, img, name, dsc, price, rate, country } = food;
  const [imageError, setImageError] = useState<boolean>(false);
  
  return (
    <Card
      variant="food"
      size="md"
      className={`group cursor-pointer h-full ${className}`}
      {...props}
    >
      {/* Food Image */}
      <div className="relative overflow-hidden rounded-lg mb-4">
        {!imageError ? (
          <img
            src={img}
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-4xl mb-2">🍽️</div>
              <div className="text-sm">Image not available</div>
            </div>
          </div>
        )}
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-primary-light text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm">
          ⭐ {rate}
        </div>
        {/* Country Badge */}
        <div className="absolute bottom-3 left-3 bg-gradient-to-r from-black/80 to-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm">
          {country}
        </div>
      </div>
      
      {/* Food Info */}
      <div className="space-y-3">
        <h3 className="text-base md:text-lg font-semibold text-text-light dark:text-text-dark line-clamp-2">
          {name}
        </h3>
        <p className="text-xs md:text-sm text-text-lightSecondary dark:text-text-darkSecondary line-clamp-3">
          {dsc}
        </p>
        
        {/* Price and Add to Cart */}
        <div className="flex items-center justify-between">
          <span className="text-lg md:text-xl font-bold text-primary">
            ${price.toFixed(2)}
          </span>
         
        </div>
      </div>
    </Card>
  );
};

export default Card;

// Compact Food Item Card Component (optimized for small screens)
interface FoodCardCompactProps extends HTMLAttributes<HTMLDivElement> {
  food: FoodItem;
  onAddToCart?: (food: FoodItem) => void;
  className?: string;
}

export const FoodCardCompact: React.FC<FoodCardCompactProps> = ({
  food,
  onAddToCart,
  className = '',
  ...props
}) => {
  const { img, name, dsc, price, rate } = food;
  const [imageError, setImageError] = useState<boolean>(false);

  return (
    <Card
      variant="food"
      size="sm"
      className={`group cursor-pointer h-full ${className}`}
      hover
      {...props}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-lg mb-2">
        {!imageError ? (
          <img
            src={img}
            alt={name}
            className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            decoding="async"
            sizes="(max-width: 640px) 50vw, 33vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-28 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-lg">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <div className="text-2xl mb-1">🍽️</div>
              <div className="text-xs">No image</div>
            </div>
          </div>
        )}
        {/* Rating */}
        <div className="absolute top-2 right-2 bg-gradient-to-r from-primary to-primary-light text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow-lg">
          ⭐ {rate}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-text-light dark:text-text-dark line-clamp-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-primary">
            ${price.toFixed(2)}
          </span>
        </div>
        <p className="text-[11px] text-text-lightSecondary dark:text-text-darkSecondary line-clamp-2">
          {dsc}
        </p>
      </div>
    </Card>
  );
};
