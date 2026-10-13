import Image from 'next/image';
import React, { useState } from 'react';
import { X, RefreshCw, Upload } from 'lucide-react';
import { Product, ProductCategory } from '@/types';
import { CATEGORIES } from '@/lib/data';

interface ProductEditModalProps {
  editingProduct: Product;
  isNewProduct: boolean;
  setEditingProduct: (product: Product | null) => void;
  onSave: (e: React.FormEvent) => void;
}

export function ProductEditModal({
  editingProduct,
  isNewProduct,
  setEditingProduct,
  onSave,
}: ProductEditModalProps) {
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
          <h2 className="text-lg font-bold text-white">
            {isNewProduct ? 'Добавить новый товар' : 'Редактировать товар'}
          </h2>
          <button
            onClick={() => setEditingProduct(null)}
            className="p-1.5 text-muted-foreground hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-muted-foreground font-medium mb-1">Название товара *</label>
            <input
              type="text"
              required
              value={editingProduct.name}
              onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
              className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Категория</label>
              <select
                value={editingProduct.category}
                onChange={(e) => {
                  const cat = e.target.value as ProductCategory;
                  const catObj = CATEGORIES.find((c) => c.id === cat);
                  setEditingProduct({
                    ...editingProduct,
                    category: cat,
                    categoryName: catObj ? catObj.label : 'Мерч',
                  });
                }}
                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 cursor-pointer"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Бейдж / Стикер (опционально)</label>
              <input
                type="text"
                placeholder="Например: Хит продаж / Новинка"
                value={editingProduct.badge || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Цена (₽) *</label>
              <input
                type="number"
                required
                value={editingProduct.price}
                onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Старая цена со скидкой</label>
              <input
                type="number"
                placeholder="Не обязательно"
                value={editingProduct.oldPrice || ''}
                onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: e.target.value ? Number(e.target.value) : undefined })}
                className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Остаток на складе (шт)</label>
              <input
                type="number"
                value={editingProduct.stockCount || 10}
                onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 py-1">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
              <input
                type="checkbox"
                checked={editingProduct.inStock}
                onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                className="rounded bg-card border-border text-primary focus:ring-primary-500 cursor-pointer"
              />
              <span>Товар есть в наличии (иначе Предзаказ)</span>
            </label>
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Изображение товара</label>
            <div
              className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg transition-colors overflow-hidden ${
                isDraggingImage
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingImage(true);
              }}
              onDragLeave={() => setIsDraggingImage(false)}
              onDrop={async (e) => {
                e.preventDefault();
                setIsDraggingImage(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  const file = e.dataTransfer.files[0];
                  setIsUploadingImage(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  try {
                    const res = await fetch('/api/upload', {
                      method: 'POST',
                      body: formData,
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setEditingProduct({ ...editingProduct, image: data.url });
                    }
                  } catch (err) {
                    console.error("Upload failed", err);
                  } finally {
                    setIsUploadingImage(false);
                  }
                }
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    setIsUploadingImage(true);
                    const formData = new FormData();
                    formData.append('file', file);
                    try {
                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        body: formData,
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setEditingProduct({ ...editingProduct, image: data.url });
                      }
                    } catch (err) {
                      console.error("Upload failed", err);
                    } finally {
                      setIsUploadingImage(false);
                    }
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                title=""
              />

              {isUploadingImage ? (
                <div className="flex flex-col items-center gap-2 text-primary-400">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-medium">Загрузка...</span>
                </div>
              ) : editingProduct.image ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border bg-black/50">
                    <Image
                      src={editingProduct.image}
                      alt="Product Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">Нажмите или перетащите другое изображение для замены</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-8 h-8 mb-1 opacity-80" />
                  <span className="text-sm font-medium text-white">Перетащите изображение сюда</span>
                  <span className="text-xs">или нажмите для выбора файла</span>
                </div>
              )}
            </div>

            {/* Hidden input to keep form validation working if needed */}
            <input type="hidden" required value={editingProduct.image} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Размер / Габариты</label>
              <input
                type="text"
                value={editingProduct.size}
                onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Материал</label>
              <input
                type="text"
                value={editingProduct.material}
                onChange={(e) => setEditingProduct({ ...editingProduct, material: e.target.value })}
                className="w-full bg-card border border-border rounded-lg px-3.5 py-2 text-white focus:outline-none focus:border-primary-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Описание товара</label>
            <textarea
              rows={3}
              value={editingProduct.description}
              onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
              className="w-full bg-card border border-border rounded-lg p-3 text-white focus:outline-none focus:border-primary-500"
            />
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingProduct(null)}
              className="px-4 py-2 text-xs text-muted-foreground hover:text-white cursor-pointer"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-500 rounded-lg shadow-md transition-colors cursor-pointer"
            >
              {isNewProduct ? 'Создать товар' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
