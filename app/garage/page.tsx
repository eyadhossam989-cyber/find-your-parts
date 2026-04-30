"use client";
import { useState } from "react";

// 1. DATA OBJECT: Holds all the info for your fleet
const fleetData = {
  bmw: {
    id: "bmw",
    year: "2021",
    make: "BMW",
    model: "M4 Competition",
    image: "/images/bmw-m4.webp",
    mileage: "12,450 mi",
    engine: "3.0L I6 TT",
    status: "Optimal",
    match: 98,
    chassis: "G82",
    tires: "275/35 R19 / 285/30 R20",
    oil: "0W-30 Synthetic",
    tag: "ACTIVE VEHICLE"
  },
  porsche: {
    id: "porsche",
    year: "2022",
    make: "Porsche",
    model: "911 GT3",
    image: "/images/porsche-gt3.jpg",
    mileage: "4,200 mi",
    engine: "4.0L Flat-6",
    status: "Track Ready",
    match: 100,
    chassis: "992",
    tires: "255/35 R20 / 315/30 R21",
    oil: "0W-40 Synthetic",
    tag: "PRECISION SPEC"
  },
  audi: {
    id: "audi",
    year: "2023",
    make: "Audi",
    model: "RS6 Avant",
    image: "/images/audi-rs6.jpg",
    mileage: "8,900 mi",
    engine: "4.0L V8 TT",
    status: "Service Due",
    match: 85,
    chassis: "C8",
    tires: "285/30 R22",
    oil: "5W-30 Synthetic",
    tag: "DAILY DRIVER"
  }
};

export default function GaragePage() {
  // 2. STATE: Controls which car is currently "Active"
  const [activeCar, setActiveCar] = useState(fleetData.bmw);

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827] pb-20">
      <section className="max-w-[1280px] mx-auto p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <p className="text-[#e8a88a] font-black uppercase tracking-widest text-sm">Vehicle Management</p>
            <h2 className="text-6xl font-black text-[#101b2d] tracking-tighter">My Garage</h2>
          </div>
          <button className="bg-[#101b2d] text-white px-8 py-4 rounded-2xl font-black shadow-2xl hover:bg-black transition-all active:scale-95 flex items-center gap-2">
            <span className="text-xl">+</span> Add New Vehicle
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* PRIMARY VEHICLE DISPLAY (Dynamic) */}
          <div className="lg:col-span-8 relative overflow-hidden rounded-[2.5rem] shadow-2xl min-h-[450px] bg-[#101b2d] group">
            {/* Background Image with smooth transition effect */}
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-t from-[#101b2d] via-[#101b2d]/40 to-transparent z-10" />
                <img
                    src={activeCar.image}
                    alt={activeCar.model}
                    className="w-full h-full object-cover opacity-60"
                />
            </div>

            <div className="relative z-20 p-10 h-full flex flex-col justify-end">
              <div className="animate-in slide-in-from-left duration-500">
                <span className="bg-[#e8a88a] text-white px-5 py-2 rounded-full text-[10px] font-black tracking-widest mb-4 inline-block shadow-lg shadow-[#e8a88a]/30">
                    {activeCar.tag}
                </span>

                <h3 className="text-5xl font-black text-white leading-none">
                    {activeCar.year} <br />
                    <span className="text-[#e8a88a]">{activeCar.make}</span> {activeCar.model}
                </h3>

                <div className="flex flex-wrap gap-4 mt-8">
                    {[
                        { label: "MILEAGE", val: activeCar.mileage },
                        { label: "ENGINE", val: activeCar.engine },
                        { label: "STATUS", val: activeCar.status }
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 min-w-[140px]">
                            <p className="text-white/40 text-[10px] font-black tracking-widest mb-1">{stat.label}</p>
                            <p className="text-white text-xl font-black">{stat.val}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-4 mt-10">
                    <button className="bg-white text-[#101b2d] px-8 py-4 rounded-xl font-black hover:bg-[#e8a88a] hover:text-white transition-all shadow-xl active:scale-95">
                        Shop Fitment
                    </button>
                    <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-black hover:bg-white/20 transition-all active:scale-95">
                        Service History
                    </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIDE FLEET SELECTION */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Other Vehicles</h4>
            
            {Object.values(fleetData).filter(c => c.id !== activeCar.id).map((car) => (
              <div 
                key={car.id}
                onClick={() => setActiveCar(car)}
                className="group cursor-pointer bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative h-32 overflow-hidden">
                    <img src={car.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 bg-[#101b2d]/20 group-hover:bg-transparent transition-all" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-[#101b2d]">{car.year} {car.make} {car.model}</h3>
                  <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-tight">{car.mileage} • {car.status}</p>
                  <button className="w-full mt-4 bg-gray-50 text-[#101b2d] py-3 rounded-xl font-black text-xs hover:bg-[#101b2d] hover:text-white transition-all">
                    Select as Active
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COMPATIBILITY GAUGE (Dynamic) */}
          <div className="lg:col-span-12 bg-[#101b2d] text-white rounded-[2.5rem] shadow-2xl p-10 flex flex-col md:flex-row gap-10 items-center">
            <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#ffffff10" strokeWidth="8" />
                    <circle 
                        cx="50" cy="50" r="45" fill="none" stroke="#e8a88a" strokeWidth="8" 
                        strokeDasharray="283" 
                        strokeDashoffset={283 - (283 * activeCar.match) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-4xl font-black leading-none">{activeCar.match}%</p>
                    <p className="text-[10px] font-black text-white/40 tracking-widest mt-1">MATCH</p>
                </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-black tracking-tight">Smart Fitment Scan</h3>
              <p className="text-slate-400 mt-2 font-medium">
                We've verified your current shopping list against the <span className="text-[#e8a88a] font-black">{activeCar.make} {activeCar.model}</span> specs.
              </p>
              <div className="flex justify-center md:justify-start gap-6 mt-6">
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><span className="text-[#e8a88a]">✓</span> Chassis Verified</span>
                <span className="flex items-center gap-2 text-xs font-black uppercase tracking-widest"><span className="text-[#e8a88a]">✓</span> VIN Matched</span>
              </div>
            </div>

            <button className="bg-[#e8a88a] text-white px-10 py-5 rounded-2xl font-black shadow-lg shadow-[#e8a88a]/20 hover:scale-105 transition-all">
              Download Build Guide
            </button>
          </div>
        </div>

        {/* SPEC TABLE */}
        <section className="mt-16">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-3xl font-black text-[#101b2d] tracking-tighter">Garage Specifications</h3>
            <div className="h-[2px] flex-1 bg-gray-100" />
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Vehicle</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Chassis</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Tire Spec</th>
                  <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-400">Fluid Type</th>
                  <th className="p-6 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {Object.values(fleetData).map((car) => (
                  <tr key={car.id} className={`border-t border-gray-50 transition-colors ${activeCar.id === car.id ? 'bg-[#e8a88a]/5' : 'hover:bg-gray-50'}`}>
                    <td className="p-6">
                        <p className="font-black text-[#101b2d]">{car.make} {car.model}</p>
                        <p className="text-[10px] font-bold text-gray-400">{car.year}</p>
                    </td>
                    <td className="p-6 font-bold text-gray-600">{car.chassis}</td>
                    <td className="p-6 font-bold text-gray-600 text-sm">{car.tires}</td>
                    <td className="p-6 font-bold text-gray-600">{car.oil}</td>
                    <td className="p-6 text-right">
                      <button className="text-[#e8a88a] font-black text-xs uppercase hover:underline">Edit Setup</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}