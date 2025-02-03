'use client';

import React, { useEffect } from 'react';

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-end bg-black/60">
      {/* Drawer Content */}
      <div className="w-full px-20 bg-white p-6 shadow-lg transform transition-transform duration-300 ease-out">
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
      </div>
    </div>
  );
}