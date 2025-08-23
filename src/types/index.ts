/**
 * Type definitions for Fork & Flame Restaurant Website
 */

// Food item interface
export interface FoodItem {
  id: string;
  img: string;
  name: string;
  dsc: string;
  price: number;
  rate: number;
  country: string;
  category?: string;
  uniqueId?: string;
}

// Cart item extends FoodItem with quantity
export interface CartItem extends FoodItem {
  quantity: number;
}
