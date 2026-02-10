'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import ProductCard from '@/components/ProductCard';
import { searchProducts } from '@/data/products';
import styles from './page.module.css';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const results = query ? searchProducts(query) : [];

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>
        {query ? (
          <>Search results for &quot;<span className={styles.query}>{query}</span>&quot; <span className={styles.count}>({results.length} products)</span></>
        ) : (
          'Search for products'
        )}
      </h1>
      {results.length > 0 ? (
        <div className={styles.productGrid}>
          {results.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : query ? (
        <div className={styles.empty}>
          <span>🔍</span>
          <h3>No products found</h3>
          <p>Try searching for something else</p>
        </div>
      ) : (
        <div className={styles.empty}>
          <span>🛒</span>
          <h3>Start searching</h3>
          <p>Use the search bar above to find products</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.page}><p>Loading...</p></div>}>
      <SearchResults />
    </Suspense>
  );
}
