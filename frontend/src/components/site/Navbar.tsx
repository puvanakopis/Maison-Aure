"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/about", label: "Our Story" },
  { to: "/menu", label: "Menu" },
  { to: "/reservations", label: "Reservations" },
  { to: "/gallery", label: "Gallery" },
  { to: "/blog", label: "Blog" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color] duration-500",
          scrolled
            ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:h-20 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-medium tracking-tight">
              Maison<span className="text-accent">·</span>Aure
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  href={l.to}
                  className={cn(
                    "group relative text-sm tracking-wide transition-colors",
                    active ? "text-foreground" : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  {l.label}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-px transition-all duration-300",
                      active ? "w-full bg-accent" : "w-0 bg-foreground group-hover:w-full"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/reservations"
              className="hidden rounded-full bg-foreground px-5 py-2.5 text-xs uppercase tracking-[0.18em] text-background transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              Reserve a Table
            </Link>
            <button
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 lg:hidden text-foreground"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-foreground text-background"
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex h-16 items-center justify-between px-5 sm:h-20 sm:px-8"
            >
              <span className="font-display text-2xl">Maison·Aure</span>
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full border border-background/30 text-background"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
            <nav className="flex flex-col gap-2 px-5 pt-10 sm:px-8">
              {links.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.5 }}
                >
                  <Link
                    href={l.to}
                    onClick={() => setOpen(false)}
                    className="block border-b border-background/15 py-5 font-display text-4xl"
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-8"
              >
                <Link
                  href="/reservations"
                  onClick={() => setOpen(false)}
                  className="inline-flex rounded-full bg-background px-6 py-3 text-sm uppercase tracking-[0.2em] text-foreground"
                >
                  Reserve a Table
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
