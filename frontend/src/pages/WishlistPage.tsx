import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { apiClient } from "../api/client";
import { Heart, Trash2, ArrowLeft, ShoppingCart } from "lucide-react";

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
    if (user?.role !== "CUSTOMER") {
      navigate("/");
      return;
    }
    fetchWishlist();
  }, [user, navigate]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/wishlist");
      setItems(response.data);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await apiClient.delete(`/wishlist/remove/${itemId}`);
      fetchWishlist();
    } catch (error) {
      alert("Failed to remove item.");
    }
  };

  const handleAddToCart = async (productId: number, itemId: number) => {
    try {
      await apiClient.post(`/cart/add?productId=${productId}&quantity=1`);
      await apiClient.delete(`/wishlist/remove/${itemId}`);
      alert("Moved to cart!");
      fetchWishlist();
    } catch (error) {
      alert("Failed to move to cart. Might be out of stock.");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white pb-20 font-sans">
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} /> Back to Store
          </button>
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 text-text">
            My <Heart className="text-primary fill-primary" size={20} />{" "}
            <span className="text-primary">Wishlist</span>
          </h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-surface border border-border border-dashed rounded-3xl py-24 flex flex-col items-center justify-center text-text-muted shadow-sm">
            <Heart size={64} className="mb-6 text-border" />
            <h2 className="text-2xl font-bold text-text mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-text-muted mb-8 max-w-md text-center">
              Save items you love so you can keep track of them and buy them
              later.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all shadow-md"
            >
              Find Favorites
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-surface border border-border rounded-2xl p-6 shadow-sm flex flex-col hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-text leading-tight">
                    {item.productName}
                  </h3>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-text-muted hover:text-primary-dark transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <p className="text-2xl font-black text-primary-dark mb-6">
                  ${item.productPrice.toFixed(2)}
                </p>

                <button
                  onClick={() => handleAddToCart(item.productId, item.id)}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 mt-auto"
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
