import React from 'react';
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/Navbar';
import SectionView from '@/components/SectionView';
import CartDrawer from '@/components/CartDrawer';
import ProductModal from '@/components/ProductModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-[#0a0b0e] text-[#f1f3f7] flex flex-col selection:bg-red-600 selection:text-white">
        {/* Navigation Top Bar with Section Tabs */}
        <Navbar />

        {/* Section-based or Full-page Content View */}
        <main className="flex-1">
          <SectionView />
        </main>

        {/* Footer */}
        <Footer />

        {/* Global Interactive Overlays */}
        <CartDrawer />
        <ProductModal />
        <OrderSuccessModal />
      </div>
    </CartProvider>
  );
}
