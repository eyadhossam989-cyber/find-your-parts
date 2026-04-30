"use client";
import { useState, useEffect } from "react";

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Get data from storage
    const saved = localStorage.getItem("fyp-cart");
    
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        
        // 2. FORCE VALIDATION: This stops the NaN error
        // It ensures price and quantity are real numbers before the page renders
        const validatedData = parsed.map((item: any) => ({
          ...item,
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1,
          // If image is missing, we set a temporary string to trigger the fail-safe
          image: item.image || "/placeholder.png" 
        }));
        
        setCartItems(validatedData);
      } catch (err) {
        console.error("Data Sync Error:", err);
      }
    }
    setIsLoaded(true);
  }, []);

  // 3. MATH SAFETY: Calculation with fallback to 0
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 12.50;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-6 md:p-16 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        
        {/* Left Side: Form Fields */}
        <div className="space-y-6">
          <h1 className="text-4xl font-black text-[#101b2d] uppercase tracking-tighter">Checkout</h1>
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-4">Shipping Information</label>
              <div className="space-y-3">
                <input placeholder="Full Name" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#e8a88a]/20" />
                <input placeholder="Address Line" className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#e8a88a]/20" />
              </div>
            </div>
            <button className="w-full bg-[#101b2d] text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-[#e8a88a] transition-all shadow-xl shadow-slate-200">
              Confirm & Pay
            </button>
          </div>
        </div>

        {/* Right Side: Order Summary (The part from your screenshot) */}
        <div className="bg-[#0b1221] text-white p-10 rounded-[3rem] shadow-2xl h-fit">
          <h2 className="text-[10px] font-black mb-10 tracking-[0.4em] uppercase text-white/20 border-b border-white/5 pb-5">Order Summary</h2>
          
          <div className="space-y-6 mb-12">
            {cartItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-5">
                {/* Image Fail-Safe */}
                <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center p-3 border border-white/10 shrink-0">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="max-w-full max-h-full object-contain"
                    // If the file "/brake-pad.png" isn't found, this loads a clean UI icon
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=1e293b&color=ffffff&size=128&bold=true`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-white leading-tight uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[10px] font-bold text-white/30 mt-1 uppercase tracking-widest">
                    QTY: {item.quantity} <span className="mx-2">×</span> ${item.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Logic */}
          <div className="space-y-4 pt-8 border-t border-white/5">
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <span>Subtotal</span>
              <span className="text-white">${subtotal.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <span>Shipping Charge</span>
              <span className="text-white">${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              <span>Tax Estimation (8%)</span>
              <span className="text-white">${tax.toFixed(2)}</span>
            </div>
            
            <div className="pt-8 mt-4 border-t border-white/5 flex justify-between items-end">
              <div>
                <p className="text-[8px] font-black text-[#e8a88a] uppercase tracking-[0.5em] mb-2">Total Amount</p>
                <p className="text-5xl font-black tracking-tighter leading-none">${total.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}