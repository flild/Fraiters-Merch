'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '@/lib/cart-context';
import Hero from './Hero';
import TelegramBanner from './TelegramBanner';
import ProductCatalog from './ProductCatalog';
import ShelvesSection from './ShelvesSection';
import DeliverySection from './DeliverySection';
import ReviewsSection from './ReviewsSection';
import FaqSection from './FaqSection';
import AdminPanel from './AdminPanel';

export default function SectionView() {
  const { activeSection } = useCart();

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="min-h-[70vh]"
        >
          {activeSection === 'home' && (
            <div>
              <Hero />
              <TelegramBanner />
              {/* Immediate conversion funnel: Preview catalog right on home */}
              <div className="pt-2">
                <ProductCatalog />
              </div>
            </div>
          )}

          {activeSection === 'catalog' && (
            <div>
              <ProductCatalog />
            </div>
          )}

          {activeSection === 'shelves' && (
            <div>
              <ShelvesSection />
            </div>
          )}

          {activeSection === 'delivery' && (
            <div>
              <DeliverySection />
            </div>
          )}

          {activeSection === 'reviews' && (
            <div>
              <ReviewsSection />
            </div>
          )}

          {activeSection === 'faq' && (
            <div>
              <FaqSection />
            </div>
          )}

          {activeSection === 'admin' && (
            <div>
              <AdminPanel />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
