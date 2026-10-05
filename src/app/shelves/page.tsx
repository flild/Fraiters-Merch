import ShelvesSection from '@/components/ShelvesSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Полочки | FRAITERS MERCH',
  description: 'Найдите наш мерч на полочках в Москве, Санкт-Петербурге, Казани и Екатеринбурге.',
};

export default function ShelvesPage() {
  return (
    <div className="pt-8 pb-16">
      <ShelvesSection />
    </div>
  );
}