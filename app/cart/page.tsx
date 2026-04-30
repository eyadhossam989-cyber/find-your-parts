"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CartPage() {
  // 1. Initial State - Using numbers for price so math works
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Carbon-Ceramic Brake Pad Kit",
      sku: "BP-992-G82-OEM",
      price: 449.00,
      qty: 1,
      image: "/images/brake-pads.jpg",
    },
    {
      id: 2,
      name: "Performance Synthetic Oil Filter",
      sku: "OF-M-FILTER-PRO",
      price: 24.95,
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

  // 2. THE FIX: Save to memory whenever items change
  useEffect(() => {
    localStorage.setItem("fyp-cart", JSON.stringify(items));
  }, [items]);

  // 3. Logic Functions
  const updateQty = (id: number, delta: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1280px] mx-auto p-8">
        
        {/* Banner Mannerism */}
        <div className="bg-[#101b2d] text-white rounded-2xl p-5 mb-8 flex justify-between items-center shadow">
          <div>
            <p className="text-slate-300 text-sm">Current Vehicle</p>
            <h2 className="font-bold">2021 BMW M4 Competition</h2>
            <p className="text-slate-300 text-sm">G82 • Perfect fit enabled</p>
          </div>
          <Link href="/garage" className="border border-slate-600 px-5 py-2 rounded-lg font-bold">
            Change Vehicle
          </Link>
        </div>

        <h2 className="text-4xl font-extrabold mb-6">Shopping Cart ({items.length})</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            {items.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center shadow-sm">
                <p className="text-xl font-bold text-gray-400">Your cart is currently empty.</p>
                <Link href="/shop" className="text-[#e8a88a] font-bold mt-2 block">Browse Parts →</Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-sm p-6 flex gap-6 items-center border border-gray-50">
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
                        <button onClick={() => updateQty(item.id, -1)} className="px-4 py-2 font-bold hover:bg-gray-200 transition">−</button>
                        <span className="px-4 font-bold">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="px-4 py-2 font-bold hover:bg-gray-200 transition">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 font-semibold transition">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-24 border border-gray-100">
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

              <div className="mt-6">
                <label className="text-xs font-bold text-gray-600 uppercase">Discount Code</label>
                <div className="flex gap-2 mt-2">
                  <input className="border rounded-lg px-4 py-2 flex-1 outline-none" placeholder="Enter code" />
                  <button className="bg-[#101b2d] text-white px-4 rounded-lg font-bold hover:bg-black transition">Apply</button>
                </div>
              </div>

              {/* Glowing Button Logic */}
              <Link
                href="/checkout"
                className={`w-full mt-6 py-4 rounded-xl font-extrabold text-lg block text-center transition-all duration-300
                  ${items.length > 0 
                    ? "bg-[#e8a88a] text-white shadow-[0_0_20px_rgba(232,168,138,0.3)] hover:shadow-[0_0_30px_rgba(232,168,138,0.5)] scale-[1.01]" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              >
                Proceed to Checkout →
              </Link>
            </div>
          </aside>
        </div>

        {/* Suggestions Section Mannerism */}
        <section className="mt-12">
          <h2 className="text-2xl font-extrabold mb-6">Customers also bought</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {suggestions.map((item) => (
              <div key={item.name} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition">
                <img src={item.image} alt={item.name} className="h-44 w-full object-cover rounded-xl bg-gray-100 mb-4" />
                <span className="text-xs bg-[#101b2d] text-white px-3 py-1 rounded-full font-bold">{item.tag}</span>
                <h4 className="font-extrabold text-black mt-3">{item.name}</h4>
                <p className="text-[#e8a88a] font-extrabold mt-1">{item.price}</p>
                <button className="w-full mt-4 border rounded-lg py-2 font-bold hover:bg-gray-100 transition">Add to Cart</button>
              </div>
            ))}
          </div>
        </section>
      </section>

      {/* Footer Mannerism */}
      <footer className="bg-[#101b2d] text-white mt-10 py-10 text-center">
        <h3 className="text-[#e8a88a] font-extrabold text-xl">FYP</h3>
        <p className="text-slate-400 text-sm mt-2">© 2026 Find Your Parts. Professional Grade Components.</p>
      </footer>
    </main>
  );
}