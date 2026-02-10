import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { SearchProvider } from '@/context/SearchContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'SmartKart — Groceries Delivered in 10 Minutes',
  description: 'Order fresh groceries, fruits, vegetables, dairy, snacks and more. Get instant delivery to your doorstep with SmartKart Instamart.',
  keywords: 'groceries, delivery, instant, fresh, vegetables, fruits, dairy, snacks',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
              <Header />
              <main style={{ minHeight: '80vh' }}>{children}</main>
              <Footer />
            </SearchProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
