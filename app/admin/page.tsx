"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isUserAdmin,
  fetchOrders,
  fetchProducts,
  updateOrderStatus,
  updateProductStock,
  updateProductPrice,
  updateProduct,
  deleteProduct,
  getDashboardStats,
  subscribeToOrders,
  subscribeToProducts,
} from "@/lib/adminService";

// Types
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
  // Supabase's nested select can return a joined relation as a single
  // object OR as an array depending on the FK relationship it infers
  // (this bit us before on the orders page — see Bug 1 in the
  // troubleshooting guide). We accept either shape here and always
  // read it through getProductRef() below so the UI never breaks.
  products: ProductRef | ProductRef[];
}

function getProductRef(item: OrderItem): ProductRef {
  return Array.isArray(item.products) ? item.products[0] : item.products;
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

export default function AdminPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "orders" | "inventory"
  >("dashboard");

  // Data states
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

  // UI states
  const [searchOrders, setSearchOrders] = useState("");
  const [searchProducts, setSearchProducts] = useState("");
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Product>>({});
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Check admin access on mount
  useEffect(() => {
    const checkAdmin = async () => {
      const admin = await isUserAdmin();
      if (!admin) {
        router.push("/"); // Redirect non-admins
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  // Load initial data
  useEffect(() => {
    if (!isAdmin) return;

    const loadData = async () => {
      const ordersData = await fetchOrders();
      const productsData = await fetchProducts();
      const statsData = await getDashboardStats();

      // Cast: fetchOrders()'s return type can differ slightly from this
      // file's local Order/OrderItem shape (see getProductRef() above).
      setOrders(ordersData as unknown as Order[]);
      setProducts(productsData);
      setStats(statsData);
    };
    loadData();
  }, [isAdmin]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isAdmin) return;

    const orderSub = subscribeToOrders(setOrders);
    const productSub = subscribeToProducts(setProducts);

    return () => {
      orderSub?.unsubscribe();
      productSub?.unsubscribe();
    };
  }, [isAdmin]);

  // Show toast notification
  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle order status update
  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: Order["status"],
  ) => {
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      showToast(`Order updated to ${newStatus}`);
      const updated = await fetchOrders();
      setOrders(updated as unknown as Order[]);
    } else {
      showToast("Failed to update order", "error");
    }
  };

  // Handle product edit
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product.id);
    setEditValues({ ...product });
  };

  // Handle product save
  const handleSaveProduct = async (productId: string) => {
    const success = await updateProduct(productId, editValues);
    if (success) {
      showToast("Product updated successfully");
      const updated = await fetchProducts();
      setProducts(updated);
      setEditingProduct(null);
    } else {
      showToast("Failed to update product", "error");
    }
  };

  // Handle product delete
  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    const success = await deleteProduct(productId);
    if (success) {
      showToast("Product deleted successfully");
      const updated = await fetchProducts();
      setProducts(updated);
    } else {
      showToast("Failed to update product", "error");
    }
  };

  // Filtered data
  const filteredOrders = orders.filter(
    (order) =>
      order.id.includes(searchOrders) ||
      order.shipping_name.toLowerCase().includes(searchOrders.toLowerCase()),
  );

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchProducts.toLowerCase()),
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#060e1a] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">⚙️</div>
          <p className="text-xl">Verifying admin access...</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return null; // Already redirected
  }

  return (
    <main className="min-h-screen bg-[#060e1a] text-white">
      {/* Header */}
      <div className="bg-[#0a1428] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">🔒 FYP Admin Dashboard</h1>
            <p className="text-slate-400 text-sm">
              Secure admin panel — Real-time order & inventory management
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="px-4 py-2 bg-[#e8a88a] hover:bg-[#d99977] text-black font-bold rounded-lg transition"
          >
            Exit Admin
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg font-semibold animate-pulse z-40 ${
            toast.type === "success"
              ? "bg-green-500/20 text-green-300"
              : "bg-red-500/20 text-red-300"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-[#0a1428] border-b border-white/10 sticky top-[80px] z-40">
        <div className="max-w-[1600px] mx-auto px-8 flex gap-8">
          {["dashboard", "orders", "inventory"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-2 font-semibold capitalize border-b-2 transition ${
                activeTab === tab
                  ? "border-[#e8a88a] text-[#e8a88a]"
                  : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 py-8">
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Sales */}
              <div className="bg-[#0a1428] border border-white/10 rounded-xl p-6 hover:border-[#e8a88a]/50 transition">
                <p className="text-slate-400 text-sm font-semibold">
                  TOTAL SALES
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  ${stats.totalSales.toFixed(2)}
                </h2>
                <p className="text-[#e8a88a] text-sm mt-2">All time</p>
              </div>

              {/* Total Orders */}
              <div className="bg-[#0a1428] border border-white/10 rounded-xl p-6 hover:border-[#e8a88a]/50 transition">
                <p className="text-slate-400 text-sm font-semibold">
                  TOTAL ORDERS
                </p>
                <h2 className="text-3xl font-bold mt-2">{stats.totalOrders}</h2>
                <p className="text-blue-400 text-sm mt-2">
                  {stats.pendingOrders} pending
                </p>
              </div>

              {/* Delivered Orders */}
              <div className="bg-[#0a1428] border border-white/10 rounded-xl p-6 hover:border-[#e8a88a]/50 transition">
                <p className="text-slate-400 text-sm font-semibold">
                  DELIVERED
                </p>
                <h2 className="text-3xl font-bold mt-2">
                  {stats.deliveredOrders}
                </h2>
                <p className="text-green-400 text-sm mt-2">
                  {(
                    (stats.deliveredOrders / stats.totalOrders) * 100 || 0
                  ).toFixed(0)}
                  % success rate
                </p>
              </div>

              {/* Inventory Health */}
              <div className="bg-[#0a1428] border border-white/10 rounded-xl p-6 hover:border-[#e8a88a]/50 transition">
                <p className="text-slate-400 text-sm font-semibold">
                  INVENTORY
                </p>
                <h2 className="text-3xl font-bold mt-2">{stats.totalStock}</h2>
                <p
                  className={`text-sm mt-2 ${stats.lowStockItems > 0 ? "text-red-400" : "text-green-400"}`}
                >
                  {stats.lowStockItems} items low stock
                </p>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-gradient-to-r from-[#0a1428] to-[#1a2a48] border border-[#e8a88a]/20 rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">System Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-slate-400 text-sm">Database</p>
                  <p className="text-green-400 font-bold">✓ Connected</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Auth</p>
                  <p className="text-green-400 font-bold">✓ Verified</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Real-time</p>
                  <p className="text-green-400 font-bold">✓ Active</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Sync</p>
                  <p className="text-green-400 font-bold">✓ Live</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by order ID or customer name..."
                value={searchOrders}
                onChange={(e) => setSearchOrders(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a1428] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-[#e8a88a] focus:outline-none"
              />
            </div>

            <div className="space-y-4">
              {filteredOrders.length === 0 ? (
                <div className="bg-[#0a1428] border border-white/10 rounded-xl p-8 text-center text-slate-400">
                  No orders found
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-[#0a1428] border border-white/10 rounded-xl p-6 hover:border-[#e8a88a]/50 transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-slate-400 text-sm">Order ID</p>
                        <p className="font-mono font-bold text-[#e8a88a]">
                          {order.id.slice(0, 8).toUpperCase()}...
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Customer</p>
                        <p className="font-semibold">{order.shipping_name}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Total</p>
                        <p className="font-bold text-green-400">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm">Status</p>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleOrderStatusChange(
                              order.id,
                              e.target.value as Order["status"],
                            )
                          }
                          className={`font-semibold px-3 py-1 rounded-lg border-0 cursor-pointer ${
                            order.status === "pending"
                              ? "bg-yellow-500/20 text-yellow-300"
                              : order.status === "paid"
                                ? "bg-blue-500/20 text-blue-300"
                                : order.status === "shipped"
                                  ? "bg-purple-500/20 text-purple-300"
                                  : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 pb-4 border-t border-white/5 pt-4">
                      <div>
                        <p className="text-slate-400 text-sm mb-2">
                          Shipping Address
                        </p>
                        <p className="text-sm">
                          {order.shipping_address}, {order.shipping_city},{" "}
                          {order.shipping_state} {order.shipping_zip}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2">Contact</p>
                        <p className="text-sm">{order.shipping_phone}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2">
                          Delivery Method
                        </p>
                        <p className="text-sm capitalize">
                          {order.delivery_method}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-sm mb-2">
                          Order Date
                        </p>
                        <p className="text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-[#1a2a48]/50 rounded-lg p-4">
                      <p className="text-slate-400 text-sm mb-3 font-semibold">
                        Items ({order.order_items.length})
                      </p>
                      <div className="space-y-2">
                        {order.order_items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm"
                          >
                            <span>
                              {getProductRef(item).name} × {item.quantity}
                            </span>
                            <span className="text-[#e8a88a]">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Breakdown */}
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between">
                      <div className="text-sm text-slate-400">
                        <p>
                          Subtotal: $
                          {(
                            order.total -
                            order.tax -
                            order.shipping_cost
                          ).toFixed(2)}
                        </p>
                        <p>Shipping: ${order.shipping_cost.toFixed(2)}</p>
                        <p>Tax: ${order.tax.toFixed(2)}</p>
                      </div>
                      <div className="text-lg font-bold text-[#e8a88a]">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* INVENTORY TAB */}
        {activeTab === "inventory" && (
          <div>
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search by product name or category..."
                value={searchProducts}
                onChange={(e) => setSearchProducts(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a1428] border border-white/10 rounded-lg text-white placeholder-slate-500 focus:border-[#e8a88a] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-full bg-[#0a1428] border border-white/10 rounded-xl p-8 text-center text-slate-400">
                  No products found
                </div>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-[#0a1428] border border-white/10 rounded-xl overflow-hidden hover:border-[#e8a88a]/50 transition"
                  >
                    {/* Product Image */}
                    <div className="h-48 bg-[#1a2a48] overflow-hidden flex items-center justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-600">No image</div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-6">
                      {editingProduct === product.id ? (
                        // EDIT MODE
                        <div className="space-y-4">
                          <input
                            type="text"
                            placeholder="Product name"
                            value={editValues.name || ""}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                name: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-[#1a2a48] border border-white/10 rounded text-white text-sm focus:border-[#e8a88a] focus:outline-none"
                          />

                          <input
                            type="text"
                            placeholder="Category"
                            value={editValues.category || ""}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                category: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-[#1a2a48] border border-white/10 rounded text-white text-sm focus:border-[#e8a88a] focus:outline-none"
                          />

                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="number"
                              placeholder="Price"
                              value={editValues.price || 0}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  price: parseFloat(e.target.value),
                                })
                              }
                              className="px-3 py-2 bg-[#1a2a48] border border-white/10 rounded text-white text-sm focus:border-[#e8a88a] focus:outline-none"
                              step="0.01"
                              min="0"
                            />
                            <input
                              type="number"
                              placeholder="Stock"
                              value={editValues.stock || 0}
                              onChange={(e) =>
                                setEditValues({
                                  ...editValues,
                                  stock: parseInt(e.target.value),
                                })
                              }
                              className="px-3 py-2 bg-[#1a2a48] border border-white/10 rounded text-white text-sm focus:border-[#e8a88a] focus:outline-none"
                              min="0"
                            />
                          </div>

                          <input
                            type="text"
                            placeholder="Image URL"
                            value={editValues.image_url || ""}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                image_url: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 bg-[#1a2a48] border border-white/10 rounded text-white text-sm focus:border-[#e8a88a] focus:outline-none"
                          />

                          <div className="flex gap-2 pt-2">
                            <button
                              onClick={() => handleSaveProduct(product.id)}
                              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded text-sm transition"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingProduct(null)}
                              className="flex-1 px-3 py-2 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded text-sm transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        // VIEW MODE
                        <div>
                          <p className="text-slate-400 text-xs uppercase font-semibold mb-1">
                            {product.category}
                          </p>
                          <h3 className="text-lg font-bold mb-2 text-white">
                            {product.name}
                          </h3>

                          <div className="space-y-2 mb-4 pb-4 border-t border-white/5 pt-4">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Price</span>
                              <span className="font-bold text-[#e8a88a]">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Stock</span>
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
                              onClick={() => handleEditProduct(product)}
                              className="flex-1 px-3 py-2 bg-[#e8a88a] hover:bg-[#d99977] text-black font-semibold rounded text-sm transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="flex-1 px-3 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-semibold rounded text-sm transition"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
