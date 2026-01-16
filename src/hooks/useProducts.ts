import { useState, useEffect, useMemo } from 'react';
import { Product, FilterOptions, SortOption } from '@/types/product';
import { fetchProducts, insertProduct, insertProducts, updateProductById, deleteProductById } from '@/lib/productsApi';

const STORAGE_KEY = 'affiliate-products';
const MIGRATION_KEY = 'affiliate-products-migrated';

const canUseStorage = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

const getStoredProducts = (): Product[] => {
  if (!canUseStorage()) {
    return [];
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Product[]) : [];
  } catch {
    return [];
  }
};

const clearStoredProducts = () => {
  if (!canUseStorage()) {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
};

const wasMigrated = () => canUseStorage() && localStorage.getItem(MIGRATION_KEY) === 'true';
const markMigrated = () => {
  if (!canUseStorage()) {
    return;
  }
  localStorage.setItem(MIGRATION_KEY, 'true');
};

export const detectStore = (link: string): string => {
  const lowerLink = link.toLowerCase();
  if (lowerLink.includes('amazon') || lowerLink.includes('amzn')) {
    return 'amazon';
  }
  if (lowerLink.includes('shopee')) {
    return 'shopee';
  }
  if (lowerLink.includes('mercadolivre') || lowerLink.includes('mercadolibre')) {
    return 'mercadolivre';
  }
  if (lowerLink.includes('magalu') || lowerLink.includes('magazineluiza')) {
    return 'magalu';
  }
  if (lowerLink.includes('aliexpress')) {
    return 'aliexpress';
  }
  return 'other';
};

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    store: 'all',
    sortBy: 'newest',
  });

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await fetchProducts();
        if (!wasMigrated()) {
          const stored = getStoredProducts();
          if (stored.length > 0) {
            await insertProducts(stored);
            clearStoredProducts();
            markMigrated();
            const refreshed = await fetchProducts();
            setProducts(refreshed);
            setError(null);
            return;
          }
          markMigrated();
        }

        setProducts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Falha ao carregar produtos.');
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'store'>) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(),
      store: detectStore(productData.affiliateLink),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setIsLoading(true);
    try {
      const inserted = await insertProduct(newProduct);
      setProducts((prev) => [...prev, inserted]);
      setError(null);
      return inserted;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao adicionar produto.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt'>>) => {
    const updatePayload: Partial<Product> = {
      ...productData,
      store: productData.affiliateLink ? detectStore(productData.affiliateLink) : undefined,
      updatedAt: new Date().toISOString(),
    };
    setIsLoading(true);
    try {
      const updated = await updateProductById(id, updatePayload);
      setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setError(null);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar produto.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    setIsLoading(true);
    try {
      await deleteProductById(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setError(null);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir produto.');
      return false;
    } finally {
      setIsLoading(false);
    }
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
    isLoading,
    error,
    filters,
    setFilters,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
