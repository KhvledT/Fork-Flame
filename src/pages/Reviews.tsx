/**
 * Reviews Page Component
 * Modern reviews page with enhanced design and functionality
 */

import React, { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button.tsx';
import PageHero from '../components/ui/PageHero.tsx';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  verified: boolean;
  helpful: number;
}

interface NewReview {
  name: string;
  rating: number;
  comment: string;
}

interface RatingDistribution {
  [key: number]: number;
}

const Reviews: React.FC = () => {
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [isAddingReview, setIsAddingReview] = useState<boolean>(false);
  const [newReview, setNewReview] = useState<NewReview>({
    name: '',
    rating: 5,
    comment: ''
  });

  // Sample reviews data
  const reviews: Review[] = [
    {
      id: 1,
      name: 'Sarah Johnson',
      rating: 5,
      date: '2 days ago',
      comment: 'Absolutely amazing experience! The food was delicious and the service was impeccable. The atmosphere is perfect for both casual dining and special occasions. Highly recommend the signature burger and truffle fries!',
      avatar: 'https://images.unsplash.com/photo-1588516903720-8ceb67f9ef84?q=80&w=1044&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      verified: true,
      helpful: 24
    },
    {
      id: 2,
      name: 'Michael Chen',
      rating: 5,
      date: '1 week ago',
      comment: 'Best restaurant in the city! The quality of ingredients is outstanding, and you can taste the difference. The staff is friendly and attentive. The wine selection is also impressive. Will definitely be back!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      verified: true,
      helpful: 18
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Great food and atmosphere! The portions are generous and the flavors are bold. The only minor issue was a slight delay in service during peak hours, but the food made up for it completely.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      verified: true,
      helpful: 12
    },
    {
      id: 4,
      name: 'David Thompson',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Exceptional dining experience! The chef\'s special was incredible, and the presentation was beautiful. The restaurant has a warm, inviting atmosphere that makes you feel at home. Service was top-notch!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      helpful: 31
    },
    {
      id: 5,
      name: 'Lisa Wang',
      rating: 5,
      date: '1 month ago',
      comment: 'Incredible food and wonderful staff! The menu has something for everyone, and the quality is consistently excellent. The outdoor seating area is perfect for summer evenings. Highly recommend!',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      verified: true,
      helpful: 27
    },
    {
      id: 6,
      name: 'James Wilson',
      rating: 4,
      date: '1 month ago',
      comment: 'Very good restaurant with excellent food quality. The atmosphere is relaxed and comfortable. The only reason I didn\'t give 5 stars is because the music was a bit too loud for my taste.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      helpful: 8
    }
  ];

  // Filter reviews by rating
  const filteredReviews: Review[] = selectedRating === 'all' 
    ? reviews 
    : reviews.filter(review => review.rating === parseInt(selectedRating));

  // Calculate statistics
  const totalReviews: number = reviews.length;
  const averageRating: string = (reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);
  const ratingDistribution: RatingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };

  // Handle new review submission
  const handleSubmitReview = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsAddingReview(false);
      setNewReview({ name: '', rating: 5, comment: '' });
      // Show success message (you can add a toast notification here)
    }, 1000);
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen">
      <PageHero
        title="Customer"
        highlight="Reviews"
        subtitle="See what our valued customers have to say about their dining experience at Fork & Flame"
      />

      {/* Main Content */}
      <div className="container-custom py-16">
        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Overall Rating */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {averageRating}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Average Rating</p>
              <div className="flex justify-center mt-3">
                {renderStars(Math.round(parseFloat(averageRating)))}
              </div>
            </div>

            {/* Total Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {totalReviews}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Total Reviews</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">From verified customers</p>
            </div>

            {/* Satisfaction Rate */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {Math.round((ratingDistribution[5] + ratingDistribution[4]) / totalReviews * 100)}%
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Satisfaction Rate</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">4+ star ratings</p>
            </div>
          </div>
        </motion.div>

        {/* Rating Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Rating Distribution
            </h2>
            <div className="space-y-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 min-w-[80px]">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      {rating}
                    </span>
                    <span className="text-yellow-400">★</span>
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(ratingDistribution[rating] / totalReviews) * 100}%` 
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px] text-right">
                    {ratingDistribution[rating]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Filter and Add Review */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Rating Filter */}
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                Filter by rating:
              </span>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="px-4 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>

            {/* Add Review Button */}
            <Button
              onClick={() => setIsAddingReview(true)}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              ✍️ Write a Review
            </Button>
          </div>
        </motion.div>

        {/* Add Review Modal */}
        {isAddingReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsAddingReview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Write Your Review
                </h2>
                <button
                  onClick={() => setIsAddingReview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, rating })}
                        className={`text-3xl transition-all duration-300 hover:scale-110 ${
                          rating <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Your Review *
                  </label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                    placeholder="Share your experience with us..."
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    Submit Review
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => setIsAddingReview(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              {/* Review Header */}
              <div className="flex items-start gap-4 mb-6">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-16 h-16 rounded-full object-cover shadow-lg"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {review.name}
                    </h3>
                    {review.verified && (
                      <span className="text-blue-500 text-sm font-medium">✓ Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {review.date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {review.comment}
              </p>

              {/* Review Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                <button className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors duration-300">
                  <span>👍</span>
                  <span className="text-sm">Helpful ({review.helpful})</span>
                </button>
                <button className="text-gray-500 hover:text-primary transition-colors duration-300 text-sm">
                  Reply
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Reviews Message */}
        {filteredReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No reviews found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filter or be the first to write a review!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
