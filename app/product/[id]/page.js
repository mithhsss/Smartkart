'use client';
import { use } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { useCart } from '@/context/CartContext';
import { getProductById, getProductsByCategory } from '@/data/products';
import styles from './page.module.css';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const product = getProductById(id);
  const { items, addItem, updateQuantity } = useCart();

  if (!product) {
    return <div className={styles.notFound}><h2>Product not found</h2><Link href="/">Go Home</Link></div>;
  }

  const cartItem = items.find(i => i.id === product.id);
  const similar = getProductsByCategory(product.category).filter(p => p.id !== product.id).slice(0, 4);

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link href="/">Home</Link><span>/</span>
        <Link href={`/category/${product.category}`}>{product.category.replace(/-/g, ' ')}</Link><span>/</span>
        <span>{product.name}</span>
      </div>
      <div className={styles.product}>
        <div className={styles.imageSection}>
          {product.discount > 0 && <span className={styles.badge}>{product.discount}% OFF</span>}
          <img src={product.image} alt={product.name} className={styles.image} />
        </div>
        <div className={styles.details}>
          <span className={styles.brand}>{product.brand}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.rating}>⭐ {product.rating} <span>| {product.weight}</span></div>
          <div className={styles.priceBox}>
            <span className={styles.price}>₹{product.price}</span>
            {product.mrp > product.price && <span className={styles.mrp}>₹{product.mrp}</span>}
            {product.discount > 0 && <span className={styles.save}>You save ₹{product.mrp - product.price}</span>}
          </div>
          <p className={styles.desc}>{product.description}</p>
          <div className={styles.meta}>
            <div className={styles.metaItem}><span>📦</span> Free delivery above ₹499</div>
            <div className={styles.metaItem}><span>⚡</span> Delivery in 10 minutes</div>
            <div className={styles.metaItem}><span>🔄</span> Easy returns within 24 hours</div>
          </div>
          {cartItem ? (
            <div className={styles.qtyControl}>
              <button onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}>−</button>
              <span>{cartItem.quantity}</span>
              <button onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}>+</button>
            </div>
          ) : (
            <button className={styles.addBtn} onClick={() => addItem(product)}>🛒 Add to Cart</button>
          )}
        </div>
      </div>
      {similar.length > 0 && (
        <div className={styles.similarSection}>
          <h2>Similar Products</h2>
          <div className={styles.similarGrid}>
            {similar.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
