"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Initialize Cart & Sync with Navbar
  useEffect(() => {
    const savedCart = localStorage.getItem("fyp-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("fyp-cart", JSON.stringify(updatedCart));
    // This makes the Navbar counter update instantly
    window.dispatchEvent(new Event("storage"));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  if (!isLoaded) return null;

  // 2. The "Back to Basics" Empty State
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-[#101b2d] mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any upgrades yet.</p>
          <Link 
            href="/parts" 
            className="bg-[#e8a88a] text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:bg-[#d4977d] transition-all"
          >
            Browse Parts
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1200px] mx-auto p-8">
        <div className="mb-10">
          <p className="text-[#e8a88a] font-bold">Review Your Order</p>
          <h2 className="text-5xl font-extrabold text-[#101b2d]">Shopping Cart</h2>
          {/* THE COUNTER: Works dynamically now */}
          <p className="text-gray-500 mt-2 font-bold uppercase tracking-tight">
            Currently holding {cartItems.length} {cartItems.length === 1 ? 'part' : 'parts'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Side: Items */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm flex items-center gap-6 border border-gray-100">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-24 h-24 object-cover rounded-2xl bg-gray-50" 
                />
                <div className="flex-1">
                  <h3 className="text-xl font-extrabold">{item.name}</h3>
                  <p className="text-gray-500 text-sm font-bold uppercase">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold mb-2">${item.price}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 font-bold hover:underline text-sm"
                  >
                    Remove Item
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Side: Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#101b2d] text-white p-8 rounded-3xl shadow-xl">
              <h3 className="text-2xl font-extrabold mb-6">Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="font-bold">${subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Shipping</span>
                  <span className="text-[#e8a88a] font-bold italic text-sm">FREE for M-Series</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4" />
                <div className="flex justify-between text-2xl font-extrabold">
                  <span>Total</span>
                  <span>${subtotal}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full bg-[#e8a88a] text-white text-center py-4 rounded-xl font-extrabold text-lg shadow-lg hover:brightness-110 transition-all active:scale-95"
              >
                Checkout Now
              </Link>
              
              <Link 
                href="/parts"
                className="block w-full text-center mt-4 text-gray-400 font-bold text-sm hover:text-white transition-colors"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}