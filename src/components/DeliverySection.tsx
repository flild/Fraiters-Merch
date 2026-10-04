'use client';

import React, { useState } from 'react';
import { Truck, ShieldCheck, Package, Clock, Sparkles, MapPin, Calculator } from 'lucide-react';

export default function DeliverySection() {
  const [estimateCity, setEstimateCity] = useState('Москва');

  const deliveryEstimates: Record<string, { cdekDays: string; cdekPrice: string; postDays: string; postPrice: string }> = {
    'Москва': { cdekDays: '1–2 дня', cdekPrice: '380 ₽', postDays: '2–3 дня', postPrice: '330 ₽' },
    'Санкт-Петербург': { cdekDays: '1–2 дня', cdekPrice: '400 ₽', postDays: '2–4 дня', postPrice: '350 ₽' },
    'Екатеринбург': { cdekDays: '2–3 дня', cdekPrice: '450 ₽', postDays: '3–5 дней', postPrice: '370 ₽' },
    'Казань': { cdekDays: '2–3 дня', cdekPrice: '420 ₽', postDays: '3–4 дня', postPrice: '350 ₽' },
    'Новосибирск': { cdekDays: '3–4 дня', cdekPrice: '520 ₽', postDays: '4–6 дней', postPrice: '390 ₽' },
    'Владивосток': { cdekDays: '4–6 дней', cdekPrice: '680 ₽', postDays: '6–9 дней', postPrice: '450 ₽' },
    'Минск (Беларусь)': { cdekDays: '3–5 дней', cdekPrice: '590 ₽', postDays: '6–10 дней', postPrice: '520 ₽' },
    'Алматы (Казахстан)': { cdekDays: '4–7 дней', cdekPrice: '750 ₽', postDays: '7–12 дней', postPrice: '650 ₽' },
  };

  const currentEst = deliveryEstimates[estimateCity] || deliveryEstimates['Москва'];

  return (
    <section id="delivery" className="py-16 md:py-24 border-b border-border/80 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-muted-foreground mb-2">
            <span className="text-primary-500 font-semibold uppercase">Логистика</span>
            <span aria-hidden="true">·</span>
            <span>По всей России и СНГ</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Трек-номер каждому</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase">
            Доставка и упаковка
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base mt-2">
            Мы знаем, как важно получить акриловые стенды и брелоки целыми и без единой царапины.
            Поэтому упаковываем каждый заказ как для себя.
          </p>
        </div>

        {/* 3 Main Shipping Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* CDEK */}
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 flex items-center justify-center mb-5">
              <Truck className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase text-emerald-400 mb-1">
              Быстро и до ПВЗ
            </div>
            <h3 className="text-lg font-bold text-white mb-2">СДЭК</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
              Удобно забирать в тысячах пунктов выдачи по всей РФ или заказать курьера прямо до двери. СМС-оповещения о поступлении.
            </p>
            <div className="pt-4 border-t border-border space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-muted-foreground">
                <span>Сроки:</span>
                <span className="font-bold text-white">1–4 рабочих дня</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Стоимость:</span>
                <span className="font-bold text-emerald-400 tabular-nums">от 380 ₽</span>
              </div>
            </div>
          </div>

          {/* Post of Russia */}
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-400 flex items-center justify-center mb-5">
              <Package className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase text-blue-400 mb-1">
              В любую точку РФ
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Почта России (1-й класс)</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
              Ускоренная авиадоставка в любой населенный пункт РФ и страны СНГ. Отслеживание по трек-номеру в приложении Почты.
            </p>
            <div className="pt-4 border-t border-border space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-muted-foreground">
                <span>Сроки:</span>
                <span className="font-bold text-white">3–7 рабочих дней</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Стоимость:</span>
                <span className="font-bold text-blue-400 tabular-nums">от 330 ₽</span>
              </div>
            </div>
          </div>

          {/* Shelves pickup */}
          <div className="bg-card rounded-xl border border-border p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-primary-950/40 border border-primary-800/40 text-primary-500 flex items-center justify-center mb-5">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono uppercase text-primary-400 mb-1">
              Самовывоз день в день
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Полочки в магазинах</h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
              Бесплатно! Приходите в партнерский магазин в Москве, Санкт-Петербурге, Казани или Екатеринбурге и забирайте сразу.
            </p>
            <div className="pt-4 border-t border-border space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-muted-foreground">
                <span>Сроки:</span>
                <span className="font-bold text-white">Сегодня</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Стоимость:</span>
                <span className="font-bold text-primary-400 tabular-nums">0 ₽</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Delivery Estimator */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-primary-400 mb-1">
                <Calculator className="w-3.5 h-3.5" />
                <span>Быстрый калькулятор сроков</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white">
                Ориентировочный расчет доставки до вашего города
              </h3>
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground whitespace-nowrap">Город:</span>
              <select
                value={estimateCity}
                onChange={(e) => setEstimateCity(e.target.value)}
                className="bg-card border border-border text-sm text-white px-3 py-2 rounded-lg focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                {Object.keys(deliveryEstimates).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
            <div className="bg-card/70 p-4 rounded-xl border border-border/80 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">СДЭК до ПВЗ ({estimateCity})</div>
                <div className="text-base font-bold text-white mt-0.5">{currentEst.cdekDays}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Примерная цена</div>
                <div className="text-base font-mono font-bold text-emerald-400 tabular-nums">
                  {currentEst.cdekPrice}
                </div>
              </div>
            </div>

            <div className="bg-card/70 p-4 rounded-xl border border-border/80 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Почта РФ 1-й класс ({estimateCity})</div>
                <div className="text-base font-bold text-white mt-0.5">{currentEst.postDays}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Примерная цена</div>
                <div className="text-base font-mono font-bold text-blue-400 tabular-nums">
                  {currentEst.postPrice}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Layers of Packaging Safety */}
        <div className="bg-gradient-to-r from-red-950/20 via-[#0f1117] to-neutral-900 rounded-2xl border border-border p-6 sm:p-8">
          <div className="flex items-center gap-2 text-xs font-mono text-primary-400 uppercase mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Стандарты надежности упаковки Fraiters</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-6">
            4 уровня защиты для вашего мерча:
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-muted-foreground">
            <div className="space-y-1.5">
              <div className="font-mono text-primary-500 font-bold text-sm">01. Защитная пленка</div>
              <p className="text-muted-foreground">
                Заводская двухсторонняя матовая пленочка на каждом акриловом стенде и брелоке исключает потертости.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-mono text-primary-500 font-bold text-sm">02. Пузырчатая пленка</div>
              <p className="text-muted-foreground">
                Не жалеем пупырки: 3–4 плотных оборота с амортизацией углов изделия.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-mono text-primary-500 font-bold text-sm">03. Жесткий картон</div>
              <p className="text-muted-foreground">
                Открытки и стенды прокладываются плотным переплетным картоном, чтобы исключить заломы.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="font-mono text-primary-500 font-bold text-sm">04. Бонус & подарок</div>
              <p className="text-muted-foreground">
                В каждый заказ вкладывается брендовая открытка-вкладыш и фирменные стикеры в подарок!
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
