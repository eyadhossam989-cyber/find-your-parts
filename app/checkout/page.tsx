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
  // 1. Logic to read the "Sticky Note" from the browser memory
  const [items, setItems] = useState<any[]>([]);
  const [shipping, setShipping] = useState(12.50);

  useEffect(() => {
    const savedCart = localStorage.getItem("fyp-cart");
    if (savedCart) {
      setItems(JSON.parse(savedCart));
    }
  }, []);

  // 2. Real Math based on the items actually in the cart
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax + shipping;

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1280px] mx-auto p-8">
        <div className="mb-8">
          <p className="text-[#e8a88a] font-bold uppercase tracking-wider text-sm">Secure Checkout</p>
          <h2 className="text-5xl font-extrabold text-[#101b2d]">Checkout</h2>
          <p className="text-gray-600 mt-2">Complete your purchase details below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {/* Shipping Address Section */}
            <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox><AddressIcon /></IconBox>
                <div>
                  <h3 className="text-2xl font-extrabold">Shipping Address</h3>
                  <p className="text-gray-500 text-sm">Where should we deliver your parts?</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input className="md:col-span-2 border rounded-xl p-4 focus:ring-2 focus:ring-[#e8a88a] outline-none" placeholder="Full Name" />
                <input className="md:col-span-2 border rounded-xl p-4 focus:ring-2 focus:ring-[#e8a88a] outline-none" placeholder="Street Address" />
                <input className="border rounded-xl p-4 focus:ring-2 focus:ring-[#e8a88a] outline-none" placeholder="City" />
                <input className="border rounded-xl p-4 focus:ring-2 focus:ring-[#e8a88a] outline-none" placeholder="State" />
                <input className="border rounded-xl p-4 focus:ring-2 focus:ring-[#e8a88a] outline-none" placeholder="ZIP Code" />
              </div>
            </section>

            {/* Delivery Method */}
            <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox><TruckIcon /></IconBox>
                <div>
                  <h3 className="text-2xl font-extrabold">Delivery Method</h3>
                  <p className="text-gray-500 text-sm">Choose how fast you want your order.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setShipping(12.50)}
                  className={`p-5 rounded-2xl flex justify-between items-center border-2 transition ${shipping === 12.50 ? 'border-[#101b2d] bg-[#101b2d]/5' : 'border-gray-100'}`}
                >
                  <div className="text-left">
                    <p className="font-extrabold">Standard Ground</p>
                    <p className="text-gray-600 text-sm">3–5 Business Days</p>
                  </div>
                  <b>$12.50</b>
                </button>
                <button 
                  onClick={() => setShipping(28.00)}
                  className={`p-5 rounded-2xl flex justify-between items-center border-2 transition ${shipping === 28.00 ? 'border-[#101b2d] bg-[#101b2d]/5' : 'border-gray-100'}`}
                >
                  <div className="text-left">
                    <p className="font-extrabold">Express Shipping</p>
                    <p className="text-gray-600 text-sm">1–2 Business Days</p>
                  </div>
                  <b>$28.00</b>
                </button>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox><PaymentIcon /></IconBox>
                <div>
                  <h3 className="text-2xl font-extrabold">Payment Method</h3>
                  <p className="text-gray-500 text-sm">Your payment is protected and encrypted.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="border-2 border-[#101b2d] rounded-xl py-3 font-bold bg-[#101b2d]/5">💳 Credit Card</button>
                <button className="border rounded-xl py-3 font-bold hover:border-[#e8a88a] transition">PayPal</button>
              </div>
              <input className="w-full border rounded-xl p-4 mb-4 outline-none focus:ring-2 focus:ring-[#e8a88a]" placeholder="Card Number" />
              <div className="grid grid-cols-2 gap-4">
                <input className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]" placeholder="MM/YY" />
                <input className="border rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a]" placeholder="CVC" />
              </div>
            </section>
          </div>

          {/* SIDEBAR SUMMARY */}
          <aside className="lg:col-span-4">
            <div className="bg-[#101b2d] text-white rounded-3xl shadow-xl p-8 sticky top-24">
              <h3 className="text-2xl font-extrabold border-b border-white/20 pb-5 mb-5">Order Summary</h3>
              
              <div className="space-y-5 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 ? (
                  <p className="text-white/50 italic">Your cart is empty</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <img src={item.image} className="w-16 h-16 rounded-xl object-cover bg-white" alt={item.name} />
                      <div className="flex-1">
                        <p className="font-bold text-sm leading-tight">{item.name}</p>
                        <p className="text-white/60 text-xs mt-1">QTY: {item.qty}</p>
                        <p className="font-bold text-[#e8a88a]">${(item.price * item.qty).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-white/20 pt-5 space-y-3">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span className="text-white">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-[#e8a88a] pt-4">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-[#e8a88a] text-white mt-6 py-4 rounded-xl font-extrabold hover:scale-[1.02] transition-all shadow-lg active:scale-[0.98]">
                Place Order →
              </button>

              <div className="flex justify-center items-center gap-2 text-white/50 text-sm mt-5">
                <ShieldIcon />
                <span>Secure Checkout Guarantee</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="bg-[#101b2d] text-white mt-10 py-10 text-center">
        <h3 className="text-[#e8a88a] font-extrabold text-xl">FYP</h3>
        <p className="text-slate-400 text-sm mt-2">© 2026 Find Your Parts. Professional Grade Components.</p>
      </footer>
    </main>
  );
}