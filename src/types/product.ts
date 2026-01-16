export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  commission?: number;
  imageUrl: string;
  affiliateLink: string;
  store: 'amazon' | 'shopee' | 'other';
  createdAt: string;
  updatedAt: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'commission-asc' | 'commission-desc' | 'newest';

export interface FilterOptions {
  search: string;
  store: 'all' | 'amazon' | 'shopee' | 'other';
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  sortBy: SortOption;
}
