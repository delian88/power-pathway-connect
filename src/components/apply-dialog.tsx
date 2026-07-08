import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(30),
  organization: z.string().trim().min(1).max(150),
});

// Server function to create an application
const createApplicationFn = createServerFn({ method: "POST" })
  .validator((data: { eventId: string; name: string; email: string; phone: string; organization: string }) => data)
  .handler(async ({ data }) => {
    const application = await db.application.create({
      data: {
        eventId: data.eventId,
        fullName: data.name,
        email: data.email,
        phone: data.phone,
        organization: data.organization,
      }
    });
    return JSON.parse(JSON.stringify(application));
  });

export function ApplyDialog({
  eventId,
  eventTitle,
  open,
  onOpenChange,
}: {
  eventId: string;
  eventTitle: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", organization: "" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      await createApplicationFn({ data: { eventId, ...parsed.data } });
      toast.success("Seat secured! We'll be in touch.");
      setForm({ name: "", email: "", phone: "", organization: "" });
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Secure your seat</DialogTitle>
          <DialogDescription>{eventTitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label>Full name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          </div>
          <div>
            <Label>Organization</Label>
            <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-primary shadow-elegant">
            {loading ? "Submitting…" : "Reserve my seat"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}