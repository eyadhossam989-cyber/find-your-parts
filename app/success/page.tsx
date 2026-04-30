"use client";
import { useEffect } from "react";
import Link from "next/link";

const CheckIcon = () => (
  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  </div>
);

export default function SuccessPage() {
  // 1. CLEAR THE CART: When the order is "placed," we wipe the memory
  useEffect(() => {
    localStorage.removeItem("fyp-cart");
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f6f8] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-gray-100">
        <CheckIcon />
        
        <h1 className="text-3xl font-extrabold text-[#101b2d] mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8">
          Your parts are being prepped for shipment. We've sent a receipt to your email.
        </p>

        <div className="bg-[#f5f6f8] rounded-2xl p-5 mb-8 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Order Number:</span>
            <span className="font-bold text-[#101b2d]">#FYP-8829-M4</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Estimated Delivery:</span>
            <span className="font-bold text-green-600">May 3rd - 5th</span>
          </div>
        </div>

        <div className="space-y-4">
          <Link 
            href="/" 
            className="w-full bg-[#101b2d] text-white py-4 rounded-xl font-bold block hover:bg-black transition"
          >
            Back to Dashboard
          </Link>
          
          <Link 
            href="/garage" 
            className="w-full text-[#e8a88a] font-bold block hover:underline transition"
          >
            View My Garage →
          </Link>
        </div>

        <p className="mt-8 text-xs text-gray-400">
          Need help? Contact support@findyourparts.com
        </p>
      </div>
    </main>
  );
}