import React from 'react';
import { Heart, ShoppingCart, Search } from 'lucide-react';
import type { ProductDto } from '../pages/HomePage';

interface ProductListProps {
  products: ProductDto[];
  userRole?: string;
  onAddToCart: (productId: number) => void;
  onAddToWishlist: (productId: number) => void;
}

export default function ProductList({ products, userRole, onAddToCart, onAddToWishlist }: ProductListProps) {
  if (products.length === 0) {
    return (
      <div className="w-full py-20 text-center bg-surface rounded-3xl border border-border flex flex-col items-center justify-center shadow-sm">
         <div className="w-16 h-16 bg-bg border border-border rounded-full flex items-center justify-center mb-4">
             <Search className="text-text-muted" size={24} />
         </div>
         <h3 className="text-xl text-text font-medium">No shoes found</h3>
         <p className="text-text-muted mt-2">Try searching for a different type, or check back later!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
      {products.map((product) => (
        <div key={product.id} className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col">
          <div className="h-56 bg-bg flex flex-col items-center justify-center relative shadow-inner">
             <div className="absolute top-4 left-4 px-3 py-1 bg-surface backdrop-blur-md rounded-full text-xs font-semibold text-text uppercase tracking-wider border border-border shadow-sm">
               {product.type}
             </div>
             <div className="text-slate-300/50 font-bold text-5xl rotate-[-20deg] select-none group-hover:scale-110 transition-all duration-500">
               SHOE
             </div>
          </div>
          
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-text line-clamp-1" title={product.name}>{product.name}</h3>
              <span className="text-xl font-black text-primary-dark ml-2 whitespace-nowrap">${product.price.toFixed(2)}</span>
            </div>
            
            <p className="text-text-muted text-sm line-clamp-2 mb-4 flex-1">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
               <div className="text-xs text-text-muted flex flex-col gap-1">
                 <span>Size: <strong className="text-text bg-bg border border-border px-2 rounded ml-1">{product.size}</strong></span>
                 <span>Stock: <strong className={product.quantity > 5 ? 'text-primary' : 'text-amber-500'}>{product.quantity} left</strong></span>
               </div>
               
               {userRole === 'CUSTOMER' && (
                 <div className="flex gap-2">
                    <button 
                       onClick={() => onAddToWishlist(product.id)}
                       className="p-2.5 bg-bg hover:bg-pink-50 text-text-muted hover:text-pink-600 hover:border-pink-200 rounded-xl transition-all border border-border shadow-sm"
                       title="Add to Wishlist"
                    >
                       <Heart size={18} />
                    </button>
                    <button 
                       onClick={() => onAddToCart(product.id)}
                       disabled={product.quantity === 0}
                       className="p-2.5 px-4 bg-primary hover:bg-primary-dark disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-md shadow-primary/20 disabled:shadow-none active:scale-95"
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
  );
}
