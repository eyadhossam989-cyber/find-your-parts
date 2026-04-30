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
      image: "/brake-pad.png" // Exact name from image_2967d9.png
    },
    {
      id: "oil-1",
      name: "Synthetic Oil Filter",
      category: "Maintenance",
      price: 45,
      quantity: 1,
      image: "/oil-filter.png" // Exact name from image_2967d9.png
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

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-8">
        <h2 className="text-3xl font-black text-[#101b2d] mb-6 uppercase tracking-tighter">Your cart is empty.</h2>
        <Link href="/parts" className="bg-[#101b2d] text-white px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#e8a88a] transition-all">
          Go to Catalog
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-black text-[#101b2d] tracking-tighter uppercase leading-none">
            Shopping <span className="text-[#e8a88a]">Cart.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                {/* Image Container: Removed mix-blend and added border to check visibility */}
                <div className="w-40 h-40 bg-white rounded-2xl flex items-center justify-center p-2 border border-slate-50 relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="max-w-full max-h-full object-contain block" // "block" ensures it takes up space
                    key={item.id} // Forces re-render if ID changes
                  />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.category}</p>
                  <h3 className="text-xl font-black text-[#101b2d] mb-4 tracking-tight">{item.name}</h3>
                  <button onClick={() => removeItem(item.id)} className="text-[9px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest">
                    Remove
                  </button>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl">
                  <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm font-black">−</button>
                  <span className="w-8 text-center font-black text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white shadow-sm font-black">+</button>
                </div>

                <div className="min-w-[100px] text-right font-black text-xl text-[#101b2d]">
                  ${(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Professional Order Summary Side Panel */}
          <div className="lg:col-span-4">
            <div className="bg-[#101b2d] text-white p-10 rounded-[2.5rem] shadow-2xl">
              <h2 className="text-[10px] font-black mb-8 tracking-[0.2em] uppercase text-white/30 border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-10">
                <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest">
                  <span className="text-white/40">Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-widest">
                  <span className="text-white/40">Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="pt-6 mt-6 border-t border-white/10">
                  <p className="text-[8px] font-black text-[#e8a88a] uppercase tracking-[0.4em] mb-2">Grand Total</p>
                  <p className="text-4xl font-black tracking-tighter leading-none">${grandTotal.toLocaleString()}</p>
                </div>
              </div>

              <Link href="/checkout" className="block w-full bg-[#e8a88a] text-[#101b2d] text-center py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white transition-all">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}