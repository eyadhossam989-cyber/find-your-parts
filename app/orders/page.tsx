"use client";
import Link from "next/link";

// 1. LEGIT ORDER DATA: Consistent with your BMW M4 theme
const orders = [
  {
    id: "#FYP-92834-01",
    date: "Apr 28, 2026",
    total: "$497.42",
    status: "Processing",
    items: "Carbon-Ceramic Brake Pad Kit + 1 more",
    type: "Ground Express",
    color: "orange"
  },
  {
    id: "#FYP-92711-29",
    date: "Apr 20, 2026",
    total: "$1,312.50",
    status: "In Transit",
    items: "M-Performance Exhaust Tips (Set of 4)",
    type: "Priority Shipping",
    color: "blue"
  },
  {
    id: "#FYP-81022-88",
    date: "Mar 12, 2026",
    total: "$184.20",
    status: "Delivered",
    items: "Synthetic Oil Change Kit + Cabin Filter",
    type: "Standard Shipping",
    color: "green"
  },
  {
    id: "#FYP-77211-04",
    date: "Jan 15, 2026",
    total: "$2,100.00",
    status: "Delivered",
    items: "KW Variant 3 Coilovers",
    type: "Freight",
    color: "green"
  },
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      {/* Header Section */}
      <section className="max-w-[1280px] mx-auto p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[#e8a88a] font-bold uppercase tracking-wider text-sm">Account Dashboard</p>
            <h2 className="text-5xl font-extrabold text-[#101b2d] mt-1">Order History</h2>
          </div>
          <Link href="/" className="text-gray-500 font-bold hover:text-[#e8a88a] transition">
            ← Back to Shop
          </Link>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-3">
            <button className="bg-[#101b2d] text-white px-6 py-3 rounded-xl font-bold shadow-lg">
              ☰ All Orders
            </button>
            <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">
              2026
            </button>
            <button className="bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition">
              2025
            </button>
          </div>
          <div className="relative">
            <input
              className="bg-white border border-gray-200 rounded-xl px-12 py-3 w-full md:w-80 outline-none focus:ring-2 focus:ring-[#e8a88a]"
              placeholder="Search by Order ID or Part..."
            />
            <span className="absolute left-4 top-3.5 opacity-30">🔍</span>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* ID */}
                <div className="lg:col-span-2">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Order ID</p>
                  <p className="font-black text-[#101b2d] text-lg">{order.id}</p>
                </div>

                {/* Date */}
                <div className="lg:col-span-2">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Date</p>
                  <p className="text-gray-700 font-bold">{order.date}</p>
                </div>

                {/* Total */}
                <div className="lg:col-span-2">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Amount</p>
                  <p className="font-black text-[#101b2d]">{order.total}</p>
                </div>

                {/* Status Badge */}
                <div className="lg:col-span-3">
                  <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Status</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs border
                    ${order.color === 'green' ? 'bg-green-50 border-green-200 text-green-700' : 
                      order.color === 'blue' ? 'bg-blue-50 border-blue-200 text-blue-700' : 
                      'bg-orange-50 border-orange-200 text-orange-700'}`}
                  >
                    <span className={`w-2 h-2 rounded-full animate-pulse
                      ${order.color === 'green' ? 'bg-green-500' : 
                        order.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'}`} 
                    />
                    {order.status}
                  </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-3 flex justify-end gap-3">
                  <button className="bg-[#101b2d] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition shadow-sm">
                    View Invoice
                  </button>
                  <button className="border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-400 hover:bg-gray-50 transition">
                    ⋮
                  </button>
                </div>
              </div>

              {/* Detail Bar */}
              <div className={`px-8 py-4 flex justify-between items-center text-sm font-bold
                ${index === 1 ? 'bg-[#101b2d] text-white' : 'bg-gray-50 text-gray-500'}`}
              >
                <div className="flex items-center gap-4">
                  <span>📦 {order.items}</span>
                  <span className="opacity-40">|</span>
                  <span>🚚 {order.type}</span>
                </div>
                {order.status !== "Delivered" && (
                  <button className="text-[#e8a88a] underline hover:text-white transition">
                    Track Real-Time →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-between items-center border-t border-gray-200 pt-8">
          <p className="text-sm font-bold text-gray-400">Showing 4 of 24 automotive orders</p>
          <div className="flex gap-2">
            <button className="border border-gray-200 rounded-xl w-10 h-10 flex items-center justify-center font-bold hover:bg-white transition">‹</button>
            <button className="bg-[#101b2d] text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold shadow-md">1</button>
            <button className="border border-gray-200 rounded-xl w-10 h-10 flex items-center justify-center font-bold hover:bg-white transition">2</button>
            <button className="border border-gray-200 rounded-xl w-10 h-10 flex items-center justify-center font-bold hover:bg-white transition">›</button>
          </div>
        </div>
      </section>

      <footer className="bg-[#101b2d] text-white mt-20 py-12 text-center border-t border-white/5">
        <h3 className="text-[#e8a88a] font-black text-2xl tracking-tighter">FYP</h3>
        <p className="text-slate-500 text-xs mt-3 uppercase tracking-widest font-bold">
          Professional Grade Automotive Infrastructure
        </p>
        <p className="text-slate-600 text-[10px] mt-8">© 2026 Find Your Parts. All Rights Reserved.</p>
      </footer>
    </main>
  );
}