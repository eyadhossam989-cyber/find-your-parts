export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] flex text-slate-900">
      <aside className="w-64 bg-[#101b2d] text-white p-6 flex flex-col">
        <h1 className="text-4xl font-extrabold text-white mb-1">FYP</h1>
        <p className="text-sm text-slate-300 mb-10">Admin Console</p>

        <nav className="space-y-3">
          {["Dashboard", "Orders", "Inventory", "Users", "Reports", "Settings"].map(
            (item, index) => (
              <a
                key={item}
                className={`block px-4 py-3 rounded-lg ${
                  index === 0
                    ? "bg-[#e8a88a] text-white font-bold"
                    : "hover:bg-slate-800"
                }`}
              >
                {item}
              </a>
            )
          )}
        </nav>

        <button className="mt-auto bg-[#e8a88a] text-white font-bold py-3 rounded-lg">
          Add New Part
        </button>

        <a className="mt-6 text-sm text-slate-300">Log Out</a>
      </aside>

      <section className="flex-1">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h2 className="text-3xl font-extrabold text-black">FYP Admin</h2>

          <nav className="hidden lg:flex gap-8 text-sm font-semibold text-black">
            <a>Analytics</a>
            <a>Inventory</a>
            <a>Orders</a>
            <a>Customers</a>
          </nav>

          <input
            className="border border-slate-300 rounded-full px-5 py-2 w-72 text-black"
            placeholder="Search orders or parts..."
          />
        </header>

        <div className="p-8 max-w-[1400px] mx-auto">
          <div className="bg-[#101b2d] text-white rounded-xl p-6 mb-8 shadow flex justify-between items-center">
            <div>
              <p className="text-slate-300">Admin Overview</p>
              <h1 className="text-2xl font-bold">Manage Find Your Parts</h1>
              <p className="text-slate-300">
                Track sales, orders, inventory, and customer activity.
              </p>
            </div>

            <button className="bg-[#e8a88a] px-6 py-3 rounded-lg font-bold">
              Generate Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600">Total Sales</p>
              <h3 className="text-2xl font-bold text-black">$128,430</h3>
              <p className="text-green-600 text-sm mt-2">+12.5% this month</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600">New Users</p>
              <h3 className="text-2xl font-bold text-black">1,240</h3>
              <p className="text-green-600 text-sm mt-2">+8.1% growth</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <p className="text-gray-600">Pending Orders</p>
              <h3 className="text-2xl font-bold text-black">43</h3>
              <p className="text-orange-500 text-sm mt-2">Needs review</p>
            </div>

            <div className="bg-[#101b2d] p-6 rounded-xl shadow text-white">
              <p className="text-slate-300">Inventory</p>
              <h3 className="text-2xl font-bold">98% In Stock</h3>
              <p className="text-slate-300 text-sm mt-2">Healthy warehouse</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between mb-5">
                <h3 className="text-xl font-bold text-black">Recent Orders</h3>
                <span className="text-orange-500 font-semibold cursor-pointer">
                  View All
                </span>
              </div>

              <table className="w-full text-left text-black">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-3">Order ID</th>
                    <th className="py-3">Customer</th>
                    <th className="py-3">Part</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-right">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4 font-medium">#AP-9821</td>
                    <td>John Doe</td>
                    <td>Brembo Front Rotors</td>
                    <td>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        Shipping
                      </span>
                    </td>
                    <td className="text-right font-bold">$452.20</td>
                  </tr>

                  <tr className="border-b border-gray-200">
                    <td className="py-4 font-medium">#AP-9822</td>
                    <td>Alex Smith</td>
                    <td>NGK Iridium Plugs</td>
                    <td>
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                        Pending
                      </span>
                    </td>
                    <td className="text-right font-bold">$89.15</td>
                  </tr>

                  <tr>
                    <td className="py-4 font-medium">#AP-9823</td>
                    <td>B. Miller</td>
                    <td>Synthetic 5W-30 Oil</td>
                    <td>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Delivered
                      </span>
                    </td>
                    <td className="text-right font-bold">$112.50</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold text-black mb-4">
                  Vehicle Scanner
                </h3>

                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <p className="text-gray-600">Active Selection</p>
                  <p className="font-bold text-black">2022 Audi S4 Quattro</p>
                  <p className="text-green-600 text-sm mt-2">
                    Fully Compatible
                  </p>
                </div>

                <button className="w-full bg-[#101b2d] text-white py-3 rounded-lg font-bold">
                  Change Vehicle
                </button>
              </div>

              <div className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold text-black mb-4">
                  Live Inventory
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold text-black">Spark Plug Set</p>
                      <p className="text-gray-600 text-sm">Low Stock Alert</p>
                    </div>
                    <p className="text-red-600 font-bold">12 units</p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold text-black">OEM Oil Filters</p>
                      <p className="text-gray-600 text-sm">In Stock</p>
                    </div>
                    <p className="text-green-600 font-bold">842 units</p>
                  </div>

                  <div className="flex justify-between">
                    <div>
                      <p className="font-bold text-black">Performance Rotors</p>
                      <p className="text-gray-600 text-sm">Restocked Today</p>
                    </div>
                    <p className="text-blue-600 font-bold">45 units</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#101b2d] text-white rounded-xl p-8 mt-8 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold">Warehouse Performance</h3>
              <p className="text-slate-300">
                Inventory is stable, but spark plugs need restocking soon.
              </p>
            </div>

            <div className="flex items-end gap-2 h-24">
              <div className="w-8 bg-slate-600 rounded-t h-10"></div>
              <div className="w-8 bg-slate-600 rounded-t h-16"></div>
              <div className="w-8 bg-[#e8a88a] rounded-t h-24"></div>
              <div className="w-8 bg-slate-600 rounded-t h-14"></div>
              <div className="w-8 bg-slate-600 rounded-t h-20"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}