"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  const defaultItems = [
    {
      id: "brake-1",
      name: "High-Performance Brake Pads",
      category: "Braking System",
      price: 299,
      quantity: 1,
      image: "/brake-pad.png" 
    },
    {
      id: "oil-1",
      name: "Synthetic Oil Filter",
      category: "Maintenance",
      price: 45,
      quantity: 1,
      image: "/oil-filter.png"
    }
  ];

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize and persist cart
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
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  if (!isLoaded) return null;

  // Professional Empty State
  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <span className="text-3xl opacity-20">🛒</span>
          </div>
          <h2 className="text-4xl font-black text-[#101b2d] tracking-tighter mb-4">Cart is clear.</h2>
          <p className="text-slate-400 text-sm font-medium mb-10 max-w-xs mx-auto uppercase tracking-widest leading-relaxed">
            Your build is currently empty. Ready for upgrades?
          </p>
          <Link 
            href="/parts" 
            className="bg-[#101b2d] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#e8a88a] transition-all shadow-xl active:scale-95"
          >
            Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-[10px] font-black text-[#e8a88a] uppercase tracking-[0.4em] mb-3 text-glow">Checkout Process</p>
          <h1 className="text-6xl font-black text-[#101b2d] tracking-tighter uppercase leading-[0.8]">
            Shopping <br /> <span className="text-slate-300">Cart.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Product List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 flex flex-col md:flex-row items-center gap-10 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500"
              >
                {/* Image Container */}
                <div className="w-44 h-44 bg-[#F1F5F9] rounded-[2rem] flex items-center justify-center p-6 relative overflow-hidden group-hover:bg-white transition-colors">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Check+Image+Path'; }}
                  />
                </div>

                {/* Details */}
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[9px] font-black text-[#e8a88a] uppercase tracking-[0.2em] mb-2 block">{item.category}</span>
                  <h3 className="text-2xl font-black text-[#101b2d] mb-4 tracking-tighter leading-tight">{item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[9px] font-bold text-slate-300 hover:text-red-500 uppercase tracking-widest transition-colors"
                  >
                    [ Remove Part ]
                  </button>
                </div>

                {/* Quantity Control */}
                <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#101b2d] font-black hover:text-[#e8a88a] shadow-sm transition-all active:scale-90"
                  >−</button>
                  <span className="w-10 text-center font-black text-[#101b2d] text-base">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-[#101b2d] font-black hover:text-[#e8a88a] shadow-sm transition-all active:scale-90"
                  >+</button>
                </div>

                {/* Price */}
                <div className="min-w-[140px] text-right">
                  <p className="text-3xl font-black text-[#101b2d] tracking-tighter">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-1 italic">${item.price} EA</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4 sticky top-32">
            <div className="bg-[#101b2d] text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e8a88a] opacity-10 blur-[80px]" />
              
              <h2 className="text-sm font-black mb-10 tracking-[0.3em] uppercase text-white/30 border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="text-white/40">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="text-white/40">Tax Est (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                  <span className="text-white/40">Logistics</span>
                  <span className="text-[#e8a88a]">Complimentary</span>
                </div>
                
                <div className="pt-8 border-t border-white/10">
                  <p className="text-[8px] font-black text-[#e8a88a] uppercase tracking-[0.4em] mb-2">Total Payable</p>
                  <p className="text-5xl font-black tracking-tighter leading-none">${grandTotal.toLocaleString()}</p>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full bg-[#e8a88a] text-[#101b2d] text-center py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-white hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-black/20"
              >
                Checkout Now
              </Link>
            </div>
            
            <p className="text-center mt-8 text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Secure 256-bit SSL Protection Active
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .text-glow {
          text-shadow: 0 0 15px rgba(232, 168, 138, 0.3);
        }
      `}</style>
    </main>
  );
}