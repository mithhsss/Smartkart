'use client';
import Link from 'next/link';
import styles from './page.module.css';

const dummyOrders = [
  {
    id: 'SK284913',
    date: '10 Feb 2026, 9:45 AM',
    status: 'Delivered',
    statusColor: '#60b246',
    total: 847,
    items: [
      { name: 'Fresh Bananas', qty: 2, price: 45 },
      { name: 'Amul Toned Milk', qty: 3, price: 28 },
      { name: 'Greek Yogurt', qty: 1, price: 85 },
      { name: 'Mixed Nuts', qty: 1, price: 350 },
    ],
    deliveredAt: '10 Feb 2026, 9:55 AM',
  },
  {
    id: 'SK271840',
    date: '8 Feb 2026, 6:30 PM',
    status: 'Delivered',
    statusColor: '#60b246',
    total: 1243,
    items: [
      { name: 'Chicken Breast', qty: 2, price: 250 },
      { name: 'Basmati Rice', qty: 1, price: 399 },
      { name: 'Garam Masala', qty: 1, price: 95 },
      { name: 'Toor Dal', qty: 1, price: 135 },
    ],
    deliveredAt: '8 Feb 2026, 6:42 PM',
  },
  {
    id: 'SK265421',
    date: '5 Feb 2026, 11:15 AM',
    status: 'Cancelled',
    statusColor: '#e23744',
    total: 565,
    items: [
      { name: 'Dove Body Wash', qty: 1, price: 245 },
      { name: 'Colgate Toothpaste', qty: 2, price: 105 },
    ],
    deliveredAt: null,
  },
  {
    id: 'SK258190',
    date: '2 Feb 2026, 3:00 PM',
    status: 'Delivered',
    statusColor: '#60b246',
    total: 796,
    items: [
      { name: 'Baby Diapers', qty: 1, price: 499 },
      { name: 'Baby Wipes', qty: 1, price: 175 },
      { name: 'Baby Shampoo', qty: 1, price: 195 },
    ],
    deliveredAt: '2 Feb 2026, 3:12 PM',
  },
];

export default function OrdersPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>📦 My Orders</h1>
      <div className={styles.orders}>
        {dummyOrders.map(order => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div>
                <span className={styles.orderId}>Order #{order.id}</span>
                <span className={styles.orderDate}>{order.date}</span>
              </div>
              <span className={styles.status} style={{ background: order.statusColor + '18', color: order.statusColor }}>
                {order.status}
              </span>
            </div>
            <div className={styles.orderItems}>
              {order.items.map((item, i) => (
                <div key={i} className={styles.orderItem}>
                  <span>{item.name}</span>
                  <span>×{item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>
            <div className={styles.orderFooter}>
              <span className={styles.orderTotal}>Total: ₹{order.total}</span>
              {order.deliveredAt && <span className={styles.deliveredAt}>Delivered at {order.deliveredAt}</span>}
              <Link href="/" className={styles.reorderBtn}>Reorder</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
