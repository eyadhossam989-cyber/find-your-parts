"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  // Hardcoded initial items to ensure the page is never "dead" on refresh
  const defaultItems = [
    {
      id: "p1",
      name: "High-Performance Brake Pads",
      category: "Braking System",
      price: 299,
      quantity: 1,
      image: "/images/brake-pads.webp" // Ensure these paths match your public folder
    },
    {
      id: "p2",
      name: "Synthetic Oil Filter",
      category: "Maintenance",
      price: 45,
      quantity: 1,
      image: "/images/oil-filter.webp"
    }
  ];

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart but force the default 2 items if empty
  useEffect(() => {
    const savedCart = localStorage.getItem("fyp-cart");
    if (savedCart && JSON.parse(savedCart).length > 0) {
      setCartItems(JSON.parse(savedCart));
    } else {
      setCartItems(defaultItems);
      localStorage.setItem("fyp-cart", JSON.stringify(defaultItems));
    }
    setIsLoaded(true);
  }, []);

  // Update Quantity & Sync Math
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

  // Live Math Calculation
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-[#f8fafc] py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-5xl font-black text-[#101b2d] tracking-tighter">
            Your <span className="text-[#e8a88a]">Build</span>
          </h1>
          <div className="flex items-center gap-4">
             <span className="bg-white px-6 py-2 rounded-full border border-gray-200 font-bold text-sm text-gray-500 shadow-sm">
              {cartItems.length} {cartItems.length === 1 ? 'PART' : 'PARTS'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 transition-all hover:shadow-md group">
                <div className="w-28 h-28 bg-gray-50 rounded-2xl overflow-hidden p-2 flex items-center justify-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" 
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <p className="text-[#e8a88a] text-[10px] font-black uppercase tracking-widest mb-1">{item.category}</p>
                  <h3 className="text-xl font-black text-[#101b2d] leading-tight">{item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="text-red-400 text-[10px] font-black mt-3 hover:text-red-600 tracking-widest transition-colors uppercase"
                  >
                    Remove Part
                  </button>
                </div>

                {/* THE COUNTER: Professional Controls */}
                <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#e8a88a] font-black text-lg transition-all active:scale-90"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-black text-[#101b2d]">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:text-[#e8a88a] font-black text-lg transition-all active:scale-90"
                  >
                    +
                  </button>
                </div>

                <div className="text-right min-w-[120px]">
                  <p className="text-2xl font-black text-[#101b2d]">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            <Link 
              href="/parts" 
              className="inline-flex items-center gap-2 text-sm font-black text-[#101b2d]/50 hover:text-[#e8a88a] transition-colors mt-4 uppercase tracking-widest"
            >
              ← Back to Catalog
            </Link>
          </div>

          {/* Checkout Panel */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-[#101b2d] p-10 rounded-[3rem] text-white shadow-2xl border border-white/5">
              <h2 className="text-2xl font-black mb-8 tracking-tight">Order Summary</h2>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between font-bold text-gray-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-gray-400 text-sm">
                  <span>Shipping</span>
                  <span className="text-[#e8a88a]">Calculated at Checkout</span>
                </div>
                <div className="h-[1px] bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <span className="font-bold text-gray-400 text-xs uppercase tracking-widest">Grand Total</span>
                  <span className="text-4xl font-black text-[#e8a88a] leading-none tracking-tighter">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full bg-[#e8a88a] text-[#101b2d] text-center py-5 rounded-2xl font-black text-lg hover:bg-white transition-all active:scale-95 shadow-xl uppercase tracking-tighter"
              >
                Proceed to Checkout
              </Link>
              
              <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Secure Encryption Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}