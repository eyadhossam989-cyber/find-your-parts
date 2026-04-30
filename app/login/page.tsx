"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// Change: Import from the standard JS library instead of the broken helper
import { createClient } from "@supabase/supabase-js";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const router = useRouter();

  // Initialize client directly using your environment variables
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Set the name for your parts page UI
      const username = data.user.user_metadata?.username || "M4 Enthusiast";
      localStorage.setItem("fyp-user-name", username);
      
      router.push("/parts");
      router.refresh();
    }
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
          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-xs font-black uppercase text-gray-400 ml-1">Email</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-4 mt-1 outline-none focus:ring-2 focus:ring-[#e8a88a] transition text-black" 
              placeholder="driver@fyp.com" 
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-black uppercase text-gray-400">Password</label>
            </div>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-4 mt-1 outline-none focus:ring-2 focus:ring-[#e8a88a] transition text-black" 
              placeholder="••••••••" 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#101b2d] text-white py-4 rounded-xl font-black mt-2 hover:bg-black transition-all shadow-lg disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Secure Login →"}
          </button>
        </form>
      </div>
    </main>
  );
}