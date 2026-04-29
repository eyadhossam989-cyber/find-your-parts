"use client";

import Link from "next/link";
import { useState } from "react";

const cars = [
  {
    name: "2021 BMW M4 Competition",
    details: "G82 • 2021 • 12,400 mi",
    image: "/images/bmw-m4.webp",
  },
  {
    name: "Porsche 911 (992)",
    details: "2022 • Carrera S",
    image: "/images/porsche-911.jpg",
  },
  {
    name: "Audi RS5 Sportback",
    details: "2020 • Quattro",
    image: "/images/audi-rs5.jpg",
  },
];

export default function AccountPage() {
  const [activeCar, setActiveCar] = useState(0);
  const car = cars[activeCar];

  return (
    <main className="min-h-screen bg-[#f5f6f8] flex text-[#0f172a]">
      <aside className="w-64 bg-[#101b2d] text-white p-6 flex flex-col">
        <Link href="/" className="text-5xl font-extrabold mb-2">
          F<span className="text-[#e8a88a]">Y</span>P
        </Link>

        <p className="text-sm text-slate-300 mb-10">Professional Account</p>

        <nav className="space-y-3">
          <Link className="block px-4 py-3 rounded-lg bg-[#e8a88a] font-semibold" href="/account">
            Dashboard
          </Link>
          <Link className="block px-4 py-3 rounded-lg hover:bg-slate-800" href="/orders">
            Orders
          </Link>
          <Link className="block px-4 py-3 rounded-lg hover:bg-slate-800" href="/garage">
            Garage
          </Link>
          <Link className="block px-4 py-3 rounded-lg hover:bg-slate-800" href="/parts">
            Shop Parts
          </Link>
          <Link className="block px-4 py-3 rounded-lg hover:bg-slate-800" href="/cart">
            Cart
          </Link>
        </nav>

        <Link
          href="/parts"
          className="mt-auto bg-[#e8a88a] text-white font-bold py-3 rounded-lg text-center"
        >
          ⚡ Quick Order
        </Link>

        <Link href="/login" className="mt-6 text-sm text-slate-300">
          Log Out
        </Link>
      </aside>

      <section className="flex-1">
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
          <h2 className="text-4xl font-extrabold text-[#101b2d]">FYP</h2>

          <nav className="hidden lg:flex gap-8 text-sm font-bold text-black">
            <Link href="/parts">Shop Parts</Link>
            <Link href="/garage">Vehicle Selector</Link>
            <Link href="/parts/brake-pads">OEM Parts</Link>
            <Link href="/cart">Special Offers</Link>
          </nav>

          <input
            className="bg-gray-100 border border-gray-200 rounded-full px-5 py-3 w-80 text-black"
            placeholder="Search components..."
          />
        </header>

        <div className="p-8 max-w-[1450px] mx-auto">
          <div className="relative overflow-hidden rounded-2xl mb-6 shadow-lg bg-[#101b2d]">
            <img
              src={car.image}
              alt={car.name}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#101b2d] via-[#101b2d]/80 to-black/20" />

            <div className="relative z-10 p-8 min-h-[300px] flex justify-between items-center">
              <div>
                <div className="bg-[#e8a88a] w-12 h-12 rounded-lg flex items-center justify-center text-2xl mb-4">
                  🚗
                </div>

                <p className="text-slate-200 text-lg">Active Vehicle</p>

                <h1 className="text-4xl font-extrabold text-white mt-1 max-w-xl">
                  {car.name}
                </h1>

                <p className="text-slate-200 mt-2">{car.details}</p>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() =>
                      setActiveCar((activeCar - 1 + cars.length) % cars.length)
                    }
                    className="bg-slate-700 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    Previous
                  </button>

                  <button
                    onClick={() => setActiveCar((activeCar + 1) % cars.length)}
                    className="bg-slate-700 text-white px-6 py-3 rounded-lg font-bold"
                  >
                    Next Car
                  </button>

                  <Link
                    href="/parts"
                    className="bg-[#e8a88a] text-white px-8 py-3 rounded-lg font-bold"
                  >
                    Find Parts
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2 mb-8">
            {cars.map((item, index) => (
              <button
                key={item.name}
                onClick={() => setActiveCar(index)}
                className={`h-3 rounded-full transition-all ${
                  activeCar === index
                    ? "w-10 bg-[#e8a88a]"
                    : "w-3 bg-slate-300"
                }`}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-between mb-5">
                <h3 className="text-2xl font-extrabold text-black">
                  Recent Orders
                </h3>
                <Link href="/orders" className="text-[#e8a88a] font-bold">
                  View All Orders
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border rounded-xl p-4">
                  <div>
                    <p className="font-extrabold text-black">
                      Brembo GT Series Brake Kit
                    </p>
                    <p className="text-gray-700">
                      Order #AP-88291 • Nov 12, 2024
                    </p>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold text-sm">
                    In Transit
                  </span>
                </div>

                <div className="flex justify-between items-center border rounded-xl p-4">
                  <div>
                    <p className="font-extrabold text-black">
                      K&amp;N High-Flow Air Filter
                    </p>
                    <p className="text-gray-700">
                      Order #AP-88244 • Nov 08, 2024
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold text-sm">
                    Delivered
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-2xl font-extrabold text-black">
                  My Garage
                </h3>
                <Link
                  href="/garage"
                  className="bg-[#e8a88a] text-white w-8 h-8 rounded-lg font-bold flex items-center justify-center"
                >
                  +
                </Link>
              </div>

              <div className="space-y-4">
                {cars.map((item, index) => (
                  <button
                    key={item.name}
                    onClick={() => setActiveCar(index)}
                    className={`w-full text-left rounded-xl overflow-hidden border bg-white ${
                      activeCar === index
                        ? "border-[#e8a88a] shadow-md"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-full object-cover"
                    />
                    <div className="p-4">
                      <p className="font-extrabold text-black">{item.name}</p>
                      <p className="text-gray-700 text-sm">{item.details}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            {[
              ["💳", "Payment Methods", "Manage saved cards and billing info"],
              ["📍", "Shipping Addresses", "Update primary shipping locations"],
              ["🛡️", "Security & Login", "Change password and 2FA settings"],
              ["🔖", "Saved Items", "Access your parts wishlist"],
            ].map(([icon, title, text]) => (
              <div
                key={title}
                className="bg-white p-7 rounded-2xl shadow text-center hover:shadow-lg transition"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h4 className="font-extrabold text-black">{title}</h4>
                <p className="text-gray-700 text-sm mt-2">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#101b2d] text-white rounded-2xl p-8 mt-8 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-extrabold">
                Engine Efficiency Monitoring
              </h3>

              <p className="text-slate-300 mt-2">
                Connect your OBD-II scanner to sync vehicle health data.
              </p>

              <div className="flex gap-10 mt-8">
                <div>
                  <p className="text-slate-400 text-sm font-bold">
                    UPCOMING SERVICE
                  </p>
                  <p className="text-2xl font-extrabold">1,250 Miles</p>
                </div>

                <div>
                  <p className="text-slate-400 text-sm font-bold">OIL LIFE</p>
                  <p className="text-2xl font-extrabold text-[#e8a88a]">
                    82%
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-end gap-3 h-32">
              <div className="w-12 bg-slate-700 rounded-t h-12" />
              <div className="w-12 bg-slate-700 rounded-t h-20" />
              <div className="w-12 bg-[#e8a88a] rounded-t h-32" />
              <div className="w-12 bg-slate-700 rounded-t h-16" />
              <div className="w-12 bg-slate-700 rounded-t h-28" />
              <div className="w-12 bg-[#e8a88a] rounded-t h-24" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}