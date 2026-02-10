'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { applyOffer, offers } from '@/data/offers';
import { useState } from 'react';
import styles from './page.module.css';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, subtotal, totalSavings, deliveryFee, total, coupon, setCoupon, setCouponDiscount, removeCoupon, couponDiscount } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = () => {
    const result = applyOffer(couponInput, subtotal);
    setCouponMsg(result.message);
    if (result.success) {
      setCoupon(couponInput.toUpperCase());
      setCouponDiscount(result.discount);
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>🛒</span>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet</p>
        <Link href="/" className={styles.shopBtn}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Shopping Cart <span>({items.length} items)</span></h1>
      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map(item => (
            <div key={item.id} className={styles.cartItem}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemInfo}>
                <Link href={`/product/${item.id}`} className={styles.itemName}>{item.name}</Link>
                <span className={styles.itemWeight}>{item.weight}</span>
                <div className={styles.itemPrice}>
                  <span>₹{item.price}</span>
                  {item.mrp > item.price && <span className={styles.itemMrp}>₹{item.mrp}</span>}
                </div>
              </div>
              <div className={styles.itemActions}>
                <div className={styles.qtyControl}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <span className={styles.itemTotal}>₹{item.price * item.quantity}</span>
                <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          {/* Coupon */}
          <div className={styles.couponBox}>
            <h4>🏷️ Apply Coupon</h4>
            {coupon ? (
              <div className={styles.appliedCoupon}>
                <span>✅ {coupon} applied</span>
                <button onClick={() => { removeCoupon(); setCouponMsg(''); setCouponInput(''); }}>Remove</button>
              </div>
            ) : (
              <div className={styles.couponInput}>
                <input type="text" placeholder="Enter coupon code" value={couponInput} onChange={(e) => setCouponInput(e.target.value)} />
                <button onClick={handleApplyCoupon}>Apply</button>
              </div>
            )}
            {couponMsg && <p className={styles.couponMsg}>{couponMsg}</p>}
            <div className={styles.availableCoupons}>
              {offers.slice(0, 3).map(o => (
                <div key={o.id} className={styles.couponTag} onClick={() => { setCouponInput(o.code); }}>
                  <strong>{o.code}</strong> — {o.description}
                </div>
              ))}
            </div>
          </div>

          {/* Bill */}
          <div className={styles.billBox}>
            <h4>Bill Details</h4>
            <div className={styles.billRow}><span>Item Total</span><span>₹{subtotal}</span></div>
            <div className={styles.billRow}><span>Delivery Fee</span><span className={deliveryFee === 0 ? styles.free : ''}>
              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
            </div>
            {couponDiscount > 0 && (
              <div className={styles.billRow}><span>Coupon Discount</span><span className={styles.discount}>-₹{couponDiscount}</span></div>
            )}
            {totalSavings > 0 && (
              <div className={styles.billRow}><span>Total Savings</span><span className={styles.discount}>₹{totalSavings}</span></div>
            )}
            <div className={`${styles.billRow} ${styles.totalRow}`}><span>To Pay</span><span>₹{total}</span></div>
          </div>

          <Link href="/checkout" className={styles.checkoutBtn}>Proceed to Checkout →</Link>
        </div>
      </div>
    </div>
  );
}
