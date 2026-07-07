import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, Edit2, X } from "lucide-react";

export const getEventsFn = createServerFn({ method: "GET" }).handler(async () => {
  const events = await db.event.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { date: 'desc' }
  });
  return JSON.parse(JSON.stringify(events));
});

async function saveImageLocally(base64: string, fileName: string) {
  try {
    const fs = await import("fs");
    const path = await import("path");
    
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');
    const publicDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(publicDir, fileName);
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, buffer);
    return `/uploads/${fileName}`;
  } catch (e) {
    console.error("Failed to save image locally", e);
    return null;
  }
}

export const createEventFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    let finalImageUrl = data.imageUrl;

    if (data.imageBase64 && data.imageFileName) {
      const savedPath = await saveImageLocally(data.imageBase64, data.imageFileName);
      if (savedPath) finalImageUrl = savedPath;
    }

    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        type: data.type,
        imageUrl: finalImageUrl,
      }
    });
    return JSON.parse(JSON.stringify(event));
  });

export const updateEventFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    let finalImageUrl = data.imageUrl;

    if (data.imageBase64 && data.imageFileName) {
      const savedPath = await saveImageLocally(data.imageBase64, data.imageFileName);
      if (savedPath) finalImageUrl = savedPath;
    }

    const event = await db.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        type: data.type,
        imageUrl: finalImageUrl,
      }
    });
    return JSON.parse(JSON.stringify(event));
  });

export const deleteEventFn = createServerFn({ method: "POST" })
  .validator((id: unknown) => id as string)
  .handler(async ({ data: id }) => {
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

  const emptyForm = {
    title: "",
    description: "",
    date: "",
    type: "workshop",
    imageUrl: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleEdit = (ev: any) => {
    setEditingId(ev.id);
    const dateObj = new Date(ev.date);
    // Format to YYYY-MM-DDThh:mm
    const dateString = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    
    setForm({
      title: ev.title,
      description: ev.description,
      date: dateString,
      type: ev.type,
      imageUrl: ev.imageUrl || "",
    });
    setFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageBase64 = null;
      let imageFileName = null;
      
      if (file) {
        imageFileName = file.name;
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      const payload = {
        ...form,
        imageBase64,
        imageFileName,
      };

      if (editingId) {
        await updateEventFn({ data: { ...payload, id: editingId } });
        toast.success("Event updated successfully");
      } else {
        await createEventFn({ data: payload });
        toast.success("Event created successfully");
      }
      
      cancelEdit();
      router.invalidate();
    } catch (error) {
      toast.error(editingId ? "Failed to update event" : "Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEventFn({ data: id });
      toast.success("Event deleted");
      if (editingId === id) cancelEdit();
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
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              {editingId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {editingId ? "Edit Event" : "New Event"}
            </h2>
            {editingId && (
              <Button type="button" variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
            )}
          </div>
          
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
            <Label>Cover Image Upload</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-xs text-gray-500 mt-1">Leave empty to keep existing image</p>
          </div>

          <div>
            <Label>Image URL (Optional fallback)</Label>
            <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
            {form.imageUrl && (
              <div className="mt-2 p-2 bg-gray-50 rounded inline-block">
                <img src={form.imageUrl} alt="Preview" className="h-16 object-contain" />
              </div>
            )}
          </div>
          
          <Button type="submit" disabled={saving} className="w-full bg-[#109cde] hover:bg-[#0d84bf] text-white">
            {saving ? (editingId ? "Updating..." : "Publishing...") : (editingId ? "Update Event" : "Publish Event")}
          </Button>
        </form>
      </div>

      <div className="space-y-4 pt-14">
        <h2 className="text-xl font-semibold">Posted Events ({Array.isArray(events) ? events.length : 0})</h2>
        <div className="space-y-3">
          {Array.isArray(events) && events.map((ev: any) => (
            <div key={ev.id} className={`p-4 bg-white border rounded-xl shadow-sm flex flex-col gap-3 transition-colors ${editingId === ev.id ? 'border-[#109cde] bg-blue-50/30' : 'border-border/60'}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${ev.type === 'conference' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {ev.type}
                    </span>
                    {ev.title}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {new Date(ev.date).toLocaleString()} • {ev.user ? `Posted by: ${ev.user.email}` : "Admin"}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleEdit(ev)} className="text-gray-500 hover:text-[#109cde] hover:bg-blue-50">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(ev.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4">
                {ev.imageUrl && (
                  <div className="w-24 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-sm line-clamp-3 flex-1">{ev.description}</p>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
        </div>
      </div>
    </div>
  );
}

