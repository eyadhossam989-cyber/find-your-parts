"use client";

// app/orders/page.tsx

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

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

const STATUS_MAP: Record<
  string,
  { label: string; color: string; dot: string }
> = {
  pending: {
    label: "Pending",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  paid: {
    label: "Paid",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
  },
  shipped: {
    label: "Shipped",
    color: "bg-sky-50 text-sky-700 border-sky-200",
    dot: "bg-sky-400",
  },
  delivered: {
    label: "Delivered",
    color: "bg-violet-50 text-violet-700 border-violet-200",
    dot: "bg-violet-400",
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        // ── Get session directly from localStorage (where Supabase stores it) ──
        // Key format: sb-<project-ref>-auth-token
        let accessToken: string | null = null;
        let userId: string | null = null;

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
            try {
              const raw = localStorage.getItem(key);
              if (raw) {
                const parsed = JSON.parse(raw);
                accessToken = parsed?.access_token ?? null;
                userId = parsed?.user?.id ?? null;
              }
            } catch {}
          }
        }

        if (!accessToken || !userId) {
          setAuthed(false);
          return;
        }

        // ── Create client and set the session manually ──────────────────────
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Tell Supabase to use this token for this request
        const { data, error } = await supabase
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
              quantity,
              price,
              products (
                name,
                image_url
              )
            )
          `,
          )
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .setHeader("Authorization", `Bearer ${accessToken}`);

        if (error) {
          console.error("Orders fetch error:", error);
          // Even if query fails, user IS authenticated
          setAuthed(true);
        } else {
          setAuthed(true);
          setOrders((data as unknown as Order[]) ?? []);
        }
      } catch (err) {
        console.error("Orders load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#101b2d] mb-10">
            My Orders
          </h1>
          <div className="bg-white rounded-3xl p-16 flex flex-col items-center gap-4 shadow-sm">
            <div className="w-12 h-12 rounded-full border-4 border-[#e8a88a] border-t-transparent animate-spin" />
            <p className="text-gray-500 font-medium">Fetching your orders…</p>
          </div>
        </div>
      </main>
    );
  }

  // ── Not signed in ────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#101b2d] mb-10">
            My Orders
          </h1>
          <div className="bg-white rounded-3xl p-16 flex flex-col items-center gap-5 shadow-sm text-center">
            <span className="text-6xl">🔐</span>
            <h2 className="text-2xl font-extrabold text-[#101b2d]">
              Sign in to see your orders
            </h2>
            <p className="text-gray-500 max-w-sm">
              Your order history lives here — log in and we'll pull it right up.
            </p>
            <Link
              href="/login"
              className="mt-2 bg-[#101b2d] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#1e2f47] transition-colors"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── No orders yet ────────────────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-extrabold text-[#101b2d] mb-10">
            My Orders
          </h1>
          <div className="bg-white rounded-3xl p-16 flex flex-col items-center gap-5 shadow-sm text-center">
            <span className="text-6xl">🛒</span>
            <h2 className="text-2xl font-extrabold text-[#101b2d]">
              Your garage is waiting
            </h2>
            <p className="text-gray-500 max-w-sm">
              No orders yet — but your car isn't going to fix itself. Browse the
              catalog and get what you need.
            </p>
            <Link
              href="/parts"
              className="mt-2 bg-[#e8a88a] text-[#101b2d] px-10 py-3 rounded-xl font-bold hover:bg-[#e09878] transition-colors"
            >
              Shop Parts →
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ── Orders list ──────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f5f6f8] px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold text-[#101b2d]">My Orders</h1>
          <span className="text-sm text-gray-500 font-semibold">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const s = STATUS_MAP[order.status] ?? {
              label: order.status,
              color: "bg-gray-100 text-gray-600 border-gray-200",
              dot: "bg-gray-400",
            };
            const itemCount =
              order.order_items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-8 py-6 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Order ID
                    </p>
                    <p className="font-mono text-sm font-bold text-[#101b2d]">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Date
                    </p>
                    <p className="font-bold text-[#101b2d] text-sm">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${s.color}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                      {s.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Total
                    </p>
                    <p className="text-2xl font-extrabold text-[#e8a88a]">
                      ${Number(order.total).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="px-8 py-6">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                  <div className="space-y-3">
                    {order.order_items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3"
                      >
                        {item.products?.image_url && (
                          <img
                            src={item.products.image_url}
                            alt={item.products?.name ?? ""}
                            className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#101b2d] truncate">
                            {item.products?.name ?? "Unknown Part"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × ${Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-extrabold text-[#101b2d] flex-shrink-0">
                          ${(item.quantity * Number(item.price)).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-gray-500 font-semibold">
                    🚚{" "}
                    {order.delivery_method === "express"
                      ? "Express Delivery"
                      : "Standard Delivery"}
                  </span>
                  <Link
                    href={`/success/${order.id}`}
                    className="text-sm font-extrabold text-[#101b2d] hover:text-[#e8a88a] transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/parts"
            className="inline-block bg-[#101b2d] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#1e2f47] transition-colors"
          >
            + Order More Parts
          </Link>
        </div>
      </div>
    </main>
  );
}
