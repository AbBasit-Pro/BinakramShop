import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import logo from '@/assets/logo.jpeg';

const Navbar = () => {
  const { totalItems } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
<img
  src={logo}
  alt="Bin Akram"
  className="h-10 w-10 rounded-full object-cover"
/>            <span className="font-heading text-xl font-bold text-primary">Bin Akram</span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </form>

          <nav className="hidden md:flex items-center gap-2">
            <Link to="/products">
              <Button variant="ghost" size="sm">Products</Button>
            </Link>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="ghost" size="sm"><LayoutDashboard className="h-4 w-4 mr-1" />Admin</Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm"><User className="h-4 w-4 mr-1" />{user.name}</Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}><LogOut className="h-4 w-4" /></Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm"><User className="h-4 w-4 mr-1" />Login</Button>
              </Link>
            )}
            <Link to="/cart" className="relative">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </nav>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-sm" />
              </div>
            </form>
            <div className="flex flex-col gap-1">
              <Link to="/products" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Products</Button>
              </Link>
              <Link to="/cart" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" className="w-full justify-start">Cart ({totalItems})</Button>
              </Link>
              {user ? (
                <>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Admin Panel</Button></Link>}
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">My Account</Button></Link>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { logout(); setMobileOpen(false); }}>Logout</Button>
                </>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}><Button variant="ghost" className="w-full justify-start">Login</Button></Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
