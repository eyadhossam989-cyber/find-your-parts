"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const defaultItems = [
    {
      id: "p1",
      name: "High-Performance Brake Pads",
      price: 299,
      quantity: 1,
      image: "/brake-pad.png" 
    },
    {
      id: "p2",
      name: "Synthetic Oil Filter",
      price: 45,
      quantity: 1,
      image: "/oil-filter.png"
    }
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem("fyp-cart");
    try {
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        // Ensure parsed data has numeric values to prevent NaN
        const validated = parsed.map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1
        }));
        setCartItems(validated.length > 0 ? validated : defaultItems);
      } else {
        setCartItems(defaultItems);
      }
    } catch (error) {
      setCartItems(defaultItems);
    }
    setIsLoaded(true);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, (Number(item.quantity) || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("fyp-cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("fyp-cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  // Math Fix: Reduce function with initial value of 0 to prevent NaN
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 0;
    return acc + (itemPrice * itemQty);
  }, 0);
  
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-[#F3F4F6] p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-black mb-10 text-slate-900 tracking-tighter">
          Shopping Cart ({cartItems.length})
        </h1>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left Column: Parts List */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-[2rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm border border-slate-100">
                
                {/* Fail-Safe Image Container */}
                <div className="w-40 h-40 bg-slate-50 rounded-3xl flex items-center justify-center p-4 border border-slate-100 overflow-hidden shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-contain"
                    // If image fails, use a clean UI Avatar placeholder
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=f1f5f9&color=64748b&size=200&bold=true`;
                    }}
                  />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{item.name}</h3>
                      <p className="text-emerald-500 text-xs font-black uppercase tracking-widest mt-1">
                        • Perfect fit for your vehicle
                      </p>
                    </div>
                    <span className="text-2xl font-black text-slate-900 tracking-tighter">
                      ${(Number(item.price) * (Number(item.quantity) || 1)).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-8">
                    {/* Counter UI */}
                    <div className="flex items-center bg-slate-100 rounded-2xl p-1.5 border border-slate-200">
                      <button onClick={() => updateQuantity(item.id, -1)} className="w-10 h-10 flex items-center justify-center font-black text-slate-500 hover:bg-white rounded-xl transition-all">−</button>
                      <span className="w-12 text-center font-black text-slate-900">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="w-10 h-10 flex items-center justify-center font-black text-slate-500 hover:bg-white rounded-xl transition-all">+</button>
                    </div>
                    
                    <button onClick={() => removeItem(item.id)} className="text-slate-300 font-bold hover:text-red-500 uppercase text-[10px] tracking-[0.2em] transition-colors">
                      Remove Part
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 sticky top-10">
              <h2 className="text-xl font-black mb-10 text-slate-900 tracking-tight border-b border-slate-50 pb-6">
                Order Summary ({cartItems.length})
              </h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex justify-between text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-500 font-black italic">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                  <span>Tax (8%)</span>
                  <span className="text-slate-900">${tax.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-8 mb-10">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Total Amount</span>
                  <span className="text-4xl font-black text-slate-900 tracking-tighter">
                    ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </span>
                </div>
              </div>

              <Link href="/checkout" className="group block w-full bg-[#E8A88A] text-white text-center py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-slate-900 transition-all duration-500 shadow-xl shadow-orange-100 active:scale-[0.98]">
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}