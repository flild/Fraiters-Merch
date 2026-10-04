'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Clock, ExternalLink, Sparkles, Navigation, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function ShelvesSection() {
  const { shelves } = useCart();
  const [selectedCity, setSelectedCity] = useState<string>('all');

  const cities = useMemo(() => {
    const unique = Array.from(new Set(shelves.map((s) => s.city)));
    return ['all', ...unique];
  }, [shelves]);

  const filteredShelves = shelves.filter((s) => {
    return selectedCity === 'all' || s.city === selectedCity;
  });

  return (
    <section id="shelves" className="py-16 md:py-24 border-b border-border/80 scroll-mt-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-2">
              <span className="text-primary-500 font-semibold uppercase">Офлайн витрины</span>
              <span aria-hidden="true">·</span>
              <span>Полочки в городах</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">В наличии сегодня</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
              Полочки с мерчем
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-1 max-w-xl">
              Хотите рассмотреть мерч вживую или забрать покупку прямо сегодня?
              Ищите фирменные полочки Fraiters в партнерских арт-магазинах.
            </p>
          </div>

          {/* City filter tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            {cities.map((city) => {
              const isActive = selectedCity === city;
              return (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`relative px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-muted-foreground hover:text-white bg-card border border-border'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeShelfCityPill"
                      className="absolute inset-0 bg-primary rounded-lg -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{city === 'all' ? 'Все города (4)' : city}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info banner: How shelves work */}
        <div className="mb-8 p-4 sm:p-5 rounded-xl bg-gradient-to-r from-red-950/40 via-neutral-900 to-neutral-900 border border-primary-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary-500 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Как покупать на полочках?</div>
              <div className="text-xs text-muted-foreground">
                Приходите в магазин в рабочие часы, подходите к нашей полке, выбираете товары и оплачиваете на обычной кассе магазина картой или наличными.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary-400 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Без платы за доставку</span>
          </div>
        </div>

        {/* Shelves Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredShelves.map((shelf, idx) => (
            <motion.div
              key={shelf.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-card rounded-xl border border-border p-6 flex flex-col justify-between hover:border-primary/60 hover:shadow-xl hover:shadow-red-950/30 transition-colors"
            >
              <div>
                {/* City & shelf number bar */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary-400 bg-primary-950/60 border border-primary-800/40 px-2.5 py-1 rounded">
                    {shelf.city}
                  </span>
                  <span className="text-xs font-mono font-bold text-white bg-muted px-2.5 py-1 rounded">
                    {shelf.shelfNumber}
                  </span>
                </div>

                {/* Store Name */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {shelf.storeName}
                </h3>

                {/* Address & Metro */}
                <div className="space-y-1.5 text-xs text-muted-foreground mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                    <span>{shelf.address}</span>
                  </div>
                  {shelf.metro && (
                    <div className="flex items-center gap-2 text-muted-foreground pl-6">
                      <Navigation className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{shelf.metro}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-muted-foreground pl-6">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    <span>{shelf.workingHours}</span>
                  </div>
                </div>

                {/* Stock restock badge */}
                <div className="mb-4 text-xs font-mono text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{shelf.statusText}</span>
                </div>

                {/* Available merch tags */}
                <div className="mb-6">
                  <div className="text-[11px] font-mono uppercase text-muted-foreground mb-2">
                    В наличии на этой витрине:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {shelf.itemsAvailable.map((item: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 bg-card text-muted-foreground border border-border rounded-md"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-3">
                <span className="text-xs text-muted-foreground">
                  Оплата на кассе магазина
                </span>

                {shelf.yandexMapUrl && (
                  <a
                    href={shelf.yandexMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-muted hover:bg-primary rounded-md transition-colors"
                  >
                    <span>Карта / Маршрут</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
