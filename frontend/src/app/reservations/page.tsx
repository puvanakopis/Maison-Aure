"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  Calendar as CalIcon,
  Users,
  Clock,
  Search,
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { useReservations } from "@/context/ReservationContext";

const TIMES = ["5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM", "8:30 PM", "9:00 PM"];

export default function ReservationsPage() {
  const { requestOtp, verifyOtp, lookupReservation } = useReservations();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("");
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Reservation Flow: 'form' | 'otp' | 'done'
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [confirmedRef, setConfirmedRef] = useState<string>("");

  // Status Lookup State
  const [lookupQuery, setLookupQuery] = useState("");
  const [lookupResult, setLookupResult] = useState<any[] | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  // Cooldown countdown for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Submit Booking Details & Request Email OTP
  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!date || !time || !name.trim() || !email.trim()) {
      setFormError("Please fill in all required fields (Date, Time, Full Name, Email).");
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    setOtpError(null);

    try {
      const res = await requestOtp({
        customerName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : undefined,
        date: date.toISOString().split("T")[0],
        time: time,
        guests: Number(guests) || 2,
        notes: notes ? notes.trim() : "Online guest booking via public reservation portal",
        totalEstimated: (Number(guests) || 2) * 85,
      });

      if (res?.devOtp) {
        setDevOtp(res.devOtp);
      }
      setResendCooldown(60);
      setStep("otp");
    } catch (err: any) {
      console.error("Failed to request reservation OTP:", err);
      setFormError(err?.message || "Failed to dispatch verification email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Step 2: Verify Entered OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 4) {
      setOtpError("Please enter the 6-digit code received in your email.");
      return;
    }

    setIsVerifying(true);
    setOtpError(null);

    try {
      const confirmed = await verifyOtp({
        email: email.trim().toLowerCase(),
        otp: otpCode.trim(),
      });

      if (confirmed?.id) {
        setConfirmedRef(confirmed.id);
      }
      setStep("done");
    } catch (err: any) {
      console.error("Failed to verify OTP:", err);
      setOtpError(
        err?.response?.data?.message ||
        err?.message ||
        "Invalid or expired verification code. Please check your email or resend code."
      );
    } finally {
      setIsVerifying(false);
    }
  }

  // Resend OTP Code
  async function handleResendCode() {
    if (resendCooldown > 0 || isSubmitting) return;
    setIsSubmitting(true);
    setOtpError(null);
    try {
      const res = await requestOtp({
        customerName: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone ? phone.trim() : undefined,
        date: date ? date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        time: time,
        guests: Number(guests) || 2,
        notes: notes ? notes.trim() : undefined,
        totalEstimated: (Number(guests) || 2) * 85,
      });
      if (res?.devOtp) {
        setDevOtp(res.devOtp);
      }
      setResendCooldown(60);
    } catch (err: any) {
      setOtpError(err?.message || "Failed to resend code.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // Status Lookup Handler
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
                Tables release four weeks in advance. We send an instant email verification code to confirm your party, followed by Maitre D&apos; table confirmation.
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

          {/* Right Column: Multi-Step Verification & Booking Box */}
          <Reveal delay={0.2}>
            <div className="relative rounded-2xl border border-border/60 bg-card p-7 sm:p-9 shadow-xl">
              <AnimatePresence mode="wait">
                {/* STEP 1: INITIAL BOOKING FORM */}
                {step === "form" && (
                  <motion.form
                    key="form"
                    onSubmit={handleRequestOtp}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Date</label>
                        <span className="text-[11px] text-accent tracking-wider uppercase font-medium">Step 1 of 2</span>
                      </div>
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
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email Address</label>
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

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Phone Number</label>
                        <Input
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          type="tel"
                          className="mt-2 h-12 rounded-xl bg-background"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Dietary / Notes</label>
                        <Input
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Allergies, table preference..."
                          className="mt-2 h-12 rounded-xl bg-background"
                        />
                      </div>
                    </div>

                    {formError && (
                      <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="rounded-xl border border-accent/20 bg-accent/5 p-3.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2 font-medium text-accent">
                        <Mail className="h-3.5 w-3.5" />
                        <span>Email Verification Required</span>
                      </div>
                      <p className="mt-1 text-[11px] leading-relaxed">
                        To maintain high reservation fidelity, we will dispatch a 6-digit confirmation code to your email before securing your table with the Maitre D&apos;.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={!time || !name.trim() || !email.trim() || !guests || Number(guests) < 1 || isSubmitting}
                      className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-foreground px-6 py-4 text-sm uppercase tracking-[0.2em] text-background transition-transform hover:scale-[1.01] disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Dispatching code...</span>
                        </>
                      ) : (
                        <span>Verify Email & Hold Table</span>
                      )}
                    </button>
                  </motion.form>
                )}

                {/* STEP 2: OTP VERIFICATION VIEW */}
                {step === "otp" && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    className="space-y-6 py-2"
                  >
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to details</span>
                    </button>

                    <div className="text-center">
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent">
                        <KeyRound className="h-6 w-6" />
                      </div>
                      <h2 className="mt-4 font-display text-2xl sm:text-3xl">Verify Your Email</h2>
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                        We sent a 6-digit verification passcode to{" "}
                        <strong className="text-foreground">{email}</strong>.
                      </p>
                    </div>

                    {devOtp && (
                      <div className="rounded-xl border border-dashed border-accent/40 bg-accent/10 p-3 text-center text-xs text-accent">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">Dev Passcode Hint: </span>
                        <strong className="font-mono text-sm tracking-widest">{devOtp}</strong>
                      </div>
                    )}

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div>
                        <label className="block text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          Enter 6-Digit Code
                        </label>
                        <Input
                          autoFocus
                          type="text"
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                          placeholder="• • • • • •"
                          className="mt-3 h-14 text-center font-mono text-2xl tracking-[0.4em] rounded-xl bg-background border-input font-bold"
                        />
                      </div>

                      {otpError && (
                        <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{otpError}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={otpCode.length < 4 || isVerifying}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-accent-foreground hover:opacity-95 transition cursor-pointer disabled:opacity-50"
                      >
                        {isVerifying ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Verifying Code...</span>
                          </>
                        ) : (
                          <span>Confirm & Submit Request</span>
                        )}
                      </button>

                      <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
                        <span>Didn&apos;t receive code?</span>
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={resendCooldown > 0 || isSubmitting}
                          className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          <RefreshCw className={`h-3 w-3 ${isSubmitting ? "animate-spin" : ""}`} />
                          {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3: RESERVATION CONFIRMED & SUBMITTED TO ADMIN */}
                {step === "done" && (
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
                    <h2 className="mt-6 font-display text-3xl">Table Request Received</h2>
                    {confirmedRef && (
                      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1 text-xs font-mono tracking-wider text-accent">
                        Reservation Ref: {confirmedRef}
                      </div>
                    )}
                    <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
                      Your identity has been verified! An acknowledgment email is sent to <span className="text-foreground font-medium">{email}</span>. Our Maitre D&apos; is reviewing your booking for {date?.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at {time} for {guests} {Number(guests) === 1 ? "guest" : "guests"}.
                    </p>
                    <div className="mt-4 rounded-xl border border-border/80 bg-background/60 p-3 text-xs text-muted-foreground max-w-sm">
                      <span className="text-foreground font-medium">Next Step:</span> You will receive an official confirmation email once our Maitre D&apos; approves your seating table.
                    </div>
                    <button
                      onClick={() => {
                        setStep("form");
                        setTime("");
                        setName("");
                        setEmail("");
                        setPhone("");
                        setNotes("");
                        setGuests("2");
                        setOtpCode("");
                        setConfirmedRef("");
                        setDevOtp(null);
                      }}
                      className="mt-8 rounded-full border border-foreground/20 px-6 py-2.5 text-xs uppercase tracking-[0.2em] hover:border-foreground transition-colors cursor-pointer"
                    >
                      Make another reservation
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
