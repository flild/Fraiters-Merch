'use client';

import React from 'react';
import { CheckCircle2, Send, Copy, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function OrderSuccessModal() {
  const { lastOrder, closeOrderSuccess } = useCart();
  const [copied, setCopied] = React.useState(false);

  if (!lastOrder) return null;

  const copyOrderId = () => {
    navigator.clipboard.writeText(lastOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openTelegramWithOrder = () => {
    const text = encodeURIComponent(
      `Здравствуйте! Я оформил заказ #${lastOrder.id} на сайте Fraiters Merch на сумму ${lastOrder.total.toLocaleString('ru-RU')} ₽. Имя: ${lastOrder.values.fullName || '—'}. Хочу подтвердить и оплатить.`
    );
    window.open(`https://t.me/fraiters?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#0e1017] border border-red-900/60 rounded-2xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        
        {/* Glow */}
        <div 
          aria-hidden="true" 
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-600/20 rounded-full blur-3xl -z-10" 
        />

        {/* Success Icon */}
        <div className="w-16 h-16 rounded-2xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="text-xs font-mono uppercase text-emerald-400 font-semibold mb-1">
          Заказ успешно сформирован
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Спасибо за заказ мерча!
        </h3>

        <p className="text-xs sm:text-sm text-neutral-300 max-w-sm mx-auto mb-6">
          Номер вашего заказа сохранен. Для быстрого подтверждения и выставления трек-номера напишите нам в Telegram.
        </p>

        {/* Order Number Box */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div className="text-left">
            <div className="text-[10px] font-mono uppercase text-neutral-500">Номер заказа</div>
            <div className="text-base font-mono font-extrabold text-red-500 tracking-wider">
              {lastOrder.id}
            </div>
          </div>
          <button
            onClick={copyOrderId}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded-lg transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Скопировано!' : 'Скопировать'}</span>
          </button>
        </div>

        {/* Order Items Summary */}
        <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-900 text-xs text-neutral-300 text-left mb-6 space-y-2 max-h-40 overflow-y-auto">
          <div className="font-semibold text-white text-[11px] uppercase font-mono border-b border-neutral-800 pb-1">
            Состав заказа:
          </div>
          {lastOrder.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center text-neutral-400">
              <span className="truncate pr-2">{item.product.name} x{item.quantity}</span>
              <span className="font-mono text-white shrink-0">
                {(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽
              </span>
            </div>
          ))}
          <div className="pt-2 border-t border-neutral-800 flex justify-between font-bold text-white">
            <span>Итого к оплате:</span>
            <span className="text-red-400 font-mono">
              {lastOrder.total.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={openTelegramWithOrder}
            className="w-full py-3.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Подтвердить в Telegram @fraiters</span>
          </button>

          <button
            onClick={closeOrderSuccess}
            className="w-full py-2.5 px-4 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Вернуться в магазин
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-neutral-500">
          <Sparkles className="w-3.5 h-3.5 text-red-500" />
          <span>Подарочные стикеры и открытка уже ждут вас в посылке!</span>
        </div>

      </div>
    </div>
  );
}
