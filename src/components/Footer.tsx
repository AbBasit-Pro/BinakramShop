import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-primary text-primary-foreground mt-16">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-heading text-lg font-bold mb-3">Bin Akram</h3>
          <p className="text-sm opacity-80">Your trusted neighborhood store, now online. Quality products at the best prices.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <Link to="/products" className="hover:opacity-100">All Products</Link>
            <Link to="/cart" className="hover:opacity-100">Cart</Link>
            <Link to="/dashboard" className="hover:opacity-100">My Orders</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Payment Methods</h4>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <span>JazzCash</span>
            <span>EasyPaisa</span>
            <span>Bank Transfer</span>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <div className="flex flex-col gap-2 text-sm opacity-80">
            <span>📞 +92 321 5573682</span>
            <span>📧 binakram98@gmail.com</span>
            <span>📍 Rawalpindi, Pakistan</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-sm opacity-60">
        © 2026 Bin Akram. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;


