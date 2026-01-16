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
  const { products, filters, setFilters, addProduct, updateProduct, deleteProduct } = useProducts();
  
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

  const handleFormSubmit = (data: any) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, data);
      toast.success('Produto atualizado com sucesso!');
    } else {
      addProduct(data);
      toast.success('Produto adicionado com sucesso!');
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteProduct_) {
      deleteProduct(deleteProduct_.id);
      toast.success('Produto excluído com sucesso!');
      setDeleteOpen(false);
      setDeleteProduct(null);
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

        {products.length === 0 ? (
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
