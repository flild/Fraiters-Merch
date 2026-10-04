'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Send, ArrowRight, Sparkles, MapPin, PackageCheck, Layers, Store, Truck, MessageSquare } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function Hero() {
  const { setActiveSection } = useCart();

  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20 border-b border-border/80">
      {/* Background ambient red glow with gentle breathing animation */}
      <motion.div 
        aria-hidden="true" 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.14, 0.22, 0.14] 
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          ease: 'easeInOut' 
        }}
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/20 rounded-full blur-[140px] -z-10"
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute bottom-0 right-0 w-[450px] h-[350px] bg-primary-950/25 rounded-full blur-[120px] -z-10"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call to actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-4">
              <span className="text-primary-500 font-semibold tracking-wide uppercase">Официальный магазин</span>
              <span aria-hidden="true">·</span>
              <span>Telegram: @fraiters</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Дроп 2026</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase font-sans leading-[1.08] text-balance mb-5">
              Авторский мерч <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-red-400">
                Fraiters
              </span>{' '}
              в деталях
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-8">
              Коллекционные акриловые стенды, диорамы, голографические брелоки,
              стикерпаки и плотные оверсайз худи. Бережная упаковка в пупырку и картон,
              быстрая доставка по всей России или самовывоз с полочек.
            </p>

            {/* CTAs with direct Section switching */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto mb-10">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveSection('catalog')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-primary hover:bg-primary-500 rounded-lg shadow-lg shadow-red-900/40 transition-all cursor-pointer"
              >
                <span>Перейти в каталог</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveSection('shelves')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-medium text-foreground bg-card/80 hover:bg-muted border border-border/80 hover:border-primary/50 rounded-lg transition-all cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-primary-500" />
                <span>Где купить вживую (Полочки)</span>
              </motion.button>

              <motion.a
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                href="https://t.me/fraiters"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-white bg-transparent hover:bg-card/50 border border-transparent hover:border-border rounded-lg transition-all"
              >
                <Send className="w-4 h-4 text-blue-400" />
                <span>Паблик в Telegram</span>
              </motion.a>
            </div>

            {/* Quick Section Jump Cards with animated lift */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-8">
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection('catalog')}
                className="p-3 rounded-xl bg-card/70 border border-border hover:border-primary/60 text-left transition-all cursor-pointer group"
              >
                <Store className="w-4 h-4 text-primary-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">Каталог</div>
                <div className="text-[11px] text-muted-foreground">10 позиций мерча</div>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection('shelves')}
                className="p-3 rounded-xl bg-card/70 border border-border hover:border-primary/60 text-left transition-all cursor-pointer group"
              >
                <MapPin className="w-4 h-4 text-primary-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">Полочки</div>
                <div className="text-[11px] text-muted-foreground">4 города в наличии</div>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection('delivery')}
                className="p-3 rounded-xl bg-card/70 border border-border hover:border-primary/60 text-left transition-all cursor-pointer group"
              >
                <Truck className="w-4 h-4 text-primary-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">Доставка</div>
                <div className="text-[11px] text-muted-foreground">СДЭК & Почта РФ</div>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSection('reviews')}
                className="p-3 rounded-xl bg-card/70 border border-border hover:border-primary/60 text-left transition-all cursor-pointer group"
              >
                <MessageSquare className="w-4 h-4 text-primary-500 mb-1.5 group-hover:scale-110 transition-transform" />
                <div className="text-xs font-bold text-white">Отзывы</div>
                <div className="text-[11px] text-muted-foreground">Рейтинг 5.0 ★</div>
              </motion.button>
            </div>

            {/* Micro feature proofs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-border/80 w-full text-xs text-muted-foreground">
              <div className="flex items-start gap-2.5">
                <PackageCheck className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground">Пупырка + картон</div>
                  <div className="text-muted-foreground">Защитная пленка на акриле</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground">Бонус к заказу</div>
                  <div className="text-muted-foreground">Подарочные стикеры в конверте</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5 col-span-2 sm:col-span-1">
                <Layers className="w-4 h-4 text-primary-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground">4 города в наличии</div>
                  <div className="text-muted-foreground">Москва, СПб, Казань, Екб</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Drop Showcase Bento with subtle hover float */}
          <div className="lg:col-span-5 relative">
            <motion.div 
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative rounded-2xl p-1 bg-gradient-to-b from-red-600/40 via-neutral-800 to-neutral-900 shadow-2xl"
            >
              <div className="relative rounded-[14px] bg-card p-5 sm:p-6 overflow-hidden">
                
                {/* Visual badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold text-primary-400 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-primary-500 animate-ping inline-block" />
                    Актуальный дроп
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Осень 2026
                  </span>
                </div>

                {/* Hero featured visual composition */}
                <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden bg-gradient-to-br from-red-950 via-neutral-900 to-black border border-border flex items-center justify-center p-6 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/30 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Decorative stylized anime merch preview graphics */}
                  <div className="relative z-10 flex flex-col items-center">
                    <motion.div 
                      whileHover={{ scale: 1.08, rotate: 2 }}
                      className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 p-0.5 shadow-xl shadow-red-950/60 mb-4 transition-transform"
                    >
                      <div className="w-full h-full bg-background rounded-[14px] flex items-center justify-center">
                        <span className="text-3xl font-black font-mono text-primary-500">FR</span>
                      </div>
                    </motion.div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                      Коллекция «Crimson Requiem»
                    </div>
                    <p className="text-xs text-muted-foreground max-w-xs mb-3">
                      Стенд 15.5 см + Голографический брелок + Стикерсет А5
                    </p>
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground bg-black/60 px-3 py-1.5 rounded-md border border-border">
                      <span>Сет по спеццене:</span>
                      <span className="font-bold text-primary-400 tabular-nums">1 650 ₽</span>
                      <span className="line-through text-muted-foreground tabular-nums">1 790 ₽</span>
                    </div>
                  </div>
                </div>

                {/* Quick Info bar under preview */}
                <div className="mt-4 pt-4 border-t border-border/80 flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Все товары в наличии</span>
                  </div>
                  <button
                    onClick={() => setActiveSection('catalog')}
                    className="font-medium text-primary-400 hover:text-primary-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Выбрать в каталоге</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </motion.div>

            {/* Telegram Channel floating invitation box */}
            <div className="mt-3 bg-card/90 border border-border rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary/20 text-primary-400 flex items-center justify-center shrink-0">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Паблик авторов Fraiters</div>
                  <div className="text-muted-foreground text-[11px]">t.me/fraiters — спойлеры, процессы и арты</div>
                </div>
              </div>
              <a
                href="https://t.me/fraiters"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-muted hover:bg-primary text-white font-medium rounded-md transition-colors shrink-0 font-mono text-[11px]"
              >
                Подписаться
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
