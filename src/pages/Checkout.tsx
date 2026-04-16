import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { toast } from '@/hooks/use-toast';

const paymentMethods = [
  { id: 'jazzcash', name: 'JazzCash', account: '0300-1234567' },
  { id: 'easypaisa', name: 'EasyPaisa', account: '0345-9876543' },
  { id: 'bank', name: 'Bank Transfer', account: 'HBL: 1234-5678-9012-3456 (Bin Akram)' },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const createOrder = useCreateOrder();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name || '', phone: user?.phone || '', address: '', city: 'Lahore',
    paymentMethod: 'jazzcash', transactionId: '',
  });

  const deliveryFee = totalPrice >= 3000 ? 0 : 200;
  const grandTotal = totalPrice + deliveryFee;

  if (items.length === 0) { navigate('/cart'); return null; }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { toast({ title: 'Please login first', variant: 'destructive' }); navigate('/login'); return; }
    if (!form.name || !form.phone || !form.address) {
      toast({ title: 'Error', description: 'Please fill all required fields.', variant: 'destructive' });
      return;
    }
    try {
      const order = await createOrder.mutateAsync({
        user_id: user.id,
        total: grandTotal,
        payment_method: form.paymentMethod,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_address: `${form.address}, ${form.city}`,
        transaction_id: form.transactionId || undefined,
        items: items.map(item => ({
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
        })),
      });
      clearCart();
      toast({ title: '🎉 Order Placed!', description: `Order ${order.order_number} placed successfully.` });
      navigate('/dashboard');
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const selectedPayment = paymentMethods.find(p => p.id === form.paymentMethod)!;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="font-heading text-lg font-bold mb-4">Delivery Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Full Name *</label>
              <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Phone *</label>
              <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Address *</label>
              <textarea required value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" rows={2} />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">City</label>
              <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="font-heading text-lg font-bold mb-4">Payment Method</h2>
          <div className="grid gap-3 mb-4">
            {paymentMethods.map(pm => (
              <label key={pm.id} className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${form.paymentMethod === pm.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                <input type="radio" name="payment" value={pm.id} checked={form.paymentMethod === pm.id}
                  onChange={e => setForm({ ...form, paymentMethod: e.target.value })} className="accent-primary" />
                <div>
                  <p className="font-semibold text-sm">{pm.name}</p>
                  <p className="text-xs text-muted-foreground">Send to: {pm.account}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm font-medium mb-2">Send <strong className="text-primary">Rs. {grandTotal.toLocaleString()}</strong> to:</p>
            <p className="text-sm font-mono">{selectedPayment.account}</p>
            <div className="mt-3">
              <label className="text-sm font-medium mb-1 block">Transaction ID / Reference</label>
              <input type="text" value={form.transactionId} onChange={e => setForm({ ...form, transactionId: e.target.value })}
                placeholder="Enter transaction ID after payment"
                className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="font-heading text-lg font-bold mb-4">Order Summary</h2>
          {items.map(item => (
            <div key={item.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
              <span>{item.name} × {item.quantity}</span>
              <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="mt-3 pt-3 border-t border-border space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>Rs. {totalPrice.toLocaleString()}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee === 0 ? 'Free' : `Rs. ${deliveryFee}`}</span></div>
            <div className="flex justify-between font-bold text-lg pt-2"><span>Total</span><span className="text-primary">Rs. {grandTotal.toLocaleString()}</span></div>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={createOrder.isPending}>
          {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
