import { useState } from 'react';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { SearchAndFilters } from '@/components/SearchAndFilters';
import { ProductCard } from '@/components/ProductCard';
import { ProductForm } from '@/components/ProductForm';
import { ProductDetails } from '@/components/ProductDetails';
import { DeleteConfirmation } from '@/components/DeleteConfirmation';
import { EmptyState } from '@/components/EmptyState';
import { useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product';

const Index = () => {
  const { products, filters, setFilters, addProduct, updateProduct, deleteProduct, isLoading, error } = useProducts();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [detailsProduct, setDetailsProduct] = useState<Product | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteProduct_, setDeleteProduct] = useState<Product | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hasActiveFilters = filters.search !== '' || filters.store !== 'all' || 
    filters.minPrice !== undefined || filters.maxPrice !== undefined || 
    filters.minDiscount !== undefined;

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleViewProduct = (product: Product) => {
    setDetailsProduct(product);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteProduct(product);
    setDeleteOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingProduct) {
      const updated = await updateProduct(editingProduct.id, data);
      if (updated) {
        toast.success('Produto atualizado com sucesso!');
      } else {
        toast.error('Nao foi possivel atualizar o produto.');
      }
    } else {
      const created = await addProduct(data);
      if (created) {
        toast.success('Produto adicionado com sucesso!');
      } else {
        toast.error('Nao foi possivel adicionar o produto.');
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteProduct_) {
      const ok = await deleteProduct(deleteProduct_.id);
      if (ok) {
        toast.success('Produto excluido com sucesso!');
        setDeleteOpen(false);
        setDeleteProduct(null);
      } else {
        toast.error('Nao foi possivel excluir o produto.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 space-y-6">
        <SearchAndFilters
          filters={filters}
          onFiltersChange={setFilters}
          onAddProduct={handleAddProduct}
        />

        {isLoading && (
          <p className="text-sm text-muted-foreground">Carregando produtos...</p>
        )}

        {error && (
          <p className="text-sm text-destructive">Erro ao carregar produtos: {error}</p>
        )}

        {products.length === 0 && !isLoading ? (
          <EmptyState onAddProduct={handleAddProduct} hasFilters={hasActiveFilters} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {products.length} {products.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteClick}
                  onClick={handleViewProduct}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      <ProductForm
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editingProduct}
        onSubmit={handleFormSubmit}
      />

      <ProductDetails
        product={detailsProduct}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={handleEditProduct}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmation
        product={deleteProduct_}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Index;
