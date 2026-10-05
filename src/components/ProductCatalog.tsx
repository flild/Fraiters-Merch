'use client';
import Image from 'next/image';
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import { Product, ProductCategory } from '@/types';
import { useCart } from '@/lib/cart-context';

export default function ProductCatalog({ limit }: { limit?: number }) {
  const { addToCart, setQuickViewProduct, cart, products } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const filteredProducts = useMemo(() => {
    let result = products.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !onlyInStock || item.inStock;
      return matchesCategory && matchesSearch && matchesStock;
    });

    if (limit) {
      result = result.slice(0, limit);
    }

    return result;
  }, [products, selectedCategory, searchQuery, onlyInStock, limit]);

  const handleAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1500);
  };

  return (
    <section id="catalog" className="py-16 md:py-24 border-b border-border/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
              <span className="text-primary-500 font-semibold uppercase">Каталог</span>
              <span aria-hidden="true">·</span>
              <span>Оригинальные позиции</span>
              <span aria-hidden="true">·</span>
              <span className="tabular-nums">{products.length} позиций</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Товары и мерч
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-xl">
              Каждый предмет создан по оригинальным дизайнам паблика Fraiters.
              Двусторонняя печать, премиальный акрил и долговечные материалы.
            </p>
          </div>

          {/* Search Bar */}
          <div className="w-full md:w-72 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по мерчу..."
              className="w-full pl-10 pr-4 py-2.5 bg-card/90 border border-border text-sm text-white placeholder-neutral-500 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Tabs & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80 mb-8">
          {/* Segmented Category Buttons with smooth layoutId animation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ProductCategory)}
                  className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-muted-foreground hover:text-white bg-card/60 border border-border'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCatalogCategoryPill"
                      className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm shadow-red-950"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* In stock toggle */}
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer select-none self-start sm:self-auto shrink-0">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded bg-card border-border text-primary focus:ring-primary-500"
            />
            <span>Только в наличии</span>
          </label>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-card/30 border border-border">
            <p className="text-muted-foreground text-base">По вашему запросу ничего не найдено.</p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setOnlyInStock(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-muted hover:bg-primary rounded-lg transition-colors cursor-pointer"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product, idx) => {
              const isAdded = addedIds[product.id];
              const cartItem = cart.find((i) => i.product.id === product.id);

              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  onClick={() => setQuickViewProduct(product)}
                  className="group relative bg-card rounded-xl border border-border/90 hover:border-primary/60 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-red-950/30 cursor-pointer"
                >
                  {/* Image container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-card">
                    {/* Badge if present */}
                    {product.badge && (
                      <div className="absolute top-2.5 left-2.5 z-10 text-[10px] font-mono uppercase tracking-wider font-semibold text-white bg-primary px-2 py-0.5 rounded shadow">
                        {product.badge}
                      </div>
                    )}

                    {/* Stock status indicator */}
                    <div className="absolute top-2.5 right-2.5 z-10 text-[10px] font-mono px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-muted-foreground border border-border/60 flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.inStock ? 'bg-emerald-400' : 'bg-amber-400'
                        }`}
                      />
                      <span>{product.inStock ? 'В наличии' : 'Предзаказ'}</span>
                    </div>

                    {/* Product Image with Fallback */}
                    <Image
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      fill
                      unoptimized
                      onError={(e) => {
                        // Resilient Fallback to stylized SVG card
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const fallback = parent.querySelector('.fallback-layer');
                          if (fallback) fallback.classList.remove('hidden');
                        }
                      }}
                    />

                    {/* Styled Fallback container */}
                    <div className={`fallback-layer hidden absolute inset-0 bg-gradient-to-br ${product.fallbackGradient} flex flex-col items-center justify-center p-4 text-center`}>
                      <Sparkles className="w-8 h-8 text-primary-500 mb-2 opacity-80" />
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {product.categoryName}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                        {product.name}
                      </span>
                    </div>

                    {/* Quick view button overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
                      <span className="px-3 py-1.5 text-xs font-medium text-white bg-card/90 rounded-md border border-border flex items-center gap-1.5 shadow">
                        <Eye className="w-3.5 h-3.5 text-primary-400" />
                        <span>Подробнее</span>
                      </span>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="text-[11px] uppercase font-mono tracking-wider text-muted-foreground mb-1">
                      {product.categoryName}
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors line-clamp-2 mb-2 leading-snug">
                      {product.name}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                      {product.description}
                    </p>

                    <div className="text-[11px] text-muted-foreground mb-4 flex items-center gap-2">
                      <span className="font-mono text-muted-foreground">{product.size}</span>
                    </div>

                    {/* Price and Cart Button Bar */}
                    <div className="mt-auto pt-3 border-t border-border/80 flex items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-extrabold text-white font-mono tabular-nums">
                          {product.price.toLocaleString('ru-RU')} ₽
                        </span>
                        {product.oldPrice && (
                          <span className="text-xs text-muted-foreground line-through font-mono tabular-nums">
                            {product.oldPrice.toLocaleString('ru-RU')} ₽
                          </span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAdd(product, e)}
                        className={`px-3 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-primary hover:bg-primary-500 text-white shadow-md shadow-red-950'
                        }`}
                        title="Добавить в корзину"
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>В корзине!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>
                              {cartItem ? `+1 (${cartItem.quantity})` : 'Купить'}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

      </div>
    </section>
  );
}
