"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { supabase } from "@/lib/supabaseClient";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { cartCount } = useCart();

  const isActive = (path: string) => pathname === path;
  const isLoggedIn = Boolean(userName);

  // Get user from Supabase on mount + listen for auth changes
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Try full_name first, then email prefix as fallback
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          null;
        setUserName(name);
      } else {
        setUserName(null);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const name =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split("@")[0] ||
          null;
        setUserName(name);
      } else {
        setUserName(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserName(null);
    setIsDropdownOpen(false);
    router.push("/signup");
  };

  // Display name: real name, or email prefix, or "Guest"
  const displayName = userName ?? "Guest";

  return (
    <header className="h-24 bg-white/90 backdrop-blur-xl border-b border-gray-100 px-8 lg:px-16 flex items-center justify-between shadow-sm sticky top-0 z-50 transition-all duration-500 text-black">
      {/* Brand Logo */}
      <Link
        href="/"
        className="text-4xl font-black text-[#101b2d] tracking-tighter transition-all duration-300 hover:scale-105 group active:scale-95"
      >
        F
        <span className="text-[#e8a88a] group-hover:drop-shadow-[0_0_12px_rgba(232,168,138,0.8)] transition-all">
          Y
        </span>
        P
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-10">
        {[
          { name: "Catalog", href: "/parts" },
          { name: "My Garage", href: "/garage" },
          { name: "Orders", href: "/orders" },
        ].map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`relative text-sm font-black uppercase tracking-widest transition-all duration-300 group
              ${isActive(link.href) ? "text-[#e8a88a]" : "text-[#101b2d]/70 hover:text-[#101b2d]"}`}
          >
            {link.name}
            <span
              className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e8a88a] transition-all duration-300 group-hover:w-full
              ${isActive(link.href) ? "w-full" : ""}`}
            />
          </Link>
        ))}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center gap-5 relative" ref={dropdownRef}>
        <Link
          href="/cart"
          className="relative p-2 text-[#101b2d] hover:bg-gray-100 rounded-full transition-all group active:scale-90"
        >
          <span className="text-2xl transition-transform group-hover:rotate-12 inline-block">
            🛒
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#e85d04] text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>

        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block" />

        {/* Account Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-3 px-5 py-2.5 rounded-xl font-bold transition-all duration-300 border active:scale-95 shadow-sm
              ${
                !isLoggedIn
                  ? "bg-white border-[#101b2d] text-[#101b2d] hover:bg-gray-50"
                  : "bg-[#101b2d] text-white border-transparent hover:bg-black"
              }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors
              ${!isLoggedIn ? "bg-gray-100 text-gray-500" : "bg-[#e8a88a] text-[#101b2d]"}`}
            >
              👤
            </div>
            <span className="text-sm uppercase tracking-tighter">
              Hi, {displayName}
            </span>
            <span
              className={`text-[10px] opacity-50 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="px-5 py-4 border-b border-gray-50 mb-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
                  {isLoggedIn ? "Authenticated" : "Guest Access"}
                </p>
                <p className="text-base font-black text-[#101b2d]">
                  Hi, {displayName}
                </p>
              </div>

              <Link
                href="/account"
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#e8a88a] transition-all"
              >
                <span className="text-lg">🏎️</span> Account Page
              </Link>

              {!isLoggedIn && (
                <Link
                  href="/login"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-[#e8a88a] transition-all"
                >
                  <span className="text-lg">🔑</span> Sign In
                </Link>
              )}

              <div className="h-[1px] bg-gray-100 my-2 mx-3" />

              {isLoggedIn ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all text-left"
                >
                  <span className="text-lg">🚪</span> Sign Out
                </button>
              ) : (
                <Link
                  href="/signup"
                  onClick={() => setIsDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-5 py-3 text-sm font-bold text-[#e8a88a] hover:bg-orange-50 transition-all"
                >
                  <span className="text-lg">✨</span> Create Account
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
