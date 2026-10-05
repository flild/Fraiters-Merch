import ProductCatalog from '@/components/ProductCatalog';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Каталог | FRAITERS MERCH',
  description: 'Полный каталог коллекционного авторского мерча от Fraiters.',
};

export default function CatalogPage() {
  return (
    <div className="pt-8 pb-16">
      <ProductCatalog />
    </div>
  );
}