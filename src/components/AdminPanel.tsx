'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Package, ClipboardList, Settings, ArrowLeft,
  ShieldCheck, BarChart3
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Product, CartItem } from '@/types';
import { AdminStatsTab, AdminStats } from './admin/AdminStatsTab';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { ProductEditModal } from './admin/ProductEditModal';

export default function AdminPanel() {
  const { 
    products, addProduct, updateProduct, deleteProduct, resetProducts,
    orders, updateOrderStatus, clearOrders, seedDemoOrders,
  } = useCart();

  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'products' | 'orders' | 'settings'>('stats');

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Sales Statistics computation
  const stats: AdminStats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    let totalUnits = 0;
    const productStatsMap: Record<string, { product: Product; unitsSold: number; revenue: number }> = {};
    const categoryStatsMap: Record<string, { categoryName: string; unitsSold: number; revenue: number }> = {};
    const deliveryStatsMap: Record<string, { count: number; name: string }> = {
      cdek: { count: 0, name: 'СДЭК (ПВЗ/Курьер)' },
      post: { count: 0, name: 'Почта России' },
    };
    const statusStatsMap: Record<string, number> = {
      new: 0,
      processing: 0,
      shipped: 0,
      completed: 0,
    };

    orders.forEach((ord) => {
      // Status
      if (statusStatsMap[ord.status] !== undefined) {
        statusStatsMap[ord.status]++;
      }

      // Delivery
      const delivery = ord.values?.deliveryMethod || 'cdek';
      if (!deliveryStatsMap[delivery]) {
        deliveryStatsMap[delivery] = { count: 0, name: delivery };
      }
      deliveryStatsMap[delivery].count++;

      // Items
      ord.items?.forEach((it: CartItem) => {
        if (!it.product) return;
        totalUnits += it.quantity;
        const pid = it.product.id;
        const cat = it.product.category;
        const catName = it.product.categoryName || cat;
        const itemRev = it.product.price * it.quantity;

        if (!productStatsMap[pid]) {
          productStatsMap[pid] = { product: it.product, unitsSold: 0, revenue: 0 };
        }
        productStatsMap[pid].unitsSold += it.quantity;
        productStatsMap[pid].revenue += itemRev;

        if (!categoryStatsMap[cat]) {
          categoryStatsMap[cat] = { categoryName: catName, unitsSold: 0, revenue: 0 };
        }
        categoryStatsMap[cat].unitsSold += it.quantity;
        categoryStatsMap[cat].revenue += itemRev;
      });
    });

    const topProducts = Object.values(productStatsMap)
      .sort((a, b) => b.revenue - a.revenue);

    const categoryBreakdown = Object.values(categoryStatsMap)
      .sort((a, b) => b.revenue - a.revenue);

    // Sales timeline by recent days
    const days = [
      { label: '28 сен', shortDay: 'Пн', revenue: 0, orders: 0 },
      { label: '29 сен', shortDay: 'Вт', revenue: 950, orders: 1 },
      { label: '30 сен', shortDay: 'Ср', revenue: 1740, orders: 1 },
      { label: '1 окт', shortDay: 'Чт', revenue: 4890, orders: 1 },
      { label: '2 окт', shortDay: 'Пт', revenue: 3540, orders: 2 },
      { label: '3 окт', shortDay: 'Сб', revenue: 6810, orders: 2 },
      { label: '4 окт', shortDay: 'Вс', revenue: totalRevenue > 20000 ? 2840 : Math.round(totalRevenue * 0.15), orders: 1 },
    ];

    const maxDayRevenue = Math.max(...days.map((d) => d.revenue), 1000);

    return {
      totalRevenue,
      totalOrders,
      aov,
      totalUnits,
      productStatsMap,
      topProducts,
      categoryBreakdown,
      deliveryStatsMap,
      statusStatsMap,
      days,
      maxDayRevenue,
    };
  }, [orders]);

  const handleOpenAddProduct = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: '',
      category: 'stands',
      categoryName: 'Акриловый стенд',
      price: 900,
      inStock: true,
      image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
      fallbackGradient: 'from-red-950 via-neutral-900 to-black',
      description: 'Новый авторский товар Fraiters с двусторонней печатью.',
      size: '15 см',
      material: 'Прозрачный акрил 4 мм',
      features: ['Двусторонняя УФ-печать', 'Защитные пленки', 'Устойчивая подставка'],
    };
    setEditingProduct(newProd);
    setIsNewProduct(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    if (isNewProduct) {
      addProduct(editingProduct);
    } else {
      updateProduct(editingProduct.id, editingProduct);
    }
    setEditingProduct(null);
    setIsNewProduct(false);
  };

  // Export JSON
  const handleExportData = () => {
    const exportData = {
      products,
      orders,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fraiters_merch_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.products && Array.isArray(json.products)) {
          localStorage.setItem('fraiters_merch_products', JSON.stringify(json.products));
          window.location.reload();
        }
      } catch {
        alert('Ошибка при чтении файла JSON!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="py-10 md:py-16 bg-background min-h-[85vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Admin Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-primary-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Панель управления Fraiters Merch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-mono">
              Управление магазином
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Редактируйте товары, меняйте цены и отслеживайте поступившие заказы.
            </p>
          </div>

          {/* Quick Exit to Store */}
          <Link
            href="/catalog"
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border hover:border-primary/70 text-foreground hover:text-white rounded-lg transition-colors cursor-pointer text-xs font-medium self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 text-primary-500" />
            <span>Вернуться на сайт</span>
          </Link>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none border-b border-border/60">
          <button
            onClick={() => setActiveAdminTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'stats'
                ? 'bg-primary text-white shadow-md shadow-red-950'
                : 'bg-card text-muted-foreground hover:text-white border border-border'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Статистика продаж</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 bg-black/40 rounded text-primary-300">
              {stats.totalRevenue.toLocaleString('ru-RU')} ₽
            </span>
          </button>

          <button
            onClick={() => setActiveAdminTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'products'
                ? 'bg-primary text-white shadow-md shadow-red-950'
                : 'bg-card text-muted-foreground hover:text-white border border-border'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Товары и цены ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'orders'
                ? 'bg-primary text-white shadow-md shadow-red-950'
                : 'bg-card text-muted-foreground hover:text-white border border-border'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Заказы клиентов ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'settings'
                ? 'bg-primary text-white shadow-md shadow-red-950'
                : 'bg-card text-muted-foreground hover:text-white border border-border'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>База данных и экспорт</span>
          </button>
        </div>

        {/* ----------------- TAB 0: SALES STATISTICS ----------------- */}
        {activeAdminTab === 'stats' && (
          <AdminStatsTab
            stats={stats}
            seedDemoOrders={seedDemoOrders}
            handleExportData={handleExportData}
          />
        )}

        {/* ----------------- TAB 1: PRODUCTS & PRICES ----------------- */}
        {activeAdminTab === 'products' && (
          <AdminProductsTab
            products={products}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            onOpenAddProduct={handleOpenAddProduct}
            onEditProduct={(p) => {
              setEditingProduct({ ...p });
              setIsNewProduct(false);
            }}
          />
        )}

        {/* ----------------- TAB 2: ORDERS ----------------- */}
        {activeAdminTab === 'orders' && (
          <AdminOrdersTab
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            clearOrders={clearOrders}
          />
        )}

        {/* ----------------- TAB 3: SETTINGS & BACKUP ----------------- */}
        {activeAdminTab === 'settings' && (
          <AdminSettingsTab
            handleExportData={handleExportData}
            handleImportData={handleImportData}
            resetProducts={resetProducts}
          />
        )}

      </div>

      {/* ----------------- PRODUCT EDIT MODAL ----------------- */}
      {editingProduct && (
        <ProductEditModal
          editingProduct={editingProduct}
          isNewProduct={isNewProduct}
          setEditingProduct={setEditingProduct}
          onSave={handleSaveProduct}
        />
      )}

    </div>
  );
}
