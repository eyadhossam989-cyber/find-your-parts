"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ---------------- TYPES ----------------
type CartItem = {
  id: number;
  name: string;
  sku: string;
  price: number;
  qty: number;
  image: string;
};

// ---------------- COMPONENT: ITEM ----------------
function CartItemCard({
  item,
  updateQty,
  removeItem,
}: {
  item: CartItem;
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 flex gap-6 items-center border border-gray-100 shadow-sm hover:shadow-md transition">
      <Image
        src={item.image}
        alt={item.name}
        width={120}
        height={120}
        className="rounded-xl object-cover bg-gray-100"
      />

      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-extrabold">{item.name}</h3>
            <p className="text-sm text-gray-500">{item.sku}</p>
          </div>

          <p className="text-[#e8a88a] font-extrabold text-lg">
            ${item.price.toFixed(2)}
          </p>
        </div>

        <p className="text-green-600 text-xs mt-1 font-semibold">
          ● Perfect fit for your vehicle
        </p>

        <div className="flex justify-between items-center mt-4">
          {/* Quantity Counter */}
          <div className="flex items-center bg-gray-100 rounded-lg">
            <button
              onClick={() => updateQty(item.id, -1)}
              className="px-4 py-2 font-bold hover:bg-gray-200"
            >
              −
            </button>
            <span className="px-4 font-bold">{item.qty}</span>
            <button
              onClick={() => updateQty(item.id, 1)}
              className="px-4 py-2 font-bold hover:bg-gray-200"
            >
              +
            </button>
          </div>

          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-600 font-semibold"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- COMPONENT: EMPTY STATE ----------------
function EmptyCart() {
  return (
    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
      <h2 className="text-2xl font-extrabold mb-2">
        Your cart is empty
      </h2>
      <p className="text-gray-500 mb-6">
        Looks like you haven’t added any parts yet.
      </p>

      <Link
        href="/shop"
        className="inline-block bg-[#e8a88a] text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition"
      >
        Browse Parts →
      </Link>
    </div>
  );
}

// ---------------- COMPONENT: ORDER SUMMARY ----------------
function OrderSummary({
  subtotal,
  tax,
  total,
  count,
}: {
  subtotal: number;
  tax: number;
  total: number;
  count: number;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow sticky top-24 border">
      <h3 className="text-xl font-extrabold mb-6">
        Order Summary ({count})
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span className="text-green-600 font-semibold">FREE</span>
        </div>

        <div className="flex justify-between">
          <span>Tax (8%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t pt-4 flex justify-between text-lg font-extrabold">
          <span>Total</span>
          <span className="text-[#101b2d]">${total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className={`block w-full mt-6 py-3 text-center rounded-xl font-bold transition
        ${
          count > 0
            ? "bg-[#e8a88a] text-white hover:scale-[1.02] hover:shadow-lg"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Checkout →
      </Link>
    </div>
  );
}

// ---------------- MAIN PAGE ----------------
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage ONLY once
  useEffect(() => {
    const saved = localStorage.getItem("fyp-cart");

    if (saved) {
      setItems(JSON.parse(saved));
    } else {
      const defaultItems = [
        {
          id: 1,
          name: "Carbon-Ceramic Brake Pad Kit",
          sku: "BP-992-G82-OEM",
          price: 449,
          qty: 1,
          image: "/images/brake-pad.jpg",
        },
        {
          id: 2,
          name: "Performance Synthetic Oil Filter",
          sku: "OF-M-FILTER-PRO",
          price: 24.95,
          qty: 2,
          image: "/images/oil-filter.jpg",
        },
      ];

      setItems(defaultItems);
      localStorage.setItem("fyp-cart", JSON.stringify(defaultItems));
    }

    setLoaded(true);
  }, []);

  // Save updates
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("fyp-cart", JSON.stringify(items));
    }
  }, [items, loaded]);

  // Logic
  const updateQty = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, qty: Math.max(1, item.qty + delta) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);
  };

  // Calculations
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827] p-8">
      <div className="max-w-[1200px] mx-auto">

        <h1 className="text-3xl font-extrabold mb-6">
          Shopping Cart ({items.length})
        </h1>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ITEMS */}
            <div className="lg:col-span-8 space-y-5">
              {items.map((item) => (
                <CartItemCard
                  key={item.id}
                  item={item}
                  updateQty={updateQty}
                  removeItem={removeItem}
                />
              ))}
            </div>

            {/* SUMMARY */}
            <div className="lg:col-span-4">
              <OrderSummary
                subtotal={subtotal}
                tax={tax}
                total={total}
                count={items.length}
              />
            </div>

          </div>
        )}
      </div>
    </main>
  );
}