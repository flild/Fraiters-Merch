'use client';

import React from 'react';
import { Send, Bell, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TelegramBanner() {
  return (
    <section className="py-12 bg-gradient-to-b from-[#0a0b0e] to-[#0d0e14] border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden border border-red-900/50 bg-gradient-to-r from-neutral-950 via-[#140b0e] to-neutral-950 p-8 sm:p-12 shadow-2xl">
          
          {/* Subtle red background flare */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute right-0 top-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl -z-10" 
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-800/60 rounded-full text-xs font-mono text-red-300">
                <Bell className="w-3.5 h-3.5 text-red-400" />
                <span>Главный хаб комьюнити</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Все дропы и закрытые предзаказы — в Telegram <span className="text-red-500 font-mono">@fraiters</span>
              </h2>

              <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
                Подписывайтесь на наш паблик, чтобы первыми видеть процессы создания артов, голосовать за новые дизайны стендов, участвовать в розыгрышах мерча и забирать лимитки до релиза на сайте.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-neutral-400">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Прямой контакт с автором
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Sparkles className="w-4 h-4 text-red-400" />
                  Эксклюзивные розыгрыши мерча
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch gap-3">
              <a
                href="https://t.me/fraiters"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 text-sm font-bold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-xl shadow-red-950/60 active:scale-95 text-center group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Перейти в @fraiters</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="text-center text-[11px] text-neutral-500 font-mono">
                Ссылка откроется в приложении Telegram
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
