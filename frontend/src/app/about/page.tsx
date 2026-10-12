"use client";

import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";

export default function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 sm:pt-24">
        <Reveal><p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">— Since 2014</p></Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.04] sm:text-7xl">
            A decade of seasonal cooking, <em className="italic text-accent">quietly</em> built.
          </h1>
        </Reveal>
      </section>

      <section className="mx-auto mt-20 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <Reveal className="col-span-12 lg:col-span-7 overflow-hidden rounded-2xl border border-border/60">
            <img src="/images/about/founding.jpg" alt="Chef preparing dish" className="h-full w-full object-cover" />
          </Reveal>
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center">
            <Reveal>
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Founding</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-3 font-display text-4xl leading-tight">From a corner kitchen in Tribeca.</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Chef Aurelien Moreau opened Maison·Aure with eight seats, a wood
                stove, and a handwritten menu. Ten years later, the menu is still
                handwritten — and the room still feels like a home.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-center order-2 lg:order-1">
            <Reveal><p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Philosophy</p></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-3 font-display text-4xl leading-tight">Cook what is honest. Serve what is warm.</h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                We believe a restaurant is a place to slow down. So we keep the
                rooms small, the lighting low, and the menus short. Everything
                we do is in service of that one quiet evening.
              </p>
            </Reveal>
          </div>
          <Reveal className="col-span-12 lg:col-span-7 overflow-hidden rounded-2xl border border-border/60 order-1 lg:order-2">
            <img src="/images/about/service.jpg" alt="Restaurant evening service" className="h-full w-full object-cover" />
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-7xl px-5 sm:px-8">
        <Reveal>
          <h2 className="font-display text-4xl sm:text-5xl">The team</h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: "Aurélien Moreau", role: "Chef & Founder", img: "/images/team/aurelien-moreau.jpg" },
            { name: "Naomi Park", role: "Pastry Chef", img: "/images/team/naomi-park.jpg" },
            { name: "Diego Salazar", role: "Sommelier", img: "/images/team/diego-salazar.jpg" },
          ].map((p, i) => (
            <Reveal key={p.name} delay={i * 0.08}>
              <div className="group overflow-hidden rounded-2xl border border-border/60 bg-card">
                <div className="aspect-[4/5] overflow-hidden">
                  <img src={p.img} alt={p.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  <p className="mt-1 text-sm uppercase tracking-[0.18em] text-muted-foreground">{p.role}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
