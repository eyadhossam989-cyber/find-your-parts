"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@supabase/supabase-js";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: {
    name: string;
    image_url: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  delivery_method: string;
  created_at: string;
  order_items?: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Check if user is logged in
        if (!user) {
          setError("Please log in to view your orders");
          setLoading(false);
          return;
        }

        console.log("📋 Fetching orders for user:", user.id);

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Fetch user's orders
        const { data, error: fetchError } = await supabase
          .from("orders")
          .select(
            `
            id,
            total,
            status,
            delivery_method,
            created_at,
            order_items (
              id,
              product_id,
              quantity,
              price,
              products (
                name,
                image_url
              )
            )
          `
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching orders:", fetchError);
          throw new Error(`Failed to fetch orders: ${fetchError.message}`);
        }

        console.log("✅ Orders fetched:", data);
        setOrders(data || []);
      } catch (err) {
        console.error("Error in fetchOrders:", err);
        setError(err instanceof Error ? err.message : "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Get status color and label
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "pending":
        return { label: "⏳ Pending Payment", color: "bg-yellow-100 text-yellow-800" };
      case "paid":
        return { label: "✅ Paid", color: "bg-green-100 text-green-800" };
      case "shipped":
        return { label: "📦 Shipped", color: "bg-blue-100 text-blue-800" };
      case "delivered":
        return { label: "🎉 Delivered", color: "bg-purple-100 text-purple-800" };
      default:
        return { label: status, color: "bg-gray-100 text-gray-800" };
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#101b2d] mb-8">My Orders</h1>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-[#e8a88a] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading your orders...</p>
          </div>
        </div>
      </main>
    );
  }

  // Not logged in state
  if (!user) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#101b2d] mb-8">My Orders</h1>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please log in to view your orders</p>
            <Link
              href="/auth/login"
              className="inline-block bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error && orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#101b2d] mb-8">My Orders</h1>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-block bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // No orders state
  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#101b2d] mb-8">My Orders</h1>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link
              href="/parts"
              className="inline-block bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Orders list
  return (
    <main className="min-h-screen bg-[#f5f6f8] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#101b2d] mb-2">My Orders</h1>
        <p className="text-gray-600 mb-8">You have {orders.length} order{orders.length !== 1 ? "s" : ""}</p>

        <div className="space-y-6">
          {orders.map((order) => {
            const statusDisplay = getStatusDisplay(order.status);
            const orderDate = new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition"
              >
                {/* Order Header */}
                <div className="p-8 border-b border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    {/* Order Number */}
                    <div>
                      <p className="text-sm text-gray-600 font-bold mb-2">Order Number</p>
                      <p className="font-mono text-sm font-bold text-[#101b2d] break-all">
                        {order.id.slice(0, 8).toUpperCase()}...
                      </p>
                    </div>

                    {/* Order Date */}
                    <div>
                      <p className="text-sm text-gray-600 font-bold mb-2">Order Date</p>
                      <p className="font-bold text-[#101b2d]">{orderDate}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-sm text-gray-600 font-bold mb-2">Status</p>
                      <span
                        className={`inline-block px-4 py-2 rounded-lg font-bold text-sm ${statusDisplay.color}`}
                      >
                        {statusDisplay.label}
                      </span>
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-sm text-gray-600 font-bold mb-2">Total</p>
                      <p className="text-2xl font-extrabold text-[#e8a88a]">
                        ${Number(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8">
                  <h3 className="text-lg font-extrabold text-[#101b2d] mb-4">Items</h3>
                  <div className="space-y-4">
                    {order.order_items && order.order_items.length > 0 ? (
                      order.order_items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                        >
                          {item.products?.image_url && (
                            <img
                              src={item.products.image_url}
                              alt={item.products.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-[#101b2d]">
                              {item.products?.name || "Product"}
                            </p>
                            <p className="text-sm text-gray-600">
                              Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-[#101b2d]">
                              ${(item.quantity * Number(item.price)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">No items in this order</p>
                    )}
                  </div>
                </div>

                {/* Order Details Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        🚚 {order.delivery_method === "express" ? "Express" : "Standard"} Delivery
                      </span>
                    </div>
                    <Link
                      href={`/success/${order.id}`}
                      className="text-[#101b2d] font-bold hover:underline"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="mt-8 text-center">
          <Link
            href="/parts"
            className="inline-block bg-[#101b2d] text-white px-8 py-4 rounded-xl font-bold hover:bg-black transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}