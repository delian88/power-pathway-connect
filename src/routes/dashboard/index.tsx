import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, X, CreditCard } from "lucide-react";
import { saveImageLocally } from "@/lib/upload"; // We need to move saveImageLocally to a util or just redefine it.

export const getDashboardDataFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await verifySession();
  if (!session) throw new Error("Unauthorized");

  const events = await db.event.findMany({
    where: { userId: session.userId as string },
    orderBy: { date: 'desc' }
  });

  const settings = await db.siteSettings.findFirst();

  return {
    events: JSON.parse(JSON.stringify(events)),
    eventFee: settings?.eventFee || 0
  };
});

// Duplicating saveImageLocally for simplicity since we can't easily extract it without touching more files
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

export const createUserEventFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const session = await verifySession();
    if (!session) throw new Error("Unauthorized");

    // Check quota
    if (!data.bypassQuota) {
      const count = await db.event.count({ where: { userId: session.userId as string } });
      if (count >= 1) {
        throw new Error("QUOTA_EXCEEDED");
      }
    }

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
        userId: session.userId as string,
      }
    });
    return JSON.parse(JSON.stringify(event));
  });

export const Route = createFileRoute("/dashboard/")({
  loader: async () => await getDashboardDataFn(),
  component: UserDashboard,
});

function UserDashboard() {
  const { events, eventFee } = Route.useLoaderData();
  const router = useRouter();

  const emptyForm = {
    title: "",
    description: "",
    date: "",
    type: "workshop",
    imageUrl: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [isCreating, setIsCreating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent, bypassQuota: boolean = false) => {
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
        bypassQuota
      };

      await createUserEventFn({ data: payload });
      toast.success("Event published successfully!");
      setIsCreating(false);
      setShowPayment(false);
      setForm(emptyForm);
      setFile(null);
      router.invalidate();
    } catch (error: any) {
      if (error.message.includes("QUOTA_EXCEEDED")) {
        setShowPayment(true);
      } else {
        toast.error("Failed to create event");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#263566]">My Events</h1>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)} className="bg-[#109cde] hover:bg-[#0d84bf] text-white">
            <Plus className="w-4 h-4 mr-2" /> Post New Event
          </Button>
        )}
      </div>

      {isCreating && (
        <form onSubmit={(e) => handleSave(e, false)} className="p-6 bg-white border border-border/60 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Plus className="w-5 h-5" /> Post New Event
            </h2>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsCreating(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
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
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background border-border/60 focus:outline-none focus:ring-2 focus:ring-[#109cde]"
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
          </div>

          <Button type="submit" disabled={saving} className="w-full bg-[#109cde] hover:bg-[#0d84bf] text-white">
            {saving ? "Publishing..." : "Publish Event"}
          </Button>
        </form>
      )}

      {/* Mock Payment Dialog */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full shadow-xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-100 text-[#109cde] rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#263566]">Event Quota Reached</h3>
              <p className="text-gray-600 mt-2">
                You have already published your first free event. To publish another one, you need to pay the event posting fee.
              </p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl mb-6 text-center">
              <span className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Total Due</span>
              <div className="text-3xl font-bold text-[#263566]">${eventFee.toFixed(2)}</div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowPayment(false)}>
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-[#109cde] hover:bg-[#0d84bf] text-white" 
                onClick={(e) => handleSave(e, true)}
                disabled={saving}
              >
                {saving ? "Processing..." : `Pay $${eventFee} & Publish`}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {events.map((ev: any) => (
          <div key={ev.id} className="p-4 bg-white border border-border/60 rounded-xl shadow-sm flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-xs rounded-full ${ev.type === 'conference' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {ev.type}
                  </span>
                  {ev.title}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{new Date(ev.date).toLocaleString()}</div>
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
        {events.length === 0 && !isCreating && (
          <div className="text-center py-12 bg-white border border-dashed border-border/60 rounded-2xl">
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events yet</h3>
            <p className="text-gray-500 text-sm">Post your first event for free!</p>
          </div>
        )}
      </div>
    </div>
  );
}
