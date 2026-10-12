"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useItems } from "@/context/ItemContext";
import { MenuItem, menuCategories } from "@/interfaces/item.interface";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  X,
  Check,
  Tag,
  DollarSign,
  Image as ImageIcon,
  ChefHat
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ManageItemsPage() {
  const { items, createItem: addItem, updateItem, deleteItem } = useItems();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    category: "appetizers" as MenuItem["category"],
    price: 24,
    description: "",
    ingredients: "",
    image: "",
    badge: "" as "" | "Chef's Pick" | "Trending" | "Seasonal",
  });

  // Open modal if URL has ?action=new
  useEffect(() => {
    if (searchParams.get("action") === "new") {
      openAddModal();
    }
  }, [searchParams]);

  function openAddModal() {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "mains",
      price: 28,
      description: "",
      ingredients: "",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
      badge: "",
    });
    setModalOpen(true);
  }

  function openEditModal(item: MenuItem) {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      ingredients: item.ingredients.join(", "),
      image: item.image,
      badge: item.badge || "",
    });
    setModalOpen(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const ingredientsArray = formData.ingredients
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    if (editingItem) {
      updateItem(editingItem.id, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        ingredients: ingredientsArray,
        image: formData.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
        badge: formData.badge ? (formData.badge as MenuItem["badge"]) : undefined,
      });
    } else {
      addItem({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        ingredients: ingredientsArray,
        image: formData.image || "https://images.unsplash.com/photo-1544025162-d76694265947?w=900&q=80",
        badge: formData.badge ? (formData.badge as MenuItem["badge"]) : undefined,
      });
    }

    setModalOpen(false);
  }

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">— Culinary Catalog</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Manage Menu Items</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add, update, or revise seasonal recipes, descriptions, pricing, and visual presentation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-accent-foreground hover:bg-accent/90 transition shadow-lg shadow-accent/10 cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Dish</span>
          </button>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between backdrop-blur">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search dish name, ingredient, or note..."
            className="h-10 rounded-xl bg-background/80 pl-10 border-input text-xs"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition cursor-pointer ${
              activeCategory === "all"
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/80"
            }`}
          >
            All ({items.length})
          </button>
          {menuCategories.map((cat) => {
            const count = items.filter((m) => m.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Dishes Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-16 text-center">
          <ChefHat className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-2xl">No menu items found</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            No items matched your active category filter or search keywords.
          </p>
          <button
            onClick={openAddModal}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs uppercase tracking-wider text-accent-foreground font-semibold"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Dish</span>
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card/60 transition-all hover:border-foreground/30 hover:shadow-xl backdrop-blur"
            >
              {/* Image Banner */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-background">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />

                {item.badge && (
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold text-accent backdrop-blur border border-accent/20">
                    {item.badge}
                  </span>
                )}

                <div className="absolute right-3 top-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(item)}
                    className="grid h-8 w-8 place-items-center rounded-full bg-background/90 text-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-md cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Remove "${item.name}" from the menu?`)) {
                        deleteItem(item.id);
                      }
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full bg-background/90 text-destructive hover:bg-destructive hover:text-white transition-colors shadow-md cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Content Details */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent">
                      {menuCategories.find((c) => c.id === item.category)?.label || item.category}
                    </span>
                    <h3 className="mt-1 font-display text-2xl leading-tight text-foreground">
                      {item.name}
                    </h3>
                  </div>
                  <span className="shrink-0 font-display text-2xl tabular-nums text-foreground">
                    ${item.price}
                  </span>
                </div>

                <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {item.description}
                </p>

                {/* Ingredients Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {item.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="rounded-full border border-border/70 bg-background/50 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground"
                    >
                      {ing}
                    </span>
                  ))}
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
                  <span className="text-[11px] text-muted-foreground/60 font-mono">ID: {item.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs text-muted-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${item.name}" from the menu?`)) {
                          deleteItem(item.id);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 px-3 py-1.5 text-xs text-muted-foreground hover:border-destructive hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create / Edit Item */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-accent">
                  {editingItem ? "Update Dish" : "Kitchen Entry"}
                </span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl">
                  {editingItem ? `Edit: ${editingItem.name}` : "Create New Menu Item"}
                </h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Dish Name
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Saffron Halibut"
                    className="mt-1.5 h-11 rounded-xl bg-background border-input text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as MenuItem["category"] })
                    }
                    className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
                  >
                    {menuCategories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-card text-foreground">
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Price (USD)
                  </label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="number"
                      required
                      min={1}
                      step="any"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="h-11 rounded-xl bg-background pl-9 border-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Badge Highlight
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        badge: e.target.value as "" | "Chef's Pick" | "Trending" | "Seasonal",
                      })
                    }
                    className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
                  >
                    <option value="" className="bg-card text-foreground">None</option>
                    <option value="Chef's Pick" className="bg-card text-foreground">Chef&apos;s Pick</option>
                    <option value="Trending" className="bg-card text-foreground">Trending</option>
                    <option value="Seasonal" className="bg-card text-foreground">Seasonal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Description
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Artisanal description of the preparation and flavor profile..."
                  className="mt-1.5 flex w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/60 caret-accent focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/40 transition-all duration-200"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Ingredients (Comma Separated)
                </label>
                <Input
                  required
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="Halibut, Leek fondue, Beurre blanc, Caviar"
                  className="mt-1.5 h-11 rounded-xl bg-background border-input text-sm"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Image URL
                </label>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="mt-1.5 h-11 rounded-xl bg-background border-input text-sm font-mono"
                />
              </div>

              {/* Preview image thumbnail */}
              {formData.image && (
                <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-background/50 p-2">
                  <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-card">
                    <img src={formData.image} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                  <span className="text-xs text-muted-foreground">Visual preview confirmed</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-border px-5 py-2.5 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-accent px-6 py-2.5 text-xs uppercase tracking-[0.18em] font-semibold text-accent-foreground hover:bg-accent/90 transition shadow-lg shadow-accent/10 cursor-pointer"
                >
                  {editingItem ? "Update Dish" : "Create Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
