import React from 'react';
import { ClipboardList, Send } from 'lucide-react';
import { OrderRecord, CartItem } from '@/types';

interface AdminOrdersTabProps {
  orders: OrderRecord[];
  updateOrderStatus: (id: string, status: OrderRecord['status']) => void;
  clearOrders: () => void;
}

export function AdminOrdersTab({
  orders,
  updateOrderStatus,
  clearOrders,
}: AdminOrdersTabProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border">
        <div>
          <div className="font-bold text-white text-sm">История заказов клиентов ({orders.length})</div>
          <div className="text-xs text-muted-foreground">Заказы, оформленные через сайт. Вы можете связаться с покупателем в Telegram.</div>
        </div>
        {orders.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Очистить всю историю заказов?')) clearOrders();
            }}
            className="px-3 py-1.5 bg-card hover:bg-muted text-xs text-muted-foreground hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Очистить историю
          </button>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center text-muted-foreground">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <div className="text-sm font-bold text-white mb-1">Пока нет заказов</div>
          <div className="text-xs">Оформите тестовый заказ на сайте, и он сразу появится здесь.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-card rounded-xl border border-border p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
                <div>
                  <span className="text-xs font-mono font-bold text-primary-500 mr-2">
                    #{ord.id}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {ord.date}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Статус:</span>
                  <select
                    value={ord.status}
                    onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderRecord['status'])}
                    className="bg-card border border-border text-xs text-white rounded px-2.5 py-1 focus:outline-none focus:border-primary-500 cursor-pointer"
                  >
                    <option value="new">Новый</option>
                    <option value="processing">В обработке</option>
                    <option value="shipped">Отправлен (трек)</option>
                    <option value="completed">Завершен</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Customer Info */}
                <div className="bg-card/60 p-3.5 rounded-lg border border-border space-y-1">
                  <div className="text-[11px] font-mono uppercase text-muted-foreground mb-1">Данные клиента:</div>
                  <div className="font-semibold text-white">{ord.values.fullName || 'Без имени'}</div>
                  <div className="text-primary-400 font-mono">Telegram: {ord.values.telegramUsername || '—'}</div>
                  <div className="text-muted-foreground">Тел: {ord.values.phone || '—'}</div>
                  <div className="text-muted-foreground">
                    Адрес: {ord.values.city ? `${ord.values.city}, ${ord.values.address}` : '—'}
                  </div>
                  {ord.values.comment && (
                    <div className="text-amber-400 pt-1">Коммент: «{ord.values.comment}»</div>
                  )}
                </div>

                {/* Items Info */}
                <div className="bg-card/60 p-3.5 rounded-lg border border-border space-y-1">
                  <div className="text-[11px] font-mono uppercase text-muted-foreground mb-1">
                    Товары ({ord.items.reduce((s: number, i: CartItem) => s + i.quantity, 0)} шт):
                  </div>
                  {ord.items.map((it: CartItem, idx: number) => (
                    <div key={idx} className="flex justify-between text-muted-foreground">
                      <span className="truncate pr-2">{it.product.name} x{it.quantity}</span>
                      <span className="font-mono text-white tabular-nums">
                        {(it.product.price * it.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-border flex justify-between font-bold text-white">
                    <span>Итого с доставкой:</span>
                    <span className="text-primary-500 font-mono tabular-nums">
                      {ord.total.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick action: Open Telegram with buyer */}
              {ord.values.telegramUsername && (
                <div className="flex justify-end pt-2">
                  <a
                    href={`https://t.me/${ord.values.telegramUsername.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-card hover:bg-muted border border-border text-xs text-white rounded-lg transition-colors"
                  >
                    <Send className="w-3 h-3 text-primary-500" />
                    <span>Написать покупателю в Telegram</span>
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
