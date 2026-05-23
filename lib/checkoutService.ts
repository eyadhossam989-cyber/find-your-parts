import { supabase } from "./supabaseClient";

export interface CheckoutFormData {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  deliveryMethod: "standard" | "express";
  paymentMethod: "card" | "paypal";
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export async function createOrder(
  userId: string,
  formData: CheckoutFormData,
  cartItems: CartItem[],
  totals: { subtotal: number; shipping: number; tax: number; total: number }
) {
  try {
    // Step 1: Insert order into orders table
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: userId,
          total: totals.total,
          status: "pending",
          shipping_name: formData.fullName,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state,
          shipping_zip: formData.zipCode,
          delivery_method: formData.deliveryMethod,
          shipping_cost: totals.shipping,
          tax: totals.tax,
          payment_method: formData.paymentMethod,
        },
      ])
      .select();

    if (orderError) {
      console.error("❌ Order creation error:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    const orderId = orderData[0].id;
    console.log("✅ Order created:", orderId);

    // Step 2: FETCH ALL PRODUCTS for Smart Matching
    // We fetch all product IDs and names once to do case-insensitive matching in code
    const { data: productsData, error: productsError } = await supabase
      .from("products")
      .select("id, name");

    if (productsError) {
      console.error("❌ Error fetching products:", productsError);
      throw new Error(`Failed to fetch products: ${productsError.message}`);
    }

    // Step 3: Insert order items with Case-Insensitive Matching
    const orderItems = cartItems
      .map((item) => {
        // Find match by making both names lowercase and removing extra spaces
        const matchedProduct = productsData.find(
          (p) => p.name.toLowerCase().trim() === item.name.toLowerCase().trim()
        );

        if (!matchedProduct) {
          console.warn(`⚠️ No database match found for cart item: "${item.name}"`);
          return null;
        }

        return {
          order_id: orderId,
          product_id: matchedProduct.id,
          quantity: item.qty,
          price: parseFloat(item.price.toString()),
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // SAFETY NET: If no products matched, delete the "empty" order and stop
    if (orderItems.length === 0) {
      console.error("❌ Checkout blocked: No items in cart matched the database.");
      await supabase.from("orders").delete().eq("id", orderId);
      throw new Error("Checkout failed: Product names in cart do not match our database records.");
    }

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("❌ Order items creation error:", itemsError);
      // Clean up the order if items fail to link
      await supabase.from("orders").delete().eq("id", orderId);
      throw new Error(`Failed to add items: ${itemsError.message}`);
    }

    console.log("✅ Order items created");

    return {
      success: true,
      orderId: orderId,
      message: "Order created successfully!",
    };
  } catch (error) {
    console.error("❌ Checkout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getOrder(orderId: string) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (id, name, image_url, price)
        )
      `
      )
      .eq("id", orderId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch order: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("❌ Get order error:", error);
    throw error;
  }
}