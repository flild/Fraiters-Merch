import Image from 'next/image';
import React from 'react';
import { Trash2, Truck, Package, ArrowRight, ShieldCheck } from 'lucide-react';
import { CartItem } from '@/types';

interface CartItemListProps {
  cart: CartItem[];
  subtotal: number;
  deliveryCost: number;
  totalPrice: number;
  selectedDelivery: 'cdek' | 'post';
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  onDeliveryChange: (method: 'cdek' | 'post') => void;
  onProceedToCheckout: () => void;
}

export function CartItemList({
  cart,
  subtotal,
  deliveryCost,
  totalPrice,
  selectedDelivery,
  removeFromCart,
  updateQuantity,
  onDeliveryChange,
  onProceedToCheckout,
}: CartItemListProps) {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Scrollable Items List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="bg-card/60 rounded-xl border border-border/80 p-3.5 flex gap-3.5 items-center"
          >
            {/* Thumb */}
            <Image
              src={item.product.image}
              alt={item.product.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-lg object-cover bg-background shrink-0"
              width={64}
              height={64}
              unoptimized
            />

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono uppercase text-primary-400 mb-0.5">
                {item.product.categoryName}
              </div>
              <h4 className="text-xs font-bold text-white truncate mb-1">
                {item.product.name}
              </h4>
              <div className="text-xs font-mono font-bold text-muted-foreground tabular-nums">
                {item.product.price.toLocaleString('ru-RU')} ₽
              </div>
            </div>

            {/* Quantity and Remove */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={() => removeFromCart(item.product.id)}
                className="text-muted-foreground hover:text-primary-400 p-1 transition-colors cursor-pointer"
                title="Удалить позицию"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center bg-black/60 border border-border rounded-md overflow-hidden">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="px-2 py-1 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="px-2 py-1 text-[11px] font-mono font-bold text-white tabular-nums">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="px-2 py-1 text-xs text-muted-foreground hover:text-white transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Delivery Option Selector */}
        <div className="pt-2">
          <div className="text-xs font-mono uppercase text-muted-foreground mb-2 font-medium">
            Способ получения:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onDeliveryChange('cdek')}
              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                selectedDelivery === 'cdek'
                  ? 'bg-primary-950/40 border-primary text-white'
                  : 'bg-card border-border text-muted-foreground hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Truck className="w-3 h-3 text-primary-500" />
                <span>СДЭК</span>
              </div>
              <span className="text-[10px] font-mono mt-1 text-muted-foreground">420 ₽</span>
            </button>

            <button
              type="button"
              onClick={() => onDeliveryChange('post')}
              className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                selectedDelivery === 'post'
                  ? 'bg-primary-950/40 border-primary text-white'
                  : 'bg-card border-border text-muted-foreground hover:text-white'
              }`}
            >
              <div className="flex items-center gap-1 text-[11px] font-bold">
                <Package className="w-3 h-3 text-blue-400" />
                <span>Почта</span>
              </div>
              <span className="text-[10px] font-mono mt-1 text-muted-foreground">350 ₽</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cart Footer Summary & Proceed Button */}
      <div className="p-5 bg-background border-t border-border space-y-3">
        <div className="space-y-1.5 text-xs text-muted-foreground font-mono">
          <div className="flex justify-between">
            <span>Товары ({cart.reduce((s, i) => s + i.quantity, 0)} шт):</span>
            <span className="tabular-nums text-white">{subtotal.toLocaleString('ru-RU')} ₽</span>
          </div>
          <div className="flex justify-between">
            <span>Доставка:</span>
            <span className="tabular-nums text-white">
              {deliveryCost === 0 ? 'Бесплатно' : `${deliveryCost} ₽`}
            </span>
          </div>
          <div className="pt-2 border-t border-border flex justify-between text-sm font-bold text-white">
            <span>Итого к оплате:</span>
            <span className="text-primary-500 font-mono text-base tabular-nums">
              {totalPrice.toLocaleString('ru-RU')} ₽
            </span>
          </div>
        </div>

        <button
          onClick={onProceedToCheckout}
          className="w-full py-3.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary-500 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
        >
          <span>Перейти к оформлению</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Надежная упаковка в пупырку и картон</span>
        </div>
      </div>
    </div>
  );
}
