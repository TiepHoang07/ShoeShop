import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductList from '../components/ProductList';

export interface ProductDto {
  id: number;
  name: string;
  type: string;
  description: string;
  size: number;
  price: number;
  quantity: number;
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
      const response = await apiClient.get(`/products/public/search?type=${query}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
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
      <Navbar 
         onSearch={handleSearch} 
         searchQuery={searchQuery} 
         setSearchQuery={setSearchQuery} 
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
