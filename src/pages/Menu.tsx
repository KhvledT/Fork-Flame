/**
 * Menu Page Component
 * Displays all food items with filtering, searching, and cart functionality
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllFoodsWithValidation } from '../hooks/useMenuData.ts';
import { FoodCard, FoodCardCompact } from '../components/ui/Card.tsx';
import { FoodGridSkeleton } from '../components/ui/SkeletonLoader.tsx';
import Button from '../components/ui/Button.tsx';
import PageHero from '../components/ui/PageHero.tsx';
import type { FoodItem, CartItem } from '../types/index.ts';

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayCount, setDisplayCount] = useState(20);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);
  const [cacheExpiration, setCacheExpiration] = useState(0);
  
  const navigate = useNavigate();
  const { data: allFoods = [], isLoading, error, isValidating, validationProgress, validCount, totalCount, hasValidated, clearCacheAndRevalidate } = useAllFoodsWithValidation();

  // Food categories
  const categories = [
    { id: 'all', label: 'All Foods', icon: '🍽️' },
    { id: 'burgers', label: 'Burgers', icon: '🍔' },
    { id: 'pizzas', label: 'Pizzas', icon: '🍕' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
    { id: 'drinks', label: 'Drinks', icon: '🥤' },
    { id: 'steaks', label: 'Steaks', icon: '🥩' },
    { id: 'bbqs', label: 'BBQ', icon: '🔥' }
  ];

  // Filter foods based on search and category
  const filteredFoods = allFoods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         food.dsc.toLowerCase().includes(searchQuery.toLowerCase());
    
    // If "all" is selected, only apply search filter
    if (selectedCategory === 'all') {
      return matchesSearch;
    }
    
    // Category matching based on food name/description
    const categoryMatch = food.name.toLowerCase().includes(selectedCategory.slice(0, -1)) ||
                         food.dsc.toLowerCase().includes(selectedCategory.slice(0, -1));
    
    return matchesSearch && categoryMatch;
  });

  // Pagination logic
  const displayedFoods = filteredFoods.slice(0, displayCount);
  const hasMoreFoods = displayCount < filteredFoods.length;

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 20);
  };

  // Reset display count when filters change
  useEffect(() => {
    setDisplayCount(20);
  }, [selectedCategory, searchQuery]);

  // Update cache expiration time
  useEffect(() => {
    if (hasValidated) {
      const updateExpiration = () => {
        const cachedValidation = localStorage.getItem('forkFlameImageValidation');
        if (cachedValidation) {
          try {
            const { timestamp } = JSON.parse(cachedValidation);
            const expirationTime = timestamp + (24 * 60 * 60 * 1000); // 24 hours
            const timeLeft = expirationTime - Date.now();
            setCacheExpiration(Math.max(0, timeLeft));
          } catch (error) {
            setCacheExpiration(0);
          }
        } else {
          setCacheExpiration(0);
        }
      };
      
      updateExpiration();
      const interval = setInterval(updateExpiration, 60000); // Update every minute
      
      return () => clearInterval(interval);
    }
  }, [hasValidated]);

  // Cart functions
  const addToCart = (food: FoodItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === food.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === food.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...(food as FoodItem), quantity: 1 }];
    });
    setIsCartOpen(true);
    // Also open mobile cart if on mobile
    if (window.innerWidth < 1024) {
      setIsMobileCartOpen(true);
    }
  };

  const removeFromCart = (foodId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== foodId));
  };

  const updateQuantity = (foodId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(foodId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === foodId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setIsCartOpen(false);
    setIsMobileCartOpen(false);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Handle Buy Now - redirect to Order page with cart data
  const handleBuyNow = () => {
    if (cart.length === 0) {
      alert('Please add some items to your cart first!');
      return;
    }
    
    // Store cart data in localStorage to pass to Order page
    localStorage.setItem('checkoutCart', JSON.stringify(cart));
    navigate('/order');
  };

  // Toggle mobile cart
  const toggleMobileCart = () => {
    setIsMobileCartOpen(!isMobileCartOpen);
  };

  // Quick open cart for both mobile and desktop
  const openCartQuick = () => {
    if (window.innerWidth < 1024) {
      setIsMobileCartOpen(true);
    } else {
      setIsCartOpen(true);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Menu</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sorry, we couldn't load the menu. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHero
        title="Our"
        highlight="Menu"
        subtitle="Discover our delicious selection of carefully crafted dishes"
      />

             {/* Mobile Cart Toggle Button - Fixed Position */}
       <div className="lg:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))] z-50">
         <button
           onClick={toggleMobileCart}
           className="relative bg-primary text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
         >
           🛒
           {getCartItemCount() > 0 && (
             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
               {getCartItemCount()}
             </span>
           )}
         </button>
       </div>

             {/* Main Content */}
       <div className="container-custom py-12 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-3">
            
                         {/* Search and Filter Bar */}
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 sticky top-20 z-20">
              
               <div className="flex flex-col gap-4">
                 {/* Search Bar */}
                 <div className="w-full">
                   <div className="relative">
                     <input
                       type="text"
                       placeholder="Search for dishes..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-[16px]"
                     />
                     <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                       🔍
                     </div>
                     <button
                       type="button"
                       onClick={openCartQuick}
                       aria-label="Open cart"
                       className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow-sm"
                     >
                       <span className="relative">
                         🛒
                         {getCartItemCount() > 0 && (
                           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">
                             {getCartItemCount()}
                           </span>
                         )}
                       </span>
                     </button>
                   </div>
                 </div>

                 {/* Category Filter */}
                 <div className="flex flex-wrap gap-2">
                   {categories.map((category) => (
                     <Button
                       key={category.id}
                       variant={selectedCategory === category.id ? 'primary' : 'secondary'}
                       size="sm"
                       onClick={() => setSelectedCategory(category.id)}
                       className="flex items-center gap-2"
                     >
                       <span>{category.icon}</span>
                       {category.label}
                     </Button>
                   ))}
                 </div>
               </div>
             </div>

                         {/* Results Count */}
             <div className="mb-6">
               <div className="flex items-center justify-between">
                 <p className="text-gray-600 dark:text-gray-400">
                   {isValidating ? (
                     <div className="space-y-2">
                       <span className="flex items-center gap-2">
                         <span className="animate-spin">🔄</span>
                         Validating images... {Math.round(validationProgress)}% ({validCount} of {totalCount} validated)
                       </span>
                       <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                         <div 
                           className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                           style={{ width: `${validationProgress}%` }}
                         ></div>
                       </div>
                     </div>
                   ) : (
                     <>
                       Showing {displayedFoods.length} of {filteredFoods.length} results
                       {totalCount > 0 && (
                         <span className="ml-2 text-sm text-gray-500">
                           ({validCount} of {totalCount} images validated)
                         </span>
                       )}
                     </>
                   )}
                 </p>
                 
                 {/* Cache Status and Refresh Button */}
                 {!isValidating && hasValidated && (
                   <div className="flex items-center gap-3">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={clearCacheAndRevalidate}
                       className="text-xs px-3 py-1"
                     >
                       🔄 Refresh
                     </Button>
                   </div>
                 )}
               </div>
             </div>

            {/* Menu Items */}
            <div>
              {isLoading || isValidating ? (
                <FoodGridSkeleton count={12} />
              ) : filteredFoods.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-2xl font-semibold mb-4">No dishes found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Try adjusting your search or category filter.
                  </p>
                  {totalCount > 0 && validCount === 0 && (
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Note: {totalCount - validCount} items were skipped due to broken images.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {displayedFoods.map((food, index) => (
                    <div
                      key={food.uniqueId || food.id}
                      className="group"
                    >
                      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col justify-between overflow-hidden hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                        <div className="block md:hidden p-3">
                          <FoodCardCompact food={food} />
                        </div>
                        <div className="hidden md:block">
                          <FoodCard food={food} />
                        </div>
                        <div className="p-3 md:p-4 border-t border-gray-100 dark:border-gray-700 min-h-fit">
                          <Button
                            onClick={() => addToCart(food)}
                            size="sm"
                            className="w-full"
                          >
                            🛒 Add to Cart - ${food.price}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Show More Button */}
              {hasMoreFoods && (
                <div className="text-center mt-12">
                  <Button
                    onClick={handleShowMore}
                    size="lg"
                    variant="outline"
                    className="px-8 py-3 text-lg"
                  >
                    Show More ({filteredFoods.length - displayCount} remaining)
                  </Button>
                </div>
              )}

              {/* No More Products Message */}
              {!hasMoreFoods && filteredFoods.length > 0 && (
                <div className="text-center mt-12 py-8">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    🎉 You've seen all {filteredFoods.length} products!
                  </p>
                </div>
              )}
            </div>
          </div>

                     {/* Desktop Cart Sidebar */}
           <div className="hidden lg:block lg:col-span-1">
             <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24 z-10">
              {/* Cart Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Your Cart
                </h2>
                <div className="relative">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className="relative"
                  >
                    🛒
                    {getCartItemCount() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getCartItemCount()}
                      </span>
                    )}
                  </Button>
                </div>
              </div>

              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🛒</div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Add some delicious dishes to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"
                    >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              ${item.price}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 p-0"
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 p-0"
                            >
                              +
                            </Button>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    ))}

                    {/* Cart Total */}
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">Total:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${getCartTotal().toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={handleBuyNow}
                          size="lg"
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          🚀 Buy Now
                        </Button>
                        <Button
                          variant="outline"
                          onClick={clearCart}
                          size="sm"
                          className="w-full"
                        >
                          🗑️ Clear Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cart Overlay */}
      {isMobileCartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileCartOpen(false)}
          />
          
          {/* Mobile Cart Panel */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-800 shadow-2xl z-50 lg:hidden overflow-hidden pb-[env(safe-area-inset-bottom)] pr-[env(safe-area-inset-right)]">
              {/* Mobile Cart Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary to-secondary text-white">
                <h2 className="text-xl font-bold">Your Cart</h2>
                <button
                  onClick={() => setIsMobileCartOpen(false)}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors duration-300"
                >
                  ✕
                </button>
              </div>

              {/* Mobile Cart Content */}
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🛒</div>
                      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Your cart is empty
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400">
                        Add some delicious dishes to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4"
                        >
                            <div className="flex items-center gap-3">
                              <img
                                src={item.img}
                                alt={item.name}
                                className="w-16 h-16 rounded-xl object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-gray-900 dark:text-white truncate text-lg">
                                  {item.name}
                                </h4>
                                <p className="text-lg font-bold text-primary">
                                  ${item.price}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-4">
                              <div className="flex items-center gap-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-10 h-10 p-0 rounded-xl border-2 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                  -
                                </Button>
                                <span className="w-12 text-center font-bold text-lg">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-10 h-10 p-0 rounded-xl border-2 hover:border-primary hover:bg-primary hover:text-white transition-all duration-300"
                                >
                                  +
                                </Button>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 border-red-200 hover:border-red-300 transition-all duration-300"
                              >
                                🗑️
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Mobile Cart Footer */}
                  {cart.length > 0 && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-700">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Total:</span>
                        <span className="text-2xl font-bold text-primary">
                          ${getCartTotal().toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="space-y-3">
                        <Button
                          onClick={handleBuyNow}
                          size="lg"
                          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-4 text-lg font-semibold"
                        >
                          🚀 Buy Now
                        </Button>
                        <Button
                          variant="outline"
                          onClick={clearCart}
                          size="sm"
                          className="w-full border-2 hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-700 transition-all duration-300 rounded-xl"
                        >
                          🗑️ Clear Cart
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      );
    };

    export default Menu;
