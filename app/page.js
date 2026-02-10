'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/categories';
import { banners } from '@/data/banners';
import { products, getTrendingProducts, getTopOffers } from '@/data/products';
import styles from './page.module.css';

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const trending = getTrendingProducts();
  const topOffers = getTopOffers();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      {/* Delivery Strip */}
      <div className={styles.deliveryStrip}>
        <div className={styles.stripContent}>
          <span className={styles.stripIcon}>⚡</span>
          <span>Fastest delivery in <strong>10 minutes</strong> — Order now!</span>
          <span className={styles.stripIcon}>⚡</span>
        </div>
      </div>

      {/* Hero Banner Carousel */}
      <section className={styles.heroSection}>
        <div className={styles.carousel}>
          {banners.map((banner, index) => (
            <Link
              key={banner.id}
              href={banner.link}
              className={`${styles.banner} ${index === currentBanner ? styles.active : ''}`}
              style={{ background: banner.gradient }}
            >
              <span className={styles.bannerBadge}>{banner.badge}</span>
              <h2 className={styles.bannerTitle}>{banner.title}</h2>
              <p className={styles.bannerSubtitle}>{banner.subtitle}</p>
              <span className={styles.bannerCta}>Shop Now →</span>
            </Link>
          ))}
          <div className={styles.dots}>
            {banners.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === currentBanner ? styles.activeDot : ''}`}
                onClick={() => setCurrentBanner(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Shop by Category</h2>
        <div className={styles.categoryGrid}>
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Top Offers */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🔥 Top Offers</h2>
          <p className={styles.sectionSub}>Best discounts curated for you</p>
        </div>
        <div className={styles.productGrid}>
          {topOffers.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className={styles.promoBanner}>
        <div className={styles.promoContent}>
          <div className={styles.promoText}>
            <h3>Free Delivery on orders above ₹499</h3>
            <p>Use code <strong>FREESHIP</strong> at checkout</p>
          </div>
          <Link href="/category/fruits-vegetables" className={styles.promoBtn}>Shop Now</Link>
        </div>
      </section>

      {/* Trending Products */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🚀 Trending Now</h2>
          <p className={styles.sectionSub}>Popular picks this week</p>
        </div>
        <div className={styles.productGrid}>
          {trending.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why SmartKart */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle} style={{textAlign:'center'}}>Why SmartKart?</h2>
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⚡</span>
            <h4>10 Min Delivery</h4>
            <p>Lightning-fast delivery from our micro-warehouses</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🥬</span>
            <h4>Fresh Guarantee</h4>
            <p>Farm-fresh produce or we replace it for free</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>💰</span>
            <h4>Best Prices</h4>
            <p>Save more with exclusive app-only deals daily</p>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔒</span>
            <h4>Safe & Hygienic</h4>
            <p>Temperature-controlled supply chain guarantee</p>
          </div>
        </div>
      </section>
    </div>
  );
}
