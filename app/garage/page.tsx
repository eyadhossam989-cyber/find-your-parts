"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface ServiceRecord {
  date: string;
  type: string;
  mileage: string;
  notes: string;
}

interface Car {
  id: string;
  year: string;
  make: string;
  model: string;
  image: string;
  mileage: number;
  engine: string;
  status: "Optimal" | "Service Due" | "Track Ready" | "Needs Attention";
  match: number;
  chassis: string;
  tires: string;
  oil: string;
  tag: string;
  color: string;
  vin: string;
  nextService: number;
  serviceHistory: ServiceRecord[];
  category: "Sport" | "Daily" | "Track" | "Luxury";
}

// ─── FYP PRODUCTS ─────────────────────────────────────────────────────────────
const fypProducts = [
  {
    id: "brake-pads",
    name: "FYP Ceramic Brake Pads",
    price: 189.5,
    image: "/images/brake-pads.jpg",
    category: "Brakes",
    fitments: ["bmw", "porsche", "audi"],
    urgency: "high" as const,
    description: "High-density carbon ceramic compound for superior stopping power.",
    link: "/parts/brake-pads",
  },
  {
    id: "motor-oil",
    name: "5W-30 Full Synthetic Motor Oil",
    price: 58.0,
    image: "/images/motor-oil.jpg",
    category: "Engine",
    fitments: ["bmw", "audi"],
    urgency: "medium" as const,
    description: "Full synthetic formula engineered for high-performance engines.",
    link: "/parts/motor-oil",
  },
  {
    id: "spark-plug",
    name: "Spark Plug Set",
    price: 18.5,
    image: "/images/spark-plug.jpg",
    category: "Ignition",
    fitments: ["bmw", "porsche"],
    urgency: "low" as const,
    description: "Iridium-tipped spark plugs for clean ignition and peak efficiency.",
    link: "/parts/spark-plug",
  },
  {
    id: "oil-filter",
    name: "Heavy-Duty Oil Filter",
    price: 24.0,
    image: "/images/oil-filter.jpg",
    category: "Engine",
    fitments: ["bmw", "audi", "porsche"],
    urgency: "medium" as const,
    description: "OEM-grade spin-on filter trapping contaminants to 10 microns.",
    link: "/parts/oil-filter",
  },
  {
    id: "air-filter",
    name: "Air Intake Filter",
    price: 34.0,
    image: "/images/cabin-filter.jpg",
    category: "Intake",
    fitments: ["bmw", "audi"],
    urgency: "low" as const,
    description: "High-flow pleated media for maximum intake efficiency.",
    link: "/parts/air-filter",
  },
  {
    id: "floor-mat",
    name: "All-Weather Floor Mat",
    price: 129.0,
    image: "/images/floor-mat.jpg",
    category: "Interior",
    fitments: ["bmw", "audi", "porsche"],
    urgency: "low" as const,
    description: "Custom-cut premium rubber with anti-slip backing.",
    link: "/parts/floor-mat",
  },
];

// ─── FLEET DATA ───────────────────────────────────────────────────────────────
const initialFleet: Car[] = [
  {
    id: "bmw",
    year: "2021",
    make: "BMW",
    model: "M4 Competition",
    image: "/images/bmw-m4.webp",
    mileage: 12450,
    engine: "3.0L I6 TT",
    status: "Optimal",
    match: 98,
    chassis: "G82",
    tires: "275/35 R19 / 285/30 R20",
    oil: "0W-30 Synthetic",
    tag: "ACTIVE VEHICLE",
    color: "#3b82f6",
    vin: "WBS83CH0XM2C12345",
    nextService: 15000,
    category: "Sport",
    serviceHistory: [
      { date: "2024-11-12", type: "Oil Change", mileage: "10,200 mi", notes: "Used 0W-30 full synthetic" },
      { date: "2024-06-05", type: "Brake Inspection", mileage: "8,900 mi", notes: "Front pads at 60%" },
      { date: "2023-12-01", type: "Annual Service", mileage: "6,100 mi", notes: "All clear, filter replaced" },
    ],
  },
  {
    id: "porsche",
    year: "2022",
    make: "Porsche",
    model: "911 GT3",
    image: "/images/porsche-gt3.jpg",
    mileage: 4200,
    engine: "4.0L Flat-6",
    status: "Track Ready",
    match: 100,
    chassis: "992",
    tires: "255/35 R20 / 315/30 R21",
    oil: "0W-40 Synthetic",
    tag: "PRECISION SPEC",
    color: "#a855f7",
    vin: "WP0AC2A94NS272000",
    nextService: 7500,
    category: "Track",
    serviceHistory: [
      { date: "2025-01-20", type: "PDK Service", mileage: "3,800 mi", notes: "Fluid exchange complete" },
      { date: "2024-08-14", type: "Tire Rotation", mileage: "2,100 mi", notes: "No uneven wear detected" },
    ],
  },
  {
    id: "audi",
    year: "2023",
    make: "Audi",
    model: "RS6 Avant",
    image: "/images/audi-rs6.jpg",
    mileage: 8900,
    engine: "4.0L V8 TT",
    status: "Service Due",
    match: 85,
    chassis: "C8",
    tires: "285/30 R22",
    oil: "5W-30 Synthetic",
    tag: "DAILY DRIVER",
    color: "#f59e0b",
    vin: "WUAPBAF24PN901234",
    nextService: 10000,
    category: "Luxury",
    serviceHistory: [
      { date: "2024-09-30", type: "Oil Change", mileage: "6,800 mi", notes: "Overdue — completed late" },
      { date: "2024-03-15", type: "Cabin Filter", mileage: "4,100 mi", notes: "Replaced air + cabin filter" },
    ],
  },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const statusConfig: Record<Car["status"], { color: string; bg: string; dot: string; border: string }> = {
  Optimal: { color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400", border: "border-emerald-400/20" },
  "Track Ready": { color: "text-violet-400", bg: "bg-violet-400/10", dot: "bg-violet-400", border: "border-violet-400/20" },
  "Service Due": { color: "text-amber-400", bg: "bg-amber-400/10", dot: "bg-amber-400", border: "border-amber-400/20" },
  "Needs Attention": { color: "text-red-400", bg: "bg-red-400/10", dot: "bg-red-400", border: "border-red-400/20" },
};

const ACCENT_COLORS = ["#e85d04", "#3b82f6", "#a855f7", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#06b6d4"];

// ─── IMAGE SEARCH HOOK ────────────────────────────────────────────────────────
function useCarImageSearch() {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const fetchImage = useCallback(async (year: string, make: string, model: string, index = 0) => {
    if (!make && !model) return;
    setLoading(true);
    const query = encodeURIComponent(`${make} ${model} car`);
    const cacheBust = Date.now() + index;
    const url = `https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80`; // Stable safe placeholder image URL
    setImage(url);
    setLoading(false);
  }, []);

  const tryAnother = useCallback((year: string, make: string, model: string) => {
    const next = imageIndex + 1;
    setImageIndex(next);
    fetchImage(year, make, model, next);
  }, [imageIndex, fetchImage]);

  const reset = useCallback(() => {
    setImage("");
    setImageIndex(0);
  }, []);

  return { image, loading, fetchImage, tryAnother, reset, setImage };
}

// ─── ANIMATED RING ────────────────────────────────────────────────────────────
function Ring({ percent, color, size = 64, stroke = 5 }: { percent: number; color: string; size?: number; stroke?: number }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(percent, 100)) / 100;
  return (
    <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        stroke={color}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)" }}
      />
    </svg>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#0d1525] border border-white/10 rounded-2xl px-5 py-3.5 shadow-2xl"
      style={{ animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      <span className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 text-xs font-black flex-shrink-0">✓</span>
      <p className="text-white text-sm font-bold">{message}</p>
      <button onClick={onDismiss} className="text-white/30 hover:text-white/60 ml-1 transition-colors text-lg leading-none">×</button>
    </div>
  );
}

// ─── ADD VEHICLE MODAL ────────────────────────────────────────────────────────
function AddVehicleModal({ onClose, onAdd }: { onClose: () => void; onAdd: (car: Car) => void }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    year: "", make: "", model: "", engine: "", chassis: "", tires: "", oil: "", vin: "", color: "#e85d04", category: "Daily" as Car["category"],
  });
  const { image, loading, fetchImage, tryAnother, reset, setImage } = useCarImageSearch();

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleNext = async () => {
    if (step === 1) {
      await fetchImage(form.year, form.make, form.model);
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    const newCar: Car = {
      id: `car-${Date.now()}`,
      year: form.year,
      make: form.make,
      model: form.model,
      engine: form.engine,
      chassis: form.chassis,
      tires: form.tires,
      oil: form.oil,
      vin: form.vin,
      color: form.color,
      category: form.category,
      image: image || "/images/bmw-m4.webp",
      mileage: 0,
      status: "Optimal",
      match: 90,
      tag: form.category.toUpperCase(),
      nextService: 5000,
      serviceHistory: [],
    };
    onAdd(newCar);
    onClose();
  };

  const steps = ["Identity", "Specs", "Confirm"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0d1525] border border-white/8 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[#e8a88a] text-[10px] font-black tracking-[0.2em] uppercase mb-1">Fleet Management</p>
              <h2 className="text-2xl font-black text-white tracking-tight">Add New Vehicle</h2>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 text-lg">×</button>
          </div>
          <div className="flex items-center gap-3">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-2 ${i + 1 <= step ? "opacity-100" : "opacity-30"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i + 1 < step ? "bg-[#e8a88a] text-white" : i + 1 === step ? "bg-white/10 text-white ring-2 ring-[#e8a88a]/50" : "bg-white/5 text-white/40"}`}>
                    {i + 1 < step ? "✓" : i + 1}
                  </div>
                  <span className="text-xs font-bold text-white/60">{label}</span>
                </div>
                {i < steps.length - 1 && <div className={`flex-1 h-px ${i + 1 < step ? "bg-[#e8a88a]/40" : "bg-white/8"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {[["year", "Year"], ["make", "Make"], ["model", "Model"], ["engine", "Engine"]].map(([k, pl]) => (
                  <div key={k}>
                    <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-1.5">{pl}</label>
                    <input value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm outline-none" />
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {[["chassis", "Chassis"], ["tires", "Tires"], ["oil", "Oil Type"], ["vin", "VIN"]].map(([k, pl]) => (
                <div key={k}>
                  <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-1.5">{pl}</label>
                  <input value={form[k as keyof typeof form] as string} onChange={(e) => set(k, e.target.value)} className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-white text-sm outline-none" />
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <>
              <div className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden">
                {[["Vehicle", `${form.year} ${form.make} ${form.model}`], ["Engine", form.engine], ["Chassis", form.chassis], ["Tires", form.tires], ["Oil", form.oil]].map(([label, val], i) => (
                  <div key={label} className={`flex justify-between items-center px-5 py-3 ${i > 0 ? "border-t border-white/4" : ""}`}>
                    <span className="text-white/30 text-xs font-black uppercase">{label}</span>
                    <span className="text-white text-sm font-bold">{val || "—"}</span>
                  </div>
                ))}
              </div>
              <div>
                <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-2">Accent Color</label>
                <div className="flex gap-2.5">
                  {ACCENT_COLORS.map((c) => (
                    <button key={c} onClick={() => set("color", c)} className={`w-8 h-8 rounded-full ${form.color === c ? "ring-2 ring-white scale-110" : ""}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="px-8 pb-8 pt-4 flex gap-3 border-t border-white/5">
          {step > 1 && <button onClick={() => setStep((s) => s - 1)} className="px-6 py-3.5 bg-white/5 text-white rounded-xl font-black text-sm">Back</button>}
          {step < 3 ? (
            <button onClick={handleNext} disabled={step === 1 && !form.make} className="flex-1 bg-[#e8a88a] text-white py-3.5 rounded-xl font-black text-sm">Continue</button>
          ) : (
            <button onClick={handleSubmit} className="flex-1 bg-[#e8a88a] text-white py-3.5 rounded-xl font-black text-sm">Add Vehicle</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SERVICE LOG MODAL ────────────────────────────────────────────────────────
function ServiceModal({ car, onClose, onAddRecord }: { car: Car; onClose: () => void; onAddRecord: (carId: string, record: ServiceRecord) => void }) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ date: "", type: "", mileage: "", notes: "" });

  const handleAdd = () => {
    if (!form.type) return;
    onAddRecord(car.id, form);
    setAdding(false);
    setForm({ date: "", type: "", mileage: "", notes: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0d1525] border border-white/8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/5">
          <h2 className="text-xl font-black text-white">{car.make} {car.model} Log</h2>
          <button onClick={onClose} className="text-white/40 text-lg">×</button>
        </div>
        <div className="px-7 py-5 space-y-2 overflow-y-auto flex-1">
          {car.serviceHistory.map((rec, i) => (
            <div key={i} className="flex justify-between bg-white/3 border border-white/5 rounded-2xl p-4">
              <div>
                <p className="text-white font-black text-sm">{rec.type}</p>
                <p className="text-white/40 text-xs mt-0.5">{rec.notes}</p>
              </div>
              <div className="text-right">
                <p className="text-[#e8a88a] text-xs font-black">{rec.mileage}</p>
                <p className="text-white/25 text-xs">{rec.date}</p>
              </div>
            </div>
          ))}
          {adding ? (
            <div className="bg-white/3 p-4 rounded-2xl space-y-2">
              <input placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2 text-white text-sm" />
              <input placeholder="Mileage" value={form.mileage} onChange={(e) => setForm({ ...form, mileage: e.target.value })} className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2 text-white text-sm" />
              <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2 text-white text-sm" />
              <button onClick={handleAdd} className="w-full bg-[#e8a88a] text-white py-2 rounded-xl text-xs font-bold">Save Record</button>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} className="w-full border border-dashed border-white/10 rounded-2xl py-4 text-white/25 text-xs font-black">+ Add Record</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EDIT CAR MODAL (REPAIRED & COMPLETED) ───────────────────────────────────
function EditCarModal({ car, onClose, onSave, onDelete }: { car: Car; onClose: () => void; onSave: (car: Car) => void; onDelete: (id: string) => void }) {
  const [form, setForm] = useState({ ...car });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = (k: keyof Car, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-[#0d1525] border border-white/8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/5">
          <h2 className="text-xl font-black text-white">Edit {car.make} {car.model}</h2>
          <button onClick={onClose} className="text-white/40 text-lg">×</button>
        </div>

        <div className="px-7 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            {["year", "make", "model", "engine", "chassis", "tires", "oil", "vin"].map((k) => (
              <div key={k}>
                <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-1.5">{k}</label>
                <input value={String(form[k as keyof Car] ?? "")} onChange={(e) => set(k as keyof Car, e.target.value)} className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm" />
              </div>
            ))}
          </div>

          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-1.5">Mileage</label>
            <input type="number" value={form.mileage} onChange={(e) => set("mileage", parseInt(e.target.value) || 0)} className="w-full bg-white/5 border border-white/8 rounded-xl px-4 py-2.5 text-white text-sm" />
          </div>

          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-2">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {["Optimal", "Service Due", "Track Ready", "Needs Attention"].map((s) => (
                <button key={s} onClick={() => set("status", s)} className={`py-2.5 rounded-xl text-xs font-black ${form.status === s ? "bg-[#e8a88a] text-white" : "bg-white/5 text-white/40"}`}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-2">Accent Color</label>
            <div className="flex gap-2.5">
              {ACCENT_COLORS.map((c) => (
                <button key={c} onClick={() => set("color", c)} className={`w-8 h-8 rounded-full ${form.color === c ? "ring-2 ring-white scale-110" : ""}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </div>

        <div className="px-7 pb-7 pt-4 border-t border-white/5 flex gap-3">
          {confirmDelete ? (
            <>
              <p className="text-red-400 text-xs font-bold flex-1 self-center">Remove vehicle permanently?</p>
              <button onClick={() => setConfirmDelete(false)} className="px-4 py-3 bg-white/5 text-white rounded-xl text-xs">No</button>
              <button onClick={() => { onDelete(car.id); onClose(); }} className="px-4 py-3 bg-red-500/20 text-red-400 rounded-xl text-xs">Yes, Remove</button>
            </>
          ) : (
            <>
              <button onClick={() => setConfirmDelete(true)} className="px-4 py-3 bg-red-500/10 text-red-400/70 rounded-xl text-xs">Delete</button>
              <button onClick={onClose} className="flex-1 bg-white/5 text-white py-3 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { onSave(form); onClose(); }} className="flex-1 bg-[#e8a88a] text-white py-3 rounded-xl text-sm">Save Changes</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub }: { icon: string; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:bg-white/5 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{icon}</span>
        <span className="text-white/10 text-xs font-black uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-white font-black text-xl leading-none">{value}</p>
      {sub && <p className="text-white/25 text-xs mt-1.5 font-bold">{sub}</p>}
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function GaragePage() {
  const [fleet, setFleet] = useState<Car[]>(initialFleet);
  const [activeCar, setActiveCar] = useState<Car>(initialFleet[0]);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "service" | "shop">("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const syncActive = (updated: Car[]) => {
    const found = updated.find((c) => c.id === activeCar?.id);
    if (found) setActiveCar(found);
  };

  const handleAddCar = (car: Car) => {
    const updated = [...fleet, car];
    setFleet(updated);
    setActiveCar(car);
    setActiveTab("overview");
    setToast(`${car.year} ${car.make} ${car.model} added`);
  };

  const handleSaveCar = (updated: Car) => {
    const newFleet = fleet.map((c) => (c.id === updated.id ? updated : c));
    setFleet(newFleet);
    setActiveCar(updated);
    setToast("Vehicle updated");
  };

  const handleDeleteCar = (id: string) => {
    const newFleet = fleet.filter((c) => c.id !== id);
    setFleet(newFleet);
    if (activeCar?.id === id) setActiveCar(newFleet[0]);
    setToast("Vehicle removed");
  };

  const handleAddRecord = (carId: string, record: ServiceRecord) => {
    const newFleet = fleet.map((c) => c.id === carId ? { ...c, serviceHistory: [record, ...c.serviceHistory] } : c);
    setFleet(newFleet);
    syncActive(newFleet);
    setToast("Record added");
  };

  const filteredFleet = fleet.filter((c) => `${c.year} ${c.make} ${c.model}`.toLowerCase().includes(search.toLowerCase()));
  const recommendations = fypProducts.filter((p) => p.fitments.includes(activeCar?.id || ""));
  const urgentRecs = recommendations.filter((p) => p.urgency === "high" || (activeCar?.status === "Service Due" && p.urgency === "medium"));
  const mileagePct = activeCar ? Math.min((activeCar.mileage / activeCar.nextService) * 100, 100) : 0;
  const statusCfg = activeCar ? statusConfig[activeCar.status] : statusConfig["Optimal"];
  const milesLeft = activeCar ? activeCar.nextService - activeCar.mileage : 0;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "◈" },
    { id: "specs" as const, label: "Specs", icon: "⚙" },
    { id: "service" as const, label: "Service", icon: "🔧", badge: activeCar?.status === "Service Due" ? 1 : 0 },
    { id: "shop" as const, label: "Shop", icon: "🛒", badge: urgentRecs.length },
  ];

  if (!activeCar) return <div className="text-white p-10">No active vehicles in the garage.</div>;

  return (
    <>
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
      {showAddModal && <AddVehicleModal onClose={() => setShowAddModal(false)} onAdd={handleAddCar} />}
      {showServiceModal && <ServiceModal car={activeCar} onClose={() => setShowServiceModal(false)} onAddRecord={handleAddRecord} />}
      {showEditModal && <EditCarModal car={activeCar} onClose={() => setShowEditModal(false)} onSave={handleSaveCar} onDelete={handleDeleteCar} />}

      <main className="min-h-screen bg-[#060e1a] pb-20 text-white">
        <nav className="sticky top-0 z-40 bg-[#060e1a]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-6">
          <span className="font-black">Find Your Parts Dashboard</span>
          <button onClick={() => setShowAddModal(true)} className="bg-[#e8a88a] px-4 py-2 rounded-xl text-xs font-black">Add Vehicle</button>
        </nav>

        <div className="max-w-[1320px] mx-auto px-6 pt-8">
          <h1 className="text-4xl font-black">{activeCar.year} {activeCar.make} {activeCar.model}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <StatCard icon="📊" label="Mileage" value={`${activeCar.mileage.toLocaleString()} mi`} sub={`Next Service at ${activeCar.nextService.toLocaleString()} mi`} />
            <StatCard icon="⚡" label="Engine" value={activeCar.engine} />
            <StatCard icon="🛠" label="Chassis" value={activeCar.chassis} />
            <StatCard icon="🔴" label="Status" value={activeCar.status} />
          </div>

          <div className="flex gap-4 mt-8 border-b border-white/10 pb-2">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`pb-2 text-sm font-bold ${activeTab === tab.id ? "text-[#e8a88a] border-b-2 border-[#e8a88a]" : "text-white/40"}`}>
                {tab.icon} {tab.label} {tab.badge > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">{tab.badge}</span>}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "overview" && (
              <div className="bg-white/3 p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold text-lg mb-4">Vehicle Health Overview</h3>
                <p className="text-sm text-white/60">Your {activeCar.model} is running smoothly. Remaining lifetime threshold configuration to next suggested interval cycle: <strong className="text-white">{milesLeft.toLocaleString()} miles</strong>.</p>
              </div>
            )}
            {activeTab === "specs" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/3 p-4 rounded-xl"><strong>Tire Size:</strong> {activeCar.tires}</div>
                <div className="bg-white/3 p-4 rounded-xl"><strong>Oil Specification:</strong> {activeCar.oil}</div>
                <div className="bg-white/3 p-4 rounded-xl"><strong>VIN Reference:</strong> {activeCar.vin}</div>
                <div className="bg-white/3 p-4 rounded-xl"><strong>Category:</strong> {activeCar.category}</div>
              </div>
            )}
            {activeTab === "service" && (
              <div className="space-y-4">
                <button onClick={() => setShowServiceModal(true)} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold">Open Complete History Logs</button>
              </div>
            )}
            {activeTab === "shop" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendations.map((prod) => (
                  <div key={prod.id} className="bg-white/3 border border-white/5 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-sm">{prod.name}</h4>
                      <p className="text-xs text-white/40 mt-1">{prod.description}</p>
                    </div>
                    <span className="text-emerald-4<span className="text-emerald-400 font-bold">${prod.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}