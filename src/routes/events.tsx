import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EventCard, type EventRow } from "@/components/event-card";
import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const getEventsFn = createServerFn({ method: "GET" }).handler(async () => {
  const events = await db.event.findMany({
    where: { date: { gte: new Date() } },
    orderBy: { date: 'asc' },
  });
  return JSON.parse(JSON.stringify(events));
});

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Workshops — National Electricity Workshop" },
      { name: "description", content: "Browse upcoming National Electricity Workshop events and reserve your seat." },
      { property: "og:title", content: "Events & Workshops" },
      { property: "og:description", content: "Browse upcoming events and reserve your seat." },
    ],
  }),
  loader: async () => await getEventsFn(),
  pendingComponent: EventsSkeleton,
  component: EventsPage,
});

function EventsSkeleton() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-16 w-3/4 max-w-xl mb-4" />
        <Skeleton className="h-6 w-1/2 max-w-lg mb-12" />
        <Skeleton className="h-32 w-full max-w-3xl mb-4 rounded-2xl" />
      </section>
      <section className="pb-24 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </section>
    </div>
  );
}

function EventsPage() {
  const events = Route.useLoaderData() as EventRow[];
  const isLoading = false;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-widest text-primary font-semibold mb-2"
        >
          Program
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-6xl font-bold mb-4"
        >
          Events & workshops
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-muted-foreground max-w-2xl mb-12"
        >
          Reserve your seat at our upcoming gatherings for the national electricity community.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8 mb-4 max-w-3xl"
        >
          <h4 className="text-sm uppercase tracking-widest font-semibold text-slate-500 mb-6">Strategic Institutional Partners</h4>
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            <div className="flex flex-col items-center justify-center gap-3">
              <img src="/vp-seal.png" alt="Seal of the Vice President of Nigeria" className="w-20 h-20 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg' }} />
              <span className="text-xs font-semibold text-slate-600 text-center max-w-[120px]">Office of the Vice President</span>
            </div>
            <div className="flex flex-col items-center justify-center gap-3">
              <img src="/fmoj-logo.png" alt="Federal Ministry of Justice" className="w-20 h-20 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg' }} />
              <span className="text-xs font-semibold text-slate-600 text-center max-w-[120px]">Federal Ministry of Justice</span>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="pb-24 max-w-7xl mx-auto px-6">
        {events.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No events posted yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <EventCard event={e} index={i} />
              </motion.div>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}