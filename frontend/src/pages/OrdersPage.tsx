import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { apiClient } from "../api/client";
import { Package, ArrowLeft, Clock } from "lucide-react";

export interface OrderItemDto {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface OrderDto {
  id: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemDto[];
}

export default function OrdersPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== "CUSTOMER") {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get("/orders");
      const sorted = response.data.sort(
        (a: OrderDto, b: OrderDto) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOrders(sorted);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <h1 className="text-xl font-bold tracking-tight text-text">
            Order <span className="text-primary">History</span>
          </h1>
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="w-full py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-surface border border-border border-dashed rounded-3xl py-24 flex flex-col items-center justify-center text-text-muted shadow-sm">
            <Package size={64} className="mb-6 text-border" />
            <h2 className="text-2xl font-bold text-text mb-2">No orders yet</h2>
            <p className="text-text-muted">
              When you buy shoes, your receipts will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="bg-bg p-5 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm text-text-muted flex items-center gap-1.5 mb-1">
                      <Clock size={14} /> {formatDate(order.createdAt)}
                    </p>
                    <p className="text-xs font-mono text-text-muted">
                      ORDER #{order.id.toString().padStart(6, "0")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-primary/10 text-primary-dark text-xs font-bold uppercase rounded-full border border-primary/30">
                      {order.status}
                    </span>
                    <span className="text-2xl font-black text-primary-dark pl-4 border-l border-border">
                      ${order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-2 sm:p-5">
                  <table className="w-full text-left text-sm text-text">
                    <thead>
                      <tr className="border-b border-border text-text-muted">
                        <th className="pb-3 px-2 font-medium">Item Name</th>
                        <th className="pb-3 px-2 font-medium text-right">
                          Qty
                        </th>
                        <th className="pb-3 px-2 font-medium text-right">
                          Price
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-b border-border/30 last:border-0 hover:bg-bg transition-colors"
                        >
                          <td className="py-3 px-2 font-medium text-text">
                            {item.productName}
                          </td>
                          <td className="py-3 px-2 text-right">
                            x{item.quantity}
                          </td>
                          <td className="py-3 px-2 text-right font-medium text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
