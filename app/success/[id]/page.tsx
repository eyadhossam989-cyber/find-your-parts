import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

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
  user_id: string;
  total: number;
  status: string;
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_phone: string;
  delivery_method: string;
  shipping_cost: number;
  tax: number;
  created_at: string;
  order_items?: OrderItem[];
}

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: orderId } = await params;

  if (!orderId) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-3xl font-extrabold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4 text-lg">No order ID provided</p>

            <div className="space-y-2">
              <Link
                href="/"
                className="block bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition"
              >
                Back to Home
              </Link>
              <Link
                href="/checkout"
                className="block bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-400 transition"
              >
                New Order
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  let order: Order | null = null;
  let error: string = "";

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      error = "Supabase credentials are missing";
    } else {
      const supabase = createClient(supabaseUrl, supabaseKey);
      // First, fetch just the order without relations
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .maybeSingle();

      if (orderError) {
        error = `Order fetch error: ${orderError.message}`;
      } else if (!orderData) {
        error = `Order not found with ID: ${orderId}`;
      } else {
        // Now fetch the order items separately
        const { data: itemsData, error: itemsError } = await supabase
          .from("order_items")
          .select("id, product_id, quantity, price, products(name, image_url)")
          .eq("order_id", orderId);

        if (itemsError) {
          error = `Order items fetch error: ${itemsError.message}`;
        } else {
          order = {
            ...orderData,
            order_items: itemsData || [],
          } as Order;
        }
      }
    }
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error occurred";
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl p-8 text-center border-2 border-red-200">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">❌</span>
            </div>
            <h2 className="text-3xl font-extrabold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4 text-lg">{error}</p>

            <div className="space-y-2">
              <Link
                href="/"
                className="block bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition"
              >
                Back to Home
              </Link>
              <Link
                href="/checkout"
                className="block bg-gray-300 text-gray-800 px-8 py-3 rounded-xl font-bold hover:bg-gray-400 transition"
              >
                New Order
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] p-8">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 text-center">
          <p className="text-gray-600">No order data available</p>
          <Link href="/" className="text-[#101b2d] font-bold mt-4 inline-block">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const subtotal =
    Number(order.total) -
    Number(order.shipping_cost || 0) -
    Number(order.tax || 0);

  const estimatedDelivery =
    order.delivery_method === "express"
      ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        )
      : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          },
        );

  return (
    <main className="min-h-screen bg-[#f5f6f8] p-8">
      <section className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-3xl p-12 mb-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-white">✓</span>
          </div>
          <h1 className="text-4xl font-extrabold text-green-700 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-green-600 text-lg">
            Your order has been successfully placed
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 mb-8">
          <div className="grid grid-cols-2 gap-8 mb-10 pb-8 border-b border-gray-100">
            <div>
              <p className="text-gray-600 text-sm font-bold mb-2">
                Order Number
              </p>
              <p className="text-sm font-extrabold text-[#101b2d] font-mono break-all">
                {order.id}
              </p>
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
              <p className="text-xl font-bold text-blue-600">
                {order.status === "pending" ? "⏳ Processing" : order.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-bold mb-2">
                Total Amount
              </p>
              <p className="text-3xl font-extrabold text-[#e8a88a]">
                ${Number(order.total).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="mb-10 pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">
              📍 Shipping Address
            </h2>
            <div className="bg-gray-50 rounded-2xl p-6">
              <p className="text-lg font-bold text-[#101b2d]">
                {order.shipping_name}
              </p>
              <p className="text-gray-700">{order.shipping_address}</p>
              <p className="text-gray-700">
                {order.shipping_city}, {order.shipping_state}{" "}
                {order.shipping_zip}
              </p>
              <p className="text-gray-700 mt-2">
                📞 {order.shipping_phone || "Not provided"}
              </p>
            </div>
          </div>

          <div className="mb-10 pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-4">
              🚚 Delivery Information
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-sm text-gray-600 font-bold mb-2">Method</p>
                <p className="text-xl font-bold text-blue-600">
                  {order.delivery_method === "express"
                    ? "Express (2-3 days)"
                    : "Standard (5-7 days)"}
                </p>
              </div>
              <div className="bg-blue-50 rounded-2xl p-6">
                <p className="text-sm text-gray-600 font-bold mb-2">
                  Estimated Arrival
                </p>
                <p className="text-xl font-bold text-blue-600">
                  {estimatedDelivery}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10 pb-10 border-b border-gray-100">
            <h2 className="text-2xl font-extrabold text-[#101b2d] mb-6">
              📦 Order Items
            </h2>
            <div className="space-y-4">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl"
                  >
                    {item.products?.image_url && (
                      <img
                        src={item.products.image_url}
                        alt={item.products.name}
                        className="w-16 h-16 object-cover rounded-xl bg-white"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-extrabold text-[#101b2d]">
                        {item.products?.name || "Product"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-[#101b2d] text-lg">
                      ${(item.quantity * Number(item.price)).toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-center py-4">
                  No items found in order
                </p>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-bold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping:</span>
                <span className="font-bold">
                  ${Number(order.shipping_cost).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax:</span>
                <span className="font-bold">
                  ${Number(order.tax).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-2xl font-extrabold text-[#101b2d] border-t border-gray-100 pt-4 mt-4">
                <span>Total:</span>
                <span className="text-[#e8a88a]">
                  ${Number(order.total).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
            <h3 className="text-xl font-extrabold text-[#101b2d] mb-4">
              📬 What's Next?
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-3">
                ✓ Order confirmation email sent
              </li>
              <li className="flex items-center gap-3">
                ⏳ Preparing for shipment
              </li>
              <li className="flex items-center gap-3">
                📦 Tracking info coming within 24h
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4 flex-col sm:flex-row">
          <Link
            href="/"
            className="flex-1 bg-[#101b2d] text-white py-4 rounded-xl font-extrabold text-center hover:bg-black transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/parts"
            className="flex-1 bg-gray-300 text-gray-800 py-4 rounded-xl font-extrabold text-center hover:bg-gray-400 transition"
          >
            Browse All Parts
          </Link>
        </div>
      </section>
    </main>
  );
}
