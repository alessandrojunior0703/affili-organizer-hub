import { ExternalLink, Calendar, Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types/product';
import { formatCurrency, formatPercentage } from '@/lib/formatters';

interface ProductDetailsProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

const storeConfig: Record<string, { label: string; className: string }> = {
  amazon: {
    label: 'Amazon',
    className: 'bg-amazon text-amazon-foreground',
  },
  shopee: {
    label: 'Shopee',
    className: 'bg-shopee text-shopee-foreground',
  },
  mercadolivre: {
    label: 'Mercado Livre',
    className: 'bg-yellow-500 text-black',
  },
  magalu: {
    label: 'Magalu',
    className: 'bg-blue-600 text-white',
  },
  aliexpress: {
    label: 'AliExpress',
    className: 'bg-red-600 text-white',
  },
  other: {
    label: 'Outra',
    className: 'bg-muted text-muted-foreground',
  },
};

const defaultStore = { label: 'Loja', className: 'bg-muted text-muted-foreground' };

export const ProductDetails = ({
  product,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: ProductDetailsProps) => {
  if (!product) return null;

  const store = storeConfig[product.store] ?? defaultStore;
  const createdDate = new Date(product.createdAt).toLocaleDateString('pt-BR');
  const updatedDate = new Date(product.updatedAt).toLocaleDateString('pt-BR');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image */}
          {product.imageUrl && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge className={`absolute top-3 left-3 ${store.className}`}>
                {store.label}
              </Badge>
              {product.discount && product.discount > 0 && (
                <Badge className="absolute top-3 right-3 bg-destructive text-destructive-foreground">
                  -{formatPercentage(product.discount)}
                </Badge>
              )}
            </div>
          )}

          {/* Price Section */}
          <div className="bg-secondary/50 rounded-lg p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            {product.commission !== undefined && product.commission > 0 && (
              <p className="text-success font-medium mt-2">
                Comissão estimada: {formatPercentage(product.commission)} ({formatCurrency(product.price * (product.commission / 100))})
              </p>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h4 className="font-semibold text-foreground mb-2">Descrição</h4>
              <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
            </div>
          )}

          <Separator />

          {/* Affiliate Link */}
          <div>
            <h4 className="font-semibold text-foreground mb-2">Link de Afiliado</h4>
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:underline break-all"
            >
              <ExternalLink className="h-4 w-4 flex-shrink-0" />
              {product.affiliateLink}
            </a>
          </div>

          {/* Dates */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Criado em: {createdDate}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Atualizado em: {updatedDate}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => {
                onOpenChange(false);
                onEdit(product);
              }}
            >
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              className="flex-1 gap-2"
              onClick={() => {
                onOpenChange(false);
                onDelete(product);
              }}
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
