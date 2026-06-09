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
    description:
      "High-density carbon ceramic compound for superior stopping power.",
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
    description:
      "Full synthetic formula engineered for high-performance engines.",
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
    description:
      "Iridium-tipped spark plugs for clean ignition and peak efficiency.",
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
    description:
      "OEM-grade spin-on filter trapping contaminants to 10 microns.",
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
      {
        date: "2024-11-12",
        type: "Oil Change",
        mileage: "10,200 mi",
        notes: "Used 0W-30 full synthetic",
      },
      {
        date: "2024-06-05",
        type: "Brake Inspection",
        mileage: "8,900 mi",
        notes: "Front pads at 60%",
      },
      {
        date: "2023-12-01",
        type: "Annual Service",
        mileage: "6,100 mi",
        notes: "All clear, filter replaced",
      },
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
      {
        date: "2025-01-20",
        type: "PDK Service",
        mileage: "3,800 mi",
        notes: "Fluid exchange complete",
      },
      {
        date: "2024-08-14",
        type: "Tire Rotation",
        mileage: "2,100 mi",
        notes: "No uneven wear detected",
      },
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
      {
        date: "2024-09-30",
        type: "Oil Change",
        mileage: "6,800 mi",
        notes: "Overdue — completed late",
      },
      {
        date: "2024-03-15",
        type: "Cabin Filter",
        mileage: "4,100 mi",
        notes: "Replaced air + cabin filter",
      },
    ],
  },
];

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────
const statusConfig: Record<
  Car["status"],
  { color: string; bg: string; dot: string; border: string }
> = {
  Optimal: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    dot: "bg-emerald-400",
    border: "border-emerald-400/20",
  },
  "Track Ready": {
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    dot: "bg-violet-400",
    border: "border-violet-400/20",
  },
  "Service Due": {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    dot: "bg-amber-400",
    border: "border-amber-400/20",
  },
  "Needs Attention": {
    color: "text-red-400",
    bg: "bg-red-400/10",
    dot: "bg-red-400",
    border: "border-red-400/20",
  },
};

const ACCENT_COLORS = [
  "#e85d04",
  "#3b82f6",
  "#a855f7",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
];

// ─── IMAGE SEARCH HOOK ────────────────────────────────────────────────────────
function useCarImageSearch() {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const fetchImage = useCallback(
    async (year: string, make: string, model: string, index = 0) => {
      if (!make && !model) return;
      setLoading(true);
      // Unsplash Source: free, no key required
      // Using a timestamp + index as cache-buster so "try another" actually gets a fresh image
      const query = encodeURIComponent(`${make} ${model} car`);
      const cacheBust = Date.now() + index;
      const url = `https://source.unsplash.com/800x450/?${query}&sig=${cacheBust}`;
      setImage(url);
      setLoading(false);
    },
    [],
  );

  const tryAnother = useCallback(
    (year: string, make: string, model: string) => {
      const next = imageIndex + 1;
      setImageIndex(next);
      fetchImage(year, make, model, next);
    },
    [imageIndex, fetchImage],
  );

  const reset = useCallback(() => {
    setImage("");
    setImageIndex(0);
  }, []);

  return { image, loading, fetchImage, tryAnother, reset, setImage };
}

// ─── ANIMATED RING ────────────────────────────────────────────────────────────
function Ring({
  percent,
  color,
  size = 64,
  stroke = 5,
}: {
  percent: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(percent, 100)) / 100;
  return (
    <svg
      width={size}
      height={size}
      className="-rotate-90"
      viewBox={`0 0 ${size} ${size}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={stroke}
      />
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
function Toast({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div
      className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-[#0d1525] border border-white/10 rounded-2xl px-5 py-3.5 shadow-2xl"
      style={{ animation: "slideUp 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
    >
      <span className="w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-400 text-xs font-black flex-shrink-0">
        ✓
      </span>
      <p className="text-white text-sm font-bold">{message}</p>
      <button
        onClick={onDismiss}
        className="text-white/30 hover:text-white/60 ml-1 transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
}

// ─── ADD VEHICLE MODAL ────────────────────────────────────────────────────────
function AddVehicleModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (car: Car) => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    year: "",
    make: "",
    model: "",
    engine: "",
    chassis: "",
    tires: "",
    oil: "",
    vin: "",
    color: "#e85d04",
    category: "Daily" as Car["category"],
  });
  const { image, loading, fetchImage, tryAnother, reset, setImage } =
    useCarImageSearch();

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1525] border border-white/8 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-[#e8a88a] text-[10px] font-black tracking-[0.2em] uppercase mb-1">
                Fleet Management
              </p>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Add New Vehicle
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-lg"
            >
              ×
            </button>
          </div>
          {/* Step progress */}
          <div className="flex items-center gap-3">
            {steps.map((label, i) => (
              <div key={label} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center gap-2 ${i + 1 <= step ? "opacity-100" : "opacity-30"} transition-opacity`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${i + 1 < step ? "bg-[#e8a88a] text-white" : i + 1 === step ? "bg-white/10 text-white ring-2 ring-[#e8a88a]/50" : "bg-white/5 text-white/40"}`}
                  >
                    {i + 1 < step ? "✓" : i + 1}
                  </div>
                  <span className="text-xs font-bold text-white/60">
                    {label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px transition-all ${i + 1 < step ? "bg-[#e8a88a]/40" : "bg-white/8"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {step === 1 && (
            <>
              <p className="text-white/30 text-xs font-black uppercase tracking-widest">
                Basic Information
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    ["year", "Year — e.g. 2022"],
                    ["make", "Make — e.g. BMW"],
                    ["model", "Model — e.g. M4"],
                    ["engine", "Engine — e.g. 3.0L I6"],
                  ] as [string, string][]
                ).map(([k, pl]) => (
                  <div key={k}>
                    <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                      {pl.split(" — ")[0]}
                    </label>
                    <input
                      placeholder={pl.split(" — ")[1]}
                      value={form[k as keyof typeof form] as string}
                      onChange={(e) => set(k, e.target.value)}
                      className="w-full bg-white/5 border border-white/8 hover:border-white/15 focus:border-[#e8a88a]/50 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm transition-all outline-none"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    ["Daily", "Sport", "Track", "Luxury"] as Car["category"][]
                  ).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => set("category", cat)}
                      className={`py-2.5 rounded-xl text-xs font-black transition-all ${form.category === cat ? "bg-[#e8a88a] text-white" : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70"}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-white/30 text-xs font-black uppercase tracking-widest">
                Technical Specs
              </p>
              <div className="space-y-3">
                {(
                  [
                    ["chassis", "Chassis Code — e.g. G82"],
                    ["tires", "Tire Spec — e.g. 275/35 R19"],
                    ["oil", "Oil Type — e.g. 0W-30 Synthetic"],
                    ["vin", "VIN (optional)"],
                  ] as [string, string][]
                ).map(([k, pl]) => (
                  <div key={k}>
                    <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-1.5">
                      {pl.split(" — ")[0]}
                    </label>
                    <input
                      placeholder={pl.split(" — ")[1]}
                      value={form[k as keyof typeof form] as string}
                      onChange={(e) => set(k, e.target.value)}
                      className="w-full bg-white/5 border border-white/8 hover:border-white/15 focus:border-[#e8a88a]/50 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm transition-all outline-none"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <p className="text-white/30 text-xs font-black uppercase tracking-widest">
                Confirm Vehicle
              </p>

              {/* Image Preview */}
              <div
                className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/8"
                style={{ aspectRatio: "16/7" }}
              >
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-[#e8a88a]/30 border-t-[#e8a88a] rounded-full animate-spin" />
                    <p className="text-white/30 text-xs font-bold">
                      Finding best image...
                    </p>
                  </div>
                ) : image ? (
                  <>
                    <img
                      src={image}
                      alt={`${form.make} ${form.model}`}
                      className="w-full h-full object-cover"
                      onError={() => setImage("/images/bmw-m4.webp")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <p className="text-white font-black text-sm">
                          {form.year} {form.make} {form.model}
                        </p>
                        <p className="text-white/50 text-xs">{form.category}</p>
                      </div>
                      <button
                        onClick={() =>
                          tryAnother(form.year, form.make, form.model)
                        }
                        className="bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white text-xs px-3 py-1.5 rounded-lg font-black transition-all"
                      >
                        ↺ Different photo
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() =>
                        fetchImage(form.year, form.make, form.model)
                      }
                      className="bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs px-4 py-2 rounded-xl font-black transition-all"
                    >
                      Load image
                    </button>
                  </div>
                )}
              </div>

              {/* Specs summary */}
              <div className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden">
                {[
                  ["Vehicle", `${form.year} ${form.make} ${form.model}`],
                  ["Engine", form.engine],
                  ["Chassis", form.chassis],
                  ["Tires", form.tires],
                  ["Oil", form.oil],
                  ["Category", form.category],
                ].map(([label, val], i) => (
                  <div
                    key={label}
                    className={`flex justify-between items-center px-5 py-3 ${i > 0 ? "border-t border-white/4" : ""}`}
                  >
                    <span className="text-white/30 text-xs font-black uppercase tracking-wider">
                      {label}
                    </span>
                    <span className="text-white text-sm font-bold">
                      {val || "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Accent color */}
              <div>
                <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Accent Color
                </label>
                <div className="flex gap-2.5">
                  {ACCENT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => set("color", c)}
                      className={`w-8 h-8 rounded-full transition-all ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d1525] scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 pt-4 flex gap-3 border-t border-white/5">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-sm transition-all"
            >
              ← Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={step === 1 && !form.make}
              className="flex-1 bg-[#e8a88a] hover:opacity-90 disabled:opacity-30 text-white py-3.5 rounded-xl font-black text-sm transition-all"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 bg-[#e8a88a] hover:opacity-90 text-white py-3.5 rounded-xl font-black text-sm transition-all"
            >
              Add to Garage ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SERVICE LOG MODAL ────────────────────────────────────────────────────────
function ServiceModal({
  car,
  onClose,
  onAddRecord,
}: {
  car: Car;
  onClose: () => void;
  onAddRecord: (carId: string, record: ServiceRecord) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({
    date: "",
    type: "",
    mileage: "",
    notes: "",
  });

  const handleAdd = () => {
    if (!form.type) return;
    onAddRecord(car.id, form);
    setAdding(false);
    setForm({ date: "", type: "", mileage: "", notes: "" });
  };

  const serviceTypeIcons: Record<string, string> = {
    "Oil Change": "🛢",
    "Brake Inspection": "⚙️",
    "Tire Rotation": "⭕",
    "Annual Service": "📋",
    "PDK Service": "🔧",
    "Cabin Filter": "💨",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1525] border border-white/8 rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/5 flex-shrink-0">
          <div>
            <p className="text-[#e8a88a] text-[10px] font-black tracking-[0.2em] uppercase mb-1">
              Maintenance Log
            </p>
            <h2 className="text-xl font-black text-white">
              {car.make} {car.model}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-lg"
          >
            ×
          </button>
        </div>

        <div className="px-7 py-5 space-y-2 overflow-y-auto flex-1">
          {car.serviceHistory.length === 0 && !adding ? (
            <div className="py-10 text-center">
              <p className="text-4xl mb-3">🔧</p>
              <p className="text-white/30 font-bold text-sm">
                No records yet. Add your first one.
              </p>
            </div>
          ) : (
            car.serviceHistory.map((rec, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/3 hover:bg-white/5 border border-white/5 rounded-2xl p-4 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/8 flex items-center justify-center text-base flex-shrink-0">
                  {serviceTypeIcons[rec.type] || "🔧"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-black text-sm">{rec.type}</p>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
                    {rec.notes}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[#e8a88a] text-xs font-black">
                    {rec.mileage}
                  </p>
                  <p className="text-white/25 text-xs mt-0.5">{rec.date}</p>
                </div>
              </div>
            ))
          )}

          {adding && (
            <div className="bg-white/3 border border-[#e8a88a]/20 rounded-2xl p-4 space-y-3">
              <p className="text-white/50 text-xs font-black uppercase tracking-widest">
                New Record
              </p>
              {(
                [
                  ["date", "date", "Date"],
                  ["text", "type", "Service Type (e.g. Oil Change)"],
                  ["text", "mileage", "Mileage (e.g. 12,450 mi)"],
                  ["text", "notes", "Notes"],
                ] as [string, string, string][]
              ).map(([type, k, pl]) => (
                <input
                  key={k}
                  type={type}
                  placeholder={pl}
                  value={form[k as keyof typeof form]}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, [k]: e.target.value }))
                  }
                  className="w-full bg-white/5 border border-white/8 focus:border-[#e8a88a]/50 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm outline-none transition-all"
                />
              ))}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => setAdding(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-xl font-black text-xs transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-[#e8a88a] hover:opacity-90 text-white py-2.5 rounded-xl font-black text-xs transition-all"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="w-full border border-dashed border-white/10 hover:border-[#e8a88a]/30 rounded-2xl py-4 text-white/25 hover:text-[#e8a88a] font-black text-xs transition-all"
            >
              + Add Service Record
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── EDIT CAR MODAL ───────────────────────────────────────────────────────────
function EditCarModal({
  car,
  onClose,
  onSave,
  onDelete,
}: {
  car: Car;
  onClose: () => void;
  onSave: (car: Car) => void;
  onDelete: (id: string) => void;
}) {
  const [form, setForm] = useState({ ...car });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set = (k: keyof Car, v: string | number) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0d1525] border border-white/8 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-white/5 flex-shrink-0">
          <div>
            <p className="text-[#e8a88a] text-[10px] font-black tracking-[0.2em] uppercase mb-1">
              Edit Vehicle
            </p>
            <h2 className="text-xl font-black text-white">
              {car.make} {car.model}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all text-lg"
          >
            ×
          </button>
        </div>

        <div className="px-7 py-5 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                "year",
                "make",
                "model",
                "engine",
                "chassis",
                "tires",
                "oil",
                "vin",
              ] as (keyof Car)[]
            ).map((k) => (
              <div key={String(k)}>
                <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-1.5 capitalize">
                  {String(k)}
                </label>
                <input
                  value={String(form[k] ?? "")}
                  onChange={(e) => set(k, e.target.value)}
                  className="w-full bg-white/5 border border-white/8 hover:border-white/15 focus:border-[#e8a88a]/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-1.5">
              Mileage
            </label>
            <input
              type="number"
              value={form.mileage}
              onChange={(e) => set("mileage", parseInt(e.target.value) || 0)}
              className="w-full bg-white/5 border border-white/8 focus:border-[#e8a88a]/50 rounded-xl px-4 py-2.5 text-white text-sm outline-none transition-all"
            />
          </div>

          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-2">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  "Optimal",
                  "Service Due",
                  "Track Ready",
                  "Needs Attention",
                ] as Car["status"][]
              ).map((s) => (
                <button
                  key={s}
                  onClick={() => set("status", s)}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all ${form.status === s ? "bg-[#e8a88a] text-white" : "bg-white/5 text-white/40 hover:bg-white/10"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-white/30 text-[10px] font-black uppercase tracking-widest block mb-2">
              Accent Color
            </label>
            <div className="flex gap-2.5">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => set("color", c)}
                  className={`w-8 h-8 rounded-full transition-all ${form.color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#0d1525] scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="px-7 pb-7 pt-4 border-t border-white/5 flex gap-3 flex-shrink-0">
          {confirmDelete ? (
            <>
              <p className="text-red-400 text-xs font-bold flex-1 self-center">
                Remove this vehicle?
              </p>
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-4 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-black text-xs transition-all"
              >
                No
              </button>
              <button
                onClick={() => {
                  onDelete(car.id);
                  onClose();
                }}
                className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl font-black text-xs transition-all"
              >
                Yes, Remove
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400/70 hover:text-red-400 rounded-xl font-black text-xs transition-all"
              >
                Delete
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-black text-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onSave(form);
                  onClose();
                }}
                className="flex-1 bg-[#e8a88a] hover:opacity-90 text-white py-3 rounded-xl font-black text-sm transition-all"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white/3 border border-white/5 rounded-2xl p-5 hover:bg-white/5 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xl">{icon}</span>
        <span className="text-white/10 group-hover:text-white/20 text-xs font-black uppercase tracking-widest transition-colors">
          {label}
        </span>
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
  const [activeTab, setActiveTab] = useState<
    "overview" | "specs" | "service" | "shop"
  >("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [cart, setCart] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const syncActive = (updated: Car[]) => {
    const found = updated.find((c) => c.id === activeCar.id);
    if (found) setActiveCar(found);
  };

  const handleAddCar = (car: Car) => {
    const updated = [...fleet, car];
    setFleet(updated);
    setActiveCar(car);
    setActiveTab("overview");
    setToast(`${car.year} ${car.make} ${car.model} added to garage`);
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
    if (activeCar.id === id) setActiveCar(newFleet[0]);
    setToast("Vehicle removed from garage");
  };

  const handleAddRecord = (carId: string, record: ServiceRecord) => {
    const newFleet = fleet.map((c) =>
      c.id === carId
        ? { ...c, serviceHistory: [record, ...c.serviceHistory] }
        : c,
    );
    setFleet(newFleet);
    syncActive(newFleet);
    setToast("Service record added");
  };

  const addToCart = (name: string) => {
    setCart((c) => [...c, name]);
    setToast(`${name} added to cart`);
  };

  const filteredFleet = fleet.filter((c) =>
    `${c.year} ${c.make} ${c.model}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const recommendations = fypProducts.filter((p) =>
    p.fitments.includes(activeCar.id),
  );
  const urgentRecs = recommendations.filter(
    (p) =>
      p.urgency === "high" ||
      (activeCar.status === "Service Due" && p.urgency === "medium"),
  );

  const mileagePct = Math.min(
    (activeCar.mileage / activeCar.nextService) * 100,
    100,
  );
  const statusCfg = statusConfig[activeCar.status];
  const milesLeft = activeCar.nextService - activeCar.mileage;

  const tabs = [
    { id: "overview" as const, label: "Overview", icon: "◈" },
    { id: "specs" as const, label: "Specs", icon: "⚙" },
    {
      id: "service" as const,
      label: "Service",
      icon: "🔧",
      badge: activeCar.status === "Service Due" ? 1 : 0,
    },
    {
      id: "shop" as const,
      label: "Shop",
      icon: "🛒",
      badge: urgentRecs.length,
    },
  ];

  return (
    <>
      {/* ── GLOBAL ANIMATIONS ── */}
      <style>{`
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.94); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn  { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .tab-content { animation: fadeIn 0.2s ease; }
        .car-card:hover .car-img { transform: scale(1.04); }
        .car-img { transition: transform 0.5s cubic-bezier(0.4,0,0.2,1); }
        .product-card:hover { transform: translateY(-3px); }
        .product-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
      `}</style>

      {/* ── MODALS ── */}
      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddCar}
        />
      )}
      {showServiceModal && (
        <ServiceModal
          car={activeCar}
          onClose={() => setShowServiceModal(false)}
          onAddRecord={handleAddRecord}
        />
      )}
      {showEditModal && (
        <EditCarModal
          car={activeCar}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveCar}
          onDelete={handleDeleteCar}
        />
      )}
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}

      <main className="min-h-screen bg-[#060e1a] pb-20">
        {/* ── TOP NAV ── */}
        <nav className="sticky top-0 z-40 bg-[#060e1a]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="/" className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-[#e8a88a] flex items-center justify-center">
                  <span className="text-white text-xs font-black">F</span>
                </div>
                <span className="text-white font-black text-sm tracking-tight">
                  Find Your Parts
                </span>
              </a>
              <span className="text-white/15 text-xs">·</span>
              <span className="text-white/40 text-xs font-bold">My Garage</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/parts"
                className="text-white/40 hover:text-white text-xs font-bold transition-colors"
              >
                Catalog
              </a>
              <a
                href="/orders"
                className="text-white/40 hover:text-white text-xs font-bold transition-colors"
              >
                Orders
              </a>
              {cart.length > 0 && (
                <a
                  href="/cart"
                  className="relative flex items-center gap-2 bg-white/8 hover:bg-white/12 border border-white/10 px-4 py-2 rounded-xl text-white text-xs font-black transition-all"
                >
                  🛒 Cart
                  <span className="bg-[#e85d04] text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                    {cart.length}
                  </span>
                </a>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 bg-[#e8a88a] hover:opacity-90 text-white px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95"
              >
                + Add Vehicle
              </button>
            </div>
          </div>
        </nav>

        <div className="max-w-[1320px] mx-auto px-6 pt-8">
          {/* ── PAGE HEADER ── */}
          <div className="mb-8">
            <h1 className="text-[3.5rem] font-black text-white tracking-[-0.03em] leading-none">
              My Garage
            </h1>
            <p className="text-white/30 font-bold text-sm mt-2">
              {fleet.length} vehicle{fleet.length !== 1 ? "s" : ""} ·{" "}
              {fleet.filter((c) => c.status === "Service Due").length} service
              due
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr] gap-6">
            {/* ── LEFT: FLEET SIDEBAR ── */}
            <aside className="space-y-3">
              {/* Search */}
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20 text-sm">
                  🔍
                </span>
                <input
                  placeholder="Search fleet…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/8 hover:border-white/15 focus:border-white/25 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/20 outline-none transition-all"
                />
              </div>

              {/* Car list */}
              <div className="space-y-2">
                {filteredFleet.map((car) => {
                  const cfg = statusConfig[car.status];
                  const isActive = car.id === activeCar.id;
                  return (
                    <div
                      key={car.id}
                      onClick={() => {
                        setActiveCar(car);
                        setActiveTab("overview");
                      }}
                      className={`car-card cursor-pointer rounded-2xl overflow-hidden border transition-all duration-200 ${isActive ? "border-[#e8a88a]/40 shadow-lg shadow-[#e8a88a]/5" : "border-white/5 hover:border-white/10"}`}
                    >
                      <div className="relative h-28 overflow-hidden bg-[#0d1525]">
                        <img
                          src={car.image}
                          alt={car.model}
                          className={`car-img w-full h-full object-cover ${isActive ? "opacity-80" : "opacity-40 grayscale"}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {isActive && (
                          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#e8a88a] animate-pulse" />
                            <span className="text-[#e8a88a] text-[9px] font-black uppercase tracking-widest">
                              Active
                            </span>
                          </div>
                        )}
                        {/* Color stripe */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-0.5"
                          style={{ backgroundColor: car.color }}
                        />
                        <div className="absolute bottom-3 left-4 right-4">
                          <p className="text-white font-black text-sm leading-none">
                            {car.make} {car.model}
                          </p>
                          <p className="text-white/40 text-xs mt-0.5">
                            {car.year}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-4 py-2.5 flex items-center justify-between ${isActive ? "bg-[#0d1525]" : "bg-[#090f1c]"}`}
                      >
                        <div
                          className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${cfg.color}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                          />
                          {car.status}
                        </div>
                        <span className="text-white/25 text-[10px] font-bold">
                          {car.mileage.toLocaleString()} mi
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredFleet.length === 0 && (
                  <p className="text-white/20 text-sm font-bold text-center py-6">
                    No vehicles found
                  </p>
                )}
              </div>

              {/* Fleet summary stats */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-4 space-y-3">
                <p className="text-white/25 text-[10px] font-black uppercase tracking-widest">
                  Fleet Summary
                </p>
                {[
                  { label: "Total Vehicles", val: String(fleet.length) },
                  {
                    label: "Optimal",
                    val: String(
                      fleet.filter((c) => c.status === "Optimal").length,
                    ),
                  },
                  {
                    label: "Service Due",
                    val: String(
                      fleet.filter((c) => c.status === "Service Due").length,
                    ),
                  },
                  {
                    label: "Track Ready",
                    val: String(
                      fleet.filter((c) => c.status === "Track Ready").length,
                    ),
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-white/35 text-xs font-bold">
                      {item.label}
                    </span>
                    <span className="text-white font-black text-sm">
                      {item.val}
                    </span>
                  </div>
                ))}
              </div>
            </aside>

            {/* ── RIGHT: ACTIVE CAR DETAIL ── */}
            <div className="space-y-4 min-w-0">
              {/* ── HERO ── */}
              <div
                className="relative overflow-hidden rounded-3xl bg-[#0d1525] border border-white/5"
                style={{ minHeight: 340 }}
              >
                {/* BG image */}
                <div className="absolute inset-0">
                  <img
                    src={activeCar.image}
                    alt={activeCar.model}
                    className="w-full h-full object-cover opacity-30"
                    style={{ transition: "opacity 0.4s ease" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0d1525] via-[#0d1525]/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1525]/60 to-transparent" />
                </div>

                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-8 bottom-8 w-[3px] rounded-r-full"
                  style={{ backgroundColor: activeCar.color }}
                />

                <div
                  className="relative z-10 p-8 lg:p-10 flex flex-col justify-between h-full"
                  style={{ minHeight: 340 }}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusCfg.bg} ${statusCfg.color} ${statusCfg.border}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                        />
                        {activeCar.status}
                      </span>
                      <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/8 text-white/50 border border-white/8">
                        {activeCar.tag}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="bg-white/8 hover:bg-white/15 border border-white/10 text-white px-4 py-2 rounded-xl font-black text-xs transition-all"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setShowServiceModal(true)}
                        className="bg-white/8 hover:bg-white/15 border border-white/10 text-white px-4 py-2 rounded-xl font-black text-xs transition-all"
                      >
                        🔧 Service Log
                      </button>
                    </div>
                  </div>

                  {/* Car name + VIN */}
                  <div>
                    <h2 className="text-5xl xl:text-6xl font-black text-white tracking-[-0.04em] leading-none">
                      {activeCar.year}{" "}
                      <span style={{ color: activeCar.color }}>
                        {activeCar.make}
                      </span>
                    </h2>
                    <h3 className="text-5xl xl:text-6xl font-black text-white/30 tracking-[-0.04em] leading-none">
                      {activeCar.model}
                    </h3>
                    <p className="text-white/20 text-xs font-mono mt-3 tracking-widest">
                      VIN {activeCar.vin}
                    </p>
                  </div>

                  {/* Bottom stats row */}
                  <div className="flex items-end gap-4 flex-wrap">
                    {/* Mileage ring */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/8 rounded-2xl p-4 flex items-center gap-4">
                      <div className="relative flex-shrink-0">
                        <Ring
                          percent={mileagePct}
                          color={activeCar.color}
                          size={60}
                          stroke={4}
                        />
                        <p className="absolute inset-0 flex items-center justify-center text-white font-black text-xs">
                          {Math.round(mileagePct)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-white/25 text-[9px] font-black uppercase tracking-widest mb-0.5">
                          Service Life
                        </p>
                        <p className="text-white font-black text-base leading-none">
                          {activeCar.mileage.toLocaleString()} mi
                        </p>
                        <p className="text-white/35 text-xs mt-1">
                          {milesLeft > 0
                            ? `${milesLeft.toLocaleString()} mi remaining`
                            : "Service overdue"}
                        </p>
                      </div>
                    </div>

                    {/* Quick stats */}
                    <div className="flex gap-3">
                      {[
                        { label: "Engine", val: activeCar.engine },
                        { label: "Chassis", val: activeCar.chassis },
                        { label: "Category", val: activeCar.category },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="bg-white/5 border border-white/8 rounded-xl px-4 py-3 text-center"
                        >
                          <p className="text-white/25 text-[9px] font-black uppercase tracking-widest mb-1">
                            {s.label}
                          </p>
                          <p className="text-white font-black text-sm">
                            {s.val}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── TABS ── */}
              <div className="bg-white/3 border border-white/5 rounded-2xl p-1.5 flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-black text-xs transition-all relative ${activeTab === tab.id ? "bg-[#0d1525] text-white border border-white/8 shadow-lg" : "text-white/30 hover:text-white/60 hover:bg-white/3"}`}
                  >
                    <span className="hidden sm:inline">{tab.icon}</span>
                    {tab.label}
                    {"badge" in tab && tab.badge > 0 && (
                      <span className="absolute top-1 right-1.5 bg-[#e85d04] text-white text-[8px] font-black rounded-full w-3.5 h-3.5 flex items-center justify-center">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* ── OVERVIEW TAB ── */}
              {activeTab === "overview" && (
                <div className="tab-content space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <StatCard
                      icon="⚡"
                      label="Engine"
                      value={activeCar.engine}
                    />
                    <StatCard
                      icon="🏗"
                      label="Chassis"
                      value={activeCar.chassis}
                    />
                    <StatCard
                      icon="⭕"
                      label="Tires"
                      value={activeCar.tires}
                      sub="Front / Rear"
                    />
                    <StatCard icon="🛢" label="Oil" value={activeCar.oil} />
                    <StatCard
                      icon="📅"
                      label="Next Service"
                      value={`${activeCar.nextService.toLocaleString()} mi`}
                      sub={`${milesLeft > 0 ? `${milesLeft.toLocaleString()} mi left` : "Overdue"}`}
                    />
                    <StatCard
                      icon="🏷"
                      label="Category"
                      value={activeCar.category}
                    />
                  </div>

                  {/* Fitment match banner */}
                  <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                    <div className="relative flex-shrink-0">
                      <Ring
                        percent={activeCar.match}
                        color="#e8a88a"
                        size={72}
                        stroke={5}
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-white font-black text-lg leading-none">
                          {activeCar.match}%
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-black text-base">
                        Smart Fitment Match
                      </h4>
                      <p className="text-white/35 text-sm mt-1 leading-relaxed">
                        FYP has verified{" "}
                        <span className="text-[#e8a88a] font-black">
                          {recommendations.length} compatible parts
                        </span>{" "}
                        for your {activeCar.make} {activeCar.model}.
                        {urgentRecs.length > 0 && (
                          <span className="text-amber-400 font-black">
                            {" "}
                            {urgentRecs.length} need attention now.
                          </span>
                        )}
                      </p>
                      <div className="flex gap-4 mt-3">
                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          ✓ Chassis Verified
                        </span>
                        <span className="text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                          ✓ VIN Matched
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("shop")}
                      className="bg-[#e8a88a] hover:opacity-90 text-white px-5 py-2.5 rounded-xl font-black text-sm transition-all whitespace-nowrap flex-shrink-0"
                    >
                      Shop Parts →
                    </button>
                  </div>
                </div>
              )}

              {/* ── SPECS TAB ── */}
              {activeTab === "specs" && (
                <div className="tab-content bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-white font-black">
                      Full Specifications
                    </h3>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="text-[#e8a88a] text-xs font-black hover:underline"
                    >
                      Edit →
                    </button>
                  </div>
                  <div className="divide-y divide-white/4">
                    {[
                      ["Year", activeCar.year],
                      ["Make", activeCar.make],
                      ["Model", activeCar.model],
                      ["Engine", activeCar.engine],
                      ["Chassis Code", activeCar.chassis],
                      ["Category", activeCar.category],
                      ["Tire Spec", activeCar.tires],
                      ["Oil Type", activeCar.oil],
                      ["VIN", activeCar.vin],
                      [
                        "Current Miles",
                        `${activeCar.mileage.toLocaleString()} mi`,
                      ],
                      [
                        "Next Service",
                        `${activeCar.nextService.toLocaleString()} mi`,
                      ],
                      ["Status", activeCar.status],
                    ].map(([label, val], i) => (
                      <div
                        key={label}
                        className={`flex items-center justify-between px-6 py-3.5 ${i % 2 === 1 ? "bg-white/[0.015]" : ""}`}
                      >
                        <span className="text-white/30 text-xs font-black uppercase tracking-widest">
                          {label}
                        </span>
                        <span className="text-white font-bold text-sm">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SERVICE TAB ── */}
              {activeTab === "service" && (
                <div className="tab-content space-y-4">
                  {/* Status alert */}
                  <div
                    className={`rounded-2xl p-5 border flex items-center gap-4 ${
                      activeCar.status === "Service Due"
                        ? "bg-amber-400/5 border-amber-400/15"
                        : activeCar.status === "Needs Attention"
                          ? "bg-red-400/5 border-red-400/15"
                          : "bg-emerald-400/5 border-emerald-400/15"
                    }`}
                  >
                    <span className="text-2xl flex-shrink-0">
                      {activeCar.status === "Service Due"
                        ? "⚠️"
                        : activeCar.status === "Needs Attention"
                          ? "🚨"
                          : "✅"}
                    </span>
                    <div className="flex-1">
                      <p
                        className={`font-black text-sm ${
                          activeCar.status === "Service Due"
                            ? "text-amber-400"
                            : activeCar.status === "Needs Attention"
                              ? "text-red-400"
                              : "text-emerald-400"
                        }`}
                      >
                        {activeCar.status === "Service Due"
                          ? `Service due — ${milesLeft.toLocaleString()} miles remaining`
                          : activeCar.status === "Needs Attention"
                            ? "This vehicle needs immediate attention"
                            : "Vehicle is in great shape"}
                      </p>
                      <p className="text-white/25 text-xs mt-1">
                        Next service at {activeCar.nextService.toLocaleString()}{" "}
                        mi · Current: {activeCar.mileage.toLocaleString()} mi
                      </p>
                    </div>
                    <button
                      onClick={() => setShowServiceModal(true)}
                      className="bg-white/8 hover:bg-white/12 border border-white/8 text-white px-4 py-2 rounded-xl font-black text-xs transition-all flex-shrink-0"
                    >
                      + Add Record
                    </button>
                  </div>

                  {/* History */}
                  <div className="bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/5">
                      <h3 className="text-white font-black">Service History</h3>
                    </div>
                    <div className="divide-y divide-white/4">
                      {activeCar.serviceHistory.length === 0 ? (
                        <div className="py-12 text-center">
                          <p className="text-3xl mb-3">📋</p>
                          <p className="text-white/25 font-bold text-sm">
                            No service records yet
                          </p>
                        </div>
                      ) : (
                        activeCar.serviceHistory.map((rec, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-4 px-6 py-4 hover:bg-white/2 transition-colors"
                          >
                            <div className="w-9 h-9 bg-white/5 rounded-xl flex items-center justify-center text-sm flex-shrink-0">
                              🔧
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-black text-sm">
                                {rec.type}
                              </p>
                              <p className="text-white/35 text-xs mt-0.5 truncate">
                                {rec.notes}
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-[#e8a88a] font-black text-xs">
                                {rec.mileage}
                              </p>
                              <p className="text-white/20 text-xs mt-0.5">
                                {rec.date}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ── SHOP TAB ── */}
              {activeTab === "shop" && (
                <div className="tab-content space-y-4">
                  {urgentRecs.length > 0 && (
                    <div className="bg-amber-400/5 border border-amber-400/15 rounded-2xl p-4 flex items-center gap-3">
                      <span className="text-xl">⚡</span>
                      <div>
                        <p className="text-amber-400 font-black text-sm">
                          {urgentRecs.length} part
                          {urgentRecs.length > 1 ? "s" : ""} flagged for your{" "}
                          {activeCar.make} {activeCar.model}
                        </p>
                        <p className="text-amber-400/50 text-xs mt-0.5">
                          Based on your vehicle status and service history
                        </p>
                      </div>
                    </div>
                  )}

                  {recommendations.length === 0 ? (
                    <div className="bg-[#0d1525] border border-white/5 rounded-2xl p-12 text-center">
                      <p className="text-3xl mb-3">🎉</p>
                      <p className="text-white font-black">
                        No fitment data yet
                      </p>
                      <p className="text-white/30 text-sm mt-1">
                        This vehicle doesn't have matched parts in the catalog
                        yet.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {recommendations.map((product) => (
                        <div
                          key={product.id}
                          className={`product-card bg-[#0d1525] border rounded-2xl overflow-hidden ${product.urgency === "high" ? "border-amber-400/20" : "border-white/5"}`}
                        >
                          {product.urgency === "high" && (
                            <div className="px-4 py-2 bg-amber-400/8 border-b border-amber-400/10">
                              <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest">
                                ⚡ Recommended Now
                              </span>
                            </div>
                          )}
                          <div className="relative h-32 bg-[#060e1a] overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover opacity-50 hover:opacity-70 transition-opacity duration-300"
                            />
                            <div className="absolute top-3 left-3 bg-white/8 backdrop-blur-sm border border-white/10 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
                              {product.category}
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="text-white font-black text-sm leading-snug">
                              {product.name}
                            </h4>
                            <p className="text-white/30 text-xs mt-1 leading-relaxed">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between mt-4">
                              <p className="text-white font-black text-lg">
                                ${product.price.toFixed(2)}
                              </p>
                              <div className="flex gap-2">
                                <a
                                  href={product.link}
                                  className="text-[#e8a88a] text-xs font-black hover:underline self-center"
                                >
                                  View →
                                </a>
                                <button
                                  onClick={() => addToCart(product.name)}
                                  className="bg-white/8 hover:bg-[#e8a88a] border border-white/10 hover:border-[#e8a88a] text-white px-3 py-2 rounded-xl font-black text-xs transition-all active:scale-95"
                                >
                                  Add to Cart
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* end right panel */}
          </div>

          {/* ── FLEET TABLE ── */}
          <section className="mt-10">
            <div className="flex items-center gap-4 mb-5">
              <h3 className="text-2xl font-black text-white tracking-tight">
                Fleet Overview
              </h3>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <div className="bg-[#0d1525] border border-white/5 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {[
                      "Vehicle",
                      "Status",
                      "Mileage",
                      "Next Service",
                      "Fitment",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3.5 text-left text-[10px] font-black uppercase tracking-widest text-white/20"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fleet.map((car, i) => {
                    const cfg = statusConfig[car.status];
                    const isActive = car.id === activeCar.id;
                    return (
                      <tr
                        key={car.id}
                        onClick={() => {
                          setActiveCar(car);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className={`border-t border-white/4 cursor-pointer transition-colors ${isActive ? "bg-white/3" : "hover:bg-white/[0.015]"}`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-1.5 h-8 rounded-full flex-shrink-0"
                              style={{ backgroundColor: car.color }}
                            />
                            <div>
                              <p className="text-white font-black text-sm">
                                {car.make} {car.model}
                              </p>
                              <p className="text-white/25 text-[10px] font-bold">
                                {car.year} · {car.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                            />
                            {car.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-white/50 text-sm font-bold">
                          {car.mileage.toLocaleString()} mi
                        </td>
                        <td className="px-5 py-4 text-white/50 text-sm font-bold">
                          {car.nextService.toLocaleString()} mi
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-20 bg-white/8 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full bg-[#e8a88a] transition-all"
                                style={{ width: `${car.match}%` }}
                              />
                            </div>
                            <span className="text-white/30 text-xs font-black">
                              {car.match}%
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCar(car);
                              setShowEditModal(true);
                            }}
                            className="text-[#e8a88a]/60 hover:text-[#e8a88a] font-black text-xs uppercase tracking-wider transition-colors"
                          >
                            Edit →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        {/* end max-w container */}
      </main>
    </>
  );
}
