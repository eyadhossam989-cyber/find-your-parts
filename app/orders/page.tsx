const orders = [
  ["#FP-92834-01", "Oct 14, 2024", "$342.50", "Delivered", "green"],
  ["#FP-92711-29", "Oct 20, 2024", "$1,204.00", "In Transit", "blue"],
  ["#FP-93005-44", "Oct 22, 2024", "$89.15", "Processing", "orange"],
  ["#FP-91022-88", "Aug 12, 2024", "$56.00", "Delivered", "gray"],
];

export default function OrdersPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      

      <section className="max-w-[1280px] mx-auto p-8">
        <p className="text-[#e8a88a] font-bold">Purchase Tracking</p>
        <h2 className="text-5xl font-extrabold text-[#101b2d] mt-1">
          Order History
        </h2>
        <p className="text-gray-600 mt-2 mb-8">
          Review and track your previous automotive component purchases.
        </p>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
          <div className="flex gap-3">
            <button className="bg-[#101b2d] text-white px-5 py-3 rounded-xl font-bold">
              ☰ All Orders
            </button>
            <button className="bg-white border px-5 py-3 rounded-xl font-bold text-gray-600">
              Past 3 Months
            </button>
            <button className="bg-white border px-5 py-3 rounded-xl font-bold text-gray-600">
              2023
            </button>
          </div>

          <input
            className="bg-white border rounded-xl px-5 py-3 w-full md:w-80"
            placeholder="Search orders..."
          />
        </div>

        <div className="space-y-5">
          {orders.map(([id, date, total, status, color], index) => (
            <div
              key={id}
              className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                <div className="lg:col-span-2">
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Order ID
                  </p>
                  <p className="font-extrabold text-[#101b2d]">{id}</p>
                </div>

                <div className="lg:col-span-2">
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Placed On
                  </p>
                  <p className="text-gray-700 font-semibold">{date}</p>
                </div>

                <div className="lg:col-span-2">
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Total Amount
                  </p>
                  <p className="font-extrabold">{total}</p>
                </div>

                <div className="lg:col-span-3">
                  <p className="text-xs text-gray-400 font-bold uppercase">
                    Status
                  </p>
                  <div className="flex items-center gap-2 font-extrabold">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        color === "green"
                          ? "bg-green-500"
                          : color === "blue"
                          ? "bg-blue-500"
                          : color === "orange"
                          ? "bg-orange-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span
                      className={
                        color === "green"
                          ? "text-green-600"
                          : color === "blue"
                          ? "text-blue-600"
                          : color === "orange"
                          ? "text-orange-500"
                          : "text-gray-500"
                      }
                    >
                      {status}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-3 flex justify-end gap-3">
                  <button className="bg-[#e8a88a] text-white px-6 py-3 rounded-xl font-extrabold">
                    View Details
                  </button>
                  <button className="border rounded-xl px-4 font-bold">⋮</button>
                </div>
              </div>

              {index === 0 && (
                <div className="bg-gray-50 px-6 py-4 flex justify-between text-sm text-gray-600">
                  <span>📦 3 Items • 🚚 Ground Express</span>
                  <span className="text-[#e8a88a] font-bold">Track Package</span>
                </div>
              )}

              {index === 1 && (
                <div className="bg-[#101b2d] text-white px-6 py-4 flex justify-between text-sm">
                  <span>ⓘ Expected Delivery: Tomorrow, Oct 24</span>
                  <span className="underline">Update Preferences</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-between items-center border-t pt-6">
          <p className="text-sm text-gray-600">Showing 4 of 24 orders</p>

          <div className="flex gap-2">
            <button className="border rounded-xl px-4 py-2">‹</button>
            <button className="bg-[#101b2d] text-white rounded-xl px-4 py-2">
              1
            </button>
            <button className="border rounded-xl px-4 py-2">2</button>
            <button className="border rounded-xl px-4 py-2">3</button>
            <button className="border rounded-xl px-4 py-2">›</button>
          </div>
        </div>
      </section>

      <footer className="bg-[#101b2d] text-white mt-10 py-10 text-center">
        <h3 className="text-[#e8a88a] font-extrabold text-xl">FYP</h3>
        <p className="text-slate-400 text-sm mt-2">
          © 2026 Find Your Parts. Professional Grade Components.
        </p>
      </footer>
    </main>
  );
}