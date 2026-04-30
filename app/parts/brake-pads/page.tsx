import Link from "next/link";

export default function BrakePadsPage() {
  const thumbnails = [
    "/images/brake-pads.jpg",
    "/images/spark-plug.jpg",
    "/images/motor-oil.jpg",
    "/images/cabin-filter.jpg",
  ];

  const specs = [
    ["Material", "High-Density Carbon Ceramic"],
    ["Pad Type", "Ultra-Low Dust, Performance"],
    ["Friction Rating", "FF Consistent Braking Force"],
    ["Placement", "Front Axle"],
    ["Warranty", "24 Months / 24,000 Miles"],
  ];

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      

      <section className="max-w-[1400px] mx-auto p-8">
        <p className="text-sm text-gray-600 mb-6">
          Home / Brake System / Brake Pads / FYP Ceramic Brake Pads
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex gap-5">
            <div className="flex flex-col gap-4">
              {thumbnails.map((img, index) => (
                <div
                  key={img}
                  className={`w-24 h-24 bg-white rounded-xl border-2 p-2 flex items-center justify-center ${
                    index === 0 ? "border-[#e8a88a]" : "border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt="Product thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow p-10 flex items-center justify-center">
              <img
                src="/images/brake-pads.jpg"
                alt="FYP Ceramic Brake Pads"
                className="max-h-[520px] object-contain rounded-xl"
              />
            </div>
          </div>

          <div className="lg:col-span-5 bg-white rounded-2xl shadow p-7">
            <div className="flex gap-2 mb-4">
              <span className="bg-[#101b2d] text-white px-3 py-1 rounded-full text-xs font-bold">
                FYP CERTIFIED
              </span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                IN STOCK
              </span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                TOP RATED
              </span>
            </div>

            <h2 className="text-4xl font-extrabold text-[#101b2d]">
              FYP Ceramic Brake Pads
            </h2>

            <p className="text-gray-600 mt-2 font-semibold">
              Part # FYP-BK-4092-CP
            </p>

            <p className="text-[#e8a88a] font-extrabold text-lg mt-4">
              ★★★★★ <span className="text-black">4.6</span>{" "}
              <span className="text-blue-600">(124 Reviews)</span>
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-6 flex justify-between items-center">
              <div>
                <h3 className="font-extrabold text-black">
                  Fits Your Vehicle
                </h3>
                <p className="text-gray-700">2021 BMW M4 Competition (G82)</p>
              </div>
              <span className="bg-green-600 text-white rounded-full w-9 h-9 flex items-center justify-center">
                ✓
              </span>
            </div>

            <p className="text-[#e85d04] text-5xl font-extrabold mt-8">
              $189.50
            </p>
            <p className="text-gray-600 mt-1">Excl. Tax & Shipping</p>
            <p className="text-[#e8a88a] font-bold">
              Bulk discount available
            </p>

            <div className="flex gap-4 mt-8">
              <div className="bg-gray-100 rounded-xl flex items-center">
                <button className="px-5 py-4 font-bold">−</button>
                <span className="px-5 font-bold">1</span>
                <button className="px-5 py-4 font-bold">+</button>
              </div>

              <Link
                href="/cart"
                className="flex-1 bg-[#e85d04] text-white rounded-xl font-extrabold text-lg shadow flex items-center justify-center"
              >
                🛒 Add to Cart
              </Link>
            </div>

            <button className="w-full mt-4 border-2 border-[#101b2d] text-[#101b2d] py-3 rounded-xl font-extrabold">
              ♡ Save to Garage
            </button>

            <div className="grid grid-cols-3 gap-3 mt-8 border-t pt-6">
              <div className="text-center">
                <p className="text-green-600 text-2xl">🚚</p>
                <p className="font-bold text-sm">Free Shipping</p>
              </div>
              <div className="text-center">
                <p className="text-green-600 text-2xl">🛡️</p>
                <p className="font-bold text-sm">Warranty</p>
              </div>
              <div className="text-center">
                <p className="text-green-600 text-2xl">↩️</p>
                <p className="font-bold text-sm">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-2xl">🔥</p>
              <h3 className="font-extrabold">Premium Ceramic Formula</h3>
              <p className="text-gray-600 text-sm">
                Low dust • Quiet • Long lasting
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-2xl">⚙️</p>
              <h3 className="font-extrabold">OE-Grade Quality</h3>
              <p className="text-gray-600 text-sm">
                Meets or exceeds OEM standards
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-5 text-center">
              <p className="text-2xl">🏆</p>
              <h3 className="font-extrabold">Performance Tested</h3>
              <p className="text-gray-600 text-sm">
                500+ hours of reliability testing
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="bg-[#101b2d] text-white p-5">
              <h3 className="text-xl font-extrabold">Part Specifications</h3>
            </div>

            <table className="w-full text-left">
              <tbody>
                {specs.map(([label, value], index) => (
                  <tr key={label} className={index % 2 ? "bg-gray-50" : ""}>
                    <td className="p-4 font-bold text-gray-700">{label}</td>
                    <td className="p-4 text-black">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-[#101b2d] text-white rounded-2xl shadow p-8 relative overflow-hidden">
            <h3 className="text-2xl font-extrabold">FYP Reliability Report</h3>
            <p className="text-[#e8a88a] text-6xl font-extrabold mt-6">98%</p>
            <p className="text-slate-300 mt-3">
              of users reported smoother braking and reduced dust after 500
              miles.
            </p>
            <img
              src="/images/brake-pads.jpg"
              alt="Brake pad"
              className="absolute right-[-20px] bottom-[-20px] w-44 opacity-30"
            />
          </div>

          <div className="space-y-5">
            <div className="bg-green-50 rounded-2xl shadow p-6">
              <h3 className="text-xl font-extrabold text-green-700">
                Eco-Friendly
              </h3>
              <p className="text-gray-700 mt-2">
                Copper-free formula compliant with 2025 standards.
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl shadow p-6">
              <h3 className="text-xl font-extrabold text-blue-700">
                Quick Bed-In
              </h3>
              <p className="text-gray-700 mt-2">
                Factory scorched surface for instant stopping power.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-extrabold">
              Customer Reviews{" "}
              <span className="text-[#e8a88a] text-xl">★ 4.6</span>
            </h3>

            <button className="bg-[#101b2d] text-white px-6 py-3 rounded-xl font-bold">
              Write a Review
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              [
                "Marcus T.",
                "Excellent bite right out of the box. Zero dust after two weeks.",
              ],
              [
                "Sarah J.",
                "Quiet, clean, and easy to install. Delivery was very fast.",
              ],
              [
                "David R.",
                "Outstanding performance even under high temperature driving.",
              ],
            ].map(([name, text]) => (
              <div key={name} className="bg-white p-6 rounded-2xl shadow">
                <p className="font-extrabold">{name}</p>
                <p className="text-[#e8a88a] font-bold mt-1">★★★★★</p>
                <p className="text-gray-700 mt-4">{text}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <footer className="bg-[#101b2d] text-white mt-12 px-10 py-8 flex justify-between">
        <p className="font-bold">⭐ Trusted by 50,000+ Enthusiasts</p>
        <p className="font-bold">⚙ Precision Engineered Parts</p>
        <h3 className="text-3xl font-extrabold">
          F<span className="text-[#e8a88a]">Y</span>P
        </h3>
      </footer>
    </main>
  );
}