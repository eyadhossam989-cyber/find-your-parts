"use client"; // Required for buttons to work!
import { useState } from "react";
import Link from "next/link";

export default function CartPage() {
  // 1. We move your cartItems into 'state' so React can update the screen
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Carbon-Ceramic Brake Pad Kit",
      sku: "BP-992-G82-OEM",
      price: 449.00, // Changed to number for math
      qty: 1,
      image: "/images/brake-pad.jpg",
    },
    {
      id: 2,
      name: "Performance Synthetic Oil Filter",
      sku: "OF-M-FILTER-PRO",
      price: 24.95, // Changed to number for math
      qty: 2,
      image: "/images/oil-filter.jpg",
    },
  ]);

  const suggestions = [
    { name: "5W-30 Full Synthetic Motor Oil", price: "$58.00", tag: "Best Seller", image: "/images/motor-oil.jpg" },
    { name: "Iridium High-Performance Spark Plug", price: "$18.50", tag: "Performance", image: "/images/spark-plug.jpg" },
    { name: "All-Weather Heavy Duty Floor Mats", price: "$129.99", tag: "In Stock", image: "/images/floor-mat.jpg" },
    { name: "Activated Carbon Cabin Air Filter", price: "$34.20", tag: "Maintenance", image: "/images/cabin-filter.jpg" },
  ];

  // 2. Logic to change quantity
  const updateQty = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  // 3. Logic to remove item
  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  // 4. Automatic Math for the Summary
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1280px] mx-auto p-8">
        {/* Vehicle Banner */}
        <div className="bg-[#101b2d] text-white rounded-2xl p-5 mb-8 flex justify-between items-center shadow">
          <div>
            <p className="text-slate-300 text-sm">Current Vehicle</p>
            <h2 className="font-bold">2021 BMW M4 Competition</h2>
            <p className="text-slate-300 text-sm">G82 • Perfect fit enabled</p>
          </div>
          <Link href="/garage" className="border border-slate-600 px-5 py-2 rounded-lg font-bold">Change Vehicle</Link>
        </div>

        <h2 className="text-4xl font-extrabold mb-6">Shopping Cart ({items.length})</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {items.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl text-center shadow">
                <p className="text-xl font-bold">Your cart is empty</p>
                <Link href="/catalog" className="text-[#e8a88a] mt-2 block">Go find some parts →</Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow p-6 flex gap-6 items-center animate-in fade-in slide-in-from-bottom-2">
                  <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-xl bg-gray-100" />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-black">{item.name}</h3>
                        <p className="text-gray-600 text-sm">{item.sku}</p>
                      </div>
                      <p className="text-[#e8a88a] font-extrabold text-xl">${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-green-600 text-sm font-bold mt-3">● Perfect fit for your vehicle</p>
                    <div className="flex justify-between items-center mt-5">
                      <div className="bg-gray-100 rounded-lg flex items-center">
                        <button onClick={() => updateQty(item.id, -1)} className="px-4 py-2 font-bold hover:bg-gray-200 transition-colors">−</button>
                        <span className="px-4 font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-4 py-2 font-bold hover:bg-gray-200 transition-colors">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 font-semibold transition-colors">Remove</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
              <h3 className="text-2xl font-extrabold mb-6">Order Summary</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <b className="text-black">${subtotal.toFixed(2)}</b>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <b className="text-green-600">FREE</b>
                </div>
                <div className="flex justify-between">
                  <span>Taxes</span>
                  <b className="text-black">${tax.toFixed(2)}</b>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl">
                  <span className="font-extrabold">Total</span>
                  <span className="font-extrabold text-[#101b2d]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* THE GLOWING CHECKOUT BUTTON */}
              <Link
                href="/checkout"
                className={`w-full mt-6 py-4 rounded-xl font-extrabold text-lg block text-center transition-all duration-300
                  ${items.length > 0 
                    ? "bg-[#e8a88a] text-white shadow-[0_0_20px_rgba(232,168,138,0.4)] hover:shadow-[0_0_30px_rgba(232,168,138,0.6)] scale-[1.02]" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                Proceed to Checkout →
              </Link>
              
              <p className="text-center text-gray-500 text-sm mt-5">Secure payment • Fast delivery</p>
            </div>
          </aside>
        </div>
        
        {/* Suggestion Section remains the same for UI basics */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold mb-6">Customers also bought</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {suggestions.map((item) => (
              <div key={item.name} className="bg-white rounded-2xl shadow p-5">
                <img src={item.image} alt={item.name} className="h-44 w-full object-cover rounded-xl bg-gray-100 mb-4" />
                <span className="text-xs bg-[#101b2d] text-white px-3 py-1 rounded-full font-bold">{item.tag}</span>
                <h4 className="font-extrabold text-black mt-3">{item.name}</h4>
                <p className="text-[#e8a88a] font-extrabold mt-1">{item.price}</p>
                <button className="w-full mt-4 border rounded-lg py-2 font-bold hover:bg-gray-100 transition-all">Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
      </section>

      <footer className="bg-[#101b2d] text-white mt-10 py-10 text-center">
        <h3 className="text-[#e8a88a] font-extrabold text-xl">FYP</h3>
        <p className="text-slate-400 text-sm mt-2">© 2026 Find Your Parts. Professional Grade Components.</p>
      </footer>
    </main>
  );
}