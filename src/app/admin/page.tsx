import AdminPanel from '@/components/AdminPanel';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Админ-панель | FRAITERS MERCH',
  description: 'Панель управления магазином',
};

export default function AdminPage() {
  return (
    <div className="pt-8 pb-16">
      <AdminPanel />
    </div>
  );
}