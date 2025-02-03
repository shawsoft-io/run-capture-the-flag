'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Drawer({ isOpen, onClose, children }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-end">
          {/* Overlay (Behind Drawer) */}
          <div 
            className="absolute inset-0 bg-black/60" 
            onClick={onClose} 
          />

          {/* Drawer Content with Slide-Up Animation */}
          <motion.div
            initial={{ y: "100%" }} // Start off-screen
            animate={{ y: 0 }} // Slide up
            exit={{ y: "100%" }} // Slide down on close
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full px-20 bg-white p-6 shadow-lg"
          >
            {/* Close Button */}
            <div className="flex justify-between items-center pb-2">
              <h3 className="text-lg font-semibold text-gray-900"></h3>
              <button
                onClick={onClose}
                className="text-gray-400 font-thin hover:text-gray-700 focus:outline-none text-3xl"
              >
                &times;
              </button>
            </div>

            {/* Drawer Content */}
            {children}
          </motion.div>
        </div>
      )}

    </AnimatePresence>
  );
}