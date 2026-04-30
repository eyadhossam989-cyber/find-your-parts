"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="w-11 h-11 rounded-xl bg-[#e8a88a]/15 text-[#e8a88a] flex items-center justify-center">
    {children}
  </div>
);

const TruckIcon = () => <span className="text-2xl">🚚</span>;
const AddressIcon = () => <span className="text-2xl">📍</span>;
const PaymentIcon = () => <span className="text-2xl">💳</span>;
const ShieldIcon = () => <span className="text-2xl">🛡️</span>;

export default function CheckoutPage() {
  const [items, setItems] = useState<any[]>([]);
  const [shipping, setShipping] = useState(12.50);
  const [paymentMethod, setPaymentMethod] = useState("card"); // Track payment type

  // Load data from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("fyp-cart");
    if (savedCart) {
      const parsedItems = JSON.parse(savedCart);
      setItems(parsedItems);
    }
  }, []);

  // Real-time Math Logic
  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shipping;

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1280px] mx-auto p-8">
        <div className="mb-8">
          <p className="text-[#e8a88a] font-bold uppercase tracking-wider text-sm">Secure Checkout</p>
          <h2 className="text-5xl font-extrabold text-[#101b2d]">Checkout</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            
            {/* Shipping Address */}
            <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox><AddressIcon /></IconBox>
                <h3 className="text-2xl font-extrabold">Shipping Address</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input className="md:col-span-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]" placeholder="Full Name" />
                <input className="md:col-span-2 border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]" placeholder="Street Address" />
                <input className="border rounded-xl p-4 outline-none" placeholder="City" />
                <input className="border rounded-xl p-4 outline-none" placeholder="State" />
                <input className="border rounded-xl p-4 outline-none" placeholder="ZIP Code" />
              </div>
            </section>

            {/* Delivery Method (Logic Unchanged as requested) */}
            <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox><TruckIcon /></IconBox>
                <h3 className="text-2xl font-extrabold">Delivery Method</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setShipping(12.50)} className={`p-5 rounded-2xl flex justify-between border-2 ${shipping === 12.50 ? 'border-[#101b2d] bg-[#101b2d]/5' : 'border-gray-100'}`}>
                  <div className="text-left"><p className="font-bold">Standard</p></div>
                  <b>$12.50</b>
                </button>
                <button onClick={() => setShipping(28.00)} className={`p-5 rounded-2xl flex justify-between border-2 ${shipping === 28.00 ? 'border-[#101b2d] bg-[#101b2d]/5' : 'border-gray-100'}`}>
                  <div className="text-left"><p className="font-bold">Express</p></div>
                  <b>$28.00</b>
                </button>
              </div>
            </section>

            {/* Payment Method - Now with PayPal Toggle */}
            <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox><PaymentIcon /></IconBox>
                <h3 className="text-2xl font-extrabold">Payment Method</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button 
                  onClick={() => setPaymentMethod("card")}
                  className={`rounded-xl py-3 font-bold border-2 transition ${paymentMethod === 'card' ? 'border-[#101b2d] bg-[#101b2d]/5' : 'border-gray-100'}`}
                >
                  💳 Credit Card
                </button>
                <button 
                  onClick={() => setPaymentMethod("paypal")}
                  className={`rounded-xl py-3 font-bold border-2 transition ${paymentMethod === 'paypal' ? 'border-[#101b2d] bg-[#101b2d]/5' : 'border-gray-100'}`}
                >
                  PayPal
                </button>
              </div>

              {paymentMethod === "card" ? (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <input className="w-full border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]" placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-4">
                    <input className="border rounded-xl p-4 outline-none" placeholder="MM/YY" />
                    <input className="border rounded-xl p-4 outline-none" placeholder="CVC" />
                  </div>
                </div>
              ) : (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="text-sm font-bold text-gray-600 ml-1">PayPal Email or Username</label>
                  <input className="w-full border-2 border-[#101b2d] rounded-xl p-4 mt-2 outline-none" placeholder="example@paypal.com" />
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR SUMMARY - Fixed $0 Issue */}
          <aside className="lg:col-span-4">
            <div className="bg-[#101b2d] text-white rounded-3xl shadow-xl p-8 sticky top-24">
              <h3 className="text-2xl font-extrabold border-b border-white/20 pb-5 mb-5">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[250px] overflow-y-auto pr-2">
                {items.length > 0 ? items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <img src={item.image} className="w-12 h-12 rounded-lg object-cover bg-white" alt={item.name} />
                    <div className="flex-1">
                      <p className="font-bold text-xs">{item.name}</p>
                      <p className="text-white/60 text-xs">QTY: {item.qty} × ${Number(item.price).toFixed(2)}</p>
                    </div>
                  </div>
                )) : <p className="text-white/40 italic">No items found</p>}
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

              <Link href="/orders" className="w-full bg-[#e8a88a] text-white mt-6 py-4 rounded-xl font-extrabold hover:scale-[1.02] transition-all block text-center shadow-lg">
                Place Order →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}