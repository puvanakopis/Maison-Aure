"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Calendar as CalIcon, Users, Clock, Search, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useReservations } from "@/context/ReservationContext";

const TIMES = ["5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];

export default function ReservationsPage() {
  const { createReservation, lookupReservation } = useReservations();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRef, setConfirmedRef] = useState<string>("");
  const [done, setDone] = useState(false);

  // Status Lookup State
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<any[] | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (date && time && name && email) {
      setIsSubmitting(true);
      try {
        const created = await createReservation({
          customerName: name,
          email: email,
          phone: phone || undefined,
          date: date.toISOString().split("T")[0],
          time: time,
          guests: Number(guests) || 2,
          status: "Pending",
          notes: notes || "Online guest booking via public reservation portal",
          totalEstimated: (Number(guests) || 2) * 85,
        });

        if (created?.id) {
          setConfirmedRef(created.id);
        }
      } catch (err) {
        console.error("Reservation submission error:", err);
      } finally {
        setIsSubmitting(false);
        setDone(true);
      }
    }
  }

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    if (!lookupQuery.trim()) return;

    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);

    try {
      const results = await lookupReservation(lookupQuery.trim());
      if (Array.isArray(results) && results.length > 0) {
        setLookupResult(results);
      } else {
        setLookupError("No reservation found with this reference code or email.");
      }
    } catch {
      setLookupError("Failed to connect to reservation database.");
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Left Column: Story + Atmosphere & Lookup */}
          <div>
            <Reveal><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">— Reservations</p></Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl">Reserve your evening.</h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-md text-muted-foreground leading-relaxed">
                Tables release four weeks in advance. We&apos;ll confirm by email
                within minutes. For parties of seven or more, please contact us
                directly.
              </p>
            </Reveal>

            {/* Atmosphere Image */}
            <Reveal delay={0.3}>
              <div className="mt-10 hidden overflow-hidden rounded-2xl border border-border/60 lg:block">
                <img src="/images/reservations/atmosphere.jpg" alt="Dining room atmosphere" className="h-64 w-full object-cover" />
              </div>
            </Reveal>

            {/* Check Reservation Status Box */}
            <Reveal delay={0.35}>
              <div className="mt-8 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-md">
                <div className="flex items-center gap-2.5 text-xs uppercase tracking-[0.2em] text-accent">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Existing Reservation?</span>
                </div>
                <h3 className="mt-2 font-display text-lg text-foreground">Track Table Request Status</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Check if your reservation has been confirmed by our Maitre D&apos;.
                </p>

                <form onSubmit={handleLookup} className="mt-4 flex gap-2">
                  <Input
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="Enter Code (e.g. ORD-1001) or Email"
                    className="h-10 text-xs bg-background"
                  />
                  <button
                    type="submit"
                    disabled={lookupLoading || !lookupQuery.trim()}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-4 py-2 text-xs font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-50 cursor-pointer"
                  >
                    <Search className="h-3.5 w-3.5" />
                    {lookupLoading ? "Searching..." : "Track"}
                  </button>
                </form>

                {lookupError && (
                  <p className="mt-3 text-xs text-destructive">{lookupError}</p>
                )}

                {lookupResult && lookupResult.length > 0 && (
                  <div className="mt-4 space-y-2.5">
                    {lookupResult.map((resItem) => (
                      <div
                        key={resItem.id}
                        className="rounded-xl border border-border bg-background/80 p-3.5 text-xs text-foreground"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-medium text-accent">{resItem.id}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                              resItem.status === "Confirmed"
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/30"
                                : resItem.status === "Pending"
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                                : resItem.status === "Completed"
                                ? "bg-muted text-muted-foreground"
                                : "bg-destructive/10 text-destructive border border-destructive/30"
                            }`}
                          >
                            {resItem.status}
                          </span>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          {resItem.date} at {resItem.time} · {resItem.guests} guests
                          {resItem.tableNumber ? ` · Table ${resItem.tableNumber}` : ""}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          {/* Right Column: Booking Form */}
          <Reveal delay={0.2}>
            <div className="relative rounded-2xl border border-border/60 bg-card p-7 sm:p-9 shadow-xl">
              <AnimatePresence mode="wait">
                {done ? (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center py-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                      className="grid h-20 w-20 place-items-center rounded-full bg-accent text-accent-foreground"
                    >
                      <Check className="h-9 w-9" />
                    </motion.div>
                    <h2 className="mt-6 font-display text-3xl">Table held</h2>
                    {confirmedRef && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-mono tracking-wider text-accent">
                        Reservation Ref: {confirmedRef}
                      </div>
                    )}
                    <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
                      A confirmation is on its way to <span className="text-foreground font-medium">{email}</span>. We look forward to hosting you on {date?.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at {time} for {guests} {Number(guests) === 1 ? "guest" : "guests"}.
                    </p>
                    <button
                      onClick={() => {
                        setDone(false);
                        setTime("");
                        setName("");
                        setEmail("");
                        setPhone("");
                        setNotes("");
                        setGuests("2");
                        setConfirmedRef("");
                      }}
                      className="mt-8 rounded-full border border-foreground/20 px-6 py-2.5 text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors cursor-pointer"
                    >
                      Make another reservation
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={submit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Date</label>
                      <Popover>
                        <PopoverTrigger className="mt-2 flex w-full items-center justify-between rounded-xl border border-input bg-background px-4 py-3 text-left text-sm cursor-pointer hover:border-foreground/50 hover:bg-card/40 focus:border-accent transition-all">
                          <span suppressHydrationWarning className="inline-flex items-center gap-2">
                            <CalIcon className="h-4 w-4 text-accent" />
                            {date?.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }) ?? "Select a date"}
                          </span>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border border-border/80 bg-popover shadow-2xl" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <Clock className="mr-1 inline h-3 w-3" /> Time
                      </label>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {TIMES.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTime(t)}
                            className={`relative rounded-lg border px-2 py-2 text-xs transition cursor-pointer ${
                              time === t
                                ? "border-foreground bg-foreground text-background font-medium"
                                : "border-border hover:border-foreground/50"
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="guests-count" className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <Users className="mr-1 inline h-3 w-3" /> Guests
                      </label>
                      <Input
                        id="guests-count"
                        type="number"
                        min={1}
                        max={20}
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                        placeholder="e.g. 2"
                        required
                        className="mt-2 h-12 rounded-xl bg-background border-input"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Full name</label>
                        <Input
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          required
                          className="mt-2 h-12 rounded-xl bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</label>
                        <Input
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@domain.com"
                          required
                          type="email"
                          className="mt-2 h-12 rounded-xl bg-background"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Special notes / Dietary requests</label>
                      <Input
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. Window table preference, anniversary, allergies"
                        className="mt-2 h-12 rounded-xl bg-background"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!time || !name || !email || !guests || Number(guests) < 1 || isSubmitting}
                      className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm uppercase tracking-[0.2em] text-background transition-transform hover:scale-[1.01] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Holding table..." : "Confirm Reservation"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
