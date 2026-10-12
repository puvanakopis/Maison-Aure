"use client";

import React, { useState } from "react";
import { useReservations } from "@/context/ReservationContext";
import {
  ReservationStatus as OrderStatus,
  ReservationItem as OrderItem,
} from "@/interfaces/reservation.interface";
import {
  CalendarCheck,
  Search,
  Filter,
  Users,
  Clock,
  Mail,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Trash2,
  Plus,
  X,
  MapPin,
  Calendar as CalIcon,
  DollarSign
} from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ManageOrdersPage() {
  const {
    reservations: orders,
    updateReservationStatus: updateOrderStatus,
    deleteReservation: deleteOrder,
    createReservation: addOrder,
  } = useReservations();

  const [activeStatus, setActiveStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Create Manual Order Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    date: new Date().toISOString().split("T")[0],
    time: "7:00 PM",
    guests: 2,
    tableNumber: "T-02",
    status: "Confirmed" as OrderStatus,
    notes: "",
    totalEstimated: 160,
  });

  const statuses: OrderStatus[] = ["Pending", "Confirmed", "Completed", "Cancelled"];

  const statusColorMap: Record<OrderStatus, { badge: string; text: string }> = {
    Pending: {
      badge: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      text: "text-amber-400",
    },
    Confirmed: {
      badge: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      text: "text-blue-400",
    },
    Completed: {
      badge: "bg-muted text-muted-foreground border-border",
      text: "text-muted-foreground",
    },
    Cancelled: {
      badge: "bg-destructive/10 text-destructive border-destructive/30",
      text: "text-destructive",
    },
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = activeStatus === "All" || o.status === activeStatus;
    const matchesSearch =
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.notes && o.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  function handleCreateOrder(e: React.FormEvent) {
    e.preventDefault();
    addOrder({
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone || undefined,
      date: formData.date,
      time: formData.time,
      guests: Number(formData.guests),
      tableNumber: formData.tableNumber || undefined,
      status: formData.status,
      notes: formData.notes || undefined,
      totalEstimated: Number(formData.totalEstimated) || 120,
    });
    setModalOpen(false);
  }

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  async function handleStatusChange(id: string, newStatus: OrderStatus) {
    try {
      await updateOrderStatus(id, newStatus);
      if (newStatus === "Confirmed") {
        setToastMessage(`Reservation ${id} confirmed! Confirmation email dispatched to customer.`);
      } else if (newStatus === "Completed") {
        setToastMessage(`Reservation ${id} marked completed! Thank-you dining email dispatched to customer.`);
      } else {
        setToastMessage(`Reservation ${id} status updated to ${newStatus}.`);
      }
      setTimeout(() => setToastMessage(null), 5000);
    } catch (err: any) {
      console.error("Failed to update status:", err);
    }
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">— Service Floor</p>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">Manage Orders & Bookings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage table reservations, guest party sizes, seating status, and dining requests.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              customerName: "",
              email: "",
              phone: "",
              date: new Date().toISOString().split("T")[0],
              time: "7:30 PM",
              guests: 2,
              tableNumber: "T-03",
              status: "Confirmed",
              notes: "",
              totalEstimated: 160,
            });
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold text-accent-foreground hover:bg-accent/90 transition shadow-lg shadow-accent/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Manual Reservation</span>
        </button>
      </div>

      {/* Email Status Toast Notification */}
      {toastMessage && (
        <div className="flex items-center gap-2.5 rounded-2xl border border-accent/40 bg-accent/10 px-5 py-3.5 text-xs text-foreground shadow-lg backdrop-blur">
          <Mail className="h-4 w-4 text-accent shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 sm:flex-row sm:items-center sm:justify-between backdrop-blur">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by guest name, email, or ref code..."
            className="h-10 rounded-xl bg-background/80 pl-10 border-input text-xs"
          />
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveStatus("All")}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition cursor-pointer ${
              activeStatus === "All"
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-background/80"
            }`}
          >
            All ({orders.length})
          </button>
          {statuses.map((st) => {
            const count = orders.filter((o) => o.status === st).length;
            return (
              <button
                key={st}
                onClick={() => setActiveStatus(st)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider transition cursor-pointer ${
                  activeStatus === st
                    ? "bg-foreground text-background font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List / Table */}
      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 p-16 text-center">
          <CalendarCheck className="h-12 w-12 text-muted-foreground/40" />
          <h3 className="mt-4 font-display text-2xl">No bookings match this filter</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Try switching the status filter or clearing your search query.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="group relative flex flex-col justify-between gap-6 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur transition-all hover:border-foreground/30 hover:shadow-lg lg:flex-row lg:items-center"
            >
              {/* Left Column: Reference & Guest Profile */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-accent">{ord.id}</span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                      statusColorMap[ord.status].badge
                    }`}
                  >
                    {ord.status}
                  </span>
                  {ord.tableNumber && (
                    <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-[11px] text-muted-foreground font-mono">
                      {ord.tableNumber}
                    </span>
                  )}
                </div>

                <h3 className="font-display text-2xl text-foreground">{ord.customerName}</h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-accent" />
                    {ord.email}
                  </span>
                  {ord.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-accent" />
                      {ord.phone}
                    </span>
                  )}
                </div>

                {ord.notes && (
                  <p className="mt-2 text-xs italic text-muted-foreground/90 max-w-xl">
                    &ldquo;{ord.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Middle Column: Reservation Schedule & Covers */}
              <div className="flex flex-wrap items-center gap-6 border-y border-border/40 py-4 lg:border-y-0 lg:py-0">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Date & Time</p>
                  <p className="text-sm font-medium text-foreground">{ord.date}</p>
                  <p className="text-xs text-accent font-semibold">{ord.time}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Party Size</p>
                  <p className="text-sm font-semibold text-foreground">{ord.guests} Guests</p>
                  <p className="text-xs text-muted-foreground">Main room</p>
                </div>

                {ord.totalEstimated && (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Est. Volume</p>
                    <p className="text-sm font-semibold text-foreground">${ord.totalEstimated}</p>
                    <p className="text-xs text-muted-foreground">Pre-gratuity</p>
                  </div>
                )}
              </div>

              {/* Right Column: Status Actions & Dropdown */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={ord.status}
                  onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                  className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground focus:outline-none focus:border-accent cursor-pointer"
                >
                  {statuses.map((st) => (
                    <option key={st} value={st} className="bg-card text-foreground">
                      {st}
                    </option>
                  ))}
                </select>

                {ord.status === "Pending" && (
                  <button
                    onClick={() => handleStatusChange(ord.id, "Confirmed")}
                    className="rounded-xl bg-accent px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent-foreground hover:bg-accent/90 transition shadow-sm cursor-pointer"
                  >
                    Confirm
                  </button>
                )}

                {ord.status === "Confirmed" && (
                  <button
                    onClick={() => handleStatusChange(ord.id, "Completed")}
                    className="rounded-xl border border-border/80 bg-background px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:border-accent hover:text-accent transition cursor-pointer"
                  >
                    Complete
                  </button>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Delete reservation record for ${ord.customerName}?`)) {
                      deleteOrder(ord.id);
                    }
                  }}
                  title="Remove Reservation"
                  className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground hover:border-destructive hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Manual Reservation */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-accent">Concierge Intake</span>
                <h2 className="mt-1 font-display text-2xl sm:text-3xl">Manual Table Reservation</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guest Full Name</label>
                  <Input
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    placeholder="Eleanor Vance"
                    className="mt-1.5 h-11 rounded-xl bg-background border-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Contact Email</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="eleanor@domain.com"
                    className="mt-1.5 h-11 rounded-xl bg-background border-input text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Date</label>
                  <Input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="mt-1.5 h-11 rounded-xl bg-background border-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Time Slot</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
                  >
                    {["5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"].map(
                      (t) => (
                        <option key={t} value={t} className="bg-card text-foreground">
                          {t}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Guest Count</label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    required
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                    className="mt-1.5 h-11 rounded-xl bg-background border-input text-sm"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Table Assignment</label>
                  <Input
                    value={formData.tableNumber}
                    onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                    placeholder="T-04 Window / Bar"
                    className="mt-1.5 h-11 rounded-xl bg-background border-input text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Initial Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                    className="mt-1.5 flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-accent cursor-pointer"
                  >
                    {statuses.map((st) => (
                      <option key={st} value={st} className="bg-card text-foreground">
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Special Requests / Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Dietary requests, wine preferences, seating accommodations..."
                  className="mt-1.5 flex w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:border-accent"
                />
              </div>

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
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
