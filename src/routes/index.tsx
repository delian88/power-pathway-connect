import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Users, Award, Globe } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EventCard, type EventRow } from "@/components/event-card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import hero from "@/assets/hero-electricity.jpg";
import w1 from "@/assets/workshop-1.jpg";
import w2 from "@/assets/workshop-2.jpg";
import w3 from "@/assets/workshop-3.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data: events = [] } = useQuery({
    queryKey: ["events", "home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: true })
        .limit(6);
      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
  });

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <img src={hero} alt="Power grid at sunset" className="w-full h-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              2026 Program Now Open
            </div>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              Powering the<br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">next century</span>
              <br />of electricity.
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mb-8">
              The National Electricity Workshop convenes utility executives, grid engineers, policymakers, and innovators driving the modern energy transition.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/events">
                <Button size="lg" className="bg-gradient-primary shadow-elegant text-base h-12 px-6">
                  Browse events <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-base h-12 px-6">Learn more</Button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <motion.img animate={{ y: [0, -12, 0] }} transition={{ duration: 5, repeat: Infinity }}
                src={w1} alt="Engineers at substation" width={1200} height={800}
                className="rounded-2xl shadow-elegant aspect-[3/4] object-cover" loading="lazy" />
              <motion.img animate={{ y: [0, 12, 0] }} transition={{ duration: 6, repeat: Infinity }}
                src={w3} alt="Renewable energy landscape" width={1200} height={800}
                className="rounded-2xl shadow-elegant aspect-[3/4] object-cover mt-8" loading="lazy" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-secondary/30 border-y border-border/60">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Users, n: "8,500+", l: "Attendees" },
            { icon: Globe, n: "42", l: "Countries" },
            { icon: Award, n: "180+", l: "Speakers" },
            { icon: Zap, n: "25 yrs", l: "Leading the field" },
          ].map((s, i) => (
            <motion.div key={s.l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
              <s.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-4xl font-bold mb-1">{s.n}</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Upcoming</div>
            <h2 className="text-4xl md:text-5xl font-bold max-w-xl">Events & workshops</h2>
          </div>
          <Link to="/events" className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {events.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No events posted yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        )}
      </section>

      {/* About */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.img
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            src={w2} alt="Workshop collaboration" width={1200} height={800}
            className="rounded-2xl shadow-elegant" loading="lazy" />
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Who we are</div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Where the grid meets its future.</h2>
            <p className="text-lg text-muted-foreground mb-6">
              For over two decades, the National Electricity Workshop has been the premier convening ground for the people building the modern power system — from generation and transmission to distribution and demand.
            </p>
            <p className="text-muted-foreground mb-8">
              Our events combine deep technical programming with the strategic and policy conversations that shape our industry. It's where ideas become deployments.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {["Utility executives", "Grid engineers", "Policymakers", "Clean-energy leaders"].map((t) => (
                <div key={t} className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Join the conversation.</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Reserve your seat at the next National Electricity Workshop.
          </p>
          <Link to="/events">
            <Button size="lg" className="bg-gradient-primary shadow-elegant text-base h-12 px-8">
              See upcoming events <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
