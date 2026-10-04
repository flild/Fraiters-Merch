'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Check, ShieldAlert, Sparkles, Layers, Ruler } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function ProductModal() {
  const { quickViewProduct, setQuickViewProduct, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const handleAdd = () => {
    addToCart(quickViewProduct, quantity);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setQuickViewProduct(null);
    }, 900);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={() => setQuickViewProduct(null)}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
        className="relative w-full max-w-3xl bg-[#0f1117] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-full transition-colors"
          aria-label="Закрыть"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Product Image */}
        <div className="md:w-1/2 relative bg-neutral-950 flex items-center justify-center min-h-[260px] md:min-h-full">
          <img
            src={quickViewProduct.image}
            alt={quickViewProduct.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover max-h-[420px] md:max-h-full"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = parent.querySelector('.modal-fallback');
                if (fallback) fallback.classList.remove('hidden');
              }
            }}
          />

          <div className={`modal-fallback hidden absolute inset-0 bg-gradient-to-br ${quickViewProduct.fallbackGradient} flex flex-col items-center justify-center p-6 text-center`}>
            <Sparkles className="w-12 h-12 text-red-500 mb-3 opacity-90" />
            <span className="text-sm font-mono font-bold text-white uppercase tracking-wider">
              {quickViewProduct.categoryName}
            </span>
            <span className="text-xs text-neutral-400 mt-2">
              {quickViewProduct.name}
            </span>
          </div>

          {quickViewProduct.badge && (
            <div className="absolute top-4 left-4 z-10 text-xs font-mono font-bold uppercase text-white bg-red-600 px-2.5 py-1 rounded shadow">
              {quickViewProduct.badge}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col overflow-y-auto">
          <div className="text-xs font-mono uppercase text-red-400 mb-1">
            {quickViewProduct.categoryName}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
            {quickViewProduct.name}
          </h2>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {quickViewProduct.price.toLocaleString('ru-RU')} ₽
            </span>
            {quickViewProduct.oldPrice && (
              <span className="text-sm text-neutral-400 line-through font-mono tabular-nums">
                {quickViewProduct.oldPrice.toLocaleString('ru-RU')} ₽
              </span>
            )}
            <span className="ml-auto text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {quickViewProduct.inStock ? 'В наличии' : 'Предзаказ'}
            </span>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed mb-6">
            {quickViewProduct.description}
          </p>

          {/* Specifications */}
          <div className="space-y-2.5 mb-6 text-xs text-neutral-300 bg-neutral-900/60 p-3.5 rounded-xl border border-neutral-800">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-neutral-400">Размер:</span>
              <span className="font-medium text-white">{quickViewProduct.size}</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-red-400 shrink-0" />
              <span className="text-neutral-400">Материал:</span>
              <span className="font-medium text-white">{quickViewProduct.material}</span>
            </div>
          </div>

          {/* Features list */}
          <div className="mb-6">
            <div className="text-xs font-semibold uppercase text-neutral-400 font-mono mb-2">
              Особенности изделия:
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              {quickViewProduct.features.map((feat, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Protective film reminder */}
          <div className="mb-5 p-3 bg-red-950/30 border border-red-900/40 rounded-lg flex items-start gap-2.5 text-xs text-red-200">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Пленка на акриле:</span> Все изделия оклеены защитной матовой пленкой. Перед установкой просто аккуратно снимите ее!
            </div>
          </div>

          {/* Cross-Sell Funnel Suggestion */}
          <div className="mb-5 p-3 bg-neutral-900/80 rounded-xl border border-neutral-800 text-xs">
            <div className="text-[11px] font-mono uppercase text-red-400 font-semibold mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Часто заказывают вместе:</span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span className="truncate pr-2">Стикерпак А5 «Red Void Edition» (+350 ₽)</span>
              <span className="text-[11px] text-emerald-400 font-mono shrink-0">В наличии</span>
            </div>
          </div>

          {/* Buy controls */}
          <div className="mt-auto pt-4 border-t border-neutral-800 flex items-center gap-3">
            <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Уменьшить"
              >
                -
              </button>
              <span className="px-3 py-2 text-xs font-mono font-bold text-white tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Увеличить"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAdd}
              disabled={isAdded}
              className={`flex-1 py-3 px-4 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50 active:scale-95'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Добавлено в заказ!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Добавить в корзину ({((quickViewProduct?.price ?? 0) * quantity).toLocaleString('ru-RU')} ₽)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
