import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  categoryName: text('categoryName').notNull(),
  price: integer('price').notNull(),
  oldPrice: integer('oldPrice'),
  inStock: integer('inStock', { mode: 'boolean' }).notNull().default(true),
  isPreorder: integer('isPreorder', { mode: 'boolean' }).default(false),
  stockCount: integer('stockCount'),
  badge: text('badge'),
  image: text('image').notNull(),
  fallbackGradient: text('fallbackGradient').notNull(),
  description: text('description').notNull(),
  size: text('size').notNull(),
  material: text('material').notNull(),
  features: text('features', { mode: 'json' }).$type<string[]>().notNull(),
});

export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  fullName: text('fullName').notNull(),
  telegramUsername: text('telegramUsername').notNull(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  postalCode: text('postalCode').notNull(),
  deliveryMethod: text('deliveryMethod').notNull(),
  paymentMethod: text('paymentMethod').notNull(),
  comment: text('comment'),
  total: integer('total').notNull(),
  status: text('status').notNull().default('new'),
  date: text('date').notNull(),
});

export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  productId: text('product_id').notNull().references(() => products.id),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(),
});
