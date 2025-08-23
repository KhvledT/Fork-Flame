/**
 * Custom hook for managing menu data with React Query
 * Provides data fetching, caching, and state management for food items
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getAllFoods,
  getBestFoods,
  getFoodsByCategory,
  searchFoods,
  filterFoodsByPrice,
  filterFoodsByRating,
  sortFoods
} from '../services/api.ts';
import type { FoodItem } from '../types/index.ts';
import { useImageValidation } from './useImageValidation.ts';

// Hook return type interfaces
interface UseAllFoodsWithValidationReturn {
  data: FoodItem[];
  isLoading: boolean;
  error: any;
  isValidating: boolean;
  validationProgress: number;
  originalData: FoodItem[] | undefined;
  validCount: number;
  totalCount: number;
  hasValidated: boolean;
  clearCacheAndRevalidate: () => void;
}

interface UseFilteredMenuDataOptions {
  category?: string | null;
  searchQuery?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseFilteredMenuDataReturn {
  foods: FoodItem[];
  allFoods: FoodItem[];
  isLoading: boolean;
  error: any;
  isError: boolean;
  totalCount: number;
  originalCount: number;
}

interface UseMenuSearchReturn {
  searchResults: FoodItem[];
  isSearching: boolean;
  hasResults: boolean;
}

interface UseMenuPaginationReturn {
  currentFoods: FoodItem[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  setItemsPerPage: (count: number) => void;
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

/**
 * Hook for fetching all food items
 */
export const useAllFoods = () => {
  const result = useQuery({
    queryKey: ['allFoods'],
    queryFn: getAllFoods,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Debug logging
  console.log('useAllFoods hook result:', {
    isLoading: result.isLoading,
    isError: result.isError,
    data: result.data,
    error: result.error
  });

  return result;
};

/**
 * Hook for fetching all food items with image validation
 */
export const useAllFoodsWithValidation = (): UseAllFoodsWithValidationReturn => {
  const isMobile = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
  const { checkImageUrl } = useImageValidation(isMobile ? 1200 : 2000);
  // Initialize state with cached data if available
  const [validatedFoods, setValidatedFoods] = useState<FoodItem[]>(() => {
    try {
      const cachedValidation = localStorage.getItem('forkFlameImageValidation');
      if (cachedValidation) {
        const { foods, timestamp } = JSON.parse(cachedValidation);
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours
        
        if (!isExpired && foods && foods.length > 0) {
          return foods;
        } else if (isExpired) {
          localStorage.removeItem('forkFlameImageValidation');
        }
      }
    } catch (error) {
      console.warn('Failed to parse cached validation:', error);
      localStorage.removeItem('forkFlameImageValidation');
    }
    return [];
  });
  
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationProgress, setValidationProgress] = useState<number>(0);
  const [hasValidated, setHasValidated] = useState<boolean>(() => {
    try {
      const cachedValidation = localStorage.getItem('forkFlameImageValidation');
      if (cachedValidation) {
        const { timestamp } = JSON.parse(cachedValidation);
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours
        return !isExpired;
      }
    } catch (error) {
      return false;
    }
    return false;
  });
  
  const result = useQuery({
    queryKey: ['allFoods'],
    queryFn: getAllFoods,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: validatedFoods.length === 0, // Only fetch if we don't have cached data
  });

  // Image validation effect - only run once
  useEffect(() => {
    if (result.data && result.data.length > 0 && !hasValidated && validatedFoods.length === 0) {
      // Network-aware early exit: skip validation on constrained mobile networks
      const connection: any = (navigator as any)?.connection;
      const saveData: boolean = !!connection?.saveData;
      const effectiveType: string = connection?.effectiveType || '';
      const isSlow = /(^|-)2g$/.test(effectiveType);

      if (isMobile && (saveData || isSlow)) {
        setHasValidated(true);
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      validateImages(result.data);
      setHasValidated(true);
    }
  }, [result.data, hasValidated, validatedFoods.length]);

  // Function to validate images - optimized for speed with progress
  const validateImages = async (foods: FoodItem[]): Promise<void> => {
    setValidationProgress(0);
    
    // Validate only a subset up front (visible items + buffer), reorder instead of filtering
    const batchSize = isMobile ? 10 : 50;
    const validateLimit = Math.min(foods.length, isMobile ? 30 : 80);
    const toValidate = foods.slice(0, validateLimit);
    const remaining = foods.slice(validateLimit);
    const validFirst: FoodItem[] = [];
    const invalidWithinValidated: FoodItem[] = [];
    
    for (let i = 0; i < toValidate.length; i += batchSize) {
      const batch = toValidate.slice(i, i + batchSize);
      
      // Process batch in parallel
      const batchPromises = batch.map(async (food) => {
        try {
          const isValid = await checkImageUrl(food.img);
          return { food, isValid } as const;
        } catch (error) {
          console.warn(`Image validation failed for ${food.name}:`, error);
          return { food, isValid: false } as const;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ food, isValid }) => {
        if (isValid) validFirst.push(food);
        else invalidWithinValidated.push(food);
      });
      
      // Update progress after each batch
      const progress = Math.min(((i + batchSize) / toValidate.length) * 100, 100);
      setValidationProgress(progress);

      // Yield to the main thread on mobile to keep UI responsive
      if (isMobile) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
    
    // Do not drop items; reorder so valid ones appear first, then the rest
    const reordered: FoodItem[] = [...validFirst, ...invalidWithinValidated, ...remaining];
    setValidatedFoods(reordered);
    setIsValidating(false);
    setValidationProgress(100);
    
    // Cache the validation results
    try {
      const cacheData = {
        foods: validatedFoods,
        timestamp: Date.now()
      };
      localStorage.setItem('forkFlameImageValidation', JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache validation results:', error);
    }
  };

  // Function to clear cache and re-validate
  const clearCacheAndRevalidate = useCallback(() => {
    localStorage.removeItem('forkFlameImageValidation');
    setHasValidated(false);
    setValidatedFoods([]);
    setValidationProgress(0);
    if (result.data && result.data.length > 0) {
      setIsValidating(true);
      validateImages(result.data);
    }
  }, [result.data]);

  // Prefer validated data when available; otherwise fall back to original data so UI is not blocked
  const finalData = validatedFoods.length > 0 ? validatedFoods : (result.data || []);
  // If we validated only a subset and re-ordered, ensure duplicates are removed by uniqueId or id
  const deduped = (() => {
    const seen = new Set<string>();
    const out: FoodItem[] = [];
    for (const f of finalData) {
      const key = (f as any).uniqueId || f.id;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(f);
      }
    }
    return out;
  })();

  return {
    ...result,
    data: deduped,
    isValidating,
    validationProgress,
    originalData: result.data,
    validCount: validatedFoods.length,
    totalCount: result.data?.length || 0,
    hasValidated,
    clearCacheAndRevalidate
  };
};

/**
 * Hook for fetching best food items with image validation
 */
export const useBestFoods = () => {
  const { checkImageUrl } = useImageValidation(2000);

  const [validatedBestFoods, setValidatedBestFoods] = useState<FoodItem[]>(() => {
    try {
      const cachedValidation = localStorage.getItem('forkFlameBestFoodsValidation');
      if (cachedValidation) {
        const { foods, timestamp } = JSON.parse(cachedValidation);
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours
        
        if (!isExpired && foods && foods.length > 0) {
          return foods;
        } else if (isExpired) {
          localStorage.removeItem('forkFlameBestFoodsValidation');
        }
      }
    } catch (error) {
      console.warn('Failed to parse cached best foods validation:', error);
      localStorage.removeItem('forkFlameBestFoodsValidation');
    }
    return [];
  });
  
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [hasValidated, setHasValidated] = useState<boolean>(() => {
    try {
      const cachedValidation = localStorage.getItem('forkFlameBestFoodsValidation');
      if (cachedValidation) {
        const { timestamp } = JSON.parse(cachedValidation);
        const isExpired = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours
        return !isExpired;
      }
    } catch (error) {
      return false;
    }
    return false;
  });

  // Always fetch data, but use cached validation if available
  const result = useQuery({
    queryKey: ['bestFoods'],
    queryFn: getBestFoods,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Image validation effect - run when we have data and haven't validated yet
  useEffect(() => {
    console.log('useBestFoods validation effect triggered:', {
      hasData: !!result.data,
      dataLength: result.data?.length || 0,
      hasValidated,
      validatedBestFoodsLength: validatedBestFoods.length
    });
    
    if (result.data && result.data.length > 0 && !hasValidated) {
      console.log('Starting validation process...');
      setIsValidating(true);
      validateBestFoodsImages(result.data);
      setHasValidated(true);
    }
  }, [result.data, hasValidated]);

  // Function to validate best foods images
  const validateBestFoodsImages = async (foods: FoodItem[]): Promise<void> => {
    console.log('Starting image validation for best foods...');
    const validatedFoods: FoodItem[] = [];
    
    // Process all best foods in parallel for faster validation
    const validationPromises = foods.map(async (food) => {
      try {
        const isValid = await checkImageUrl(food.img);
        console.log(`Image validation for ${food.name}: ${isValid ? 'VALID' : 'INVALID'}`);
        return isValid ? food : null;
      } catch (error) {
        console.warn(`Image validation failed for ${food.name}:`, error);
        return null;
      }
    });
    
    const validationResults = await Promise.all(validationPromises);
    const validFoods = validationResults.filter(food => food !== null);
    
    console.log(`Image validation complete. Valid: ${validFoods.length}/${foods.length}`);
    
    setValidatedBestFoods(validFoods);
    setIsValidating(false);
    
    // Cache the validation results
    try {
      const cacheData = {
        foods: validFoods,
        timestamp: Date.now()
      };
      localStorage.setItem('forkFlameBestFoodsValidation', JSON.stringify(cacheData));
      console.log('Cached best foods validation results');
    } catch (error) {
      console.warn('Failed to cache best foods validation results:', error);
    }
  };

  // Return validated data if available, otherwise return original data
  const finalData = validatedBestFoods.length > 0 ? validatedBestFoods : (result.data || []);
  const finalLoading = result.isLoading || isValidating;

  console.log('useBestFoods hook state:', {
    originalDataLength: result.data?.length || 0,
    validatedDataLength: validatedBestFoods.length,
    finalDataLength: finalData.length,
    isLoading: result.isLoading,
    isValidating,
    hasValidated,
    originalData: result.data,
    validatedData: validatedBestFoods
  });

  // Function to clear cache and re-validate (for testing)
  const clearCacheAndRevalidate = useCallback(() => {
    console.log('Clearing cache and re-validating...');
    localStorage.removeItem('forkFlameBestFoodsValidation');
    setHasValidated(false);
    setValidatedBestFoods([]);
    if (result.data && result.data.length > 0) {
      setIsValidating(true);
      validateBestFoodsImages(result.data);
    }
  }, [result.data]);

  return {
    data: finalData,
    isLoading: finalLoading,
    error: result.error,
    isValidating,
    hasValidated,
    clearCacheAndRevalidate
  };
};

/**
 * Hook for fetching food items by category
 */
export const useFoodsByCategory = (category: string) => {
  return useQuery({
    queryKey: ['foodsByCategory', category],
    queryFn: () => getFoodsByCategory(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes,
  });
};

/**
 * Hook for fetching specific food categories
 */
export const useBurgers = () => useFoodsByCategory('burgers');
export const usePizzas = () => useFoodsByCategory('pizzas');
export const useDesserts = () => useFoodsByCategory('desserts');
export const useDrinks = () => useFoodsByCategory('drinks');
export const useIceCream = () => useFoodsByCategory('ice_cream');
export const useBBQs = () => useFoodsByCategory('bbqs');
export const useSandwiches = () => useFoodsByCategory('sandwiches');
export const useSteaks = () => useFoodsByCategory('steaks');

/**
 * Hook for managing filtered and sorted menu data
 */
export const useFilteredMenuData = (options: UseFilteredMenuDataOptions = {}): UseFilteredMenuDataReturn => {
  const {
    category = null,
    searchQuery = '',
    minPrice = 0,
    maxPrice = Infinity,
    minRating = 0,
    sortBy = 'name',
    sortOrder = 'asc'
  } = options;

  // Fetch data based on category or use all foods
  const allFoodsQuery = useAllFoods();
  const categoryQuery = category ? useFoodsByCategory(category) : null;
  
  // Determine which query to use
  const activeQuery = categoryQuery || allFoodsQuery;
  const { data: foods = [], isLoading, error, isError } = activeQuery;

  // Apply filters and sorting
  let filteredFoods: FoodItem[] = [...foods];

  // Apply search filter
  if (searchQuery) {
    filteredFoods = searchFoods(searchQuery, filteredFoods);
  }

  // Apply price filter
  if (minPrice > 0 || maxPrice < Infinity) {
    filteredFoods = filterFoodsByPrice(filteredFoods, minPrice, maxPrice);
  }

  // Apply rating filter
  if (minRating > 0) {
    filteredFoods = filterFoodsByRating(filteredFoods, minRating);
  }

  // Apply sorting
  if (sortBy) {
    filteredFoods = sortFoods(filteredFoods, sortBy, sortOrder);
  }

  return {
    foods: filteredFoods,
    allFoods: foods,
    isLoading,
    error,
    isError,
    totalCount: filteredFoods.length,
    originalCount: foods.length
  };
};

/**
 * Hook for managing menu search with debouncing
 */
export const useMenuSearch = (searchQuery: string, foods: FoodItem[] = []): UseMenuSearchReturn => {
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    // Debounce search to avoid excessive API calls
    const timeoutId = setTimeout(() => {
      const results = searchFoods(searchQuery, foods);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, foods]);

  return {
    searchResults,
    isSearching,
    hasResults: searchResults.length > 0
  };
};

/**
 * Hook for managing menu pagination
 */
export const useMenuPagination = (foods: FoodItem[] = [], itemsPerPage: number = 12): UseMenuPaginationReturn => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPageState, setItemsPerPage] = useState<number>(itemsPerPage);

  // Calculate pagination values
  const totalPages = Math.ceil(foods.length / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  const currentFoods = foods.slice(startIndex, endIndex);

  // Navigation functions
  const goToPage = (page: number): void => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = (): void => {
    goToPage(currentPage + 1);
  };

  const goToPreviousPage = (): void => {
    goToPage(currentPage - 1);
  };

  const goToFirstPage = (): void => {
    goToPage(1);
  };

  const goToLastPage = (): void => {
    goToPage(totalPages);
  };

  // Reset to first page when foods change
  useEffect(() => {
    setCurrentPage(1);
  }, [foods.length]);

  return {
    currentFoods,
    currentPage,
    totalPages,
    itemsPerPage: itemsPerPageState,
    setItemsPerPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, foods.length),
    totalItems: foods.length
  };
};

// Removed unused mutation hooks to reduce code surface area
