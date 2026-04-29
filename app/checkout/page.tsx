import Link from "next/link";

const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="w-11 h-11 rounded-xl bg-[#e8a88a]/15 text-[#e8a88a] flex items-center justify-center">
    {children}
  </div>
);

const TruckIcon = () => <span className="text-2xl">🚚</span>;
const AddressIcon = () => <span className="text-2xl">📍</span>;
const PaymentIcon = () => <span className="text-2xl">💳</span>;
const ShieldIcon = () => <span className="text-2xl">🛡️</span>;

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8] text-[#101827]">
      

      <section className="max-w-[1280px] mx-auto p-8">
        <div className="mb-8">
          <p className="text-[#e8a88a] font-bold">Secure Checkout</p>
          <h2 className="text-5xl font-extrabold text-[#101b2d]">Checkout</h2>
          <p className="text-gray-600 mt-2">
            Complete your purchase details below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <section className="bg-white rounded-3xl shadow p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox>
                  <AddressIcon />
                </IconBox>
                <div>
                  <h3 className="text-2xl font-extrabold">Shipping Address</h3>
                  <p className="text-gray-500 text-sm">
                    Where should we deliver your parts?
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  className="md:col-span-2 border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
                  placeholder="John Doe"
                />
                <input
                  className="md:col-span-2 border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
                  placeholder="123 Main St, Apt 4B"
                />
                <input
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
                  placeholder="Detroit"
                />
                <input
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
                  placeholder="MI"
                />
                <input
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
                  placeholder="48201"
                />
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox>
                  <TruckIcon />
                </IconBox>
                <div>
                  <h3 className="text-2xl font-extrabold">Delivery Method</h3>
                  <p className="text-gray-500 text-sm">
                    Choose how fast you want your order.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-[#101b2d] bg-[#101b2d]/5 rounded-2xl p-5 flex justify-between items-center">
                  <div>
                    <p className="font-extrabold">Standard Ground</p>
                    <p className="text-gray-600 text-sm">3–5 Business Days</p>
                  </div>
                  <b>$12.50</b>
                </div>

                <div className="border rounded-2xl p-5 flex justify-between items-center hover:border-[#e8a88a] transition">
                  <div>
                    <p className="font-extrabold">Express Shipping</p>
                    <p className="text-gray-600 text-sm">1–2 Business Days</p>
                  </div>
                  <b>$28.00</b>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl shadow p-8 border border-gray-100">
              <div className="flex items-center gap-4 mb-6">
                <IconBox>
                  <PaymentIcon />
                </IconBox>
                <div>
                  <h3 className="text-2xl font-extrabold">Payment Method</h3>
                  <p className="text-gray-500 text-sm">
                    Your payment is protected and encrypted.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button className="border-2 border-[#101b2d] rounded-xl py-3 font-bold bg-[#101b2d]/5">
                  💳 Credit Card
                </button>
                <button className="border rounded-xl py-3 font-bold hover:border-[#e8a88a] transition">
                  PayPal
                </button>
              </div>

              <input
                className="w-full border rounded-xl p-4 mb-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
                placeholder="0000 0000 0000 0000"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
                  placeholder="MM/YY"
                />
                <input
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#e8a88a]"
                  placeholder="123"
                />
              </div>
            </section>
          </div>

          <aside className="lg:col-span-4">
            <div className="bg-[#101b2d] text-white rounded-3xl shadow-xl p-8 sticky top-24">
              <h3 className="text-2xl font-extrabold border-b border-white/20 pb-5 mb-5">
                Order Summary
              </h3>

              <div className="space-y-5 mb-6">
                <div className="flex gap-4">
                  <img
                    src="/images/brake-pad.jpg"
                    className="w-16 h-16 rounded-xl object-cover bg-white"
                    alt="Brake pads"
                  />
                  <div>
                    <p className="font-bold">Ceramic Brake Pads - Front</p>
                    <p className="text-white/60 text-sm">QTY: 1</p>
                    <p className="font-bold">$89.99</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <img
                    src="/images/oil-filter.jpg"
                    className="w-16 h-16 rounded-xl object-cover bg-white"
                    alt="Oil filter"
                  />
                  <div>
                    <p className="font-bold">Heavy-Duty Oil Filter</p>
                    <p className="text-white/60 text-sm">QTY: 2</p>
                    <p className="font-bold">$24.00</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/20 pt-5 space-y-3">
                <div className="flex justify-between text-white/70">
                  <span>Subtotal</span>
                  <span className="text-white">$113.99</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Shipping</span>
                  <span className="text-white">$12.50</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>Tax</span>
                  <span className="text-white">$8.45</span>
                </div>
                <div className="flex justify-between text-2xl font-extrabold text-[#e8a88a] pt-4">
                  <span>Total</span>
                  <span>$134.94</span>
                </div>
              </div>

              <Link
                href="/orders"
                className="w-full bg-[#e8a88a] text-white mt-6 py-4 rounded-xl font-extrabold hover:scale-[1.01] transition block text-center"
              >
                Place Order →
              </Link>

              <div className="flex justify-center items-center gap-2 text-white/50 text-sm mt-5">
                <ShieldIcon />
                <span>Secure Checkout Guarantee</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow p-5 mt-6">
              <p className="text-center text-gray-600 text-sm mb-3">
                Have a promo code?
              </p>
              <div className="flex gap-2">
                <input
                  className="border rounded-xl px-4 py-3 flex-1"
                  placeholder="SAVE20"
                />
                <button className="bg-[#101b2d] text-white px-4 rounded-xl font-bold">
                  Apply
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <footer className="bg-[#101b2d] text-white mt-10 py-10 text-center">
        <h3 className="text-[#e8a88a] font-extrabold text-xl">FYP</h3>
        <p className="text-slate-400 text-sm mt-2">
          © 2026 Find Your Parts. Professional Grade Components.
        </p>
      </footer>
    </main>
  );
}