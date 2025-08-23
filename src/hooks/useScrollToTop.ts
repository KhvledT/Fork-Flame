/**
 * Custom hook to scroll to top on route changes
 * Automatically scrolls to top when navigating between pages
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UseScrollToTopReturn {
  scrollToTop: () => void;
}

const useScrollToTop = (): UseScrollToTopReturn => {
  const { pathname } = useLocation();
  const prevPathname = useRef<string>(pathname);
  const isScrolling = useRef<boolean>(false);

  useEffect(() => {
    if (prevPathname.current !== pathname) {
      // Add a small delay to ensure mobile menu is closed
      const timer = setTimeout(() => {
        if (!isScrolling.current) {
          scrollToTop();
        }
      }, 100);
      
      prevPathname.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  useEffect(() => {
    // Scroll to top on initial load if not at top
    if (window.scrollY > 0) {
      const timer = setTimeout(() => {
        if (!isScrolling.current) {
          scrollToTop();
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, []);

  // Enhanced scroll to top function with mobile compatibility
  const scrollToTop = (): void => {
    if (isScrolling.current) return;
    
    isScrolling.current = true;
    
    try {
      // Check if mobile menu is open (body has fixed position)
      const isMobileMenuOpen = document.body.style.position === 'fixed';
      
      if (isMobileMenuOpen) {
        // Don't scroll if mobile menu is open
        isScrolling.current = false;
        return;
      }

      // Try smooth scrolling first
      if ('scrollBehavior' in document.documentElement.style) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      } else {
        // Fallback for older browsers
        window.scrollTo(0, 0);
      }
    } catch (error) {
      // Fallback for any errors
      try {
        // Alternative method for mobile browsers
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch (fallbackError) {
        // Final fallback
        window.scrollTo(0, 0);
      }
    }

    // Reset scrolling flag after animation
    setTimeout(() => {
      isScrolling.current = false;
    }, 1000);
  };

  return { scrollToTop };
};

export default useScrollToTop;
