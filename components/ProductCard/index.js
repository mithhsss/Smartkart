'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(item => item.id === product.id);

  return (
    <div className={styles.card}>
      {product.discount > 0 && (
        <span className={styles.discountBadge}>{product.discount}% OFF</span>
      )}
      <Link href={`/product/${product.id}`} className={styles.imageWrap}>
        <img src={product.image} alt={product.name} className={styles.image} />
      </Link>
      <div className={styles.info}>
        <span className={styles.weight}>{product.weight}</span>
        <Link href={`/product/${product.id}`} className={styles.name}>{product.name}</Link>
        <span className={styles.brand}>{product.brand}</span>
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{product.price}</span>
          {product.mrp > product.price && (
            <span className={styles.mrp}>₹{product.mrp}</span>
          )}
        </div>
        {!product.inStock ? (
          <button className={styles.outOfStock} disabled>Out of Stock</button>
        ) : cartItem ? (
          <div className={styles.quantityControl}>
            <button className={styles.qtyBtn} onClick={() => updateQuantity(product.id, cartItem.quantity - 1)}>−</button>
            <span className={styles.qtyValue}>{cartItem.quantity}</span>
            <button className={styles.qtyBtn} onClick={() => updateQuantity(product.id, cartItem.quantity + 1)}>+</button>
          </div>
        ) : (
          <button className={styles.addBtn} onClick={() => addItem(product)}>ADD</button>
        )}
      </div>
    </div>
  );
}
