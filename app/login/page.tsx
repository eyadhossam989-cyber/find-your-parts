"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For the demo: If they log in, we'll give them a professional name 
    // unless they already signed up with one.
    const existingName = localStorage.getItem("fyp-user-name");
    if (!existingName) {
      localStorage.setItem("fyp-user-name", "M4 Enthusiast");
    }
    
    router.push("/parts");
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#101b2d] tracking-tighter">
            F<span className="text-[#e8a88a]">Y</span>P
          </h1>
          <p className="text-gray-500 font-bold mt-2">Welcome back, Captain.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Email</label>
            <input 
              type="email"
              required
              className="w-full border border-gray-200 rounded-xl p-4 mt-1 outline-none focus:ring-2 focus:ring-[#e8a88a] transition" 
              placeholder="driver@fyp.com" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black uppercase text-gray-400">Password</label>
              <Link href="#" className="text-[10px] font-black text-[#e8a88a] uppercase">Forgot?</Link>
            </div>
            <input 
              type="password"
              required
              className="w-full border border-gray-200 rounded-xl p-4 mt-1 outline-none focus:ring-2 focus:ring-[#e8a88a] transition" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-[#101b2d] text-white py-4 rounded-xl font-black mt-2 hover:bg-black transition-all shadow-lg active:scale-95"
          >
            Secure Login →
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500 font-bold">
            New to the platform? <Link href="/signup" className="text-[#e8a88a] hover:underline">Join FYP</Link>
          </p>
        </div>
      </div>
    </main>
  );
}