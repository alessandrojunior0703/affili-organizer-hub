import { useState, useEffect, useMemo } from 'react';
import { Product, FilterOptions, SortOption } from '@/types/product';

const STORAGE_KEY = 'affiliate-products';

const getStoredProducts = (): Product[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const detectStore = (link: string): 'amazon' | 'shopee' | 'other' => {
  const lowerLink = link.toLowerCase();
  if (lowerLink.includes('amazon') || lowerLink.includes('amzn')) {
    return 'amazon';
  }
  if (lowerLink.includes('shopee')) {
    return 'shopee';
  }
  return 'other';
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    store: 'all',
    sortBy: 'newest',
  });

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'store'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      store: detectStore(productData.affiliateLink),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    saveProducts(updated);
    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    const updated = products.map((p) =>
      p.id === id
        ? {
            ...p,
            ...productData,
            store: productData.affiliateLink ? detectStore(productData.affiliateLink) : p.store,
            updatedAt: new Date().toISOString(),
          }
        : p
    );
    setProducts(updated);
    saveProducts(updated);
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    saveProducts(updated);
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(searchLower));
    }

    // Store filter
    if (filters.store !== 'all') {
      result = result.filter((p) => p.store === filters.store);
    }

    // Price filter
    if (filters.minPrice !== undefined) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    // Discount filter
    if (filters.minDiscount !== undefined) {
      result = result.filter((p) => (p.discount || 0) >= filters.minDiscount!);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'commission-asc':
        result.sort((a, b) => (a.commission || 0) - (b.commission || 0));
        break;
      case 'commission-desc':
        result.sort((a, b) => (b.commission || 0) - (a.commission || 0));
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [products, filters]);

  return {
    products: filteredProducts,
    allProducts: products,
    filters,
    setFilters,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
