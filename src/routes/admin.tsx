import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Trash2, Plus } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-hooks";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — National Electricity Workshop" }, { name: "robots", content: "noindex" }] }),
  component: AdminPage,
});

const eventSchema = z.object({
  title: z.string().trim().min(3).max(200),
  description: z.string().trim().min(10).max(2000),
  event_date: z.string().min(1),
  location: z.string().trim().min(2).max(200),
  capacity: z.number().int().min(1).max(100000),
  image_url: z.string().url().max(500).optional().or(z.literal("")),
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const { data: hasAnyAdmin } = useQuery({
    queryKey: ["any-admin"],
    queryFn: async () => {
      const { count } = await supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin");
      return (count ?? 0) > 0;
    },
    enabled: !!user && !isAdmin,
  });

  const claimAdmin = async () => {
    if (!user) return;
    setClaiming(true);
    const { error } = await supabase.from("user_roles").insert({ user_id: user.id, role: "admin" });
    setClaiming(false);
    if (error) return toast.error(error.message);
    toast.success("You're now an admin. Reloading…");
    qc.invalidateQueries();
    setTimeout(() => window.location.reload(), 600);
  };

  if (loading || !user) return null;

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="pt-32 max-w-md mx-auto px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Admin access</h1>
          {hasAnyAdmin === false ? (
            <>
              <p className="text-muted-foreground mb-6">
                No admin exists yet. Claim admin access for this workspace.
              </p>
              <Button onClick={claimAdmin} disabled={claiming} className="bg-gradient-primary shadow-elegant">
                {claiming ? "…" : "Claim admin access"}
              </Button>
            </>
          ) : (
            <p className="text-muted-foreground">Your account doesn't have admin privileges.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="pt-24 max-w-6xl mx-auto px-6 pb-24">
        <h1 className="text-4xl font-bold mb-8">Admin dashboard</h1>
        <Tabs defaultValue="events">
          <TabsList>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>
          <TabsContent value="events" className="mt-6">
            <EventsAdmin />
          </TabsContent>
          <TabsContent value="applications" className="mt-6">
            <ApplicationsAdmin />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EventsAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    title: "", description: "", event_date: "", location: "", capacity: 100, image_url: "",
  });
  const [saving, setSaving] = useState(false);

  const { data: events = [] } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = eventSchema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSaving(true);
    const payload = { ...parsed.data, event_date: new Date(parsed.data.event_date).toISOString() };
    const { error } = await supabase.from("events").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Event published!");
    setForm({ title: "", description: "", event_date: "", location: "", capacity: 100, image_url: "" });
    qc.invalidateQueries({ queryKey: ["admin-events"] });
    qc.invalidateQueries({ queryKey: ["events"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["admin-events"] });
    qc.invalidateQueries({ queryKey: ["events"] });
    toast.success("Deleted");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <form onSubmit={save} className="p-6 bg-card border border-border/60 rounded-2xl space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Plus className="w-5 h-5" />New event</h2>
        <div><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
        <div><Label>Description</Label><Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>Date & time</Label><Input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required /></div>
          <div><Label>Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} required /></div>
        </div>
        <div><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required /></div>
        <div><Label>Image URL (optional)</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://…" /></div>
        <Button type="submit" disabled={saving} className="w-full bg-gradient-primary shadow-elegant">
          {saving ? "Publishing…" : "Publish event"}
        </Button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Posted events ({events.length})</h2>
        {events.map((ev) => (
          <div key={ev.id} className="p-4 bg-card border border-border/60 rounded-xl flex items-start justify-between gap-4">
            <div>
              <div className="font-semibold">{ev.title}</div>
              <div className="text-sm text-muted-foreground">{new Date(ev.event_date).toLocaleString()} · {ev.location}</div>
            </div>
            <Button size="icon" variant="ghost" onClick={() => remove(ev.id)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
        {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
      </div>
    </div>
  );
}

function ApplicationsAdmin() {
  const { data: apps = [] } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("*, events(title)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">Applications ({apps.length})</h2>
      {apps.map((a: any) => (
        <div key={a.id} className="p-4 bg-card border border-border/60 rounded-xl grid md:grid-cols-5 gap-4 text-sm">
          <div>
            <div className="font-semibold">{a.name}</div>
            <div className="text-muted-foreground text-xs">{new Date(a.created_at).toLocaleDateString()}</div>
          </div>
          <div className="truncate">{a.email}</div>
          <div>{a.phone}</div>
          <div>{a.organization}</div>
          <div className="text-muted-foreground">{a.events?.title ?? "—"}</div>
        </div>
      ))}
      {apps.length === 0 && <p className="text-sm text-muted-foreground">No applications yet.</p>}
    </div>
  );
}