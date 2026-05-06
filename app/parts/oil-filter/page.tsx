import Link from "next/link";

interface Spec {
  [key: number]: string;
}

export default function OilFilterPage() {
  const specs: Spec[] = [
    { 0: "Filter Type", 1: "Spin-On High-Flow" },
    { 0: "Thread Size", 1: "3/4-16 UNF" },
    { 0: "Collapse Strength", 1: "75 PSI" },
    { 0: "Bypass Rating", 1: "9 PSI" },
    { 0: "Warranty", 1: "24 Months" },
  ];

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1400px] mx-auto p-8">
        <p className="text-sm text-gray-600 mb-6">Home / Oil & Filters / Oil Filter</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl shadow p-10 flex items-center justify-center">
            <img src="/images/oil-filter.jpg" alt="Heavy Duty Oil Filter" className="max-h-[400px] object-contain" />
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl shadow p-7">
            <div className="flex gap-2 mb-4">
              <span className="bg-[#101b2d] text-white px-3 py-1 rounded-full text-xs font-bold">FYP CERTIFIED</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">IN STOCK</span>
            </div>
            <h2 className="text-4xl font-extrabold text-[#101b2d] mt-4">Heavy Duty Oil Filter</h2>
            <p className="text-gray-600 mt-2 font-semibold">Part # FYP-OF-1190-HD</p>
            <p className="text-[#e8a88a] font-extrabold text-lg mt-4">★★★★★ <span className="text-black">4.7</span> <span className="text-blue-600">(156 Reviews)</span></p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-6">
              <h3 className="font-extrabold text-black">Superior Filtration</h3>
              <p className="text-gray-700">Captures contaminants and extends engine oil life by 25%.</p>
            </div>
            <p className="text-[#e85d04] text-5xl font-extrabold mt-8">$24.00</p>
            <p className="text-gray-600 mt-1">Excl. Tax & Shipping</p>
            <div className="flex gap-4 mt-8">
              <div className="bg-gray-100 rounded-xl flex items-center">
                <button className="px-5 py-4 font-bold">−</button>
                <span className="px-5 font-bold">1</span>
                <button className="px-5 py-4 font-bold">+</button>
              </div>
              <Link href="/cart" className="flex-1 bg-[#e85d04] text-white rounded-xl font-extrabold text-lg shadow flex items-center justify-center">🛒 Add to Cart</Link>
            </div>
            <button className="w-full mt-4 border-2 border-[#101b2d] text-[#101b2d] py-3 rounded-xl font-extrabold">♡ Save to Garage</button>
            <table className="w-full text-left mt-8 border-t pt-4">
              <tbody>
                {specs.map((item: any, i: number) => (
                  <tr key={i} className={i % 2 ? "bg-gray-50" : ""}>
                    <td className="p-3 font-bold text-gray-700">{item[0]}</td>
                    <td className="p-3 text-black">{item[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <footer className="bg-[#101b2d] text-white mt-12 px-10 py-8 text-center">
        <h3 className="text-3xl font-extrabold">F<span className="text-[#e8a88a]">Y</span>P</h3>
      </footer>
    </main>
  );
}
