import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const Cart = () => {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-heading text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Start shopping to add items to your cart.</p>
        <Link to="/products"><Button>Browse Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.id} className="flex gap-4 bg-card rounded-lg border border-border p-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" loading="lazy" />
              <div className="flex-1">
                <Link to={`/product/${item.id}`} className="font-semibold hover:text-primary">{item.name}</Link>
                <p className="text-sm text-muted-foreground">{item.category}</p>
                <p className="font-bold text-primary mt-1">Rs. {item.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                <div className="flex items-center border border-input rounded">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-muted"><Minus className="h-3 w-3" /></button>
                  <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-muted"><Plus className="h-3 w-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card rounded-lg border border-border p-6 h-fit">
          <h2 className="font-heading text-xl font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>Rs. {totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{totalPrice >= 3000 ? 'Free' : 'Rs. 200'}</span></div>
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span className="text-primary">Rs. {(totalPrice + (totalPrice >= 3000 ? 0 : 200)).toLocaleString()}</span>
          </div>
          <Link to="/checkout">
            <Button className="w-full" size="lg">Proceed to Checkout</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
