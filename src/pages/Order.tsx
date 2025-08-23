/**
 * Order Page Component
 * Final checkout page showing user's selected items and purchase options
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button.tsx';
import type { FoodItem, CartItem } from '../types/index.ts';
import PageHero from '../components/ui/PageHero.tsx';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

type OrderStep = 'review' | 'processing' | 'success' | 'error';

const Order: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orderStep, setOrderStep] = useState<OrderStep>('review');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const navigate = useNavigate();

  // Load cart data from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('checkoutCart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          setCart(parsedCart);
        } else {
          // Invalid cart data - redirect back to menu
          handleInvalidCart();
        }
      } else {
        // No cart data - redirect back to menu
        handleInvalidCart();
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading cart:', error);
      handleInvalidCart();
    }
  }, []);

  // Handle invalid cart scenarios
  const handleInvalidCart = () => {
    alert('Your cart is empty or invalid. Please add items from the menu first.');
    navigate('/menu');
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!customerInfo.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!customerInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!customerInfo.address.trim()) {
      errors.address = 'Delivery address is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Calculate totals
  const getSubtotal = (): number => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = (): number => {
    return getSubtotal() > 50 ? 0 : 5.99;
  };

  const getTax = (): number => {
    return getSubtotal() * 0.08; // 8% tax
  };

  const getTotal = (): number => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };

  // Handle order submission
  const handleSubmitOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setOrderStep('processing');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      setOrderStep('success');
      
      // Clear cart from localStorage
      localStorage.removeItem('checkoutCart');
      
      // Auto-redirect after 5 seconds
      setTimeout(() => {
        navigate('/menu');
      }, 5000);
      
    } catch (error) {
      console.error('Order submission error:', error);
      setOrderStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    if (window.confirm('Are you sure you want to go back? Your cart will be preserved.')) {
      navigate('/menu');
    }
  };

  // Handle refresh/back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (orderStep === 'review' && cart.length > 0) {
        e.preventDefault();
        e.returnValue = 'You have items in your cart. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [orderStep, cart]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Loading Your Order</h2>
          <p className="text-gray-600 dark:text-gray-400">Please wait while we prepare your checkout...</p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (orderStep === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full"
        >
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Order Failed</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Sorry, we couldn't process your order. Please try again.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => setOrderStep('review')}
              size="lg"
              className="w-full"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToMenu}
              size="sm"
              className="w-full"
            >
              Back to Menu
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (orderStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 1, repeat: 2 }}
            className="text-8xl mb-6"
          >
            🎉
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 text-green-600">Order Confirmed!</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Thank you for your order! We're preparing your delicious meal with love and care.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
            You'll receive a confirmation email shortly with order details.
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-600">
            Redirecting to menu in 5 seconds...
          </p>
        </motion.div>
      </div>
    );
  }

  // Processing state
  if (orderStep === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-6"
          >
            🔄
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Processing Your Order</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we confirm your order...
          </p>
        </motion.div>
      </div>
    );
  }

  // Main checkout form
  return (
    <div className=" bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <PageHero
        title="Checkout"
        subtitle="Review your order and complete your purchase"
      />

      {/* Main Content */}
      <div className="container-custom py-12 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Order Summary</h2>
            
            {/* Cart Items */}
            <div className="space-y-4 mb-8">
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                      {item.name}
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary text-lg">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 border-t border-gray-200 dark:border-gray-600 pt-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Delivery Fee:</span>
                <span className="font-semibold">
                  {getDeliveryFee() === 0 ? 'Free' : `$${getDeliveryFee().toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Tax (8%):</span>
                <span className="font-semibold">${getTax().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-primary border-t border-gray-200 dark:border-gray-600 pt-3">
                <span>Total:</span>
                <span>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </motion.div>

          {/* Customer Information Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/50"
          >
            <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Customer Information</h2>
            
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                    formErrors.name 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary`}
                  placeholder="Enter your full name"
                />
                {formErrors.name && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                    formErrors.email 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary`}
                  placeholder="Enter your email address"
                />
                {formErrors.email && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                    formErrors.phone 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary`}
                  placeholder="Enter your phone number"
                />
                {formErrors.phone && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.phone}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Delivery Address *
                </label>
                <textarea
                  name="address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                    formErrors.address 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary`}
                  placeholder="Enter your delivery address"
                />
                {formErrors.address && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.address}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Special Notes
                </label>
                <textarea
                  name="notes"
                  value={customerInfo.notes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                  placeholder="Any special requests or dietary requirements..."
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-6">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Processing...' : `Place Order - $${getTotal().toFixed(2)}`}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToMenu}
                  size="lg"
                  className="w-full border-2 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-300 rounded-2xl"
                >
                  ← Back to Menu
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Order;
