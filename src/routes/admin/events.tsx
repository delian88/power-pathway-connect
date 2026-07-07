import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";

export const getEventsFn = createServerFn("GET", async () => {
  const events = await db.event.findMany({
    orderBy: { date: 'desc' }
  });
  return events;
});

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  date: z.string(),
  type: z.string(),
  imageUrl: z.string().optional(),
});

export const createEventFn = createServerFn("POST", async (data: z.infer<typeof eventSchema>) => {
  const parsed = eventSchema.parse(data);
  const event = await db.event.create({
    data: {
      ...parsed,
      date: new Date(parsed.date),
    }
  });
  return event;
});

export const deleteEventFn = createServerFn("POST", async (id: string) => {
  await db.event.delete({ where: { id } });
  return { success: true };
});

export const Route = createFileRoute("/admin/events")({
  loader: async () => await getEventsFn(),
  component: EventsAdminPage,
});

function EventsAdminPage() {
  const events = Route.useLoaderData();
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    type: "workshop",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createEventFn(form);
      toast.success("Event created successfully");
      setForm({ title: "", description: "", date: "", type: "workshop", imageUrl: "" });
      router.invalidate();
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEventFn(id);
      toast.success("Event deleted");
      router.invalidate();
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-[#263566]">Manage Events</h1>
        <form onSubmit={handleSave} className="p-6 bg-white border border-border/60 rounded-2xl shadow-sm space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />New Event</h2>
          
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          
          <div>
            <Label>Description</Label>
            <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date & Time</Label>
              <Input type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </div>
            <div>
              <Label>Type</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={form.type} 
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="workshop">Workshop</option>
                <option value="conference">Conference</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label>Image URL (optional)</Label>
            <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
          </div>
          
          <Button type="submit" disabled={saving} className="w-full bg-[#109cde] hover:bg-[#0d84bf] text-white">
            {saving ? "Publishing..." : "Publish Event"}
          </Button>
        </form>
      </div>

      <div className="space-y-4 pt-14">
        <h2 className="text-xl font-semibold">Posted Events ({events.length})</h2>
        <div className="space-y-3">
          {events.map((ev) => (
            <div key={ev.id} className="p-4 bg-white border border-border/60 rounded-xl shadow-sm flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${ev.type === 'conference' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {ev.type}
                  </span>
                  {ev.title}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{new Date(ev.date).toLocaleString()}</div>
                <p className="text-sm mt-2 line-clamp-2">{ev.description}</p>
              </div>
              <Button size="icon" variant="ghost" onClick={() => handleDelete(ev.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
        </div>
      </div>
    </div>
  );
}
