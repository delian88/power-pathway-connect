import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Trash2, Plus, Edit2, X, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const getEventsFn = createServerFn({ method: "GET" }).handler(async () => {
  const events = await db.event.findMany({
    include: { 
      user: { select: { email: true } },
      applications: true
    },
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
    let finalSponsorUrl = data.sponsorImageUrl;

    if (data.imageBase64 && data.imageFileName) {
      const savedPath = await saveImageLocally(data.imageBase64, data.imageFileName);
      if (savedPath) finalImageUrl = savedPath;
    }
    
    if (data.sponsorBase64 && data.sponsorFileName) {
      const savedPath = await saveImageLocally(data.sponsorBase64, data.sponsorFileName);
      if (savedPath) finalSponsorUrl = savedPath;
    }

    const slug = (data.title || "event").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000);

    const event = await db.event.create({
      data: {
        title: data.title,
        slug: slug,
        description: data.description,
        content: data.content,
        date: new Date(data.date),
        type: data.type,
        imageUrl: finalImageUrl,
        sponsorImageUrl: finalSponsorUrl,
      }
    });
    return JSON.parse(JSON.stringify(event));
  });

export const updateEventFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    let finalImageUrl = data.imageUrl;
    let finalSponsorUrl = data.sponsorImageUrl;

    if (data.imageBase64 && data.imageFileName) {
      const savedPath = await saveImageLocally(data.imageBase64, data.imageFileName);
      if (savedPath) finalImageUrl = savedPath;
    }
    
    if (data.sponsorBase64 && data.sponsorFileName) {
      const savedPath = await saveImageLocally(data.sponsorBase64, data.sponsorFileName);
      if (savedPath) finalSponsorUrl = savedPath;
    }

    const event = await db.event.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        date: new Date(data.date),
        type: data.type,
        imageUrl: finalImageUrl,
        sponsorImageUrl: finalSponsorUrl,
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
  const events = Route.useLoaderData() || [];
  const router = useRouter();

  const emptyForm = {
    title: "",
    description: "",
    content: "",
    date: "",
    type: "workshop",
    imageUrl: "",
    sponsorImageUrl: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [sponsorFile, setSponsorFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [viewingApplicantsEvent, setViewingApplicantsEvent] = useState<any | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleSponsorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSponsorFile(e.target.files[0]);
    }
  };

  const handleEdit = (ev: any) => {
    setEditingId(ev.id);
    const dateObj = new Date(ev.date);
    const dateString = new Date(dateObj.getTime() - (dateObj.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    
    setForm({
      title: ev.title,
      description: ev.description,
      content: ev.content || "",
      date: dateString,
      type: ev.type,
      imageUrl: ev.imageUrl || "",
      sponsorImageUrl: ev.sponsorImageUrl || "",
    });
    setFile(null);
    setSponsorFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFile(null);
    setSponsorFile(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageBase64 = null;
      let imageFileName = null;
      let sponsorBase64 = null;
      let sponsorFileName = null;
      
      if (file) {
        imageFileName = file.name;
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
      
      if (sponsorFile) {
        sponsorFileName = sponsorFile.name;
        sponsorBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(sponsorFile);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

      const payload = {
        ...form,
        imageBase64,
        imageFileName,
        sponsorBase64,
        sponsorFileName,
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
            <Label>Short Description</Label>
            <Textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          
          <div>
            <Label>Detailed Content (Objectives, Program, etc.)</Label>
            <Textarea rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write the full event details here..." />
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
          
          <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-2">
            <div className="space-y-3">
              <h3 className="font-medium text-sm">Cover Image</h3>
              <div>
                <Label className="text-xs">File Upload</Label>
                <Input type="file" accept="image/*" onChange={handleFileChange} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Or Image URL</Label>
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." className="text-xs h-8" />
              </div>
              {form.imageUrl && (
                <div className="p-1 bg-gray-50 rounded inline-block border">
                  <img src={form.imageUrl} alt="Cover Preview" className="h-12 object-contain" />
                </div>
              )}
            </div>

            <div className="space-y-3 border-l pl-4">
              <h3 className="font-medium text-sm">Sponsor/Partner Image</h3>
              <div>
                <Label className="text-xs">File Upload</Label>
                <Input type="file" accept="image/*" onChange={handleSponsorFileChange} className="text-xs h-8" />
              </div>
              <div>
                <Label className="text-xs">Or Image URL</Label>
                <Input value={form.sponsorImageUrl} onChange={(e) => setForm({ ...form, sponsorImageUrl: e.target.value })} placeholder="https://..." className="text-xs h-8" />
              </div>
              {form.sponsorImageUrl && (
                <div className="p-1 bg-gray-50 rounded inline-block border">
                  <img src={form.sponsorImageUrl} alt="Sponsor Preview" className="h-12 object-contain" />
                </div>
              )}
            </div>
          </div>
          
          <Button type="submit" disabled={saving} className="w-full bg-[#109cde] hover:bg-[#0d84bf] text-white mt-4">
            {saving ? (editingId ? "Updating..." : "Publishing...") : (editingId ? "Update Event" : "Publish Event")}
          </Button>
        </form>
      </div>

      <div className="space-y-4 pt-14">
        <h2 className="text-xl font-semibold">Posted Events ({Array.isArray(events) ? events.length : 0})</h2>
        <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 pb-2">
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
                <div className="flex items-center gap-1 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => setViewingApplicantsEvent(ev)} className="mr-2 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
                    <Users className="w-4 h-4 mr-2" />
                    {ev.applications?.length || 0} Applicants
                  </Button>
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
                  <div className="w-24 h-20 shrink-0 bg-gray-100 rounded-md overflow-hidden border">
                    <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover" />
                  </div>
                )}
                {ev.sponsorImageUrl && (
                  <div className="w-16 h-12 shrink-0 bg-white rounded-md overflow-hidden border self-end absolute right-8">
                    <img src={ev.sponsorImageUrl} alt="Sponsor" className="w-full h-full object-contain p-1" />
                  </div>
                )}
                <div className="flex-1 flex flex-col">
                  <p className="text-sm text-gray-700 font-medium line-clamp-2">{ev.description}</p>
                  {ev.content && <p className="text-xs text-gray-500 line-clamp-2 mt-1">{ev.content}</p>}
                </div>
              </div>
            </div>
          ))}
          {events.length === 0 && <p className="text-sm text-muted-foreground">No events yet.</p>}
        </div>
      </div>

      <Dialog open={!!viewingApplicantsEvent} onOpenChange={(open) => !open && setViewingApplicantsEvent(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Applicants: {viewingApplicantsEvent?.title}</DialogTitle>
            <DialogDescription>
              {viewingApplicantsEvent?.applications?.length || 0} total registrations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {viewingApplicantsEvent?.applications?.length > 0 ? (
              <div className="border rounded-md divide-y">
                {viewingApplicantsEvent.applications.map((app: any) => (
                  <div key={app.id} className="p-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="font-semibold text-[#263566] text-lg">{app.fullName}</div>
                    <div className="text-sm text-slate-600 mt-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div><span className="font-medium text-slate-500">Email:</span> {app.email}</div>
                      <div><span className="font-medium text-slate-500">Phone:</span> {app.phone}</div>
                      <div className="md:col-span-2"><span className="font-medium text-slate-500">Organization:</span> {app.organization}</div>
                      <div className="md:col-span-2 text-xs text-slate-400 mt-1">Applied: {new Date(app.createdAt).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-md">
                No applicants yet for this event.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

