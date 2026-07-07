import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Calendar, Share2, Facebook, Twitter, Linkedin, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const getEventFn = createServerFn({ method: "GET" })
  .validator((id: unknown) => id as string)
  .handler(async ({ data: id }) => {
    const event = await db.event.findUnique({ where: { id } });
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
  });

export const Route = createFileRoute("/events/$eventId")({
  loader: async ({ params }) => {
    const event = await getEventFn({ data: params.eventId });
    return { event };
  },
  meta: ({ loaderData }) => {
    if (!loaderData?.event) return [{ title: "Event Not Found" }];
    const event = loaderData.event;
    return [
      { title: `${event.title} - National Electricity Workshop` },
      { name: "description", content: event.description.substring(0, 160) },
      { property: "og:title", content: event.title },
      { property: "og:description", content: event.description.substring(0, 160) },
      { property: "og:image", content: event.imageUrl || "https://conferencedirect.com/wp-content/uploads/2026/01/ConferenceDirect-2026-bg-hero-v4.jpg" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: event.title },
      { name: "twitter:description", content: event.description.substring(0, 160) },
      { name: "twitter:image", content: event.imageUrl || "https://conferencedirect.com/wp-content/uploads/2026/01/ConferenceDirect-2026-bg-hero-v4.jpg" }
    ];
  },
  component: EventPage,
});

function EventPage() {
  const { event } = Route.useLoaderData();

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SiteHeader />
        <main className="flex-1 pt-32 pb-16 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#263566] mb-4">Event Not Found</h1>
            <p className="text-muted-foreground mb-8">The event you are looking for does not exist or has been removed.</p>
            <a href="/" className="px-6 py-3 bg-[#109cde] text-white rounded-md font-medium hover:bg-[#0d84bf]">Back to Home</a>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Generate a shareable URL
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(`Check out ${event.title}!`);
  const shareUrlEncoded = encodeURIComponent(shareUrl);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-24 bg-[#263566] overflow-hidden">
        {event.imageUrl && (
          <div className="absolute inset-0 z-0 opacity-20">
            <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <span className="inline-block px-3 py-1 mb-6 text-sm font-semibold rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30">
            {event.type === 'workshop' ? 'Workshop' : 'Conference'}
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {event.title}
          </h1>
          <div className="flex items-center gap-2 text-white/80 text-lg">
            <Calendar className="w-5 h-5 text-[#109cde]" />
            <span>{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="mx-2">•</span>
            <span>{new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-border/60">
            <h2 className="text-2xl font-bold text-[#263566] mb-6">About this event</h2>
            <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
              {event.description}
            </div>
          </div>
          
          {event.imageUrl && (
            <div className="rounded-2xl overflow-hidden shadow-md border border-border/60">
              <img src={event.imageUrl} alt={event.title} className="w-full object-cover max-h-[500px]" />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/60 sticky top-32">
            <h3 className="text-lg font-semibold text-[#263566] mb-4">Share this event</h3>
            
            <div className="flex flex-col gap-3">
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrlEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors text-gray-700"
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
                <span className="font-medium">Share on Twitter</span>
              </a>
              
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors text-gray-700"
              >
                <Facebook className="w-5 h-5 text-[#4267B2]" />
                <span className="font-medium">Share on Facebook</span>
              </a>
              
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors text-gray-700"
              >
                <Linkedin className="w-5 h-5 text-[#0077b5]" />
                <span className="font-medium">Share on LinkedIn</span>
              </a>
              
              <button 
                onClick={copyLink}
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-gray-50 transition-colors text-gray-700 text-left cursor-pointer"
              >
                <Copy className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
