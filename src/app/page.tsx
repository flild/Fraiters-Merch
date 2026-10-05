import React from 'react';
import Hero from '@/components/Hero';
import TelegramBanner from '@/components/TelegramBanner';
import ProductCatalog from '@/components/ProductCatalog';
import { db } from '@/db';
import { products } from '@/db/schema';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const dbProducts = await db.select().from(products);

  return (
    <div>
      <Hero />
      <TelegramBanner />
      {/* Immediate conversion funnel: Preview catalog right on home */}
      <div className="pt-2 pb-16">
        <ProductCatalog limit={3} initialProducts={dbProducts as Product[]} />
      </div>
    </div>
  );
}