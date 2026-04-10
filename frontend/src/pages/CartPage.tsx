import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { apiClient } from "../api/client";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";

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
    if (user?.role !== "CUSTOMER") {
      navigate("/");
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/cart");
      setCartItems(response.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (itemId: number) => {
    try {
      await apiClient.delete(`/cart/remove/${itemId}`);
      fetchCart();
    } catch (error) {
      alert("Failed to remove item.");
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await apiClient.post("/orders/checkout");
      alert("Checkout successful! Your order has been placed.");
      navigate("/");
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          "Checkout failed. Stock might be empty.",
      );
    } finally {
      setCheckingOut(false);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0,
    );
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white pb-20 font-sans">
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} /> Continue Shopping
          </button>
          <h1 className="text-xl font-bold tracking-tight text-text">
            Your <span className="text-primary">Cart</span>
          </h1>
          <div className="w-32"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-surface border border-border border-dashed rounded-3xl py-24 flex flex-col items-center justify-center text-text-muted shadow-sm">
            <ShoppingBag size={64} className="mb-6 text-border" />
            <h2 className="text-2xl font-bold text-text mb-2">
              Your cart is empty
            </h2>
            <p className="text-text-muted mb-8 max-w-md text-center">
              It looks like you haven't added any shoes to your cart yet.
              Discover your next favorite pair now!
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold transition-all shadow-md"
            >
              Explore Store
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-border pb-4 text-text">
                <ShoppingBag className="text-primary" /> Review Items
              </h2>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-bg border border-border rounded-2xl hover:border-primary/30 transition-all"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text mb-1">
                      {item.productName}
                    </h3>
                    <div className="text-sm text-text-muted flex items-center gap-3">
                      <span>
                        Qty:{" "}
                        <strong className="text-text bg-surface border border-border px-2 py-0.5 rounded">
                          {item.quantity}
                        </strong>
                      </span>
                      <span>Unit: ${item.productPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-xl font-black text-primary-dark">
                      ${(item.productPrice * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2.5 bg-surface hover:bg-primary/10 text-text-muted hover:text-primary-dark rounded-xl transition-all border border-border hover:border-primary/30"
                      title="Remove Item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-bg to-beige-dark/40 border border-border p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div>
                <p className="text-text-muted text-sm mb-1 font-medium">
                  Total Amount
                </p>
                <p className="text-4xl font-extrabold text-text">
                  ${calculateTotal().toFixed(2)}
                </p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full sm:w-auto px-10 py-4 bg-primary hover:bg-primary-dark disabled:bg-border disabled:text-text-muted text-white rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20 disabled:shadow-none active:scale-95"
              >
                {checkingOut ? "Processing..." : "Complete Checkout"}{" "}
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
