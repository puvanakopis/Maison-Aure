"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { ArrowRight, Leaf, ChefHat, Sparkles, MapPin, Star } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/site/Reveal";
import { menuCategories, testimonials, locations } from "@/lib/restaurant-data";
import { useAdminStore } from "@/lib/admin-store";

export default function HomePage() {
  // Hero section setup
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroWords = ["Simply", "Delicious:", "A", "Fusion", "of", "Flavors"];

  // MicroMenu section setup
  const { items: liveItems } = useAdminStore();
  const [selectedCategory, setSelectedCategory] = useState<string>(menuCategories[0].id);
  const visibleMenuItems = liveItems.filter((m) => m.category === selectedCategory).slice(0, 4);

  // Features section setup
  const featureItems = [
    { icon: Leaf, title: "Authentic Flavors", body: "Recipes anchored in tradition, expressed with restraint and intention." },
    { icon: ChefHat, title: "Fresh Ingredients", body: "A small circle of farms, fishers, and foragers — sourced weekly." },
    { icon: Sparkles, title: "Quality Service", body: "An attentive team that reads the room and lets the meal lead." },
  ];

  // Testimonials section setup
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const currentTestimonial = testimonials[testimonialIndex];

  // Locations section setup
  const [selectedLocationId, setSelectedLocationId] = useState(locations[0].id);
  const selectedLocation = locations.find((l) => l.id === selectedLocationId) ?? locations[0];

  return (
    <PageShell>
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-2 lg:gap-16">
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs uppercase tracking-[0.3em] text-muted-foreground"
            >
              <span className="mr-3 inline-block h-px w-8 align-middle bg-foreground/40" />
              Est. 2014 · Seasonal Kitchen
            </motion.p>
            <h1 className="mt-6 font-display text-5xl leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl">
              {heroWords.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.08, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="mr-3 inline-block"
                >
                  {w === "Fusion" ? <em className="font-light italic text-accent">{w}</em> : w}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.7 }}
              className="mt-8 max-w-md text-base leading-relaxed text-muted-foreground"
            >
              A quiet, candle-lit room where seasonal ingredients meet considered
              technique. Built around long tables, shared plates, and the kind of
              evenings you remember.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/reservations"
                className="group inline-flex items-center gap-3 rounded-full bg-foreground px-7 py-3.5 text-sm uppercase tracking-[0.18em] text-background transition-transform hover:scale-[1.03]"
              >
                Reserve a Table
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 rounded-full border border-foreground/20 px-7 py-3.5 text-sm uppercase tracking-[0.18em] transition hover:border-foreground"
              >
                Discover More
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-14 flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-accent stroke-none" />
                ))}
              </div>
              <span>2,400+ Guests · 4.9 Rating</span>
            </motion.div>
          </div>

          <div className="relative h-[520px] sm:h-[620px]">
            <motion.div
              style={{ y: y1 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-[340px] w-[68%] overflow-hidden rounded-2xl border border-border/60"
            >
              <img src="/images/hero/hero-dish.jpg" alt="Plated dish" className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              style={{ y: y2 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 1.2 }}
              className="absolute bottom-0 left-0 h-[280px] w-[55%] overflow-hidden rounded-2xl border border-border/60"
            >
              <img src="/images/hero/hero-interior.jpg" alt="Restaurant interior" className="h-full w-full object-cover" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: -4 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="absolute bottom-16 right-4 h-44 w-44 overflow-hidden rounded-full border border-border/60 sm:h-52 sm:w-52"
            >
              <img src="/images/hero/hero-round.jpg" alt="Halibut" className="h-full w-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="relative h-[460px] overflow-hidden rounded-2xl border border-border/60">
            <img
              src="/images/home/philosophy.jpg"
              alt="Chef plating"
              className="h-full w-full object-cover"
            />
          </Reveal>
          <div>
            <Reveal>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">— Our Philosophy</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
                More than just a restaurant — a <em className="italic text-accent">slower</em> way to gather.
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                We work with a small circle of farms, fishers, and foragers. Menus
                shift weekly. Our team trains for years before they touch a plate.
                The room is intentionally small so every guest is seen.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <Link
                href="/about"
                className="group mt-10 inline-flex items-center gap-3 text-sm uppercase tracking-[0.2em]"
              >
                <span className="relative">
                  Read Our Story
                  <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-100 bg-foreground transition-transform" />
                </span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MicroMenu Section */}
      <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Reveal><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">— A Taste</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl">From the kitchen</h2>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link href="/menu" className="group inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em]">
              See full menu <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {menuCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`relative rounded-full px-5 py-2 text-xs uppercase tracking-[0.18em] transition ${
                selectedCategory === c.id ? "text-background" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {selectedCategory === c.id && (
                <motion.span
                  layoutId="cat-pill"
                  className="absolute inset-0 rounded-full bg-foreground"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
              <span className="relative">{c.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {visibleMenuItems.map((item, i) => (
              <motion.article
                key={item.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {item.badge && (
                    <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[10px] uppercase tracking-[0.2em] backdrop-blur">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-xl leading-tight">{item.name}</h3>
                    <span className="shrink-0 text-sm tabular-nums text-accent">${item.price}</span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {item.ingredients.slice(0, 3).map((ing) => (
                      <span key={ing} className="rounded-full border border-border/70 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
        <StaggerGroup className="grid gap-6 md:grid-cols-3">
          {featureItems.map((f) => (
            <StaggerItem key={f.title} className="group rounded-2xl border border-border/60 bg-card p-8 transition hover:border-foreground/60">
              <f.icon className="h-7 w-7 text-accent" strokeWidth={1.4} />
              <h3 className="mt-6 font-display text-2xl">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* Testimonials Section */}
      <section className="mt-32 border-y border-border/60 bg-card/60 backdrop-blur py-24 text-foreground">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal><p className="text-xs uppercase tracking-[0.3em] text-accent">— Guest Reviews</p></Reveal>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              <h2 className="font-display text-4xl leading-tight sm:text-6xl text-foreground">&ldquo;{currentTestimonial.headline}&rdquo;</h2>
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">{currentTestimonial.quote}</p>
              <div className="mt-10 flex items-center gap-4">
                <img src={currentTestimonial.image} alt={currentTestimonial.name} className="h-12 w-12 rounded-full object-cover border border-border/80" />
                <div>
                  <p className="text-sm font-medium text-foreground">{currentTestimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{currentTestimonial.role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex items-center gap-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTestimonialIndex(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${idx === testimonialIndex ? "w-10 bg-accent" : "w-5 bg-border hover:bg-muted-foreground/50"}`}
                aria-label={`Review ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="mx-auto mt-32 max-w-7xl px-5 sm:px-8">
        <Reveal><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">— Find Us</p></Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl">Three rooms. One philosophy.</h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              {locations.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setSelectedLocationId(l.id)}
                  className={`relative rounded-full px-5 py-2 text-xs uppercase tracking-[0.18em] transition ${
                    selectedLocationId === l.id ? "text-background" : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {selectedLocationId === l.id && (
                    <motion.span layoutId="loc-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                  )}
                  <span className="relative">{l.city}</span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLocation.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="mt-8 rounded-2xl border border-border/60 bg-card p-8"
              >
                <h3 className="font-display text-3xl">{selectedLocation.city}</h3>
                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{selectedLocation.address}</p>
                <p className="mt-2 text-sm text-muted-foreground">{selectedLocation.phone}</p>
                <p className="mt-1 text-sm text-muted-foreground">{selectedLocation.hours}</p>
                <a href="#" className="group mt-6 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em]">
                  Get Directions <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedLocation.id}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="relative h-[420px] overflow-hidden rounded-2xl border border-border/60"
            >
              <img src={selectedLocation.image} alt={selectedLocation.city} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </PageShell>
  );
}
