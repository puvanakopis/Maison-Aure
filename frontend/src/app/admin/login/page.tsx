"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAdminStore } from "@/lib/admin-store";
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft, KeyRound, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, router]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const ok = login(email, password);
      if (ok) {
        router.push("/admin");
      } else {
        setError("Invalid email or password. Password must be at least 6 characters.");
        setLoading(false);
      }
    }, 400);
  }

  function autofillDemo() {
    setEmail("admin@maisonaure.com");
    setPassword("admin123");
    setError(null);
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#090807] px-4 py-12 text-foreground selection:bg-accent selection:text-accent-foreground overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-accent/5 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 bottom-10 h-72 w-72 rounded-full bg-accent/3 blur-[100px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Public Dining
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-2xl backdrop-blur-2xl sm:p-10">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-accent/40 bg-accent/10 text-accent shadow-inner">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="mt-6 font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Maison<span className="text-accent">·</span>Auré
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              Executive Restaurant Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {error && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs text-destructive">
                {error}
              </div>
            )}

            <div>
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Executive Email
              </label>
              <div className="relative mt-2">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@maisonaure.com"
                  required
                  className="h-12 rounded-xl bg-background/80 pl-10 border-input focus:border-accent"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Security Passcode
                </label>
              </div>
              <div className="relative mt-2">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-12 rounded-xl bg-background/80 pl-10 border-input focus:border-accent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 text-xs uppercase tracking-[0.2em] font-semibold text-accent-foreground transition hover:bg-accent/90 disabled:opacity-50 cursor-pointer shadow-lg shadow-accent/10"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          {/* Demo Credentials Helper */}
          <div className="mt-8 border-t border-border/40 pt-6 text-center">
            <p className="text-xs text-muted-foreground mb-3">Quick evaluation demo access:</p>
            <button
              type="button"
              onClick={autofillDemo}
              className="inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/5 px-4 py-2 text-xs font-medium text-accent hover:bg-accent/15 transition-colors cursor-pointer"
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Fill Demo Credentials (admin@maisonaure.com)</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          Authorized personnel only. Sessions are encrypted and audited.
        </p>
      </div>
    </div>
  );
}
