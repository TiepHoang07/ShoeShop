import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ShoppingCart, LogOut, Plus, Heart, Package, ArrowLeftRight } from 'lucide-react';


export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-2xl font-bold tracking-tight cursor-pointer text-text" onClick={() => navigate('/')}>
            Shoe<span className="text-primary">Store</span>
          </h1>

          <div className="relative flex items-center gap-4">
            {user?.role === 'SELLER' ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors border border-border shadow-sm text-text"
              >
                <Plus size={16} /> Add Product
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => navigate('/orders')} className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-all" title="Order History">
                  <Package size={20} />
                </button>
                <button onClick={() => navigate('/wishlist')} className="p-2 text-text-muted hover:text-pink-600 hover:bg-pink-50 rounded-full transition-all" title="Wishlist">
                  <Heart size={20} />
                </button>
                <button onClick={() => navigate('/cart')} className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-all" title="Cart">
                  <ShoppingCart size={20} />
                </button>
              </div>
            )}

            <div className="h-6 w-px bg-border mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <div className="text-sm font-medium text-text">{user?.name}</div>
                <div className="text-xs text-primary font-semibold">{user?.role}</div>
              </div>
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className='p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-all' title="Switch Role">
                <ArrowLeftRight size={20} />
              </button>
              <button onClick={logout} className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 rounded-full transition-all" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
            {
              isDropdownOpen && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg flex flex-col">
                  <div className='py-4 px-2 flex flex-col items-center justify-center border-b border-border gap-1' title="Switch Role">
                    <div className='flex items-center gap-2'>
                      <h2 className='text-xl font-semibold'>Switch Role</h2>
                      <ArrowLeftRight className='text-primary bg-primary/10 rounded-full p-1' size={25} />
                    </div>
                    <p className='text-xs text-text-muted text-center'>switch role to explore more features</p>
                    <p className='text-sm font-semibold text-primary p-2'>current role: {user?.role}</p>
                  </div>
                  <div className='flex items-center'>
                    <button className={`w-full p-2 text-text-muted transition-all ${user?.role === 'CUSTOMER' ? 'bg-primary text-white' : 'hover:text-primary hover:bg-primary/10'}`} title="Switch Role">
                      <p>Customer</p>
                    </button>
                    <button className={`w-full p-2 text-text-muted transition-all ${user?.role === 'SELLER' ? 'bg-primary text-white' : 'hover:text-primary hover:bg-primary/10'}`} title="Switch Role">
                      <p>Seller</p>
                    </button>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </nav>
  );
}
