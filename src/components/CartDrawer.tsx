'use client';

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { OrderFormValues } from '@/types';
import { orderFormSchema } from '@/lib/validations';
import { CartItemList } from './cart/CartItemList';
import { CartCheckoutForm } from './cart/CartCheckoutForm';

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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  if (!isCartOpen) return null;

  const handleDeliveryChange = (method: 'cdek' | 'post') => {
    setSelectedDelivery(method);
    setFormData((prev) => ({ ...prev, deliveryMethod: method }));
  };

  const generateOrderMessage = (orderId = 'FR-NEW') => {
    const itemsText = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.name} x${item.quantity} шт. — ${(
            item.product.price * item.quantity
          ).toLocaleString('ru-RU')} ₽`
      )
      .join('\n');

    const deliveryName =
      selectedDelivery === 'cdek' ? 'СДЭК до ПВЗ' : 'Почта России 1-й класс';

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
    submitOrder(formData);
    window.open(`https://t.me/fraiters?text=${encoded}`, '_blank');
  };

  const handleWebsiteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = orderFormSchema.safeParse(formData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
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
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Click outside to dismiss */}
      <div className="flex-1" onClick={() => setIsCartOpen(false)} />

      {/* Drawer surface */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative w-full max-w-lg bg-card border-l border-border h-full flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary-500" />
            <h2 id="cart-title" className="text-base font-bold text-white uppercase font-mono">
              {step === 'cart' ? 'Корзина' : 'Оформление заказа'}
            </h2>
            <span className="text-xs font-mono text-muted-foreground">
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
            className="p-2 text-muted-foreground hover:text-white rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-background/50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="relative mb-6"
            >
              <div className="w-24 h-24 rounded-full bg-card border border-border shadow-lg flex items-center justify-center relative z-10 mx-auto">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 z-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-xl opacity-60"
              />
            </motion.div>

            <motion.h3
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg font-bold text-white mb-2 font-mono uppercase tracking-tight"
            >
              Корзина пуста
            </motion.h3>

            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-muted-foreground max-w-[280px] mb-8 leading-relaxed"
            >
              Ваша коллекция мерча ждет пополнения. Выберите стенды, брелоки или стикерпаки в каталоге!
            </motion.p>

            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setIsCartOpen(false);
                const el = document.getElementById('catalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary px-8 py-3 font-semibold shadow-lg shadow-primary/20 cursor-pointer"
            >
              Перейти в каталог
            </motion.button>
          </div>
        ) : step === 'cart' ? (
          <CartItemList
            cart={cart}
            subtotal={subtotal}
            deliveryCost={deliveryCost}
            totalPrice={totalPrice}
            selectedDelivery={selectedDelivery}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            onDeliveryChange={handleDeliveryChange}
            onProceedToCheckout={() => setStep('checkout')}
          />
        ) : (
          <CartCheckoutForm
            formData={formData}
            setFormData={setFormData}
            formErrors={formErrors}
            selectedDelivery={selectedDelivery}
            totalPrice={totalPrice}
            copiedTelegram={copiedTelegram}
            onBackToCart={() => setStep('cart')}
            onSubmit={handleWebsiteSubmit}
            onDirectTelegramOrder={handleDirectTelegramOrder}
            onCopyTelegramText={copyTelegramText}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
