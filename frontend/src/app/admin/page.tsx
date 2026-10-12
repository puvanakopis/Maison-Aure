"use client";

import React from "react";
import Link from "next/link";
import { useItems } from "@/context/ItemContext";
import { useReservations } from "@/context/ReservationContext";
import { menuCategories } from "@/interfaces/item.interface";
import {
  UtensilsCrossed,
  CalendarCheck,
  Clock,
  Users,
  DollarSign,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Search
} from "lucide-react";

export default function AdminDashboardPage() {
  const { items, categories } = useItems();
  const { reservations: orders, updateReservationStatus: updateOrderStatus, stats } = useReservations();

  const pendingOrders = orders.filter((o) => o.status === "Pending");
  const confirmedOrders = orders.filter((o) => o.status === "Confirmed");
  const todayTotalGuests = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((acc, curr) => acc + (curr.guests || 0), 0);
  const totalEstimatedRevenue = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((acc, curr) => acc + (curr.totalEstimated || 0), 0);

  const statusColorMap: Record<string, string> = {
    Pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    Confirmed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    Completed: "bg-muted text-muted-foreground border-border",
    Cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  };

  return (
    <div className="space-y-10">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">— Management Dashboard</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Kitchen & Dining Operations</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Real-time control over seasonal menu items, culinary offerings, and guest bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/items?action=new"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-accent-foreground hover:bg-accent/90 transition shadow-lg shadow-accent/10"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Add Menu Item</span>
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-5 py-3 text-xs uppercase tracking-[0.2em] font-medium text-foreground hover:border-accent hover:text-accent transition"
          >
            <CalendarCheck className="h-4 w-4" />
            <span>View All Bookings</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Active Menu Items</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent border border-accent/20">
              <UtensilsCrossed className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 font-display text-4xl">{items.length}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-accent font-medium">{menuCategories.length} Categories</span>
            <span>· Ready for service</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Bookings</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <CalendarCheck className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 font-display text-4xl">{orders.length}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-blue-400 font-medium">{confirmedOrders.length} Confirmed</span>
            <span>· All locations</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pending Action</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 font-display text-4xl">{pendingOrders.length}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            {pendingOrders.length > 0 ? (
              <span className="text-amber-400 font-medium">Awaiting approval</span>
            ) : (
              <span className="text-emerald-400 font-medium">All cleared</span>
            )}
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guest Covers</span>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 font-display text-4xl">{todayTotalGuests}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="text-emerald-400 font-medium">${totalEstimatedRevenue.toLocaleString()}</span>
            <span>projected volume</span>
          </div>
        </div>
      </div>

      {/* Main Sections: Recent Orders & Category Overview */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Recent Orders (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
          <div className="flex items-center justify-between border-b border-border/40 pb-5">
            <div>
              <h2 className="font-display text-2xl">Recent Reservations & Orders</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Latest customer bookings and service statuses.
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="group inline-flex items-center gap-1.5 text-xs uppercase tracking-wider text-accent hover:underline"
            >
              <span>Manage all</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-6 divide-y divide-border/40 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-medium">Ref / Guest</th>
                  <th className="pb-3 font-medium">Date & Time</th>
                  <th className="pb-3 font-medium">Guests</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="group hover:bg-background/40 transition-colors">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-foreground">{ord.customerName}</p>
                      <p className="text-xs text-muted-foreground">{ord.id} · {ord.email}</p>
                    </td>
                    <td className="py-4 pr-4 text-xs text-muted-foreground whitespace-nowrap">
                      <p className="text-foreground">{ord.date}</p>
                      <p>{ord.time}</p>
                    </td>
                    <td className="py-4 pr-4 text-xs">
                      <span className="font-semibold text-foreground">{ord.guests}</span> guests
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider ${
                          statusColorMap[ord.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-4 text-right whitespace-nowrap">
                      {ord.status === "Pending" ? (
                        <button
                          onClick={() => updateOrderStatus(ord.id, "Confirmed")}
                          className="rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent/90 transition cursor-pointer"
                        >
                          Confirm
                        </button>
                      ) : ord.status === "Confirmed" ? (
                        <button
                          onClick={() => updateOrderStatus(ord.id, "Completed")}
                          className="rounded-lg border border-border px-3 py-1.5 text-xs text-foreground hover:border-accent hover:text-accent transition cursor-pointer"
                        >
                          Complete
                        </button>
                      ) : (
                        <Link
                          href="/admin/orders"
                          className="text-xs text-muted-foreground hover:text-foreground"
                        >
                          Details
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Menu Categories & Highlights (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Category distribution */}
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <h3 className="font-display text-xl">Menu Categories</h3>
              <Link href="/admin/items" className="text-xs text-accent hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-5 space-y-3">
              {menuCategories.map((c) => {
                const count = items.filter((m) => m.category === c.id).length;
                const percentage = Math.round((count / (items.length || 1)) * 100);
                return (
                  <div key={c.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">{c.label}</span>
                      <span className="text-muted-foreground">{count} items ({percentage}%)</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-background">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card/80 to-accent/5 p-6 backdrop-blur">
            <h3 className="font-display text-xl">Quick Controls</h3>
            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
              Direct access to kitchen database and live services.
            </p>
            <div className="mt-5 space-y-2">
              <Link
                href="/admin/items?action=new"
                className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle className="h-4 w-4 text-accent" />
                  <span>Create seasonal dish</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin/orders"
                className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <CalendarCheck className="h-4 w-4 text-blue-400" />
                  <span>Review booking table floor</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex w-full items-center justify-between rounded-xl border border-border/60 bg-background/50 p-3 text-xs font-medium hover:border-accent hover:text-accent transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-accent" />
                  <span>View customer live menu</span>
                </div>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
