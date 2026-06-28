import { supabase } from "@/lib/supabaseClient";

/**
 * Admin Service — Handles admin authentication and database operations
 * IMPORTANT: Only Mr. Stark's UUID can access admin features
 */

// HARDCODE YOUR USER ID HERE (get from Supabase auth.users table)
// Example: const ADMIN_USER_ID = "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6";
const ADMIN_USER_ID = "adf7dc9e-2552-4347-9e45-c5bea472e3ad"; // Your UUID in quotes

/**
 * Check if current user is admin
 * Returns true only if user ID matches ADMIN_USER_ID
 */
export async function isUserAdmin(): Promise<boolean> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;
    return user.id === ADMIN_USER_ID;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}

/**
 * Get current logged-in user
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Fetch all orders with their items and customer details
 */
export async function fetchOrders() {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        user_id,
        total,
        status,
        shipping_name,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_zip,
        shipping_phone,
        delivery_method,
        shipping_cost,
        tax,
        payment_method,
        created_at,
        order_items(
          id,
          quantity,
          price,
          products(id, name, image_url, price)
        )
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

/**
 * Update order status (pending → paid → shipped → delivered)
 */
export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "shipped" | "delivered",
): Promise<boolean> {
  try {
    // Check admin first
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      console.error("Unauthorized: User is not admin");
      return false;
    }

    const { error } = await supabase
      .from("orders")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating order status:", error);
    return false;
  }
}

/**
 * Fetch all products (inventory)
 */
export async function fetchProducts() {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

/**
 * Update product inventory (stock quantity)
 */
export async function updateProductStock(
  productId: string,
  stock: number,
): Promise<boolean> {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      console.error("Unauthorized: User is not admin");
      return false;
    }

    const { error } = await supabase
      .from("products")
      .update({
        stock: Math.max(0, stock), // Don't allow negative stock
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating product stock:", error);
    return false;
  }
}

/**
 * Update product price
 */
export async function updateProductPrice(
  productId: string,
  price: number,
): Promise<boolean> {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      console.error("Unauthorized: User is not admin");
      return false;
    }

    const { error } = await supabase
      .from("products")
      .update({
        price: Math.max(0, price), // Don't allow negative prices
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating product price:", error);
    return false;
  }
}

/**
 * Update product details (name, category, image)
 */
export async function updateProduct(
  productId: string,
  updates: {
    name?: string;
    category?: string;
    image_url?: string;
    stock?: number;
    price?: number;
  },
): Promise<boolean> {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      console.error("Unauthorized: User is not admin");
      return false;
    }

    const { error } = await supabase
      .from("products")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating product:", error);
    return false;
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(productId: string): Promise<boolean> {
  try {
    const isAdmin = await isUserAdmin();
    if (!isAdmin) {
      console.error("Unauthorized: User is not admin");
      return false;
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting product:", error);
    return false;
  }
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats() {
  try {
    // Fetch orders for stats
    const { data: orders } = await supabase
      .from("orders")
      .select("total, status, created_at");

    const totalSales =
      orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const totalOrders = orders?.length || 0;
    const pendingOrders =
      orders?.filter((o) => o.status === "pending").length || 0;
    const deliveredOrders =
      orders?.filter((o) => o.status === "delivered").length || 0;

    // Fetch products for inventory stats
    const { data: products } = await supabase.from("products").select("stock");
    const totalStock =
      products?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0;
    const lowStockItems =
      products?.filter((p) => (p.stock || 0) < 10).length || 0;

    return {
      totalSales,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalStock,
      lowStockItems,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      totalSales: 0,
      totalOrders: 0,
      pendingOrders: 0,
      deliveredOrders: 0,
      totalStock: 0,
      lowStockItems: 0,
    };
  }
}

/**
 * Subscribe to real-time order updates
 */
export function subscribeToOrders(callback: (orders: any[]) => void) {
  const subscription = supabase
    .channel("orders_channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "orders",
      },
      () => {
        // Re-fetch orders when changes occur
        fetchOrders().then(callback);
      },
    )
    .subscribe();

  return subscription;
}

/**
 * Subscribe to real-time product updates
 */
export function subscribeToProducts(callback: (products: any[]) => void) {
  const subscription = supabase
    .channel("products_channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "products",
      },
      () => {
        // Re-fetch products when changes occur
        fetchProducts().then(callback);
      },
    )
    .subscribe();

  return subscription;
}
