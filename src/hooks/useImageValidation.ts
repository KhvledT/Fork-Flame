/**
 * useImageValidation
 * Provides reusable image URL validation helpers.
 */

import { useMemo } from 'react';

export const useImageValidation = (timeoutMs: number = 2000) => {
  const checkImageUrl = useMemo(() => {
    return (url: string): Promise<boolean> => {
      return new Promise((resolve) => {
        if (!url) {
          resolve(false);
          return;
        }

        const img = new Image();
        const timeout = setTimeout(() => {
          resolve(false);
        }, timeoutMs);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };

        img.src = url;
      });
    };
  }, [timeoutMs]);

  return { checkImageUrl };
};

export default useImageValidation;


