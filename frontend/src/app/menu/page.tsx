"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { menuCategories, menuItems } from "@/lib/restaurant-data";

export default function MenuPage() {
  const [active, setActive] = useState<string>(menuCategories[0].id);

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

      <section className="mx-auto mt-20 grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[220px_1fr]">
        <aside className="sticky top-28 hidden h-fit lg:block">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">Sections</p>
          <ul className="space-y-3">
            {menuCategories.map((c) => (
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
          {menuCategories.map((c) => {
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
                        <p className="mt-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/80">{m.ingredients.join(" · ")}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
