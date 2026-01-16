import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/product';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onClick: (product: Product) => void;
}

const storeConfig = {
  amazon: {
    label: 'Amazon',
    className: 'bg-amazon text-amazon-foreground',
  },
  shopee: {
    label: 'Shopee',
    className: 'bg-shopee text-shopee-foreground',
  },
  other: {
    label: 'Outra',
    className: 'bg-muted text-muted-foreground',
  },
};

export const ProductCard = ({ product, onEdit, onDelete, onClick }: ProductCardProps) => {
  const store = storeConfig[product.store];

  return (
    <Card
      className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-border"
      onClick={() => onClick(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Sem imagem
          </div>
        )}
        
        {/* Store Badge */}
        <Badge className={`absolute top-2 left-2 ${store.className}`}>
          {store.label}
        </Badge>

        {/* Discount Badge */}
        {product.discount && product.discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-destructive text-destructive-foreground">
            -{formatPercentage(product.discount)}
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="destructive"
            className="h-8 w-8 shadow-md"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="space-y-1">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Commission */}
          {product.commission !== undefined && product.commission > 0 && (
            <p className="text-sm text-success font-medium">
              Comissão: {formatPercentage(product.commission)}
            </p>
          )}
        </div>

        {/* Affiliate Link */}
        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-3"
        >
          <ExternalLink className="h-3 w-3" />
          Link de Afiliado
        </a>
      </CardContent>
    </Card>
  );
};
