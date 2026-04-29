import Link from "next/link";

export default function Navbar() {
  return (
    <header className="h-20 bg-white/90 backdrop-blur border-b px-10 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link
        href="/"
        className="text-5xl font-extrabold text-[#101b2d] transition-all duration-300 hover:scale-105 hover:drop-shadow-[0_0_12px_rgba(232,168,138,0.8)]"
      >
        F<span className="text-[#e8a88a]">Y</span>P
      </Link>

      <nav className="hidden md:flex gap-8 text-sm font-bold text-black">
        <Link className="hover:text-[#e8a88a] transition" href="/parts">
          Catalog
        </Link>
        <Link className="hover:text-[#e8a88a] transition" href="/garage">
          My Garage
        </Link>
        <Link className="hover:text-[#e8a88a] transition" href="/orders">
          Orders
        </Link>
        <Link className="hover:text-[#e8a88a] transition" href="/cart">
          Cart
        </Link>
        <Link className="hover:text-[#e8a88a] transition" href="/login">
          Login
        </Link>
      </nav>
    </header>
  );
}