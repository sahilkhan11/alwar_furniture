'use client';

import { useState, useEffect } from 'react';
import { Button } from './Button';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem('cookie-consent');
    if (!hasConsented) {
      // Delay showing to not overwhelm the user immediately
      const timer = setTimeout(() => setShowConsent(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
            <div className="text-slate-600 text-sm md:text-base">
              We use cookies to improve your browsing experience, serve personalized ads or content, and analyze our traffic. 
              By clicking "Accept All", you consent to our use of cookies as described in our{' '}
              <Link href="/privacy-policy" className="text-brand-accent hover:underline font-medium">
                Privacy Policy
              </Link>.
            </div>
            <div className="flex flex-row gap-3 shrink-0 w-full md:w-auto justify-end">
              <Button 
                variant="outline" 
                className="flex-1 md:flex-none"
                onClick={() => setShowConsent(false)}
              >
                Decline
              </Button>
              <Button 
                className="flex-1 md:flex-none"
                onClick={acceptCookies}
              >
                Accept All
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
