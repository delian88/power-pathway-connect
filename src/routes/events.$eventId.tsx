import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Calendar, Share2, Facebook, Twitter, Linkedin, Copy, Award } from "lucide-react";
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
  head: ({ loaderData }) => {
    if (!loaderData?.event) return { meta: [{ title: "Event Not Found" }] };
    const event = loaderData.event;
    return {
      meta: [
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
      ]
    };
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
    <div className="min-h-screen flex flex-col bg-[#f8f9fa]">
      <SiteHeader />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-slate-900">
        {event.imageUrl && (
          <>
            <div className="absolute inset-0 z-0">
              <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-slate-900/95 via-slate-900/80 to-transparent" />
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
          </>
        )}
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-bold uppercase tracking-wider rounded-full bg-[#109cde]/20 text-[#109cde] border border-[#109cde]/30 backdrop-blur-sm">
              {event.type === 'workshop' ? 'National Workshop' : 'Conference'}
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
              {event.title}
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed font-light">
              {event.description}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-white">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3 rounded-lg border border-white/10">
                <Calendar className="w-6 h-6 text-[#109cde]" />
                <div className="flex flex-col">
                  <span className="text-sm text-slate-300 uppercase tracking-wider font-semibold">Date & Time</span>
                  <span className="font-medium">
                    {new Date(event.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 -mt-10 relative z-20">
        <div className="lg:col-span-8 space-y-8">
          
          {/* Cover Image in content (Optional, if they want to see the full color version) */}
          {event.imageUrl && (
            <div className="rounded-2xl overflow-hidden shadow-xl border border-white bg-white">
              <img src={event.imageUrl} alt={event.title} className="w-full object-cover max-h-[500px]" />
            </div>
          )}

          <div className="bg-white p-10 rounded-2xl shadow-sm border border-slate-200">
            {event.content ? (
              <>
                <h2 className="text-2xl font-bold text-[#263566] mb-6 flex items-center gap-3">
                  <Award className="w-6 h-6 text-[#109cde]" />
                  Workshop Concept and Objectives
                </h2>
                <div className="prose prose-blue prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {event.content}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-[#263566] mb-6">About this event</h2>
                <div className="prose prose-blue prose-lg max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Sponsors Card */}
          {event.sponsorImageUrl && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-6 text-center">In Partnership With</h3>
              <div className="flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <img src={event.sponsorImageUrl} alt="Sponsor Logo" className="max-h-24 w-auto object-contain mix-blend-multiply" />
              </div>
            </div>
          )}

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 sticky top-32">
            <h3 className="text-lg font-bold text-[#263566] mb-6">Share this event</h3>
            
            <div className="flex flex-col gap-3">
              <a 
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrlEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 p-3.5 rounded-xl border-2 border-slate-100 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/5 transition-all text-slate-700 hover:text-[#1DA1F2] font-semibold group"
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2] group-hover:scale-110 transition-transform" />
                <span>Share on Twitter</span>
              </a>
              
              <a 
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrlEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 p-3.5 rounded-xl border-2 border-slate-100 hover:border-[#4267B2] hover:bg-[#4267B2]/5 transition-all text-slate-700 hover:text-[#4267B2] font-semibold group"
              >
                <Facebook className="w-5 h-5 text-[#4267B2] group-hover:scale-110 transition-transform" />
                <span>Share on Facebook</span>
              </a>
              
              <a 
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrlEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 p-3.5 rounded-xl border-2 border-slate-100 hover:border-[#0077b5] hover:bg-[#0077b5]/5 transition-all text-slate-700 hover:text-[#0077b5] font-semibold group"
              >
                <Linkedin className="w-5 h-5 text-[#0077b5] group-hover:scale-110 transition-transform" />
                <span>Share on LinkedIn</span>
              </a>
              
              <button 
                onClick={copyLink}
                className="flex items-center justify-center gap-3 p-3.5 mt-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-700 font-semibold cursor-pointer"
              >
                <Copy className="w-5 h-5 text-slate-500" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
