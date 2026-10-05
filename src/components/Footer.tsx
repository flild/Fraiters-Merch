'use client';

import React from 'react';
import Link from 'next/link';
import { Send, Heart, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { href: '/catalog', label: 'Каталог мерча' },
    { href: '/shelves', label: 'Полочки в городах' },
    { href: '/delivery', label: 'Доставка и оплата' },
    { href: '/reviews', label: 'Отзывы покупателей' },
    { href: '/faq', label: 'Частые вопросы' },
    { href: '/admin', label: 'Управление магазином (Админка)' },
  ];

  return (
    <footer className="bg-background border-t border-border/80 pt-16 pb-24 lg:pb-12 text-muted-foreground text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-border/80">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-block font-extrabold text-2xl text-white font-mono uppercase tracking-tight text-left cursor-pointer"
            >
              FRAITERS<span className="text-primary">.</span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-xs leading-relaxed">
              Официальный магазин мерча паблика Fraiters. Акриловые стенды, диорамы,
              голографические брелоки, открытки и одежда с доставкой по всей России и витринами в арт-шопах.
            </p>
            <div className="pt-2">
              <a
                href="https://t.me/fraiters"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-card border border-border hover:border-primary text-white rounded-lg transition-colors font-mono"
              >
                <Send className="w-3.5 h-3.5 text-primary-500" />
                <span>t.me/fraiters</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="md:col-span-3 space-y-3">
            <div className="font-mono uppercase text-white font-bold text-xs tracking-wider">
              Навигация
            </div>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-primary-400 transition-colors text-left cursor-pointer block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Offline Shelves & Contacts */}
          <div className="md:col-span-4 space-y-3">
            <div className="font-mono uppercase text-white font-bold text-xs tracking-wider">
              Города с полочками
            </div>
            <p className="text-muted-foreground leading-relaxed text-xs">
              Москва (Твоя Полка), Санкт-Петербург (Полка Чудес), Казань (КрафтЛавка), Екатеринбург (Craft Corner).
            </p>
            <div className="pt-2 text-[11px] text-muted-foreground">
              По вопросам оптовых заказов, маркетов и предложений пишите в ЛС Telegram:{' '}
              <a
                href="https://t.me/fraiters"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:underline"
              >
                @fraiters
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground text-[11px]">
          <div>
            © {new Date().getFullYear()} FRAITERS MERCH. Все права защищены. Авторский проект.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Наверх</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
