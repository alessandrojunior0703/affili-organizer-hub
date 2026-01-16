import { supabase } from '@/lib/supabaseClient';
import { Product } from '@/types/product';

type DbProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price: number | null;
  discount: number | null;
  commission: number | null;
  image_url: string;
  affiliate_link: string;
  store: 'amazon' | 'shopee' | 'other';
  created_at: string;
  updated_at: string;
};

const mapDbToProduct = (row: DbProduct): Product => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: row.price,
  originalPrice: row.original_price ?? undefined,
  discount: row.discount ?? undefined,
  commission: row.commission ?? undefined,
  imageUrl: row.image_url,
  affiliateLink: row.affiliate_link,
  store: row.store,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const mapProductToDb = (product: Partial<Product>): Partial<DbProduct> => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  original_price: product.originalPrice ?? null,
  discount: product.discount ?? null,
  commission: product.commission ?? null,
  image_url: product.imageUrl,
  affiliate_link: product.affiliateLink,
  store: product.store,
  created_at: product.createdAt,
  updated_at: product.updatedAt,
});

const removeUndefined = <T extends Record<string, unknown>>(value: T) =>
  Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined)) as Partial<T>;

export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDbToProduct);
};

export const insertProduct = async (product: Product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([mapProductToDb(product)])
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapDbToProduct(data);
};

export const insertProducts = async (products: Product[]) => {
  if (products.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('products')
    .upsert(products.map((product) => mapProductToDb(product)), { onConflict: 'id' })
    .select('*');

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map(mapDbToProduct);
};

export const updateProductById = async (id: string, updates: Partial<Product>) => {
  const payload = removeUndefined(mapProductToDb(updates));
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return mapDbToProduct(data);
};

export const deleteProductById = async (id: string) => {
  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};

