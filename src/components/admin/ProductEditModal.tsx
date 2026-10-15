import Image from 'next/image';
import React, { useState } from 'react';
import { X, RefreshCw, Upload, Plus, Edit2, Trash2, Check } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { UNCATEGORIZED_CATEGORY } from '@/lib/data';

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
  const { categories, addCategory, updateCategory, deleteCategory } = useCart();
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Category management inline state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [editCatLabel, setEditCatLabel] = useState('');

  // Combined available categories
  const allAvailableCategories = categories.some((c) => c.id === UNCATEGORIZED_CATEGORY.id)
    ? categories
    : [...categories, UNCATEGORIZED_CATEGORY];

  const currentCat = allAvailableCategories.find((c) => c.id === editingProduct.category) || {
    id: editingProduct.category || UNCATEGORIZED_CATEGORY.id,
    label: editingProduct.categoryName || UNCATEGORIZED_CATEGORY.label,
  };

  const handleCreateCategory = () => {
    if (!newCatLabel.trim()) return;
    const newCat = addCategory(newCatLabel.trim());
    setEditingProduct({
      ...editingProduct,
      category: newCat.id,
      categoryName: newCat.label,
    });
    setNewCatLabel('');
    setIsAddingCategory(false);
  };

  const handleUpdateCategory = () => {
    if (!editCatLabel.trim()) return;
    updateCategory(currentCat.id, editCatLabel.trim());
    setEditingProduct({
      ...editingProduct,
      categoryName: editCatLabel.trim(),
    });
    setIsEditingCategory(false);
  };

  const handleDeleteCategory = () => {
    if (currentCat.id === UNCATEGORIZED_CATEGORY.id) return;
    if (confirm(`Удалить категорию «${currentCat.label}»? Товары в ней станут «Без категории».`)) {
      deleteCategory(currentCat.id);
      setEditingProduct({
        ...editingProduct,
        category: UNCATEGORIZED_CATEGORY.id,
        categoryName: UNCATEGORIZED_CATEGORY.label,
      });
      setIsEditingCategory(false);
    }
  };

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-muted-foreground font-medium">Категория *</label>
                {!isAddingCategory && !isEditingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingCategory(true);
                      setNewCatLabel('');
                    }}
                    className="text-[11px] text-primary-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Создать</span>
                  </button>
                )}
              </div>

              {/* Inline category creation form */}
              {isAddingCategory ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    placeholder="Название категории"
                    value={newCatLabel}
                    onChange={(e) => setNewCatLabel(e.target.value)}
                    className="w-full bg-card border border-primary-500 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="p-1.5 bg-primary text-white rounded-lg hover:bg-primary-500 cursor-pointer shrink-0"
                    title="Сохранить категорию"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="p-1.5 bg-card border border-border text-muted-foreground hover:text-white rounded-lg cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : isEditingCategory ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={editCatLabel}
                    onChange={(e) => setEditCatLabel(e.target.value)}
                    className="w-full bg-card border border-primary-500 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleUpdateCategory}
                    className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 cursor-pointer shrink-0"
                    title="Сохранить название"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingCategory(false)}
                    className="p-1.5 bg-card border border-border text-muted-foreground hover:text-white rounded-lg cursor-pointer shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <select
                    value={editingProduct.category}
                    onChange={(e) => {
                      const catId = e.target.value;
                      const catObj = allAvailableCategories.find((c) => c.id === catId);
                      setEditingProduct({
                        ...editingProduct,
                        category: catId,
                        categoryName: catObj ? catObj.label : 'Без категории',
                      });
                    }}
                    className="w-full bg-card border border-border rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-500 cursor-pointer"
                  >
                    {allAvailableCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>

                  {/* Actions for current category */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingCategory(true);
                      setEditCatLabel(currentCat.label);
                    }}
                    className="p-2 bg-card border border-border text-muted-foreground hover:text-white rounded-lg cursor-pointer shrink-0"
                    title="Переименовать категорию"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  {currentCat.id !== UNCATEGORIZED_CATEGORY.id && (
                    <button
                      type="button"
                      onClick={handleDeleteCategory}
                      className="p-2 bg-card border border-border text-muted-foreground hover:text-primary-400 rounded-lg cursor-pointer shrink-0"
                      title="Удалить категорию"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
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

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex items-center gap-4 py-1">
            <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
              <input
                type="checkbox"
                checked={editingProduct.inStock}
                onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                className="rounded bg-card border-border text-primary focus:ring-primary-500 cursor-pointer"
              />
              <span className="text-white font-medium">Товар в наличии (если сброшено — «Нет в наличии»)</span>
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
