"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAdminStore } from "@/lib/admin-store";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  ExternalLink,
  LogOut,
  ShieldCheck,
  Menu as MenuIcon,
  X,
  PlusCircle,
  Bell,
  Sparkles
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout, orders } = useAdminStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pendingOrdersCount = orders.filter((o) => o.status === "Pending").length;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (mounted && !isAuthenticated && !isLoginPage) {
      router.push("/admin/login");
    }
  }, [mounted, isAuthenticated, isLoginPage, router]);

  // If on login page, just render children without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Prevent flash before hydration auth check
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Manage Items",
      href: "/admin/items",
      icon: UtensilsCrossed,
      badge: null,
    },
    {
      label: "Manage Orders",
      href: "/admin/orders",
      icon: CalendarCheck,
      badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : null,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0c0a09] text-foreground">
      {/* Sidebar for Desktop */}
      <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-border/40 bg-card/60 backdrop-blur-xl lg:flex">
        {/* Brand Header */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-border/40 px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-xl leading-none">
                Maison<span className="text-accent">·</span>Auré
              </h1>
              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Executive Portal
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1.5 overflow-y-auto px-4 py-6">
          <p className="px-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground/80 mb-3">
            Administration
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${isActive
                  ? "bg-accent text-accent-foreground font-semibold shadow-md"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-accent"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${isActive
                      ? "bg-accent-foreground/20 text-accent-foreground"
                      : "bg-accent/20 text-accent"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* User Info & Logout */}
        <div className="shrink-0 border-t border-border/40 p-4">
          <div className="flex items-center justify-between rounded-xl border border-border/40 bg-background/50 p-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/20 text-accent font-display text-sm font-semibold">
                MA
              </div>
              <div className="truncate">
                <p className="truncate text-xs font-medium text-foreground">Chef Manager</p>
                <p className="truncate text-[10px] text-muted-foreground">admin@maisonaure.com</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              title="Sign Out"
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-20 shrink-0 items-center justify-between border-b border-border/40 bg-card/40 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-border/60 p-2 text-foreground lg:hidden cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
            <div className="hidden sm:block">
              <h2 className="font-display text-2xl capitalize">
                {pathname === "/admin"
                  ? "Executive Overview"
                  : pathname.replace("/admin/", "").replace("-", " ")}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3.5 py-1.5 text-xs text-muted-foreground sm:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Tribeca Kitchen Live</span>
            </div>

            <button
              onClick={() => {
                logout();
                router.push("/admin/login");
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground hover:border-destructive hover:text-destructive transition-colors cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-b border-border/60 bg-card p-4 lg:hidden">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${pathname === item.href
                    ? "bg-accent text-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-background/80"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] text-accent">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
