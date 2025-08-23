/**
 * Main App Component
 * Sets up React Router, React Query, and handles the Preloader
 */

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './contexts/ThemeContext.tsx';
import ErrorBoundary from './components/common/ErrorBoundary.tsx';
import Preloader from './components/common/Preloader.tsx';
import Layout from './components/layout/Layout.tsx';
const Home = lazy(() => import('./pages/Home.tsx'));
const Menu = lazy(() => import('./pages/Menu.tsx'));
const About = lazy(() => import('./pages/About.tsx'));
const Contact = lazy(() => import('./pages/Contact.tsx'));
const Order = lazy(() => import('./pages/Order.tsx'));
const Reviews = lazy(() => import('./pages/Reviews.tsx'));
const NotFound = lazy(() => import('./pages/NotFound.tsx'));
import useScrollToTop from './hooks/useScrollToTop.ts';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  const [isPreloaderComplete, setIsPreloaderComplete] = useState<boolean>(false);

  useEffect(() => {
    // Set a fallback timeout to ensure preloader completes
    const fallbackTimer = setTimeout(() => {
      setIsPreloaderComplete(true);
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  const handlePreloaderComplete = (): void => {
    setIsPreloaderComplete(true);
  };

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ErrorBoundary>
            <div className="App">
              {!isPreloaderComplete && (
                <Preloader onComplete={handlePreloaderComplete} />
              )}
              <AnimatePresence mode="wait">
                {isPreloaderComplete && (
                  <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
                    <AppContent />
                  </Suspense>
                )}
              </AnimatePresence>
            </div>
          </ErrorBoundary>
        </Router>
        {import.meta.env.DEV && <ReactQueryDevtools />}
      </QueryClientProvider>
    </ThemeProvider>
  );
}

// Separate component to use the hook
const AppContent: React.FC = () => {
  useScrollToTop(); // This hook will automatically scroll to top on route changes

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="menu" element={<Menu />} />
        <Route path="order" element={<Order />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
