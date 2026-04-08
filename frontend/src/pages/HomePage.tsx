import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { ShoppingCart, LogOut, Plus, Search, Heart } from 'lucide-react';

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
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get(`/products/public/search?type=${searchQuery}`);
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
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 selection:text-white pb-20">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold tracking-tight cursor-pointer" onClick={() => fetchProducts()}>
               Shoe<span className="text-indigo-500">Store</span>
            </h1>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by shoe type (e.g. Sport, Casual)..." 
                  className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
            </form>

            <div className="flex items-center gap-4">
              {user?.role === 'SELLER' ? (
                <button 
                  onClick={() => alert("Dashboard routing coming soon!")}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm font-medium transition-colors border border-zinc-700 shadow-xl"
                >
                  <Plus size={16} /> Add Product
                </button>
              ) : (
                <div className="flex gap-2">
                   <button onClick={() => alert("Wishlist routing coming soon!")} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all">
                      <Heart size={20} />
                   </button>
                   <button onClick={() => alert("Cart routing coming soon!")} className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-all">
                      <ShoppingCart size={20} />
                   </button>
                </div>
              )}
              
              <div className="h-6 w-px bg-zinc-800 mx-2"></div>
              
              <div className="flex items-center gap-3">
                 <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-zinc-200">{user?.name}</div>
                    <div className="text-xs text-indigo-400 font-semibold">{user?.role}</div>
                 </div>
                 <button onClick={logout} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all" title="Logout">
                    <LogOut size={20} />
                 </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2">Latest Arrivals</h2>
          <p className="text-zinc-400 text-lg">Discover the perfect pair for any occasion.</p>
        </div>

        {loading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="w-full py-20 text-center bg-zinc-900/50 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center">
             <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                 <Search className="text-zinc-500" size={24} />
             </div>
             <h3 className="text-xl text-zinc-300 font-medium">No shoes found</h3>
             <p className="text-zinc-500 mt-2">Try searching for a different type, or check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {products.map((product) => (
              <div key={product.id} className="group bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)] transition-all duration-300 flex flex-col">
                {/* Mock Image Area */}
                <div className="h-56 bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 flex flex-col items-center justify-center relative shadow-inner">
                   <div className="absolute top-4 left-4 px-3 py-1 bg-zinc-950/60 backdrop-blur-md rounded-full text-xs font-semibold text-zinc-300 uppercase tracking-wider border border-zinc-800">
                     {product.type}
                   </div>
                   <div className="text-zinc-700 font-bold text-5xl rotate-[-20deg] select-none opacity-50 group-hover:scale-110 group-hover:text-zinc-600 transition-all duration-500">
                     SHOE
                   </div>
                </div>
                
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-zinc-100 line-clamp-1" title={product.name}>{product.name}</h3>
                    <span className="text-xl font-black text-indigo-400 ml-2 whitespace-nowrap">${product.price.toFixed(2)}</span>
                  </div>
                  
                  <p className="text-zinc-400 text-sm line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                     <div className="text-xs text-zinc-500 flex flex-col gap-1">
                       <span>Size: <strong className="text-zinc-300 bg-zinc-800 px-2 rounded ml-1">{product.size}</strong></span>
                       <span>Stock: <strong className={product.quantity > 5 ? 'text-emerald-400' : 'text-amber-400'}>{product.quantity} left</strong></span>
                     </div>
                     
                     {user?.role === 'CUSTOMER' && (
                       <div className="flex gap-2">
                          <button 
                             onClick={() => handleAddToWishlist(product.id)}
                             className="p-2.5 bg-zinc-800 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 hover:border-red-500/50 rounded-xl transition-all border border-zinc-700"
                             title="Add to Wishlist"
                          >
                             <Heart size={18} />
                          </button>
                          <button 
                             onClick={() => handleAddToCart(product.id)}
                             disabled={product.quantity === 0}
                             className="p-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 disabled:shadow-none active:scale-95"
                          >
                             <ShoppingCart size={18} /> Add
                          </button>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
