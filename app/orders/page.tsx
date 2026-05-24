"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  id: string;
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
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/auth/user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          
          if (data.user?.id) {
            const ordersRes = await fetch(`/api/orders?userId=${data.user.id}`);
            if (ordersRes.ok) {
              const ordersData = await ordersRes.json();
              setOrders(ordersData.orders || []);
            }
          }
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatus = (status: string) => {
    const map: any = {
      pending: { label: "⏳ Pending", color: "bg-yellow-100 text-yellow-800" },
      paid: { label: "✅ Paid", color: "bg-green-100 text-green-800" },
      shipped: { label: "📦 Shipped", color: "bg-blue-100 text-blue-800" },
      delivered: { label: "🎉 Delivered", color: "bg-purple-100 text-purple-800" },
    };
    return map[status] || { label: status, color: "bg-gray-100" };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <h1 className="text-4xl font-extrabold text-[#101b2d] mb-8">My Orders</h1>
        <div className="bg-white rounded-3xl p-12 text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#e8a88a] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <h1 className="text-4xl font-extrabold text-[#101b2d] mb-8">My Orders</h1>
        <div className="bg-white rounded-3xl p-12 text-center">
          <p className="text-3xl mb-4">🔐</p>
          <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">Sign In Required</h2>
          <Link href="/login" className="bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold inline-block">
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <h1 className="text-4xl font-extrabold text-[#101b2d] mb-8">My Orders</h1>
        <div className="bg-white rounded-3xl p-12 text-center">
          <p className="text-3xl mb-4">📦</p>
          <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">No Orders Yet</h2>
          <Link href="/parts" className="bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold inline-block">
            Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#101b2d] mb-8">My Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => {
            const s = getStatus(order.status);
            return (
              <div key={order.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 font-bold mb-2">Order</p>
                      <p className="font-mono text-sm font-bold text-[#101b2d]">
                        {order.id.slice(0, 8)}...
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-bold mb-2">Date</p>
                      <p className="font-bold text-[#101b2d]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-bold mb-2">Status</p>
                      <span className={`px-3 py-1 rounded-lg font-bold text-sm ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-bold mb-2">Total</p>
                      <p className="text-2xl font-extrabold text-[#e8a88a]">
                        ${Number(order.total).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="font-extrabold text-[#101b2d] mb-4">Items</h3>
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl">
                        {item.products?.image_url && (
                          <img
                            src={item.products.image_url}
                            alt=""
                            className="w-14 h-14 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-[#101b2d]">{item.products?.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold">${(item.quantity * Number(item.price)).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-between">
                  <span className="text-sm text-gray-600">
                    🚚 {order.delivery_method === "express" ? "Express" : "Standard"}
                  </span>
                  <Link href={`/success/${order.id}`} className="text-[#101b2d] font-bold">
                    View →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}