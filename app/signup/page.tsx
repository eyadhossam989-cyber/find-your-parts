"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      localStorage.setItem("fyp-user-name", name);
      router.push("/parts");
    }
  };

  return (
    // min-h-[calc(100vh-96px)] ensures it fits perfectly under your 24px (h-24) Navbar
    <main className="min-h-[calc(100vh-96px)] bg-[#f5f6f8] flex items-center justify-center p-4">
      <div className="max-w-[450px] w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-10 border border-gray-100 animate-in fade-in zoom-in duration-500">
        
        {/* Logo & Header */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <h1 className="text-5xl font-black text-[#101b2d] tracking-tighter">
              F<span className="text-[#e8a88a]">Y</span>P
            </h1>
          </div>
          <h2 className="text-2xl font-extrabold text-[#101b2d]">Create Account</h2>
          <p className="text-gray-400 font-bold text-sm mt-1">Join the professional parts network</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          {/* Full Name Input */}
          <div className="group">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block tracking-widest">
              Full Name
            </label>
            <input 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#f5f6f8] border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a] transition-all font-bold text-[#101b2d] placeholder:text-gray-300" 
              placeholder="e.g. Alex M-Power" 
            />
          </div>

          {/* Email Input */}
          <div className="group">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block tracking-widest">
              Email Address
            </label>
            <input 
              type="email"
              required
              className="w-full bg-[#f5f6f8] border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a] transition-all font-bold text-[#101b2d] placeholder:text-gray-300" 
              placeholder="alex@m-series.com" 
            />
          </div>

          {/* Password Input */}
          <div className="group">
            <label className="text-[10px] font-black uppercase text-gray-400 ml-4 mb-1 block tracking-widest">
              Password
            </label>
            <input 
              type="password"
              required
              className="w-full bg-[#f5f6f8] border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#e8a88a] transition-all font-bold text-[#101b2d] placeholder:text-gray-300" 
              placeholder="••••••••" 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-[#101b2d] text-white py-5 rounded-2xl font-black mt-4 hover:bg-black transition-all shadow-xl shadow-[#101b2d]/10 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Start Building <span>🚀</span>
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
          <p className="text-sm text-gray-400 font-bold">
            Already a member? <Link href="/login" className="text-[#e8a88a] hover:underline ml-1">Log In →</Link>
          </p>
        </div>
      </div>
    </main>
  );
}