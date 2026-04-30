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
      image: "/brake-pad.png" // Updated to .png based on your uploads
    },
    {
      id: "p2",
      name: "Synthetic Oil Filter",
      category: "Maintenance",
      price: 45,
      quantity: 1,
      image: "/oil-filter.png" // Updated to .png
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
  const tax = subtotal * 0.08; 
  const grandTotal = subtotal + tax;

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <nav className="flex gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-[#e8a88a] mb-4">
            <Link href="/parts" className="hover:underline">Catalog</Link>
            <span>/</span>
            <span className="text-gray-400">Your Build</span>
          </nav>
          <h1 className="text-5xl font-black text-[#101b2d] tracking-tighter leading-none">
            Shopping <span className="text-[#e8a88a]">Cart.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-2">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="group bg-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-10 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 border border-transparent hover:border-slate-100"
              >
                <div className="w-40 h-40 bg-[#F1F5F9] rounded-3xl flex items-center justify-center p-4 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-700" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/200?text=Check+Extension'; }}
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <span className="inline-block px-3 py-1 bg-slate-100 rounded-full text-[8px] font-black uppercase tracking-widest text-slate-500 mb-3">
                    {item.category}
                  </span>
                  <h3 className="text-xl font-black text-[#101b2d] mb-1 tracking-tight">{item.name}</h3>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-[9px] font-bold text-red-400 hover:text-red-600 uppercase tracking-[0.2em] transition-colors"
                  >
                    Remove Item
                  </button>
                </div>

                <div className="flex items-center gap-1 bg-slate-50 rounded-xl p-1 border border-slate-100">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-[#101b2d] font-bold transition-all">−</button>
                  <span className="w-8 text-center font-black text-[#101b2d] text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white text-[#101b2d] font-bold transition-all">+</button>
                </div>

                <div className="min-w-[120px] text-right">
                  <p className="text-2xl font-black text-[#101b2d] tracking-tighter">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="pt-8">
              <Link href="/parts" className="text-[10px] font-black text-slate-400 hover:text-[#e8a88a] uppercase tracking-[0.2em] transition-colors">
                ← Back to Catalog
              </Link>
            </div>
          </div>

          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-[#101b2d] rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <h2 className="text-[9px] font-black mb-10 tracking-[0.3em] uppercase text-white/20">Order Summary</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-white/40 font-bold uppercase tracking-[0.1em] text-[8px]">Subtotal</span>
                  <span className="font-bold text-[10px] tracking-tight">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/40 font-bold uppercase tracking-[0.1em] text-[8px]">Tax (8%)</span>
                  <span className="font-bold text-[10px] tracking-tight">${tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-8 mt-8 border-t border-white/10">
                  <p className="text-[8px] font-black text-[#e8a88a] uppercase tracking-[0.2em] mb-2">Grand Total</p>
                  <p className="text-4xl font-black tracking-tighter leading-none">${grandTotal.toLocaleString()}</p>
                </div>
              </div>

              <Link 
                href="/checkout"
                className="block w-full bg-[#e8a88a] text-[#101b2d] text-center py-5 rounded-2xl font-black text-xs hover:bg-white transition-all duration-300 shadow-xl uppercase tracking-[0.2em]"
              >
                Checkout Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}