'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderFormValues, AppSection, ViewMode, OrderRecord, ShelfLocation } from '@/types';
import { PRODUCTS as INITIAL_PRODUCTS, SHELF_LOCATIONS as INITIAL_SHELVES, INITIAL_ORDERS } from './data';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryCost: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedDelivery: 'cdek' | 'post' | 'shelf';
  setSelectedDelivery: (method: 'cdek' | 'post' | 'shelf') => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  lastOrder: OrderRecord | null;
  submitOrder: (values: OrderFormValues) => string;
  closeOrderSuccess: () => void;
  toastMessage: string | null;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Admin Assortment & Store Management
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updated: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;

  // Admin Shelves Management
  shelves: ShelfLocation[];
  addShelf: (shelf: ShelfLocation) => void;
  updateShelf: (id: string, updated: Partial<ShelfLocation>) => void;
  deleteShelf: (id: string) => void;
  resetShelves: () => void;

  // Admin Orders Management
  orders: OrderRecord[];
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
  clearOrders: () => void;
  seedDemoOrders: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Cart items
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('fraiters_merch_cart');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  // Dynamic products list from server
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoaded, setIsProductsLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(INITIAL_PRODUCTS); // fallback if empty
        }
        setIsProductsLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
        setProducts(INITIAL_PRODUCTS);
        setIsProductsLoaded(true);
      });
  }, []);

  // Sync back to localstorage or keep it purely server based?
  // Since we want sqlite to be the source of truth, we probably should remove localstorage for products
  // For now let's just use state that gets seeded from the API

  // Dynamic shelves list from localStorage
  const [shelves, setShelves] = useState<ShelfLocation[]>(() => {
    if (typeof window === 'undefined') return INITIAL_SHELVES;
    try {
      const saved = localStorage.getItem('fraiters_merch_shelves');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_SHELVES;
  });

  // Orders list from localStorage
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ORDERS;
    try {
      const saved = localStorage.getItem('fraiters_merch_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignore
    }
    return INITIAL_ORDERS;
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<'cdek' | 'post' | 'shelf'>('cdek');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastOrder, setLastOrder] = useState<OrderRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('sections');

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fraiters_merch_cart', JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // Sync shelves to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fraiters_merch_shelves', JSON.stringify(shelves));
    } catch {
      // Ignore
    }
  }, [shelves]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('fraiters_merch_orders', JSON.stringify(orders));
    } catch {
      // Ignore
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`«${product.name}» добавлен в корзину`);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const deliveryCost =
    selectedDelivery === 'shelf' ? 0 : selectedDelivery === 'post' ? 350 : 420;

  const totalPrice = subtotal + (cart.length > 0 ? deliveryCost : 0);

  const submitOrder = (values: OrderFormValues) => {
    const orderId = `FR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderRecord = {
      id: orderId,
      date: new Date().toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      values,
      total: totalPrice,
      status: 'new',
    };
    setLastOrder(newOrder);
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    return orderId;
  };

  const closeOrderSuccess = () => {
    setLastOrder(null);
  };

  // Product Admin actions
  const addProduct = async (newProd: Product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      });
      if (!res.ok) throw new Error('Failed to add product');
      const added = await res.json();
      setProducts((prev) => [added, ...prev]);
      showToast(`Товар «${newProd.name}» добавлен в ассортимент!`);
    } catch (e) {
      console.error(e);
      showToast('Ошибка при добавлении товара');
    }
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Failed to update product');
      const updatedProduct = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
      );
      showToast('Товар успешно обновлен');
    } catch (e) {
      console.error(e);
      showToast('Ошибка при обновлении товара');
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast('Товар удален из каталога');
    } catch (e) {
      console.error(e);
      showToast('Ошибка при удалении товара');
    }
  };

  const resetProducts = async () => {
    // Ideally this would wipe DB and re-seed, but for now just mock it
    showToast('Сброс ассортимента через API пока не реализован');
  };

  // Shelf Admin actions
  const addShelf = (shelf: ShelfLocation) => {
    setShelves((prev) => [shelf, ...prev]);
    showToast(`Полочка в городе ${shelf.city} добавлена!`);
  };

  const updateShelf = (id: string, updated: Partial<ShelfLocation>) => {
    setShelves((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
    showToast('Данные полочки обновлены');
  };

  const deleteShelf = (id: string) => {
    setShelves((prev) => prev.filter((s) => s.id !== id));
    showToast('Полочка удалена');
  };

  const resetShelves = () => {
    setShelves(INITIAL_SHELVES);
    showToast('Список полочек сброшен к исходному');
  };

  // Order Admin actions
  const updateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    showToast(`Статус заказа ${orderId} изменен`);
  };

  const clearOrders = () => {
    setOrders([]);
    showToast('История заказов очищена');
  };

  const seedDemoOrders = () => {
    setOrders(INITIAL_ORDERS);
    showToast('Демо-заказы загружены для статистики!');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryCost,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        selectedDelivery,
        setSelectedDelivery,
        quickViewProduct,
        setQuickViewProduct,
        lastOrder,
        submitOrder,
        closeOrderSuccess,
        toastMessage,
        viewMode,
        setViewMode,

        // Products
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,

        // Shelves
        shelves,
        addShelf,
        updateShelf,
        deleteShelf,
        resetShelves,

        // Orders
        orders,
        updateOrderStatus,
        clearOrders,
        seedDemoOrders,
      }}
    >
      {children}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-card border border-primary/50 text-white px-4 py-3 rounded-lg shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
