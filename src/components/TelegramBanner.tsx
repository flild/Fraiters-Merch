'use client';

import React from 'react';
import { Send, Bell, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export default function TelegramBanner() {
  return (
    <section className="py-12 bg-gradient-to-b from-background to-background-alt border-b border-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden border border-primary-900/50 bg-gradient-to-r from-neutral-950 via-card-alt to-neutral-950 p-8 sm:p-12 shadow-2xl">
          
          {/* Subtle red background flare */}
          <div 
            aria-hidden="true" 
            className="pointer-events-none absolute right-0 top-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-950/80 border border-primary-800/60 rounded-full text-xs font-mono text-primary-300">
                <Bell className="w-3.5 h-3.5 text-primary-400" />
                <span>Главный хаб комьюнити</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight uppercase">
                Все дропы и закрытые предзаказы — в Telegram <span className="text-primary-500 font-mono">@fraiters</span>
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
                Подписывайтесь на наш паблик, чтобы первыми видеть процессы создания артов, голосовать за новые дизайны стендов, участвовать в розыгрышах мерча и забирать лимитки до релиза на сайте.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-muted-foreground">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Прямой контакт с автором
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="w-4 h-4 text-primary-400" />
                  Эксклюзивные розыгрыши мерча
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch gap-3">
              <a
                href="https://t.me/fraiters"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-4 text-sm font-bold text-white bg-primary hover:bg-primary-500 rounded-xl transition-all shadow-xl shadow-red-950/60 active:scale-95 text-center group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                <span>Перейти в @fraiters</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <div className="text-center text-[11px] text-muted-foreground font-mono">
                Ссылка откроется в приложении Telegram
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
