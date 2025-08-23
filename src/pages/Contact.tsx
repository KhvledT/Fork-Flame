/**
 * Contact Page Component
 * Modern contact page with enhanced design and functionality
 */

import React, { useState, useRef, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ROUTES } from '../utils/constants.ts';
import Button from '../components/ui/Button.tsx';
import PageHero from '../components/ui/PageHero.tsx';
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  icon: string;
  title: string;
  details: string;
  action: string;
  actionLink: string;
}

interface FormErrors {
  [key: string]: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const mapRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (message: string): void => {
    setToast({ message, visible: true });
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast({ message: '', visible: false });
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  // Contact information
  const contactInfo: ContactInfo[] = [
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Culinary Street, Foodie District, City, State 12345',
      action: 'Get Directions',
      actionLink: 'https://maps.google.com'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      action: 'Call Now',
      actionLink: 'tel:+15551234567'
    },
    {
      icon: '✉️',
      title: 'Email Us',
      details: 'hello@forkandflame.com',
      action: 'Send Email',
      actionLink: 'mailto:hello@forkandflame.com'
    },
    {
      icon: '🕒',
      title: 'Opening Hours',
      details: 'Mon-Sun: 11:00 AM - 10:00 PM',
      action: 'View Menu',
      actionLink: ROUTES.MENU
    }
  ];

  // Validate form - matching Order page pattern
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!formData.subject) {
      errors.subject = 'Please select a subject';
    }
    
    if (!formData.message.trim()) {
      errors.message = 'Message is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setFormErrors({});
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactAction = async (info: ContactInfo): Promise<void> => {
    switch (info.action) {
      case 'Get Directions': {
        mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        break;
      }
      case 'Call Now': {
        const textToCopy = info.actionLink?.startsWith('tel:')
          ? info.actionLink.replace('tel:', '')
          : info.details;
        try {
          if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(textToCopy);
            showToast(`Copied ${textToCopy} to clipboard`);
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (successful) showToast(`Copied ${textToCopy} to clipboard`);
          }
        } catch {}
        break;
      }
      case 'Send Email': {
        const emailToCopy = info.actionLink?.startsWith('mailto:')
          ? info.actionLink.replace('mailto:', '')
          : info.details;
        try {
          if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(emailToCopy);
            showToast(`Copied ${emailToCopy} to clipboard`);
          } else {
            const textarea = document.createElement('textarea');
            textarea.value = emailToCopy;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            const successful = document.execCommand('copy');
            document.body.removeChild(textarea);
            if (successful) showToast(`Copied ${emailToCopy} to clipboard`);
          }
        } catch {}
        break;
      }
      case 'View Menu': {
        navigate(ROUTES.MENU);
        break;
      }
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Toast */}
      <div className="fixed top-4 right-4 z-50">
        <AnimatePresence>
          {toast.visible && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-900 text-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-lg border border-gray-700"
            >
              <div className="flex items-center gap-2">
                <span>✅</span>
                <span className="text-sm font-medium">{toast.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <PageHero
        title="Get in"
        highlight="Touch"
        subtitle="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
      />

      {/* Main Content */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="ps-7">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Let's Connect
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                Have a question, feedback, or want to make a reservation? We're here to help! 
                Reach out to us through any of the channels below or fill out the form.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{info.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {info.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {info.details}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleContactAction(info)}
                        className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                        aria-label={info.action}
                      >
                        {info.action}
                        <span className="ml-2">→</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl p-6 border border-primary/20"
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                🚀 Quick Response
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We typically respond to all inquiries within 2-4 hours during business hours. 
                For urgent matters, please call us directly.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
          >
            <div className="text-center mb-6 pt-4 md:pt-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Send Message
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Fill out the form below and we'll get back to you soon.
              </p>
            </div>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl text-green-800 dark:text-green-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">✅</span>
                  <span>Thank you! Your message has been sent successfully.</span>
                </div>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-800 dark:text-red-200"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">❌</span>
                  <span>Something went wrong. Please try again.</span>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
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
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
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
              </div>

              {/* Phone and Subject Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
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
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Subject *
                  </label>
                  <div className="relative">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full px-4 pr-12 py-3 rounded-2xl border-2 appearance-none transition-all duration-300 ${
                        formErrors.subject 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                      } text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary`}
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="reservation">Reservation Request</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="catering">Catering Services</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center z-10">
                      <svg className="h-5 w-5 text-gray-500 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                  {formErrors.subject && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.subject}</p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  className={`w-full px-4 py-3 rounded-2xl border-2 transition-all duration-300 ${
                    formErrors.message 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                  } text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary resize-none`}
                  placeholder="Tell us how we can help you..."
                />
                {formErrors.message && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{formErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending Message...
                  </div>
                ) : (
                  '🚀 Send Message'
                )}
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Find Us
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Located in the heart of the city, we're easily accessible and ready to welcome you.
            </p>
          </div>

          {/* Map Embed */}
          <div ref={mapRef} className="rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-600">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15370753.009069953!2d94.5756823!3d19.8558035!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f8952cc09e7c97%3A0x3d96c7725edb8a5f!2sThe%20Flame%20and%20Fork!5e0!3m2!1sar!2seg!4v1755967220396!5m2!1sar!2seg"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="The Flame and Fork Location"
            />
          </div>
        </motion.div>
        {/* Large-screen footer spacer text */}
        <p className="hidden lg:block text-center text-gray-500 dark:text-gray-400 mt-16 mb-4">
          We look forward to hearing from you.
        </p>
      </div>
    </div>
  );
};

export default Contact;
