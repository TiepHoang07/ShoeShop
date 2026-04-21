import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';
import { Search } from 'lucide-react';

export interface ProductDto {
  id: number;
  name: string;
  type: string;
  description: string;
  size: number;
  price: number;
  quantity: number;
  imageUrl?: string;
  sellerId: number;
}

export default function HomePage() {
  const { user } = useAuthStore();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/products/public/all');
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchProducts();
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get(`/products/public/searchByName?name=${query}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery !== undefined) {
      handleSearch(searchQuery);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await apiClient.post(`/cart/add?productId=${productId}&quantity=1`);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart. Maybe out of stock?');
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await apiClient.post(`/wishlist/add/${productId}`);
      alert('Added to wishlist!');
    } catch (error) {
      alert('Failed to add to wishlist. Maybe already exists?');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg text-text selection:bg-primary selection:text-white font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-center">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-8 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search by shoe type (e.g. Sport, Casual)..."
              className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-text placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-text">Latest Arrivals</h2>
          <p className="text-text-muted text-lg">Discover the perfect pair for any occasion.</p>
        </div>

        {loading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <ProductList
            products={products}
            userRole={user?.role}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
