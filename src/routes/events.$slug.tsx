import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Calendar, Share2, Facebook, Twitter, Linkedin, Copy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const getEventFn = createServerFn({ method: "GET" })
  .validator((slug: unknown) => slug as string)
  .handler(async ({ data: slug }) => {
    const event = await db.event.findUnique({ where: { slug } });
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
  });

export const Route = createFileRoute("/events/$slug")({
  loader: async ({ params }) => {
    const event = await getEventFn({ data: params.slug });
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
  const shareTitle = event.title;
  const shareDesc = event.description.substring(0, 200);
  const shareText = encodeURIComponent(`${shareTitle}\n\n${shareDesc}\n\n`);
  const shareUrlEncoded = encodeURIComponent(shareUrl);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `${shareTitle}\n\n${shareDesc}`,
          url: shareUrl,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      toast.error("Native sharing not supported on this device.");
    }
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
                    {new Date(event.date).toLocaleDateString("en-US", { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })} at {new Date(event.date).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' })}
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

            {event.slug === '2-day-national-workshop-on-the-electricity-act-2023-as-amended' && (
              <div className="mt-10 pt-8 border-t border-slate-100">
                <h3 className="text-xl font-bold text-[#263566] mb-4">Sponsorship Details & Info</h3>
                <p className="text-slate-700 leading-relaxed text-lg mb-8">
                  The Workshop is being organised by Allstates Management Partners Solutions Limited under the auspices of the Office of the Vice President of the Federal Republic of Nigeria, in collaboration with key strategic institutional partners, namely the Federal Ministry of Power, Federal Ministry of Justice, Nigerian Electricity Regulatory Commission (NERC), and the Nigeria Governors' Forum (NGF). This collaboration underscores a shared commitment to supporting the effective implementation of the Electricity Act 2023, strengthening institutional capacity, encouraging public-private collaboration and accelerating the development of competitive, sustainable and investment-ready State electricity markets.
                </p>
                
                <h4 className="text-lg font-semibold text-slate-800 mb-6 text-center">Strategic Institutional Partners</h4>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <img src="/vp-seal.png" alt="Seal of the Vice President of Nigeria" className="w-24 h-24 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg' }} />
                    <span className="text-xs font-semibold text-slate-600 text-center max-w-[120px]">Office of the Vice President</span>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-3">
                    <img src="/fmoj-logo.png" alt="Federal Ministry of Justice" className="w-24 h-24 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/b/bc/Coat_of_arms_of_Nigeria.svg' }} />
                    <span className="text-xs font-semibold text-slate-600 text-center max-w-[120px]">Federal Ministry of Justice</span>
                  </div>
                  {/* Add more as needed */}
                </div>
              </div>
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
              <button 
                onClick={nativeShare}
                className="flex items-center justify-center gap-3 p-3.5 rounded-xl border-2 border-transparent bg-[#109cde] hover:bg-[#0d84bf] transition-all text-white font-semibold shadow-md"
              >
                <Share2 className="w-5 h-5" />
                <span>Share to any App...</span>
              </button>

              <div className="h-px bg-slate-100 my-2"></div>
              
              <a 
                href={`https://api.whatsapp.com/send?text=${shareText}${shareUrlEncoded}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 p-3.5 rounded-xl border-2 border-slate-100 hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all text-slate-700 hover:text-[#25D366] font-semibold group"
              >
                <svg className="w-5 h-5 text-[#25D366] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                <span>Share on WhatsApp</span>
              </a>

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
