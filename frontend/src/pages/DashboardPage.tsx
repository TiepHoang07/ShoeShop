import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { apiClient } from "../api/client";
import { Plus, Trash2, ArrowLeft, PackageSearch } from "lucide-react";
import type { ProductDto } from "./HomePage";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [type, setType] = useState("Sport");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState<number>(42);
  const [price, setPrice] = useState<number>(89.99);
  const [quantity, setQuantity] = useState<number>(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role !== "SELLER") {
      navigate("/");
      return;
    }
    fetchMyProducts();
  }, [user, navigate]);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/products/public/all");
      const allProducts: ProductDto[] = response.data;
      setProducts(allProducts.filter((p) => p.sellerId === user?.id));
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
      await apiClient.post("/products", {
        name,
        type,
        description,
        size,
        price,
        quantity,
      });
      alert("Product created successfully!");
      setName("");
      setDescription("");
      fetchMyProducts();
    } catch (error) {
      alert("Failed to publish product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (_id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      alert(
        "Delete endpoint was not created in the Java Backend for this tutorial.",
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-primary selection:text-white pb-20 font-sans">
      <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} /> Back to Store
          </button>
          <h1 className="text-xl font-bold tracking-tight text-text">
            Seller <span className="text-primary">Dashboard</span>
          </h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-2xl p-6 sticky top-24 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 text-primary rounded-lg">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-bold text-text">Add New Shoe</h2>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Shoe Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-text-muted text-text"
                    placeholder="e.g. Air Max 90"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">
                      Category Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-text"
                    >
                      <option value="Sport">Sport</option>
                      <option value="Casual">Casual</option>
                      <option value="Formal">Formal</option>
                      <option value="Sneaker">Sneaker</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">
                      Size (EU)
                    </label>
                    <input
                      type="number"
                      required
                      value={size}
                      onChange={(e) => setSize(Number(e.target.value))}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-text"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-muted mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full bg-bg border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all text-text"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-muted mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-bg border border-border rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary outline-none transition-all resize-none placeholder:text-text-muted text-text"
                    placeholder="Describe the shoe capabilities..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-all shadow-md shadow-primary/20 disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? "Publishing..." : "Publish Product"}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <PackageSearch className="text-text-muted" size={24} />
              <h2 className="text-2xl font-bold text-text">My Inventory</h2>
            </div>

            {loading ? (
              <div className="w-full py-20 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-surface border border-border border-dashed rounded-2xl py-20 flex flex-col items-center justify-center text-text-muted">
                <PackageSearch size={48} className="mb-4 text-border" />
                <p className="text-lg text-text">
                  You haven't listed any shoes yet.
                </p>
                <p className="text-sm mt-1">
                  Use the form on the left to add your first product!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-surface border border-border rounded-2xl p-6 flex flex-col hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-xl leading-tight text-text">
                        {product.name}
                      </h3>
                      <div className="px-2 py-1 bg-bg rounded-md text-xs font-semibold text-text-muted border border-border">
                        {product.type}
                      </div>
                    </div>
                    <p className="text-primary-dark font-black text-2xl mb-4">
                      ${product.price.toFixed(2)}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                      <div className="text-sm text-text-muted font-medium">
                        Size: {product.size} &nbsp;&bull;&nbsp; Stock:{" "}
                        <span
                          className={
                            product.quantity === 0
                              ? "text-primary"
                              : "text-primary-dark"
                          }
                        >
                          {product.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2.5 text-text-muted hover:text-primary-dark hover:bg-primary/10 rounded-xl transition-colors border border-transparent hover:border-primary/30"
                        title="Delete Product"
                      >
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
