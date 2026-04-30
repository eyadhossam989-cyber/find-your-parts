"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  const defaultItems = [
    {
      id: "p1",
      name: "High-Performance Brake Pads",
      category: "Braking System",
      price: 299,
      quantity: 1,
      image: "/images/brake-pad.jpg" 
    },
    {
      id: "p2",
      name: "Synthetic Oil Filter",
      category: "Maintenance",
      price: 45,
      quantity: 1,
      image: "/images/oil-filter.jpg"
    }
  ];

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% Tax for realism
  const grandTotal = subtotal + tax;

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div>
            <nav className="flex gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#e8a88a] mb-4">
              <Link href="/parts" className="hover:underline">Catalog</Link>
              <span>/</span>
              <span className="text-gray-400">Your Build</span>
            </nav>
            <h1 className="text-6xl font-black text-[#101b2d] tracking-tighter leading-none">
              Shopping <span className="text-[#e8a88a]">Cart.</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cart Status</p>
              <p className="font-black text-[#101b2d]">{cartItems.length} Parts Selected</p>
            </div>
            <div className="h-12 w-[1px] bg-gray-200 hidden md:block" />
            <button 
              onClick={() => { setCartItems([]); localStorage.removeItem("fyp-cart"); window.dispatchEvent(new Event("storage")); }}
              className="text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Items List */}
          <div className="lg:col-span-8 space-y-1">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-white border-b border-gray-100 last:border-0 p-8 flex flex-col md:flex-row items-center gap-10 hover:bg-white/50 transition-all duration-500"
              >
                {/* Product Image with Hover Zoom */}
                <div className="w-40 h-40 bg-[#F1F5F9] rounded-[2rem] flex items-center justify-center p-4 relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-black text-[#101b2d] mb-2 tracking-tight">{item.name}</h3>
                  <p className="text-gray-400 text-sm font-medium mb-6">SKU: FYP-M4-{item.id.toUpperCase()}</p>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[10px] font-black text-gray-300 hover:text-red-500 uppercase tracking-[0.2em] transition-colors"
                  >
                    [ Remove ]
                  </button>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-2xl p-1 border border-gray-100">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-[#101b2d] font-bold text-lg transition-all"
                  >−</button>
                  <span className="w-10 text-center font-black text-[#101b2d] text-lg">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white hover:shadow-sm text-[#101b2d] font-bold text-lg transition-all"
                  >+</button>
                </div>

                {/* Price Display */}
                <div className="min-w-[140px] text-right">
                  <p className="text-sm font-bold text-gray-400 mb-1">${item.price} / unit</p>
                  <p className="text-3xl font-black text-[#101b2d] tracking-tighter">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary Panel */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-[#101b2d] rounded-[3rem] p-12 text-white shadow-[0_30px_60px_-15px_rgba(16,27,45,0.3)] relative overflow-hidden">
              {/* Subtle Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8a88a] opacity-10 blur-[80px]" />
              
              <h2 className="text-3xl font-black mb-10 tracking-tight">Order <br/>Summary</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Subtotal</span>
                  <span className="font-black text-xl">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Sales Tax (8%)</span>
                  <span className="font-black text-xl">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/40 font-bold uppercase tracking-widest">Shipping</span>
                  <span className="text-[#e8a88a] font-black uppercase tracking-widest">Complimentary</span>
                </div>
                
                <div className="pt-8 mt-8 border-t border-white/10">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black text-[#e8a88a] uppercase tracking-[0.3em] mb-1 text-glow-orange">Grand Total</p>
                      <p className="text-5xl font-black tracking-tighter">${grandTotal.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full bg-[#e8a88a] text-[#101b2d] text-center py-6 rounded-[1.5rem] font-black text-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-[#e8a88a]/20 uppercase tracking-tighter"
              >
                Begin Checkout
              </Link>
              
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Secure Server Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-glow-orange {
          text-shadow: 0 0 10px rgba(232, 168, 138, 0.4);
        }
      `}</style>
    </main>
  );
}