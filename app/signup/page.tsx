"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSignup() {
    setLoading(true);
    setMessage("");

    if (!fullName || !email || !password) {
      setMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setMessage("Account created successfully!");
    router.push("/account");
  }

  return (
    <main className="min-h-screen flex bg-[#f5f6f8] text-[#101827]">
      <section className="hidden lg:flex w-1/2 bg-[#101b2d] text-white relative overflow-hidden p-12 items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#101b2d] via-[#101b2d]/90 to-black/60" />

        <div className="relative z-10 max-w-lg">
          <h1 className="text-6xl font-extrabold mb-6">
            F<span className="text-[#e8a88a]">Y</span>P
          </h1>

          <h2 className="text-3xl font-extrabold mb-4">
            Find Your Parts Faster.
          </h2>

          <p className="text-slate-300 text-lg mb-10">
            Create your FYP account to save vehicles, track orders, and find
            compatible parts.
          </p>
        </div>
      </section>

      <section className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-4xl font-extrabold text-[#101b2d]">
            Create Account
          </h2>

          <p className="text-gray-600 mt-2 mb-8">
            Start sourcing high-quality parts today.
          </p>

          <div className="space-y-5">
            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {message && (
            <p className="mt-4 text-sm font-bold text-[#e8a88a]">{message}</p>
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#e8a88a] text-white py-4 rounded-xl font-extrabold mt-6 block text-center disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account →"}
          </button>

          <p className="text-center text-gray-600 mt-8">
            Already have an account?{" "}
            <Link href="/login" className="font-extrabold text-[#e8a88a]">
              Log In
            </Link>
          </p>

          <div className="text-center mt-3">
            <Link href="/" className="text-sm text-gray-400 hover:text-black">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}