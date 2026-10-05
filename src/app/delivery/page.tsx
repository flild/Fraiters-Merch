import DeliverySection from '@/components/DeliverySection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Доставка | FRAITERS MERCH',
  description: 'Информация о доставке мерча СДЭК и Почтой России.',
};

export default function DeliveryPage() {
  return (
    <div className="pt-8 pb-16">
      <DeliverySection />
    </div>
  );
}