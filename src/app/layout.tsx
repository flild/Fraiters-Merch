import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { CartProvider } from '@/lib/cart-context';
import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import ProductModal from '@/components/ProductModal';
import OrderSuccessModal from '@/components/OrderSuccessModal';
import Footer from '@/components/Footer';
import PageTransition from '@/components/PageTransition';
import ScrollToTop from '@/components/ScrollToTop';
import { siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: `${siteConfig.siteName.toUpperCase()} — Официальный магазин авторского мерча`,
  description: `Коллекционный мерч от ${siteConfig.siteName.split(' ')[0]}: двусторонние акриловые стенды, диорамы, голографические брелоки, виниловые стикерпаки и оверсайз худи. Доставка СДЭК и Почтой РФ.`,
  keywords: [siteConfig.siteName.split(' ')[0], 'мерч', 'акриловый стенд', 'брелок', 'стикеры', 'худи', 'аниме мерч', `тгк ${siteConfig.telegramHandle}`],
  authors: [{ name: siteConfig.siteName.split(' ')[0] }],
  creator: siteConfig.siteName.split(' ')[0],
  publisher: siteConfig.siteName,
  robots: 'index, follow',
  openGraph: {
    title: `${siteConfig.siteName.toUpperCase()} — Коллекционный мерч и аксессуары`,
    description: `Оригинальные акриловые стенды, брелоки, открытки и худи от ${siteConfig.siteName.split(' ')[0]}. Заказывайте с доставкой по РФ и СНГ.`,
    type: 'website',
    locale: 'ru_RU',
    siteName: siteConfig.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.siteName.toUpperCase()} — Коллекционный мерч и аксессуары`,
    description: `Официальный магазин мерча ${siteConfig.siteName.split(' ')[0]}. Доставка по РФ и СНГ, витрины в Москве, СПб, Казани и Екб.`,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'OnlineStore',
  name: siteConfig.siteName,
  description: `Официальный интернет-магазин авторского мерча и аксессуаров ${siteConfig.siteName.split(' ')[0]}.`,
  url: siteConfig.telegramUrl,
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
      <body suppressHydrationWarning className="bg-background text-foreground antialiased selection:bg-primary selection:text-white min-h-screen">
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <PageTransition>
                {children}
              </PageTransition>
            </main>
            <Footer />
            <CartDrawer />
            <ProductModal />
            <OrderSuccessModal />
            <ScrollToTop />
          </div>
        </CartProvider>
      </body>
    </html>
  );
}