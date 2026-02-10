import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span>⚡</span> SmartKart
            </div>
            <p className={styles.tagline}>Groceries delivered in 10 minutes. Fresh, fast, and reliable.</p>
            <div className={styles.socials}>
              <a href="#" className={styles.socialLink}>𝕏</a>
              <a href="#" className={styles.socialLink}>📷</a>
              <a href="#" className={styles.socialLink}>📘</a>
              <a href="#" className={styles.socialLink}>▶️</a>
            </div>
          </div>
          <div className={styles.links}>
            <h4>Useful Links</h4>
            <Link href="/about">About Us</Link>
            <Link href="/careers">Careers</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className={styles.links}>
            <h4>Categories</h4>
            <Link href="/category/fruits-vegetables">Fruits & Vegetables</Link>
            <Link href="/category/dairy-breakfast">Dairy & Breakfast</Link>
            <Link href="/category/snacks-munchies">Snacks & Munchies</Link>
            <Link href="/category/beverages">Beverages</Link>
          </div>
          <div className={styles.links}>
            <h4>Help</h4>
            <Link href="/faq">FAQ</Link>
            <Link href="/terms">Terms & Conditions</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/refund">Refund Policy</Link>
          </div>
          <div className={styles.appSection}>
            <h4>Download App</h4>
            <div className={styles.appBadges}>
              <a href="#" className={styles.appBadge}>
                <span>📱</span> App Store
              </a>
              <a href="#" className={styles.appBadge}>
                <span>🤖</span> Google Play
              </a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© 2026 SmartKart. All rights reserved. Made with ❤️ in India.</p>
        </div>
      </div>
    </footer>
  );
}
