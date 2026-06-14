"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQty } = useCart();
  const [showConfirm, setShowConfirm] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountError, setDiscountError] = useState(false);

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
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + tax;

  const handleRemove = (id: string) => {
    removeFromCart(id);
    setShowConfirm(null);
  };

  const handleApplyCode = () => {
    if (discountCode.trim().toUpperCase() === "FYP10") {
      setDiscountApplied(true);
      setDiscountError(false);
    } else {
      setDiscountApplied(false);
      setDiscountError(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .cart-item { animation: fadeSlideIn 0.3s ease both; }
        .modal-box { animation: scaleIn 0.2s ease both; }
        .sidebar-glow {
          box-shadow: 0 0 0 1px rgba(232,168,138,0.08), 0 24px 48px rgba(10,15,26,0.18);
        }
        .checkout-btn {
          background: linear-gradient(135deg, #e8a88a 0%, #d4906e 100%);
          box-shadow: 0 4px 20px rgba(232,168,138,0.28);
          transition: box-shadow 0.25s ease, transform 0.15s ease;
        }
        .checkout-btn:hover {
          box-shadow: 0 6px 28px rgba(232,168,138,0.42);
          transform: translateY(-1px);
        }
        .checkout-btn:active { transform: translateY(0); }
        .discount-input:focus { border-color: #e8a88a !important; box-shadow: 0 0 0 3px rgba(232,168,138,0.12); }
        .qty-btn:hover { background: rgba(255,255,255,0.1); }
      `}</style>

      <section className="max-w-[1280px] mx-auto p-8">
        {/* Banner */}
        <div
          className="bg-[#101b2d] text-white rounded-2xl p-5 mb-8 flex justify-between items-center"
          style={{ boxShadow: "0 2px 16px rgba(10,15,26,0.12)" }}
        >
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-0.5">
              Current Vehicle
            </p>
            <h2 className="font-bold text-lg">2021 BMW M4 Competition</h2>
            <p className="text-slate-400 text-sm">G82 · Perfect fit enabled</p>
          </div>
          <Link
            href="/garage"
            className="border border-slate-600 px-5 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 hover:border-slate-500 transition-all duration-200"
          >
            Change Vehicle
          </Link>
        </div>

        <h2 className="text-4xl font-extrabold mb-6">
          Shopping Cart{" "}
          <span className="text-slate-400 font-bold text-2xl ml-1">
            ({items.length})
          </span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {items.length === 0 ? (
              <div
                className="bg-white p-14 rounded-2xl text-center border border-gray-100"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
              >
                <div className="text-5xl mb-4">🛒</div>
                <p className="text-xl font-bold text-gray-400 mb-2">
                  Your cart is empty
                </p>
                <p className="text-gray-500 mb-8 text-sm">
                  Find the right parts for your vehicle and add them here.
                </p>
                <Link
                  href="/parts"
                  className="inline-block bg-[#101b2d] text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-colors duration-200"
                >
                  Browse Parts →
                </Link>
              </div>
            ) : (
              items.map((item, i) => (
                <div
                  key={item.id}
                  className="cart-item bg-white rounded-2xl p-6 flex gap-6 items-center border border-gray-100 hover:border-gray-200 transition-all duration-200"
                  style={{
                    animationDelay: `${i * 60}ms`,
                    boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 object-cover rounded-xl bg-gray-50 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-lg font-extrabold text-black leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {item.sku}
                        </p>
                      </div>
                      <p className="text-[#e8a88a] font-extrabold text-xl flex-shrink-0">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-green-600 text-xs font-bold mt-2">
                      ● Perfect fit for your vehicle
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      {/* Quantity Selector */}
                      <div
                        className="flex items-center rounded-xl overflow-hidden"
                        style={{ background: "#101b2d" }}
                      >
                        <button
                          onClick={() =>
                            updateQty(item.id, Math.max(1, item.qty - 1))
                          }
                          className="qty-btn w-9 h-9 flex items-center justify-center text-white font-bold text-lg transition-colors duration-150"
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-white font-bold text-sm">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="qty-btn w-9 h-9 flex items-center justify-center text-white font-bold text-lg transition-colors duration-150"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-black font-extrabold text-lg">
                        ${(item.price * item.qty).toFixed(2)}
                      </p>

                      <button
                        onClick={() => setShowConfirm(item.id)}
                        className="text-gray-300 hover:text-red-500 text-sm font-semibold transition-colors duration-150"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Order Summary Sidebar ── */}
          <aside className="lg:col-span-4">
            <div
              className="rounded-2xl sticky top-24 overflow-hidden sidebar-glow"
              style={{ background: "#0d1829" }}
            >
              {/* Header */}
              <div
                className="px-6 pt-6 pb-5"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-[#e8a88a] text-xs font-bold uppercase tracking-widest mb-1">
                  Your Order
                </p>
                <h3 className="text-white text-xl font-extrabold">
                  Order Summary
                </h3>
              </div>

              {/* Line items */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">
                    Subtotal ({items.length} item{items.length !== 1 ? "s" : ""}
                    )
                  </span>
                  <span className="text-white font-bold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between items-center">
                    <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                      <span className="text-xs">✓</span> Code FYP10
                    </span>
                    <span className="text-green-400 font-bold">
                      −${discount.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">
                    Shipping
                  </span>
                  <span className="text-green-400 font-bold text-sm">FREE</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm font-medium">
                    Taxes (8%)
                  </span>
                  <span className="text-white font-bold">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                {/* Divider */}
                <div
                  style={{
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                    paddingTop: "14px",
                  }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white text-base font-extrabold">
                      Total
                    </span>
                    <span className="text-[#e8a88a] text-2xl font-extrabold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Discount Code */}
              <div
                className="px-6 pb-5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-5 mb-2">
                  Discount Code
                </p>
                <div className="flex gap-2">
                  <input
                    className="discount-input flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white outline-none transition-all duration-200"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: discountError
                        ? "1px solid rgba(239,68,68,0.6)"
                        : "1px solid rgba(255,255,255,0.1)",
                    }}
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => {
                      setDiscountCode(e.target.value);
                      setDiscountError(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                  />
                  <button
                    onClick={handleApplyCode}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200"
                    style={{
                      background: discountApplied
                        ? "rgba(34,197,94,0.15)"
                        : "rgba(232,168,138,0.15)",
                      color: discountApplied ? "#4ade80" : "#e8a88a",
                      border: discountApplied
                        ? "1px solid rgba(34,197,94,0.3)"
                        : "1px solid rgba(232,168,138,0.3)",
                    }}
                  >
                    {discountApplied ? "✓ Applied" : "Apply"}
                  </button>
                </div>
                {discountError && (
                  <p className="text-red-400 text-xs mt-1.5 font-medium">
                    Invalid code. Try FYP10 for 10% off.
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <div className="px-6 pb-6 space-y-3">
                {items.length > 0 ? (
                  <Link
                    href="/checkout"
                    className="checkout-btn w-full py-4 rounded-xl font-extrabold text-white text-base block text-center"
                  >
                    Proceed to Checkout →
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full py-4 rounded-xl font-extrabold text-base cursor-not-allowed"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.25)",
                    }}
                  >
                    Proceed to Checkout →
                  </button>
                )}

                <Link
                  href="/parts"
                  className="w-full py-3 rounded-xl font-bold text-center text-sm block transition-all duration-200"
                  style={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "rgba(255,255,255,0.05)";
                    (e.currentTarget as HTMLElement).style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      "transparent";
                    (e.currentTarget as HTMLElement).style.color =
                      "rgba(255,255,255,0.6)";
                  }}
                >
                  Continue Shopping
                </Link>

                {/* Trust badges */}
                <div
                  className="flex justify-around pt-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                >
                  {["🔒 Secure", "📦 Free Ship", "↩ Easy Returns"].map(
                    (badge) => (
                      <span
                        key={badge}
                        className="text-xs font-medium"
                        style={{ color: "rgba(255,255,255,0.3)" }}
                      >
                        {badge}
                      </span>
                    ),
                  )}
                </div>
              </div>
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
                  className="bg-white rounded-2xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-200 group"
                >
                  <img
                    src={suggestion.image}
                    alt={suggestion.name}
                    className="h-44 w-full object-cover rounded-xl bg-gray-100 mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="text-xs bg-[#101b2d] text-white px-3 py-1 rounded-full font-bold inline-block">
                    {suggestion.tag}
                  </span>
                  <h4 className="font-extrabold text-black mt-3 group-hover:text-[#e8a88a] transition-colors duration-200 text-sm leading-snug">
                    {suggestion.name}
                  </h4>
                  <p className="text-[#e8a88a] font-extrabold mt-1">
                    {suggestion.price}
                  </p>
                  <button className="w-full mt-4 border-2 border-[#101b2d] text-[#101b2d] rounded-lg py-2 font-bold hover:bg-[#101b2d] hover:text-white transition-all duration-200 text-sm">
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
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div
            className="modal-box bg-white rounded-2xl p-8 max-w-sm w-full mx-4"
            style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}
          >
            <div className="text-3xl mb-3">🗑️</div>
            <h3 className="text-xl font-extrabold text-black mb-2">
              Remove Item?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              This item will be removed from your cart. You can always add it
              back later.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(null)}
                className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors duration-150 text-sm"
              >
                Keep It
              </button>
              <button
                onClick={() => showConfirm && handleRemove(showConfirm)}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors duration-150 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#101b2d] text-white mt-20 py-10 text-center">
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
