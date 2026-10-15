import Image from 'next/image';
import React from 'react';
import {
  BarChart3, Sparkles, Download, DollarSign, TrendingUp, ShoppingBag,
  Award, Layers, Truck, PieChart, AlertTriangle
} from 'lucide-react';
import { Product, CartItem } from '@/types';

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  aov: number;
  totalUnits: number;
  productStatsMap: Record<string, { product: Product; unitsSold: number; revenue: number }>;
  topProducts: { product: Product; unitsSold: number; revenue: number }[];
  categoryBreakdown: { categoryName: string; unitsSold: number; revenue: number }[];
  deliveryStatsMap: Record<string, { count: number; name: string }>;
  statusStatsMap: Record<string, number>;
  days: { label: string; shortDay: string; revenue: number; orders: number }[];
  maxDayRevenue: number;
}

interface AdminStatsTabProps {
  stats: AdminStats;
  seedDemoOrders: () => void;
  handleExportData: () => void;
}

export function AdminStatsTab({ stats, seedDemoOrders, handleExportData }: AdminStatsTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-5 rounded-2xl border border-border shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-primary-400 mb-1">
            <BarChart3 className="w-4 h-4 text-primary-500" />
            <span className="font-semibold uppercase tracking-wider">Аналитика и выручка</span>
          </div>
          <h2 className="text-lg font-bold text-white">Статистика продаж Fraiters Merch</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Данные основаны на всех заказах, оформленных через интернет-витрину.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={seedDemoOrders}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-card hover:bg-muted border border-border/80 text-xs font-medium text-foreground hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Загрузить тестовые заказы для проверки статистики"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Обновить демо-данные</span>
          </button>

          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-card hover:bg-muted border border-border/80 text-xs font-medium text-foreground hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Экспорт отчета</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue */}
        <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
            <span>Общая выручка</span>
            <div className="w-8 h-8 rounded-lg bg-primary-950/80 border border-primary-800/40 text-primary-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
            {stats.totalRevenue.toLocaleString('ru-RU')} ₽
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <span className="text-emerald-400 font-medium font-mono flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18.4%
            </span>
          </div>
        </div>

        {/* Card 2: Orders Count */}
        <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
            <span>Всего заказов</span>
            <div className="w-8 h-8 rounded-lg bg-card border border-border text-primary-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
            {stats.totalOrders}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
            <span className="text-amber-400 font-semibold">{stats.statusStatsMap.new} нов.</span>
            <span>·</span>
            <span className="text-blue-400 font-semibold">{stats.statusStatsMap.processing} в сборке</span>
            <span>·</span>
            <span className="text-emerald-400 font-semibold">{stats.statusStatsMap.completed} заверш.</span>
          </div>
        </div>

        {/* Card 3: AOV */}
        <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
            <span>Средний чек (AOV)</span>
            <div className="w-8 h-8 rounded-lg bg-card border border-border text-primary-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
            {stats.aov.toLocaleString('ru-RU')} ₽
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground font-mono">
            В среднем ~ {(stats.totalUnits / Math.max(stats.totalOrders, 1)).toFixed(1)} поз. в одном чеке
          </div>
        </div>

        {/* Card 4: Total Units Sold */}
        <div className="bg-card border border-border rounded-xl p-5 relative overflow-hidden group hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-mono mb-2">
            <span>Продано мерча</span>
            <div className="w-8 h-8 rounded-lg bg-card border border-border text-primary-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight tabular-nums">
            {stats.totalUnits} шт.
          </div>
          <div className="mt-3 text-[11px] text-muted-foreground font-mono">
            Стенды, брелоки, диорамы, худи
          </div>
        </div>
      </div>

      {/* Sales Dynamics Chart & Delivery Channels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 7-day Sales Dynamics Bar Chart */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary-500" />
                  <span>Динамика продаж по дням</span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Выручка за последние 7 дней (в рублях)
                </p>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono text-muted-foreground">Пиковый день:</div>
                <div className="text-xs font-mono font-bold text-primary-400">
                  {stats.maxDayRevenue.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>

            {/* Histogram bars */}
            <div className="h-44 pt-6 pb-2 flex items-end justify-between gap-2 sm:gap-4 border-b border-border/80">
              {stats.days.map((day, idx) => {
                const heightPercent = Math.max(Math.round((day.revenue / stats.maxDayRevenue) * 100), 8);
                const isPeak = day.revenue === stats.maxDayRevenue;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="mb-2 text-[10px] font-mono font-bold text-muted-foreground opacity-90 group-hover:opacity-100 transition-opacity tabular-nums whitespace-nowrap">
                      {day.revenue > 0 ? `${day.revenue.toLocaleString('ru-RU')} ₽` : '0 ₽'}
                    </div>

                    <div className="w-full max-w-[42px] bg-card rounded-t-lg overflow-hidden flex items-end h-[120px] p-0.5">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-t-md transition-all duration-500 ${
                          isPeak
                            ? 'bg-gradient-to-t from-red-700 via-red-600 to-rose-400 shadow-lg shadow-red-950/60'
                            : day.revenue > 0
                            ? 'bg-gradient-to-t from-neutral-800 via-red-950 to-red-600'
                            : 'bg-muted/60'
                        } group-hover:brightness-125`}
                      />
                    </div>

                    <div className="mt-2 text-center">
                      <div className="text-[11px] font-medium text-white">{day.shortDay}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{day.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between text-xs text-muted-foreground font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              <span>Продажи интернет-магазина и предзаказы</span>
            </div>
            <div>
              Среднедневная выручка: ~ {Math.round(stats.totalRevenue / 7).toLocaleString('ru-RU')} ₽ / день
            </div>
          </div>
        </div>

        {/* Right Column: Delivery Channels Breakdown */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-primary-500" />
              <span>Каналы доставки</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Распределение способов получения заказов
            </p>

            <div className="space-y-4">
              {Object.entries(stats.deliveryStatsMap).map(([key, val]) => {
                const percentage = stats.totalOrders > 0
                  ? Math.round((val.count / stats.totalOrders) * 100)
                  : 0;

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{val.name}</span>
                      <span className="text-white font-mono font-bold tabular-nums">
                        {val.count} зак. ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-border">
                      <div
                        style={{ width: `${percentage}%` }}
                        className={`h-full rounded-full transition-all duration-500 ${
                          key === 'cdek'
                            ? 'bg-primary-500'
                            : key === 'shelf'
                            ? 'bg-emerald-500'
                            : 'bg-blue-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
            <span>Самовывоз с полочек:</span>
            <span className="text-emerald-400 font-mono font-semibold">
              {stats.deliveryStatsMap.shelf?.count || 0} покупок (0 ₽ доставка)
            </span>
          </div>
        </div>
      </div>

      {/* Bestsellers Table & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bestsellers List (8 cols) */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-primary-500" />
                <span>Рейтинг бестселлеров по выручке</span>
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Самые продаваемые позиции авторского мерча
              </p>
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              Топ {Math.min(stats.topProducts.length, 6)} позиций
            </span>
          </div>

          {stats.topProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              Нет данных о продажах. Оформите заказ на сайте или нажмите «Обновить демо-данные».
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-card/90 text-muted-foreground font-mono uppercase text-[11px] border-b border-border">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Товар</th>
                    <th className="py-2.5 px-3 text-center">Продано</th>
                    <th className="py-2.5 px-3">Выручка</th>
                    <th className="py-2.5 px-3">Доля</th>
                    <th className="py-2.5 px-3 text-right">Склад</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 text-muted-foreground">
                  {stats.topProducts.slice(0, 6).map((item, index) => {
                    const revenueShare = stats.totalRevenue > 0
                      ? Math.round((item.revenue / stats.totalRevenue) * 100)
                      : 0;

                    return (
                      <tr key={item.product.id} className="hover:bg-card/40 transition-colors">
                        <td className="py-3 px-3 font-mono font-bold">
                          {index === 0 ? (
                            <span className="text-amber-400">🥇 1</span>
                          ) : index === 1 ? (
                            <span className="text-muted-foreground">🥈 2</span>
                          ) : index === 2 ? (
                            <span className="text-amber-600">🥉 3</span>
                          ) : (
                            <span className="text-muted-foreground">{index + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              referrerPolicy="no-referrer"
                              className="w-9 h-9 rounded-lg object-cover bg-background shrink-0"
                              width={36}
                              height={36}
                              unoptimized
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1 max-w-[200px] sm:max-w-xs">
                                {item.product.name}
                              </div>
                              <div className="text-[10px] text-muted-foreground font-mono">
                                {item.product.categoryName} · {item.product.price} ₽
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold text-white tabular-nums">
                          {item.unitsSold} шт.
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-primary-400 tabular-nums">
                          {item.revenue.toLocaleString('ru-RU')} ₽
                        </td>
                        <td className="py-3 px-3 font-mono">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                style={{ width: `${revenueShare}%` }}
                                className="h-full bg-primary-500 rounded-full"
                              />
                            </div>
                            <span className="text-[11px] tabular-nums text-muted-foreground">
                              {revenueShare}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                              item.product.inStock
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                                : 'bg-rose-950/80 text-rose-400 border border-rose-800/60'
                            }`}
                          >
                            {item.product.inStock ? 'В наличии' : 'Нет в наличии'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown (4 cols) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-primary-500" />
              <span>Выручка по категориям</span>
            </h3>
            <p className="text-xs text-muted-foreground mb-5">
              Доля продаж в структуре дохода
            </p>

            <div className="space-y-4">
              {stats.categoryBreakdown.map((cat, idx) => {
                const share = stats.totalRevenue > 0
                  ? Math.round((cat.revenue / stats.totalRevenue) * 100)
                  : 0;

                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">{cat.categoryName}</span>
                      <span className="text-white font-mono tabular-nums font-semibold">
                        {cat.revenue.toLocaleString('ru-RU')} ₽ ({share}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-card rounded-full overflow-hidden border border-border">
                      <div
                        style={{ width: `${share}%` }}
                        className="h-full bg-gradient-to-r from-red-600 to-rose-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
