"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Calendar as CalIcon, Users, Clock } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const TIMES = ["5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];

export default function ReservationsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
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
            <Reveal delay={0.3}>
              <div className="mt-12 hidden overflow-hidden rounded-2xl border border-border/60 lg:block">
                <img src="/images/reservations/atmosphere.jpg" alt="Dining room atmosphere" className="h-72 w-full object-cover" />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <div className="relative rounded-2xl border border-border/60 bg-card p-7 sm:p-9">
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
                    <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                      A confirmation is on its way to <span className="text-foreground font-medium">{email}</span>. We look forward to hosting you on {date?.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at {time} for {guests} {Number(guests) === 1 ? "guest" : "guests"}.
                    </p>
                    <button
                      onClick={() => {
                        setDone(false);
                        setTime("");
                        setName("");
                        setEmail("");
                        setGuests("2");
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

                    <button
                      type="submit"
                      disabled={!time || !name || !email || !guests || Number(guests) < 1}
                      className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm uppercase tracking-[0.2em] text-background transition-transform hover:scale-[1.01] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Confirm Reservation
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
