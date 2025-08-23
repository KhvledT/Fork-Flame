/**
 * Preloader Component
 * Shows a simple loading screen that automatically hides after 2 seconds
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete?: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Shorter preloader for reduced motion users
    const delay = prefersReducedMotion ? 300 : 2000;
    const timer = setTimeout(() => {
      onComplete?.();
    }, delay);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-background-light dark:bg-background-dark z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center max-w-md mx-auto px-6">
          {/* Logo/Brand */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="text-6xl mb-4">🍴</div>
            <h1 className="text-4xl font-bold text-gradient mb-2">
              Fork & Flame
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Culinary Excellence Awaits
            </p>
          </motion.div>

          {/* Simple Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="w-3 h-3 bg-primary rounded-full"
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
          </motion.div>

          {/* Loading Text */}
          <motion.p
            className="mt-8 text-gray-500 dark:text-gray-400 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            Loading...
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;
