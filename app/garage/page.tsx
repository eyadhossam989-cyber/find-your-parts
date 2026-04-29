export default function GaragePage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      

      <section className="max-w-[1280px] mx-auto p-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-[#e8a88a] font-bold">Vehicle Management</p>
            <h2 className="text-5xl font-extrabold text-[#101b2d]">
              My Garage
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Manage your fleet, track specs, and find compatible parts with FYP
              smart fitment.
            </p>
          </div>

          <button className="bg-[#e8a88a] text-white px-6 py-3 rounded-xl font-extrabold shadow">
            + Add New Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 relative overflow-hidden rounded-3xl shadow-xl min-h-[390px] bg-[#101b2d]">
            <img
              src="/images/bmw-m4.webp"
              alt="BMW M4"
              className="absolute inset-0 w-full h-full object-cover opacity-45"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#101b2d] via-[#101b2d]/85 to-black/20" />

            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <span className="bg-[#e8a88a] text-white px-4 py-2 rounded-full text-xs font-extrabold w-fit mb-5">
                ACTIVE VEHICLE
              </span>

              <h3 className="text-4xl font-extrabold text-white">
                2021 BMW M4
              </h3>

              <div className="flex flex-wrap gap-4 mt-5">
                <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-white/60 text-xs font-bold">MILEAGE</p>
                  <p className="text-white text-2xl font-extrabold">
                    12,450 mi
                  </p>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-white/60 text-xs font-bold">ENGINE</p>
                  <p className="text-white text-2xl font-extrabold">3.0L I6</p>
                </div>

                <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                  <p className="text-white/60 text-xs font-bold">STATUS</p>
                  <p className="text-white text-2xl font-extrabold">Optimal</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button className="bg-white text-[#101b2d] px-6 py-3 rounded-xl font-bold">
                  Shop Parts
                </button>
                <button className="border border-white text-white px-6 py-3 rounded-xl font-bold">
                  Service Log
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl shadow overflow-hidden">
            <img
              src="/images/porsche-gt3.jpg"
              alt="Porsche 911 GT3"
              className="w-full h-52 object-cover"
            />

            <div className="p-6">
              <h3 className="text-2xl font-extrabold">2022 Porsche 911 GT3</h3>
              <p className="text-gray-600 text-sm mt-1">
                4,200 miles • Track Prepared
              </p>

              <div className="bg-gray-100 rounded-xl p-3 mt-5 flex justify-between">
                <span className="text-gray-600 text-sm">Last Service</span>
                <b>2 months ago</b>
              </div>

              <button className="w-full mt-4 bg-blue-100 text-blue-800 py-3 rounded-xl font-bold">
                Select as Active
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white rounded-3xl shadow overflow-hidden">
            <img
              src="/images/audi-rs6.jpg"
              alt="Audi RS6"
              className="w-full h-52 object-cover"
            />

            <div className="p-6">
              <h3 className="text-2xl font-extrabold">2023 Audi RS6 Avant</h3>
              <p className="text-gray-600 text-sm mt-1">
                8,900 miles • Daily Driver
              </p>

              <div className="bg-red-50 rounded-xl p-3 mt-5 flex justify-between">
                <span className="text-gray-600 text-sm">Upcoming</span>
                <b className="text-red-600">Brake Pads</b>
              </div>

              <button className="w-full mt-4 bg-blue-100 text-blue-800 py-3 rounded-xl font-bold">
                Select as Active
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 bg-[#101b2d] text-white rounded-3xl shadow-xl p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-36 h-36 rounded-full border-4 border-[#e8a88a] flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-extrabold">98%</p>
                <p className="text-white/50 text-xs font-bold">MATCH</p>
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-3xl font-extrabold">
                Automated Compatibility Check
              </h3>
              <p className="text-slate-300 mt-3">
                FYP cross-checks your saved vehicles with thousands of parts.
                Your cart items are confirmed for the{" "}
                <span className="text-[#e8a88a] font-bold">2021 BMW M4</span>.
              </p>

              <div className="flex gap-6 mt-5 text-sm">
                <span>✅ OEM Certified</span>
                <span>🛡 Warranty Tracked</span>
              </div>
            </div>

            <button className="bg-[#e8a88a] text-white px-6 py-3 rounded-xl font-extrabold">
              View Parts Guide
            </button>
          </div>
        </div>

        <section className="mt-10">
          <h3 className="text-3xl font-extrabold mb-5">
            Garage Specifications
          </h3>

          <div className="bg-white rounded-3xl shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-5">Vehicle</th>
                  <th className="p-5">Chassis Code</th>
                  <th className="p-5">Tire Size</th>
                  <th className="p-5">Oil Type</th>
                  <th className="p-5">Action</th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["BMW M4", "G82", "275/35 R19 / 285/30 R20", "0W-30 Synthetic"],
                  ["Porsche 911", "992", "255/35 R20 / 315/30 R21", "0W-40 Synthetic"],
                  ["Audi RS6", "C8", "285/30 R22 / 285/30 R22", "5W-30 Synthetic"],
                ].map(([car, code, tire, oil]) => (
                  <tr key={car} className="border-t hover:bg-gray-50">
                    <td className="p-5 font-extrabold">{car}</td>
                    <td className="p-5">{code}</td>
                    <td className="p-5">{tire}</td>
                    <td className="p-5">{oil}</td>
                    <td className="p-5">
                      <button className="text-[#e8a88a] font-bold">
                        Edit Specs
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
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