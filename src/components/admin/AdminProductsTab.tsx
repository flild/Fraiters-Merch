import Image from 'next/image';
import React, { useState } from 'react';
import { Search, Plus, Check, Edit2, Trash2 } from 'lucide-react';
import { Product } from '@/types';
import { CATEGORIES } from '@/lib/data';

interface AdminProductsTabProps {
  products: Product[];
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  onOpenAddProduct: () => void;
  onEditProduct: (product: Product) => void;
}

export function AdminProductsTab({
  products,
  updateProduct,
  deleteProduct,
  onOpenAddProduct,
  onEditProduct,
}: AdminProductsTabProps) {
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [inlinePrices, setInlinePrices] = useState<Record<string, number>>({});

  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск товара..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-primary-500"
            />
          </div>

          {/* Category filter */}
          <select
            value={productCategoryFilter}
            onChange={(e) => setProductCategoryFilter(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            <option value="all">Все категории</option>
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Product Button */}
        <button
          onClick={onOpenAddProduct}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-red-950 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить новый товар</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-card/90 text-muted-foreground font-mono uppercase text-[11px] border-b border-border">
              <tr>
                <th className="py-3 px-4">Товар</th>
                <th className="py-3 px-4">Категория</th>
                <th className="py-3 px-4">Цена (₽)</th>
                <th className="py-3 px-4">Старая цена</th>
                <th className="py-3 px-4">Статус</th>
                <th className="py-3 px-4">Остаток</th>
                <th className="py-3 px-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/80 text-muted-foreground">
              {filteredProducts.map((p) => {
                return (
                  <tr key={p.id} className="hover:bg-card/40 transition-colors">
                    {/* Image & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-lg object-cover bg-background shrink-0"
                          width={44}
                          height={44}
                          unoptimized
                        />
                        <div>
                          <div className="font-bold text-white leading-snug line-clamp-1 max-w-xs">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground font-mono">
                            {p.size || 'Стандарт'} · {p.badge ? `[${p.badge}]` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-muted-foreground font-mono">
                      {p.categoryName}
                    </td>

                    {/* Price with quick inline edit */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          defaultValue={p.price}
                          onChange={(e) =>
                            setInlinePrices({ ...inlinePrices, [p.id]: Number(e.target.value) })
                          }
                          className="w-20 bg-card border border-border rounded px-2 py-1 text-xs text-white font-mono tabular-nums focus:outline-none focus:border-primary-500"
                        />
                        {inlinePrices[p.id] !== undefined && inlinePrices[p.id] !== p.price && (
                          <button
                            onClick={() => updateProduct(p.id, { price: inlinePrices[p.id] })}
                            className="p-1 bg-primary text-white rounded hover:bg-primary-500 cursor-pointer"
                            title="Сохранить цену"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Old Price */}
                    <td className="py-3 px-4 text-muted-foreground font-mono tabular-nums">
                      {p.oldPrice ? `${p.oldPrice} ₽` : '—'}
                    </td>

                    {/* In Stock toggle */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition-colors cursor-pointer ${
                          p.inStock
                            ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-400'
                            : 'bg-amber-950/60 border border-amber-800/60 text-amber-400'
                        }`}
                      >
                        {p.inStock ? 'В наличии' : 'Предзаказ'}
                      </button>
                    </td>

                    {/* Stock count */}
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {p.stockCount ?? '10'} шт
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="p-1.5 text-muted-foreground hover:text-white bg-card hover:bg-muted rounded transition-colors cursor-pointer"
                          title="Редактировать товар"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            if (confirm(`Удалить товар «${p.name}»?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-muted-foreground hover:text-primary-400 bg-card hover:bg-muted rounded transition-colors cursor-pointer"
                          title="Удалить товар"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
