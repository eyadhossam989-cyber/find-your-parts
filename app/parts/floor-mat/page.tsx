import Link from "next/link";

interface Spec {
  [key: number]: string;
}

export default function FloorMatPage() {
  const specs: Spec[] = [
    { 0: "Material", 1: "Premium Rubber with Fabric Top" },
    { 0: "Coverage", 1: "Full Front & Rear Set (4 pieces)" },
    { 0: "Weather Resistance", 1: "All-Season (-40°F to 160°F)" },
    { 0: "Non-Slip Base", 1: "Advanced Grip Technology" },
    { 0: "Warranty", 1: "36 Months" },
  ];

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1400px] mx-auto p-8">
        <p className="text-sm text-gray-600 mb-6">Home / Interior / Floor Mats</p>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-2xl shadow p-10 flex items-center justify-center">
            <img src="/images/floor-mat.jpg" alt="All-Weather Floor Mat" className="max-h-[400px] object-contain" />
          </div>
          <div className="lg:col-span-5 bg-white rounded-2xl shadow p-7">
            <div className="flex gap-2 mb-4">
              <span className="bg-[#101b2d] text-white px-3 py-1 rounded-full text-xs font-bold">FYP CERTIFIED</span>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">IN STOCK</span>
              <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">TOP RATED</span>
            </div>
            <h2 className="text-4xl font-extrabold text-[#101b2d] mt-4">All-Weather Floor Mat</h2>
            <p className="text-gray-600 mt-2 font-semibold">Part # FYP-FM-5530-AW</p>
            <p className="text-[#e8a88a] font-extrabold text-lg mt-4">★★★★★ <span className="text-black">4.9</span> <span className="text-blue-600">(312 Reviews)</span></p>
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-6">
              <h3 className="font-extrabold text-black">Premium Interior Protection</h3>
              <p className="text-gray-700">Protects your vehicle interior from dirt, mud, and spills year-round.</p>
            </div>
            <p className="text-[#e85d04] text-5xl font-extrabold mt-8">$129.00</p>
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
