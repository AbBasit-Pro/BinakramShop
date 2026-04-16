import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/hooks/useProducts';
import { useAllOrders, useUpdateOrderStatus, useUpdatePaymentStatus } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Package, ShoppingCart, DollarSign, Clock, CheckCircle, XCircle, Plus, Pencil, Trash2, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: orders = [], isLoading: ordersLoading } = useAllOrders();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateOrderStatus = useUpdateOrderStatus();
  const updatePaymentStatus = useUpdatePaymentStatus();

  const [tab, setTab] = useState<'overview' | 'orders' | 'products'>('overview');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: '', price: '', original_price: '', description: '', image: '', category_id: '', in_stock: true,
  });

  if (loading) return <div className="flex justify-center py-20">Loading...</div>;
  if (!user || !isAdmin) return <Navigate to="/login" />;

  const totalRevenue = orders.filter(o => o.payment_status === 'verified').reduce((s, o) => s + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const resetForm = () => {
    setProductForm({ name: '', price: '', original_price: '', description: '', image: '', category_id: '', in_stock: true });
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (p: typeof products[0]) => {
    const cat = categories.find(c => c.name === p.category);
    setProductForm({
      name: p.name, price: String(p.price), original_price: p.originalPrice ? String(p.originalPrice) : '',
      description: p.description, image: p.image, category_id: cat?.id || '', in_stock: p.inStock,
    });
    setEditingProduct(p.id);
    setShowProductForm(true);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      toast({ title: 'Error', description: 'Name and price are required.', variant: 'destructive' });
      return;
    }
    const payload = {
      name: productForm.name,
      price: Number(productForm.price),
      original_price: productForm.original_price ? Number(productForm.original_price) : null,
      description: productForm.description || null,
      image: productForm.image || null,
      category_id: productForm.category_id || null,
      in_stock: productForm.in_stock,
    };
    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({ id: editingProduct, ...payload });
        toast({ title: 'Product updated!' });
      } else {
        await createProduct.mutateAsync(payload);
        toast({ title: 'Product created!' });
      }
      resetForm();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast({ title: 'Product deleted' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-2">Admin Panel</h1>
      <p className="text-muted-foreground mb-6">Manage your store (realtime)</p>

      <div className="flex gap-2 mb-6 border-b border-border pb-2">
        {(['overview', 'orders', 'products'] as const).map(t => (
          <Button key={t} variant={tab === t ? 'default' : 'ghost'} size="sm" onClick={() => setTab(t)} className="capitalize">{t}</Button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: DollarSign, label: 'Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, color: 'text-primary' },
            { icon: ShoppingCart, label: 'Total Orders', value: orders.length, color: 'text-primary' },
            { icon: Clock, label: 'Pending', value: pendingOrders, color: 'text-secondary' },
            { icon: Package, label: 'Products', value: products.length, color: 'text-primary' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card rounded-lg border border-border p-5">
              <div className="flex items-center gap-3">
                <Icon className={`h-8 w-8 ${color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {ordersLoading ? <p className="text-center py-12 text-muted-foreground">Loading orders...</p> :
           orders.length === 0 ? <p className="text-center text-muted-foreground py-12">No orders yet.</p> :
           orders.map(order => (
            <div key={order.id} className="bg-card rounded-lg border border-border p-5">
              <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                <div>
                  <p className="font-bold">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                  <p className="text-sm mt-1">{order.customer_name} • {order.customer_phone}</p>
                  <p className="text-sm text-muted-foreground">{order.customer_address}</p>
                  {order.transaction_id && <p className="text-xs mt-1">TxID: <span className="font-mono">{order.transaction_id}</span></p>}
                </div>
                <p className="text-xl font-bold text-primary">Rs. {order.total.toLocaleString()}</p>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                {order.items?.map(item => <span key={item.id} className="mr-3">{item.product_name}×{item.quantity}</span>)}
              </div>
              <div className="flex flex-wrap gap-2">
                <select value={order.status} onChange={e => {
                  updateOrderStatus.mutate({ id: order.id, status: e.target.value });
                  toast({ title: 'Order status updated' });
                }} className="text-sm border border-input rounded px-2 py-1 bg-background">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select value={order.payment_status} onChange={e => {
                  updatePaymentStatus.mutate({ id: order.id, payment_status: e.target.value });
                  toast({ title: 'Payment status updated' });
                }} className="text-sm border border-input rounded px-2 py-1 bg-background">
                  {['pending', 'verified', 'rejected'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">{products.length} products</p>
            <Button onClick={() => { resetForm(); setShowProductForm(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Product
            </Button>
          </div>

          {showProductForm && (
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                <button onClick={resetForm}><X className="h-5 w-5 text-muted-foreground" /></button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name *</label>
                  <input value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Category</label>
                  <select value={productForm.category_id} onChange={e => setProductForm(f => ({ ...f, category_id: e.target.value }))}
                    className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm">
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Price *</label>
                  <input type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Original Price</label>
                  <input type="number" value={productForm.original_price} onChange={e => setProductForm(f => ({ ...f, original_price: e.target.value }))}
                    className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Image URL</label>
                  <input value={productForm.image} onChange={e => setProductForm(f => ({ ...f, image: e.target.value }))}
                    className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <textarea value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-input rounded-lg px-3 py-2 bg-background text-sm" rows={2} />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={productForm.in_stock} onChange={e => setProductForm(f => ({ ...f, in_stock: e.target.checked }))} id="in_stock" />
                  <label htmlFor="in_stock" className="text-sm font-medium">In Stock</label>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={handleSaveProduct} disabled={createProduct.isPending || updateProduct.isPending}>
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
                <Button variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </div>
          )}

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3">Product</th>
                    <th className="text-left p-3">Category</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-center p-3">Stock</th>
                    <th className="text-center p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsLoading ? (
                    <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Loading...</td></tr>
                  ) : products.map(p => (
                    <tr key={p.id} className="border-t border-border">
                      <td className="p-3 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded" loading="lazy" />
                        <span className="font-medium">{p.name}</span>
                      </td>
                      <td className="p-3 text-muted-foreground">{p.category}</td>
                      <td className="p-3 text-right font-semibold">Rs. {p.price.toLocaleString()}</td>
                      <td className="p-3 text-center">{p.inStock ? <CheckCircle className="h-4 w-4 text-primary mx-auto" /> : <XCircle className="h-4 w-4 text-destructive mx-auto" />}</td>
                      <td className="p-3 text-center">
                        <div className="flex justify-center gap-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditProduct(p)}><Pencil className="h-4 w-4" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
