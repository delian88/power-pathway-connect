import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EventCard, type EventRow } from "@/components/event-card";
import { db } from "@/lib/db";
import { createServerFn } from "@tanstack/react-start";

const getEventsFn = createServerFn({ method: "GET" }).handler(async () => {
  const count = await db.event.count();
  if (count === 0) {
    await db.event.create({
      data: {
        title: '2-Day National Workshop on the Electricity Act 2023 (As Amended)',
        description: 'Empowering the States: Reviewing the Electricity Act 2023',
        content: 'Deep dive into the decentralisation and autonomy provisions of the Electricity Act 2023, with a strong focus on helping each State understand that they now have full autonomy on electricity matters within their jurisdiction by virtue of the law.\n\nEducate, enlighten, and teach participants on the practical implications of the Act for electricity generation, transmission, distribution, and regulation at the state level.\n\nProvide clear guidance on how States can establish and implement their own electricity markets, regulatory frameworks, and infrastructure development strategies using the full autonomy granted by the Electricity Act 2023 (as amended).\n\nFacilitate knowledge exchange on the provisions of the Act, regulatory alignment, and the practical steps required for States to fully exercise their autonomy on electricity matters.',
        date: new Date('2026-08-15T09:00:00Z'),
        type: 'workshop',
        imageUrl: 'https://images.unsplash.com/photo-1509391366360-1200004e0e58?q=80&w=2000&auto=format&fit=crop'
      }
    });
  }

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
  component: EventsPage,
});

function EventsPage() {
  const events = Route.useLoaderData() as EventRow[];
  const isLoading = false;

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Program</div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">Events & workshops</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Reserve your seat at our upcoming gatherings for the national electricity community.
        </p>
      </section>
      <section className="pb-24 max-w-7xl mx-auto px-6">
        {isLoading ? (
          <div className="text-center text-muted-foreground py-16">Loading…</div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl">
            <p className="text-muted-foreground">No events posted yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
          </div>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}