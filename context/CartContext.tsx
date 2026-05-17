"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  qty: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("fyp-cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load cart:", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("fyp-cart", JSON.stringify(items));
    }
  }, [items, isHydrated]);

  const addToCart = (newItem: CartItem) => {
    setItems((prevItems) => {
      const existing = prevItems.find((item) => item.id === newItem.id);
      if (existing) {
        return prevItems.map((item) =>
          item.id === newItem.id ? { ...item, qty: item.qty + newItem.qty } : item
        );
      }
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
    } else {
      setItems((prevItems) =>
        prevItems.map((item) => (item.id === id ? { ...item, qty } : item))
      );
    }
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((total, item) => total + item.qty, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
