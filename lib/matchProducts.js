import { products } from '@/data/products';

/**
 * Calculate similarity between two strings (case-insensitive, partial match scoring)
 */
function similarity(a, b) {
  const al = a.toLowerCase().trim();
  const bl = b.toLowerCase().trim();

  // Exact match
  if (al === bl) return 1.0;

  // One contains the other
  if (al.includes(bl) || bl.includes(al)) return 0.85;

  // Word-level matching
  const aWords = al.split(/\s+/);
  const bWords = bl.split(/\s+/);
  let matchedWords = 0;
  for (const aw of aWords) {
    for (const bw of bWords) {
      if (aw === bw || aw.includes(bw) || bw.includes(aw)) {
        matchedWords++;
        break;
      }
    }
  }
  const wordScore = matchedWords / Math.max(aWords.length, bWords.length);
  if (wordScore > 0) return 0.5 + wordScore * 0.3;

  // Levenshtein distance based
  const maxLen = Math.max(al.length, bl.length);
  if (maxLen === 0) return 1.0;
  const dist = levenshtein(al, bl);
  const levScore = 1 - dist / maxLen;

  return levScore;
}

function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

/**
 * Find matching products for an extracted item name.
 * Returns top matches sorted by the given preference.
 *
 * @param {string} itemName - The extracted item name (e.g., "Tomatoes")
 * @param {string} preference - "quality" | "budget" | "quantity"
 * @param {number} maxResults - Maximum number of results to return
 * @returns {Array} Matched products with similarity scores
 */
export function matchProducts(itemName, preference = 'quality', maxResults = 4) {
  // Score each product by similarity to the item name
  const scored = products
    .filter(p => p.inStock)
    .map(product => {
      // Check name, category, brand, description for matches
      const nameScore = similarity(itemName, product.name);
      const brandScore = similarity(itemName, product.brand) * 0.5;
      const categoryScore = similarity(itemName, product.category.replace(/-/g, ' ')) * 0.4;

      // Check if item name appears in description
      const descScore = product.description.toLowerCase().includes(itemName.toLowerCase()) ? 0.3 : 0;

      const bestScore = Math.max(nameScore, brandScore, categoryScore, descScore);

      return { ...product, matchScore: bestScore };
    })
    .filter(p => p.matchScore >= 0.3) // Minimum threshold
    .sort((a, b) => b.matchScore - a.matchScore);

  // If we have matches, sort top ones by preference
  const topMatches = scored.slice(0, Math.max(maxResults * 2, 8));

  // Apply preference-based sorting within matches
  switch (preference) {
    case 'quality':
      topMatches.sort((a, b) => {
        // Primary: match score, Secondary: rating, Tertiary: price desc
        if (Math.abs(a.matchScore - b.matchScore) > 0.1) return b.matchScore - a.matchScore;
        if (a.rating !== b.rating) return b.rating - a.rating;
        return b.price - a.price;
      });
      break;

    case 'budget':
      topMatches.sort((a, b) => {
        // Primary: match score, Secondary: price asc, Tertiary: discount desc
        if (Math.abs(a.matchScore - b.matchScore) > 0.1) return b.matchScore - a.matchScore;
        if (a.price !== b.price) return a.price - b.price;
        return b.discount - a.discount;
      });
      break;

    case 'quantity':
      topMatches.sort((a, b) => {
        // Primary: match score, Secondary: best value (lowest price-to-weight ratio)
        if (Math.abs(a.matchScore - b.matchScore) > 0.1) return b.matchScore - a.matchScore;
        // Lower price = better for quantity
        const aValue = a.price / (a.discount > 0 ? (100 - a.discount) / 100 : 1);
        const bValue = b.price / (b.discount > 0 ? (100 - b.discount) / 100 : 1);
        return aValue - bValue;
      });
      break;

    default:
      topMatches.sort((a, b) => b.matchScore - a.matchScore);
  }

  return topMatches.slice(0, maxResults);
}

/**
 * Match multiple extracted items at once
 */
export function matchAllItems(extractedItems, preference = 'quality') {
  return extractedItems.map(item => ({
    extractedName: item.name,
    extractedQuantity: item.quantity,
    matches: matchProducts(item.name, preference),
  }));
}
