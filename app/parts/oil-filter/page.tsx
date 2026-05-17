"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const productLinks = [
  { name: "Brake Pads", slug: "brake-pads", image: "/images/brake-pads.jpg" },
  { name: "Spark Plug", slug: "spark-plug", image: "/images/spark-plug.jpg" },
  { name: "Motor Oil", slug: "motor-oil", image: "/images/motor-oil.jpg" },
  { name: "Oil Filter", slug: "oil-filter", image: "/images/oil-filter.jpg" },
  { name: "Air Filter", slug: "air-filter", image: "/images/cabin-filter.jpg" },
  { name: "Floor Mat", slug: "floor-mat", image: "/images/floor-mat.jpg" },
];

export default function OilFilterPage() {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const product = {
    id: "oil-filter",
    name: "Heavy Duty Oil Filter",
    sku: "FYP-OF-1190-HD",
    price: 24.00,
    image: "/images/oil-filter.jpg",
    rating: 4.7,
    reviews: 156,
  };

  const specs = [
    ["Filter Type", "Spin-On High-Flow"],
    ["Thread Size", "3/4-16 UNF"],
    ["Collapse Strength", "75 PSI"],
    ["Bypass Rating", "9 PSI"],
    ["Warranty", "24 Months"],
  ];

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      qty,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="max-w-[1400px] mx-auto p-8">
        <p className="text-sm text-gray-600 mb-6">
          Home / Oil & Filters / Oil Filter / Heavy Duty Oil Filter
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 flex gap-5">
            <div className="flex flex-col gap-4">
              {productLinks.map((link) => (
                <Link
                  key={link.slug}
                  href={`/parts/${link.slug}`}
                  className={`w-24 h-24 bg-white rounded-xl border-2 p-2 flex items-center justify-center transition hover:scale-110 ${
                    link.slug === "oil-filter"
                      ? "border-[#e8a88a]"
                      : "border-gray-200"
                  }`}
                  title={link.name}
                >
                  <img
                    src={link.image}
                    alt={link.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </Link>
              ))}
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow p-10 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
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
            </div>

            <h2 className="text-4xl font-extrabold text-[#101b2d]">
              {product.name}
            </h2>

            <p className="text-gray-600 mt-2 font-semibold">
              Part # {product.sku}
            </p>

            <p className="text-[#e8a88a] font-extrabold text-lg mt-4">
              ★★★★★ <span className="text-black">{product.rating}</span>{" "}
              <span className="text-blue-600">({product.reviews} Reviews)</span>
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-5 mt-6">
              <h3 className="font-extrabold text-black">Superior Filtration</h3>
              <p className="text-gray-700">Captures contaminants and extends engine oil life by 25%.</p>
            </div>

            <p className="text-[#e85d04] text-5xl font-extrabold mt-8">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-gray-600 mt-1">Excl. Tax & Shipping</p>

            <div className="flex gap-4 mt-8">
              <div className="bg-gray-100 rounded-xl flex items-center border border-gray-300">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-5 py-4 font-bold hover:bg-gray-200 transition"
                >
                  −
                </button>
                <span className="px-5 font-bold text-lg">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-5 py-4 font-bold hover:bg-gray-200 transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={`flex-1 text-white rounded-xl font-extrabold text-lg shadow flex items-center justify-center transition-all ${
                  added
                    ? "bg-green-600"
                    : "bg-[#e85d04] hover:bg-[#d65502]"
                }`}
              >
                {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
              </button>
            </div>

            <button className="w-full mt-4 border-2 border-[#101b2d] text-[#101b2d] py-3 rounded-xl font-extrabold hover:bg-[#101b2d] hover:text-white transition">
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

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow overflow-hidden">
            <div className="bg-[#101b2d] text-white p-5">
              <h3 className="text-xl font-extrabold">Specifications</h3>
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
            <h3 className="text-2xl font-extrabold">FYP Reliability</h3>
            <p className="text-[#e8a88a] text-6xl font-extrabold mt-6">98%</p>
            <p className="text-slate-300 mt-3">
              Customers report superior performance and reliability.
            </p>
          </div>

          <div className="space-y-5">
            <div className="bg-green-50 rounded-2xl shadow p-6">
              <h3 className="text-xl font-extrabold text-green-700">Quality</h3>
              <p className="text-gray-700 mt-2">
                OEM tested and professionally engineered.
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl shadow p-6">
              <h3 className="text-xl font-extrabold text-blue-700">Support</h3>
              <p className="text-gray-700 mt-2">
                24/7 customer support and warranty coverage.
              </p>
            </div>
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