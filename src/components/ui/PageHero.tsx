/**
 * Reusable Page Hero Component
 * Standardizes hero sections with gradient background, overlay, motion, and optional subtitle
 */

import React from 'react';
import { motion } from 'framer-motion';

type Align = 'center' | 'left' | 'right';

interface PageHeroProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  heightClassName?: string; // e.g., 'h-48 lg:h-96'
  gradientClassName?: string; // override bg gradient
  align?: Align;
  className?: string;
  contentClassName?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
  title,
  highlight,
  subtitle,
  heightClassName = 'h-48 lg:h-96',
  gradientClassName = 'bg-gradient-to-r from-primary to-secondary',
  align = 'center',
  className = '',
  contentClassName = '',
}) => {
  const alignmentClasses = {
    center: 'text-center items-center justify-center',
    left: 'text-left items-center justify-start',
    right: 'text-right items-center justify-end',
  }[align];

  return (
    <section className={`relative ${heightClassName} flex ${alignmentClasses} overflow-hidden ${gradientClassName} ${className}`}>
      <div className="absolute inset-0 bg-black/20" />
      <div className={`relative z-10 px-6 w-full ${alignmentClasses} ${contentClassName}`}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-6xl font-bold mb-3 md:mb-4">
            {title} {highlight && (<span className="text-yellow-300">{highlight}</span>)}
          </h1>
          {subtitle && (
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default PageHero;


