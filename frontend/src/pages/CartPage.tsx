import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export interface CartItemDto {
  id: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
}

export default function CartPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (user?.role !== 'CUSTOMER') {
      navigate('/');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/cart');
      setCartItems(response.data);
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await apiClient.delete(`/cart/remove/${itemId}`);
      fetchCart();
    } catch (error) {
      alert('Failed to remove item.');
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await apiClient.post('/orders/checkout');
      alert('Checkout successful! Your order has been placed.');
      navigate('/'); // Return to store for now
    } catch (error: any) {
      alert(error.response?.data?.message || 'Checkout failed. Stock might be empty.');
    } finally {
      setCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.productPrice * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 pb-20">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft size={20} /> Continue Shopping
           </button>
           <h1 className="text-xl font-bold tracking-tight">
               Your <span className="text-indigo-500">Cart</span>
           </h1>
           <div className="w-32"></div> {/* Spacer for centering */}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
             <div className="w-full py-20 flex justify-center">
               <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
             </div>
        ) : cartItems.length === 0 ? (
             <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-3xl py-24 flex flex-col items-center justify-center text-zinc-500">
                <ShoppingBag size={64} className="mb-6 opacity-30" />
                <h2 className="text-2xl font-bold text-zinc-300 mb-2">Your cart is empty</h2>
                <p className="text-zinc-500 mb-8 max-w-md text-center">It looks like you haven't added any shoes to your cart yet. Discover your next favorite pair now!</p>
                <button onClick={() => navigate('/')} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold transition-all">
                   Explore Store
                </button>
             </div>
        ) : (
             <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-xl space-y-4">
                   <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
                     <ShoppingBag className="text-indigo-400" /> Review Items
                   </h2>
                   
                   {cartItems.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
                         <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-1">{item.productName}</h3>
                            <div className="text-sm text-zinc-400 flex items-center gap-3">
                               <span>Qty: <strong className="text-zinc-200 bg-zinc-800 px-2 py-0.5 rounded">{item.quantity}</strong></span>
                               <span>Unit: ${item.productPrice.toFixed(2)}</span>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 sm:gap-6">
                            <span className="text-xl font-black text-indigo-400">${(item.productPrice * item.quantity).toFixed(2)}</span>
                            <button onClick={() => handleRemove(item.id)} className="p-2.5 bg-zinc-900 hover:bg-red-500/20 text-zinc-500 hover:text-red-400 rounded-xl transition-all border border-zinc-800 hover:border-red-500/30" title="Remove Item">
                               <Trash2 size={18} />
                            </button>
                         </div>
                      </div>
                   ))}
                </div>

                <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 p-6 rounded-3xl border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
                   <div>
                     <p className="text-zinc-400 text-sm mb-1">Total Amount</p>
                     <p className="text-4xl font-extrabold text-white">${calculateTotal().toFixed(2)}</p>
                   </div>
                   <button 
                      onClick={handleCheckout} 
                      disabled={checkingOut}
                      className="w-full sm:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] disabled:shadow-none"
                   >
                      {checkingOut ? 'Processing...' : 'Complete Checkout'} <ArrowRight size={20} />
                   </button>
                </div>
             </div>
        )}
      </main>
    </div>
  );
}
