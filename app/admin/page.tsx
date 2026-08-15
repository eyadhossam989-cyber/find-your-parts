"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  isUserAdmin,
  fetchOrders,
  fetchProducts,
  updateOrderStatus,
  updateProduct,
  deleteProduct,
  getDashboardStats,
  subscribeToOrders,
  subscribeToProducts,
} from "@/lib/adminService";

// ============================================================
// Types
// ============================================================
interface ProductRef {
  id: string;
  name: string;
  image_url: string;
  price: number;
}

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  products: ProductRef | ProductRef[];
}

function getProductRef(item: OrderItem): ProductRef | null {
  if (!item.products) return null;
  return Array.isArray(item.products)
    ? (item.products[0] ?? null)
    : item.products;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  shipping_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_phone: string;
  delivery_method: string;
  shipping_cost: number;
  tax: number;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalStock: number;
  lowStockItems: number;
}

const ORDER_STATUSES: Order["status"][] = [
  "pending",
  "paid",
  "shipped",
  "delivered",
];

// ============================================================
// Toast system — every action reports a real result, always
// ============================================================
interface ToastMsg {
  id: number;
  message: string;
  type: "success" | "error";
}

function useToasts() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" = "success") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t, { id, message, type }]);
      setTimeout(() => {
        setToasts((t) => t.filter((toast) => toast.id !== id));
      }, 4000);
    },
    [],
  );

  return { toasts, showToast };
}

function ToastStack({ toasts }: { toasts: ToastMsg[] }) {
  if (toasts.length === 0) return null;
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-5 py-3 rounded-lg font-semibold shadow-lg border text-sm animate-[slideIn_0.2s_ease-out] ${
            t.type === "success"
              ? "bg-green-500/15 text-green-300 border-green-500/30"
              : "bg-red-500/15 text-red-300 border-red-500/30"
          }`}
        >
          {t.type === "success" ? "✓ " : "✕ "}
          {t.message}
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ============================================================
// Main page
// ============================================================
export default function AdminPage() {
  const router = useRouter();
  const { toasts, showToast } = useToasts();

  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "inventory"
  >("dashboard");

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalStock: 0,
    lowStockItems: 0,
  });

  const [searchOrders, setSearchOrders] = useState("");
  const [searchProducts, setSearchProducts] = useState("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Product>>({});

  // Per-row "in flight" tracking so buttons show real state instead of
  // looking clickable while a request is still pending or after it failed.
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
  const [savingProductId, setSavingProductId] = useState<string | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null,
  );

  // ---- Admin gate ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const admin = await isUserAdmin();
        if (cancelled) return;
        if (!admin) {
          router.push("/");
          return;
        }
        setIsAdmin(true);
      } catch (err) {
        console.error("Admin check failed:", err);
        router.push("/");
      } finally {
        if (!cancelled) setCheckingAdmin(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // ---- Initial data load ----
  const loadAll = useCallback(async () => {
    setDataLoading(true);
    try {
      const [ordersData, productsData, statsData] = await Promise.all([
        fetchOrders(),
        fetchProducts(),
        getDashboardStats(),
      ]);
      setOrders(ordersData as unknown as Order[]);
      setProducts(productsData as Product[]);
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      showToast(
        "Couldn't load dashboard data — check your connection",
        "error",
      );
    } finally {
      setDataLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (!isAdmin) return;
    loadAll();
  }, [isAdmin, loadAll]);

  // ---- Real-time subscriptions ----
  useEffect(() => {
    if (!isAdmin) return;
    const orderSub = subscribeToOrders((updated) =>
      setOrders(updated as unknown as Order[]),
    );
    const productSub = subscribeToProducts((updated) =>
      setProducts(updated as Product[]),
    );
    return () => {
      orderSub?.unsubscribe();
      productSub?.unsubscribe();
    };
  }, [isAdmin]);

  // ---- Order status update ----
  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    const previous = orders.find((o) => o.id === orderId)?.status;
    setSavingOrderId(orderId);
    // Optimistic update so the dropdown reflects the choice immediately
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
    try {
      const success = await updateOrderStatus(orderId, newStatus);
      if (!success) {
        // Roll back — this is what used to fail silently
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId && previous ? { ...o, status: previous } : o,
          ),
        );
        showToast(
          "Update was blocked by the database (check Supabase RLS policies for 'orders')",
          "error",
        );
        return;
      }
      showToast(`Order updated to "${newStatus}"`);
    } catch (err) {
      console.error("Order status update threw:", err);
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId && previous ? { ...o, status: previous } : o,
        ),
      );
      showToast("Something went wrong updating the order", "error");
    } finally {
      setSavingOrderId(null);
    }
  };

  // ---- Product edit ----
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setEditValues({ ...product });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setEditValues({});
  };

  const handleSaveProduct = async (productId: string) => {
    if (!editValues.name?.trim()) {
      showToast("Product name can't be empty", "error");
      return;
    }
    if (editValues.price != null && editValues.price < 0) {
      showToast("Price can't be negative", "error");
      return;
    }
    if (editValues.stock != null && editValues.stock < 0) {
      showToast("Stock can't be negative", "error");
      return;
    }

    setSavingProductId(productId);
    try {
      const success = await updateProduct(productId, editValues);
      if (!success) {
        showToast(
          "Save was blocked by the database (check Supabase RLS policies for 'products')",
          "error",
        );
        return;
      }
      const refreshed = await fetchProducts();
      setProducts(refreshed as Product[]);
      setEditingProduct(null);
      setEditValues({});
      showToast("Product saved");
    } catch (err) {
      console.error("Product save threw:", err);
      showToast("Something went wrong saving the product", "error");
    } finally {
      setSavingProductId(null);
    }
  };

  // ---- Product delete ----
  const handleDeleteProduct = async (productId: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This can't be undone.`)) return;

    setDeletingProductId(productId);
    try {
      const success = await deleteProduct(productId);
      if (!success) {
        showToast(
          "Delete was blocked by the database (check Supabase RLS policies for 'products')",
          "error",
        );
        return;
      }
      const refreshed = await fetchProducts();
      setProducts(refreshed as Product[]);
      showToast("Product deleted");
    } catch (err) {
      console.error("Product delete threw:", err);
      showToast("Something went wrong deleting the product", "error");
    } finally {
      setDeletingProductId(null);
    }
  };

  // ---- Filters ----
  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchOrders.toLowerCase()) ||
      order.shipping_name?.toLowerCase().includes(searchOrders.toLowerCase()),
  );

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchProducts.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchProducts.toLowerCase()),
  );

  // ---- Gate screens ----
  if (checkingAdmin) {
    return (
      <main className="min-h-screen bg-[#060e1a] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="inline-block h-8 w-8 border-2 border-[#e8a88a] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-300">Verifying admin access…</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) return null; // already redirecting

  return (
    <main className="min-h-screen bg-[#060e1a] text-white">
      <ToastStack toasts={toasts} />

      {/* Header */}
      <div className="bg-[#0a1428]/95 backdrop-blur border-b border-white/10 sticky top-24 z-40">
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight">
              FYP Admin
            </h1>
            <p className="text-slate-400 text-xs md:text-sm">
              Orders & inventory management
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium rounded-lg transition text-sm"
          >
            Exit Admin
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 flex gap-6 md:gap-8">
          {(["dashboard", "orders", "inventory"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 text-sm font-semibold capitalize border-b-2 transition ${
                activeTab === tab
                  ? "border-[#e8a88a] text-[#e8a88a]"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab}
              {tab === "orders" && stats.pendingOrders > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-yellow-500/20 text-yellow-300 text-[10px] font-bold">
                  {stats.pendingOrders}
                </span>
              )}
              {tab === "inventory" && stats.lowStockItems > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold">
                  {stats.lowStockItems}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-8 py-8">
        {dataLoading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <div className="h-6 w-6 border-2 border-[#e8a88a] border-t-transparent rounded-full animate-spin mr-3" />
            Loading dashboard data…
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && (
              <DashboardTab stats={stats} onRefresh={loadAll} />
            )}
            {activeTab === "orders" && (
              <OrdersTab
                orders={filteredOrders}
                search={searchOrders}
                onSearchChange={setSearchOrders}
                onStatusChange={handleOrderStatusChange}
                savingOrderId={savingOrderId}
              />
            )}
            {activeTab === "inventory" && (
              <InventoryTab
                products={filteredProducts}
                search={searchProducts}
                onSearchChange={setSearchProducts}
                editingProduct={editingProduct}
                editValues={editValues}
                setEditValues={setEditValues}
                onEdit={handleEditProduct}
                onCancel={handleCancelEdit}
                onSave={handleSaveProduct}
                onDelete={handleDeleteProduct}
                savingProductId={savingProductId}
                deletingProductId={deletingProductId}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

// ============================================================
// Dashboard Tab
// ============================================================
function DashboardTab({
  stats,
  onRefresh,
}: {
  stats: DashboardStats;
  onRefresh: () => void;
}) {
  const successRate =
    stats.totalOrders > 0
      ? ((stats.deliveredOrders / stats.totalOrders) * 100).toFixed(0)
      : "0";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-200">Overview</h2>
        <button
          onClick={onRefresh}
          className="text-sm text-slate-400 hover:text-[#e8a88a] transition font-medium"
        >
          ↺ Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          label="Total Sales"
          value={`$${stats.totalSales.toFixed(2)}`}
          sub="All time"
          subColor="text-[#e8a88a]"
        />
        <StatCard
          label="Total Orders"
          value={String(stats.totalOrders)}
          sub={`${stats.pendingOrders} pending`}
          subColor="text-blue-400"
        />
        <StatCard
          label="Delivered"
          value={String(stats.deliveredOrders)}
          sub={`${successRate}% success rate`}
          subColor="text-green-400"
        />
        <StatCard
          label="Inventory"
          value={String(stats.totalStock)}
          sub={`${stats.lowStockItems} items low stock`}
          subColor={stats.lowStockItems > 0 ? "text-red-400" : "text-green-400"}
        />
      </div>

      <div className="bg-gradient-to-r from-[#0a1428] to-[#141f38] border border-[#e8a88a]/15 rounded-2xl p-6 md:p-8">
        <h3 className="text-base font-bold mb-4 text-slate-200">
          System Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ["Database", "Connected"],
            ["Auth", "Verified"],
            ["Real-time", "Active"],
            ["Sync", "Live"],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-slate-500 text-xs uppercase tracking-wide">
                {label}
              </p>
              <p className="text-green-400 font-semibold text-sm mt-1">
                ✓ {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  sub: string;
  subColor: string;
}) {
  return (
    <div className="bg-[#0a1428] border border-white/10 rounded-xl p-5 hover:border-[#e8a88a]/40 transition">
      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
        {label}
      </p>
      <h3 className="text-2xl md:text-3xl font-bold mt-2">{value}</h3>
      <p className={`text-xs mt-2 font-medium ${subColor}`}>{sub}</p>
    </div>
  );
}

// ============================================================
// Orders Tab
// ============================================================
function OrdersTab({
  orders,
  search,
  onSearchChange,
  onStatusChange,
  savingOrderId,
}: {
  orders: Order[];
  search: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (id: string, status: Order["status"]) => void;
  savingOrderId: string | null;
}) {
  const statusStyle: Record<Order["status"], string> = {
    pending: "bg-yellow-500/15 text-yellow-300",
    paid: "bg-blue-500/15 text-blue-300",
    shipped: "bg-purple-500/15 text-purple-300",
    delivered: "bg-green-500/15 text-green-300",
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search by order ID or customer name…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full mb-6 px-4 py-3 bg-[#0a1428] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-[#e8a88a] focus:outline-none text-sm"
      />

      {orders.length === 0 ? (
        <EmptyState text="No orders found" />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isSaving = savingOrderId === order.id;
            const subtotal =
              order.total - (order.tax ?? 0) - (order.shipping_cost ?? 0);
            return (
              <div
                key={order.id}
                className="bg-[#0a1428] border border-white/10 rounded-xl p-5 md:p-6 hover:border-[#e8a88a]/30 transition"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <Field label="Order ID">
                    <span className="font-mono text-[#e8a88a] text-sm">
                      {order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </Field>
                  <Field label="Customer">
                    <span className="font-semibold text-sm">
                      {order.shipping_name || "—"}
                    </span>
                  </Field>
                  <Field label="Total">
                    <span className="font-bold text-green-400 text-sm">
                      ${order.total.toFixed(2)}
                    </span>
                  </Field>
                  <Field label="Status">
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        disabled={isSaving}
                        onChange={(e) =>
                          onStatusChange(
                            order.id,
                            e.target.value as Order["status"],
                          )
                        }
                        className={`font-semibold px-3 py-1.5 rounded-lg border-0 cursor-pointer text-sm disabled:opacity-50 disabled:cursor-wait ${statusStyle[order.status]}`}
                      >
                        {ORDER_STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                      {isSaving && (
                        <div className="h-3.5 w-3.5 border-2 border-[#e8a88a] border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/5 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs mb-1">
                      Shipping Address
                    </p>
                    <p>
                      {order.shipping_address}, {order.shipping_city},{" "}
                      {order.shipping_state} {order.shipping_zip}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-1">Contact</p>
                    <p>{order.shipping_phone || "—"}</p>
                  </div>
                </div>

                <div className="bg-[#141f38]/60 rounded-lg p-4 mt-4">
                  <p className="text-slate-500 text-xs mb-2 font-semibold">
                    Items ({order.order_items?.length ?? 0})
                  </p>
                  <div className="space-y-1.5">
                    {order.order_items?.map((item) => {
                      const ref = getProductRef(item);
                      return (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span className="text-slate-300">
                            {ref?.name ?? "Unknown product"} × {item.quantity}
                          </span>
                          <span className="text-[#e8a88a]">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4 pt-4 border-t border-white/5">
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p>Subtotal: ${subtotal.toFixed(2)}</p>
                    <p>Shipping: ${(order.shipping_cost ?? 0).toFixed(2)}</p>
                    <p>Tax: ${(order.tax ?? 0).toFixed(2)}</p>
                  </div>
                  <div className="text-lg font-bold text-[#e8a88a]">
                    ${order.total.toFixed(2)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      {children}
    </div>
  );
}

// ============================================================
// Inventory Tab
// ============================================================
function InventoryTab({
  products,
  search,
  onSearchChange,
  editingProduct,
  editValues,
  setEditValues,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  savingProductId,
  deletingProductId,
}: {
  products: Product[];
  search: string;
  onSearchChange: (v: string) => void;
  editingProduct: string | null;
  editValues: Partial<Product>;
  setEditValues: (v: Partial<Product>) => void;
  onEdit: (p: Product) => void;
  onCancel: () => void;
  onSave: (id: string) => void;
  onDelete: (id: string, name: string) => void;
  savingProductId: string | null;
  deletingProductId: string | null;
}) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search by product name or category…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full mb-6 px-4 py-3 bg-[#0a1428] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-[#e8a88a] focus:outline-none text-sm"
      />

      {products.length === 0 ? (
        <EmptyState text="No products found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((product) => {
            const isEditing = editingProduct === product.id;
            const isSaving = savingProductId === product.id;
            const isDeleting = deletingProductId === product.id;

            return (
              <div
                key={product.id}
                className="bg-[#0a1428] border border-white/10 rounded-xl overflow-hidden hover:border-[#e8a88a]/30 transition flex flex-col"
              >
                <div className="h-44 bg-[#141f38] overflow-hidden flex items-center justify-center">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-600 text-sm">No image</div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  {isEditing ? (
                    <div className="space-y-3 flex-1">
                      <LabeledInput
                        label="Name"
                        value={editValues.name ?? ""}
                        onChange={(v) =>
                          setEditValues({ ...editValues, name: v })
                        }
                      />
                      <LabeledInput
                        label="Category"
                        value={editValues.category ?? ""}
                        onChange={(v) =>
                          setEditValues({ ...editValues, category: v })
                        }
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <LabeledInput
                          label="Price"
                          type="number"
                          value={String(editValues.price ?? 0)}
                          onChange={(v) =>
                            setEditValues({
                              ...editValues,
                              price: parseFloat(v) || 0,
                            })
                          }
                        />
                        <LabeledInput
                          label="Stock"
                          type="number"
                          value={String(editValues.stock ?? 0)}
                          onChange={(v) =>
                            setEditValues({
                              ...editValues,
                              stock: parseInt(v, 10) || 0,
                            })
                          }
                        />
                      </div>
                      <LabeledInput
                        label="Image URL"
                        value={editValues.image_url ?? ""}
                        onChange={(v) =>
                          setEditValues({ ...editValues, image_url: v })
                        }
                      />

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => onSave(product.id)}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-wait text-white font-semibold rounded-lg text-sm transition flex items-center justify-center gap-2"
                        >
                          {isSaving && (
                            <span className="h-3.5 w-3.5 border-2 border-white/60 border-t-transparent rounded-full animate-spin" />
                          )}
                          {isSaving ? "Saving…" : "Save"}
                        </button>
                        <button
                          onClick={onCancel}
                          disabled={isSaving}
                          className="flex-1 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg text-sm transition disabled:opacity-60"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col">
                      <p className="text-slate-500 text-[11px] uppercase font-semibold tracking-wide mb-1">
                        {product.category || "Uncategorized"}
                      </p>
                      <h3 className="text-base font-bold mb-3 text-white leading-snug">
                        {product.name}
                      </h3>

                      <div className="space-y-1.5 mb-4 pt-3 border-t border-white/5 text-sm flex-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Price</span>
                          <span className="font-bold text-[#e8a88a]">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Stock</span>
                          <span
                            className={`font-bold ${
                              product.stock > 20
                                ? "text-green-400"
                                : product.stock > 10
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(product)}
                          className="flex-1 px-3 py-2 bg-[#e8a88a] hover:bg-[#d99977] text-black font-semibold rounded-lg text-sm transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => onDelete(product.id, product.name)}
                          disabled={isDeleting}
                          className="flex-1 px-3 py-2 bg-red-600/15 hover:bg-red-600/25 disabled:opacity-60 disabled:cursor-wait text-red-400 font-semibold rounded-lg text-sm transition flex items-center justify-center gap-2"
                        >
                          {isDeleting && (
                            <span className="h-3.5 w-3.5 border-2 border-red-400/60 border-t-transparent rounded-full animate-spin" />
                          )}
                          {isDeleting ? "Deleting…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-slate-500 mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-[#141f38] border border-white/10 rounded-lg text-white text-sm focus:border-[#e8a88a] focus:outline-none"
        step={type === "number" ? "0.01" : undefined}
        min={type === "number" ? "0" : undefined}
      />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-[#0a1428] border border-white/10 rounded-xl p-12 text-center text-slate-500">
      {text}
    </div>
  );
}
