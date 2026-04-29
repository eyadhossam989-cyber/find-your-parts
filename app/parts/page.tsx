import Link from "next/link";

export default function PartsPage() {
  const products = [
    {
      name: "Carbon-Ceramic Brake Pads",
      price: "$89.99",
      image: "/images/brake-pad.jpg",
      link: "/parts/brake-pads",
      tag: "Best Seller",
    },
    {
      name: "Performance Spark Plug",
      price: "$18.50",
      image: "/images/spark-plug.jpg",
      link: "/parts/brake-pads",
      tag: "Performance",
    },
    {
      name: "Premium Motor Oil",
      price: "$58.00",
      image: "/images/motor-oil.jpg",
      link: "/parts/brake-pads",
      tag: "Top Rated",
    },
    {
      name: "Heavy Duty Oil Filter",
      price: "$24.00",
      image: "/images/oil-filter.jpg",
      link: "/parts/brake-pads",
      tag: "In Stock",
    },
    {
      name: "Air Intake Filter",
      price: "$34.00",
      image: "/images/cabin-filter.jpg",
      link: "/parts/brake-pads",
      tag: "Maintenance",
    },
    {
      name: "All-Weather Floor Mat",
      price: "$129.00",
      image: "/images/floor-mat.jpg",
      link: "/parts/brake-pads",
      tag: "Interior",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      
      {/* NAVBAR */}
      

      {/* HERO */}
      <section className="bg-gradient-to-r from-[#101b2d] to-[#1f2b44] text-white py-16 px-10">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-5xl font-extrabold mb-3">
            Shop Premium Auto Parts
          </h1>
          <p className="text-slate-300 max-w-xl">
            OEM-quality components engineered for performance, durability, and perfect fitment.
          </p>

          <input
            placeholder="Search parts..."
            className="mt-6 w-full max-w-md px-5 py-3 rounded-xl text-black outline-none"
          />
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-[1200px] mx-auto px-8 py-12">
        <h2 className="text-3xl font-extrabold mb-8">All Parts</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((item) => (
            <div
              key={item.name}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden group"
            >
              {/* IMAGE */}
              <div className="relative bg-gray-100 p-6 flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-40 object-contain group-hover:scale-105 transition"
                />

                <span className="absolute top-4 left-4 bg-[#101b2d] text-white text-xs px-3 py-1 rounded-full font-bold">
                  {item.tag}
                </span>
              </div>

              {/* INFO */}
              <div className="p-6">
                <h3 className="text-xl font-extrabold text-black mb-2">
                  {item.name}
                </h3>

                <p className="text-[#e8a88a] font-extrabold text-lg mb-4">
                  {item.price}
                </p>

                <Link
                  href={item.link}
                  className="block w-full text-center bg-[#e8a88a] text-white py-3 rounded-xl font-bold hover:brightness-110 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#101b2d] text-white mt-10 py-10 text-center">
        <h3 className="text-[#e8a88a] font-extrabold text-xl">FYP</h3>
        <p className="text-slate-400 text-sm mt-2">
          © 2026 Find Your Parts. Professional Grade Components.
        </p>
      </footer>
    </main>
  );
}