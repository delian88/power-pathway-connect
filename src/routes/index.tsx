import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api-client";

function IndexSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <div className="w-full h-screen bg-gray-900 flex items-center justify-center pt-16">
        <div className="w-full max-w-7xl mx-auto px-6 pt-24">
          <Skeleton className="h-10 w-48 mb-6 bg-white/20" />
          <Skeleton className="h-20 w-3/4 mb-6 bg-white/20" />
          <Skeleton className="h-6 w-1/2 mb-10 bg-white/20" />
          <div className="flex gap-4">
            <Skeleton className="h-14 w-40 bg-white/20" />
            <Skeleton className="h-14 w-48 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  loader: async () => await api.getLandingData(),
  pendingComponent: IndexSkeleton,
  component: Index,
});

const TESTIMONIALS = [
  {
    quote: "National Electricity workshop has been an invaluable partner in managing our global events portfolio. Their expertise and strategic approach have saved us countless hours and significantly improved our event ROI.",
    author: "VP of Global Events",
    company: "Fortune 500 Technology Company"
  },
  {
    quote: "The level of service we receive is unmatched. From site selection to on-site management, the team acts as an extension of our own.",
    author: "Director of Meetings",
    company: "National Association"
  },
  {
    quote: "Partnering with National Electricity workshop was the best decision we made for our annual conference. They handled the complexities effortlessly.",
    author: "Chief Marketing Officer",
    company: "Leading Healthcare Provider"
  }
];

function Index() {
  const { settings, events, scheduleItems } = Route.useLoaderData();
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  const heroTexts = [
    settings?.heroText || "Powering the future together",
    settings?.heroSubText || "Premier events and workshops for utility leaders, grid engineers, and energy innovators shaping the national electricity landscape."
  ];

  const [heroBgIndex, setHeroBgIndex] = useState(0);

  let customHeroMedia = [];
  if (settings?.heroSliderImages) {
    try {
      const urls = JSON.parse(settings.heroSliderImages);
      customHeroMedia = urls.map((url: string) => ({ type: 'image', src: url, alt: 'Hero image' }));
    } catch(e) {}
  }

  const heroMedia = customHeroMedia.length > 0 ? customHeroMedia : [
    { type: 'image', src: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=80', alt: 'Illuminated light bulbs representing power and ideas' }, 
    { type: 'image', src: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80', alt: 'Global electricity network and glowing earth' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1920&q=80', alt: 'Event stage with bright lights and crowd' }, 
    { type: 'image', src: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=1920&q=80', alt: 'Abstract glowing lights and data transmission' },
    { type: 'image', src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80', alt: 'Technology circuit board with electric glow' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % 2);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroTexts.length]);

  useEffect(() => {
    const bgInterval = setInterval(() => {
      setHeroBgIndex((prev) => (prev + 1) % heroMedia.length);
    }, 5000);
    return () => clearInterval(bgInterval);
  }, [heroMedia.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [activeDay, setActiveDay] = useState(1);

  useEffect(() => {
    if (!events || events.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % events.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [events?.length]);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#0F1A1C]">
          <AnimatePresence>
            {heroMedia.map((media, idx) => (
              idx === heroBgIndex && (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {media.type === 'video' ? (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover opacity-80"
                      poster="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1920&q=80"
                    >
                      <source src={media.src} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={media.src}
                      alt={media.alt}
                      className="w-full h-full object-cover opacity-80"
                    />
                  )}
                </motion.div>
              )
            ))}
          </AnimatePresence>
          {/* Green/Dark overlay for summit aesthetic */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#008753]/90 via-[#008753]/60 to-[#000000]/70 z-10" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 text-white text-left">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div 
                className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] px-5 py-2 rounded-full font-semibold text-sm mb-6"
                dangerouslySetInnerHTML={{ __html: settings?.heroBadgeText || "<span>👑</span> Africa's Premier Energy Event" }}
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-[70px] font-bold leading-[1.1] text-white font-sans drop-shadow-lg mb-6"
              dangerouslySetInnerHTML={{ __html: settings?.heroText || "Shaping the Future of <br /> <span class=\"text-[#D4AF37]\">African Energy</span>" }}
            />

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/90 leading-relaxed mb-10 max-w-2xl font-poppins"
            >
              {settings?.heroSubText || "Join global energy leaders, policymakers, and innovators at Africa's most influential energy gathering. Drive investment, forge partnerships, and transform the continent's energy landscape."}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link to="/registration">
              <Button size="lg" className="bg-black hover:bg-black/90 text-white rounded px-8 py-7 text-base font-bold transition-all flex items-center gap-2">
                Register Now <span className="text-xl">➔</span>
              </Button>
            </Link>
            <Link to="/sponsorship">
              <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10 text-white border-2 border-white/30 rounded px-8 py-7 text-base font-bold transition-all flex items-center gap-2">
                Become a Sponsor <span className="text-xl">🤝</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Bar */}
      <div className="w-full bg-[#008753] py-4 text-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-around items-center gap-4 text-sm md:text-base font-semibold tracking-wide">
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] text-lg">📅</span> {settings?.infoBarDateText || "Mar 15-18, 2027"}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] text-lg">📍</span> {settings?.infoBarLocationText || "Abuja, Nigeria"}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#D4AF37] text-lg">🎯</span> {settings?.infoBarThemeText || "Sustainable Energy Future"}
          </div>
        </div>
      </div>

      {/* Partner Strip */}
      <div className="w-full bg-white py-10 border-b border-gray-100 overflow-hidden flex flex-col md:flex-row items-center">
        <div className="max-w-7xl mx-auto flex items-center w-full px-6">
          <div className="shrink-0 mr-12 text-sm font-bold text-gray-400 uppercase tracking-widest border-r border-gray-200 pr-8 py-2">
            Key Strategic<br/>Institutional Partners
          </div>
          <motion.div 
            className="flex w-max items-center gap-24 pr-24 opacity-80 hover:opacity-100 transition-opacity"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 25, repeat: Infinity }}
          >
            {(() => {
              const baseLogos = ["/slider-1.png", "/slider-2.png", "/slider-3.png", "/slider-4.png"];
              
              // Duplicate the array to create a seamless loop
              const duplicatedLogos = [...baseLogos, ...baseLogos, ...baseLogos, ...baseLogos];
              return duplicatedLogos.map((logoUrl, i) => (
                <div key={i} className="flex flex-col items-center justify-center w-32 h-20">
                  <img src={logoUrl} alt="Partner Logo" className="max-w-full max-h-full object-contain transition-all duration-300" />
                </div>
              ));
            })()}
          </motion.div>
        </div>
      </div>

      {/* Transformation Hub */}
      <section className="py-24 bg-[#F8F9FA] relative">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Left Content */}
          <div className="pr-4">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-6 leading-tight">
              {settings?.transformationHubTitle ? settings.transformationHubTitle : <>Africa's Energy <span className="text-[#D4AF37]">Transformation <br/> Hub</span></>}
            </h2>
            <motion.div 
              initial={{ scaleX: 0 }} 
              whileInView={{ scaleX: 1 }} 
              transition={{ duration: 0.8 }} 
              className="w-24 h-1.5 bg-[#D4AF37] mb-8 origin-left"
            ></motion.div>
            <p className="text-lg text-gray-600 font-poppins leading-relaxed mb-12">
              {settings?.transformationHubDescription || "As the official energy event of the Federal Government of Nigeria, the Nigeria International Energy Summit (NIES) serves as the continent's premier platform for energy policy, investment, and innovation."}
            </p>
            
            <div className="flex flex-col gap-10">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5 }} 
                className="flex gap-6 items-start"
              >
                <div className="w-14 h-14 rounded-xl bg-[#008753] flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg shadow-[#008753]/20 hover:scale-110 transition-transform">
                  🤝
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#008753] mb-2">{settings?.transformationHubFeature1Title || "High-Level Engagement"}</h4>
                  <p className="text-gray-600">{settings?.transformationHubFeature1Desc || "Direct access to ministers, governors, regulators, and industry CEOs driving Nigeria's electricity agenda."}</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex gap-6 items-start"
              >
                <div className="w-14 h-14 rounded-xl bg-[#008753] flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg shadow-[#008753]/20 hover:scale-110 transition-transform">
                  📈
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#008753] mb-2">{settings?.transformationHubFeature2Title || "Strategic Insights"}</h4>
                  <p className="text-gray-600">{settings?.transformationHubFeature2Desc || "Forward-looking analysis on emerging trends, policies, and investment opportunities."}</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex gap-6 items-start"
              >
                <div className="w-14 h-14 rounded-xl bg-[#008753] flex items-center justify-center text-white text-2xl flex-shrink-0 shadow-lg shadow-[#008753]/20 hover:scale-110 transition-transform">
                  🌐
                </div>
                <div>
                  <h4 className="text-xl font-bold text-[#008753] mb-2">Global Connectivity</h4>
                  <p className="text-gray-600">Connect with international energy leaders and explore cross-border partnerships.</p>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Right Content / Image Stack */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mt-8 lg:mt-0 h-[700px] w-full"
          >
            <div className="absolute inset-0 rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.6 }}
                src="https://images.unsplash.com/photo-1541888081688-66175e18231a?auto=format&fit=crop&w=1200&q=80" 
                alt="Energy Transformation Hub" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Top Right Floating Card */}
            <div className="absolute -top-6 -right-6 md:top-8 md:-right-8 bg-white p-6 md:p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col gap-4 border border-gray-100 max-w-[320px] z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#008753] flex items-center justify-center text-white text-xl flex-shrink-0">
                  🏅
                </div>
                <span className="font-bold text-[#008753] text-lg leading-tight whitespace-pre-line">{settings?.transformationHubFeature3Title || "Official Government\nEvent"}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mt-2">
                {settings?.transformationHubFeature3Desc || "Endorsed by the Federal Government of Nigeria as the principal energy industry gathering."}
              </p>
            </div>
            
            {/* Bottom Left Floating Card */}
            <div className="absolute -bottom-6 -left-6 md:bottom-12 md:-left-12 bg-white p-6 md:p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col gap-4 border border-gray-100 max-w-[320px] z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#008753] flex items-center justify-center text-white text-xl flex-shrink-0">
                  👥
                </div>
                <span className="font-bold text-[#008753] text-lg leading-tight">{settings?.transformationHubFeature4Title || "5,000+ Participants"}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mt-2">
                {settings?.transformationHubFeature4Desc || "Join ministers, governors, CEOs, and experts representing 36 states in Nigeria and FCT."}
              </p>
            </div>
            
          </motion.div>
        </div>
      </section>

      {/* Event Schedule */}
      <section className="py-24 bg-[#FAFAFA] relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-4">
              {settings?.scheduleTitle ? settings.scheduleTitle : <>Event <span className="text-[#D4AF37]">Schedule</span></>}
            </h2>
            <p className="text-gray-600 text-lg font-poppins">
              {settings?.scheduleDescription || "Four days of transformative discussions, networking, and deal-making"}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            {/* Tabs */}
            <div className="flex bg-[#008753] text-white overflow-x-auto">
              {Array.from({ length: settings?.scheduleDaysCount || 4 }).map((_, idx) => {
                const day = idx + 1;
                let dateStr = `Day ${day}`;
                if (settings?.scheduleDates && Array.isArray(settings.scheduleDates) && settings.scheduleDates[idx]) {
                  dateStr = settings.scheduleDates[idx];
                }
                return { day, date: dateStr };
              }).map((tab) => (
                <button
                  key={tab.day}
                  onClick={() => setActiveDay(tab.day)}
                  className={`flex-1 min-w-[100px] py-4 flex flex-col items-center justify-center transition-all ${
                    activeDay === tab.day 
                      ? "bg-[#00A86B] border-b-[5px] border-[#D4AF37]" 
                      : "hover:bg-[#00A86B]/50 border-b-[5px] border-transparent"
                  }`}
                >
                  <span className="font-bold text-lg whitespace-nowrap">Day {tab.day}</span>
                  <span className="text-sm font-semibold opacity-90 whitespace-nowrap">{tab.date}</span>
                </button>
              ))}
            </div>

            {/* Schedule Content */}
            <div className="p-0">
              {/* @ts-ignore */}
              {(() => {
                // @ts-ignore
                const currentItems = (scheduleItems || []).filter((item: any) => item.day === activeDay);
                if (currentItems.length === 0) {
                  return (
                    <div className="p-12 text-center text-gray-500 font-medium bg-gray-50">
                      Schedule items for Day {activeDay} will be announced soon.
                    </div>
                  );
                }
                return currentItems.map((item: any) => (
                  <div key={item.id} className="flex flex-col md:flex-row border-b border-gray-100 p-8 hover:bg-gray-50 transition-colors group">
                    <div className="md:w-48 flex-shrink-0 mb-4 md:mb-0">
                      <span className="text-[#008753] font-bold text-lg tracking-wide">{item.timeRange}</span>
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <h4 className="font-bold text-[17px] text-[#0F1A1C] group-hover:text-[#008753] transition-colors">
                          {item.title}
                        </h4>
                        {item.description && (
                          <div 
                            className="mt-4 prose prose-sm text-gray-600 max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 prose-strong:text-[#0F1A1C]" 
                            dangerouslySetInnerHTML={{ __html: item.description }} 
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-2 md:text-right shrink-0">
                        {item.location && (
                          <div className="flex items-center md:justify-end gap-2 text-gray-400 text-xs font-semibold">
                            <span className="text-[#D4AF37] text-base">📍</span> {item.location}
                          </div>
                        )}
                        {item.speaker && (
                          <div className="flex items-center md:justify-end gap-2 text-gray-400 text-xs font-semibold">
                            <span className="text-[#D4AF37] text-base">👥</span> {item.speaker}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </section>


      {/* Why Attend NIES */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-6">
              {settings?.whyAttendTitle || <>Why Attend <span className="text-[#D4AF37]">NIES 2027?</span></>}
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-poppins">
              {settings?.whyAttendSubtitle || "Discover unparalleled opportunities for strategic growth and industry leadership"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center lg:items-end">
            
            {/* Card 1 - Left */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 opacity-80 hover:opacity-100 transition-all transform scale-95 hover:scale-100 mb-4 lg:mb-0">
              <div className="h-64 overflow-hidden">
                <img src={settings?.whyAttendCard1ImgUrl || "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80"} alt="Networking" className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-500 mb-4 font-sans">{settings?.whyAttendCard1Title || "Strategic Networking"}</h3>
                <p className="text-gray-400 font-poppins leading-relaxed text-sm">
                  {settings?.whyAttendCard1Desc || "Connect with energy ministers, NOC/IOC CEOs, and policymakers in curated sessions designed for high-level engagement."}
                </p>
              </div>
            </div>

            {/* Card 2 - Center (Featured) */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-[#008753]/20 border-t-[6px] border-t-[#008753] relative z-10 transform scale-105">
              <div className="h-72 overflow-hidden">
                <img src={settings?.whyAttendCard2ImgUrl || "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&w=800&q=80"} alt="Industry Insights" className="w-full h-full object-cover" />
              </div>
              <div className="p-10">
                <h3 className="text-[28px] font-bold text-[#0F1A1C] mb-4 font-sans">{settings?.whyAttendCard2Title || "Industry Insights"}</h3>
                <p className="text-gray-600 font-poppins leading-relaxed">
                  {settings?.whyAttendCard2Desc || "Gain exclusive insights into emerging policies, technologies, and market trends shaping the future of African energy."}
                </p>
              </div>
            </div>

            {/* Card 3 - Right */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 opacity-80 hover:opacity-100 transition-all transform scale-95 hover:scale-100 mb-4 lg:mb-0">
              <div className="h-64 overflow-hidden">
                <img src={settings?.whyAttendCard3ImgUrl || "https://images.unsplash.com/photo-1559136555-e46be62a259b?auto=format&fit=crop&w=800&q=80"} alt="Investment Opportunities" className="w-full h-full object-cover" />
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-500 mb-4 font-sans">{settings?.whyAttendCard3Title || "Investment Opportunities"}</h3>
                <p className="text-gray-400 font-poppins leading-relaxed text-sm">
                  {settings?.whyAttendCard3Desc || "Access Africa's most promising energy projects and connect with international investors seeking strategic partnerships."}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Conference Guide */}
      <section className="py-24 bg-[#008753] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-white mb-4">
              {settings?.confGuideTitle || <>Conference <span className="text-[#D4AF37]">Guide</span></>}
            </h2>
            <p className="text-white/90 text-lg font-poppins">
              {settings?.confGuideSubtitle || "Comprehensive programming across multiple specialized tracks"}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Track 2: Technical Sessions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform">
              <div className="p-10 flex flex-col items-center text-center border-b border-gray-100 flex-1">
                <div className="w-16 h-16 rounded-full bg-[#008753] flex items-center justify-center text-white mb-6 shadow-md shadow-[#008753]/30">
                  {/* Gears Icon */}
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49-.12-.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#008753] mb-3">{settings?.confGuideTrack2Title || "Technical Sessions"}</h3>
                <p className="text-gray-400 font-medium">{settings?.confGuideTrack2Subtitle || "Deep-dive technical workshops"}</p>
              </div>
              <div className="p-8 bg-white min-h-[160px]">
                <p className="text-[#D4AF37] font-bold text-[13px] mb-2 tracking-wide uppercase">{settings?.confGuideTrack2Date || ""}</p>
                <h4 className="text-lg font-bold text-[#0F1A1C] mb-3 leading-tight">{settings?.confGuideTrack2EventTitle || ""}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{settings?.confGuideTrack2EventDesc || ""}</p>
              </div>
            </div>

            {/* Track 1: Plenary Sessions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform">
              <div className="p-10 flex flex-col items-center text-center border-b border-gray-100 flex-1">
                <div className="w-16 h-16 rounded-full bg-[#008753] flex items-center justify-center text-white mb-6 shadow-md shadow-[#008753]/30">
                  {/* Mic Icon */}
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5-3c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#008753] mb-3">{settings?.confGuideTrack1Title || "Plenary Sessions"}</h3>
                <p className="text-gray-400 font-medium">{settings?.confGuideTrack1Subtitle || "High-level strategic discussions"}</p>
              </div>
              <div className="p-8 bg-white min-h-[160px]">
                <p className="text-[#D4AF37] font-bold text-[13px] mb-2 tracking-wide uppercase">{settings?.confGuideTrack1Date || "THURSDAY, 8 OCTOBER 2026"}</p>
                <h4 className="text-lg font-bold text-[#0F1A1C] mb-3 leading-tight">{settings?.confGuideTrack1EventTitle || "Theme:"}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{settings?.confGuideTrack1EventDesc || "Developing Practical Roadmaps for State Electricity Market Implementation"}</p>
              </div>
            </div>

            {/* Track 3: Networking Events */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform">
              <div className="p-10 flex flex-col items-center text-center border-b border-gray-100 flex-1">
                <div className="w-16 h-16 rounded-full bg-[#008753] flex items-center justify-center text-white mb-6 shadow-md shadow-[#008753]/30">
                  {/* Star Icon */}
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#008753] mb-3">{settings?.confGuideTrack3Title || "Networking Events"}</h3>
                <p className="text-gray-400 font-medium">{settings?.confGuideTrack3Subtitle || "Strategic social interactions"}</p>
              </div>
              <div className="p-8 bg-white min-h-[160px]">
                <p className="text-[#D4AF37] font-bold text-[13px] mb-2 tracking-wide uppercase">{settings?.confGuideTrack3Date || "Feb 02, 06:00 PM - 07:30 PM"}</p>
                <h4 className="text-lg font-bold text-[#0F1A1C] mb-3 leading-tight">{settings?.confGuideTrack3EventTitle || "Ministers, Governors & Heads of Delegation Reception"}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{settings?.confGuideTrack3EventDesc || "Exclusive"}</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Speakers */}
      <section className="py-24 bg-[#F8F9FA] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold font-sans text-[#0F1A1C] mb-4">
              {settings?.featuredSpeakersTitle || <>Featured <span className="text-[#D4AF37]">Speakers</span></>}
            </h2>
            <p className="text-gray-500 text-lg font-poppins">
              {settings?.featuredSpeakersSubtitle || "Learn from industry pioneers and thought leaders"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {(Array.isArray(settings?.featuredSpeakers) ? settings.featuredSpeakers : []).map((speaker: any, index: number) => (
              <div key={index} className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:-translate-y-1 transition-transform">
                <div className="h-64 bg-[#E2E8F0] w-full relative">
                   {speaker.imgUrl ? (
                     <img src={speaker.imgUrl} alt={speaker.name || "Speaker"} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-slate-200 object-cover" />
                   )}
                </div>
                <div className="p-6 h-[100px] flex items-center">
                  <h3 className="font-bold text-[#008753] text-lg leading-tight">{speaker.name || "Speaker Name"}</h3>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      {events && events.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[#263566] mb-4">Upcoming Events & Workshops</h2>
              <div className="w-16 h-1 bg-[#109cde] rounded-full mx-auto"></div>
            </div>
            <div className="flex overflow-x-auto gap-8 pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {events.map((ev: any) => (
                <div key={ev.id} className="min-w-[300px] md:min-w-[380px] snap-center">
                  <Link to="/events/$slug" params={{ slug: ev.slug }} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow h-full">
                    {ev.imageUrl && (
                      <div className="h-48 overflow-hidden">
                        <img src={ev.imageUrl} alt={ev.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${ev.type === 'conference' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {ev.type === 'conference' ? 'Conference' : 'Workshop'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#263566] mb-2 group-hover:text-[#109cde] transition-colors">{ev.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{new Date(ev.date).toLocaleDateString('en-GB', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      <p className="text-gray-600 line-clamp-3 mb-6 flex-1">{ev.description}</p>
                      <span className="text-[#109cde] font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                        View Details <span aria-hidden="true">&rarr;</span>
                      </span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}


      {/* Our Approach */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#263566] mb-4">{settings?.ourApproachTitle || "Our Approach"}</h2>
            <div className="w-16 h-1 bg-[#109cde] rounded-full mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="relative group overflow-hidden h-[400px] rounded-lg shadow-md cursor-pointer">
              <img 
                src={settings?.ourApproachCard1ImgUrl || "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80"} 
                alt={settings?.ourApproachCard1Title || "Event Strategy"} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#263566]/90 via-[#263566]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-4">
                <h3 className="text-2xl font-bold text-white mb-2">{settings?.ourApproachCard1Title || "Event Strategy"}</h3>
                <div className="w-8 h-1 bg-[#109cde] mb-4 transition-all duration-500 group-hover:w-16"></div>
                <p className="text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 line-clamp-3">
                  {settings?.ourApproachCard1Desc || "Strategic design and planning to ensure your events meet your organizational objectives and deliver measurable ROI."}
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="relative group overflow-hidden h-[400px] rounded-lg shadow-md cursor-pointer">
              <img 
                src={settings?.ourApproachCard2ImgUrl || "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=80"} 
                alt={settings?.ourApproachCard2Title || "Event Logistics"} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#263566]/90 via-[#263566]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-4">
                <h3 className="text-2xl font-bold text-white mb-2">{settings?.ourApproachCard2Title || "Event Logistics"}</h3>
                <div className="w-8 h-1 bg-[#109cde] mb-4 transition-all duration-500 group-hover:w-16"></div>
                <p className="text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 line-clamp-3">
                  {settings?.ourApproachCard2Desc || "Flawless execution from sourcing and contracting to registration, housing, and on-site management."}
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="relative group overflow-hidden h-[400px] rounded-lg shadow-md cursor-pointer">
              <img 
                src={settings?.ourApproachCard3ImgUrl || "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?auto=format&fit=crop&w=800&q=80"} 
                alt={settings?.ourApproachCard3Title || "Event Technology"} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#263566]/90 via-[#263566]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 transform transition-transform duration-500 group-hover:-translate-y-4">
                <h3 className="text-2xl font-bold text-white mb-2">{settings?.ourApproachCard3Title || "Event Technology"}</h3>
                <div className="w-8 h-1 bg-[#109cde] mb-4 transition-all duration-500 group-hover:w-16"></div>
                <p className="text-white/80 opacity-0 transition-opacity duration-500 group-hover:opacity-100 line-clamp-3">
                  {settings?.ourApproachCard3Desc || "Innovative technological solutions that enhance the attendee experience and streamline event management processes."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form CTA */}
      <section className="relative py-28 bg-[#263566] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1573165067006-259166f21226?auto=format&fit=crop&w=1920&q=80" 
            alt="Perfect Partnership" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Need More Information?</h2>
          <p className="text-xl text-white/80 mb-10 font-light">
            Contact us today to discover how we can help you achieve your event goals.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-[#109cde] hover:bg-white hover:text-[#263566] text-white rounded-md px-10 py-7 text-lg font-bold transition-colors shadow-lg">
              Services Inquiry Form
            </Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

