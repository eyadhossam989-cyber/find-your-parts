"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const router = useRouter();

  // Initialize client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    // 1. Sign up the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // CRITICAL: This saves the username to the user's metadata
        data: {
          username: username,
        },
        // Ensures they return to your Vercel site after email confirm
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    // 2. Success! 
    setLoading(false);
    setSuccess(true);
    
    // Optional: Save to localStorage for immediate UI feedback
    localStorage.setItem("fyp-user-name", username);

    // If you have "Confirm Email" OFF in Supabase, redirect immediately
    // If it's ON, they need to check their email first.
    setTimeout(() => {
        router.push("/parts");
    }, 2000);
  };

  return (
    <main className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-6 text-black">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-[#101b2d] tracking-tighter">
            JOIN <span className="text-[#e8a88a]">FYP</span>
          </h1>
          <p className="text-gray-500 font-bold mt-2">Start your performance journey.</p>
        </div>

        {success ? (
          <div className="text-center space-y-4">
            <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl font-bold">
              Account created successfully! Redirecting...
            </div>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-5">
            {errorMsg && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Username</label>
              <input 
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-4 mt-1 outline-none focus:ring-2 focus:ring-[#e8a88a] transition" 
                placeholder="M4_Enthusiast" 
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Email</label>
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-4 mt-1 outline-none focus:ring-2 focus:ring-[#e8a88a] transition" 
                placeholder="driver@fyp.com" 
              />
            </div>
            
            <div>
              <label className="text-xs font-black uppercase text-gray-400 ml-1">Password</label>
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-4 mt-1 outline-none focus:ring-2 focus:ring-[#e8a88a] transition" 
                placeholder="••••••••" 
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#101b2d] text-white py-4 rounded-xl font-black mt-2 hover:bg-black transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="text-center text-sm text-gray-500 font-bold">
            Already have an account? <Link href="/login" className="text-[#e8a88a] hover:underline">Log In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}