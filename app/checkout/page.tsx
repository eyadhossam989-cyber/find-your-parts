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
const CashIcon = () => <span className="text-2xl">💵</span>;

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
  const tax = subtotal * 0.1; // 10% tax
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

      if (!fullName || !address || !city || !state || !zipCode || !phone) {
        setError("Please fill in all required fields");
        setLoading(false);
        return;
      }

      console.log("📋 Placing order with:");
      console.log("User ID:", user.id);
      console.log("Items:", items);
      console.log("Payment Method:", paymentMethod);
      console.log("Totals:", { subtotal, shipping, tax, total });

      // Transform items to match checkoutService format
      const cartItems = items.map((item) => ({
        name: item.name,
        quantity: item.qty,
        price: Number(item.price),
      }));

      // Create order in Supabase
      const result = await createOrder(
        user.id,
        cartItems,
        {
          shipping_name: fullName,
          shipping_address: address,
          shipping_city: city,
          shipping_state: state,
          shipping_zip: zipCode,
          shipping_phone: phone,
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
        }
      );

      if (!result || !result.orderId) {
        setError("Failed to create order");
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
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-8 animate-in fade-in">
            <p className="font-bold">❌ Error</p>
            <p>{error}</p>
          </div>
        )}

        {!user && (
          <div className="bg-yellow-100 border-2 border-yellow-400 text-yellow-700 px-6 py-4 rounded-2xl mb-8 animate-in fade-in">
            <p className="font-bold">⚠️ Please Log In</p>
            <p>You must be logged in to checkout.</p>
            <Link href="/login" className="underline font-bold mt-2 block hover:opacity-80 transition">
              Go to Login
            </Link>
          </div>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              {/* Shipping Address Section */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-6">
                  <IconBox><AddressIcon /></IconBox>
                  <h3 className="text-2xl font-extrabold">Shipping Address</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    className="md:col-span-2 border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                    placeholder="Full Name *"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="md:col-span-2 border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                    placeholder="Street Address *"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                    placeholder="City *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                    placeholder="State *"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                    placeholder="ZIP Code *"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                    placeholder="Phone Number *"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </section>

              {/* Delivery Method Section */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-6">
                  <IconBox><TruckIcon /></IconBox>
                  <h3 className="text-2xl font-extrabold">Delivery Method</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleDeliveryChange("standard")}
                    className={`p-6 rounded-2xl flex justify-between items-center border-2 transition transform hover:scale-105 ${
                      deliveryMethod === "standard"
                        ? "border-[#101b2d] bg-[#101b2d]/5 shadow-md"
                        : "border-gray-200 hover:border-[#e8a88a]"
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-bold text-lg">Standard</p>
                      <p className="text-sm text-gray-600">5-7 business days</p>
                    </div>
                    <b className="text-[#e8a88a]">$12.50</b>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeliveryChange("express")}
                    className={`p-6 rounded-2xl flex justify-between items-center border-2 transition transform hover:scale-105 ${
                      deliveryMethod === "express"
                        ? "border-[#101b2d] bg-[#101b2d]/5 shadow-md"
                        : "border-gray-200 hover:border-[#e8a88a]"
                    }`}
                  >
                    <div className="text-left">
                      <p className="font-bold text-lg">Express</p>
                      <p className="text-sm text-gray-600">2-3 business days</p>
                    </div>
                    <b className="text-[#e8a88a]">$28.00</b>
                  </button>
                </div>
              </section>

              {/* Payment Method Section */}
              <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 hover:shadow-md transition">
                <div className="flex items-center gap-4 mb-6">
                  <IconBox><PaymentIcon /></IconBox>
                  <h3 className="text-2xl font-extrabold">Payment Method</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Cash on Delivery */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash_on_delivery")}
                    className={`p-5 rounded-2xl flex items-center gap-3 border-2 font-bold transition transform hover:scale-105 ${
                      paymentMethod === "cash_on_delivery"
                        ? "border-[#101b2d] bg-[#101b2d]/5 shadow-md"
                        : "border-gray-200 hover:border-[#e8a88a]"
                    }`}
                  >
                    <CashIcon />
                    <div className="text-left">
                      <p>Cash on Delivery</p>
                      <p className="text-xs text-gray-600 font-normal">Pay on arrival</p>
                    </div>
                  </button>

                  {/* Credit Card */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`p-5 rounded-2xl flex items-center gap-3 border-2 font-bold transition transform hover:scale-105 ${
                      paymentMethod === "card"
                        ? "border-[#101b2d] bg-[#101b2d]/5 shadow-md"
                        : "border-gray-200 hover:border-[#e8a88a]"
                    }`}
                  >
                    <span className="text-2xl">💳</span>
                    <div className="text-left">
                      <p>Credit Card</p>
                      <p className="text-xs text-gray-600 font-normal">Secure payment</p>
                    </div>
                  </button>
                </div>

                {/* Payment Details */}
                {paymentMethod === "cash_on_delivery" && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 animate-in fade-in">
                    <p className="text-blue-900 font-semibold">
                      💵 Pay in cash when your order arrives. Your order will be marked as "Pending Payment" until payment is received.
                    </p>
                  </div>
                )}

                {paymentMethod === "card" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <input
                      type="text"
                      className="w-full border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                      placeholder="Card Number"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                        placeholder="MM/YY"
                      />
                      <input
                        type="text"
                        className="border-2 border-gray-200 rounded-xl p-4 outline-none focus:border-[#e8a88a] focus:ring-2 focus:ring-[#e8a88a]/20 transition"
                        placeholder="CVC"
                      />
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="lg:col-span-4">
              <div className="bg-[#101b2d] text-white rounded-3xl shadow-xl p-8 sticky top-24 transition-all hover:shadow-2xl">
                <h3 className="text-2xl font-extrabold border-b border-white/20 pb-5 mb-5">Order Summary</h3>

                {/* Items List */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.length > 0 ? (
                    items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-center bg-white/5 p-3 rounded-xl hover:bg-white/10 transition">
                        <img
                          src={item.image}
                          className="w-14 h-14 rounded-lg object-cover bg-white/10"
                          alt={item.name}
                        />
                        <div className="flex-1">
                          <p className="font-bold text-sm truncate">{item.name}</p>
                          <p className="text-white/60 text-xs">
                            {item.qty} × ${Number(item.price).toFixed(2)}
                          </p>
                          <p className="text-[#e8a88a] font-bold text-xs mt-1">
                            ${(item.qty * Number(item.price)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-white/40 italic text-center py-8">No items in cart</p>
                  )}
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-white/20 pt-5 space-y-3 mb-6">
                  <div className="flex justify-between text-white/70">
                    <span className="text-sm">Subtotal</span>
                    <span className="text-white font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-sm">Shipping</span>
                    <span className="text-white font-bold">${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span className="text-sm">Tax (10%)</span>
                    <span className="text-white font-bold">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-extrabold text-[#e8a88a] pt-4 border-t border-white/20">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Method Badge */}
                <div className="mb-4 bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-white/60 text-xs mb-1">Payment Method</p>
                  <p className="text-[#e8a88a] font-bold">
                    {paymentMethod === "cash_on_delivery" ? "💵 Cash on Delivery" : "💳 Credit Card"}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !user || items.length === 0}
                  className="w-full bg-[#e8a88a] text-[#101b2d] py-4 rounded-xl font-extrabold hover:bg-[#f5b99a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 transform active:scale-95"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#101b2d]/20 border-t-[#101b2d] rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Place Order →"
                  )}
                </button>

                <p className="text-white/40 text-xs text-center mt-4">
                  🔒 Your payment is secure and encrypted
                </p>
              </div>
            </aside>
          </div>
        </form>
      </section>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(232, 168, 138, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(232, 168, 138, 0.6);
        }
      `}</style>
    </main>
  );
}