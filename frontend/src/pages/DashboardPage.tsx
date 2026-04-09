import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { apiClient } from '../api/client';
import { Plus, Trash2, ArrowLeft, PackageSearch } from 'lucide-react';
import { ProductDto } from './HomePage';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('Sport');
  const [description, setDescription] = useState('');
  const [size, setSize] = useState<number>(42);
  const [price, setPrice] = useState<number>(89.99);
  const [quantity, setQuantity] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role !== 'SELLER') {
      navigate('/');
      return;
    }
    fetchMyProducts();
  }, [user, navigate]);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/products/public/all');
      const allProducts: ProductDto[] = response.data;
      setProducts(allProducts.filter(p => p.sellerId === user?.id));
    } catch (error) {
       console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/products', {
        name,
        type,
        description,
        size,
        price,
        quantity
      });
      alert('Product created successfully!');
      setName('');
      setDescription('');
      fetchMyProducts();
    } catch (error) {
      alert('Failed to publish product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
       // Only the database admin can truly drop it if we didn't expose the endpoint
       // Our ProductController currently doesn't have a DELETE endpoint built 
       // but we'll try!
       alert("Delete endpoint was not created in the Java Backend for this tutorial.");
    } catch (error) {
       console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-indigo-500 selection:text-white pb-20">
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
           <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft size={20} /> Back to Store
           </button>
           <h1 className="text-xl font-bold tracking-tight">
               Seller <span className="text-indigo-500">Dashboard</span>
           </h1>
           <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col - Add Product Form */}
            <div className="lg:col-span-1">
               <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sticky top-24 shadow-2xl">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                       <Plus size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Add New Shoe</h2>
                 </div>
                 
                 <form onSubmit={handleAddProduct} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Shoe Name</label>
                      <input type="text" required value={name} onChange={e => setName(e.target.value)}
                             className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-zinc-600"
                             placeholder="e.g. Air Max 90" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-1">Category Type</label>
                          <select value={type} onChange={e => setType(e.target.value)}
                                 className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                             <option value="Sport">Sport</option>
                             <option value="Casual">Casual</option>
                             <option value="Formal">Formal</option>
                             <option value="Sneaker">Sneaker</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-1">Size (EU)</label>
                          <input type="number" required value={size} onChange={e => setSize(Number(e.target.value))}
                                 className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-1">Price ($)</label>
                          <input type="number" step="0.01" required value={price} onChange={e => setPrice(Number(e.target.value))}
                                 className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-400 mb-1">Stock Quantity</label>
                          <input type="number" required value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                                 className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-400 mb-1">Description</label>
                      <textarea required value={description} onChange={e => setDescription(e.target.value)} rows={3}
                             className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-zinc-600"
                             placeholder="Describe the shoe capabilities..." />
                    </div>

                    <button type="submit" disabled={isSubmitting}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(79,70,229,0.4)] disabled:opacity-50 mt-2">
                       {isSubmitting ? 'Publishing...' : 'Publish Product'}
                    </button>
                 </form>
               </div>
            </div>

            {/* Right Col - My Inventory */}
            <div className="lg:col-span-2">
               <div className="flex items-center gap-3 mb-6">
                  <PackageSearch className="text-zinc-400" size={24} />
                  <h2 className="text-2xl font-bold">My Inventory</h2>
               </div>

               {loading ? (
                   <div className="w-full py-20 flex justify-center">
                     <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                   </div>
               ) : products.length === 0 ? (
                   <div className="bg-zinc-900 border border-zinc-800 border-dashed rounded-2xl py-20 flex flex-col items-center justify-center text-zinc-500">
                      <PackageSearch size={48} className="mb-4 opacity-50" />
                      <p className="text-lg text-zinc-400">You haven't listed any shoes yet.</p>
                      <p className="text-sm mt-1">Use the form on the left to add your first product!</p>
                   </div>
               ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {products.map(product => (
                         <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col hover:border-zinc-700 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                               <h3 className="font-bold text-xl leading-tight text-white">{product.name}</h3>
                               <div className="px-2 py-1 bg-zinc-800 rounded-md text-xs font-semibold text-zinc-300">
                                  {product.type}
                               </div>
                            </div>
                            <p className="text-indigo-400 font-black text-2xl mb-4">${product.price.toFixed(2)}</p>
                            
                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                               <div className="text-sm text-zinc-400 font-medium">
                                  Size: {product.size} &nbsp;&bull;&nbsp; Stock: <span className={product.quantity === 0 ? 'text-red-400' : 'text-emerald-400'}>{product.quantity}</span>
                               </div>
                               <button onClick={() => handleDelete(product.id)} className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors" title="Delete Product">
                                  <Trash2 size={18} />
                               </button>
                            </div>
                         </div>
                      ))}
                   </div>
               )}
            </div>
         </div>
      </main>
    </div>
  );
}
