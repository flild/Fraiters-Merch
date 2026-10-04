import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'FRAITERS MERCH — Официальный магазин авторского мерча',
  description: 'Коллекционный мерч от Fraiters: двусторонние акриловые стенды, диорамы, голографические брелоки, виниловые стикерпаки и оверсайз худи. Доставка СДЭК и Почтой РФ, полочки в 4 городах.',
  keywords: ['Fraiters', 'мерч', 'акриловый стенд', 'брелок', 'стикеры', 'худи', 'аниме мерч', 'полочки', 'тгк fraiters'],
  authors: [{ name: 'Fraiters' }],
  creator: 'Fraiters',
  publisher: 'Fraiters Merch',
  robots: 'index, follow',
  openGraph: {
    title: 'FRAITERS MERCH — Коллекционный мерч и аксессуары',
    description: 'Оригинальные акриловые стенды, брелоки, открытки и худи от Fraiters. Заказывайте с доставкой по РФ и СНГ или забирайте на полочках.',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'FRAITERS MERCH',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FRAITERS MERCH — Коллекционный мерч и аксессуары',
    description: 'Официальный магазин мерча Fraiters. Доставка по РФ и СНГ, витрины в Москве, СПб, Казани и Екб.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: 'FRAITERS MERCH',
  description: 'Официальный интернет-магазин авторского мерча и аксессуаров Fraiters.',
  url: 'https://t.me/fraiters',
  currenciesAccepted: 'RUB',
  paymentAccepted: 'Card, SBP',
  priceRange: '290 - 4900 RUB',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'RU',
  },
  hasMerchantReturnPolicy: {
    '@type': 'MerchantReturnPolicy',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="ru" className="scroll-smooth dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning className="bg-[#0b0c10] text-[#f1f3f7] antialiased selection:bg-red-600 selection:text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
