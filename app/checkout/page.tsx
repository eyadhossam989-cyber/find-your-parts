"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [shipping, setShipping] = useState(12.5);
  const [deliveryMethod, setDeliveryMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");

  // Get current user and cart on mount
  useEffect(() => {
    const init = async () => {
      try {
        // Get cart from localStorage
        const savedCart = localStorage.getItem("fyp-cart");
        if (savedCart) {
          const parsedItems = JSON.parse(savedCart);
          setItems(parsedItems);
        }

        // Get user from Supabase
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (err) {
        console.error("Init error:", err);
      }
    };

    init();
  }, []);

  const subtotal = items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax + shipping;

  const handleDeliveryChange = (method: string) => {
    setDeliveryMethod(method);
    setShipping(method === "express" ? 28.0 : 12.5);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!user) {
        setError("You must be logged in to place an order");
        setLoading(false);
        return;
      }

      if (items.length === 0) {
        setError("Your cart is empty");
        setLoading(false);
        return;
      }

      if (!fullName || !address || !city || !state || !zipCode || !phone) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      console.log("📋 Creating order...");

      // Create order directly in Supabase
      const cartItems = items.map((item) => ({
        name: item.name,
        quantity: item.qty,
        price: Number(item.price),
      }));

      // Get product IDs
      const productNames = cartItems.map((item) => item.name);
      const { data: products, error: productError } = await supabase
        .from("products")
        .select("id, name, price")
        .in("name", productNames);

      if (productError) {
        throw new Error(`Product lookup failed: ${productError.message}`);
      }

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total: total,
          status: "pending",
          shipping_name: fullName,
          shipping_address: address,
          shipping_city: city,
          shipping_state: state,
          shipping_zip: zipCode,
          shipping_phone: phone,
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          shipping_cost: shipping,
          tax: tax,
        })
        .select();

      if (orderError) {
        throw new Error(`Order creation failed: ${orderError.message}`);
      }

      if (!orderData || orderData.length === 0) {
        throw new Error("Order was not created");
      }

      const orderId = orderData[0].id;

      // Create order items
      const orderItems = cartItems.map((item) => {
        const product = products?.find(
          (p) => p.name.toLowerCase() === item.name.toLowerCase()
        );
        if (!product) {
          throw new Error(`Product not found: ${item.name}`);
        }
        return {
          order_id: orderId,
          product_id: product.id,
          quantity: item.quantity,
          price: item.price,
        };
      });

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        throw new Error(`Items creation failed: ${itemsError.message}`);
      }

      console.log("✅ Order created:", orderId);

      // Clear cart
      localStorage.removeItem("fyp-cart");

      // Redirect to success
      router.push(`/success/${orderId}`);
    } catch (err) {
      console.error("Order error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1280px] mx-auto p-8">
        <div className="mb-8">
          <p className="text-[#e8a88a] font-bold uppercase tracking-wider text-sm">Secure Checkout</p>
          <h2 className="text-5xl font-extrabold text-[#101b2d]">Checkout</h2>
        </div>

        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8">
            <p className="font-bold">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {!user && (
          <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-6 py-4 rounded-2xl mb-8">
            <p className="font-bold">⚠️ Please Log In</p>
            <p>You must be logged in to checkout.</p>
            <Link href="/login" className="underline font-bold mt-2 block">
              Go to Login
            </Link>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* Shipping Address */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                <h3 className="text-2xl font-extrabold mb-6">📍 Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    className="md:col-span-2 border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a]"
                    placeholder="Full Name *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="md:col-span-2 border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a]"
                    placeholder="Street Address *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a]"
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a]"
                    placeholder="State *"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a]"
                    placeholder="ZIP Code *"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a]"
                    placeholder="Phone *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </section>

              {/* Delivery Method */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                <h3 className="text-2xl font-extrabold mb-6">🚚 Delivery Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleDeliveryChange("standard")}
                    className={`p-6 rounded-2xl border-2 transition ${
                      deliveryMethod === "standard"
                        ? "border-[#101b2d] bg-[#101b2d]/5"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-bold">Standard</p>
                    <p className="text-sm text-gray-600">5-7 days</p>
                    <p className="font-bold text-[#e8a88a] mt-2">$12.50</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeliveryChange("express")}
                    className={`p-6 rounded-2xl border-2 transition ${
                      deliveryMethod === "express"
                        ? "border-[#101b2d] bg-[#101b2d]/5"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-bold">Express</p>
                    <p className="text-sm text-gray-600">2-3 days</p>
                    <p className="font-bold text-[#e8a88a] mt-2">$28.00</p>
                  </button>
                </div>
              </section>

              {/* Payment Method */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                <h3 className="text-2xl font-extrabold mb-6">💳 Payment Method</h3>
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash_on_delivery")}
                    className={`w-full p-4 rounded-2xl border-2 transition text-left ${
                      paymentMethod === "cash_on_delivery"
                        ? "border-[#101b2d] bg-[#101b2d]/5"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-bold">💵 Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when it arrives</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full p-4 rounded-2xl border-2 transition text-left ${
                      paymentMethod === "card"
                        ? "border-[#101b2d] bg-[#101b2d]/5"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-bold">💳 Credit Card</p>
                    <p className="text-sm text-gray-600">Secure payment</p>
                  </button>
                </div>

                {paymentMethod === "cash_on_delivery" && (
                  <div className="mt-4 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                    <p className="text-blue-900 font-semibold text-sm">
                      💵 Pay in cash when your order arrives
                    </p>
                  </div>
                )}
              </section>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-4">
              <div className="bg-[#101b2d] text-white rounded-3xl shadow-xl p-8 sticky top-24">
                <h3 className="text-2xl font-extrabold border-b border-white/20 pb-5 mb-5">Order Summary</h3>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto">
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm pb-4 border-b border-white/10">
                        <div>
                          <p className="font-bold">{item.name}</p>
                          <p className="text-white/60">Qty: {item.qty}</p>
                        </div>
                        <p className="font-bold">${(item.qty * Number(item.price)).toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40">No items</p>
                  )}
                </div>

                <div className="border-t border-white/20 pt-5 space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="font-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (10%)</span>
                    <span className="font-bold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-extrabold text-[#e8a88a] pt-4 border-t border-white/20">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !user || items.length === 0}
                  className="w-full bg-[#e8a88a] text-[#101b2d] py-4 rounded-xl font-extrabold hover:bg-[#f5b99a] disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Place Order →"}
                </button>
              </div>
            </aside>
          </div>
        </form>
      </section>
    </main>
  );
}