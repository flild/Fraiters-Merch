import React from 'react';
import { Send, Check } from 'lucide-react';
import { OrderFormValues } from '@/types';
import { siteConfig } from '@/lib/config';

interface CartCheckoutFormProps {
  formData: OrderFormValues;
  setFormData: React.Dispatch<React.SetStateAction<OrderFormValues>>;
  formErrors: Record<string, string>;
  selectedDelivery: 'cdek' | 'post';
  totalPrice: number;
  copiedTelegram: boolean;
  onBackToCart: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onDirectTelegramOrder: () => void;
  onCopyTelegramText: () => void;
}

export function CartCheckoutForm({
  formData,
  setFormData,
  formErrors,
  selectedDelivery,
  totalPrice,
  copiedTelegram,
  onBackToCart,
  onSubmit,
  onDirectTelegramOrder,
  onCopyTelegramText,
}: CartCheckoutFormProps) {
  return (
    <form onSubmit={onSubmit} className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* Back to items */}
        <button
          type="button"
          onClick={onBackToCart}
          className="text-xs text-muted-foreground hover:text-white flex items-center gap-1.5 cursor-pointer"
        >
          <span>← Вернуться к списку товаров</span>
        </button>

        <div className="bg-card/50 p-3 rounded-lg border border-border text-xs text-muted-foreground">
          <div className="font-semibold text-white mb-1">
            Заказ на {totalPrice.toLocaleString('ru-RU')} ₽ ({selectedDelivery.toUpperCase()})
          </div>
          <div>Заполните данные для отправки и трек-номера.</div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-muted-foreground mb-1 font-medium">ФИО получателя *</label>
            <input
              type="text"
              placeholder="Иванов Иван Иванович"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className={`w-full bg-card border ${formErrors.fullName ? 'border-red-500' : 'border-border'} rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500`}
            />
            {formErrors.fullName && <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground mb-1 font-medium">Telegram ник *</label>
              <input
                type="text"
                placeholder="@username"
                value={formData.telegramUsername}
                onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                className={`w-full bg-card border ${formErrors.telegramUsername ? 'border-red-500' : 'border-border'} rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500`}
              />
              {formErrors.telegramUsername && <p className="text-red-500 text-xs mt-1">{formErrors.telegramUsername}</p>}
            </div>

            <div>
              <label className="block text-muted-foreground mb-1 font-medium">Телефон *</label>
              <input
                type="tel"
                placeholder="+7 (999) 000-00-00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={`w-full bg-card border ${formErrors.phone ? 'border-red-500' : 'border-border'} rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500`}
              />
              {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-muted-foreground mb-1 font-medium">Город доставки *</label>
              <input
                type="text"
                placeholder="Москва / СПб / Казань..."
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className={`w-full bg-card border ${formErrors.city ? 'border-red-500' : 'border-border'} rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500`}
              />
              {formErrors.city && <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>}
            </div>

            <div>
              <label className="block text-muted-foreground mb-1 font-medium">Индекс</label>
              <input
                type="text"
                placeholder="101000"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground mb-1 font-medium">
              {selectedDelivery === 'cdek' ? 'Адрес ПВЗ СДЭК или улица/дом' : 'Адрес проживания (улица, дом, кв)'} *
            </label>
            <input
              type="text"
              placeholder="ул. Примерная, д. 10, кв. 25"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={`w-full bg-card border ${formErrors.address ? 'border-red-500' : 'border-border'} rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500`}
            />
            {formErrors.address && <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>}
          </div>

          <div>
            <label className="block text-muted-foreground mb-1 font-medium">Комментарий к заказу</label>
            <textarea
              rows={2}
              placeholder="Пожелания по упаковке, удобное время звонка..."
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              className="w-full bg-card border border-border rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Checkout Action Bar */}
      <div className="p-5 bg-background border-t border-border space-y-2.5">
        {/* Option A: Send via Telegram */}
        <button
          type="button"
          onClick={onDirectTelegramOrder}
          className="w-full py-3 px-4 text-xs font-bold text-white bg-muted hover:bg-muted-foreground border border-border hover:border-primary-500 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Send className="w-4 h-4 text-primary-500" />
          <span>Заказать в Telegram {siteConfig.telegramHandle}</span>
        </button>

        {/* Option B: Standard checkout submission */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 text-xs font-bold text-white bg-primary hover:bg-primary-500 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
        >
          <Check className="w-4 h-4" />
          <span>Оформить заказ на сайте ({totalPrice.toLocaleString('ru-RU')} ₽)</span>
        </button>

        <button
          type="button"
          onClick={onCopyTelegramText}
          className="w-full text-center text-[11px] text-muted-foreground hover:text-muted-foreground py-1 transition-colors cursor-pointer"
        >
          {copiedTelegram ? '✓ Текст заказа скопирован в буфер!' : 'Скопировать текст заказа'}
        </button>
      </div>
    </form>
  );
}
