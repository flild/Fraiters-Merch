'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Send, ArrowRight, Truck, MapPin, Package, ShieldCheck, Check } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { OrderFormValues } from '@/lib/types';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    deliveryCost,
    totalPrice,
    selectedDelivery,
    setSelectedDelivery,
    submitOrder,
  } = useCart();

  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [formData, setFormData] = useState<OrderFormValues>({
    fullName: '',
    telegramUsername: '',
    phone: '',
    city: '',
    address: '',
    postalCode: '',
    deliveryMethod: 'cdek',
    paymentMethod: 'card',
    comment: '',
  });

  const [copiedTelegram, setCopiedTelegram] = useState(false);

  if (!isCartOpen) return null;

  const handleDeliveryChange = (method: 'cdek' | 'post' | 'shelf') => {
    setSelectedDelivery(method);
    setFormData((prev) => ({ ...prev, deliveryMethod: method }));
  };

  const generateOrderMessage = (orderId = 'FR-NEW') => {
    const itemsText = cart
      .map((item, index) => `${index + 1}. ${item.product.name} x${item.quantity} шт. — ${(item.product.price * item.quantity).toLocaleString('ru-RU')} ₽`)
      .join('\n');

    const deliveryName =
      selectedDelivery === 'cdek'
        ? 'СДЭК до ПВЗ'
        : selectedDelivery === 'post'
        ? 'Почта России 1-й класс'
        : 'Самовывоз с полочки';

    return `Привет! Хочу оформить заказ мерча Fraiters (${orderId}):
\n${itemsText}
\nСпособ доставки: ${deliveryName} (${deliveryCost} ₽)
Итого к оплате: ${totalPrice.toLocaleString('ru-RU')} ₽
\nПолучатель: ${formData.fullName || '—'}
Telegram: ${formData.telegramUsername || '—'}
Телефон: ${formData.phone || '—'}
Адрес: ${formData.city ? `${formData.city}, ${formData.address}` : '—'}
${formData.comment ? `Комментарий: ${formData.comment}` : ''}`;
  };

  const handleDirectTelegramOrder = () => {
    const text = generateOrderMessage();
    const encoded = encodeURIComponent(text);
    // Submit internal state
    submitOrder(formData);
    // Open Telegram
    window.open(`https://t.me/fraiters?text=${encoded}`, '_blank');
  };

  const handleWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitOrder(formData);
    setStep('cart');
  };

  const copyTelegramText = () => {
    const text = generateOrderMessage();
    navigator.clipboard.writeText(text);
    setCopiedTelegram(true);
    setTimeout(() => setCopiedTelegram(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm"
    >
      {/* Click outside to dismiss */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer surface */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative w-full max-w-lg bg-[#0e1017] border-l border-neutral-800 h-full flex flex-col shadow-2xl overflow-hidden"
      >
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-red-500" />
            <h2 className="text-base font-bold text-white uppercase font-mono">
              {step === 'cart' ? 'Корзина' : 'Оформление заказа'}
            </h2>
            <span className="text-xs font-mono text-neutral-400">
              ({cart.reduce((s, i) => s + i.quantity, 0)} шт)
            </span>
          </div>

          <button
            onClick={() => {
              if (step === 'checkout') {
                setStep('cart');
              } else {
                setIsCartOpen(false);
              }
            }}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800/80 transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-600 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Корзина пуста</h3>
            <p className="text-xs text-neutral-400 max-w-xs mb-6">
              Вы еще не добавили ни одного товара. Выберите стенды, брелоки или стикерпаки в каталоге!
            </p>
            <button
              onClick={() => {
                setIsCartOpen(false);
                const el = document.getElementById('catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors cursor-pointer"
            >
              Перейти в каталог
            </button>
          </div>
        ) : step === 'cart' ? (
          /* Step 1: Cart Items Review */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-neutral-900/60 rounded-xl border border-neutral-800/80 p-3.5 flex gap-3.5 items-center"
                >
                  {/* Thumb */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-lg object-cover bg-neutral-950 shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono uppercase text-red-400 mb-0.5">
                      {item.product.categoryName}
                    </div>
                    <h4 className="text-xs font-bold text-white truncate mb-1">
                      {item.product.name}
                    </h4>
                    <div className="text-xs font-mono font-bold text-neutral-300 tabular-nums">
                      {item.product.price.toLocaleString('ru-RU')} ₽
                    </div>
                  </div>

                  {/* Quantity and Remove */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-neutral-500 hover:text-red-400 p-1 transition-colors"
                      title="Удалить позицию"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center bg-black/60 border border-neutral-800 rounded-md overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-1 text-xs text-neutral-400 hover:text-white transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2 py-1 text-[11px] font-mono font-bold text-white tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-1 text-xs text-neutral-400 hover:text-white transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Delivery Option Selector */}
              <div className="pt-2">
                <div className="text-xs font-mono uppercase text-neutral-400 mb-2 font-medium">
                  Способ получения:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeliveryChange('cdek')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                      selectedDelivery === 'cdek'
                        ? 'bg-red-950/40 border-red-600 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <Truck className="w-3 h-3 text-red-500" />
                      <span>СДЭК</span>
                    </div>
                    <span className="text-[10px] font-mono mt-1 text-neutral-300">420 ₽</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeliveryChange('post')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                      selectedDelivery === 'post'
                        ? 'bg-red-950/40 border-red-600 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <Package className="w-3 h-3 text-blue-400" />
                      <span>Почта</span>
                    </div>
                    <span className="text-[10px] font-mono mt-1 text-neutral-300">350 ₽</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeliveryChange('shelf')}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-colors cursor-pointer ${
                      selectedDelivery === 'shelf'
                        ? 'bg-red-950/40 border-red-600 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[11px] font-bold">
                      <MapPin className="w-3 h-3 text-emerald-400" />
                      <span>Полочка</span>
                    </div>
                    <span className="text-[10px] font-mono mt-1 text-emerald-400">0 ₽</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Cart Footer Summary & Proceed Button */}
            <div className="p-5 bg-neutral-950 border-t border-neutral-800 space-y-3">
              <div className="space-y-1.5 text-xs text-neutral-400 font-mono">
                <div className="flex justify-between">
                  <span>Товары ({cart.reduce((s, i) => s + i.quantity, 0)} шт):</span>
                  <span className="tabular-nums text-white">{subtotal.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>Доставка:</span>
                  <span className="tabular-nums text-white">
                    {deliveryCost === 0 ? 'Бесплатно (Полочка)' : `${deliveryCost} ₽`}
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
                  <span>Итого к оплате:</span>
                  <span className="text-red-500 font-mono text-base tabular-nums">
                    {totalPrice.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>

              <button
                onClick={() => setStep('checkout')}
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
              >
                <span>Перейти к оформлению</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Надежная упаковка в пупырку и картон</span>
              </div>
            </div>
          </div>
        ) : (
          /* Step 2: Checkout Form */
          <form onSubmit={handleWebsiteSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Back to items */}
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5"
              >
                <span>← Вернуться к списку товаров</span>
              </button>

              <div className="bg-neutral-900/50 p-3 rounded-lg border border-neutral-800 text-xs text-neutral-300">
                <div className="font-semibold text-white mb-1">
                  Заказ на {totalPrice.toLocaleString('ru-RU')} ₽ ({selectedDelivery.toUpperCase()})
                </div>
                <div>Заполните данные для отправки и трек-номера.</div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">ФИО получателя *</label>
                  <input
                    type="text"
                    required
                    placeholder="Иванов Иван Иванович"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Telegram ник *</label>
                    <input
                      type="text"
                      required
                      placeholder="@username"
                      value={formData.telegramUsername}
                      onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Телефон *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (999) 000-00-00"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {selectedDelivery !== 'shelf' && (
                  <>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-neutral-300 mb-1 font-medium">Город доставки *</label>
                        <input
                          type="text"
                          required
                          placeholder="Москва / СПб / Казань..."
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-300 mb-1 font-medium">Индекс</label>
                        <input
                          type="text"
                          placeholder="101000"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-300 mb-1 font-medium">
                        {selectedDelivery === 'cdek' ? 'Адрес ПВЗ СДЭК или улица/дом' : 'Адрес проживания (улица, дом, кв)'} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="ул. Примерная, д. 10, кв. 25"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </>
                )}

                {selectedDelivery === 'shelf' && (
                  <div>
                    <label className="block text-neutral-300 mb-1 font-medium">Выберите полочку для брони</label>
                    <select
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Москва, Маросейка 6-8 (Полка №42)">Москва, Твоя Полка (Маросейка 6-8)</option>
                      <option value="Санкт-Петербург, Севкабель (Полка B-14)">СПб, Полка Чудес (Севкабель Порт)</option>
                      <option value="Казань, Баумана 29 (Полка №19)">Казань, КрафтЛавка (Баумана 29)</option>
                      <option value="Екатеринбург, Вайнера 10 (Полка №8)">Екб, Craft Corner (Вайнера 10)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-neutral-300 mb-1 font-medium">Комментарий к заказу</label>
                  <textarea
                    rows={2}
                    placeholder="Пожелания по упаковке, удобное время звонка..."
                    value={formData.comment}
                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

            </div>

            {/* Checkout Action Bar */}
            <div className="p-5 bg-neutral-950 border-t border-neutral-800 space-y-2.5">
              {/* Option A: Send via Telegram */}
              <button
                type="button"
                onClick={handleDirectTelegramOrder}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 hover:border-red-500 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4 text-red-500" />
                <span>Заказать в Telegram @fraiters</span>
              </button>

              {/* Option B: Standard checkout submission */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Оформить заказ на сайте ({totalPrice.toLocaleString('ru-RU')} ₽)</span>
              </button>

              <button
                type="button"
                onClick={copyTelegramText}
                className="w-full text-center text-[11px] text-neutral-500 hover:text-neutral-300 py-1 transition-colors"
              >
                {copiedTelegram ? '✓ Текст заказа скопирован в буфер!' : 'Скопировать текст заказа'}
              </button>
            </div>
          </form>
        )}

      </motion.div>
    </motion.div>
  );
}
