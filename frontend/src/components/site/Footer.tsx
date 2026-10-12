import Link from "next/link";
import { Instagram, Facebook, Send } from "lucide-react";
import { instagramTiles } from "@/lib/restaurant-data";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-card/40 text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-3xl">
              Maison<span className="text-accent">·</span>Auré
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              A seasonal kitchen rooted in craft, hospitality, and the quiet
              luxury of a perfectly set table.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-6 flex items-center gap-2 border-b border-border/60 pb-2 focus-within:border-accent transition-colors">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="grid h-8 w-8 place-items-center rounded-full bg-card border border-border/60 text-foreground transition hover:bg-accent hover:text-accent-foreground hover:border-accent cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Navigate</p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                ["/", "Home"],
                ["/about", "Our Story"],
                ["/menu", "Menu"],
                ["/reservations", "Reservations"],
                ["/gallery", "Gallery"],
                ["/blog", "Journal"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-muted-foreground transition hover:text-foreground">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-accent">Visit</p>
            <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
              <li>182 Hudson Street</li>
              <li>Tribeca, New York 10013</li>
              <li>+1 (212) 555-0142</li>
              <li>hello@maisonaure.com</li>
              <li className="pt-2 text-foreground/60">Tue–Sun · 5:30pm – 11:00pm</li>
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.25em] text-accent">Follow</p>
              <div className="flex gap-2">
                <a
                  href="#"
                  aria-label="Instagram"
                  className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-foreground transition hover:border-accent hover:text-accent hover:bg-card"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="grid h-8 w-8 place-items-center rounded-full border border-border/60 text-foreground transition hover:border-accent hover:text-accent hover:bg-card"
                >
                  <Facebook className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-1.5">
              {instagramTiles.map((src, i) => (
                <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-border/50">
                  <img
                    src={src}
                    alt="Culinary highlight"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-background/0 transition group-hover:bg-background/40" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Maison·Auré. Crafted with care.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Press</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
