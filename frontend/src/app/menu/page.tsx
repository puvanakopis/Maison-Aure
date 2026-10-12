"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { useItems } from "@/context/ItemContext";
import { UtensilsCrossed, Sparkles } from "lucide-react";
import Link from "next/link";

export default function MenuPage() {
  const { items: menuItems, categories, isLoading, error } = useItems();

  // Compute available categories strictly from backend data
  const availableCategories = categories.length > 0
    ? categories
    : Array.from(new Set(menuItems.map((m) => m.category))).map((cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      }));

  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (availableCategories.length > 0 && !active) {
      setActive(availableCategories[0].id);
    }
  }, [availableCategories, active]);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">— The Menu</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-7xl">
            A weekly written letter from our kitchen.
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-xl text-muted-foreground">
            Dishes change with the seasons and what arrives at the back door. Below is this week&apos;s offering.
          </p>
        </Reveal>
      </section>

      {/* Loading State */}
      {isLoading ? (
        <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
            <div className="hidden space-y-4 lg:block">
              <div className="h-4 w-20 animate-pulse rounded bg-card/60" />
              <div className="h-4 w-32 animate-pulse rounded bg-card/40" />
              <div className="h-4 w-28 animate-pulse rounded bg-card/40" />
              <div className="h-4 w-36 animate-pulse rounded bg-card/40" />
            </div>
            <div className="space-y-16">
              {[1, 2].map((n) => (
                <div key={n} className="space-y-6">
                  <div className="h-10 w-48 animate-pulse rounded-lg bg-card/60" />
                  <div className="grid gap-8 sm:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex gap-5">
                        <div className="aspect-square h-32 w-32 shrink-0 animate-pulse rounded-xl bg-card/60" />
                        <div className="flex-1 space-y-3 pt-2">
                          <div className="h-5 w-3/4 animate-pulse rounded bg-card/60" />
                          <div className="h-4 w-1/3 animate-pulse rounded bg-card/40" />
                          <div className="h-3 w-full animate-pulse rounded bg-card/30" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : menuItems.length === 0 ? (
        /* Empty State */
        <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-border/60 bg-card/40 px-6 py-20 text-center backdrop-blur">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
              <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h2 className="mt-6 font-display text-3xl sm:text-4xl">Seasonal Menu in Preparation</h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground leading-relaxed">
              Our executive culinary team is currently finalising the week&apos;s seasonal pairings and market ingredients.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/reservations"
                className="rounded-full bg-accent px-6 py-3 text-xs uppercase tracking-[0.2em] font-semibold text-accent-foreground hover:bg-accent/90 transition shadow-lg shadow-accent/10"
              >
                Reserve a Table
              </Link>
              <Link
                href="/"
                className="rounded-full border border-border px-6 py-3 text-xs uppercase tracking-[0.2em] text-foreground hover:border-accent hover:text-accent transition"
              >
                Return Home
              </Link>
            </div>
          </div>
        </section>
      ) : (
        /* Live Content strictly from backend */
        <section className="mx-auto mt-20 grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
          <aside className="sticky top-28 hidden h-fit lg:block">
            <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">Sections</p>
            <ul className="space-y-3">
              {availableCategories.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    onClick={() => setActive(c.id)}
                    className={`block text-sm transition ${
                      active === c.id ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="mr-3 inline-block h-px w-6 align-middle bg-current opacity-50" />
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-24">
            {availableCategories.map((c) => {
              const items = menuItems.filter((m) => m.category === c.id);
              if (!items.length) return null;
              return (
                <section key={c.id} id={c.id} className="scroll-mt-28">
                  <Reveal>
                    <div className="flex items-end justify-between border-b border-border pb-6">
                      <h2 className="font-display text-4xl sm:text-5xl">{c.label}</h2>
                      <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{items.length} items</span>
                    </div>
                  </Reveal>
                  <ul className="mt-8 grid gap-8 sm:grid-cols-2">
                    {items.map((m, i) => (
                      <motion.li
                        key={m.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                        className="group grid grid-cols-[120px_minmax(0,1fr)] items-start gap-5 sm:grid-cols-[140px_minmax(0,1fr)]"
                      >
                        <div className="relative aspect-square overflow-hidden rounded-xl border border-border/60 bg-card">
                          <img src={m.image} alt={m.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                          {m.badge && (
                            <span className="absolute left-1.5 top-1.5 rounded-full bg-background/90 px-2 py-0.5 text-[9px] uppercase tracking-wider backdrop-blur">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="font-display text-xl leading-tight">{m.name}</h3>
                            <span className="shrink-0 text-sm tabular-nums text-accent">${m.price}</span>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                          {m.ingredients && m.ingredients.length > 0 && (
                            <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">
                              {m.ingredients.join(" · ")}
                            </p>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        </section>
      )}
    </PageShell>
  );
}
