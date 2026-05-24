/**
 * Helper functions untuk product card quick add logic
 */

/**
 * Get active variations dengan stok > 0
 */
export const getActiveVariations = (product) => {
  if (!product?.variations) return [];
  return product.variations.filter(v => v.is_active && v.stock_qty > 0);
};

/**
 * Check apakah produk stok habis
 */
export const isProductOutOfStock = (product) => {
  // Jika tidak ada variasi, anggap stok tersedia
  if (!product?.variations || product.variations.length === 0) {
    return false;
  }

  // Jika ada variasi tapi semua stok habis atau tidak aktif
  const activeVars = getActiveVariations(product);
  return activeVars.length === 0;
};

/**
 * Determine aksi untuk tombol cart
 * Returns: 'disabled' | 'direct-add' | 'direct-add-one-variant' | 'open-modal'
 */
export const getCartActionType = (product) => {
  // Check stok habis
  if (isProductOutOfStock(product)) {
    return 'disabled';
  }

  // Produk tanpa variasi
  if (!product?.variations || product.variations.length === 0) {
    return 'direct-add';
  }

  // Produk dengan variasi
  const activeVars = getActiveVariations(product);

  // Hanya 1 variasi aktif
  if (activeVars.length === 1) {
    return 'direct-add-one-variant';
  }

  // Lebih dari 1 variasi
  return 'open-modal';
};

/**
 * Get first active variation atau null
 */
export const getFirstActiveVariation = (product) => {
  const activeVars = getActiveVariations(product);
  return activeVars.length > 0 ? activeVars[0] : null;
};

/**
 * Get total stok produk (sum dari semua variasi aktif)
 */
export const getTotalActiveStock = (product) => {
  const activeVars = getActiveVariations(product);
  return activeVars.reduce((sum, v) => sum + v.stock_qty, 0);
};
