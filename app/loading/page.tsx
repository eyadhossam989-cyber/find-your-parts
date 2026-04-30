"use client";

export default function Loading() {
  return (
    <main className="min-h-[80vh] w-full flex flex-col items-center justify-center bg-[#f5f6f8]">
      <div className="relative flex flex-col items-center">
        
        {/* Animated Logo */}
        <div className="text-6xl font-black text-[#101b2d] tracking-tighter mb-8 animate-pulse">
          F<span className="text-[#e8a88a]">Y</span>P
        </div>

        {/* Custom Spinner */}
        <div className="relative w-20 h-20">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-[#101b2d]/5 rounded-full"></div>
          
          {/* Spinning High-Contrast Edge */}
          <div className="absolute inset-0 border-4 border-t-[#e8a88a] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          
          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl animate-bounce">🏎️</span>
          </div>
        </div>

        {/* Status Text */}
        <div className="mt-8 text-center">
          <p className="text-[#101b2d] font-black uppercase tracking-[0.2em] text-xs">
            Syncing Inventory
          </p>
          <div className="flex gap-1 justify-center mt-2">
            <div className="w-1.5 h-1.5 bg-[#e8a88a] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-1.5 h-1.5 bg-[#e8a88a] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-[#e8a88a] rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute bottom-10 opacity-20 text-[120px] font-black text-white select-none pointer-events-none">
        PERFORMANCE
      </div>
    </main>
  );
}