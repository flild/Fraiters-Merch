import ReviewsSection from '@/components/ReviewsSection';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Отзывы | FRAITERS MERCH',
  description: 'Отзывы покупателей об авторском мерче Fraiters.',
};

export default function ReviewsPage() {
  return (
    <div className="pt-8 pb-16">
      <ReviewsSection />
    </div>
  );
}