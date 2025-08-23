/**
 * Layout Component
 * Main layout wrapper for all pages
 */

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../common/Navigation.tsx';
import Footer from '../common/Footer.tsx';
import ScrollToTop from '../common/ScrollToTop.tsx';

const Layout: React.FC = () => {

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark pt-16 lg:pt-20">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
