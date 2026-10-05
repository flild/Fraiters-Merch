import FaqSection from '@/components/FaqSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | FRAITERS MERCH',
  description: 'Часто задаваемые вопросы о магазине FRAITERS MERCH.',
};

export default function FaqPage() {
  return (
    <div className="pt-8 pb-16">
      <FaqSection />
    </div>
  );
}