import { useAuth } from '@/context/AuthContext';
import { useUserOrders } from '@/hooks/useOrders';
import { Navigate, Link } from 'react-router-dom';
import { Package, User } from 'lucide-react';

const statusColors: Record<string, string> = {
  pending: 'bg-secondary/20 text-secondary-foreground',
  confirmed: 'bg-primary/10 text-primary',
  processing: 'bg-primary/20 text-primary',
  shipped: 'bg-primary/30 text-primary',
  delivered: 'bg-primary/40 text-primary-foreground bg-primary',
  cancelled: 'bg-destructive/10 text-destructive',
};

const Dashboard = () => {
  const { user, loading } = useAuth();
  const { data: orders = [], isLoading } = useUserOrders(user?.id);

  if (loading) return <div className="flex justify-center py-20">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
          <User className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">{user.email} • {user.phone}</p>
        </div>
      </div>

      <h2 className="font-heading text-xl font-bold mb-4">My Orders</h2>
      {isLoading ? (
        <p className="text-center py-12 text-muted-foreground">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-lg border border-border">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">No orders yet.</p>
          <Link to="/products" className="text-primary font-medium hover:underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-card rounded-lg border border-border p-5">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div>
                  <p className="font-semibold">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('en-PK', { dateStyle: 'medium' })}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[order.status] || ''}`}>{order.status}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.payment_status === 'verified' ? 'bg-primary text-primary-foreground' : order.payment_status === 'rejected' ? 'bg-destructive text-destructive-foreground' : 'bg-muted text-muted-foreground'}`}>
                    Payment: {order.payment_status}
                  </span>
                </div>
              </div>
              <div className="text-sm space-y-1 text-muted-foreground">
                {order.items?.map(item => (
                  <p key={item.id}>{item.product_name} × {item.quantity} — Rs. {(item.product_price * item.quantity).toLocaleString()}</p>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                <span className="text-muted-foreground">via {order.payment_method}</span>
                <span className="font-bold text-primary">Rs. {order.total.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
