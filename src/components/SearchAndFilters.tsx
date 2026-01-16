import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { FilterOptions, SortOption } from '@/types/product';

interface SearchAndFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onAddProduct: () => void;
}

export const SearchAndFilters = ({
  filters,
  onFiltersChange,
  onAddProduct,
}: SearchAndFiltersProps) => {
  const hasActiveFilters =
    filters.store !== 'all' ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.minDiscount !== undefined;

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      store: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      minDiscount: undefined,
    });
  };

  return (
    <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto por nome..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Store Filter */}
        <Select
          value={filters.store}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, store: value })
          }
        >
          <SelectTrigger className="w-full lg:w-40">
            <SelectValue placeholder="Loja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as Lojas</SelectItem>
            <SelectItem value="amazon">Amazon</SelectItem>
            <SelectItem value="shopee">Shopee</SelectItem>
            <SelectItem value="mercadolivre">Mercado Livre</SelectItem>
            <SelectItem value="magalu">Magalu</SelectItem>
            <SelectItem value="aliexpress">AliExpress</SelectItem>
            <SelectItem value="other">Outras</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={filters.sortBy}
          onValueChange={(value) =>
            onFiltersChange({ ...filters, sortBy: value as SortOption })
          }
        >
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais Recentes</SelectItem>
            <SelectItem value="price-asc">Preço: Menor → Maior</SelectItem>
            <SelectItem value="price-desc">Preço: Maior → Menor</SelectItem>
            <SelectItem value="commission-asc">Comissão: Menor → Maior</SelectItem>
            <SelectItem value="commission-desc">Comissão: Maior → Menor</SelectItem>
          </SelectContent>
        </Select>

        {/* Advanced Filters */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={hasActiveFilters ? 'default' : 'outline'} className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary-foreground text-primary px-2 py-0.5 text-xs">
                  Ativos
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filtros Avançados</h4>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Preço Mínimo (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={filters.minPrice ?? ''}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Preço Máximo (R$)</Label>
                <Input
                  type="number"
                  placeholder="0,00"
                  value={filters.maxPrice ?? ''}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Desconto Mínimo (%)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  max={100}
                  value={filters.minDiscount ?? ''}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      minDiscount: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Add Product Button */}
        <Button onClick={onAddProduct} className="gap-2 bg-primary hover:bg-primary/90">
          Adicionar Produto
        </Button>
      </div>
    </div>
  );
};
