import React from 'react';
import Hero from '@/components/Hero';
import TelegramBanner from '@/components/TelegramBanner';
import ProductCatalog from '@/components/ProductCatalog';

export default function HomePage() {
  return (
    <div>
      <Hero />
      <TelegramBanner />
      {/* Immediate conversion funnel: Preview catalog right on home */}
      <div className="pt-2 pb-16">
        <ProductCatalog limit={3} />
      </div>
    </div>
  );
}