import Link from "next/link";

const featuredCars = [
  {
    name: "BMW M4 Competition",
    image: "/images/bmw-m4.webp",
    text: "Performance parts for your active vehicle.",
  },
  {
    name: "Porsche 911",
    image: "/images/porsche-911.png",
    text: "Premium OEM and aftermarket parts.",
  },
  {
    name: "Audi RS5",
    image: "/images/audi-rs5.jpg",
    text: "Fast fitment checks for compatible parts.",
  },
];

const categories = [
  ["Brake System", "brake-pad.jpg", "/parts/brake-pads"],
  ["Engine Parts", "piston-set.jpg", "/parts"],
  ["Oil & Filters", "oil-filter.jpg", "/cart"],
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      <section className="relative min-h-[520px] overflow-hidden">
        <img
          src="/images/bmw-m4.webp"
          alt="BMW M4"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#101b2d] via-[#101b2d]/80 to-black/20" />

        <div className="relative z-10 max-w-[1280px] mx-auto px-8 py-24 text-white">
          <p className="text-[#e8a88a] font-extrabold mb-3">
            FIND YOUR PARTS
          </p>

          <h2 className="text-6xl font-extrabold max-w-3xl leading-tight">
            Find the Right Car Parts Faster.
          </h2>

          <p className="text-slate-300 text-xl mt-5 max-w-2xl">
            Search, compare, and buy compatible car parts for your saved
            vehicles with FYP smart fitment.
          </p>

          <div className="mt-8 bg-white rounded-2xl shadow-xl p-3 flex max-w-2xl">
            <input
              className="flex-1 px-5 text-black outline-none"
              placeholder="Search brake pads, oil filters, spark plugs..."
            />

            <Link
              href="/parts"
              className="bg-[#e8a88a] text-white px-8 py-4 rounded-xl font-extrabold"
            >
              Search
            </Link>
          </div>

          <div className="flex gap-4 mt-8">
            <Link
              href="/parts"
              className="bg-white text-[#101b2d] px-7 py-4 rounded-xl font-extrabold"
            >
              Shop Parts
            </Link>

            <Link
              href="/garage"
              className="border border-white text-white px-7 py-4 rounded-xl font-extrabold"
            >
              My Garage
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-[1280px] mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-20 relative z-20">
          {featuredCars.map((car) => (
            <div
              key={car.name}
              className="bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              <img
                src={car.image}
                alt={car.name}
                className="h-52 w-full object-cover"
              />

              <div className="p-6">
                <h3 className="text-2xl font-extrabold">{car.name}</h3>
                <p className="text-gray-600 mt-2">{car.text}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <div className="flex justify-between items-end mb-6">
            <div>
              <p className="text-[#e8a88a] font-bold">Popular Categories</p>
              <h2 className="text-4xl font-extrabold">Shop by Part Type</h2>
            </div>

            <Link href="/parts" className="font-extrabold text-[#e8a88a]">
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(([title, img, href]) => (
              <Link
                key={title}
                href={href}
                className="group bg-white rounded-3xl shadow overflow-hidden hover:shadow-xl transition"
              >
                <div className="h-60 bg-gray-100 overflow-hidden">
                  <img
                    src={`/images/${img}`}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-extrabold">{title}</h3>
                  <p className="text-gray-600 mt-2">
                    Browse compatible FYP verified components.
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 bg-[#101b2d] text-white rounded-3xl p-10 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-[#e8a88a] text-4xl mb-3">✅</p>
            <h3 className="text-2xl font-extrabold">Smart Fitment</h3>
            <p className="text-slate-300 mt-2">
              Match parts with your saved vehicle before checkout.
            </p>
          </div>

          <div>
            <p className="text-[#e8a88a] text-4xl mb-3">🚚</p>
            <h3 className="text-2xl font-extrabold">Fast Delivery</h3>
            <p className="text-slate-300 mt-2">
              Quick shipping for essential components and service parts.
            </p>
          </div>

          <div>
            <p className="text-[#e8a88a] text-4xl mb-3">🛡️</p>
            <h3 className="text-2xl font-extrabold">Warranty Ready</h3>
            <p className="text-slate-300 mt-2">
              Track specs, purchases, service history, and compatibility.
            </p>
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