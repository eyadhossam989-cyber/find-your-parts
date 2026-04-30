"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  // 1. Robust Data Loading
  useEffect(() => {
    const savedCart = localStorage.getItem("fyp-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart data corrupted, resetting...");
        setCartItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("fyp-cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("storage")); // Sync Navbar icon
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);

  // Prevent "flicker" before data is loaded
  if (!isLoaded) return null;

  // 2. THE EMPTY STATE (Fixed and Polished)
  if (cartItems.length === 0) {
    return (
      <main className="min-h-[85vh] flex flex-col items-center justify-center p-8 bg-[#f5f6f8]">
        <div className="relative group animate-in fade-in zoom-in duration-700">
          {/* Animated Background Glow */}
          <div className="absolute -inset-10 bg-[#e8a88a]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative text-center">
            <span className="text-[120px] leading-none inline-block animate-bounce">🛒</span>
            <h2 className="text-5xl font-black text-[#101b2d] tracking-tighter mt-4">Your Cart is Cold</h2>
            <p className="text-gray-500 font-bold mt-4 mb-10 max-w-sm mx-auto uppercase text-xs tracking-widest">
              No performance upgrades detected. Let's fix that.
            </p>
            
            <Link 
              href="/parts" 
              className="bg-[#101b2d] text-white px-12 py-5 rounded-2xl font-black shadow-2xl hover:bg-[#e8a88a] hover:scale-105 transition-all active:scale-95 flex items-center gap-3 mx-auto w-fit"
            >
              BROWSE CATALOG <span className="text-xl">→</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 3. THE ACTIVE CART
  return (
    <main className="min-h-screen bg-[#f5f6f8] pb-24">
      <section className="max-w-[1200px] mx-auto p-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-[#e8a88a] font-black uppercase tracking-widest text-xs mb-2">Review Build</p>
            <h1 className="text-6xl font-black text-[#101b2d] tracking-tighter">Shopping Cart</h1>
          </div>
          <p className="text-[#101b2d]/40 font-black text-xl">{cartItems.length} ITEMS</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Item List */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row items-center gap-8 animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-32 h-32 bg-[#f5f6f8] rounded-3xl overflow-hidden p-2">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-[#e8a88a] font-black text-[10px] tracking-[0.2em] uppercase mb-1">{item.category}</p>
                  <h3 className="text-2xl font-black text-[#101b2d] tracking-tight">{item.name}</h3>
                  <p className="text-gray-400 text-sm font-bold mt-1 italic">Ready for Installation</p>
                </div>

                <div className="text-right flex sm:flex-col items-center sm:items-end gap-6 sm:gap-2">
                  <p className="font-black text-3xl text-[#101b2d]">${item.price}</p>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 font-black uppercase text-[10px] tracking-widest bg-red-50 sm:bg-transparent px-4 py-2 sm:p-0 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-4">
            <div className="bg-[#101b2d] text-white p-10 rounded-[3rem] shadow-2xl sticky top-28 border border-white/5">
              <h3 className="text-2xl font-black mb-8 tracking-tighter">Order Summary</h3>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-white/50 font-bold text-sm">
                  <span>Subtotal</span>
                  <span className="text-white">${subtotal}</span>
                </div>
                
                <div className="flex justify-between text-white/50 font-bold text-sm">
                  <span>Shipping</span>
                  <span className="text-[#e8a88a]">Calculated Next</span>
                </div>

                <div className="pt-5 mt-5 border-t border-white/10 flex justify-between items-end">
                  <span className="text-white/50 font-bold">Total Payable</span>
                  <span className="text-4xl font-black text-white leading-none">${subtotal}</span>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full bg-[#e8a88a] text-[#101b2d] text-center py-6 rounded-2xl font-black text-lg hover:bg-white hover:scale-[1.02] transition-all shadow-xl active:scale-95"
              >
                PROCEED TO CHECKOUT
              </Link>
              
              <p className="text-[10px] text-white/30 text-center mt-6 font-bold uppercase tracking-widest leading-relaxed">
                Secure 256-Bit Encrypted <br /> Checkout
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}