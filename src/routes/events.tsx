import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EventCard, type EventRow } from "@/components/event-card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Events & Workshops — National Electricity Workshop" },
      { name: "description", content: "Browse upcoming National Electricity Workshop events and reserve your seat." },
      { property: "og:title", content: "Events & Workshops" },
      { property: "og:description", content: "Browse upcoming events and reserve your seat." },
    ],
  }),
  component: EventsPage,
});

function EventsPage() {
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("event_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as EventRow[];
    },
  });

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