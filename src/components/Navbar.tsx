'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Send, Menu, X, ShieldCheck, Settings } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { AppSection } from '@/types';

export default function Navbar() {
  const { totalItems, subtotal, setIsCartOpen, activeSection, setActiveSection } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: AppSection; label: string }[] = [
    { id: 'home', label: 'Главная' },
    { id: 'catalog', label: 'Каталог' },
    { id: 'shelves', label: 'Полочки' },
    { id: 'delivery', label: 'Доставка' },
    { id: 'reviews', label: 'Отзывы' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleNavClick = (section: AppSection) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top micro announcement bar with sales trigger */}
      <div className="bg-primary-950 border-b border-primary-950/60 text-xs py-1.5 px-4 text-center text-primary-200 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
        <span className="font-medium">
          Осенний дроп открыт · Отправка заказов в течение 1–3 дней · Скидки на комбо-сеты до 15%
        </span>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 group tracking-tight text-left cursor-pointer"
          >
            <span className="font-extrabold text-xl sm:text-2xl text-white group-hover:text-primary-500 transition-colors uppercase font-mono">
              FRAITERS<span className="text-primary">.</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-primary-950/70 border border-primary-800/60 text-primary-300 rounded">
              MERCH
            </span>
          </motion.button>

          {/* Clean Navigation Links with smooth sliding layoutId pill */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive ? 'text-white font-semibold' : 'text-muted-foreground hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-primary-950/70 border border-primary-800/60 rounded-lg -z-10 shadow-sm shadow-red-950/40"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    {item.id === 'catalog' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block align-middle" />
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Telegram Channel Button */}
            <motion.a
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              href="https://t.me/fraiters"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-card border border-border/80 hover:border-primary/70 hover:bg-muted/90 rounded-lg transition-all"
              title="Перейти в Telegram-канал @fraiters"
            >
              <Send className="w-3.5 h-3.5 text-primary-500 shrink-0" />
              <span className="hidden sm:inline font-mono">@fraiters</span>
              <span className="sm:hidden font-mono">TG</span>
            </motion.a>

            {/* Admin Panel Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavClick('admin')}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                activeSection === 'admin'
                  ? 'bg-primary text-white border-primary-500 shadow-md shadow-red-950'
                  : 'bg-card border-border text-muted-foreground hover:text-white hover:border-primary/50'
              }`}
              title="Панель администратора (товары, цены, заказы)"
            >
              <Settings className="w-4 h-4 text-primary-500" />
            </motion.button>

            {/* Shopping Cart Button */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-500 rounded-lg transition-all shadow-lg shadow-red-950/40 cursor-pointer"
              aria-label="Открыть корзину"
            >
              <ShoppingBag className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Корзина</span>
              {totalItems > 0 && (
                <div className="flex items-center gap-1.5">
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0.6 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-white bg-black rounded-full tabular-nums"
                  >
                    {totalItems}
                  </motion.span>
                  <span className="hidden lg:inline text-[11px] font-mono tabular-nums opacity-90">
                    · {subtotal.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              )}
            </motion.button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-muted-foreground hover:text-white cursor-pointer"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden bg-background border-b border-border px-6 py-4 flex flex-col gap-2 text-sm overflow-hidden"
            >
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-950/60 text-primary-400 font-semibold border border-primary-800/40'
                        : 'text-foreground hover:bg-card'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="text-xs text-primary-500 font-mono">Выбрано</span>}
                  </button>
                );
              })}

              {/* Admin link in mobile menu */}
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center justify-between text-left py-2.5 px-3 rounded-lg transition-colors ${
                  activeSection === 'admin'
                    ? 'bg-primary-950/60 text-primary-400 font-semibold border border-primary-800/40'
                    : 'text-muted-foreground hover:bg-card'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary-500" />
                  <span>Панель управления (Админка)</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 bg-muted text-muted-foreground rounded">
                  Admin
                </span>
              </button>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <a
                  href="https://t.me/fraiters"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-primary-400 hover:underline flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  Telegram @fraiters
                </a>
                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" /> Официальный мерч
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating Mobile Bottom Navigation Bar with animated active indicator */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-lg border-t border-border py-1.5 px-2 flex items-center justify-around shadow-2xl">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-lg text-[11px] transition-colors ${
                isActive ? 'text-primary-400 font-bold' : 'text-muted-foreground hover:text-white'
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeBottomDot"
                  className="w-1 h-1 rounded-full bg-primary-500 mt-0.5"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-2 text-[11px] text-muted-foreground hover:text-white"
        >
          <span className="font-semibold text-primary-400">Корзина</span>
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[9px] font-bold">
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
