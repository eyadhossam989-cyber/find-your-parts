"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Helper for active link styling
  const isActive = (path: string) => pathname === path;

  return (
    <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 px-8 lg:px-16 flex items-center justify-between shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] sticky top-0 z-50">
      
      {/* Brand Logo with Enhanced Glow */}
      <Link
        href="/"
        className="text-4xl font-black text-[#101b2d] tracking-tighter transition-all duration-300 hover:scale-105 active:scale-95 group"
      >
        F<span className="text-[#e8a88a] group-hover:drop-shadow-[0_0_8px_rgba(232,168,138,0.6)]">Y</span>P
      </Link>

      {/* Navigation Links with Animated Underlines */}
      <nav className="hidden md:flex items-center gap-10">
        {[
          { name: "Catalog", href: "/parts" },
          { name: "My Garage", href: "/garage" },
          { name: "Orders", href: "/orders" },
        ].map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`relative text-sm font-black uppercase tracking-widest transition-colors duration-300 group
              ${isActive(link.href) ? "text-[#e8a88a]" : "text-[#101b2d]/70 hover:text-[#101b2d]"}`}
          >
            {link.name}
            <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-[#e8a88a] transition-all duration-300 group-hover:w-full 
              ${isActive(link.href) ? "w-full" : ""}`} 
            />
          </Link>
        ))}
      </nav>

      {/* Action Buttons: Cart & Account */}
      <div className="flex items-center gap-5">
        <Link 
          href="/cart" 
          className="relative p-2 text-[#101b2d] hover:bg-gray-50 rounded-full transition-all group"
        >
          <span className="text-2xl">🛒</span>
          {/* Subtle Cart Notification Dot */}
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#e8a88a] rounded-full border-2 border-white animate-bounce" />
        </Link>

        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block" />

        <Link
          href="/account"
          className="flex items-center gap-3 bg-[#101b2d] text-white px-5 py-2.5 rounded-xl font-bold transition-all duration-300 hover:bg-[#1a2b47] hover:shadow-lg hover:shadow-[#101b2d]/20 active:scale-95 border border-white/10"
        >
          <div className="w-6 h-6 rounded-full bg-[#e8a88a] flex items-center justify-center text-[10px] text-[#101b2d]">
            👤
          </div>
          <span className="text-sm">Account</span>
        </Link>
      </div>
    </header>
  );
}