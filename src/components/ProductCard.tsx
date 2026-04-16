import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/store-data';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

const ProductCard = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!product.inStock) return;
    addToCart(product);
    toast({ title: 'Added to cart', description: `${product.name} added successfully.` });
  };

  return (
    <Link to={`/product/${product.id}`} className="group">
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          {product.originalPrice && (
            <span className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-xs font-semibold px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
              <span className="bg-muted text-muted-foreground font-semibold px-3 py-1 rounded">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-card-foreground">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3 w-3 fill-secondary text-secondary" />
            <span className="text-xs text-muted-foreground">{product.rating} ({product.reviews})</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-primary">Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-xs text-muted-foreground line-through ml-2">Rs. {product.originalPrice.toLocaleString()}</span>
              )}
            </div>
            <Button size="sm" variant="default" onClick={handleAdd} disabled={!product.inStock} className="h-8 w-8 p-0">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
