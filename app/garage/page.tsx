"use client";

import { useState, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface ServiceRecord {
  id: string;
  type: string;
  date: string;
  mileage: number;
  notes: string;
  cost: number;
}

interface Car {
  id: string;
  year: string;
  make: string;
  model: string;
  trim: string;
  color: string;
  mileage: number;
  status: "Optimal" | "Service Due" | "Track Ready";
  image: string;
  serviceHistory: ServiceRecord[];
}

// ── Keyframe styles injected once ────────────────────────────────────────────

const GLOBAL_STYLES = `
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
`;

// ── Wikimedia Commons image hook ──────────────────────────────────────────────

function useCarImageSearch() {
  const [image, setImage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [resultPool, setResultPool] = useState<string[]>([]);
  const [poolIndex, setPoolIndex] = useState(0);

  const fetchImage = useCallback(
    async (year: string, make: string, model: string) => {
      setLoading(true);
      setImage("");
      setResultPool([]);
      setPoolIndex(0);
      try {
        const query = encodeURIComponent(`${make} ${model} car`);
        const url =
          `https://commons.wikimedia.org/w/api.php` +
          `?action=query` +
          `&generator=search` +
          `&gsrsearch=${query}` +
          `&gsrnamespace=6` +
          `&prop=imageinfo` +
          `&iiprop=url%7Cmime` +
          `&iiurlwidth=900` +
          `&format=json` +
          `&origin=*` +
          `&gsrlimit=12`;

        const res = await fetch(url);
        const data = await res.json();
        const pages = data?.query?.pages ?? {};
        const urls: string[] = Object.values(pages)
          .map((p: unknown) => {
            const page = p as {
              imageinfo?: { mime?: string; thumburl?: string }[];
            };
            const info = page.imageinfo?.[0];
            if (!info) return null;
            if (!["image/jpeg", "image/png"].includes(info.mime ?? ""))
              return null;
            return info.thumburl ?? null;
          })
          .filter((u): u is string => Boolean(u));

        if (urls.length > 0) {
          setResultPool(urls);
          setPoolIndex(0);
          setImage(urls[0]);
        }
      } catch {
        // silently fail — user can retry
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const tryAnother = useCallback(() => {
    if (resultPool.length < 2) return;
    const next = (poolIndex + 1) % resultPool.length;
    setPoolIndex(next);
    setImage(resultPool[next]);
  }, [resultPool, poolIndex]);

  return {
    image,
    loading,
    fetchImage,
    tryAnother,
    hasPool: resultPool.length > 1,
  };
}

// ── Ring SVG component ────────────────────────────────────────────────────────

function Ring({
  percent,
  color,
  size = 80,
  stroke = 7,
}: {
  percent: number;
  color: string;
  size?: number;
  stroke?: number;
}) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }}
      />
    </svg>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useState(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  });
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: "#e8a88a",
        color: "#060e1a",
        padding: "12px 20px",
        borderRadius: 10,
        fontWeight: 700,
        fontSize: 14,
        animation: "slideUp 0.3s ease",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      {message}
    </div>
  );
}

// ── StatCard ──────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        borderRadius: 12,
        padding: "16px 20px",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.35)",
            marginTop: 3,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

// ── AddVehicleModal ───────────────────────────────────────────────────────────

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
    trim: "",
    color: "",
    mileage: "",
  });
  const { image, loading, fetchImage, tryAnother, hasPool } =
    useCarImageSearch();

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleNext = () => {
    if (step === 2) fetchImage(form.year, form.make, form.model);
    setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    const car: Car = {
      id: Date.now().toString(),
      year: form.year,
      make: form.make,
      model: form.model,
      trim: form.trim || "Base",
      color: form.color || "#888",
      mileage: parseInt(form.mileage) || 0,
      status: "Optimal",
      image:
        image ||
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900",
      serviceHistory: [],
    };
    onAdd(car);
    onClose();
  };

  const stepOk = [false, form.year && form.make, form.model, true];

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    color: "#fff",
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d1a2d",
          borderRadius: 16,
          width: "100%",
          maxWidth: 480,
          padding: 32,
          animation: "scaleIn 0.25s ease",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Step indicators */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                flex: 1,
                height: 3,
                borderRadius: 2,
                background: s <= step ? "#e8a88a" : "rgba(255,255,255,0.1)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>

        <h2
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 20,
            marginBottom: 20,
          }}
        >
          {step === 1
            ? "Year & Make"
            : step === 2
              ? "Model & Trim"
              : "Review & Photo"}
        </h2>

        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              placeholder="Year (e.g. 2021)"
              style={inputStyle}
              value={form.year}
              onChange={set("year")}
            />
            <input
              placeholder="Make (e.g. BMW)"
              style={inputStyle}
              value={form.make}
              onChange={set("make")}
            />
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              placeholder="Model (e.g. M4)"
              style={inputStyle}
              value={form.model}
              onChange={set("model")}
            />
            <input
              placeholder="Trim (e.g. Competition)"
              style={inputStyle}
              value={form.trim}
              onChange={set("trim")}
            />
            <input
              placeholder="Mileage"
              style={inputStyle}
              value={form.mileage}
              onChange={set("mileage")}
              type="number"
            />
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                borderRadius: 10,
                padding: 14,
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <strong style={{ color: "#fff" }}>
                {form.year} {form.make} {form.model}
              </strong>{" "}
              {form.trim}
              <br />
              {parseInt(form.mileage || "0").toLocaleString()} miles
            </div>
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                height: 180,
                background: "rgba(255,255,255,0.05)",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading && (
                <div
                  style={{
                    width: 28,
                    height: 28,
                    border: "3px solid rgba(255,255,255,0.1)",
                    borderTopColor: "#e8a88a",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
              )}
              {!loading && image && (
                <img
                  src={image}
                  alt="car"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              {!loading && !image && (
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>
                  No image found
                </span>
              )}
            </div>
            {hasPool && !loading && (
              <button
                onClick={tryAnother}
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#e8a88a",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                ↺ Different photo
              </button>
            )}
            <input
              placeholder="Color (e.g. Midnight Blue)"
              style={inputStyle}
              value={form.color}
              onChange={set("color")}
            />
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#fff",
                borderRadius: 10,
                padding: "11px 0",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Back
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={handleNext}
              disabled={!stepOk[step]}
              style={{
                flex: 1,
                background: stepOk[step] ? "#e8a88a" : "rgba(255,255,255,0.08)",
                color: stepOk[step] ? "#060e1a" : "rgba(255,255,255,0.3)",
                border: "none",
                borderRadius: 10,
                padding: "11px 0",
                cursor: stepOk[step] ? "pointer" : "default",
                fontWeight: 700,
                transition: "all 0.2s",
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                flex: 1,
                background: "#e8a88a",
                color: "#060e1a",
                border: "none",
                borderRadius: 10,
                padding: "11px 0",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Add to Garage ✓
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── ServiceModal ──────────────────────────────────────────────────────────────

const SERVICE_TYPES = [
  "Oil Change",
  "Tire Rotation",
  "Brake Service",
  "Air Filter",
  "Transmission",
  "Detailing",
  "Other",
];

function ServiceModal({
  car,
  onClose,
  onAddRecord,
}: {
  car: Car;
  onClose: () => void;
  onAddRecord: (carId: string, record: ServiceRecord) => void;
}) {
  const [form, setForm] = useState({
    type: SERVICE_TYPES[0],
    date: "",
    mileage: "",
    notes: "",
    cost: "",
  });
  const set =
    (k: keyof typeof form) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = () => {
    onAddRecord(car.id, {
      id: Date.now().toString(),
      type: form.type,
      date: form.date,
      mileage: parseInt(form.mileage) || 0,
      notes: form.notes,
      cost: parseFloat(form.cost) || 0,
    });
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    color: "#fff",
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d1a2d",
          borderRadius: 16,
          width: "100%",
          maxWidth: 440,
          padding: 32,
          animation: "scaleIn 0.25s ease",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 20,
            marginBottom: 6,
          }}
        >
          Log Service
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          {car.year} {car.make} {car.model}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <select style={inputStyle} value={form.type} onChange={set("type")}>
            {SERVICE_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <input
            type="date"
            style={inputStyle}
            value={form.date}
            onChange={set("date")}
          />
          <input
            placeholder="Mileage at service"
            style={inputStyle}
            value={form.mileage}
            onChange={set("mileage")}
            type="number"
          />
          <input
            placeholder="Cost ($)"
            style={inputStyle}
            value={form.cost}
            onChange={set("cost")}
            type="number"
          />
          <textarea
            placeholder="Notes (optional)"
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
            value={form.notes}
            onChange={set("notes")}
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: 10,
              padding: "11px 0",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1,
              background: "#e8a88a",
              color: "#060e1a",
              border: "none",
              borderRadius: 10,
              padding: "11px 0",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Save Record
          </button>
        </div>
      </div>
    </div>
  );
}

// ── EditCarModal ──────────────────────────────────────────────────────────────

function EditCarModal({
  car,
  onClose,
  onUpdate,
  onDelete,
}: {
  car: Car;
  onClose: () => void;
  onUpdate: (car: Car) => void;
  onDelete: (carId: string) => void;
}) {
  const [form, setForm] = useState({
    mileage: car.mileage.toString(),
    status: car.status,
    color: car.color,
  });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 8,
    color: "#fff",
    padding: "10px 14px",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#0d1a2d",
          borderRadius: 16,
          width: "100%",
          maxWidth: 420,
          padding: 32,
          animation: "scaleIn 0.25s ease",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 20,
            marginBottom: 6,
          }}
        >
          Edit Vehicle
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            marginBottom: 24,
          }}
        >
          {car.year} {car.make} {car.model}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            placeholder="Current mileage"
            style={inputStyle}
            value={form.mileage}
            onChange={set("mileage")}
            type="number"
          />
          <select
            style={inputStyle}
            value={form.status}
            onChange={set("status")}
          >
            <option>Optimal</option>
            <option>Service Due</option>
            <option>Track Ready</option>
          </select>
          <input
            placeholder="Color"
            style={inputStyle}
            value={form.color}
            onChange={set("color")}
          />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              borderRadius: 10,
              padding: "11px 0",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onUpdate({
                ...car,
                mileage: parseInt(form.mileage) || car.mileage,
                status: form.status as Car["status"],
                color: form.color,
              });
              onClose();
            }}
            style={{
              flex: 1,
              background: "#e8a88a",
              color: "#060e1a",
              border: "none",
              borderRadius: 10,
              padding: "11px 0",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Save
          </button>
        </div>
        <div
          style={{
            marginTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 20,
          }}
        >
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              style={{
                width: "100%",
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                color: "#f87171",
                borderRadius: 10,
                padding: "10px 0",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Remove Vehicle
            </button>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  borderRadius: 10,
                  padding: "10px 0",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Keep it
              </button>
              <button
                onClick={() => {
                  onDelete(car.id);
                  onClose();
                }}
                style={{
                  flex: 1,
                  background: "#ef4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "10px 0",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                Yes, Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Sample data ───────────────────────────────────────────────────────────────

const SAMPLE_FLEET: Car[] = [
  {
    id: "1",
    year: "2021",
    make: "BMW",
    model: "M4",
    trim: "Competition",
    color: "#1a3a5c",
    mileage: 24500,
    status: "Track Ready",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900",
    serviceHistory: [
      {
        id: "s1",
        type: "Oil Change",
        date: "2024-03-10",
        mileage: 22000,
        notes: "Castrol Edge 0W-40",
        cost: 120,
      },
      {
        id: "s2",
        type: "Tire Rotation",
        date: "2024-01-05",
        mileage: 20000,
        notes: "",
        cost: 60,
      },
    ],
  },
  {
    id: "2",
    year: "2019",
    make: "Toyota",
    model: "Supra",
    trim: "3.0 Premium",
    color: "#8b1a1a",
    mileage: 41200,
    status: "Service Due",
    image: "https://images.unsplash.com/photo-1621135802920-133df287f89c?w=900",
    serviceHistory: [],
  },
];

// ── Status config ─────────────────────────────────────────────────────────────

function statusConfig(status: Car["status"]) {
  const map = {
    "Track Ready": {
      color: "#34d399",
      bg: "rgba(52,211,153,0.12)",
      label: "Track Ready",
    },
    Optimal: {
      color: "#60a5fa",
      bg: "rgba(96,165,250,0.12)",
      label: "Optimal",
    },
    "Service Due": {
      color: "#fbbf24",
      bg: "rgba(251,191,36,0.12)",
      label: "Service Due",
    },
  };
  return map[status];
}

// ── Main GaragePage ───────────────────────────────────────────────────────────

export default function GaragePage() {
  const [fleet, setFleet] = useState<Car[]>(SAMPLE_FLEET);
  const [activeCar, setActiveCar] = useState<Car>(SAMPLE_FLEET[0]);
  const [activeTab, setActiveTab] = useState<
    "overview" | "specs" | "service" | "shop"
  >("overview");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const cfg = statusConfig(activeCar.status);
  const serviceDueCount = fleet.filter(
    (c) => c.status === "Service Due",
  ).length;

  const tabs: {
    id: "overview" | "specs" | "service" | "shop";
    label: string;
    icon: string;
    badge: number;
  }[] = [
    { id: "overview", label: "Overview", icon: "◈", badge: 0 },
    { id: "specs", label: "Specs", icon: "⚙", badge: 0 },
    {
      id: "service",
      label: "Service",
      icon: "🔧",
      badge: activeCar.status === "Service Due" ? 1 : 0,
    },
    { id: "shop", label: "Shop", icon: "🛒", badge: 0 },
  ];

  const addCar = (car: Car) => {
    setFleet((f) => [...f, car]);
    setActiveCar(car);
    setToast(`${car.year} ${car.make} ${car.model} added to garage`);
  };

  const updateCar = (updated: Car) => {
    setFleet((f) => f.map((c) => (c.id === updated.id ? updated : c)));
    setActiveCar(updated);
    setToast("Vehicle updated");
  };

  const deleteCar = (id: string) => {
    const remaining = fleet.filter((c) => c.id !== id);
    setFleet(remaining);
    if (remaining.length > 0) setActiveCar(remaining[0]);
    setToast("Vehicle removed");
  };

  const addServiceRecord = (carId: string, record: ServiceRecord) => {
    setFleet((f) =>
      f.map((c) =>
        c.id === carId
          ? { ...c, serviceHistory: [record, ...c.serviceHistory] }
          : c,
      ),
    );
    if (activeCar.id === carId)
      setActiveCar((a) => ({
        ...a,
        serviceHistory: [record, ...a.serviceHistory],
      }));
    setToast("Service record saved");
  };

  const filteredFleet = fleet.filter((c) =>
    `${c.year} ${c.make} ${c.model}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const mileagePct = Math.min(
    100,
    Math.round((activeCar.mileage / 100000) * 100),
  );

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      {/* Modals */}
      {showAddModal && (
        <AddVehicleModal
          onClose={() => setShowAddModal(false)}
          onAdd={addCar}
        />
      )}
      {showServiceModal && (
        <ServiceModal
          car={activeCar}
          onClose={() => setShowServiceModal(false)}
          onAddRecord={addServiceRecord}
        />
      )}
      {showEditModal && (
        <EditCarModal
          car={activeCar}
          onClose={() => setShowEditModal(false)}
          onUpdate={updateCar}
          onDelete={deleteCar}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div
        style={{
          minHeight: "100vh",
          background: "#060e1a",
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {/* Sticky nav */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "rgba(6,14,26,0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "0 32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <span
            style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.01em" }}
          >
            <span style={{ color: "#e8a88a" }}>FYP</span> My Garage
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {serviceDueCount > 0 && (
              <span
                style={{
                  background: "rgba(251,191,36,0.15)",
                  color: "#fbbf24",
                  border: "1px solid rgba(251,191,36,0.3)",
                  borderRadius: 20,
                  padding: "3px 10px",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {serviceDueCount} service due
              </span>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: "#e8a88a",
                color: "#060e1a",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              + Add Vehicle
            </button>
          </div>
        </nav>

        <div style={{ display: "flex", minHeight: "calc(100vh - 60px)" }}>
          {/* Sidebar */}
          <aside
            style={{
              width: 240,
              flexShrink: 0,
              background: "rgba(255,255,255,0.02)",
              borderRight: "1px solid rgba(255,255,255,0.06)",
              padding: "20px 12px",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <input
              placeholder="Search fleet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                color: "#fff",
                padding: "8px 12px",
                fontSize: 12,
                outline: "none",
                marginBottom: 8,
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            {filteredFleet.map((car) => {
              const active = car.id === activeCar.id;
              const scfg = statusConfig(car.status);
              return (
                <button
                  key={car.id}
                  onClick={() => setActiveCar(car)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "10px 10px",
                    borderRadius: 10,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    background: active
                      ? "rgba(232,168,138,0.12)"
                      : "transparent",
                    outline: active
                      ? "1px solid rgba(232,168,138,0.25)"
                      : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 36,
                      borderRadius: 2,
                      background: active ? "#e8a88a" : scfg.color,
                      opacity: active ? 1 : 0.4,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ overflow: "hidden" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: active ? "#fff" : "rgba(255,255,255,0.6)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {car.year} {car.make}
                    </div>
                    <div
                      style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}
                    >
                      {car.model}
                    </div>
                  </div>
                  {active && (
                    <div
                      style={{
                        marginLeft: "auto",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#e8a88a",
                        animation: "pulse 2s infinite",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </button>
              );
            })}

            {/* Fleet summary */}
            <div
              style={{
                marginTop: "auto",
                background: "rgba(255,255,255,0.03)",
                borderRadius: 10,
                padding: 14,
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                }}
              >
                Fleet
              </div>
              {[
                { label: "Total", value: fleet.length },
                {
                  label: "Optimal",
                  value: fleet.filter((c) => c.status === "Optimal").length,
                },
                {
                  label: "Service Due",
                  value: fleet.filter((c) => c.status === "Service Due").length,
                },
                {
                  label: "Track Ready",
                  value: fleet.filter((c) => c.status === "Track Ready").length,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>
                    {row.label}
                  </span>
                  <span style={{ color: "#fff", fontWeight: 700 }}>
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main style={{ flex: 1, padding: 32, overflowY: "auto" }}>
            {/* Hero card */}
            <div
              style={{
                borderRadius: 20,
                overflow: "hidden",
                position: "relative",
                marginBottom: 28,
                height: 280,
                border: `1px solid ${cfg.color}33`,
              }}
            >
              <img
                src={activeCar.image}
                alt={activeCar.model}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.4s ease",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.03)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(6,14,26,0.95) 0%, transparent 55%)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: 24,
                  left: 28,
                  right: 28,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: cfg.bg,
                      border: `1px solid ${cfg.color}44`,
                      borderRadius: 20,
                      padding: "4px 12px",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: cfg.color,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        color: cfg.color,
                        fontWeight: 700,
                      }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <h1
                    style={{
                      fontSize: 28,
                      fontWeight: 900,
                      margin: 0,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {activeCar.year} {activeCar.make} {activeCar.model}
                  </h1>
                  <p
                    style={{
                      margin: "4px 0 0",
                      color: "rgba(255,255,255,0.5)",
                      fontSize: 14,
                    }}
                  >
                    {activeCar.trim}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setShowEditModal(true)}
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      borderRadius: 8,
                      padding: "8px 14px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    style={{
                      background: "#e8a88a",
                      color: "#060e1a",
                      border: "none",
                      borderRadius: 8,
                      padding: "8px 14px",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    + Service
                  </button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: "flex",
                gap: 4,
                marginBottom: 24,
                background: "rgba(255,255,255,0.04)",
                borderRadius: 10,
                padding: 4,
              }}
            >
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    background:
                      activeTab === tab.id
                        ? "rgba(255,255,255,0.1)"
                        : "transparent",
                    border: "none",
                    color:
                      activeTab === tab.id ? "#fff" : "rgba(255,255,255,0.4)",
                    borderRadius: 7,
                    padding: "9px 4px",
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    transition: "all 0.2s",
                    position: "relative",
                  }}
                >
                  {tab.icon} {tab.label}
                  {tab.badge > 0 && (
                    <span
                      style={{
                        background: "#e8a88a",
                        color: "#060e1a",
                        borderRadius: 10,
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "1px 6px",
                        marginLeft: 2,
                      }}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              {activeTab === "overview" && (
                <div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(160px, 1fr))",
                      gap: 12,
                      marginBottom: 24,
                    }}
                  >
                    <StatCard
                      label="Mileage"
                      value={activeCar.mileage.toLocaleString()}
                      sub="miles driven"
                    />
                    <StatCard
                      label="Status"
                      value={cfg.label}
                      sub={
                        activeCar.status === "Service Due"
                          ? "Action needed"
                          : "All good"
                      }
                    />
                    <StatCard
                      label="Service Records"
                      value={activeCar.serviceHistory.length.toString()}
                      sub="logged"
                    />
                    <StatCard
                      label="Last Service"
                      value={activeCar.serviceHistory[0]?.date ?? "—"}
                      sub={activeCar.serviceHistory[0]?.type}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 28,
                      background: "rgba(255,255,255,0.03)",
                      borderRadius: 14,
                      padding: 24,
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ring
                        percent={mileagePct}
                        color={cfg.color}
                        size={90}
                        stroke={8}
                      />
                      <div
                        style={{ position: "absolute", textAlign: "center" }}
                      >
                        <div style={{ fontSize: 17, fontWeight: 800 }}>
                          {mileagePct}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          marginBottom: 4,
                        }}
                      >
                        Mileage Progress
                      </div>
                      <div
                        style={{ color: "rgba(255,255,255,0.4)", fontSize: 13 }}
                      >
                        {activeCar.mileage.toLocaleString()} of 100,000 miles
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.3)",
                          fontSize: 12,
                          marginTop: 6,
                        }}
                      >
                        {(100000 - activeCar.mileage).toLocaleString()} miles
                        until major service interval
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "specs" && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {[
                    ["Year", activeCar.year],
                    ["Make", activeCar.make],
                    ["Model", activeCar.model],
                    ["Trim", activeCar.trim],
                    ["Color", activeCar.color],
                    ["Mileage", `${activeCar.mileage.toLocaleString()} mi`],
                    ["Status", activeCar.status],
                  ].map(([label, value], i) => (
                    <div
                      key={label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "14px 20px",
                        borderTop:
                          i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      }}
                    >
                      <span
                        style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}
                      >
                        {label}
                      </span>
                      <span
                        style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "service" && (
                <div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 16,
                    }}
                  >
                    <h3 style={{ fontWeight: 700, fontSize: 16, margin: 0 }}>
                      Service History
                    </h3>
                    <button
                      onClick={() => setShowServiceModal(true)}
                      style={{
                        background: "#e8a88a",
                        color: "#060e1a",
                        border: "none",
                        borderRadius: 8,
                        padding: "8px 14px",
                        cursor: "pointer",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      + Log Service
                    </button>
                  </div>
                  {activeCar.serviceHistory.length === 0 ? (
                    <div
                      style={{
                        textAlign: "center",
                        padding: "48px 0",
                        color: "rgba(255,255,255,0.3)",
                        fontSize: 14,
                      }}
                    >
                      No service records yet.
                      <br />
                      <span
                        style={{ color: "#e8a88a", cursor: "pointer" }}
                        onClick={() => setShowServiceModal(true)}
                      >
                        Log your first service →
                      </span>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      {activeCar.serviceHistory.map((record) => (
                        <div
                          key={record.id}
                          style={{
                            background: "rgba(255,255,255,0.04)",
                            borderRadius: 12,
                            padding: "16px 20px",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 14 }}>
                                {record.type}
                              </div>
                              <div
                                style={{
                                  fontSize: 12,
                                  color: "rgba(255,255,255,0.4)",
                                  marginTop: 3,
                                }}
                              >
                                {record.date} ·{" "}
                                {record.mileage.toLocaleString()} mi
                              </div>
                              {record.notes && (
                                <div
                                  style={{
                                    fontSize: 12,
                                    color: "rgba(255,255,255,0.5)",
                                    marginTop: 6,
                                  }}
                                >
                                  {record.notes}
                                </div>
                              )}
                            </div>
                            {record.cost > 0 && (
                              <span
                                style={{
                                  color: "#e8a88a",
                                  fontWeight: 700,
                                  fontSize: 14,
                                }}
                              >
                                ${record.cost}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "shop" && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      name: "FYP Ceramic Brake Pads",
                      price: "$189.50",
                      note: "Fits your M4",
                    },
                    {
                      name: "5W-30 Full Synthetic Motor Oil",
                      price: "$58.00",
                      note: "Recommended interval",
                    },
                    {
                      name: "Heavy-Duty Oil Filter",
                      price: "$24.00",
                      note: "OEM compatible",
                    },
                    {
                      name: "Spark Plug Set",
                      price: "$18.50",
                      note: "Performance upgrade",
                    },
                  ].map((item) => (
                    <div
                      key={item.name}
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        borderRadius: 12,
                        padding: 18,
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          marginBottom: 4,
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.4)",
                          marginBottom: 12,
                        }}
                      >
                        {item.note}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            color: "#e8a88a",
                            fontWeight: 800,
                            fontSize: 16,
                          }}
                        >
                          {item.price}
                        </span>
                        <button
                          style={{
                            background: "#e8a88a",
                            color: "#060e1a",
                            border: "none",
                            borderRadius: 6,
                            padding: "6px 12px",
                            cursor: "pointer",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Fleet table */}
            {fleet.length > 1 && (
              <div style={{ marginTop: 40 }}>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 12,
                    marginBottom: 14,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Full Fleet
                </h3>
                <div
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: 14,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                >
                  {fleet.map((car, i) => {
                    const scfg = statusConfig(car.status);
                    return (
                      <div
                        key={car.id}
                        onClick={() => {
                          setActiveCar(car);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          padding: "14px 20px",
                          borderTop:
                            i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(255,255,255,0.04)")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <img
                          src={car.image}
                          alt={car.model}
                          style={{
                            width: 52,
                            height: 36,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14 }}>
                            {car.year} {car.make} {car.model}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "rgba(255,255,255,0.35)",
                            }}
                          >
                            {car.mileage.toLocaleString()} mi
                          </div>
                        </div>
                        <span
                          style={{
                            background: scfg.bg,
                            color: scfg.color,
                            border: `1px solid ${scfg.color}44`,
                            borderRadius: 20,
                            padding: "3px 10px",
                            fontSize: 11,
                            fontWeight: 700,
                          }}
                        >
                          {scfg.label}
                        </span>
                        <span
                          style={{
                            color: "#e8a88a",
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          Edit →
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
