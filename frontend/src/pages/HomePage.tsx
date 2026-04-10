import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { apiClient } from "../api/client";
import {
  ShoppingCart,
  LogOut,
  Plus,
  Search,
  Heart,
  Package,
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/products/public/all");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
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
      const response = await apiClient.get(
        `/products/public/search?type=${searchQuery}`,
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      await apiClient.post(`/cart/add?productId=${productId}&quantity=1`);
      alert("Added to cart!");
    } catch (error) {
      alert("Failed to add to cart. Maybe out of stock?");
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await apiClient.post(`/wishlist/add/${productId}`);
      alert("Added to wishlist!");
    } catch (error) {
      alert("Failed to add to wishlist. Maybe already exists?");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white pb-20 font-sans">
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1
              className="text-2xl font-bold tracking-tight cursor-pointer text-text"
              onClick={() => fetchProducts()}
            >
              Shoe<span className="text-primary">Store</span>
            </h1>

            <form
              onSubmit={handleSearch}
              className="hidden md:flex flex-1 max-w-md mx-8 relative"
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by shoe type (e.g. Sport, Casual)..."
                className="w-full pl-10 pr-4 py-2 bg-bg border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all text-sm text-text placeholder:text-text-muted"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <div className="flex items-center gap-4">
              {user?.role === "SELLER" ? (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-surface hover:bg-bg rounded-lg text-sm font-medium transition-colors border border-border shadow-sm text-text"
                >
                  <Plus size={16} /> Add Product
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/orders")}
                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                    title="Order History"
                  >
                    <Package size={20} />
                  </button>
                  <button
                    onClick={() => navigate("/wishlist")}
                    className="p-2 text-text-muted hover:text-primary-dark hover:bg-primary/10 rounded-full transition-all"
                    title="Wishlist"
                  >
                    <Heart size={20} />
                  </button>
                  <button
                    onClick={() => navigate("/cart")}
                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-full transition-all"
                    title="Cart"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              )}

              <div className="h-6 w-px bg-border mx-2"></div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-text">
                    {user?.name}
                  </div>
                  <div className="text-xs text-primary font-semibold">
                    {user?.role}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-text-muted hover:text-primary-dark hover:bg-primary/10 rounded-full transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-4xl font-extrabold tracking-tight mb-2 text-text">
            Latest Arrivals
          </h2>
          <p className="text-text-muted text-lg">
            Discover the perfect pair for any occasion.
          </p>
        </div>

        {loading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="w-full py-20 text-center bg-surface rounded-3xl border border-border flex flex-col items-center justify-center shadow-sm">
            <div className="w-16 h-16 bg-bg border border-border rounded-full flex items-center justify-center mb-4">
              <Search className="text-text-muted" size={24} />
            </div>
            <h3 className="text-xl text-text font-medium">No shoes found</h3>
            <p className="text-text-muted mt-2">
              Try searching for a different type, or check back later!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-surface border border-border rounded-2xl overflow-hidden hover:border-primary/30 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="h-56 bg-gradient-to-br from-bg to-beige-dark/40 p-6 flex flex-col items-center justify-center relative shadow-inner">
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-xs font-semibold text-text uppercase tracking-wider border border-border shadow-sm">
                    {product.type}
                  </div>
                  <div className="text-border font-bold text-5xl rotate-[-20deg] select-none group-hover:scale-110 group-hover:text-text-muted transition-all duration-500">
                    SHOE
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3
                      className="text-xl font-bold text-text line-clamp-1"
                      title={product.name}
                    >
                      {product.name}
                    </h3>
                    <span className="text-xl font-black text-primary-dark ml-2 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-text-muted text-sm line-clamp-2 mb-4 flex-1">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <div className="text-xs text-text-muted flex flex-col gap-1">
                      <span>
                        Size:{" "}
                        <strong className="text-text bg-bg border border-border px-2 rounded ml-1">
                          {product.size}
                        </strong>
                      </span>
                      <span>
                        Stock:{" "}
                        <strong
                          className={
                            product.quantity > 5
                              ? "text-primary-dark"
                              : "text-primary"
                          }
                        >
                          {product.quantity} left
                        </strong>
                      </span>
                    </div>

                    {user?.role === "CUSTOMER" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToWishlist(product.id)}
                          className="p-2.5 bg-bg hover:bg-primary/10 text-text-muted hover:text-primary-dark hover:border-primary/30 rounded-xl transition-all border border-border shadow-sm"
                          title="Add to Wishlist"
                        >
                          <Heart size={18} />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.quantity === 0}
                          className="p-2.5 px-4 bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-muted text-white font-medium rounded-xl transition-all flex items-center gap-2 shadow-md shadow-primary/20 disabled:shadow-none active:scale-95"
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
