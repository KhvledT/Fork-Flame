/**
 * Loading Spinner Component
 * Various loading animations for different use cases
 */

import type { HTMLAttributes, ReactNode, FC, ComponentProps } from 'react';
import { motion } from 'framer-motion';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type SpinnerVariant = 'default' | 'light' | 'dark' | 'white';

type MotionDivProps = ComponentProps<typeof motion.div>;

interface LoadingSpinnerProps extends Omit<MotionDivProps, 'className'> {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'default',
  className = '',
  ...props
}) => {
  // Size classes
  const sizeClasses: Record<SpinnerSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  };
  
  // Variant classes
  const variantClasses: Record<SpinnerVariant, string> = {
    default: 'border-primary',
    light: 'border-white',
    dark: 'border-gray-800',
    white: 'border-white'
  };
  
  // Combine classes
  const spinnerClasses = `${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  
  // Default spinner
  if (variant === 'default') {
    return (
      <motion.div
        className={`${spinnerClasses} border-2 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        {...props}
      />
    );
  }
  
  // Light variant
  if (variant === 'light') {
    return (
      <motion.div
        className={`${spinnerClasses} border-2 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        {...props}
      />
    );
  }
  
  // Dark variant
  if (variant === 'dark') {
    return (
      <motion.div
        className={`${spinnerClasses} border-2 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        {...props}
      />
    );
  }
  
  // White variant
  if (variant === 'white') {
    return (
      <motion.div
        className={`${spinnerClasses} border-2 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        {...props}
      />
    );
  }
  
  return null;
};

// Dots loading animation
interface LoadingDotsProps {
  size?: SpinnerSize;
  className?: string;
}

export const LoadingDots: FC<LoadingDotsProps> = ({ size = 'md', className = '' }) => {
  const dotSize = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5'
  }[size];
  
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`${dotSize} bg-primary rounded-full`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            delay: index * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Pulse loading animation
interface LoadingPulseProps {
  size?: SpinnerSize;
  className?: string;
}

export const LoadingPulse: FC<LoadingPulseProps> = ({ size = 'md', className = '' }) => {
  const pulseSize = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    '2xl': 'w-16 h-16'
  }[size];
  
  return (
    <motion.div
      className={`${pulseSize} bg-primary rounded-full ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [1, 0.5, 1]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Bar loading animation
interface LoadingBarProps {
  width?: string;
  height?: string;
  className?: string;
}

export const LoadingBar: FC<LoadingBarProps> = ({ width = 'w-full', height = 'h-2', className = '' }) => (
  <div className={`${width} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden ${className}`}>
    <motion.div
      className={`${height} bg-primary rounded-full`}
      initial={{ width: '0%' }}
      animate={{ width: '100%' }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  </div>
);

// Full page loading overlay
interface LoadingOverlayProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  isLoading?: boolean;
  className?: string;
  spinnerSize?: SpinnerSize;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({ 
  children, 
  isLoading = false, 
  className = '',
  spinnerSize = 'xl',
  ...props 
}) => {
  if (!isLoading) return <>{children}</>;
  
  return (
    <div className={`fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center ${className}`} {...props}>
      <div className="text-center">
        <LoadingSpinner size={spinnerSize} />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
