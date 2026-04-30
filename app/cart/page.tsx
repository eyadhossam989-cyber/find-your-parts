"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load and sync cart
  useEffect(() => {
    const savedCart = localStorage.getItem("fyp-cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsLoaded(true);
  }, []);

  // Professional Update Logic (Handles + / - and syncs to storage)
  const updateQuantity = (id: string, delta: number) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("fyp-cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("fyp-cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage"));
  };

  // Calculate totals based on quantity
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);

  if (!isLoaded) return null;

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-8">
        <div className="text-center bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 max-w-lg">
          <div className="text-6xl mb-6">📦</div>
          <h2 className="text-4xl font-black text-[#101b2d] tracking-tight mb-4">Your Cart is Empty</h2>
          <p className="text-gray-500 font-medium mb-10">You haven't added any performance parts to your build yet.</p>
          <Link 
            href="/parts" 
            className="bg-[#101b2d] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#e8a88a] transition-all shadow-lg inline-block"
          >
            Explore Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-black text-[#101b2d] tracking-tighter">Your <span className="text-[#e8a88a]">Build</span></h1>
          <span className="bg-white px-6 py-2 rounded-full border border-gray-200 font-bold text-sm text-gray-500 shadow-sm">
            {cartItems.length} ITEMS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 group transition-all hover:shadow-md">
                <div className="w-28 h-28 bg-gray-50 rounded-2xl overflow-hidden p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>

                <div className="flex-1">
                  <p className="text-[#e8a88a] text-[10px] font-black uppercase tracking-widest mb-1">{item.category}</p>
                  <h3 className="text-xl font-black text-[#101b2d]">{item.name}</h3>
                  <button onClick={() => removeItem(item.id)} className="text-red-400 text-xs font-bold mt-2 hover:text-red-600 transition-colors">REMOVE PART</button>
                </div>

                {/* THE COUNTER: Professional +/- Control */}
                <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#e8a88a] font-bold"
                  >—</button>
                  <span className="w-8 text-center font-black text-[#101b2d]">{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#e8a88a] font-bold"
                  >+</button>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="text-2xl font-black text-[#101b2d]">${(item.price * (item.quantity || 1)).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-[#101b2d] p-10 rounded-[3rem] text-white shadow-2xl">
              <h2 className="text-2xl font-black mb-8">Summary</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between font-bold text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-400">
                  <span>Tax (Estimated)</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="h-[1px] bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-400 text-sm">TOTAL COST</span>
                  <span className="text-4xl font-black text-[#e8a88a] leading-none">${subtotal.toLocaleString()}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full bg-white text-[#101b2d] text-center py-5 rounded-2xl font-black text-lg hover:bg-[#e8a88a] hover:text-white transition-all active:scale-95 shadow-xl"
              >
                PROCEED TO CHECKOUT
              </Link>
              
              <Link href="/parts" className="block text-center mt-6 text-xs font-bold text-gray-500 hover:text-white transition-colors">
                ← ADD MORE PARTS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}