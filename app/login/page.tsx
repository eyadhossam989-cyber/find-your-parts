"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleLogin() {
    setLoading(true);
    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    router.push("/account");
  }

  return (
    <main className="min-h-screen flex bg-[#f5f6f8]">
      <div className="hidden lg:flex w-1/2 bg-[#101b2d] relative items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#101b2d] via-[#101b2d]/90 to-black" />

        <div className="relative z-10 text-white max-w-md">
          <h1 className="text-6xl font-extrabold mb-4">
            F<span className="text-[#e8a88a]">Y</span>P
          </h1>

          <p className="text-xl text-slate-300">
            Find Your Parts. Premium automotive components for professionals.
          </p>

          <div className="mt-8 space-y-3">
            <p>✔ Guaranteed Fitment</p>
            <p>✔ Fast Delivery</p>
            <p>✔ Premium OEM Quality</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl">
          <h2 className="text-4xl font-extrabold text-[#101b2d] mb-2">
            F<span className="text-[#e8a88a]">Y</span>P
          </h2>

          <p className="text-gray-600 mb-6">Sign in to your account</p>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && (
            <p className="mt-4 text-sm font-bold text-red-500">{message}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#e8a88a] text-white py-4 rounded-xl font-extrabold mt-6 block text-center hover:scale-[1.02] transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>

          <div className="text-center mt-6 text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#e8a88a] font-extrabold">
              Create one
            </Link>
          </div>

          <div className="text-center mt-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-black">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}