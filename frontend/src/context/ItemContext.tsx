"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  MenuItem,
  MenuCategory,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from "@/interfaces/item.interface";
import { itemService } from "@/services/itemService";

interface ItemContextType {
  items: MenuItem[];
  categories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
  fetchItems: (params?: { category?: string; search?: string }) => Promise<MenuItem[]>;
  createItem: (data: CreateMenuItemDto) => Promise<MenuItem>;
  updateItem: (id: string, data: UpdateMenuItemDto) => Promise<MenuItem>;
  deleteItem: (id: string) => Promise<void>;
  resetItems: () => Promise<void>;
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export function ItemProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async (params?: { category?: string; search?: string }): Promise<MenuItem[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await itemService.getAllItems(params);
      setItems(data || []);
      return data || [];
    } catch (err: any) {
      console.warn("Could not fetch items from backend:", err?.message);
      setError(err?.message || "Failed to load items");
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async (): Promise<MenuCategory[]> => {
    try {
      const cats = await itemService.getCategories();
      if (cats && cats.length > 0) {
        setCategories(cats);
        return cats;
      }
    } catch (err) {
      console.warn("Could not fetch categories from backend:", err);
    }
    return [];
  }, []);

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, [fetchItems, fetchCategories]);

  const createItem = useCallback(async (data: CreateMenuItemDto): Promise<MenuItem> => {
    try {
      const newItem = await itemService.createMenuItem(data);
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (err: any) {
      console.error("Error creating item:", err);
      throw err;
    }
  }, []);

  const updateItem = useCallback(async (id: string, data: UpdateMenuItemDto): Promise<MenuItem> => {
    try {
      const updated = await itemService.updateMenuItem(id, data);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      return updated;
    } catch (err) {
      console.error("Error updating item via API:", err);
      throw err;
    }
  }, []);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    try {
      await itemService.deleteMenuItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error deleting item via API:", err);
      throw err;
    }
  }, []);

  const resetItems = useCallback(async (): Promise<void> => {
    try {
      const restored = await itemService.resetMenuItems();
      setItems(restored || []);
    } catch (err) {
      console.error("Error resetting items via API:", err);
      throw err;
    }
  }, []);

  return (
    <ItemContext.Provider
      value={{
        items,
        categories,
        isLoading,
        error,
        fetchItems,
        createItem,
        updateItem,
        deleteItem,
        resetItems,
      }}
    >
      {children}
    </ItemContext.Provider>
  );
}

export function useItems() {
  const context = useContext(ItemContext);
  if (!context) {
    throw new Error("useItems must be used within an ItemProvider");
  }
  return context;
}

export default ItemContext;
