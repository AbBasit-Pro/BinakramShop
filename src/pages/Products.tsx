import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const searchQuery = searchParams.get('search') || '';
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [sortBy, setSortBy] = useState('default');

  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) result = result.filter(p => p.category === selectedCategory);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sortBy === 'price-low') result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-heading text-3xl font-bold mb-6">
        {selectedCategory || 'All Products'}
        {searchQuery && <span className="text-muted-foreground text-lg font-normal ml-2">"{searchQuery}"</span>}
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={!selectedCategory ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory('')}>All</Button>
        {categories.map(cat => (
          <Button key={cat.id} variant={selectedCategory === cat.name ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(cat.name)}>
            {cat.name}
          </Button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{filtered.length} products</p>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="text-sm border border-input rounded-md px-3 py-1.5 bg-background">
          <option value="default">Default</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-16">Loading products...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
      {!isLoading && filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-16">No products found.</p>
      )}
    </div>
  );
};

export default Products;
