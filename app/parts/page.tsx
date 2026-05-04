"use client";
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
    link: "/parts/spark-plug",
    tag: "Performance",
  },
  {
    name: "Premium Motor Oil",
    price: "$58.00",
    image: "/images/motor-oil.jpg",
    link: "/parts/motor-oil",
    tag: "Top Rated",
  },
  {
    name: "Heavy Duty Oil Filter",
    price: "$24.00",
    image: "/images/oil-filter.jpg",
    link: "/parts/oil-filter",
    tag: "In Stock",
  },
  {
    name: "Air Intake Filter",
    price: "$34.00",
    image: "/images/cabin-filter.jpg",
    link: "/parts/air-filter",
    tag: "Maintenance",
  },
  {
    name: "All-Weather Floor Mat",
    price: "$129.00",
    image: "/images/floor-mat.jpg",
    link: "/parts/floor-mat",
    tag: "Interior",
  },
];

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-white selection:bg-[#e8a88a]/30 font-sans">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-24 pb-20 px-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#e8a88a]/10 blur-[120px] rounded-full" />
        
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e8a88a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#e8a88a]"></span>
            </span>
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-slate-300">Live Inventory Update</span>
          </div>

          <h1 className="text-6xl font-black mb-6 tracking-tighter leading-none">
            ELITE PERFORMANCE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a88a] to-[#ff7e5f]">COMPONENTS</span>
          </h1>
          
          <p className="text-slate-400 max-w-xl text-lg font-medium mb-10">
            Precision-engineered parts for those who refuse to compromise on quality.
          </p>

          {/* GLOWING SEARCH BAR */}
          <div className="relative max-w-xl group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#e8a88a] to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-focus-within:opacity-100"></div>
            <div className="relative flex items-center bg-white rounded-2xl overflow-hidden shadow-2xl">
              <div className="ml-5 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                placeholder="Search part numbers..."
                className="w-full px-4 py-5 text-slate-900 font-bold outline-none"
              />
              <button className="mr-3 bg-[#101b2d] text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">
                Find
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-[1200px] mx-auto px-8 py-20">
        <h3 className="text-4xl font-black tracking-tighter mb-12 uppercase">The Catalog</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((item) => (
            <div
              key={item.name}
              className="group relative bg-[#161e2d] border border-white/5 rounded-[2.5rem] transition-all duration-500 hover:border-[#e8a88a]/30 hover:-translate-y-2 overflow-hidden"
            >
              {/* IMAGE AREA */}
              <div className="relative h-64 bg-[#1b2537] overflow-hidden flex items-center justify-center">
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${item.color}`} />
                
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-44 w-auto object-contain z-10 transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute top-6 left-6 z-20">
                    <span className="bg-[#e8a88a] text-[#101b2d] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">
                    {item.tag}
                    </span>
                </div>
              </div>

              {/* DETAILS */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-xl font-black leading-tight max-w-[70%] group-hover:text-[#e8a88a] transition-colors uppercase">
                    {item.name}
                  </h3>
                  <p className="text-2xl font-black text-white/90 tracking-tighter">
                    {item.price}
                  </p>
                </div>

                <Link
                  href={item.link}
                  className="flex items-center justify-center gap-2 w-full bg-white text-[#101b2d] py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] group-hover:bg-[#e8a88a] group-hover:text-white transition-all duration-300"
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-[#080c14] py-16 px-10 text-center">
        <h3 className="text-[#e8a88a] font-black text-3xl tracking-tighter mb-4">FYP.</h3>
        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.4em]">
          © 2026 Find Your Parts. Professional Grade.
        </p>
      </footer>
    </main>
  );
}