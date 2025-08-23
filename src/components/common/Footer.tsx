/**
 * Footer Component
 * Restaurant information, links, and social media
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ROUTES } from '../../utils/constants.ts';

interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    path: string;
  }>;
}

interface SocialLink {
  icon: string;
  label: string;
  url: string;
}

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // Footer sections
  const footerSections: FooterSection[] = [
    {
      title: 'Restaurant',
      links: [
        { label: 'About Us', path: ROUTES.ABOUT },
        { label: 'Our Menu', path: ROUTES.MENU },
        { label: 'Order Online', path: ROUTES.ORDER },
        { label: 'Contact', path: ROUTES.CONTACT }
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'Dine In', path: '#' },
        { label: 'Takeaway', path: '#' },
        { label: 'Delivery', path: '#' },
        { label: 'Catering', path: '#' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', path: '#' },
        { label: 'Privacy Policy', path: '#' },
        { label: 'Terms of Service', path: '#' },
        { label: 'FAQ', path: '#' }
      ]
    }
  ];

  // Social media links
  const socialLinks: SocialLink[] = [
    { icon: '📘', label: 'Facebook', url: '#' },
    { icon: '📷', label: 'Instagram', url: '#' },
    { icon: '🐦', label: 'Twitter', url: '#' },
    { icon: '📺', label: 'YouTube', url: '#' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container-custom py-16 text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-6 text-left ps-7">
              <div className="text-3xl">🍴</div>
              <span className="text-2xl font-bold text-gradient">Fork & Flame</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-left ps-7">
              Experience culinary excellence with our carefully crafted dishes, 
              made with the finest ingredients and passion for food.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 ps-7">
              <div className="flex items-center space-x-3">
                <span className="text-primary">📍</span>
                <span className="text-gray-300">123 Culinary Street, Food City</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary">📞</span>
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-primary">✉️</span>
                <span className="text-gray-300">info@forkandflame.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-6 text-white">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-primary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-300 mb-6">
              Get updates on new menu items, special offers, and culinary events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <motion.button
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700">
        <div className="container-custom py-6">
          <div className="space-y-4 md:space-y-0 text-center">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Fork & Flame. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
