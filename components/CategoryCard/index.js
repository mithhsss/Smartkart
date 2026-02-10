import Link from 'next/link';
import styles from './CategoryCard.module.css';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/category/${category.slug}`} className={styles.card}>
      <div className={styles.iconWrap} style={{ background: category.color + '18' }}>
        <span className={styles.icon}>{category.icon}</span>
      </div>
      <span className={styles.name}>{category.name}</span>
    </Link>
  );
}
