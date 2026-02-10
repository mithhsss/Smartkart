'use client';
import { use } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { getProductsByCategory } from '@/data/products';
import { getCategoryBySlug, categories } from '@/data/categories';
import styles from './page.module.css';

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const category = getCategoryBySlug(slug);
  const allProducts = getProductsByCategory(slug);
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState('all');

  let filtered = [...allProducts];
  if (priceRange === 'under100') filtered = filtered.filter(p => p.price < 100);
  else if (priceRange === '100-300') filtered = filtered.filter(p => p.price >= 100 && p.price <= 300);
  else if (priceRange === 'above300') filtered = filtered.filter(p => p.price > 300);

  if (sortBy === 'priceLow') filtered.sort((a, b) => a.price - b.price);
  else if (sortBy === 'priceHigh') filtered.sort((a, b) => b.price - a.price);
  else if (sortBy === 'discount') filtered.sort((a, b) => b.discount - a.discount);
  else if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);

  if (!category) {
    return (
      <div className={styles.notFound}>
        <h2>Category not found</h2>
        <Link href="/">Go back home</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link>
        <span>/</span>
        <span>{category.name}</span>
      </div>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.filterGroup}>
            <h4>Categories</h4>
            {categories.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`${styles.filterItem} ${cat.slug === slug ? styles.activeFilter : ''}`}
              >
                <span>{cat.icon}</span> {cat.name}
              </Link>
            ))}
          </div>
          <div className={styles.filterGroup}>
            <h4>Price Range</h4>
            <label className={styles.radioItem}>
              <input type="radio" name="price" checked={priceRange === 'all'} onChange={() => setPriceRange('all')} /> All
            </label>
            <label className={styles.radioItem}>
              <input type="radio" name="price" checked={priceRange === 'under100'} onChange={() => setPriceRange('under100')} /> Under ₹100
            </label>
            <label className={styles.radioItem}>
              <input type="radio" name="price" checked={priceRange === '100-300'} onChange={() => setPriceRange('100-300')} /> ₹100 - ₹300
            </label>
            <label className={styles.radioItem}>
              <input type="radio" name="price" checked={priceRange === 'above300'} onChange={() => setPriceRange('above300')} /> Above ₹300
            </label>
          </div>
        </aside>

        {/* Main Content */}
        <div className={styles.main}>
          <div className={styles.topBar}>
            <h1 className={styles.title}>
              {category.icon} {category.name}
              <span className={styles.count}>{filtered.length} products</span>
            </h1>
            <select className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="popularity">Sort by: Popularity</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="discount">Discount</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          {filtered.length > 0 ? (
            <div className={styles.productGrid}>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>No products match your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
