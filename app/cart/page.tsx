"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQty } = useCart();
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const suggestions = [
    {
      name: "5W-30 Full Synthetic Motor Oil",
      price: "$58.00",
      tag: "Best Seller",
      image: "/images/motor-oil.jpg",
      link: "/parts/motor-oil",
    },
    {
      name: "Iridium High-Performance Spark Plug",
      price: "$18.50",
      tag: "Performance",
      image: "/images/spark-plug.jpg",
      link: "/parts/spark-plug",
    },
    {
      name: "All-Weather Heavy Duty Floor Mats",
      price: "$129.00",
      tag: "In Stock",
      image: "/images/floor-mat.jpg",
      link: "/parts/floor-mat",
    },
    {
      name: "Activated Carbon Cabin Air Filter",
      price: "$34.00",
      tag: "Maintenance",
      image: "/images/air-filter.jpg",
      link: "/parts/air-filter",
    },
  ];

  const subtotal = items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setShowConfirm(null);
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1280px] mx-auto p-8">
        {/* Banner */}
        <div className="bg-[#101b2d] text-white rounded-2xl p-5 mb-8 flex justify-between items-center shadow">
          <div>
            <p className="text-slate-300 text-sm">Current Vehicle</p>
            <h2 className="font-bold">2021 BMW M4 Competition</h2>
            <p className="text-slate-300 text-sm">G82 • Perfect fit enabled</p>
          </div>
          <Link href="/garage" className="border border-slate-600 px-5 py-2 rounded-lg font-bold hover:bg-slate-800 transition">
            Change Vehicle
          </Link>
        </div>

        <h2 className="text-4xl font-extrabold mb-6">
          Shopping Cart ({items.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {items.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100">
                <p className="text-xl font-bold text-gray-400 mb-4">
                  Your cart is currently empty.
                </p>
                <p className="text-gray-600 mb-6">
                  Start shopping and add some parts to your cart!
                </p>
                <Link
                  href="/parts"
                  className="inline-block bg-[#e8a88a] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#d4956f] transition"
                >
                  Browse Parts →
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm p-6 flex gap-6 items-center border border-gray-50 hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-32 h-32 object-cover rounded-xl bg-gray-100"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-xl font-extrabold text-black">
                          {item.name}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.sku}</p>
                      </div>
                      <p className="text-[#e8a88a] font-extrabold text-xl">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-green-600 text-sm font-bold mt-3">
                      ● Perfect fit for your vehicle
                    </p>
                    <div className="flex justify-between items-center mt-5">
                      {/* Quantity Selector */}
                      <div className="bg-gray-100 rounded-lg flex items-center">
                        <button
                          onClick={() =>
                            updateQty(item.id, Math.max(1, item.qty - 1))
                          }
                          className="px-4 py-2 font-bold hover:bg-gray-200 transition"
                        >
                          −
                        </button>
                        <span className="px-4 font-bold text-lg">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="px-4 py-2 font-bold hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>

                      {/* Item Total */}
                      <p className="text-black font-extrabold text-lg">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>

                      {/* Remove Button */}
                      <button
                        onClick={() => setShowConfirm(item.id)}
                        className="text-gray-400 hover:text-red-600 font-semibold transition ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow p-6 sticky top-24 border border-gray-100">
              <h3 className="text-2xl font-extrabold mb-6">Order Summary</h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between">
                  <span className="font-semibold">Subtotal</span>
                  <b className="text-black">${subtotal.toFixed(2)}</b>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Shipping</span>
                  <b className="text-green-600 font-bold">FREE</b>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Taxes (8%)</span>
                  <b className="text-black">${tax.toFixed(2)}</b>
                </div>
                <div className="border-t pt-4 flex justify-between text-xl">
                  <span className="font-extrabold">Total</span>
                  <span className="font-extrabold text-[#101b2d]">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Discount Code */}
              <div className="mt-6">
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Discount Code
                </label>
                <div className="flex gap-2 mt-2">
                  <input
                    className="border rounded-lg px-4 py-2 flex-1 outline-none focus:border-[#e8a88a] transition"
                    placeholder="Enter code"
                  />
                  <button className="bg-[#101b2d] text-white px-4 rounded-lg font-bold hover:bg-black transition">
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href={items.length > 0 ? "/checkout" : "#"}
                className={`w-full mt-6 py-4 rounded-xl font-extrabold text-lg block text-center transition-all duration-300 ${
                  items.length > 0
                    ? "bg-[#e8a88a] text-white shadow-[0_0_20px_rgba(232,168,138,0.3)] hover:shadow-[0_0_30px_rgba(232,168,138,0.5)] scale-[1.01] hover:scale-[1.02] cursor-pointer"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Proceed to Checkout →
              </Link>

              {/* Continue Shopping */}
              <Link
                href="/parts"
                className="w-full mt-3 py-3 rounded-xl font-bold text-center border-2 border-[#101b2d] text-[#101b2d] hover:bg-[#101b2d] hover:text-white transition"
              >
                Continue Shopping
              </Link>
            </div>
          </aside>
        </div>

        {/* Suggestions Section */}
        {items.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-extrabold mb-6">
              Customers also bought
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {suggestions.map((suggestion) => (
                <Link
                  key={suggestion.name}
                  href={suggestion.link}
                  className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100 hover:shadow-lg transition group"
                >
                  <img
                    src={suggestion.image}
                    alt={suggestion.name}
                    className="h-44 w-full object-cover rounded-xl bg-gray-100 mb-4 group-hover:scale-105 transition"
                  />
                  <span className="text-xs bg-[#101b2d] text-white px-3 py-1 rounded-full font-bold inline-block">
                    {suggestion.tag}
                  </span>
                  <h4 className="font-extrabold text-black mt-3 group-hover:text-[#e8a88a] transition">
                    {suggestion.name}
                  </h4>
                  <p className="text-[#e8a88a] font-extrabold mt-1">
                    {suggestion.price}
                  </p>
                  <button className="w-full mt-4 border-2 border-[#101b2d] text-[#101b2d] rounded-lg py-2 font-bold hover:bg-[#101b2d] hover:text-white transition">
                    View Product
                  </button>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm">
            <h3 className="text-2xl font-extrabold text-black mb-2">
              Remove Item?
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => showConfirm && handleRemove(showConfirm)}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#101b2d] text-white mt-16 py-10 text-center border-t">
        <h3 className="text-3xl font-extrabold">
          F<span className="text-[#e8a88a]">Y</span>P
        </h3>
        <p className="text-slate-400 text-sm mt-2">
          © 2026 Find Your Parts. Professional Grade Components.
        </p>
      </footer>
    </main>
  );
}