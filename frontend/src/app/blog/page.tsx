"use client";

import Link from "next/link";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { ArrowRight } from "lucide-react";

const POSTS = [
  { id: 1, title: "The forager who shaped our menu", excerpt: "On wild mushrooms, sea beans, and the rhythm of a season.", img: "/images/blog/blog-1.jpg", date: "May 12", read: "6 min" },
  { id: 2, title: "Why we still write the menu by hand", excerpt: "A small ritual that keeps a kitchen honest.", img: "/images/blog/blog-2.jpg", date: "April 02", read: "4 min" },
  { id: 3, title: "Notes on natural wine", excerpt: "From Jura to Sicily — what's pouring this month.", img: "/images/blog/blog-3.jpg", date: "March 18", read: "5 min" },
  { id: 4, title: "A short film about service", excerpt: "Behind the pass during a Saturday night.", img: "/images/blog/blog-4.jpg", date: "Feb 24", read: "3 min" },
];

export default function BlogPage() {
  const [feature, ...rest] = POSTS;
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <Reveal><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">— Journal</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 font-display text-5xl leading-[1.05] sm:text-7xl">Notes from the pass.</h1>
        </Reveal>

        <Reveal delay={0.2}>
          <article className="group mt-16 grid items-stretch gap-8 overflow-hidden rounded-2xl border border-border/60 bg-card lg:grid-cols-2">
            <div className="aspect-[4/3] overflow-hidden lg:aspect-auto">
              <img src={feature.img} alt={feature.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="flex flex-col justify-center p-8 lg:p-12">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{feature.date} · {feature.read} read</p>
              <h2 className="mt-4 font-display text-4xl leading-tight">{feature.title}</h2>
              <p className="mt-4 text-muted-foreground">{feature.excerpt}</p>
              <Link href="/blog" className="group/btn mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em]">
                Read article <ArrowRight className="h-4 w-4 transition group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </article>
        </Reveal>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <article className="group overflow-hidden rounded-2xl border border-border/60 bg-card">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">{p.date} · {p.read} read</p>
                  <h3 className="mt-3 font-display text-2xl leading-tight">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
