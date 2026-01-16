import { Package, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onAddProduct: () => void;
  hasFilters: boolean;
}

export const EmptyState = ({ onAddProduct, hasFilters }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-muted rounded-full mb-4">
        <Package className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {hasFilters ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
      </h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {hasFilters
          ? 'Tente ajustar os filtros de busca para encontrar seus produtos.'
          : 'Comece adicionando seu primeiro produto de afiliado para gerenciar seus links.'}
      </p>
      {!hasFilters && (
        <Button onClick={onAddProduct} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Adicionar Primeiro Produto
        </Button>
      )}
    </div>
  );
};
