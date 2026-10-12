"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
const galleryImages = [
  { id: 1, src: "/images/gallery/gal-1.jpg", category: "ambiance", alt: "Warm dining room" },
  { id: 2, src: "/images/gallery/gal-2.jpg", category: "food", alt: "Burrata plate" },
  { id: 3, src: "/images/gallery/gal-3.jpg", category: "ambiance", alt: "Bar interior" },
  { id: 4, src: "/images/gallery/gal-4.jpg", category: "food", alt: "Halibut" },
  { id: 5, src: "/images/gallery/gal-5.jpg", category: "events", alt: "Private dining event" },
  { id: 6, src: "/images/gallery/gal-6.jpg", category: "ambiance", alt: "Restaurant entrance" },
  { id: 7, src: "/images/gallery/gal-7.jpg", category: "food", alt: "Plated dish" },
  { id: 8, src: "/images/gallery/gal-8.jpg", category: "events", alt: "Wine tasting" },
  { id: 9, src: "/images/gallery/gal-9.jpg", category: "food", alt: "Dessert" },
  { id: 10, src: "/images/gallery/gal-10.jpg", category: "ambiance", alt: "Candle table" },
  { id: 11, src: "/images/gallery/gal-11.jpg", category: "events", alt: "Chef's table" },
  { id: 12, src: "/images/gallery/gal-12.jpg", category: "food", alt: "Tartare" },
];

const FILTERS = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "ambiance", label: "Ambiance" },
  { id: "events", label: "Events" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const items = filter === "all" ? galleryImages : galleryImages.filter((g) => g.category === filter);

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <Reveal><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">— Gallery</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-7xl">Moments from the room.</h1>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`relative rounded-full px-5 py-2 text-xs uppercase tracking-[0.18em] transition cursor-pointer ${
                filter === f.id ? "text-background" : "text-foreground/70 hover:text-foreground"
              }`}
            >
              {filter === f.id && (
                <motion.span layoutId="gal-pill" className="absolute inset-0 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 400, damping: 35 }} />
              )}
              <span className="relative">{f.label}</span>
            </button>
          ))}
        </div>

        {items.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-border/80 p-12 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">No gallery moments available yet</p>
          </div>
        ) : (
          <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
            <AnimatePresence>
              {items.map((img, i) => (
                <motion.button
                  key={img.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: (i % 6) * 0.04 }}
                  onClick={() => setOpen(img.id)}
                  className="group mb-4 block w-full overflow-hidden rounded-2xl border border-border/60 bg-card cursor-pointer text-left"
                >
                  <img src={img.src} alt={img.alt} className="w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      <AnimatePresence>
        {open !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-foreground/95 p-4 backdrop-blur cursor-pointer"
          >
            <button
              onClick={() => setOpen(null)}
              aria-label="Close image preview"
              className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full border border-background/30 text-background hover:bg-background/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              src={galleryImages.find((g) => g.id === open)?.src.replace("w=1200", "w=2000")}
              alt="Full view preview"
              className="max-h-[88vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl cursor-default"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
