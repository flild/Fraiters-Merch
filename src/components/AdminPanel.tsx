'use client';

import React, { useState, useMemo } from 'react';
import { 
  Package, MapPin, ClipboardList, Settings, Plus, Edit2, Trash2, 
  Check, X, RefreshCw, Download, Upload, ArrowLeft, Search, Eye,
  Sparkles, ExternalLink, Send, ShieldCheck, Tag, BarChart3, TrendingUp,
  DollarSign, AlertTriangle, Layers, PieChart, Award, ArrowUpRight,
  ShoppingBag, Calendar, Truck
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Product, ProductCategory, ShelfLocation, OrderRecord } from '@/lib/types';
import { CATEGORIES } from '@/lib/data';

export default function AdminPanel() {
  const { 
    products, addProduct, updateProduct, deleteProduct, resetProducts,
    shelves, addShelf, updateShelf, deleteShelf, resetShelves,
    orders, updateOrderStatus, clearOrders, seedDemoOrders,
    setActiveSection
  } = useCart();

  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'products' | 'shelves' | 'orders' | 'settings'>('stats');
  
  // Search & Filter in Products
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Shelf Edit Modal State
  const [editingShelf, setEditingShelf] = useState<ShelfLocation | null>(null);
  const [isNewShelf, setIsNewShelf] = useState(false);

  // Quick edit inline prices
  const [inlinePrices, setInlinePrices] = useState<Record<string, number>>({});

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.categoryName.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Sales Statistics computation
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    
    let totalUnits = 0;
    const productStatsMap: Record<string, { product: Product; unitsSold: number; revenue: number }> = {};
    const categoryStatsMap: Record<string, { categoryName: string; unitsSold: number; revenue: number }> = {};
    const deliveryStatsMap: Record<string, { count: number; name: string }> = {
      cdek: { count: 0, name: 'СДЭК (ПВЗ/Курьер)' },
      post: { count: 0, name: 'Почта России' },
      shelf: { count: 0, name: 'Полочка (Самовывоз)' },
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
      ord.items?.forEach((it) => {
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

    const lowStockProducts = products.filter((p) => (p.stockCount ?? 10) <= 5);

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
      lowStockProducts,
      days,
      maxDayRevenue,
    };
  }, [orders, products]);

  const handleOpenAddProduct = () => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: '',
      category: 'stands',
      categoryName: 'Акриловый стенд',
      price: 900,
      inStock: true,
      stockCount: 10,
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

  const handleOpenAddShelf = () => {
    const newShelf: ShelfLocation = {
      id: `shelf-${Date.now()}`,
      city: 'Москва',
      storeName: '«Магазин мерча»',
      address: 'ул. Центральная, д. 1',
      shelfNumber: 'Полка № 1',
      workingHours: '10:00 – 21:00',
      statusText: 'Свежее пополнение',
      itemsAvailable: ['Стенды', 'Брелоки', 'Стикеры'],
      yandexMapUrl: 'https://yandex.ru/maps/',
    };
    setEditingShelf(newShelf);
    setIsNewShelf(true);
  };

  const handleSaveShelf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShelf) return;

    if (isNewShelf) {
      addShelf(editingShelf);
    } else {
      updateShelf(editingShelf.id, editingShelf);
    }
    setEditingShelf(null);
    setIsNewShelf(false);
  };

  // Export JSON
  const handleExportData = () => {
    const exportData = {
      products,
      shelves,
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
              Редактируйте товары, меняйте цены, обновляйте полочки и отслеживайте поступившие заказы.
            </p>
          </div>

          {/* Quick Exit to Store */}
          <button
            onClick={() => setActiveSection('catalog')}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border hover:border-primary/70 text-foreground hover:text-white rounded-lg transition-colors cursor-pointer text-xs font-medium self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4 text-primary-500" />
            <span>Вернуться на сайт</span>
          </button>
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
            onClick={() => setActiveAdminTab('shelves')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeAdminTab === 'shelves'
                ? 'bg-primary text-white shadow-md shadow-red-950'
                : 'bg-card text-muted-foreground hover:text-white border border-border'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Полочки в городах ({shelves.length})</span>
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
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Control Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border shadow-xl">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-primary-400 mb-1">
                  <BarChart3 className="w-4 h-4 text-primary-500" />
                  <span className="font-semibold uppercase tracking-wider">Аналитика и выручка</span>
                </div>
                <h2 className="text-lg font-bold text-white">Статистика продаж Fraiters Merch</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Данные основаны на всех заказах, оформленных через интернет-витрину и партнерские полочки.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={seedDemoOrders}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-card hover:bg-muted border border-border/80 text-xs font-medium text-foreground hover:text-white rounded-lg transition-colors cursor-pointer"
                  title="Загрузить тестовые заказы для проверки статистики"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Обновить демо-данные</span>
                </button>

                <button
                  onClick={handleExportData}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-card hover:bg-muted border border-border/80 text-xs font-medium text-foreground hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Экспорт отчета</span>
                </button>
              </div>
            </div>

            {/* 4 Main KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Revenue */}
              <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
                  <span>Общая выручка</span>
                  <div className="w-8 h-8 rounded-lg bg-primary-950/80 border border-primary-800/40 text-primary-400 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
                  {stats.totalRevenue.toLocaleString('ru-RU')} ₽
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px]">
                  <span className="text-emerald-400 font-medium font-mono flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
                  </span>
                  <span className="text-muted-foreground">к прошлому дропу</span>
                </div>
              </div>

              {/* Card 2: Orders Count */}
              <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
                  <span>Всего заказов</span>
                  <div className="w-8 h-8 rounded-lg bg-card border border-border text-primary-400 flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
                  {stats.totalOrders}
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                  <span className="text-amber-400 font-semibold">{stats.statusStatsMap.new} нов.</span>
                  <span>·</span>
                  <span className="text-blue-400 font-semibold">{stats.statusStatsMap.processing} в сборке</span>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold">{stats.statusStatsMap.completed} заверш.</span>
                </div>
              </div>

              {/* Card 3: AOV */}
              <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
                  <span>Средний чек (AOV)</span>
                  <div className="w-8 h-8 rounded-lg bg-card border border-border text-primary-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
                  {stats.aov.toLocaleString('ru-RU')} ₽
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground font-mono">
                  В среднем ~ {(stats.totalUnits / Math.max(stats.totalOrders, 1)).toFixed(1)} поз. в одном чеке
                </div>
              </div>

              {/* Card 4: Total Units Sold */}
              <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
                  <span>Продано мерча</span>
                  <div className="w-8 h-8 rounded-lg bg-card border border-border text-primary-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
                  {stats.totalUnits} шт.
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground font-mono">
                  Стенды, брелоки, диорамы, худи
                </div>
              </div>
            </div>

            {/* Sales Dynamics Chart & Delivery Channels Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: 7-day Sales Dynamics Bar Chart */}
              <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary-500" />
                        <span>Динамика продаж по дням</span>
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Выручка за последние 7 дней (в рублях)
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono text-muted-foreground">Пиковый день:</div>
                      <div className="text-xs font-mono font-bold text-primary-400">
                        {stats.maxDayRevenue.toLocaleString('ru-RU')} ₽
                      </div>
                    </div>
                  </div>

                  {/* Histogram bars */}
                  <div className="h-44 pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-4 border-b border-border/80">
                    {stats.days.map((day, idx) => {
                      const heightPercent = Math.max(Math.round((day.revenue / stats.maxDayRevenue) * 100), 8);
                      const isPeak = day.revenue === stats.maxDayRevenue;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                          {/* Value tooltip label on hover/peak */}
                          <div className="mb-2 text-[10px] font-mono font-bold text-muted-foreground opacity-90 group-hover:opacity-100 transition-opacity tabular-nums whitespace-nowrap">
                            {day.revenue > 0 ? `${day.revenue.toLocaleString('ru-RU')} ₽` : '0 ₽'}
                          </div>

                          {/* Animated/styled vertical bar */}
                          <div className="w-full max-w-[42px] bg-card rounded-t-lg overflow-hidden flex items-end h-[120px] p-0.5">
                            <div
                              style={{ height: `${heightPercent}%` }}
                              className={`w-full rounded-t-md transition-all duration-500 ${
                                isPeak
                                  ? 'bg-gradient-to-t from-red-700 via-red-600 to-rose-400 shadow-lg shadow-red-950/60'
                                  : day.revenue > 0
                                  ? 'bg-gradient-to-t from-neutral-800 via-red-950 to-red-600'
                                  : 'bg-muted/60'
                              } group-hover:brightness-125`}
                            />
                          </div>

                          {/* Day label below */}
                          <div className="mt-2 text-center">
                            <div className="text-[11px] font-medium text-white">{day.shortDay}</div>
                            <div className="text-[10px] font-mono text-muted-foreground">{day.label}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-muted-foreground font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary-500" />
                    <span>Продажи интернет-магазина и предзаказы</span>
                  </div>
                  <div>
                    Среднедневная выручка: ~ {Math.round(stats.totalRevenue / 7).toLocaleString('ru-RU')} ₽ / день
                  </div>
                </div>
              </div>

              {/* Right Column: Delivery Channels Breakdown */}
              <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-primary-500" />
                    <span>Каналы доставки</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    Распределение способов получения заказов
                  </p>

                  <div className="space-y-4">
                    {Object.entries(stats.deliveryStatsMap).map(([key, val]) => {
                      const percentage = stats.totalOrders > 0
                        ? Math.round((val.count / stats.totalOrders) * 100)
                        : 0;

                      return (
                        <div key={key} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">{val.name}</span>
                            <span className="text-white font-mono font-bold tabular-nums">
                              {val.count} зак. ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-border">
                            <div
                              style={{ width: `${percentage}%` }}
                              className={`h-full rounded-full transition-all duration-500 ${
                                key === 'cdek'
                                  ? 'bg-primary-500'
                                  : key === 'shelf'
                                  ? 'bg-emerald-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Самовывоз с полочек:</span>
                  <span className="text-emerald-400 font-mono font-semibold">
                    {stats.deliveryStatsMap.shelf?.count || 0} покупок (0 ₽ доставка)
                  </span>
                </div>
              </div>

            </div>

            {/* Bestsellers Table & Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Bestsellers List (8 cols) */}
              <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-primary-500" />
                      <span>Рейтинг бестселлеров по выручке</span>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Самые продаваемые позиции авторского мерча
                    </p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    Топ {Math.min(stats.topProducts.length, 6)} позиций
                  </span>
                </div>

                {stats.topProducts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    Нет данных о продажах. Оформите заказ на сайте или нажмите «Обновить демо-данные».
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-card/90 text-muted-foreground font-mono uppercase text-[11px] border-b border-border">
                        <tr>
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Товар</th>
                          <th className="py-2.5 px-3 text-center">Продано</th>
                          <th className="py-2.5 px-3">Выручка</th>
                          <th className="py-2.5 px-3">Доля</th>
                          <th className="py-2.5 px-3 text-right">Склад</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 text-muted-foreground">
                        {stats.topProducts.slice(0, 6).map((item, index) => {
                          const revenueShare = stats.totalRevenue > 0
                            ? Math.round((item.revenue / stats.totalRevenue) * 100)
                            : 0;
                          const isLowStock = (item.product.stockCount ?? 10) <= 5;

                          return (
                            <tr key={item.product.id} className="hover:bg-card/40 transition-colors">
                              <td className="py-3 px-3 font-mono font-bold">
                                {index === 0 ? (
                                  <span className="text-amber-400">🥇 1</span>
                                ) : index === 1 ? (
                                  <span className="text-muted-foreground">🥈 2</span>
                                ) : index === 2 ? (
                                  <span className="text-amber-600">🥉 3</span>
                                ) : (
                                  <span className="text-muted-foreground">{index + 1}</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    referrerPolicy="no-referrer"
                                    className="w-9 h-9 rounded-lg object-cover bg-background shrink-0"
                                  />
                                  <div>
                                    <div className="font-bold text-white line-clamp-1 max-w-[200px] sm:max-w-xs">
                                      {item.product.name}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground font-mono">
                                      {item.product.categoryName} · {item.product.price} ₽
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-center font-mono font-bold text-white tabular-nums">
                                {item.unitsSold} шт.
                              </td>
                              <td className="py-3 px-3 font-mono font-bold text-primary-400 tabular-nums">
                                {item.revenue.toLocaleString('ru-RU')} ₽
                              </td>
                              <td className="py-3 px-3 font-mono">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                      style={{ width: `${revenueShare}%` }}
                                      className="h-full bg-primary-500 rounded-full"
                                    />
                                  </div>
                                  <span className="text-[11px] tabular-nums text-muted-foreground">
                                    {revenueShare}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                {isLowStock ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-primary-950/80 text-primary-400 border border-primary-800/60">
                                    Остаток: {item.product.stockCount ?? 0} шт
                                  </span>
                                ) : (
                                  <span className="text-[11px] font-mono text-muted-foreground">
                                    {item.product.stockCount ?? 10} шт.
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Category Breakdown (4 cols) */}
              <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                    <PieChart className="w-4 h-4 text-primary-500" />
                    <span>Выручка по категориям</span>
                  </h3>
                  <p className="text-xs text-muted-foreground mb-5">
                    Доля продаж в структуре дохода
                  </p>

                  <div className="space-y-4">
                    {stats.categoryBreakdown.map((cat, idx) => {
                      const share = stats.totalRevenue > 0
                        ? Math.round((cat.revenue / stats.totalRevenue) * 100)
                        : 0;

                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground font-medium">{cat.categoryName}</span>
                            <span className="text-white font-mono tabular-nums font-semibold">
                              {cat.revenue.toLocaleString('ru-RU')} ₽ ({share}%)
                            </span>
                          </div>
                          <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-border">
                            <div
                              style={{ width: `${share}%` }}
                              className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Stock alert footer */}
                {stats.lowStockProducts.length > 0 && (
                  <div className="mt-6 p-3 bg-primary-950/40 border border-primary-900/60 rounded-xl flex items-start gap-2.5 text-xs text-primary-200">
                    <AlertTriangle className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">
                        {stats.lowStockProducts.length} поз. заканчиваются
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">
                        Требуется допечатка в типографии (остаток $\le$ 5 шт.)
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ----------------- TAB 1: PRODUCTS & PRICES ----------------- */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Поиск товара..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                {/* Category filter */}
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500 cursor-pointer"
                >
                  <option value="all">Все категории</option>
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Add New Product Button */}
              <button
                onClick={handleOpenAddProduct}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-red-950 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить новый товар</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-card/90 text-muted-foreground font-mono uppercase text-[11px] border-b border-border">
                    <tr>
                      <th className="py-3 px-4">Товар</th>
                      <th className="py-3 px-4">Категория</th>
                      <th className="py-3 px-4">Цена (₽)</th>
                      <th className="py-3 px-4">Старая цена</th>
                      <th className="py-3 px-4">Статус</th>
                      <th className="py-3 px-4">Остаток</th>
                      <th className="py-3 px-4 text-right">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80 text-muted-foreground">
                    {filteredProducts.map((p) => {
                      return (
                        <tr key={p.id} className="hover:bg-card/40 transition-colors">
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-lg object-cover bg-background shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white leading-snug line-clamp-1 max-w-xs">
                                  {p.name}
                                </div>
                                <div className="text-[11px] text-muted-foreground font-mono">
                                  {p.size || 'Стандарт'} · {p.badge ? `[${p.badge}]` : ''}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 text-muted-foreground font-mono">
                            {p.categoryName}
                          </td>

                          {/* Price with quick inline edit */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                defaultValue={p.price}
                                onChange={(e) => setInlinePrices({ ...inlinePrices, [p.id]: Number(e.target.value) })}
                                className="w-20 bg-card border border-border rounded px-2 py-1 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-primary-500"
                              />
                              {inlinePrices[p.id] !== undefined && inlinePrices[p.id] !== p.price && (
                                <button
                                  onClick={() => updateProduct(p.id, { price: inlinePrices[p.id] })}
                                  className="p-1 bg-primary text-white rounded hover:bg-primary-500"
                                  title="Сохранить цену"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>

                          {/* Old Price */}
                          <td className="py-3 px-4 text-muted-foreground font-mono tabular-nums">
                            {p.oldPrice ? `${p.oldPrice} ₽` : '—'}
                          </td>

                          {/* In Stock toggle */}
                          <td className="py-3 px-4">
                            <button
                              onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                              className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                                p.inStock
                                  ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-400'
                                  : 'bg-amber-950/60 border border-amber-800/60 text-amber-400'
                              }`}
                            >
                              {p.inStock ? 'В наличии' : 'Предзаказ'}
                            </button>
                          </td>

                          {/* Stock count */}
                          <td className="py-3 px-4 font-mono text-muted-foreground">
                            {p.stockCount ?? '10'} шт
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProduct({ ...p });
                                  setIsNewProduct(false);
                                }}
                                className="p-1.5 text-muted-foreground hover:text-white bg-card hover:bg-muted rounded transition-colors"
                                title="Редактировать товар"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Удалить товар «${p.name}»?`)) {
                                    deleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 text-muted-foreground hover:text-primary-400 bg-card hover:bg-muted rounded transition-colors"
                                title="Удалить товар"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ----------------- TAB 2: SHELVES ----------------- */}
        {activeAdminTab === 'shelves' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
              <div>
                <div className="font-bold text-white text-sm">Офлайн витрины в городах</div>
                <div className="text-xs text-muted-foreground">Добавляйте адреса новых полочек или меняйте даты завозов.</div>
              </div>
              <button
                onClick={handleOpenAddShelf}
                className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Добавить полочку</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {shelves.map((s) => (
                <div key={s.id} className="bg-card rounded-xl border border-border p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono font-bold text-primary-400 bg-primary-950/60 px-2.5 py-0.5 rounded">
                        {s.city}
                      </span>
                      <span className="text-xs font-mono font-bold text-white bg-muted px-2 py-0.5 rounded">
                        {s.shelfNumber}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-white mb-1">{s.storeName}</div>
                    <div className="text-xs text-muted-foreground mb-2">{s.address}</div>
                    <div className="text-xs font-mono text-emerald-400 bg-emerald-950/30 p-2 rounded mb-3">
                      {s.statusText}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      Товары: {s.itemsAvailable.join(', ')}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingShelf({ ...s });
                        setIsNewShelf(false);
                      }}
                      className="px-3 py-1.5 bg-card hover:bg-muted text-xs text-white rounded transition-colors"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Удалить полочку ${s.storeName}?`)) {
                          deleteShelf(s.id);
                        }
                      }}
                      className="px-3 py-1.5 bg-card hover:bg-primary-950 text-xs text-primary-400 rounded transition-colors"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ----------------- TAB 3: ORDERS ----------------- */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
              <div>
                <div className="font-bold text-white text-sm">История заказов клиентов ({orders.length})</div>
                <div className="text-xs text-muted-foreground">Заказы, оформленные через сайт. Вы можете связаться с покупателем в Telegram.</div>
              </div>
              {orders.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Очистить всю историю заказов?')) clearOrders();
                  }}
                  className="px-3 py-1.5 bg-card hover:bg-muted text-xs text-muted-foreground hover:text-white rounded-lg transition-colors"
                >
                  Очистить историю
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
                <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <div className="text-sm font-bold text-white mb-1">Пока нет заказов</div>
                <div className="text-xs">Оформите тестовый заказ на сайте, и он сразу появится здесь.</div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div key={ord.id} className="bg-card rounded-xl border border-border p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-primary-500 mr-2">
                          #{ord.id}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {ord.date}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Статус:</span>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderRecord['status'])}
                          className="bg-card border border-border text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:border-primary-500"
                        >
                          <option value="new">Новый</option>
                          <option value="processing">В обработке</option>
                          <option value="shipped">Отправлен (трек)</option>
                          <option value="completed">Завершен</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Customer Info */}
                      <div className="bg-card/60 p-3.5 rounded-lg border border-border space-y-1">
                        <div className="text-[11px] font-mono uppercase text-muted-foreground mb-1">Данные клиента:</div>
                        <div className="font-semibold text-white">{ord.values.fullName || 'Без имени'}</div>
                        <div className="text-primary-400 font-mono">Telegram: {ord.values.telegramUsername || '—'}</div>
                        <div className="text-muted-foreground">Тел: {ord.values.phone || '—'}</div>
                        <div className="text-muted-foreground">
                          Адрес: {ord.values.city ? `${ord.values.city}, ${ord.values.address}` : '—'}
                        </div>
                        {ord.values.comment && (
                          <div className="text-amber-400 pt-1">Коммент: «{ord.values.comment}»</div>
                        )}
                      </div>

                      {/* Items Info */}
                      <div className="bg-card/60 p-3.5 rounded-lg border border-border space-y-1">
                        <div className="text-[11px] font-mono uppercase text-muted-foreground mb-1">
                          Товары ({ord.items.reduce((s, i) => s + i.quantity, 0)} шт):
                        </div>
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-muted-foreground">
                            <span className="truncate pr-2">{it.product.name} x{it.quantity}</span>
                            <span className="font-mono text-white tabular-nums">
                              {(it.product.price * it.quantity).toLocaleString('ru-RU')} ₽
                            </span>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-border flex justify-between font-bold text-white">
                          <span>Итого с доставкой:</span>
                          <span className="text-primary-500 font-mono tabular-nums">
                            {ord.total.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick action: Open Telegram with buyer */}
                    {ord.values.telegramUsername && (
                      <div className="flex justify-end pt-2">
                        <a
                          href={`https://t.me/${ord.values.telegramUsername.replace('@', '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-muted border border-border text-xs text-white rounded-lg transition-colors"
                        >
                          <Send className="w-3 h-3 text-primary-500" />
                          <span>Написать покупателю в Telegram</span>
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ----------------- TAB 4: SETTINGS & BACKUP ----------------- */}
        {activeAdminTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-base font-bold text-white">Резервное копирование и управление данными</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Все изменения товаров, цен и заказов сохраняются в локальном хранилище вашего браузера (localStorage). Вы можете экспортировать базу в файл или сбросить всё до изначального состояния Fraiters.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-border">
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-muted border border-border text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>Скачать резервную копию (JSON)</span>
                </button>

                <label className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-muted border border-border text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer">
                  <Upload className="w-4 h-4 text-blue-400" />
                  <span>Загрузить базу из JSON</span>
                  <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                </label>

                <button
                  onClick={() => {
                    if (confirm('Сбросить весь каталог товаров к стандартным позициям?')) {
                      resetProducts();
                      resetShelves();
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-card hover:bg-primary-950/60 border border-primary-900/60 text-xs font-semibold text-primary-400 rounded-lg transition-colors cursor-pointer ml-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Сбросить к исходным товарам</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ----------------- PRODUCT EDIT MODAL ----------------- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h2 className="text-lg font-bold text-white">
                {isNewProduct ? 'Добавить новый товар' : 'Редактировать товар'}
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1.5 text-muted-foreground hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Название товара *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Категория</label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const cat = e.target.value as ProductCategory;
                      const catObj = CATEGORIES.find((c) => c.id === cat);
                      setEditingProduct({
                        ...editingProduct,
                        category: cat,
                        categoryName: catObj ? catObj.label : 'Мерч',
                      });
                    }}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                  >
                    {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Бейдж / Стикер (опционально)</label>
                  <input
                    type="text"
                    placeholder="Например: Хит продаж / Новинка"
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Цена (₽) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Старая цена со скидкой</label>
                  <input
                    type="number"
                    placeholder="Не обязательно"
                    value={editingProduct.oldPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Остаток на складе (шт)</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount || 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={editingProduct.inStock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                    className="rounded bg-card border-border text-primary focus:ring-primary-500"
                  />
                  <span>Товар есть в наличии (иначе Предзаказ)</span>
                </label>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">URL изображения</label>
                <input
                  type="url"
                  required
                  value={editingProduct.image}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Размер / Габариты</label>
                  <input
                    type="text"
                    value={editingProduct.size}
                    onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Материал</label>
                  <input
                    type="text"
                    value={editingProduct.material}
                    onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Описание товара</label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg p-3 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-500 rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  {isNewProduct ? 'Создать товар' : 'Сохранить изменения'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- SHELF EDIT MODAL ----------------- */}
      {editingShelf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <h2 className="text-lg font-bold text-white">
                {isNewShelf ? 'Добавить полочку' : 'Редактировать полочку'}
              </h2>
              <button onClick={() => setEditingShelf(null)} className="p-1 text-muted-foreground hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShelf} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Город *</label>
                  <input
                    type="text"
                    required
                    value={editingShelf.city}
                    onChange={(e) => setEditingShelf({ ...editingShelf, city: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground mb-1 font-medium">Номер полки *</label>
                  <input
                    type="text"
                    required
                    value={editingShelf.shelfNumber}
                    onChange={(e) => setEditingShelf({ ...editingShelf, shelfNumber: e.target.value })}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Название магазина *</label>
                <input
                  type="text"
                  required
                  value={editingShelf.storeName}
                  onChange={(e) => setEditingShelf({ ...editingShelf, storeName: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Точный адрес *</label>
                <input
                  type="text"
                  required
                  value={editingShelf.address}
                  onChange={(e) => setEditingShelf({ ...editingShelf, address: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-muted-foreground mb-1 font-medium">Статус завоза</label>
                <input
                  type="text"
                  value={editingShelf.statusText}
                  onChange={(e) => setEditingShelf({ ...editingShelf, statusText: e.target.value })}
                  className="w-full bg-card border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingShelf(null)}
                  className="px-4 py-2 text-xs text-muted-foreground hover:text-white"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-500 rounded-lg transition-colors cursor-pointer"
                >
                  Сохранить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
