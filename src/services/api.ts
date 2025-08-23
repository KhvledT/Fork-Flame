/**
 * API Service Layer for Fork & Flame Restaurant Website
 * Uses Axios for HTTP requests with React Query integration
 */

import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from '../utils/constants.ts';
import type { FoodItem } from '../types/index.ts';

// Re-export FoodItem for backward compatibility
export type { FoodItem } from '../types/index.ts';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${String(config.method)?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ API Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for logging
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config?.url}`);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('❌ API Response Error:', error);
    }
    return Promise.reject(error);
  }
);

/**
 * Fetch all food items - aggregates from multiple category endpoints
 */
export const getAllFoods = async (): Promise<FoodItem[]> => {
  console.log('Fetching all foods by aggregating categories...');
  
  try {
    // Fetch from multiple working endpoints and combine
    const [burgers, pizzas, desserts, drinks, bbqs, sandwiches, steaks] = await Promise.allSettled([
      apiClient.get(API_CONFIG.ENDPOINTS.BURGERS),
      apiClient.get(API_CONFIG.ENDPOINTS.PIZZAS),
      apiClient.get(API_CONFIG.ENDPOINTS.DESSERTS),
      apiClient.get(API_CONFIG.ENDPOINTS.DRINKS),
      apiClient.get(API_CONFIG.ENDPOINTS.BBQS),
      apiClient.get(API_CONFIG.ENDPOINTS.SANDWICHES),
      apiClient.get(API_CONFIG.ENDPOINTS.STEAKS)
    ]);

    // Combine successful responses
    const allFoods: FoodItem[] = [];
    const seenIds = new Set<string>(); // Track seen IDs to avoid duplicates
    const categories = ['burgers', 'pizzas', 'desserts', 'drinks', 'bbqs', 'sandwiches', 'steaks'];
    
    [burgers, pizzas, desserts, drinks, bbqs, sandwiches, steaks].forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value?.data) {
        // Add category info and ensure unique IDs
        const categoryData: FoodItem[] = result.value.data.map((item: any) => ({
          ...item,
          category: categories[index],
          // Create unique ID by combining original ID with category
          uniqueId: `${item.id}-${categories[index]}`
        }));
        
        // Only add items with unique IDs
        categoryData.forEach(item => {
          if (item.uniqueId && !seenIds.has(item.uniqueId)) {
            seenIds.add(item.uniqueId);
            allFoods.push(item);
          }
        });
      } else if (result.status === 'rejected') {
        console.warn(`Failed to fetch category ${index}:`, result.reason);
      }
    });

    console.log('All foods aggregated response (unique):', allFoods);
    return allFoods;
  } catch (error) {
    console.error('Error aggregating all foods:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Fetch best food items - returns data directly from backend
 */
export const getBestFoods = async (): Promise<FoodItem[]> => {
  console.log('Fetching best foods from:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BEST_FOODS}`);
  
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.BEST_FOODS);
    console.log('Best foods response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching best foods:', error);
    // Return empty array as fallback
    return [];
  }
};

/**
 * Fetch food items by category
 */
export const getFoodsByCategory = async (category: string): Promise<FoodItem[]> => {
  try {
    const key = category.toUpperCase() as keyof typeof API_CONFIG.ENDPOINTS;
    const endpoint = API_CONFIG.ENDPOINTS[key];
    if (!endpoint) {
      throw new Error(`Invalid category: ${category}`);
    }
    
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${category}:`, error);
    throw error;
  }
};

/**
 * Fetch specific food categories
 */
export const getBurgers = (): Promise<FoodItem[]> => getFoodsByCategory('burgers');
export const getPizzas = (): Promise<FoodItem[]> => getFoodsByCategory('pizzas');
export const getDesserts = (): Promise<FoodItem[]> => getFoodsByCategory('desserts');
export const getDrinks = (): Promise<FoodItem[]> => getFoodsByCategory('drinks');
export const getIceCream = (): Promise<FoodItem[]> => getFoodsByCategory('ice_cream');
export const getBBQs = (): Promise<FoodItem[]> => getFoodsByCategory('bbqs');
export const getSandwiches = (): Promise<FoodItem[]> => getFoodsByCategory('sandwiches');
export const getSteaks = (): Promise<FoodItem[]> => getFoodsByCategory('steaks');

/**
 * Search food items by name or description
 */
export const searchFoods = (query: string, foods: FoodItem[]): FoodItem[] => {
  if (!query || !foods) return [];
  
  const searchTerm = query.toLowerCase().trim();
  return foods.filter(food => 
    food.name.toLowerCase().includes(searchTerm) ||
    food.dsc.toLowerCase().includes(searchTerm)
  );
};

/**
 * Filter food items by price range
 */
export const filterFoodsByPrice = (foods: FoodItem[], minPrice: number = 0, maxPrice: number = Infinity): FoodItem[] => {
  return foods.filter(food => 
    food.price >= minPrice && food.price <= maxPrice
  );
};

/**
 * Filter food items by rating
 */
export const filterFoodsByRating = (foods: FoodItem[], minRating: number = 0): FoodItem[] => {
  return foods.filter(food => food.rate >= minRating);
};

/**
 * Sort food items by various criteria
 */
export const sortFoods = (foods: FoodItem[], sortBy: string = 'name', order: 'asc' | 'desc' = 'asc'): FoodItem[] => {
  const sortedFoods = [...foods];
  
  sortedFoods.sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'price':
        aValue = a.price;
        bValue = b.price;
        break;
      case 'rating':
        aValue = a.rate;
        bValue = b.rate;
        break;
      case 'name':
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
    }
    
    if (order === 'desc') {
      return aValue < bValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });
  
  return sortedFoods;
};

export default apiClient;
