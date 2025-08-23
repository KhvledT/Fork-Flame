/**
 * Constants for Fork & Flame Restaurant Website
 */

// API Configuration
export const API_CONFIG: {
  BASE_URL: string;
  ENDPOINTS: {
    BEST_FOODS: string;
    BURGERS: string;
    PIZZAS: string;
    DESSERTS: string;
    DRINKS: string;
    ICE_CREAM: string;
    BBQS: string;
    SANDWICHES: string;
    STEAKS: string;
  };
} = {
  BASE_URL: (import.meta.env.VITE_API_BASE_URL?.trim() || 'https://free-food-menus-api-two.vercel.app'),
  ENDPOINTS: {
    BEST_FOODS: '/best-foods',
    BURGERS: '/burgers',
    PIZZAS: '/pizzas',
    DESSERTS: '/desserts',
    DRINKS: '/drinks',
    ICE_CREAM: '/ice-cream',
    BBQS: '/bbqs',
    SANDWICHES: '/sandwiches',
    STEAKS: '/steaks'
  }
};

// Local Storage Keys
export const STORAGE_KEYS: {
  FIRST_VISIT: string;
  THEME: string;
  CART: string;
} = {
  FIRST_VISIT: 'forkFlame_firstVisit',
  THEME: 'forkFlame_theme',
  CART: 'forkFlame_cart'
};

// Theme Configuration
export const THEMES: {
  LIGHT: string;
  DARK: string;
} = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Route Configuration
export const ROUTES: {
  HOME: string;
  MENU: string;
  ABOUT: string;
  ORDER: string;
  CONTACT: string;
  REVIEWS: string;
} = {
  HOME: '/',
  MENU: '/menu',
  ABOUT: '/about',
  ORDER: '/order',
  CONTACT: '/contact',
  REVIEWS: '/reviews'
};

// Animation Durations
export const ANIMATION_DURATIONS: {
  FAST: number;
  NORMAL: number;
  SLOW: number;
  VERY_SLOW: number;
} = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 800
};

// Breakpoints
export const BREAKPOINTS: {
  SM: number;
  MD: number;
  LG: number;
  XL: number;
  '2XL': number;
} = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};
