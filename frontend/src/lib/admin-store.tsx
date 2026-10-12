"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { MenuItem, menuItems as initialMenuItems, menuCategories } from "./restaurant-data";

export type OrderStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface OrderItem {
  id: string;
  customerName: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  guests: number;
  tableNumber?: string;
  status: OrderStatus;
  notes?: string;
  totalEstimated?: number;
  createdAt: string;
}

interface AdminContextType {
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  // Menu items
  items: MenuItem[];
  addItem: (item: Omit<MenuItem, "id">) => void;
  updateItem: (id: string, updated: Partial<MenuItem>) => void;
  deleteItem: (id: string) => void;
  resetItemsToDefault: () => void;
  // Orders
  orders: OrderItem[];
  addOrder: (order: Omit<OrderItem, "id" | "createdAt">) => OrderItem;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: "ORD-1001",
    customerName: "Julian Vance",
    email: "julian.v@luxurybrand.com",
    phone: "+1 (212) 555-8921",
    date: "2026-10-12",
    time: "7:30 PM",
    guests: 4,
    tableNumber: "T-04 (Window)",
    status: "Confirmed",
    notes: "Anniversary celebration · Prefers wine pairing suggestion from Diego",
    totalEstimated: 340,
    createdAt: "2026-10-12T10:15:00Z",
  },
  {
    id: "ORD-1002",
    customerName: "Camilla Rothschild",
    email: "camilla.r@editorial.fr",
    phone: "+1 (415) 555-4390",
    date: "2026-10-12",
    time: "8:00 PM",
    guests: 2,
    tableNumber: "T-01 (Chef's Pass)",
    status: "Pending",
    notes: "Gluten sensitive · High priority seating",
    totalEstimated: 180,
    createdAt: "2026-10-12T11:40:00Z",
  },
  {
    id: "ORD-1003",
    customerName: "Ethan Cross",
    email: "cross.e@architects.ny",
    phone: "+1 (212) 555-0912",
    date: "2026-10-12",
    time: "6:00 PM",
    guests: 6,
    tableNumber: "P-01 (Private Alcove)",
    status: "Confirmed",
    notes: "Pre-ordered Wagyu Striploin & Saffron Risotto",
    totalEstimated: 520,
    createdAt: "2026-10-11T18:20:00Z",
  },
  {
    id: "ORD-1004",
    customerName: "Seraphina Lin",
    email: "s.lin@galleryny.org",
    phone: "+1 (305) 555-9124",
    date: "2026-10-13",
    time: "8:30 PM",
    guests: 2,
    tableNumber: "T-06 (Garden View)",
    status: "Confirmed",
    notes: "Requesting sommelier Diego for natural wine selection",
    totalEstimated: 210,
    createdAt: "2026-10-12T09:05:00Z",
  },
  {
    id: "ORD-1005",
    customerName: "Harrison Forde",
    email: "h.forde@venture.co",
    phone: "+1 (212) 555-7788",
    date: "2026-10-13",
    time: "7:00 PM",
    guests: 3,
    status: "Pending",
    notes: "First time dining at Maison·Auré",
    totalEstimated: 260,
    createdAt: "2026-10-12T13:30:00Z",
  },
  {
    id: "ORD-1006",
    customerName: "Genevieve Monet",
    email: "g.monet@critics.com",
    phone: "+1 (212) 555-6611",
    date: "2026-10-11",
    time: "6:30 PM",
    guests: 2,
    status: "Completed",
    notes: "Wonderful dinner, praised the Valrhona Souffle",
    totalEstimated: 195,
    createdAt: "2026-10-11T12:00:00Z",
  },
];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [items, setItems] = useState<MenuItem[]>(initialMenuItems);
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("maison_aure_admin_auth");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }

      const savedItems = localStorage.getItem("maison_aure_menu_items");
      if (savedItems) {
        setItems(JSON.parse(savedItems));
      }

      const savedOrders = localStorage.getItem("maison_aure_orders");
      if (savedOrders) {
        const parsed = JSON.parse(savedOrders);
        const sanitized = Array.isArray(parsed)
          ? parsed.map((ord: OrderItem) =>
              (ord.status as string) === "Seated" ? { ...ord, status: "Confirmed" as OrderStatus } : ord
            )
          : parsed;
        setOrders(sanitized);
      }
    } catch (e) {
      console.error("Failed to load admin store from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save items
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("maison_aure_menu_items", JSON.stringify(items));
    } catch (e) {
      console.error("Failed to persist menu items", e);
    }
  }, [items, isLoaded]);

  // Save orders
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem("maison_aure_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Failed to persist orders", e);
    }
  }, [orders, isLoaded]);

  function login(email: string, pass: string): boolean {
    // Default admin credentials: admin@maisonaure.com / admin123 (or any valid email & pass of 6+ chars)
    if (
      (email.toLowerCase().trim() === "admin@maisonaure.com" && pass === "admin123") ||
      (email.includes("@") && pass.length >= 6)
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("maison_aure_admin_auth", "true");
      return true;
    }
    return false;
  }

  function logout() {
    setIsAuthenticated(false);
    localStorage.removeItem("maison_aure_admin_auth");
  }

  function addItem(newItem: Omit<MenuItem, "id">) {
    const id = Date.now().toString();
    const item: MenuItem = { ...newItem, id };
    setItems((prev) => [item, ...prev]);
  }

  function updateItem(id: string, updated: Partial<MenuItem>) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function resetItemsToDefault() {
    setItems(initialMenuItems);
    localStorage.removeItem("maison_aure_menu_items");
  }

  function addOrder(orderData: Omit<OrderItem, "id" | "createdAt">): OrderItem {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderItem = {
      ...orderData,
      id,
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }

  function updateOrderStatus(id: string, status: OrderStatus) {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === id ? { ...ord, status } : ord))
    );
  }

  function deleteOrder(id: string) {
    setOrders((prev) => prev.filter((ord) => ord.id !== id));
  }

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        items,
        addItem,
        updateItem,
        deleteItem,
        resetItemsToDefault,
        orders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminStore() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminStore must be used within an AdminProvider");
  }
  return context;
}
