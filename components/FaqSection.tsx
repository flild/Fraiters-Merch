'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Send } from 'lucide-react';
import { FAQ_LIST } from '@/lib/data';

export default function FaqSection() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // Open first by default
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="faq" className="py-16 md:py-24 border-b border-neutral-800/80 scroll-mt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-neutral-400 mb-2">
            <span className="text-red-500 font-semibold uppercase">База знаний</span>
            <span aria-hidden="true">·</span>
            <span>Помощь покупателю</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Часто задаваемые вопросы
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base mt-2">
            Ответы на популярные вопросы о доставке, пленках на стендах и предзаказах.
          </p>
        </div>

        {/* Accordion items */}
        <div className="space-y-3">
          {FAQ_LIST.map((faq) => {
            const isOpen = !!openIds[faq.id];

            return (
              <div
                key={faq.id}
                className="bg-[#0f1117] rounded-xl border border-neutral-800 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-neutral-900/50 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-red-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-neutral-800/50 animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extra question helper */}
        <div className="mt-8 text-center text-xs text-neutral-400">
          Остались вопросы? Напишите автору напрямую в паблик:{' '}
          <a
            href="https://t.me/fraiters"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:text-red-300 font-medium inline-flex items-center gap-1 underline underline-offset-2"
          >
            <Send className="w-3 h-3" />
            t.me/fraiters
          </a>
        </div>

      </div>
    </section>
  );
}
