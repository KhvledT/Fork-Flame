/**
 * Home Page Component
 * Landing page with hero section, featured dishes, and restaurant highlights
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants.ts';
import { useBestFoods } from '../hooks/useMenuData.ts';
import Button from '../components/ui/Button.tsx';
import Card, { FoodCard } from '../components/ui/Card.tsx';
import { FoodGridSkeleton, FoodCardSkeleton } from '../components/ui/SkeletonLoader.tsx';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: bestFoods = [], isLoading: isLoadingBestFoods, error, isValidating, hasValidated, clearCacheAndRevalidate } = useBestFoods();

  // Hero section background images - verified working restaurant and food images
  const heroImages: string[] = [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1504674900240-8947e31be7f6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1540189549326-4e736c142984?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative hero-section flex items-center justify-center overflow-hidden">
        {/* Background Image Slider - CSS Infinite Loop */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="flex h-full animate-scroll"
            style={{
              width: `${heroImages.length * 2 * 100}vw`
            }}
          >
            {/* Duplicate images for seamless loop */}
            {[...heroImages, ...heroImages].map((image, index) => (
              <div
                key={index}
                className="relative w-screen h-full flex-shrink-0"
                style={{
                  transform: 'rotate(-45deg) scale(1.5)',
                  transformOrigin: 'center'
                }}
              >
                <img
                  src={image}
                  alt={`Hero background ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="eager"
                  decoding="async"
                  sizes="100vw"
                  onError={(e) => {
                    // Fallback to a default image if the current one fails
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop';
                  }}
                />
                <div className="absolute inset-0 bg-black/70" />
              </div>
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-7xl font-bold mb-5 md:mb-6">
              Welcome to{' '}
              <span className="text-gradient">Fork & Flame</span>
            </h1>
            <p className="text-lg md:text-2xl mb-6 md:mb-8 text-gray-200 leading-relaxed">
              Experience culinary excellence with our carefully crafted dishes, 
              made with the finest ingredients and passion for food.
            </p>
            <div className="flex flex-wrap sm:flex-row gap-4 justify-center w-full">
              <Button
                size="lg"
                onClick={() => navigate(ROUTES.MENU)}
                className="w-fit text-sm sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                Explore Our Menu
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.CONTACT)}
                className="w-fit text-sm sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
              >
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>


             {/* Featured Foods Section */}
       <section className="section-padding bg-gradient-to-br from-background-lightSecondary via-background-light to-background-lightSecondary dark:from-background-darkSecondary dark:via-background-dark dark:to-background-darkSecondary">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured <span className="text-gradient">Dishes</span>
            </h2>
            <p className="text-lg text-text-lightSecondary dark:text-text-darkSecondary max-w-2xl mx-auto">
              Discover our most popular and highly-rated dishes, crafted with passion 
              and the finest ingredients.
            </p>
          </motion.div>

          {/* Featured Foods Grid */}
          {isLoadingBestFoods || isValidating ? (
            <div>
              <div className="text-center mb-8">
                {isValidating && (
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-700 dark:text-blue-300">
                    <div className="w-5 h-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                    <span>Validating product images... Please wait</span>
                  </div>
                )}
              </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {Array.from({ length: 6 }).map((_, index) => (
                   <FoodCardSkeleton key={index} />
                 ))}
               </div>
            </div>
          ) : bestFoods.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
                             {bestFoods.slice(0, 6).map((food, index) => (
                 <motion.div
                   key={food.uniqueId || food.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.6, delay: 0.1 * index }}
                 >
                   <FoodCard food={food} />
                 </motion.div>
               ))}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">
                Featured dishes coming soon!
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                We're preparing something delicious for you.
              </p>
            </div>
          )}

          {/* View All Button */}
          {bestFoods.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.MENU)}
              >
                View Full Menu
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Preview Section */}
      <section className="section-padding bg-gradient-to-br from-background-darkSecondary dark:from-background-dark via-background-darkSecondary to-background-dark">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6 text-text-darkSecondary dark:text-text-darkSecondary">
                Our Story
              </h2>
              <p className="text-lg text-text-darkSecondary dark:text-text-darkSecondary mb-6 leading-relaxed">
                Founded with a passion for exceptional cuisine, Fork & Flame has been 
                serving memorable dining experiences for over a decade. Our commitment 
                to quality ingredients and innovative recipes sets us apart.
              </p>
              <p className="text-lg text-text-darkSecondary dark:text-text-darkSecondary mb-8 leading-relaxed">
                From our signature dishes to seasonal specials, every meal is crafted 
                with care and attention to detail, ensuring an unforgettable culinary journey.
              </p>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.ABOUT)}
              >
                Learn More About Us
              </Button>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop"
                  alt="Restaurant interior"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding bg-gradient-primary">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Experience Great Food?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Order online for pickup or delivery, or reserve a table for an 
              unforgettable dining experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="white"
                size="lg"
                onClick={() => navigate(ROUTES.MENU)}
              >
                Order Online
              </Button>
              <Button
                variant="white"
                size="lg"
                onClick={() => navigate(ROUTES.CONTACT)}
              >
                Make a Reservation
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
