"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { createOrder } from "@/lib/checkoutService";

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="w-11 h-11 rounded-xl bg-[#e8a88a]/15 text-[#e8a88a] flex items-center justify-center">
    {children}
  </div>
);

const TruckIcon = () => <span className="text-2xl">🚚</span>;
const AddressIcon = () => <span className="text-2xl">📍</span>;
const PaymentIcon = () => <span className="text-2xl">💳</span>;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [shipping, setShipping] = useState(12.5);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  // Get current user and cart on mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    const savedCart = localStorage.getItem("fyp-cart");
    if (savedCart) {
      const parsedItems = JSON.parse(savedCart);
      setItems(parsedItems);
    }

    getCurrentUser();
  }, []);

  const subtotal = items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Validation
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

      if (!fullName || !address || !city || !state || !zipCode) {
        setError("Please fill in all address fields");
        setLoading(false);
        return;
      }

      console.log("📋 Placing order with:");
      console.log("User ID:", user.id);
      console.log("Items:", items);
      console.log("Totals:", { subtotal, shipping, tax, total });

      // Create order in Supabase
      const result = await createOrder(
        user.id,
        {
          fullName,
          address,
          city,
          state,
          zipCode,
          deliveryMethod: shipping === 12.5 ? "standard" : "express",
          paymentMethod: paymentMethod as "card" | "paypal",
        },
        items,
        { subtotal, shipping, tax, total }
      );

      if (!result.success) {
        setError(result.error || "Failed to create order");
        setLoading(false);
        return;
      }

      console.log("✅ Order created successfully:", result.orderId);

      // Clear cart from localStorage
      localStorage.removeItem("fyp-cart");

      // Redirect to success page with order ID
      router.push(`/success/${result.orderId}`);
    } catch (err) {
      console.error("❌ Checkout error:", err);
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
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8">
            <p className="font-bold">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {!user && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded-2xl mb-8">
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
              {/* Shipping Address Section */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <IconBox><AddressIcon /></IconBox>
                  <h3 className="text-2xl font-extrabold">Shipping Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    className="md:col-span-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="md:col-span-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]"
                    placeholder="Street Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]"
                    placeholder="ZIP Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                </div>
              </section>

              {/* Delivery Method Section */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <IconBox><TruckIcon /></IconBox>
                  <h3 className="text-2xl font-extrabold">Delivery Method</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setShipping(12.5)}
                    className={`p-5 rounded-2xl flex justify-between border-2 ${shipping === 12.5 ? "border-[#101b2d] bg-[#101b2d]/5" : "border-gray-100"}`}
                  >
                    <div className="text-left"><p className="font-bold">Standard</p></div>
                    <b>$12.50</b>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShipping(28.0)}
                    className={`p-5 rounded-2xl flex justify-between border-2 ${shipping === 28.0 ? "border-[#101b2d] bg-[#101b2d]/5" : "border-gray-100"}`}
                  >
                    <div className="text-left"><p className="font-bold">Express</p></div>
                    <b>$28.00</b>
                  </button>
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <IconBox><PaymentIcon /></IconBox>
                  <h3 className="text-2xl font-extrabold">Payment Method</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`rounded-xl py-3 font-bold border-2 transition ${paymentMethod === "card" ? "border-[#101b2d] bg-[#101b2d]/5" : "border-gray-100"}`}
                  >
                    💳 Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("paypal")}
                    className={`rounded-xl py-3 font-bold border-2 transition ${paymentMethod === "paypal" ? "border-[#101b2d] bg-[#101b2d]/5" : "border-gray-100"}`}
                  >
                    PayPal
                  </button>
                </div>

                {paymentMethod === "card" ? (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <input
                      type="text"
                      className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]"
                      placeholder="Card Number"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" className="border rounded-xl p-4 outline-none" placeholder="MM/YY" />
                      <input type="text" className="border rounded-xl p-4 outline-none" placeholder="CVC" />
                    </div>
                  </div>
                ) : (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    <label className="text-sm font-bold text-gray-600 ml-1">PayPal Email</label>
                    <input
                      type="email"
                      className="w-full border-2 border-[#101b2d] rounded-xl p-4 mt-2 outline-none"
                      placeholder="example@paypal.com"
                    />
                  </div>
                )}
              </section>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-4">
              <div className="bg-[#101b2d] text-white rounded-3xl shadow-xl p-8 sticky top-24">
                <h3 className="text-2xl font-extrabold border-b border-white/20 pb-5 mb-5">Order Summary</h3>
                <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2">
                  {items.length > 0 ? (
                    items.map((item) => (
                      <div key={item.id} className="flex gap-4 items-center">
                        <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-white" alt={item.name} />
                        <div className="flex-1">
                          <p className="font-bold text-xs">{item.name}</p>
                          <p className="text-white/60 text-xs">QTY: {item.qty} × ${Number(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40 italic">No items in cart</p>
                  )}
                </div>

                <div className="border-t border-white/20 pt-5 space-y-3">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Shipping</span>
                    <span className="text-white font-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Tax (8%)</span>
                    <span className="text-white font-bold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-extrabold text-[#e8a88a] pt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !user || items.length === 0}
                  className="w-full bg-[#e8a88a] text-white mt-6 py-4 rounded-xl font-extrabold hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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