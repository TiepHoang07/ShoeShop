import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Heart, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react';

export interface WishlistDto {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
}

export default function WishlistPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [items, setItems] = useState<WishlistDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'CUSTOMER') {
        navigate('/');
        return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/wishlist');
      setItems(response.data);
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await apiClient.delete(`/wishlist/remove/${itemId}`);
      fetchWishlist();
    } catch (error) {
      alert('Failed to remove item.');
    }
  };

  const handleAddToCart = async (productId: number, itemId: number) => {
    try {
      await apiClient.post(`/cart/add?productId=${productId}&quantity=1`);
      // Auto remove from wishlist after adding to cart
      await apiClient.delete(`/wishlist/remove/${itemId}`);
      alert('Moved to cart!');
      fetchWishlist();
    } catch (error) {
      alert('Failed to move to cart. Might be out of stock.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 pb-20">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft size={20} /> Back to Store
           </button>
           <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
               My <Heart className="text-pink-500 fill-pink-500" size={20} /> <span className="text-pink-500">Wishlist</span>
           </h1>
           <div className="w-24"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
             <div className="w-full py-20 flex justify-center">
               <div className="w-8 h-8 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div>
             </div>
        ) : items.length === 0 ? (
             <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl py-24 flex flex-col items-center justify-center text-zinc-500">
                <Heart size={64} className="mb-6 opacity-30" />
                <h2 className="text-2xl font-bold text-zinc-300 mb-2">Your wishlist is empty</h2>
                <p className="text-zinc-500 mb-8 max-w-md text-center">Save items you love so you can keep track of them and buy them later.</p>
                <button onClick={() => navigate('/')} className="px-8 py-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl font-semibold transition-all">
                   Find Favorites
                </button>
             </div>
        ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 {items.map(item => (
                    <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl flex flex-col hover:border-pink-500/30 transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <h3 className="text-xl font-bold text-white leading-tight">{item.productName}</h3>
                           <button onClick={() => handleRemove(item.id)} className="text-zinc-500 hover:text-red-400 transition-colors">
                              <Trash2 size={18} />
                           </button>
                        </div>
                        <p className="text-2xl font-black text-indigo-400 mb-6">${item.productPrice.toFixed(2)}</p>
                        
                        <button 
                           onClick={() => handleAddToCart(item.productId, item.id)}
                           className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.3)] mt-auto"
                        >
                           <ShoppingCart size={18} /> Move to Cart
                        </button>
                    </div>
                 ))}
             </div>
        )}
      </main>
    </div>
  );
}
