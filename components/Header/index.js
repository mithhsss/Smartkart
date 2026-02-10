'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useSearch } from '@/context/SearchContext';
import SmartCartModal from '@/components/SmartCart/SmartCartModal';
import styles from './Header.module.css';

export default function Header() {
  const { itemCount, subtotal } = useCart();
  const { user, isLoggedIn, logout, setIsLoginOpen } = useAuth();
  const { setQuery, setIsSearchOpen } = useSearch();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [smartCartOpen, setSmartCartOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      setQuery(searchValue.trim());
      window.location.href = `/search?q=${encodeURIComponent(searchValue.trim())}`;
    }
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>SmartKart</span>
            <span className={styles.logoTag}>INSTAMART</span>
          </Link>

          {/* Delivery Info */}
          <div className={styles.deliveryInfo}>
            <span className={styles.deliveryTime}>🕐 10 min</span>
            <div className={styles.location}>
              <span className={styles.locationLabel}>Deliver to</span>
              <span className={styles.locationValue}>
                {isLoggedIn ? user.addresses[0]?.label || 'Home' : 'Bangalore'} ▾
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <form className={styles.searchBar} onSubmit={handleSearch}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search for groceries, fruits, snacks..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Smart Cart Camera Button */}
            <button
              className={styles.cameraBtn}
              onClick={() => setSmartCartOpen(true)}
              title="Scan grocery list"
            >
              📷
            </button>

            {isLoggedIn ? (
              <div className={styles.userMenu}>
                <button className={styles.userBtn} onClick={() => setMenuOpen(!menuOpen)}>
                  <span className={styles.userAvatar}>👤</span>
                  <span className={styles.userName}>{user.name}</span>
                </button>
                {menuOpen && (
                  <div className={styles.dropdown}>
                    <Link href="/orders" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>📦 My Orders</Link>
                    <button className={styles.dropdownItem} onClick={() => { logout(); setMenuOpen(false); }}>🚪 Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => setIsLoginOpen(true)}>
                <Link href="/login" style={{color:'inherit',textDecoration:'none'}}>Login</Link>
              </button>
            )}

            <Link href="/cart" className={styles.cartBtn}>
              <span className={styles.cartIcon}>🛒</span>
              {itemCount > 0 && (
                <>
                  <span className={styles.cartBadge}>{itemCount}</span>
                  <span className={styles.cartTotal}>₹{subtotal}</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Smart Cart Modal */}
      <SmartCartModal isOpen={smartCartOpen} onClose={() => setSmartCartOpen(false)} />
    </>
  );
}
