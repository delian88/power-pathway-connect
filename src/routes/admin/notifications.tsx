import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Bell, Send, CheckCircle2 } from "lucide-react";

export const getNotificationsFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const notifications = await db.$queryRaw`SELECT * FROM Notification ORDER BY sentAt DESC LIMIT 20`;
    return JSON.parse(JSON.stringify(notifications));
  } catch (e) {
    console.error("Failed to fetch notifications via queryRaw", e);
    return [];
  }
});

export const sendNotificationFn = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    // 1. Save to DB
    const id = crypto.randomUUID();
    await db.$executeRaw`INSERT INTO Notification (id, subject, message, sentAt) VALUES (${id}, ${data.subject}, ${data.message}, NOW())`;
    const notif = { id, subject: data.subject, message: data.message };

    // 2. Fetch all applicant emails
    const applicants = await db.application.findMany({ select: { email: true } });
    const emails = [...new Set(applicants.map(a => a.email))];

    // 3. Send email to all if enabled
    let emailsSent = 0;
    if (emails.length > 0) {
      const emailSuccess = await sendEmail(
        emails,
        data.subject,
        `<div style="font-family: sans-serif; max-w-[600px]; margin: 0 auto;">
          <h2 style="color: #00A86B;">${data.subject}</h2>
          <div style="white-space: pre-wrap;">${data.message}</div>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">This is an important notification regarding your event registration.</p>
        </div>`
      );
      if (emailSuccess) {
        emailsSent = emails.length;
      }
    }

    return { success: true, notif, emailsSent };
  });

export const Route = createFileRoute("/admin/notifications")({
  loader: async () => await getNotificationsFn(),
  component: NotificationsPage,
});

function NotificationsPage() {
  const history = Route.useLoaderData() || [];
  const router = useRouter();
  
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and message are required.");
      return;
    }
    
    setSending(true);
    try {
      const res = await sendNotificationFn({ data: { subject, message } });
      if (res.success) {
        toast.success(`Notification sent successfully! (Dispatched to ${res.emailsSent} emails)`);
        setSubject("");
        setMessage("");
        router.invalidate();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to send notification.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0F1A1C] mb-2 flex items-center gap-3">
          <Bell className="w-8 h-8 text-[#00A86B]" />
          Notifications & Broadcasting
        </h1>
        <p className="text-gray-500">
          Send important announcements to all registered event applicants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Composer */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-[#0F1A1C] mb-6 border-b border-gray-100 pb-4">
            Compose Message
          </h2>
          <form onSubmit={handleSend} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Subject Line</Label>
              <Input 
                placeholder="e.g. Venue Change for Tomorrow's Workshop"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-bold text-gray-700">Message Content</Label>
              <Textarea 
                placeholder="Type your important announcement here..."
                rows={10}
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                className="resize-none"
              />
              <p className="text-xs text-gray-500">
                This message will be recorded in the system and emailed to all applicants if SMTP is enabled in settings.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={sending}
              className="w-full bg-[#00A86B] hover:bg-[#008753] text-white font-bold h-12 flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              {sending ? "Sending..." : "Dispatch Notification"}
            </Button>
          </form>
        </div>

        {/* History */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#0F1A1C] mb-6 border-b border-gray-100 pb-4">
            Broadcast History
          </h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No notifications sent yet.
              </div>
            ) : (
              history.map((notif: any) => (
                <div key={notif.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#0F1A1C]">{notif.subject}</h3>
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sent
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {notif.message}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(notif.sentAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
