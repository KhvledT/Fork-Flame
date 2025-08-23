/**
 * Reusable Button Component
 * Supports different variants, sizes, and states
 */

import type { ReactNode, FC, ComponentProps } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';
type IconPosition = 'left' | 'right';

type MotionButtonProps = ComponentProps<typeof motion.button>;

type ButtonOwnProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: IconPosition;
};

type ButtonProps = Omit<MotionButtonProps, keyof ButtonOwnProps | 'children'> & ButtonOwnProps;

const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  ...props
}) => {
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant classes
  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary text-white focus:ring-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-gradient-to-r from-surface-lightSecondary to-surface-lightTertiary hover:from-surface-lightTertiary hover:to-surface-lightSecondary text-text-light focus:ring-primary dark:from-surface-darkSecondary dark:to-surface-darkTertiary dark:hover:from-surface-darkTertiary dark:hover:to-surface-darkSecondary dark:text-text-dark border border-surface-lightBorder dark:border-surface-darkBorder',
    outline: 'border-2 border-primary text-primary hover:bg-gradient-to-r hover:from-primary hover:to-primary-light hover:text-white focus:ring-primary hover:-translate-y-0.5',
    ghost: 'text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 focus:ring-primary',
    danger: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white focus:ring-red-500 shadow-lg hover:shadow-xl',
    success: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl',
    white: 'border-2 border-white text-white hover:bg-white hover:text-primary focus:ring-white shadow-lg hover:shadow-xl hover:-translate-y-0.5'
  };
  
  // Size classes
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm',
    md: 'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base',
    lg: 'px-5 py-3 text-base sm:px-8 sm:py-4 sm:text-lg',
    xl: 'px-6 py-4 text-lg sm:px-10 sm:py-5 sm:text-xl'
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${className}`;
  
  // Icon classes
  const iconClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };
  
  // Loading spinner
  const LoadingSpinner = () => (
    <motion.div
      className={`${iconClasses[size]} border-2 border-current border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
  
  // Icon component
  const IconComponent = () => {
    if (loading) return <LoadingSpinner />;
    if (icon) return <span className={iconClasses[size]}>{icon}</span>;
    return null;
  };
  
  // Content with icon positioning
  const renderContent = () => {
    if (iconPosition === 'right') {
      return (
        <>
          {children}
          <IconComponent />
        </>
      );
    }
    
    return (
      <>
        <IconComponent />
        {children}
      </>
    );
  };
  
  return (
    <motion.button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {renderContent()}
    </motion.button>
  );
};

export default Button;
