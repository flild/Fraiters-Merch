import ProductCatalog from '@/components/ProductCatalog';
import { Metadata } from 'next';
import { db } from '@/db';
import { products } from '@/db/schema';
import { Product } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Каталог | FRAITERS MERCH',
  description: 'Полный каталог коллекционного авторского мерча от Fraiters.',
};

export default async function CatalogPage() {
  const dbProducts = await db.select().from(products);
  return (
    <div className="pt-8 pb-16">
      <ProductCatalog initialProducts={dbProducts as Product[]} />
    </div>
  );
}