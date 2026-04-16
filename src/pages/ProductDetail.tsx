import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id || '');
  const { data: allProducts = [] } = useProducts();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  if (isLoading) return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
  if (!product) return <div className="container mx-auto px-4 py-16 text-center"><p>Product not found.</p><Link to="/products" className="text-primary underline">Back to products</Link></div>;

  const related = allProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast({ title: 'Added to cart', description: `${qty}x ${product.name} added.` });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
      </Link>
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
          <h1 className="font-heading text-3xl font-bold mb-3">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'fill-secondary text-secondary' : 'text-border'}`} />)}</div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviews} reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-bold text-primary">Rs. {product.price.toLocaleString()}</span>
            {product.originalPrice && <span className="text-lg text-muted-foreground line-through">Rs. {product.originalPrice.toLocaleString()}</span>}
          </div>
          <p className="text-muted-foreground mb-6">{product.description}</p>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border border-input rounded-lg">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 hover:bg-muted"><Minus className="h-4 w-4" /></button>
              <span className="px-4 font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2 hover:bg-muted"><Plus className="h-4 w-4" /></button>
            </div>
            <span className={`text-sm font-medium ${product.inStock ? 'text-primary' : 'text-destructive'}`}>
              {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
            </span>
          </div>
          <Button size="lg" onClick={handleAdd} disabled={!product.inStock} className="w-full md:w-auto">
            <ShoppingCart className="h-5 w-5 mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
      {related.length > 0 && (
        <>
          <h2 className="font-heading text-2xl font-bold mb-4">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
