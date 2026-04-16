import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { useProducts, useCategories } from '@/hooks/useProducts';
import heroBanner from '@/assets/hero-banner.jpg';
 

import { Navigation, Pagination, Autoplay } from "swiper/modules";
import HeroSlider from '@/components/Slider';
import WhatsAppButton from '@/components/whatsappbutton';
const Index = () => {
  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  const featured = products.filter(p => p.originalPrice).slice(0, 4);
  const popular = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      <section className="relative h-[400px] md:h-[500px] overflow-hidden">
        <HeroSlider/>
      </section>

      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
            
              { icon: Shield, text: 'Quality Assured', sub: '100% genuine products' },
              { icon: Clock, text: 'Fast Delivery', sub: 'Same day delivery' },
              { icon: CreditCard, text: 'Easy Payment', sub: 'JazzCash & EasyPaisa' },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text} className="flex items-center gap-3 p-3">
                <Icon className="h-8 w-8 text-primary shrink-0" />
                <div><p className="font-semibold text-sm">{text}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map(cat => (
            <Link key={cat.id} to={`/products?category=${cat.name}`}
              className="bg-muted hover:bg-primary hover:text-primary-foreground rounded-lg p-4 text-center font-medium transition-colors duration-200">
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="container mx-auto px-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading text-2xl font-bold">🔥 Hot Deals</h2>
            <Link to="/products" className="text-primary font-medium text-sm hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{featured.map(p => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      <section className="container mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold">Popular Products</h2>
          <Link to="/products" className="text-primary font-medium text-sm hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{popular.map(p => <ProductCard key={p.id} product={p} />)}</div>
      </section>

           {/* ✅ Footer with logo image */}
     {/* ✅ Footer Section */}
 

      <WhatsAppButton/>
    </div>
  );
};

export default Index;
