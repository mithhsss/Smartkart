'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import styles from './page.module.css';

export default function CheckoutPage() {
  const { items, subtotal, deliveryFee, total, couponDiscount, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  if (!isLoggedIn) {
    return (
      <div className={styles.loginPrompt}>
        <h2>Please login to continue</h2>
        <p>You need to be logged in to place an order</p>
        <Link href="/login" className={styles.loginBtn}>Login Now</Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className={styles.success}>
        <span className={styles.successIcon}>🎉</span>
        <h2>Order Placed Successfully!</h2>
        <p>Your order #SK{Date.now().toString().slice(-6)} has been placed</p>
        <div className={styles.successInfo}>
          <div><span>📍</span> Delivering to: {user.addresses[selectedAddress]?.label || 'Home'}</div>
          <div><span>⏰</span> Estimated delivery: 10-15 minutes</div>
          <div><span>💳</span> Payment: {paymentMethod.toUpperCase()}</div>
        </div>
        <div className={styles.successActions}>
          <Link href="/orders" className={styles.ordersBtn}>View Orders</Link>
          <Link href="/" className={styles.shopMoreBtn}>Shop More</Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.loginPrompt}>
        <h2>Your cart is empty</h2>
        <Link href="/" className={styles.loginBtn}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Checkout</h1>
      <div className={styles.layout}>
        <div className={styles.left}>
          {/* Delivery Address */}
          <div className={styles.section}>
            <h3>📍 Delivery Address</h3>
            <div className={styles.addresses}>
              {user.addresses.map((addr, i) => (
                <label key={addr.id} className={`${styles.addressCard} ${i === selectedAddress ? styles.activeAddress : ''}`}>
                  <input type="radio" name="address" checked={i === selectedAddress} onChange={() => setSelectedAddress(i)} />
                  <div>
                    <strong>{addr.label}</strong>
                    <p>{addr.address}, {addr.city} - {addr.pincode}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className={styles.section}>
            <h3>💳 Payment Method</h3>
            <div className={styles.payments}>
              {[
                { value: 'upi', label: '📱 UPI (GPay / PhonePe)' },
                { value: 'card', label: '💳 Credit / Debit Card' },
                { value: 'cod', label: '💵 Cash on Delivery' },
                { value: 'wallet', label: '👛 SmartKart Wallet' },
              ].map(pm => (
                <label key={pm.value} className={`${styles.paymentOption} ${paymentMethod === pm.value ? styles.activePayment : ''}`}>
                  <input type="radio" name="payment" value={pm.value} checked={paymentMethod === pm.value} onChange={() => setPaymentMethod(pm.value)} />
                  <span>{pm.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Order Items */}
          <div className={styles.section}>
            <h3>🛒 Order Items ({items.length})</h3>
            <div className={styles.orderItems}>
              {items.map(item => (
                <div key={item.id} className={styles.orderItem}>
                  <img src={item.image} alt={item.name} />
                  <div>
                    <span className={styles.oiName}>{item.name}</span>
                    <span className={styles.oiQty}>{item.quantity} × ₹{item.price}</span>
                  </div>
                  <span className={styles.oiTotal}>₹{item.quantity * item.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.billBox}>
            <h3>Order Summary</h3>
            <div className={styles.billRow}><span>Subtotal</span><span>₹{subtotal}</span></div>
            <div className={styles.billRow}><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
            {couponDiscount > 0 && <div className={styles.billRow}><span>Coupon</span><span>-₹{couponDiscount}</span></div>}
            <div className={`${styles.billRow} ${styles.totalRow}`}><span>Total</span><span>₹{total}</span></div>
            <button className={styles.placeOrderBtn} onClick={() => { setOrderPlaced(true); clearCart(); }}>
              Place Order — ₹{total}
            </button>
            <p className={styles.deliveryNote}>⚡ Estimated delivery in 10-15 minutes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
