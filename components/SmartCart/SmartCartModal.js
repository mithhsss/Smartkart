'use client';
import { useState, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { matchAllItems } from '@/lib/matchProducts';
import styles from './SmartCartModal.module.css';

const STEPS = ['Upload Image', 'Preferences', 'Select Products'];

export default function SmartCartModal({ isOpen, onClose }) {
  const { addItem } = useCart();
  const [step, setStep] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageData, setImageData] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [isLoading, setIsLoading] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [preference, setPreference] = useState('quality');
  const [matchedItems, setMatchedItems] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [error, setError] = useState('');
  const [isMock, setIsMock] = useState(false);
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  if (!isOpen) return null;

  const resetState = () => {
    setStep(0);
    setImagePreview(null);
    setImageData(null);
    setExtractedItems([]);
    setPreference('quality');
    setMatchedItems([]);
    setSelectedProducts({});
    setError('');
    setIsLoading(false);
    setIsMock(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    setError('');
    setMimeType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      // Get base64 without the data:image/xxx;base64, prefix
      const base64 = e.target.result.split(',')[1];
      setImageData(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleScanImage = async () => {
    if (!imageData) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/extract-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData, mimeType }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to analyze image');
        setIsLoading(false);
        return;
      }

      if (data.items.length === 0) {
        setError('No grocery items found in this image. Try a different photo.');
        setIsLoading(false);
        return;
      }

      setExtractedItems(data.items);
      setIsMock(data.mock);
      setStep(1);
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setIsLoading(false);
  };

  const handlePreferenceSelect = (pref) => {
    setPreference(pref);
  };

  const handlePreferenceNext = () => {
    const matched = matchAllItems(extractedItems, preference);
    setMatchedItems(matched);

    // Pre-select the first match for each item
    const preSelected = {};
    matched.forEach((item, idx) => {
      if (item.matches.length > 0) {
        preSelected[idx] = item.matches[0].id;
      }
    });
    setSelectedProducts(preSelected);
    setStep(2);
  };

  const handleProductSelect = (itemIdx, productId) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      if (next[itemIdx] === productId) {
        delete next[itemIdx]; // Deselect
      } else {
        next[itemIdx] = productId;
      }
      return next;
    });
  };

  const handleSkipItem = (itemIdx) => {
    setSelectedProducts(prev => {
      const next = { ...prev };
      delete next[itemIdx];
      return next;
    });
  };

  const handleAddToCart = () => {
    const productsToAdd = [];
    Object.entries(selectedProducts).forEach(([itemIdx, productId]) => {
      const matchGroup = matchedItems[parseInt(itemIdx)];
      if (matchGroup) {
        const product = matchGroup.matches.find(m => m.id === productId);
        if (product) productsToAdd.push(product);
      }
    });

    productsToAdd.forEach(product => {
      // Remove matchScore before adding
      const { matchScore, ...cleanProduct } = product;
      addItem(cleanProduct);
    });

    handleClose();
  };

  const selectedCount = Object.keys(selectedProducts).length;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.headerIcon}>📷</span>
            <h2>Smart Cart</h2>
          </div>
          <button className={styles.closeBtn} onClick={handleClose}>✕</button>
        </div>

        {/* Step Indicator */}
        <div className={styles.steps}>
          {STEPS.map((s, i) => (
            <div key={i} className={`${styles.stepItem} ${i === step ? styles.activeStep : ''} ${i < step ? styles.doneStep : ''}`}>
              <span className={styles.stepNum}>{i < step ? '✓' : i + 1}</span>
              <span className={styles.stepLabel}>{s}</span>
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className={styles.content}>
          {/* STEP 0: Upload Image */}
          {step === 0 && (
            <div className={styles.uploadStep}>
              {isMock && (
                <div className={styles.mockBanner}>
                  ℹ️ No Gemini API key set — using demo data. Add <code>NEXT_PUBLIC_GEMINI_API_KEY</code> to <code>.env.local</code> for real extraction.
                </div>
              )}
              <div
                className={`${styles.dropZone} ${dragOver ? styles.dragOver : ''} ${imagePreview ? styles.hasImage : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
              >
                {imagePreview ? (
                  <div className={styles.preview}>
                    <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                    <button className={styles.changeBtn} onClick={(e) => { e.stopPropagation(); setImagePreview(null); setImageData(null); }}>
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className={styles.dropContent}>
                    <span className={styles.dropIcon}>📸</span>
                    <h3>Upload your grocery list</h3>
                    <p>Take a photo of your grocery list, fridge, recipe, or any food items</p>
                    <span className={styles.dragText}>Drag & drop or click to browse</span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className={styles.fileInput}
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {error && <div className={styles.error}>{error}</div>}
              <button
                className={styles.primaryBtn}
                onClick={handleScanImage}
                disabled={!imageData || isLoading}
              >
                {isLoading ? (
                  <span className={styles.loadingText}>
                    <span className={styles.spinner}></span> Scanning with AI...
                  </span>
                ) : (
                  '🔍 Scan Items'
                )}
              </button>
            </div>
          )}

          {/* STEP 1: Preferences */}
          {step === 1 && (
            <div className={styles.prefStep}>
              {isMock && (
                <div className={styles.mockBanner}>
                  ℹ️ Using demo items (no API key). Set <code>NEXT_PUBLIC_GEMINI_API_KEY</code> in <code>.env.local</code> for real results.
                </div>
              )}
              <div className={styles.extractedSummary}>
                <h3>🎉 Found {extractedItems.length} items!</h3>
                <div className={styles.pillList}>
                  {extractedItems.map((item, i) => (
                    <span key={i} className={styles.pill}>{item.name} <small>({item.quantity})</small></span>
                  ))}
                </div>
              </div>

              <h3 className={styles.prefTitle}>How would you like us to match products?</h3>

              <div className={styles.prefCards}>
                <button
                  className={`${styles.prefCard} ${preference === 'quality' ? styles.activePref : ''}`}
                  onClick={() => handlePreferenceSelect('quality')}
                >
                  <span className={styles.prefIcon}>🌟</span>
                  <strong>Quality First</strong>
                  <p>Top-rated, premium brands</p>
                </button>
                <button
                  className={`${styles.prefCard} ${preference === 'budget' ? styles.activePref : ''}`}
                  onClick={() => handlePreferenceSelect('budget')}
                >
                  <span className={styles.prefIcon}>💰</span>
                  <strong>Budget First</strong>
                  <p>Best prices, maximum savings</p>
                </button>
                <button
                  className={`${styles.prefCard} ${preference === 'quantity' ? styles.activePref : ''}`}
                  onClick={() => handlePreferenceSelect('quantity')}
                >
                  <span className={styles.prefIcon}>📦</span>
                  <strong>Quantity First</strong>
                  <p>Best value for money</p>
                </button>
              </div>

              <div className={styles.stepActions}>
                <button className={styles.backBtn} onClick={() => setStep(0)}>← Back</button>
                <button className={styles.primaryBtn} onClick={handlePreferenceNext}>
                  Show Options →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select Products */}
          {step === 2 && (
            <div className={styles.selectStep}>
              <div className={styles.selectHeader}>
                <h3>Select products for each item</h3>
                <span className={styles.selectCount}>{selectedCount} of {matchedItems.length} selected</span>
              </div>

              <div className={styles.itemList}>
                {matchedItems.map((item, idx) => (
                  <div key={idx} className={styles.matchGroup}>
                    <div className={styles.matchHeader}>
                      <span className={styles.matchName}>{item.extractedName}</span>
                      <span className={styles.matchQty}>{item.extractedQuantity}</span>
                      {selectedProducts[idx] === undefined && (
                        <span className={styles.skippedBadge}>Skipped</span>
                      )}
                    </div>

                    {item.matches.length > 0 ? (
                      <div className={styles.matchOptions}>
                        {item.matches.map(product => (
                          <button
                            key={product.id}
                            className={`${styles.matchOption} ${selectedProducts[idx] === product.id ? styles.selectedOption : ''}`}
                            onClick={() => handleProductSelect(idx, product.id)}
                          >
                            <img src={product.image} alt={product.name} className={styles.optionImage} />
                            <div className={styles.optionInfo}>
                              <span className={styles.optionName}>{product.name}</span>
                              <span className={styles.optionBrand}>{product.brand} • {product.weight}</span>
                              <div className={styles.optionPrice}>
                                <span>₹{product.price}</span>
                                {product.mrp > product.price && (
                                  <span className={styles.optionMrp}>₹{product.mrp}</span>
                                )}
                              </div>
                            </div>
                            <div className={styles.optionMeta}>
                              <span className={styles.optionRating}>⭐ {product.rating}</span>
                              {selectedProducts[idx] === product.id && (
                                <span className={styles.checkMark}>✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                        {selectedProducts[idx] !== undefined && (
                          <button className={styles.skipBtn} onClick={() => handleSkipItem(idx)}>
                            Skip this item
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className={styles.noMatch}>
                        <span>😕</span> No matching products found
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className={styles.stepActions}>
                <button className={styles.backBtn} onClick={() => setStep(1)}>← Back</button>
                <button
                  className={styles.primaryBtn}
                  onClick={handleAddToCart}
                  disabled={selectedCount === 0}
                >
                  🛒 Add {selectedCount} Items to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
