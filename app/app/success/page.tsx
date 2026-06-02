"use client";
import { useEffect, useState, use } from "react"; // 1. Added 'use' import
import Link from "next/link";
import { getOrder } from "@/lib/checkoutService";

// 2. Updated Type definition to expect a Promise
export default function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  // 3. Unwrap the params promise to get the real ID
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        console.log("📦 Fetching order:", orderId);
        const orderData = await getOrder(orderId);
        console.log("✅ Order loaded:", orderData);
        setOrder(orderData);
      } catch (err) {
        console.error("❌ Error fetching order:", err);
        setError(err instanceof Error ? err.message : "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#e8a88a] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading your order...</p>
        </div>
      </main>
    );
  }

  if (error || !order) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
          <h2 className="text-3xl font-extrabold text-red-600 mb-4">❌ Error</h2>
          <p className="text-gray-600 mb-6">{error || "Order not found"}</p>
          <Link href="/" className="bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold inline-block">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  const estimatedDelivery =
    order.delivery_method === "express"
      ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
      : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString();

  return (
    <main className="min-h-screen bg-[#f5f6f8] p-8">
      <section className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-3xl p-12 mb-8 text-center shadow-sm">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white">✓</span>
          </div>
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">Order Confirmed!</h1>
          <p className="text-green-600 text-lg">Your order has been successfully placed</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-100">
            <div>
              <p className="text-gray-600 text-sm font-bold mb-2">Order Number</p>
              <p className="text-sm font-extrabold text-[#101b2d] font-mono break-all">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-bold mb-2">Order Date</p>
              <p className="text-2xl font-bold text-[#101b2d]">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-bold mb-2">Status</p>
              <p className="text-xl font-bold text-blue-600 uppercase">
                {order.status === "pending" ? "⏳ Processing" : order.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-bold mb-2">Total Amount</p>
              <p className="text-3xl font-extrabold text-[#e8a88a]">${Number(order.total).toFixed(2)}</p>
            </div>
          </div>

          <div className="mb-10 pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">📍 Shipping Address</h2>
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-lg font-bold text-[#101b2d]">{order.shipping_name}</p>
              <p className="text-gray-700">{order.shipping_address}</p>
              <p className="text-gray-700">
                {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
              </p>
              <p className="text-gray-700 mt-2">📞 {order.shipping_phone || "Not provided"}</p>
            </div>
          </div>

          <div className="mb-10 pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">🚚 Delivery Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-sm text-gray-600 font-bold mb-2">Method</p>
                <p className="text-xl font-bold text-blue-600">
                  {order.delivery_method === "express" ? "Express (2-3 days)" : "Standard (5-7 days)"}
                </p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-sm text-gray-600 font-bold mb-2">Estimated Arrival</p>
                <p className="text-xl font-bold text-blue-600">{estimatedDelivery}</p>
              </div>
            </div>
          </div>

          <div className="mb-10 pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-6">📦 Order Items</h2>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  {item.products?.image_url && (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-16 h-16 object-cover rounded-xl bg-white"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-extrabold text-[#101b2d]">{item.products?.name || "Product"}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                    </p>
                  </div>
                  <p className="font-bold text-[#101b2d] text-lg">
                    ${(item.quantity * Number(item.price)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-bold">${(Number(order.total) - Number(order.shipping_cost) - Number(order.tax)).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-bold">${Number(order.shipping_cost).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax:</span>
                <span className="font-bold">${Number(order.tax).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold text-[#101b2d] border-t border-gray-100 pt-4 mt-4">
                <span>Total:</span>
                <span className="text-[#e8a88a]">${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-extrabold text-[#101b2d] mb-4">📬 What's Next?</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-3">✓ Order confirmation email sent</li>
              <li className="flex items-center gap-3">⏳ Preparing for shipment</li>
              <li className="flex items-center gap-3">📦 Tracking info coming within 24h</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Link href="/orders" className="flex-1 bg-[#101b2d] text-white py-4 rounded-xl font-extrabold text-center hover:bg-black transition">
            View All Orders
          </Link>
          <Link href="/parts" className="flex-1 bg-gray-300 text-gray-800 py-4 rounded-xl font-extrabold text-center hover:bg-gray-400 transition">
            Continue Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}